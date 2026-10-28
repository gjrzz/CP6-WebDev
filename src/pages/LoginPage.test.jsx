import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routes } from '@/app/router';
import ThemeProvider from '@/contexts/ThemeProvider';
import { getSession, InvalidCredentialsError, onAuthChange, signIn } from '@/services/auth';

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

async function fillAndSubmit(email, password) {
  await userEvent.type(await screen.findByLabelText('E-mail'), email);
  await userEvent.type(screen.getByLabelText('Senha'), password);
  await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.mocked(getSession).mockResolvedValue(null);
    vi.mocked(onAuthChange).mockImplementation(async (callback) => {
      notifyAuth = callback;
      return () => {};
    });
    vi.mocked(signIn).mockReset();
  });

  it('mostra o erro de cada campo ao enviar vazio', async () => {
    renderAt('/login');
    await userEvent.click(await screen.findByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('e-mail inválido')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toHaveAccessibleDescription('informe a senha');
    expect(signIn).not.toHaveBeenCalled();
  });

  it('avisa quando o e-mail ou a senha estão errados', async () => {
    vi.mocked(signIn).mockRejectedValue(new InvalidCredentialsError());
    renderAt('/login');
    await fillAndSubmit('dono@exemplo.com', 'errada');

    expect(await screen.findByRole('alert')).toHaveTextContent('e-mail ou senha incorretos');
  });

  it('depois de entrar, volta para a página que tentou acessar', async () => {
    vi.mocked(signIn).mockImplementation(async () => {
      notifyAuth(session);
      return session;
    });
    const router = renderAt('/dashboard');
    await fillAndSubmit('dono@exemplo.com', 'certa');

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/dashboard');
    // O TanStack Query passa o contexto da mutation como 2º argumento; importa só o 1º
    expect(vi.mocked(signIn).mock.calls[0][0]).toEqual({
      email: 'dono@exemplo.com',
      password: 'certa',
    });
  });
});
