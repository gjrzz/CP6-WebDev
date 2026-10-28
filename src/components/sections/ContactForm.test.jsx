import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ContactForm from '@/components/sections/ContactForm';
import { saveMessage } from '@/services/messages';
import { notifyOwner } from '@/services/email';
import { CONTACT } from '@/lib/content';

vi.mock('@/services/messages', () => ({ saveMessage: vi.fn(), preloadMessages: vi.fn() }));
vi.mock('@/services/email', () => ({ notifyOwner: vi.fn(), preloadEmail: vi.fn() }));

function renderForm() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ContactForm />
    </QueryClientProvider>,
  );
}

const field = (name) => screen.getByLabelText(name);
const submit = () => screen.getByRole('button', { name: /enviar/i });

async function fillValid() {
  await userEvent.type(field('Nome'), 'Ana');
  await userEvent.type(field('E-mail'), 'ana@exemplo.com');
  await userEvent.type(field('Mensagem'), 'Quero conversar sobre um projeto novo.');
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.mocked(saveMessage).mockReset().mockResolvedValue();
    vi.mocked(notifyOwner).mockReset().mockResolvedValue();
  });

  it('mostra o erro de cada campo ao enviar vazio, ligado ao campo', async () => {
    renderForm();
    await userEvent.click(submit());

    expect(
      await screen.findByText('o nome precisa ter no mínimo 2 caracteres'),
    ).toBeInTheDocument();
    expect(field('E-mail')).toHaveAccessibleDescription('e-mail inválido');
    expect(field('Mensagem')).toHaveAccessibleDescription(
      'a mensagem precisa ter no mínimo 20 caracteres',
    );
    expect(field('Nome')).toHaveAttribute('aria-invalid', 'true');
    expect(saveMessage).not.toHaveBeenCalled();
  });

  it('mostra "e-mail inválido" para um e-mail mal formado', async () => {
    renderForm();
    await fillValid();
    await userEvent.clear(field('E-mail'));
    await userEvent.type(field('E-mail'), 'ana@');
    await userEvent.click(submit());

    expect(await screen.findByText('e-mail inválido')).toBeInTheDocument();
  });

  it('bloqueia o botão enquanto envia', async () => {
    vi.mocked(saveMessage).mockReturnValue(new Promise(() => {}));
    vi.mocked(notifyOwner).mockReturnValue(new Promise(() => {}));
    renderForm();
    await fillValid();
    await userEvent.click(submit());

    const button = await screen.findByRole('button', { name: /enviando/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('mostra sucesso e limpa o formulário', async () => {
    renderForm();
    await fillValid();
    await userEvent.click(submit());

    expect(await screen.findByRole('status')).toHaveTextContent(CONTACT.success);
    await waitFor(() => expect(field('Nome')).toHaveValue(''));
    expect(field('Mensagem')).toHaveValue('');
  });

  it('mostra o erro quando o envio falha, mantendo o que foi digitado', async () => {
    vi.mocked(saveMessage).mockRejectedValue(new Error('supabase fora'));
    vi.mocked(notifyOwner).mockRejectedValue(new Error('emailjs fora'));
    renderForm();
    await fillValid();
    await userEvent.click(submit());

    expect(await screen.findByRole('alert')).toHaveTextContent(CONTACT.error);
    expect(field('Nome')).toHaveValue('Ana');
  });
});
