import { useEffect, useRef } from 'react';
import { AnimatePresence, m } from 'motion/react';
import Button from '@/components/ui/Button';
import ProjectCard from '@/components/ui/ProjectCard';
import Reveal from '@/components/ui/Reveal';
import { usePagination } from '@/hooks/usePagination';
import { NOTEBOOK } from '@/lib/content';
import { tiltFor } from '@/lib/tilt';

const pageVariants = {
  enter: (direction) => ({ opacity: 0, x: direction * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction * -40 }),
};

// Altura de duas linhas de card (h-48 + gap-4): a última página não encolhe o caderno
const page = 'flex min-h-[25rem] flex-col gap-4';

function Page({ projects, offset, className = '' }) {
  return (
    <ul className={`${page} ${className}`}>
      {projects.map((project, index) => (
        <Reveal
          key={project.name}
          as="li"
          delay={(offset + index) * 0.06}
          rotate={tiltFor(project.name)}
        >
          <ProjectCard project={project} featured={project.featured} />
        </Reveal>
      ))}
    </ul>
  );
}

// Páginas abertas: dois cards em cada lado, navegação pelas setas da tela ou do teclado
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

  // As setas valem com o foco em qualquer ponto do caderno (ele mesmo, um card, um botão),
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

  return (
    <div ref={ref}>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <m.div
          key={current}
          custom={direction}
          variants={pageVariants}
          initial={reduced ? false : 'enter'}
          animate="center"
          exit={reduced ? undefined : 'exit'}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 gap-8"
        >
          <Page projects={pageItems.slice(0, half)} offset={0} />
          <Page
            projects={pageItems.slice(half)}
            offset={half}
            className="border-paper/10 border-l pl-8"
          />
        </m.div>
      </AnimatePresence>

      <nav aria-label="Páginas do caderno" className="mt-6 flex items-center justify-center gap-4">
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
