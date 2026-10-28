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
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 + order * 0.12 }}
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
            sizes="(min-width: 768px) 320px, 192px"
            priority={i === 0}
            className="w-48 rounded-sm md:w-80"
          />
        </m.div>
      ))}
    </div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Parallax leve: a foto desce mais devagar que o texto ao rolar
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);

  return (
    <section ref={ref} className="relative isolate min-h-[calc(100dvh-4.5rem)] overflow-hidden">
      {/* Foto centralizada atrás do texto; o wrapper sem transform deixa o y livre para o parallax */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <m.div style={{ y: photoY }}>
          <HeroPhotos reduced={reduced} />
        </m.div>
      </div>

      <h1 className="mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-6xl flex-col justify-between px-4 py-8 md:px-8 md:py-12">
        <span className="sr-only">{HERO.sentence}</span>

        {/* Versão visual: a frase montada com estilos mistos, como letreiro */}
        <span aria-hidden="true" className="block">
          <span className="block leading-none">
            <Word
              entrance="outline"
              order={0}
              reduced={reduced}
              className="font-display text-[clamp(7rem,26vw,18rem)] font-light text-transparent [-webkit-text-stroke:2px_var(--color-paper)]"
            >
              G
            </Word>
            <Word
              entrance="italic"
              order={1}
              reduced={reduced}
              className="font-display text-[clamp(3rem,11vw,8rem)] font-black italic"
            >
              abriel
            </Word>
          </span>
          <Word
            entrance="thin"
            order={2}
            reduced={reduced}
            className="text-muted mt-2 font-mono text-xs tracking-[0.4em] uppercase md:text-sm"
          >
            is a São Paulo-based
          </Word>
        </span>

        <span aria-hidden="true" className="flex flex-col gap-4 md:items-end">
          {/* Cargo: horizontal no celular, vertical à direita no desktop */}
          <span className="md:absolute md:top-1/2 md:right-8 md:-translate-y-1/2">
            <Word
              entrance="role"
              order={3}
              reduced={reduced}
              className="font-display text-accent text-2xl italic md:text-4xl md:[writing-mode:vertical-rl]"
            >
              IT Analyst / Developer
            </Word>
          </span>
          <Word
            entrance="thin"
            order={4}
            reduced={reduced}
            className="font-display max-w-md text-xl font-light md:text-right md:text-3xl"
          >
            who builds tools, automations and systems.
          </Word>
        </span>
      </h1>
    </section>
  );
}
