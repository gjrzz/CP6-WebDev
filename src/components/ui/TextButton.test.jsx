import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextButton from '@/components/ui/TextButton';

describe('TextButton', () => {
  it('é um botão que não envia formulário e chama o onClick', async () => {
    const onClick = vi.fn();
    render(<TextButton onClick={onClick}>ver mais</TextButton>);
    const button = screen.getByRole('button', { name: 'ver mais' });
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('vira link quando recebe href', () => {
    render(<TextButton href="mailto:a@b.com">a@b.com</TextButton>);
    expect(screen.getByRole('link', { name: 'a@b.com' })).toHaveAttribute('href', 'mailto:a@b.com');
  });
});
