import { m } from 'motion/react';
import { EASE_OUT } from '@/lib/motion';

// Cada palavra entra com um movimento que combina com o estilo dela
const entrances = {
  outline: { opacity: 0, scale: 0.8 },
  italic: { opacity: 0, x: -32 },
  thin: { opacity: 0, y: 12 },
  role: { opacity: 0, y: 24 },
};

export default function HeroWord({ entrance, order, reduced, className = '', children }) {
  return (
    <m.span
      className={`inline-block ${className}`}
      initial={reduced ? false : entrances[entrance]}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 + order * 0.1 }}
    >
      {children}
    </m.span>
  );
}
