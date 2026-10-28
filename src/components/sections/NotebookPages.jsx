import { useEffect, useRef } from 'react';
import { AnimatePresence, m } from 'motion/react';
import Button from '@/components/ui/Button';
import ProjectNote from '@/components/ui/ProjectNote';
import NotebookSpread from '@/components/sections/NotebookSpread';
import { usePagination } from '@/hooks/usePagination';
import { NOTEBOOK } from '@/lib/content';

const pageVariants = {
  enter: (direction) => ({ opacity: 0, x: direction * 24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction * -24 }),
};

// Conteúdo de uma página: só ele anima na troca, a foto do caderno fica parada
function PageNotes({ projects, pageKey, direction, reduced }) {
  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <m.ul
        key={pageKey}
        custom={direction}
        variants={pageVariants}
        initial={reduced ? false : 'enter'}
        animate="center"
        exit={reduced ? undefined : 'exit'}
        transition={{ duration: 0.3 }}
        className="divide-page-ink/20 grid h-full grid-rows-2 divide-y"
      >
        {projects.map((project) => (
          <li key={project.name} className="min-h-0">
            <ProjectNote project={project} featured={project.featured} />
          </li>
        ))}
      </m.ul>
    </AnimatePresence>
  );
}

// Caderno aberto com os projetos escritos nas páginas: dois por página,
// navegação pelas setas abaixo do caderno ou do teclado
export default function NotebookPages({ projects, reduced }) {
  const ref = useRef(null);
  const {
    page: current,
    pageCount,
    pageItems,
    direction,
    hasPrev,
    hasNext,
    next,
    prev,
  } = usePagination(projects, NOTEBOOK.perPage);
  const half = NOTEBOOK.perPage / 2;

  // As setas valem com o foco em qualquer ponto do caderno (ele mesmo, uma anotação, um botão),
  // sem roubar as setas do resto da página
  useEffect(() => {
    const notebook = ref.current?.closest('[data-notebook]');
    if (!notebook) return;
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') next();
      else if (event.key === 'ArrowLeft') prev();
      else return;
      event.preventDefault();
    };
    notebook.addEventListener('keydown', handleKeyDown);
    return () => notebook.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  const pageProps = { pageKey: current, direction, reduced };

  return (
    <div ref={ref}>
      <NotebookSpread
        left={<PageNotes projects={pageItems.slice(0, half)} {...pageProps} />}
        right={<PageNotes projects={pageItems.slice(half)} {...pageProps} />}
      />

      <nav aria-label="Páginas do caderno" className="mt-4 flex items-center justify-center gap-4">
        <Button variant="ghost" onClick={prev} disabled={!hasPrev} aria-label="Página anterior">
          ←
        </Button>
        <p aria-live="polite" className="text-muted font-mono text-sm">
          <span className="sr-only">Página </span>
          {current + 1} / {pageCount}
        </p>
        <Button variant="ghost" onClick={next} disabled={!hasNext} aria-label="Próxima página">
          →
        </Button>
      </nav>
    </div>
  );
}
