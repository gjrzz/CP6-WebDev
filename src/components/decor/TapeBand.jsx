import { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';

const tones = {
  caution: 'bg-page-highlight text-page-ink',
  masking: 'bg-page-paper text-page-ink',
};

// Repete as palavras o bastante para cobrir a largura mesmo com a fita deslizando
const REPEAT = 8;

// Fita atravessada entre seções; o texto desliza para o lado conforme a rolagem.
// `reverse` inverte o sentido e a inclinação.
export default function TapeBand({ words, tone = 'caution', reverse = false }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], reverse ? ['-25%', '0%'] : ['0%', '-25%']);
  const text = Array.from({ length: REPEAT }, () => words.join(' · ')).join(' · ');

  return (
    // overflow-x-clip: a fita inclinada é mais larga que a tela, sem criar rolagem horizontal
    <div ref={ref} aria-hidden="true" className="pointer-events-none overflow-x-clip py-10">
      <div
        className={`-mx-8 py-2 shadow-lg ${tones[tone]}`}
        style={{ rotate: reverse ? '1.5deg' : '-2deg' }}
      >
        <m.p
          className="font-mono text-sm tracking-[0.3em] whitespace-nowrap uppercase"
          style={reduced ? undefined : { x }}
        >
          {text}
        </m.p>
      </div>
    </div>
  );
}
