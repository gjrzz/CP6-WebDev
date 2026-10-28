import { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';

// Traço à mão (SVG) que vai sendo desenhado conforme a rolagem: começa quando o traço
// entra na parte de baixo da tela e termina perto do meio. Com reduced motion, já aparece inteiro.
export default function ScrollStroke({ d, viewBox, strokeWidth = 3, className = '' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'start 45%'] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <svg ref={ref} aria-hidden="true" viewBox={viewBox} fill="none" className={className}>
      <m.path
        d={d}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: reduced ? 1 : pathLength }}
      />
    </svg>
  );
}
