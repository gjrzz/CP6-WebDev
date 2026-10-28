import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Skeleton from '@/components/ui/Skeleton';
import Tag from '@/components/ui/Tag';
import { useFeatured } from '@/hooks/useFeatured';
import { useGithubRepos } from '@/hooks/useGithubRepos';
import { useToggleFeatured } from '@/hooks/useToggleFeatured';
import { splitFeatured } from '@/lib/orderProjects';

function FeaturedSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-3">
      <span className="sr-only">Carregando projetos…</span>
      {[0, 1, 2, 3].map((row) => (
        <Skeleton key={row} className="h-16 w-full rounded-2xl" />
      ))}
    </div>
  );
}

function RepoRow({ repo, position, toggling, onToggle }) {
  const featured = position !== null;
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="flex min-w-0 items-center gap-3">
        {featured && (
          <Tag variant="accent" aria-label={`destaque número ${position}`}>
            #{position}
          </Tag>
        )}
        <div className="min-w-0">
          <h3 className="font-display truncate text-lg">{repo.name}</h3>
          {repo.description && <p className="text-muted truncate text-xs">{repo.description}</p>}
        </div>
      </div>
      <Button variant="ghost" loading={toggling} onClick={() => onToggle(!featured)}>
        {featured ? 'tirar do destaque' : 'destacar'}
      </Button>
    </Card>
  );
}

// Escolhe os projetos em destaque da home. A ordem é a da seleção: destacar entra no fim.
export default function FeaturedPanel() {
  const repos = useGithubRepos();
  const featured = useFeatured();
  const toggle = useToggleFeatured();

  let content;
  if (repos.isPending || featured.isPending) {
    content = <FeaturedSkeleton />;
  } else if (repos.isError || featured.isError) {
    const failed = repos.isError ? repos : featured;
    content = (
      <ErrorState
        title={
          repos.isError
            ? 'Não foi possível carregar os projetos'
            : 'Não foi possível carregar os destaques'
        }
        message="Verifique sua conexão."
        onRetry={failed.refetch}
      />
    );
  } else if (repos.data.length === 0) {
    content = <EmptyState message="Nenhum repositório público para destacar." />;
  } else {
    // Destacados primeiro, na ordem; sem o fallback dos 3 recentes da home
    const { featured: chosen, others } = splitFeatured(repos.data, featured.data);
    const rows = [
      ...chosen.map((repo, index) => ({ repo, position: index + 1 })),
      ...others.map((repo) => ({ repo, position: null })),
    ];
    content = (
      <ul className="flex flex-col gap-3">
        {rows.map(({ repo, position }) => (
          <li key={repo.name}>
            <RepoRow
              repo={repo}
              position={position}
              toggling={toggle.isPending && toggle.variables?.name === repo.name}
              onToggle={(value) => toggle.mutate({ name: repo.name, featured: value })}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section aria-labelledby="destaques-titulo" className="flex flex-col gap-6">
      <div>
        <h2 id="destaques-titulo" className="font-display text-2xl italic">
          Destaques da home
        </h2>
        <p className="text-muted mt-1 text-sm">
          Aparecem primeiro no caderno, nesta ordem. Sem nenhum destaque, a home usa os 3 mais
          recentes.
        </p>
      </div>

      {toggle.isError && (
        <p role="alert" className="text-danger text-sm">
          Não foi possível salvar o destaque. A lista voltou ao anterior; tente de novo.
        </p>
      )}

      {content}
    </section>
  );
}
