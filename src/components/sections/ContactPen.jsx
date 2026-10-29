import { m } from 'motion/react';
import Picture from '@/components/ui/Picture';
import { CONTACT } from '@/lib/content';

// Movimento de "escrevendo": vai e vem curto com a ponta, depois para
const writing = {
  x: [0, -10, 6, -12, 4, -8, 0],
  y: [0, 4, -3, 5, -2, 3, 0],
  rotate: [0, -4, 3, -5, 2, -3, 0],
};

// Caneta largada no canto do cartão. Entra deslizando e girando quando a seção aparece;
// quando o cartão vira para o formulário, "escreve" por alguns segundos.
export default function ContactPen({ writingNow, reduced }) {
  const { pen } = CONTACT;
  // Contorno claro de 1px: a caneta é preta e sumiria no fundo escuro
  const image = (
    <Picture
      name={pen.name}
      alt=""
      width={pen.width}
      height={pen.height}
      sizes="15rem"
      className="w-full [filter:drop-shadow(0_0_1px_rgb(245_245_240/0.6))]"
    />
  );

  return (
    <div
      aria-hidden="true"
      // Do lado esquerdo, espelhada (ponta para o cartão): a direita é da mão
      className="pointer-events-none absolute bottom-24 -left-20 z-10 w-48 -scale-x-100 sm:-left-28 sm:w-60"
    >
      {reduced ? (
        image
      ) : (
        <m.div
          initial={{ opacity: 0, x: 200, rotate: 60 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 140, damping: 14 }}
        >
          <m.div
            animate={writingNow ? writing : { x: 0, y: 0, rotate: 0 }}
            transition={
              writingNow ? { duration: 1.4, ease: 'easeInOut', repeat: 1, delay: 0.6 } : undefined
            }
          >
            {image}
          </m.div>
        </m.div>
      )}
    </div>
  );
}
