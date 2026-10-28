import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routes } from '@/app/router';
import ThemeProvider from '@/contexts/ThemeProvider';
import { GITHUB_REPOS_KEY } from '@/hooks/useGithubRepos';
import { fetchRepo, RepoNotFoundError } from '@/services/github';

vi.mock('@/services/github', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchRepo: vi.fn(),
  fetchRepos: vi.fn().mockResolvedValue([]),
}));

const project = {
  name: 'CP6-WebDev',
  description: 'Portfólio em React',
  language: 'JavaScript',
  updatedAt: '2026-10-12T15:00:00Z',
  htmlUrl: 'https://github.com/gjrzz/CP6-WebDev',
  homepage: 'https://cp6-webdev.vercel.app',
  topics: ['react', 'vite'],
  stars: 3,
};

function renderAt(path, { cachedList } = {}) {
  // Mesmo staleTime do App; retryDelay 0 para o retry do hook não atrasar o teste
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 10, retryDelay: 0 } },
  });
  if (cachedList) queryClient.setQueryData(GITHUB_REPOS_KEY, cachedList);

  render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('ProjectPage', () => {
  beforeEach(() => {
    localStorage.clear();
    document.title = 'Gabriel Juarez';
    vi.mocked(fetchRepo).mockReset();
  });

  it('mostra a página 404 para um repositório inexistente', async () => {
    vi.mocked(fetchRepo).mockRejectedValue(new RepoNotFoundError('inexistente'));
    renderAt('/projetos/inexistente');

    expect(
      await screen.findByRole('heading', { name: /essa página não existe/i }),
    ).toBeInTheDocument();
    expect(fetchRepo).toHaveBeenCalledTimes(1);
  });

  it('usa a listagem em cache sem chamar a API, ignorando maiúsculas no slug', () => {
    renderAt('/projetos/cp6-webdev', { cachedList: [project] });

    expect(screen.getByRole('heading', { name: 'CP6-WebDev' })).toBeInTheDocument();
    expect(screen.getByText('Portfólio em React')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver no GitHub' })).toHaveAttribute(
      'href',
      project.htmlUrl,
    );
    expect(screen.getByRole('link', { name: 'Ver online' })).toHaveAttribute(
      'href',
      project.homepage,
    );
    expect(screen.getByRole('list', { name: 'Tópicos' })).toHaveTextContent('react');
    expect(fetchRepo).not.toHaveBeenCalled();
  });

  it('busca o repositório na API quando ele não está em cache', async () => {
    vi.mocked(fetchRepo).mockResolvedValue({ ...project, homepage: null });
    renderAt('/projetos/CP6-WebDev');

    expect(await screen.findByRole('heading', { name: 'CP6-WebDev' })).toBeInTheDocument();
    expect(fetchRepo).toHaveBeenCalledWith('cp6-webdev');
    expect(screen.queryByRole('link', { name: 'Ver online' })).not.toBeInTheDocument();
  });

  it('mostra o estado de erro com "tentar de novo" quando a API falha', async () => {
    vi.mocked(fetchRepo).mockRejectedValue(new Error('falhou'));
    renderAt('/projetos/meu-app');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar o projeto',
    );
    expect(screen.getByRole('button', { name: /tentar de novo/i })).toBeInTheDocument();
  });

  it('define o título da aba com o nome do projeto', () => {
    renderAt('/projetos/cp6-webdev', { cachedList: [project] });
    expect(document.title).toBe('CP6-WebDev · Gabriel Juarez');
  });
});
