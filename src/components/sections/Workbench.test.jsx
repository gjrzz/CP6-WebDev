import { render, screen, within } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'motion/react';
import Workbench from '@/components/sections/Workbench';
import { WORKBENCH } from '@/lib/content';

function renderWorkbench() {
  render(
    <LazyMotion features={domAnimation} strict>
      <Workbench />
    </LazyMotion>,
  );
}

describe('Workbench', () => {
  it('tem as palavras carimbadas, a stack e a experiência como texto real', () => {
    renderWorkbench();

    WORKBENCH.words.forEach((word) => expect(screen.getByText(word)).toBeInTheDocument());
    WORKBENCH.stack
      .flatMap((group) => group.items)
      .forEach((item) => expect(screen.getByText(item)).toBeInTheDocument());

    const experience = screen.getByRole('heading', { name: 'Experiência' }).parentElement;
    expect(within(experience).getByText(/Monte Bravo Corretora/)).toBeInTheDocument();
    expect(within(experience).getByText(/Matiz Assessoria Contábil/)).toBeInTheDocument();
    expect(screen.getByText('Bloomberg Terminal Technician')).toBeInTheDocument();
  });

  it('não mostra o período enquanto ele não foi preenchido', () => {
    renderWorkbench();
    expect(screen.queryByText(/null|início/i)).not.toBeInTheDocument();
  });
});
