import { m, useReducedMotion } from 'motion/react';

// Só o texto, direto sobre o fundo do site: as cores seguem o tema
const tones = {
  highlight: 'text-accent',
  paper: 'text-paper',
  // Só o contorno das letras, como o "G" do hero
  ink: 'text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)]',
};

const fonts = {
  gothic: 'font-gothic',
  bubble: 'font-bubble',
  brush: 'font-brush',
};

// A gótica é mais estreita: um degrau acima das outras para ter o mesmo peso visual.
// `xl` é para as palavras que ficam sobre as fitas.
const sizes = {
  lg: { gothic: 'text-9xl', bubble: 'text-8xl', brush: 'text-8xl' },
  xl: { gothic: 'text-[12rem]', bubble: 'text-[10rem]', brush: 'text-[10rem]' },
};

// Contorno preto fino e fixo nos dois temas. paint-order desenha o traço por trás do
// preenchimento: a letra não afina, só ganha uma borda por fora (separa a palavra da fita).
const OUTLINE = '[-webkit-text-stroke:4px_var(--color-page-ink)] [paint-order:stroke_fill]';

// Palavra grande nas margens. Ao entrar na tela, chega maior e mais torta e "cola" com
// spring, ficando com a inclinação final.
export default function Sticker({
  text,
  font = 'brush',
  tone = 'paper',
  size = 'lg',
  outline = false,
  tilt = 0,
  className = '',
}) {
  const reduced = useReducedMotion();
  const look = `inline-block leading-none whitespace-nowrap ${tones[tone]} ${fonts[font]} ${sizes[size][font]} ${outline ? OUTLINE : ''} ${className}`;

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
