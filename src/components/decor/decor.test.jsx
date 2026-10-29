import { render, screen, waitFor } from '@testing-library/react';
import { LazyMotion, domAnimation, useReducedMotion } from 'motion/react';
import SectionBreak from '@/components/decor/SectionBreak';
import SkateProgress from '@/components/decor/SkateProgress';
import Sticker from '@/components/decor/Sticker';
import TapeBand from '@/components/decor/TapeBand';
import Viewfinder from '@/components/decor/Viewfinder';

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: vi.fn(),
}));

function renderWithMotion(ui) {
  return render(
    <LazyMotion features={domAnimation} strict>
      {ui}
    </LazyMotion>,
  );
}

describe('Decoração da rolagem', () => {
  beforeEach(() => vi.mocked(useReducedMotion).mockReturnValue(false));

  it('a faixa entre seções é só decoração: fica fora da árvore de acessibilidade', () => {
    const { container } = renderWithMotion(
      <SectionBreak
        tape={{ words: ['ride on', 'ship'] }}
        stickers={[{ text: '90s kid', side: 'left' }]}
        scribble={{ shape: 'arrow', label: 'my stuff' }}
      />,
    );

    // A raiz esconde tudo (fita, adesivos, rabisco) do leitor de tela
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    expect(container).toHaveTextContent('90s kid');
    expect(container).toHaveTextContent('my stuff');
  });

  it('a fita repete as palavras para cobrir a largura enquanto desliza', () => {
    const { container } = renderWithMotion(<TapeBand words={['build', 'ship']} />);
    const text = container.querySelector('p').textContent;
    expect(text.match(/build · ship/g).length).toBeGreaterThan(4);
  });

  it('o adesivo começa escondido e cola ao entrar na tela', () => {
    renderWithMotion(<Sticker text="grind" tilt={-7} />);
    expect(screen.getByText('grind')).toHaveStyle({ opacity: '0' });
  });

  it('com reduced motion, o adesivo já aparece colado e o skate de progresso some', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = renderWithMotion(
      <>
        <Sticker text="grind" tilt={-7} />
        <SkateProgress />
      </>,
    );

    const sticker = screen.getByText('grind');
    expect(sticker).not.toHaveStyle({ opacity: '0' });
    expect(sticker.style.rotate).toBe('-7deg');
    expect(container.querySelector('svg')).toBeNull();
  });

  it('o skate de progresso aparece sem reduced motion, depois do carregamento', async () => {
    const { container } = renderWithMotion(<SkateProgress />);
    // Fica fora do primeiro carregamento: só monta quando o navegador fica ocioso
    expect(container.querySelector('svg')).toBeNull();

    await waitFor(() => expect(container.querySelector('svg')).not.toBeNull(), {
      timeout: 2500,
    });
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('Visor de filmadora', () => {
  it('é só decoração, com REC e timecode', () => {
    const { container } = render(<Viewfinder running={false} />);

    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    expect(container).toHaveTextContent('rec');
    expect(container).toHaveTextContent('00:00:00:00');
  });
});
