import { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Picture from '@/components/ui/Picture';
import Viewfinder from '@/components/decor/Viewfinder';
import { useCrossfade } from '@/hooks/useCrossfade';
import { useIdle } from '@/hooks/useIdle';
import { useMediaQuery } from '@/hooks/useMediaQuery';
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

// Momentos da batida (s): o "abriel" aparece, o "G" voa da esquerda e bate nele
const NAME_IN = 0.1;
const G_START = 0.45;
const G_FLIGHT = 0.55;
const IMPACT = G_START + G_FLIGHT;
// O resto do letreiro entra depois da batida
const AFTER_IMPACT_ORDER = Math.ceil((IMPACT + 0.2 - 0.1) / 0.1);

// "G" enorme só no contorno que entra voando e colide com o "abriel"
function CollidingName({ reduced }) {
  const outline =
    'font-display inline-block text-[clamp(8rem,20vw,18rem)] leading-[0.8] font-light text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)]';
  const rest =
    'font-display relative -ml-[0.15em] inline-block text-[clamp(3.5rem,9vw,8rem)] leading-none font-black italic';

  if (reduced) {
    return (
      <>
        <span className={outline}>G</span>
        <span className={rest}>abriel</span>
      </>
    );
  }

  return (
    <>
      {/* Vem de fora da tela acelerando (easeIn), passa um pouco do ponto e assenta */}
      <m.span
        className={outline}
        initial={{ x: '-100vw' }}
        animate={{ x: ['-100vw', '4%', '0%'] }}
        transition={{
          delay: G_START,
          duration: G_FLIGHT + 0.25,
          times: [0, G_FLIGHT / (G_FLIGHT + 0.25), 1],
          ease: ['easeIn', 'easeOut'],
        }}
      >
        G
      </m.span>
      {/* Aparece antes e, no impacto, leva o tranco: empurrado para a direita, balança e volta */}
      <m.span
        className={rest}
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: 1,
          y: 0,
          x: [0, 0, 28, -6, 0],
          rotate: [0, 0, 5, -2, 0],
        }}
        transition={{
          opacity: { delay: NAME_IN, duration: 0.4 },
          y: { delay: NAME_IN, duration: 0.4, ease: EASE_OUT },
          default: { delay: IMPACT - 0.01, duration: 0.6, times: [0, 0.02, 0.25, 0.6, 1] },
        }}
      >
        abriel
      </m.span>
    </>
  );
}

// Moldura com proporção fixa (HERO.frame): fotos de proporções diferentes ocupam o mesmo
// espaço, cortadas no ponto de `focus`, e a troca entre elas não mexe no layout
function HeroPhotos({ reduced }) {
  const { photos, frame } = HERO;
  // As outras fotos só entram quando o navegador fica ocioso (antes da 1ª troca, aos 3 s):
  // no carregamento, a banda fica para a 1ª foto, que é o LCP
  const idle = useIdle();
  // Com reduced motion, só a primeira foto, sem troca automática
  const shown = reduced || !idle ? photos.slice(0, 1) : photos;
  const index = useCrossfade(shown.length, { paused: reduced });

  return (
    <div
      className="relative w-72 overflow-hidden sm:w-96 lg:w-[min(34vw,32rem)]"
      style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
    >
      {shown.map((photo, i) => (
        <m.div
          key={photo.name}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1 }}
          aria-hidden={i !== index || undefined}
        >
          <Picture
            name={photo.name}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes={HERO.photoSizes}
            priority={i === 0}
            cover
            position={photo.focus}
          />
        </m.div>
      ))}
      {/* Visor de filmadora por cima das fotos; com reduced motion, REC aceso e timecode parado */}
      <Viewfinder running={!reduced} />
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
  // Parallax leve só no desktop: a foto desce mais devagar que o texto ao rolar. No celular,
  // com tudo empilhado, ela desceria por cima do texto que vem depois.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduced || !isDesktop ? 0 : 120]);
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
          <CollidingName reduced={reduced} />
          <Word
            {...word('thin', 0)}
            className={`${small} text-muted mt-4 self-start md:ml-8 lg:mt-8`}
          >
            is a São Paulo-based
          </Word>
        </div>

        {/* Frase quebrada em linhas, alternando pequeno e grande */}
        <div
          aria-hidden="true"
          className="order-3 flex flex-col justify-center gap-1 lg:order-none lg:col-start-1 lg:row-start-2"
        >
          <Word {...word('thin', 1)} className={small}>
            , who builds
          </Word>
          <Word {...word('thin', 2)} className={large}>
            tools
          </Word>
          <Word {...word('thin', 3)} className={large}>
            , auto
          </Word>
          <Word {...word('thin', 4)} className={large}>
            mations
          </Word>
          <Word {...word('thin', 5)} className={small}>
            , and
          </Word>
          <Word
            {...word('italic', 6)}
            className="font-brush text-accent text-[clamp(3rem,6vw,5.5rem)] leading-none"
          >
            systems.
          </Word>
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
          <Word
            {...word('role', 7)}
            className="font-display text-5xl leading-none font-black lg:text-[clamp(4rem,7vw,7rem)] lg:[writing-mode:vertical-rl]"
          >
            IT Analyst
          </Word>
          <Word
            {...word('thin', 8)}
            className={`${small} text-muted lg:[writing-mode:vertical-rl]`}
          >
            and
          </Word>
          <Word
            {...word('role', 9)}
            className="font-display text-5xl leading-none font-black lg:text-[clamp(4rem,7vw,7rem)] lg:[writing-mode:vertical-rl]"
          >
            Developer
          </Word>
        </div>
      </div>
    </section>
  );
}
