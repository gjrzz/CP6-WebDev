import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FeaturedPanel from '@/components/dashboard/FeaturedPanel';
import { fetchRepos } from '@/services/github';
import { addFeatured, fetchFeatured, removeFeatured } from '@/services/featured';

vi.mock('@/services/github', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchRepos: vi.fn(),
}));
vi.mock('@/services/featured', () => ({
  fetchFeatured: vi.fn(),
  addFeatured: vi.fn(),
  removeFeatured: vi.fn(),
}));

const repos = ['alfa', 'beta', 'gama'].map((name) => ({ name, description: `Sobre ${name}` }));

function renderPanel() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <FeaturedPanel />
    </QueryClientProvider>,
  );
}

const row = (name) => screen.getByRole('heading', { name }).closest('li');
const rowNames = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);

describe('FeaturedPanel', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(fetchRepos).mockResolvedValue(repos);
    vi.mocked(fetchFeatured).mockReset().mockResolvedValue(['gama']);
    vi.mocked(addFeatured).mockReset().mockResolvedValue();
    vi.mocked(removeFeatured).mockReset().mockResolvedValue();
  });

  it('mostra os destacados primeiro com a posição, sem inventar os 3 recentes', async () => {
    renderPanel();
    await screen.findByRole('heading', { name: 'gama' });

    expect(rowNames()).toEqual(['gama', 'alfa', 'beta']);
    expect(within(row('gama')).getByLabelText('destaque número 1')).toBeInTheDocument();
    expect(within(row('alfa')).queryByText(/^#/)).not.toBeInTheDocument();
  });

  it('destacar entra no fim da fila na hora e chama o service', async () => {
    vi.mocked(addFeatured).mockReturnValue(new Promise(() => {}));
    renderPanel();
    await screen.findByRole('heading', { name: 'gama' });

    await userEvent.click(within(row('beta')).getByRole('button', { name: 'destacar' }));

    expect(within(row('beta')).getByLabelText('destaque número 2')).toBeInTheDocument();
    expect(rowNames()).toEqual(['gama', 'beta', 'alfa']);
    expect(addFeatured).toHaveBeenCalledWith('beta');
  });

  it('tirar do destaque chama o service', async () => {
    renderPanel();
    await screen.findByRole('heading', { name: 'gama' });

    await userEvent.click(within(row('gama')).getByRole('button', { name: 'tirar do destaque' }));
    expect(removeFeatured).toHaveBeenCalledWith('gama');
  });

  it('se salvar falhar, a lista volta ao anterior e avisa', async () => {
    vi.mocked(addFeatured).mockRejectedValue(new Error('falhou'));
    renderPanel();
    await screen.findByRole('heading', { name: 'gama' });

    await userEvent.click(within(row('alfa')).getByRole('button', { name: 'destacar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível salvar');
    await waitFor(() =>
      expect(within(row('alfa')).getByRole('button', { name: 'destacar' })).toBeInTheDocument(),
    );
  });

  it('mostra erro com "tentar de novo" quando os destaques não carregam', async () => {
    vi.mocked(fetchFeatured).mockRejectedValueOnce(new Error('fora'));
    renderPanel();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os destaques',
    );
    await userEvent.click(screen.getByRole('button', { name: /tentar de novo/i }));
    expect(await screen.findByRole('heading', { name: 'gama' })).toBeInTheDocument();
  });
});
