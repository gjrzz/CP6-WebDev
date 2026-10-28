import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorState from '@/components/ui/ErrorState';

describe('ErrorState', () => {
  it('chama onRetry ao clicar em "tentar de novo"', async () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Falha ao carregar" onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: /tentar de novo/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('não mostra o botão sem onRetry', () => {
    render(<ErrorState message="Falha ao carregar" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Falha ao carregar');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
