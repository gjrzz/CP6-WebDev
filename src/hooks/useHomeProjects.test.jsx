import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FEATURED_WAIT_MS, useHomeProjects } from '@/hooks/useHomeProjects';
import { fetchRepos } from '@/services/github';
import { fetchFeatured } from '@/services/featured';

vi.mock('@/services/github', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchRepos: vi.fn(),
}));
vi.mock('@/services/featured', () => ({ fetchFeatured: vi.fn() }));

const repos = ['a', 'b', 'c', 'd'].map((name) => ({ name }));
const names = (result) => result.current.data?.map((project) => project.name);

function renderHomeProjects() {
  // Mesmo staleTime do App: cache com menos de 10 min não dispara busca
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 1000 * 60 * 10 } },
  });
  return renderHook(() => useHomeProjects(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

describe('useHomeProjects', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(fetchRepos).mockResolvedValue(repos);
  });

  it('sem cache, não espera os destaques mais que 1,5 s e reordena quando chegam', async () => {
    let resolveFeatured;
    vi.mocked(fetchFeatured).mockReturnValue(new Promise((resolve) => (resolveFeatured = resolve)));
    const started = Date.now();
    const { result } = renderHomeProjects();

    // Repositórios prontos, destaques pendentes: ainda carregando
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.isPending).toBe(true);

    // Passado o limite, libera na ordem padrão
    await waitFor(() => expect(result.current.isPending).toBe(false), {
      timeout: FEATURED_WAIT_MS + 1000,
    });
    expect(Date.now() - started).toBeGreaterThanOrEqual(FEATURED_WAIT_MS - 50);
    expect(names(result)).toEqual(['a', 'b', 'c', 'd']);

    // Os destaques chegam depois e a lista reordena
    resolveFeatured(['d']);
    await waitFor(() => expect(names(result)).toEqual(['d', 'a', 'b', 'c']));
  });

  it('com destaques em cache, não espera nada', async () => {
    localStorage.setItem('github-featured', JSON.stringify({ names: ['c'], savedAt: Date.now() }));
    const { result } = renderHomeProjects();

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(names(result)).toEqual(['c', 'a', 'b', 'd']);
    expect(fetchFeatured).not.toHaveBeenCalled();
  });
});
