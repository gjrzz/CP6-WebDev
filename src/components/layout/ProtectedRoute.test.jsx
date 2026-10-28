import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routes } from '@/app/router';
import ThemeProvider from '@/contexts/ThemeProvider';
import { getSession, onAuthChange, signOut } from '@/services/auth';

vi.mock('@/services/auth', async (importOriginal) => ({
  ...(await importOriginal()),
  getSession: vi.fn(),
  onAuthChange: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

const session = { user: { email: 'dono@exemplo.com' } };
let notifyAuth;

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>,
  );
  return router;
}

describe('Rota protegida do dashboard', () => {
  beforeEach(() => {
    vi.mocked(onAuthChange).mockImplementation(async (callback) => {
      notifyAuth = callback;
      return () => {};
    });
  });

  it('sem login, redireciona /dashboard para /login', async () => {
    vi.mocked(getSession).mockResolvedValue(null);
    const router = renderAt('/dashboard');

    expect(await screen.findByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(screen.queryByRole('heading', { name: 'Dashboard' })).not.toBeInTheDocument();
  });

  it('com sessão, mostra o dashboard', async () => {
    vi.mocked(getSession).mockResolvedValue(session);
    renderAt('/dashboard');

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText('dono@exemplo.com')).toBeInTheDocument();
  });

  it('enquanto verifica a sessão, mostra o carregamento e não redireciona', async () => {
    vi.mocked(getSession).mockReturnValue(new Promise(() => {}));
    const router = renderAt('/dashboard');

    expect(await screen.findByRole('status', { name: 'Verificando acesso' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/dashboard');
  });

  it('marca login e dashboard como noindex', async () => {
    vi.mocked(getSession).mockResolvedValue(null);
    renderAt('/login');

    await screen.findByRole('heading', { name: 'Entrar' });
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex',
    );
  });

  it('ao sair, volta para o login', async () => {
    vi.mocked(getSession).mockResolvedValue(session);
    vi.mocked(signOut).mockImplementation(async () => notifyAuth(null));
    const router = renderAt('/dashboard');

    await userEvent.click(await screen.findByRole('button', { name: 'Sair' }));

    expect(await screen.findByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
  });
});
