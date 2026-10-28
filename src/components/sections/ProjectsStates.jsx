import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { getGithubErrorText } from '@/lib/githubErrors';

const EMPTY_MESSAGE = 'Nenhum projeto público por aqui ainda.';

const defaultError = (errorText, onRetry) => <ErrorState {...errorText} onRetry={onRetry} />;
const defaultEmpty = (message) => <EmptyState message={message} />;

// Estados da busca de projetos, iguais no caderno (desktop) e na lista (celular).
// `children` recebe a lista quando há dados; `skeleton`, `renderError` e `renderEmpty`
// trocam o visual de cada estado (no caderno, eles aparecem "escritos" na página).
export default function ProjectsStates({
  query,
  skeleton,
  renderError = defaultError,
  renderEmpty = defaultEmpty,
  children,
}) {
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
  if (!projects) return renderError(errorText, refetch);
  if (projects.length === 0) return renderEmpty(EMPTY_MESSAGE);

  return (
    <>
      {/* Com cache disponível, o erro vira só um aviso acima dos projetos salvos */}
      {errorText && (
        <p role="status" className="text-muted mb-4 text-sm">
          Mostrando a última lista salva. {errorText.title}. {errorText.message}
        </p>
      )}
      {children(projects)}
    </>
  );
}
