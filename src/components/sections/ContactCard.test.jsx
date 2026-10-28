import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LazyMotion, domAnimation } from 'motion/react';
import ContactCard from '@/components/sections/ContactCard';
import { preloadContactServices } from '@/hooks/useSendMessage';

vi.mock('@/hooks/useSendMessage', async (importOriginal) => ({
  ...(await importOriginal()),
  preloadContactServices: vi.fn(),
}));

function renderCard() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <LazyMotion features={domAnimation} strict>
        <ContactCard />
      </LazyMotion>
    </QueryClientProvider>,
  );
}

const front = () => screen.getByRole('button', { name: /abrir formulário de contato/i });

describe('ContactCard', () => {
  beforeEach(() => vi.mocked(preloadContactServices).mockClear());

  it('antes de qualquer interação, o formulário nem é carregado', () => {
    renderCard();
    expect(front()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('Nome')).not.toBeInTheDocument();
    expect(preloadContactServices).not.toHaveBeenCalled();
  });

  it('ao passar o mouse, pré-carrega o formulário escondido e fora do foco', async () => {
    renderCard();
    await userEvent.hover(front());

    expect(preloadContactServices).toHaveBeenCalledTimes(1);
    const name = await screen.findByLabelText('Nome');
    expect(name.closest('[inert]')).not.toBeNull();
  });

  it('ao virar, leva o foco ao primeiro campo', async () => {
    renderCard();
    await userEvent.click(front());

    expect(front()).toHaveAttribute('aria-expanded', 'true');
    const name = await screen.findByLabelText('Nome');
    expect(name.closest('[inert]')).toBeNull();
    await waitFor(() => expect(name).toHaveFocus());
  });
});
