import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LazyMotion, domAnimation } from 'motion/react';
import ProjectsNotebook from '@/components/sections/ProjectsNotebook';
import { GITHUB_REPOS_KEY } from '@/hooks/useGithubRepos';
import { fetchRepos, RateLimitError } from '@/services/github';
import { fetchFeatured } from '@/services/featured';
import { formatTime } from '@/lib/formatDate';

vi.mock('@/services/github', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchRepos: vi.fn(),
}));

vi.mock('@/services/featured', () => ({ fetchFeatured: vi.fn() }));

function makeProject(name) {
  return {
    name,
    description: `Descrição de ${name}`,
    language: 'JavaScript',
    updatedAt: '2026-10-12T15:00:00Z',
  };
}

const projects = ['alfa', 'beta', 'gama', 'delta', 'epsilon'].map(makeProject);

// Desktop ou celular por teste; reduced motion ligado para as trocas serem instantâneas
let desktop = true;
function stubMedia() {
  vi.stubGlobal('matchMedia', (query) => ({
    matches: query.includes('reduced-motion') || (query.includes('min-width') && desktop),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }));
}

function renderNotebook() {
  // Mesmo staleTime do App; retryDelay 0 para o retry do hook não atrasar o teste
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 10, retryDelay: 0 } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={domAnimation} strict>
        <MemoryRouter>
          <ProjectsNotebook />
        </MemoryRouter>
      </LazyMotion>
    </QueryClientProvider>,
  );
  return queryClient;
}

const coverButton = () => screen.getByRole('button', { name: /abrir caderno de projetos/i });

beforeEach(() => {
  localStorage.clear();
  vi.mocked(fetchRepos).mockReset();
  // Sem destaques escolhidos: a home usa os 3 mais recentes
  vi.mocked(fetchFeatured).mockReset().mockResolvedValue([]);
  desktop = true;
  stubMedia();
});

afterEach(() => vi.unstubAllGlobals());

describe('ProjectsNotebook no desktop', () => {
  it('busca os projetos na montagem e abre sem skeleton', async () => {
    vi.mocked(fetchRepos).mockResolvedValue(projects);
    const queryClient = renderNotebook();

    // A busca acontece com a capa ainda fechada
    expect(coverButton()).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(fetchRepos).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(queryClient.getQueryState(GITHUB_REPOS_KEY).status).toBe('success'));

    await userEvent.click(coverButton());

    const notebook = await screen.findByRole('region', { name: 'Caderno de projetos aberto' });
    expect(within(notebook).queryByText('Carregando projetos…')).not.toBeInTheDocument();
    expect(within(notebook).getByRole('link', { name: 'alfa' })).toBeInTheDocument();
    expect(fetchRepos).toHaveBeenCalledTimes(1);
  });

  it('mostra os destaques primeiro e pagina com as setas do teclado', async () => {
    vi.mocked(fetchRepos).mockResolvedValue(projects);
    renderNotebook();
    await userEvent.click(coverButton());

    const notebook = await screen.findByRole('region', { name: 'Caderno de projetos aberto' });
    expect(within(notebook).getAllByText('destaque')).toHaveLength(3);
    expect(within(notebook).getByText('1 / 2')).toBeInTheDocument();
    expect(within(notebook).queryByRole('link', { name: 'epsilon' })).not.toBeInTheDocument();

    await userEvent.keyboard('{ArrowRight}');

    expect(await within(notebook).findByRole('link', { name: 'epsilon' })).toBeInTheDocument();
    expect(within(notebook).getByText('2 / 2')).toBeInTheDocument();
  });

  it('ao fechar, devolve o foco para a capa', async () => {
    vi.mocked(fetchRepos).mockResolvedValue(projects);
    renderNotebook();
    await userEvent.click(coverButton());

    await userEvent.click(await screen.findByRole('button', { name: 'fechar caderno' }));

    await waitFor(() => expect(coverButton()).toHaveFocus());
  });

  it('escreve o erro na página do caderno, com "tentar de novo"', async () => {
    vi.mocked(fetchRepos).mockRejectedValue(new Error('falhou'));
    renderNotebook();
    await userEvent.click(coverButton());

    const notebook = await screen.findByRole('region', { name: 'Caderno de projetos aberto' });
    expect(await within(notebook).findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os projetos',
    );

    vi.mocked(fetchRepos).mockResolvedValue(projects);
    await userEvent.click(within(notebook).getByRole('button', { name: /tentar de novo/i }));
    expect(await within(notebook).findByRole('link', { name: 'alfa' })).toBeInTheDocument();
  });
});

