import { render, screen } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'motion/react';
import Hero from '@/components/sections/Hero';
import { HERO } from '@/lib/content';

function renderHero() {
  render(
    <LazyMotion features={domAnimation} strict>
      <Hero />
    </LazyMotion>,
  );
}

describe('Hero', () => {
  it('tem a frase inteira como texto real no h1', () => {
    renderHero();
    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(HERO.sentence);
  });

  it('reserva o espaço da primeira foto com o alt, mesmo sem a imagem gerada', () => {
    renderHero();
    expect(screen.getByRole('img', { name: HERO.photos[0].alt })).toBeInTheDocument();
  });
});
