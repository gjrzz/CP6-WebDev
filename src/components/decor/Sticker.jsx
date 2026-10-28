import { m, useReducedMotion } from 'motion/react';

const tones = {
  highlight: 'bg-page-highlight text-page-ink',
  paper: 'bg-page-paper text-page-ink',
  ink: 'bg-page-ink text-page-paper',
};

const fonts = {
  gothic: 'font-gothic text-3xl',
  bubble: 'font-bubble text-2xl',
  brush: 'font-brush text-2xl',
};

// Adesivo com borda branca de recorte. Ao entrar na tela, chega grande e mais torto
// e "cola" com spring, ficando com a inclinação final.
export default function Sticker({
  text,
  font = 'brush',
  tone = 'paper',
  tilt = 0,
  className = '',
}) {
  const reduced = useReducedMotion();
  const look = `inline-block rounded-2xl border-4 border-white px-4 py-1 shadow-xl ${tones[tone]} ${fonts[font]} ${className}`;

  if (reduced) {
    return (
      <span className={look} style={{ rotate: `${tilt}deg` }}>
        {text}
      </span>
    );
  }

  return (
    <m.span
      className={look}
      initial={{ opacity: 0, scale: 1.6, rotate: tilt + 18 }}
      whileInView={{ opacity: 1, scale: 1, rotate: tilt }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ type: 'spring', stiffness: 380, damping: 16 }}
    >
      {text}
    </m.span>
  );
}
