import { render, screen } from '@testing-library/react';
import { LazyMotion, domAnimation, useReducedMotion } from 'motion/react';
import StampedWord from '@/components/ui/StampedWord';

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: vi.fn(),
}));

function renderWord() {
  const { container } = render(
    <LazyMotion features={domAnimation} strict>
      <p>
        <StampedWord text="tools" />
      </p>
    </LazyMotion>,
  );
  return { letters: [...container.querySelectorAll('[aria-hidden="true"] > span')] };
}

describe('StampedWord', () => {
  it('tem a palavra inteira como texto e uma fonte diferente por letra', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    const { letters } = renderWord();

    expect(screen.getByText('tools')).toHaveClass('sr-only');
    expect(letters.map((letter) => letter.textContent).join('')).toBe('tools');
    expect(letters[0]).toHaveClass('font-gothic');
    expect(letters[1]).toHaveClass('font-bubble');
    expect(letters[2]).toHaveClass('font-brush');
    expect(letters[3]).toHaveClass('font-display');
  });

  it('começa sem as letras visíveis, esperando entrar na tela', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    const { letters } = renderWord();
    expect(letters[0]).toHaveStyle({ opacity: '0' });
  });

  it('com reduced motion, as letras já aparecem carimbadas', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { letters } = renderWord();
    expect(letters).toHaveLength(5);
    letters.forEach((letter) => expect(letter).not.toHaveStyle({ opacity: '0' }));
  });
});
