import { useScroll, useTransform } from 'motion/react';

// Deslocamento em y (px) que vai de 0 a `distance` enquanto `ref` sai pelo topo da tela.
// Com distance 0, fica parado.
export function useParallax(ref, distance) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  return useTransform(scrollYProgress, [0, 1], [0, distance]);
}
