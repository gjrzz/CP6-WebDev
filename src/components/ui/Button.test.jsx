import { render, screen } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('fica desabilitado e mostra o spinner quando está carregando', () => {
    render(<Button loading>Enviar</Button>);
    const button = screen.getByRole('button', { name: /enviar/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status', { name: /carregando/i })).toBeInTheDocument();
  });

  it('fica habilitado e sem spinner fora do carregamento', () => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole('button', { name: /enviar/i })).toBeEnabled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
