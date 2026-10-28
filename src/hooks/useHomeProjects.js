import { useEffect, useMemo, useState } from 'react';
import { useFeatured } from '@/hooks/useFeatured';
import { useGithubRepos } from '@/hooks/useGithubRepos';
import { orderProjects } from '@/lib/orderProjects';

// Tempo máximo esperando os destaques sem cache antes de mostrar a ordem padrão
export const FEATURED_WAIT_MS = 1500;

// Repositórios do GitHub já na ordem da home (destaques primeiro), no mesmo formato de
// query que o ProjectsStates espera. Os destaques nunca prendem o caderno:
// - com cache no localStorage, a ordem certa aparece na hora;
// - sem cache, espera até 1,5 s; depois mostra a ordem padrão e reordena quando chegarem;
// - se a leitura falhar, fica a ordem padrão (os 3 mais recentes em destaque).
export function useHomeProjects() {
  const repos = useGithubRepos();
  const featured = useFeatured();
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    if (!featured.isPending) return;
    const timer = setTimeout(() => setGaveUp(true), FEATURED_WAIT_MS);
    return () => clearTimeout(timer);
  }, [featured.isPending]);

  const waitingFeatured = featured.isPending && !gaveUp;
  const data = useMemo(
    () => repos.data && orderProjects(repos.data, featured.data),
    [repos.data, featured.data],
  );

  return {
    data,
    error: repos.error,
    isPending: repos.isPending || waitingFeatured,
    isFetching: repos.isFetching,
    refetch: repos.refetch,
  };
}
