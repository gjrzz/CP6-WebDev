import { useRef } from 'react';
import { m, useReducedMotion } from 'motion/react';
import HeroName from '@/components/sections/HeroName';
import HeroPhotos from '@/components/sections/HeroPhotos';
import HeroWord from '@/components/sections/HeroWord';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useParallax } from '@/hooks/useParallax';
import { HERO } from '@/lib/content';
import { AFTER_IMPACT_ORDER } from '@/lib/heroTiming';

// Estilos das palavras da coluna da esquerda: pequenas e espaçadas, ou grandes e finas
const small = 'font-display text-base font-light tracking-[0.5em] md:text-lg';
const large =
  'font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-tight font-light tracking-[0.3em] italic';

export default function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  // Parallax leve só no desktop: a foto desce mais devagar que o texto ao rolar. No celular,
  // com tudo empilhado, ela desceria por cima do texto que vem depois.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const photoY = useParallax(ref, reduced || !isDesktop ? 0 : 120);
  // A sequência do letreiro começa depois da batida do "G" no "abriel"
  const word = (entrance, order) => ({ entrance, order: AFTER_IMPACT_ORDER + order, reduced });

  return (
    <section ref={ref} className="relative min-h-[calc(100dvh-4.5rem)] overflow-hidden">
      {/* Letreiro em grid, como um cartaz: nome no topo, frase à esquerda, foto no centro,
          cargos na vertical à direita. No celular, empilha na ordem da frase (order-*):
          nome, cargos, ", who builds…" e a foto por último. A frase inteira fica no h1 para o leitor de tela;
          os pedaços visuais são aria-hidden. */}
      <div className="mx-auto grid min-h-[calc(100dvh-4.5rem)] max-w-7xl gap-x-10 gap-y-8 px-4 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:grid-rows-[auto_1fr]">
        <h1 className="sr-only">{HERO.sentence}</h1>

        {/* Nome: "G" enorme só no contorno voa e bate no "abriel"; o resto ao lado */}
        <div
          aria-hidden="true"
          className="order-1 flex flex-wrap items-start lg:order-none lg:col-span-2"
        >
          <HeroName reduced={reduced} />
          <HeroWord
            {...word('thin', 0)}
            className={`${small} text-muted mt-4 self-start md:ml-8 lg:mt-8`}
          >
            is a São Paulo-based
          </HeroWord>
        </div>

        {/* Frase quebrada em linhas, alternando pequeno e grande */}
        <div
          aria-hidden="true"
          className="order-3 flex flex-col justify-center gap-1 lg:order-none lg:col-start-1 lg:row-start-2"
        >
          <HeroWord {...word('thin', 1)} className={small}>
            , who builds
          </HeroWord>
          <HeroWord {...word('thin', 2)} className={large}>
            tools
          </HeroWord>
          <HeroWord {...word('thin', 3)} className={large}>
            , auto
          </HeroWord>
          <HeroWord {...word('thin', 4)} className={large}>
            mations
          </HeroWord>
          <HeroWord {...word('thin', 5)} className={small}>
            , and
          </HeroWord>
          <HeroWord
            {...word('italic', 6)}
            className="font-brush text-accent text-[clamp(3rem,6vw,5.5rem)] leading-none"
          >
            systems.
          </HeroWord>
        </div>

        {/* Foto no centro; o wrapper sem transform deixa o y livre para o parallax */}
        <div className="order-4 flex items-center justify-center lg:order-none lg:col-start-2 lg:row-start-2">
          <m.div style={{ y: photoY }}>
            <HeroPhotos reduced={reduced} />
          </m.div>
        </div>

        {/* Cargos: duas colunas verticais enormes no desktop, horizontais no celular */}
        <div
          aria-hidden="true"
          className="order-2 flex flex-wrap items-baseline gap-x-4 lg:order-none lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:flex-nowrap lg:items-start lg:justify-end lg:gap-x-3"
        >
          <HeroWord
            {...word('role', 7)}
            className="font-display text-5xl leading-none font-black lg:text-[clamp(4rem,7vw,7rem)] lg:[writing-mode:vertical-rl]"
          >
            IT Analyst
          </HeroWord>
          <HeroWord
            {...word('thin', 8)}
            className={`${small} text-muted lg:[writing-mode:vertical-rl]`}
          >
            and
          </HeroWord>
          <HeroWord
            {...word('role', 9)}
            className="font-display text-5xl leading-none font-black lg:text-[clamp(4rem,7vw,7rem)] lg:[writing-mode:vertical-rl]"
          >
            Developer
          </HeroWord>
        </div>
      </div>
    </section>
  );
}
