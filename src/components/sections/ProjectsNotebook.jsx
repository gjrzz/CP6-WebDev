import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import Button from '@/components/ui/Button';
import ProjectCard from '@/components/ui/ProjectCard';
import ProjectCardSkeleton from '@/components/ui/ProjectCardSkeleton';
import Reveal from '@/components/ui/Reveal';
import NotebookCover from '@/components/sections/NotebookCover';
import NotebookPages from '@/components/sections/NotebookPages';
import ProjectsStates from '@/components/sections/ProjectsStates';
import { useGithubRepos } from '@/hooks/useGithubRepos';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { orderProjects } from '@/lib/orderProjects';
import { tiltFor } from '@/lib/tilt';

const spreadSkeleton = (
  <div className="grid grid-cols-2 gap-8">
    {[0, 1].map((side) => (
      <div key={side} className="flex flex-col gap-4">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    ))}
  </div>
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
      className="border-paper/10 bg-paper/5 rounded-2xl border p-8 outline-none"
    >
      <div className="mb-6 flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          Fechar caderno
        </Button>
      </div>
      <ProjectsStates query={query} skeleton={spreadSkeleton}>
        {(projects) => <NotebookPages projects={orderProjects(projects)} reduced={reduced} />}
      </ProjectsStates>
    </m.div>
  );
}

export default function ProjectsNotebook() {
  // Chamado na montagem da seção, não ao abrir: a busca roda enquanto a capa está fechada,
  // e ao abrir os cards normalmente já estão prontos, sem skeleton
  const query = useGithubRepos();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [wasOpened, setWasOpened] = useState(false);

  const openNotebook = () => {
    setOpen(true);
    setWasOpened(true);
  };

  return (
    <section
      id="projetos"
      aria-labelledby="projetos-titulo"
      className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8"
    >
      <h2 id="projetos-titulo" className="font-display mb-8 text-3xl italic">
        Projetos
      </h2>

      {/* No celular, sem capa nem 3D: a lista já aparece aberta */}
      {!isDesktop ? (
        <ProjectsStates query={query} skeleton={listSkeleton}>
          {(projects) => <ProjectList projects={orderProjects(projects)} />}
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
    </section>
  );
}
