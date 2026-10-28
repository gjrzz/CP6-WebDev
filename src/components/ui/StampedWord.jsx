import { m, useReducedMotion } from 'motion/react';
import { tiltFor } from '@/lib/tilt';

// Cada letra num carimbo diferente, em rodízio
const FONTS = ['font-gothic', 'font-bubble', 'font-brush', 'font-display'];

const word = {
  hidden: {},
  stamped: (delay) => ({ transition: { staggerChildren: 0.07, delayChildren: delay } }),
};

// O carimbo chega grande e mais torto, bate e assenta com spring, ainda um pouco torto
const letter = {
  hidden: ({ from }) => ({ opacity: 0, scale: 1.4, rotate: from }),
  stamped: ({ to }) => ({
    opacity: 1,
    scale: 1,
    rotate: to,
    transition: { type: 'spring', stiffness: 500, damping: 18 },
  }),
};

// Palavra "carimbada" letra por letra quando entra na tela. A palavra inteira existe como
// texto para o leitor de tela; as letras soltas são só visuais.
export default function StampedWord({ text, delay = 0, className = '' }) {
  const reduced = useReducedMotion();
  const letters = [...text].map((char, index) => ({
    char,
    font: FONTS[index % FONTS.length],
    // Ângulos fixos por letra: o mesmo carimbo sempre cai do mesmo jeito
    from: tiltFor(`${text}-${index}-from`, 20),
    to: tiltFor(`${text}-${index}`, 6),
  }));

  return (
    <span className={`block ${className}`}>
      <span className="sr-only">{text}</span>
      {reduced ? (
        <span aria-hidden="true" className="inline-flex items-baseline">
          {letters.map(({ char, font, to }, index) => (
            <span key={index} className={`inline-block ${font}`} style={{ rotate: `${to}deg` }}>
              {char}
            </span>
          ))}
        </span>
      ) : (
        <m.span
          aria-hidden="true"
          className="inline-flex items-baseline"
          variants={word}
          custom={delay}
          initial="hidden"
          whileInView="stamped"
          viewport={{ once: true, amount: 0.6 }}
        >
          {letters.map(({ char, font, from, to }, index) => (
            <m.span
              key={index}
              className={`inline-block ${font}`}
              variants={letter}
              custom={{ from, to }}
            >
              {char}
            </m.span>
          ))}
        </m.span>
      )}
    </span>
  );
}
