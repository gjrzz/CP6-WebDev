import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { getGithubErrorText } from '@/lib/githubErrors';

// Estados da busca de projetos, iguais no caderno (desktop) e na lista (celular).
// `children` recebe a lista quando há dados; `skeleton` tem o formato de cada layout.
export default function ProjectsStates({ query, skeleton, children }) {
  const { data: projects, error, isPending, isFetching, refetch } = query;
  const errorText = error && getGithubErrorText(error, 'os projetos');

  if (isPending || (isFetching && !projects)) {
    return (
      <div aria-busy="true">
        <span className="sr-only">Carregando projetos…</span>
        {skeleton}
      </div>
    );
  }
  if (!projects) return <ErrorState {...errorText} onRetry={refetch} />;
  if (projects.length === 0) return <EmptyState message="Nenhum projeto público por aqui ainda." />;

  return (
    <>
      {/* Com cache disponível, o erro vira só um aviso acima dos cards salvos */}
      {errorText && (
        <p role="status" className="text-muted mb-4 text-sm">
          Mostrando a última lista salva. {errorText.title}. {errorText.message}
        </p>
      )}
      {children(projects)}
    </>
  );
}
