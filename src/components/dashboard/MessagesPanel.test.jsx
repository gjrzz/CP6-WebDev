import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MessagesPanel from '@/components/dashboard/MessagesPanel';
import { listMessages, setAnswered } from '@/services/messages';

vi.mock('@/services/messages', () => ({ listMessages: vi.fn(), setAnswered: vi.fn() }));

const messages = [
  {
    id: 'a',
    name: 'Ana',
    email: 'ana@exemplo.com',
    message: 'Quero conversar sobre um projeto novo de automação.',
    answered: false,
    createdAt: '2026-10-28T17:32:00Z',
  },
  {
    id: 'b',
    name: 'Bruno',
    email: 'bruno@exemplo.com',
    message: 'Obrigado pela resposta, vamos marcar uma conversa.',
    answered: true,
    createdAt: '2026-10-27T12:00:00Z',
  },
];

function renderPanel(path = '/dashboard') {
  const router = createMemoryRouter([{ path: '/dashboard', element: <MessagesPanel /> }], {
    initialEntries: [path],
  });
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}

const item = (name) => screen.getByRole('heading', { name }).closest('li');

describe('MessagesPanel', () => {
  beforeEach(() => {
    vi.mocked(listMessages).mockReset().mockResolvedValue(messages);
    vi.mocked(setAnswered).mockReset().mockResolvedValue();
  });

  it('lista as mensagens com e-mail para responder, data e status', async () => {
    renderPanel();

    const ana = (await screen.findByRole('heading', { name: 'Ana' })).closest('li');
    expect(within(ana).getByRole('link', { name: 'ana@exemplo.com' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:ana@exemplo\.com\?subject=/),
    );
    expect(within(ana).getByText('pendente')).toBeInTheDocument();
    expect(within(ana).getByText(/28\/10\/2026/)).toBeInTheDocument();
    expect(within(item('Bruno')).getByText('respondida')).toBeInTheDocument();
  });

  it('filtra as pendentes, mostra a contagem e guarda o filtro na URL', async () => {
    const router = renderPanel();
    await screen.findByRole('heading', { name: 'Ana' });

    await userEvent.click(screen.getByRole('button', { name: 'Pendentes (1)' }));

    expect(screen.getByRole('button', { name: 'Pendentes (1)' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.queryByRole('heading', { name: 'Bruno' })).not.toBeInTheDocument();
    expect(router.state.location.search).toBe('?filtro=pendentes');
  });

  it('com ?filtro= desconhecido, mostra todas', async () => {
    renderPanel('/dashboard?filtro=qualquer-coisa');

    expect(await screen.findByRole('heading', { name: 'Ana' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Bruno' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Todas (2)' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('marca como respondida na hora e chama o service', async () => {
    vi.mocked(setAnswered).mockReturnValue(new Promise(() => {}));
    renderPanel();
    await screen.findByRole('heading', { name: 'Ana' });

    await userEvent.click(
      within(item('Ana')).getByRole('button', { name: 'marcar como respondida' }),
    );

    expect(within(item('Ana')).getByText('respondida')).toBeInTheDocument();
    expect(
      within(item('Ana')).getByRole('button', { name: /marcar como pendente/ }),
    ).toBeDisabled();
    expect(setAnswered).toHaveBeenCalledWith('a', true);
  });

  it('se o service falhar, o status volta ao anterior e avisa', async () => {
    vi.mocked(setAnswered).mockRejectedValue(new Error('falhou'));
    renderPanel();
    await screen.findByRole('heading', { name: 'Ana' });

    await userEvent.click(
      within(item('Ana')).getByRole('button', { name: 'marcar como respondida' }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível atualizar');
    await waitFor(() => expect(within(item('Ana')).getByText('pendente')).toBeInTheDocument());
  });

  it('mostra erro com "tentar de novo" e vazio por filtro', async () => {
    vi.mocked(listMessages).mockRejectedValueOnce(new Error('fora do ar'));
    renderPanel('/dashboard?filtro=respondidas');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar as mensagens',
    );

    vi.mocked(listMessages).mockResolvedValue([messages[0]]);
    await userEvent.click(screen.getByRole('button', { name: /tentar de novo/i }));
    expect(await screen.findByText('Nenhuma mensagem respondida.')).toBeInTheDocument();
  });
});
