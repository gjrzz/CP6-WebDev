import { Link, useParams } from 'react-router';
import ErrorState from '@/components/ui/ErrorState';
import ProjectDetails, { ProjectDetailsSkeleton } from '@/components/ui/ProjectDetails';
import NotFoundPage from '@/pages/NotFoundPage';
import { useGithubRepo } from '@/hooks/useGithubRepo';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getGithubErrorText } from '@/lib/githubErrors';
import { RepoNotFoundError } from '@/services/github';

export default function ProjectPage() {
  const { slug } = useParams();
  const { data: project, error, isPending, isFetching, refetch } = useGithubRepo(slug);
  useDocumentTitle(project && `${project.name} · Gabriel Juarez`);

  if (error instanceof RepoNotFoundError) return <NotFoundPage />;

  const errorText = error && getGithubErrorText(error, 'o projeto');

  let content;
  if (isPending || (isFetching && !project)) {
    content = <ProjectDetailsSkeleton />;
  } else if (!project) {
    content = <ErrorState {...errorText} onRetry={refetch} />;
  } else {
    content = (
      <>
        {/* Com dados salvos, o erro vira só um aviso */}
        {errorText && (
          <p role="status" className="text-muted mb-4 text-sm">
            Mostrando os dados salvos. {errorText.title}. {errorText.message}
          </p>
        )}
        <ProjectDetails project={project} />
      </>
    );
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 md:px-8">
      <Link
        to="/#projetos"
        className="text-muted hover:text-paper focus-visible:outline-accent mb-10 inline-block rounded text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        ← Voltar aos projetos
      </Link>
      {content}
    </article>
  );
}
