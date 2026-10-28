import { render, screen } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'motion/react';
import NotebookCover from '@/components/sections/NotebookCover';

function renderCover(reduced) {
  render(
    <LazyMotion features={domAnimation} strict>
      <NotebookCover onOpen={() => {}} focusOnMount={false} reduced={reduced} />
    </LazyMotion>,
  );
  // O trajeto do scroll fica no wrapper em volta do botão
  return screen.getByRole('button', { name: /abrir caderno de projetos/i }).parentElement;
}

describe('NotebookCover', () => {
  it('começa no canto direito, inclinada e menor, antes de rolar até ela', () => {
    const track = renderCover(false);
    expect(track.style.transform).toMatch(/translateX\(60%\)/);
    expect(track.style.transform).toMatch(/scale\(0\.8\)/);
    expect(track.style.transform).toMatch(/rotate\(12deg\)/);
  });

  it('com reduced motion já fica no centro, sem trajeto', () => {
    const track = renderCover(true);
    expect(track.style.transform).toBe('');
  });
});
