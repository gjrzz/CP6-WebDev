import { m } from 'motion/react';
import { G_FLIGHT, G_START, IMPACT, NAME_IN } from '@/lib/heroTiming';
import { EASE_OUT } from '@/lib/motion';

// "G" enorme só no contorno que entra voando e colide com o "abriel"
export default function HeroName({ reduced }) {
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
