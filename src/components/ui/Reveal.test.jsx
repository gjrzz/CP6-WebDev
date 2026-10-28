import { render, screen } from '@testing-library/react';
import { LazyMotion, domAnimation, useReducedMotion } from 'motion/react';
import Reveal from '@/components/ui/Reveal';

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: vi.fn(),
}));

function renderReveal() {
  render(
    <LazyMotion features={domAnimation} strict>
      <Reveal as="li" rotate={2}>
        Conteúdo
      </Reveal>
    </LazyMotion>,
  );
  return screen.getByText('Conteúdo');
}

describe('Reveal', () => {
  it('começa escondido até entrar na tela', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    const element = renderReveal();

    expect(element.tagName).toBe('LI');
    expect(element).toHaveStyle({ opacity: '0' });
  });

  it('com reduced motion já aparece no estado final', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const element = renderReveal();

    expect(element).not.toHaveStyle({ opacity: '0' });
    expect(element.style.transform).toBe('');
  });
});
