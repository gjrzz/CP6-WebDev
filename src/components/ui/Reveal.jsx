import { m, useReducedMotion } from 'motion/react';
import { EASE_OUT } from '@/lib/motion';

// Entrada no scroll (opacity + y), uma vez só. Com `rotate`, chega inclinado e
// assenta com spring, como um adesivo sendo colado.
export default function Reveal({
  as = 'div',
  delay = 0,
  y = 24,
  rotate,
  className = '',
  children,
  ...props
}) {
  const reduced = useReducedMotion();
  const Element = m[as];

  // Com prefers-reduced-motion, já renderiza no estado final
  if (reduced) {
    return (
      <Element className={className} {...props}>
        {children}
      </Element>
    );
  }

  const tilted = rotate !== undefined;
  return (
    <Element
      className={className}
      initial={{ opacity: 0, y, ...(tilted && { rotate }) }}
      whileInView={{ opacity: 1, y: 0, ...(tilted && { rotate: 0 }) }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        tilted
          ? { type: 'spring', stiffness: 220, damping: 18, delay }
          : { duration: 0.6, ease: EASE_OUT, delay }
      }
      {...props}
    >
      {children}
    </Element>
  );
}
