import { m } from 'motion/react';
import Picture from '@/components/ui/Picture';
import { CONTACT } from '@/lib/content';
import { EASE_OUT } from '@/lib/motion';

// A mão é mais larga que o cartão e segura a borda de baixo um pouco à direita do centro
const HAND_WIDTH = '140%';
const PINCH_AT = '62%';

// Foto da mão posicionada para o corte reto (onde estava o papel) encostar na borda de
// baixo do cartão. Fica por cima dele: acima do corte só existe o polegar, então os dedos
// parecem estar atrás. O braço some num degradê antes do fim da seção. Quando o cartão
// vira, a mão solta e desce, para não cobrir o formulário.
export default function ContactHand({ released, reduced }) {
  const { hand } = CONTACT;
  return (
    <div
      className="pointer-events-none absolute top-full z-10 [mask-image:linear-gradient(to_bottom,black_64%,transparent_76%)]"
      style={{
        left: PINCH_AT,
        width: HAND_WIDTH,
        transform: `translate(-${hand.pinch.x * 100}%, -${hand.pinch.y * 100}%)`,
      }}
    >
      <m.div
        initial={false}
        animate={released ? { y: '25%', opacity: 0 } : { y: 0, opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT }}
      >
        <Picture
          name={hand.name}
          alt={hand.alt}
          width={hand.width}
          height={hand.height}
          sizes="(min-width: 640px) 630px, 140vw"
          className="w-full"
        />
      </m.div>
    </div>
  );
}
