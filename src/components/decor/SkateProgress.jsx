import { m, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { useIdle } from '@/hooks/useIdle';

// Altura do shape em px, para ele parar no fim da trilha em vez de passar dela
const SKATE_SIZE = 40;

// Shape de skate visto de lado: tábua com as pontas levantadas e duas rodinhas
function SkateIcon() {
  return (
    <svg viewBox="0 0 40 40" width={SKATE_SIZE} height={SKATE_SIZE} className="text-accent">
      {/* Na vertical, descendo pela borda: o nose aponta para baixo */}
      <g transform="rotate(90 20 20)">
        <path
          d="M4 18 Q6 22 10 22 L30 22 Q34 22 36 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="12" cy="27" r="3" fill="currentColor" />
        <circle cx="28" cy="27" r="3" fill="currentColor" />
      </g>
    </svg>
  );
}

// Indicador de progresso da página: um skate desce pela borda direita sobre uma trilha
// pontilhada, inclinando com a velocidade da rolagem. Só no desktop e sem reduced motion.
// Monta só quando o navegador fica ocioso: é decorativo e escuta a rolagem a cada frame,
// então fica fora do trabalho do primeiro carregamento.
export default function SkateProgress() {
  const reduced = useReducedMotion();
  const idle = useIdle();
  if (reduced || !idle) return null;
  return <SkateTrack />;
}

function SkateTrack() {
  const { scrollY, scrollYProgress } = useScroll();
  // translateY em % da trilha, descontando o tamanho do shape no fim
  const y = useTransform(
    scrollYProgress,
    (progress) => `calc(${progress * 100}% - ${progress * SKATE_SIZE}px)`,
  );
  const velocity = useVelocity(scrollY);
  const rotate = useSpring(useTransform(velocity, [-3000, 0, 3000], [-25, 0, 25]), {
    stiffness: 300,
    damping: 30,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-24 right-3 bottom-8 z-20 hidden w-10 lg:block"
    >
      {/* Trilha de rodinha */}
      <div className="border-paper/20 absolute inset-y-0 left-1/2 border-l-2 border-dotted" />
      <m.div className="absolute inset-x-0 top-0 h-full" style={{ y }}>
        <m.div style={{ rotate }} className="w-fit">
          <SkateIcon />
        </m.div>
      </m.div>
    </div>
  );
}
