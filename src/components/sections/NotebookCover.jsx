import { useEffect, useRef } from 'react';
import { m } from 'motion/react';
import Picture from '@/components/ui/Picture';
import { NOTEBOOK } from '@/lib/content';

const EASE_OUT = [0.22, 1, 0.36, 1];

// Capa fechada: a própria foto é o botão. Ao abrir, gira pela borda esquerda (rotateY) e some.
export default function NotebookCover({ onOpen, focusOnMount, reduced }) {
  const ref = useRef(null);
  const { cover } = NOTEBOOK;

  // Ao fechar o caderno, o foco volta para a capa
  useEffect(() => {
    if (focusOnMount) ref.current?.focus();
  }, [focusOnMount]);

  return (
    <m.button
      ref={ref}
      type="button"
      onClick={onOpen}
      aria-expanded={false}
      style={{ transformOrigin: 'left center' }}
      whileHover={reduced ? undefined : { rotate: -2, scale: 1.02 }}
      exit={
        reduced
          ? { opacity: 0, transition: { duration: 0 } }
          : { rotateY: -110, opacity: 0, transition: { duration: 0.5, ease: EASE_OUT } }
      }
      className="focus-visible:outline-accent block w-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      {/* Abaixo da dobra (o hero ocupa a primeira tela): carrega sob demanda */}
      <Picture
        name={cover.name}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        sizes="(min-width: 1152px) 1088px, 100vw"
        className="w-full"
      />
      <span className="text-muted block font-mono text-sm">
        click to open
        <span className="sr-only"> — abrir caderno de projetos</span>
      </span>
    </m.button>
  );
}
