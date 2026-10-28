import { useEffect, useRef } from 'react';
import { m } from 'motion/react';
import Picture from '@/components/ui/Picture';
import { NOTEBOOK } from '@/lib/content';

const EASE_OUT = [0.22, 1, 0.36, 1];

// Capa fechada do caderno. Ao abrir, gira pela borda esquerda (rotateY) e some.
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
      whileHover={reduced ? undefined : { rotate: -2, scale: 1.03 }}
      exit={
        reduced
          ? { opacity: 0, transition: { duration: 0 } }
          : { rotateY: -110, opacity: 0, transition: { duration: 0.5, ease: EASE_OUT } }
      }
      className="focus-visible:outline-accent mx-auto flex flex-col items-center gap-4 rounded-2xl p-2 focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <Picture
        name={cover.name}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        sizes="288px"
        className="w-72"
      />
      <span className="text-muted font-mono text-sm">
        click to open
        <span className="sr-only"> — abrir caderno de projetos</span>
      </span>
    </m.button>
  );
}
