import { useScroll, useSpring, useTransform } from 'motion/react';

// Entrega do cartão: sobe, endireita e cresce com a rolagem, chegando ao lugar quando
// `ref` encosta no fim da tela. A mola suaviza a rolagem.
export function useHandoff(ref) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const y = useTransform(progress, [0, 1], [180, 0]);
  const rotate = useTransform(progress, [0, 1], [-6, 0]);
  const scale = useTransform(progress, [0, 1], [0.92, 1]);
  return { y, rotate, scale };
}
