import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProjectsSection from '@/components/sections/ProjectsSection';
import { fetchRepos, RateLimitError } from '@/services/github';
import { formatTime } from '@/lib/formatDate';

vi.mock('@/services/github', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchRepos: vi.fn(),
}));

const project = {
  name: 'meu-app',
  description: 'Gerenciador de tarefas',
  language: 'JavaScript',
  updatedAt: '2026-10-12T15:00:00Z',
};

function saveCache(savedAt) {
  localStorage.setItem('github-repos', JSON.stringify({ repos: [project], savedAt }));
}

function renderSection() {
  // Mesmo staleTime do App; retryDelay 0 para o retry do hook não atrasar o teste
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 10, retryDelay: 0 } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ProjectsSection />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ProjectsSection', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(fetchRepos).mockReset();
  });

  it('mostra os cards quando a API responde', async () => {
    vi.mocked(fetchRepos).mockResolvedValue([project]);
    renderSection();
    expect(await screen.findByRole('link', { name: 'meu-app' })).toBeInTheDocument();
  });

  it('mostra o estado de erro com "tentar de novo" quando o service falha', async () => {
    vi.mocked(fetchRepos).mockRejectedValue(new Error('falhou'));
    renderSection();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os projetos',
    );

    vi.mocked(fetchRepos).mockResolvedValue([project]);
    await userEvent.click(screen.getByRole('button', { name: /tentar de novo/i }));
    expect(await screen.findByRole('link', { name: 'meu-app' })).toBeInTheDocument();
  });

  it('mostra a mensagem de limite com o horário de reset', async () => {
    const resetAt = new Date('2026-10-28T17:32:00Z');
    vi.mocked(fetchRepos).mockRejectedValue(new RateLimitError(resetAt));
    renderSection();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('O GitHub limitou as requisições');
    expect(alert).toHaveTextContent(`Tente de novo às ${formatTime(resetAt)}.`);
    expect(fetchRepos).toHaveBeenCalledTimes(1);
  });

  it('mostra a lista vazia quando não há repositórios', async () => {
    vi.mocked(fetchRepos).mockResolvedValue([]);
    renderSection();
    expect(await screen.findByText('Nenhum projeto público por aqui ainda.')).toBeInTheDocument();
  });

  it('usa o cache salvo sem chamar a API quando ele tem menos de 10 min', () => {
    saveCache(Date.now() - 1000 * 60);
    renderSection();
    expect(screen.getByRole('link', { name: 'meu-app' })).toBeInTheDocument();
    expect(fetchRepos).not.toHaveBeenCalled();
  });

  it('mostra os cards salvos com um aviso quando o limite é atingido', async () => {
    saveCache(Date.now() - 1000 * 60 * 60);
    vi.mocked(fetchRepos).mockRejectedValue(new RateLimitError(null));
    renderSection();

    expect(await screen.findByRole('status')).toHaveTextContent('Mostrando a última lista salva');
    expect(screen.getByRole('link', { name: 'meu-app' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('salva no cache a lista que veio da API', async () => {
    vi.mocked(fetchRepos).mockResolvedValue([project]);
    renderSection();
    await screen.findByRole('link', { name: 'meu-app' });

    const cache = JSON.parse(localStorage.getItem('github-repos'));
    expect(cache.repos).toEqual([project]);
  });
});
