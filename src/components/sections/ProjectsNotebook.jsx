import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import ProjectCard from '@/components/ui/ProjectCard';
import ProjectCardSkeleton from '@/components/ui/ProjectCardSkeleton';
import Reveal from '@/components/ui/Reveal';
import TextButton from '@/components/ui/TextButton';
import NotebookCover from '@/components/sections/NotebookCover';
import NotebookPages from '@/components/sections/NotebookPages';
import NotebookSpread, {
  NotebookMessage,
  NotebookScribbles,
} from '@/components/sections/NotebookSpread';
import ProjectsStates from '@/components/sections/ProjectsStates';
import { useHomeProjects } from '@/hooks/useHomeProjects';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { tiltFor } from '@/lib/tilt';

// Carregando, erro e vazio também aparecem "escritos" nas páginas do caderno
const spreadSkeleton = (
  <NotebookSpread left={<NotebookScribbles />} right={<NotebookScribbles />} />
);

const renderSpreadError = (errorText, onRetry) => (
  <NotebookSpread left={<NotebookMessage role="alert" {...errorText} onRetry={onRetry} />} />
);

const renderSpreadEmpty = (message) => (
  <NotebookSpread left={<NotebookMessage title={message} />} />
);

const listSkeleton = (
  <div className="flex flex-col gap-4">
    <ProjectCardSkeleton />
    <ProjectCardSkeleton />
    <ProjectCardSkeleton />
  </div>
);

function ProjectList({ projects }) {
  return (
    <ul className="flex flex-col gap-4">
      {projects.map((project) => (
        <Reveal key={project.name} as="li" rotate={tiltFor(project.name)}>
          <ProjectCard project={project} featured={project.featured} />
        </Reveal>
      ))}
    </ul>
  );
}

function OpenNotebook({ query, reduced, onClose }) {
  const ref = useRef(null);

  // Ao abrir, o foco entra no caderno (a capa que tinha o foco sai da tela)
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <m.div
      ref={ref}
      role="region"
      aria-label="Caderno de projetos aberto"
      tabIndex={-1}
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative outline-none"
    >
      {/* Sobre a margem transparente da foto: o caderno aberto fica na mesma posição da capa */}
      <TextButton onClick={onClose} className="absolute top-0 right-0 z-10 transition-colors">
        fechar caderno
      </TextButton>
      <ProjectsStates
        query={query}
        skeleton={spreadSkeleton}
        renderError={renderSpreadError}
        renderEmpty={renderSpreadEmpty}
      >
        {(projects) => <NotebookPages projects={projects} reduced={reduced} />}
      </ProjectsStates>
    </m.div>
  );
}

export default function ProjectsNotebook() {
  // Chamado na montagem da seção, não ao abrir: a busca roda enquanto a capa está fechada,
  // e ao abrir os projetos normalmente já estão prontos, sem skeleton
  const query = useHomeProjects();
  // Abaixo de 1024px as páginas da foto ficam estreitas demais para o texto
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [wasOpened, setWasOpened] = useState(false);

  const openNotebook = () => {
    setOpen(true);
    setWasOpened(true);
  };

  return (
    // Largura total com overflow-x-clip: a capa entra pela borda da tela (ver NotebookCover)
    // sem criar rolagem horizontal; diferente de hidden, não vira contêiner de rolagem
    <section
      id="projetos"
      aria-labelledby="projetos-titulo"
      className="below-fold w-full overflow-x-clip"
      style={{ containIntrinsicSize: 'auto 900px' }}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <h2 id="projetos-titulo" className="font-display mb-8 text-3xl italic">
          Projetos
        </h2>

        {/* Abaixo de 1024px, sem capa nem 3D: a lista já aparece aberta */}
        {!isDesktop ? (
          <ProjectsStates query={query} skeleton={listSkeleton}>
            {(projects) => <ProjectList projects={projects} />}
          </ProjectsStates>
        ) : (
          <div data-notebook className="[perspective:1600px]">
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <OpenNotebook
                  key="open"
                  query={query}
                  reduced={reduced}
                  onClose={() => setOpen(false)}
                />
              ) : (
                <NotebookCover
                  key="cover"
                  onOpen={openNotebook}
                  focusOnMount={wasOpened}
                  reduced={reduced}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
