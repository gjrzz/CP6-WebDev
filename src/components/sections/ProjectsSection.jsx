import ProjectCard from '@/components/ui/ProjectCard';
import ProjectCardSkeleton from '@/components/ui/ProjectCardSkeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { useGithubRepos } from '@/hooks/useGithubRepos';
import { getGithubErrorText } from '@/lib/githubErrors';

const SKELETON_COUNT = 6;
const grid = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3';

// Seção temporária: o caderno de projetos (feature/projects-notebook) substitui esta grade
export default function ProjectsSection() {
  const { data: projects, error, isPending, isFetching, refetch } = useGithubRepos();
  const errorText = error && getGithubErrorText(error, 'os projetos');

  let content;
  if (isPending || (isFetching && !projects)) {
    content = (
      <div aria-busy="true" className={grid}>
        <span className="sr-only">Carregando projetos…</span>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    );
  } else if (!projects) {
    content = <ErrorState {...errorText} onRetry={refetch} />;
  } else if (projects.length === 0) {
    content = <EmptyState message="Nenhum projeto público por aqui ainda." />;
  } else {
    content = (
      <>
        {/* Com cache disponível, o erro vira só um aviso acima dos cards salvos */}
        {errorText && (
          <p role="status" className="text-muted mb-4 text-sm">
            Mostrando a última lista salva. {errorText.title}. {errorText.message}
          </p>
        )}
        <ul className={grid}>
          {projects.map((project) => (
            <li key={project.name}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <section
      id="projetos"
      aria-labelledby="projetos-titulo"
      className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8"
    >
      <h2 id="projetos-titulo" className="font-display mb-8 text-3xl italic">
        Projetos
      </h2>
      {content}
    </section>
  );
}
