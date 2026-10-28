import { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Picture from '@/components/ui/Picture';
import { useCrossfade } from '@/hooks/useCrossfade';
import { HERO } from '@/lib/content';

const EASE_OUT = [0.22, 1, 0.36, 1];

// Cada palavra entra com um movimento que combina com o estilo dela
const entrances = {
  outline: { opacity: 0, scale: 0.8 },
  italic: { opacity: 0, x: -32 },
  thin: { opacity: 0, y: 12 },
  role: { opacity: 0, y: 24 },
};

function Word({ entrance, order, reduced, className = '', children }) {
  return (
    <m.span
      className={`inline-block ${className}`}
      initial={reduced ? false : entrances[entrance]}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 + order * 0.1 }}
    >
      {children}
    </m.span>
  );
}

function HeroPhotos({ reduced }) {
  const { photos, photoSize } = HERO;
  const index = useCrossfade(photos.length, { paused: reduced });
  // Com reduced motion, só a primeira foto, sem troca automática
  const shown = reduced ? photos.slice(0, 1) : photos;

  return (
    <div className="grid">
      {shown.map((photo, i) => (
        <m.div
          key={photo.name}
          className="[grid-area:1/1]"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1 }}
          aria-hidden={i !== index || undefined}
        >
          <Picture
            name={photo.name}
            alt={photo.alt}
            width={photoSize.width}
            height={photoSize.height}
            sizes="(min-width: 1024px) 26rem, 16rem"
            priority={i === 0}
            className="w-64 lg:w-[min(28vw,26rem)]"
          />
        </m.div>
      ))}
    </div>
  );
}

// Estilos das palavras da coluna da esquerda: pequenas e espaçadas, ou grandes e finas
const small = 'font-display text-base font-light tracking-[0.5em] md:text-lg';
const large =
  'font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-tight font-light tracking-[0.3em] italic';

export default function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Parallax leve: a foto desce mais devagar que o texto ao rolar
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);
  const word = (entrance, order) => ({ entrance, order, reduced });

  return (
    <section ref={ref} className="relative min-h-[calc(100dvh-4.5rem)] overflow-hidden">
      {/* Letreiro em grid, como um cartaz: nome no topo, frase à esquerda, foto no centro,
          cargos na vertical à direita. A frase inteira fica no h1 para o leitor de tela;
          os pedaços visuais são aria-hidden. */}
      <div className="mx-auto grid min-h-[calc(100dvh-4.5rem)] max-w-7xl gap-x-10 gap-y-8 px-4 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:grid-rows-[auto_1fr]">
        <h1 className="sr-only">{HERO.sentence}</h1>

        {/* Nome: "G" enorme só no contorno, "abriel" pesado por cima; o resto ao lado */}
        <div aria-hidden="true" className="flex flex-wrap items-start lg:col-span-2">
          <Word
            {...word('outline', 0)}
            className="font-display text-[clamp(8rem,20vw,18rem)] leading-[0.8] font-light text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)]"
          >
            G
          </Word>
          <Word
            {...word('italic', 1)}
            className="font-display relative -ml-[0.15em] text-[clamp(3.5rem,9vw,8rem)] leading-none font-black italic"
          >
            abriel
          </Word>
          <Word
            {...word('thin', 2)}
            className={`${small} text-muted mt-4 self-start md:ml-8 lg:mt-8`}
          >
            is a São Paulo-based
          </Word>
        </div>

        {/* Frase quebrada em linhas, alternando pequeno e grande */}
        <div
          aria-hidden="true"
          className="flex flex-col justify-center gap-1 lg:col-start-1 lg:row-start-2"
        >
          <Word {...word('thin', 3)} className={small}>
            , who builds
          </Word>
          <Word {...word('thin', 4)} className={large}>
            tools
          </Word>
          <Word {...word('thin', 5)} className={large}>
            , auto
          </Word>
          <Word {...word('thin', 6)} className={large}>
            mations
          </Word>
          <Word {...word('thin', 7)} className={small}>
            , and
          </Word>
          <Word
            {...word('italic', 8)}
            className="font-brush text-accent text-[clamp(3rem,6vw,5.5rem)] leading-none"
          >
            systems.
          </Word>
        </div>

        {/* Foto no centro; o wrapper sem transform deixa o y livre para o parallax */}
        <div className="flex items-center justify-center lg:col-start-2 lg:row-start-2">
          <m.div style={{ y: photoY }}>
            <HeroPhotos reduced={reduced} />
          </m.div>
        </div>

        {/* Cargos: duas colunas verticais enormes no desktop, horizontais no celular */}
        <div
          aria-hidden="true"
          className="flex flex-wrap items-baseline gap-x-4 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:flex-nowrap lg:items-start lg:justify-end lg:gap-x-3"
        >
          <Word
            {...word('role', 9)}
            className="font-display text-5xl leading-none font-black lg:text-[clamp(4rem,7vw,7rem)] lg:[writing-mode:vertical-rl]"
          >
            IT Analyst
          </Word>
          <Word
            {...word('thin', 10)}
            className={`${small} text-muted lg:[writing-mode:vertical-rl]`}
          >
            and
          </Word>
          <Word
            {...word('role', 11)}
            className="font-display text-5xl leading-none font-black lg:text-[clamp(4rem,7vw,7rem)] lg:[writing-mode:vertical-rl]"
          >
            Developer
          </Word>
        </div>
      </div>
    </section>
  );
}