describe('ProjectsNotebook abaixo de 1024px', () => {
  beforeEach(() => {
    desktop = false;
  });

  it('mostra a lista direto, sem capa, com os destaques primeiro', async () => {
    vi.mocked(fetchRepos).mockResolvedValue(projects);
    renderNotebook();

    const links = await screen.findAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual([
      'alfa',
      'beta',
      'gama',
      'delta',
      'epsilon',
    ]);
    expect(screen.getAllByText('destaque')).toHaveLength(3);
    expect(screen.queryByRole('button', { name: /abrir caderno/i })).not.toBeInTheDocument();
  });

  it('mostra o estado de erro com "tentar de novo" quando o service falha', async () => {
    vi.mocked(fetchRepos).mockRejectedValue(new Error('falhou'));
    renderNotebook();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os projetos',
    );

    vi.mocked(fetchRepos).mockResolvedValue(projects);
    await userEvent.click(screen.getByRole('button', { name: /tentar de novo/i }));
    expect(await screen.findByRole('link', { name: 'alfa' })).toBeInTheDocument();
  });

  it('mostra a mensagem de limite com o horário de reset', async () => {
    const resetAt = new Date('2026-10-28T17:32:00Z');
    vi.mocked(fetchRepos).mockRejectedValue(new RateLimitError(resetAt));
    renderNotebook();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('O GitHub limitou as requisições');
    expect(alert).toHaveTextContent(`Tente de novo às ${formatTime(resetAt)}.`);
    expect(fetchRepos).toHaveBeenCalledTimes(1);
  });

  it('mostra a lista vazia quando não há repositórios', async () => {
    vi.mocked(fetchRepos).mockResolvedValue([]);
    renderNotebook();
    expect(await screen.findByText('Nenhum projeto público por aqui ainda.')).toBeInTheDocument();
  });

  it('usa o cache salvo sem chamar a API quando ele tem menos de 10 min', () => {
    const savedAt = Date.now() - 1000 * 60;
    localStorage.setItem('github-repos', JSON.stringify({ repos: projects, savedAt }));
    localStorage.setItem('github-featured', JSON.stringify({ names: ['delta'], savedAt }));
    renderNotebook();

    // Na hora, já na ordem dos destaques salvos
    expect(screen.getAllByRole('link')[0]).toHaveTextContent('delta');
    expect(fetchRepos).not.toHaveBeenCalled();
    expect(fetchFeatured).not.toHaveBeenCalled();
  });

  it('coloca os destaques do dashboard primeiro, na ordem escolhida', async () => {
    vi.mocked(fetchRepos).mockResolvedValue(projects);
    vi.mocked(fetchFeatured).mockResolvedValue(['epsilon', 'beta']);
    renderNotebook();

    await screen.findByRole('link', { name: 'epsilon' });
    const links = screen.getAllByRole('link').map((link) => link.textContent);
    expect(links).toEqual(['epsilon', 'beta', 'alfa', 'gama', 'delta']);
    expect(screen.getAllByText('destaque')).toHaveLength(2);
  });

  it('se os destaques falharem, usa os 3 mais recentes', async () => {
    vi.mocked(fetchRepos).mockResolvedValue(projects);
    vi.mocked(fetchFeatured).mockRejectedValue(new Error('supabase fora'));
    renderNotebook();

    await screen.findByRole('link', { name: 'alfa' });
    await waitFor(() => expect(screen.getAllByText('destaque')).toHaveLength(3));
    expect(screen.getAllByRole('link')[0]).toHaveTextContent('alfa');
  });

  it('mostra os cards salvos com um aviso quando o limite é atingido', async () => {
    localStorage.setItem(
      'github-repos',
      JSON.stringify({ repos: projects, savedAt: Date.now() - 1000 * 60 * 60 }),
    );
    vi.mocked(fetchRepos).mockRejectedValue(new RateLimitError(null));
    renderNotebook();

    expect(await screen.findByRole('status')).toHaveTextContent('Mostrando a última lista salva');
    expect(screen.getByRole('link', { name: 'alfa' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('salva no cache a lista que veio da API', async () => {
    vi.mocked(fetchRepos).mockResolvedValue(projects);
    renderNotebook();
    await screen.findByRole('link', { name: 'alfa' });

    expect(JSON.parse(localStorage.getItem('github-repos')).repos).toEqual(projects);
  });
});
