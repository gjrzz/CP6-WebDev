import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRepo, RateLimitError, RepoNotFoundError } from '@/services/github';
import { GITHUB_REPOS_KEY } from '@/hooks/useGithubRepos';
import { readReposCache } from '@/lib/reposCache';

// Nomes de repositório no GitHub não diferenciam maiúsculas
function findBySlug(repos, slug) {
  return repos?.find((repo) => repo.name.toLowerCase() === slug);
}

// Procura o projeto na listagem já carregada (memória, depois localStorage),
// para abrir a página vindo da home ou de um F5 sem nova requisição
function getCachedRepo(queryClient, slug) {
  const listState = queryClient.getQueryState(GITHUB_REPOS_KEY);
  const fromMemory = findBySlug(listState?.data, slug);
  if (fromMemory) return { data: fromMemory, updatedAt: listState.dataUpdatedAt };

  const stored = readReposCache();
  const fromStorage = findBySlug(stored?.repos, slug);
  if (fromStorage) return { data: fromStorage, updatedAt: stored.savedAt };

  return null;
}

export function useGithubRepo(slug) {
  const queryClient = useQueryClient();
  const normalizedSlug = slug.toLowerCase();

  return useQuery({
    queryKey: ['github', 'repo', normalizedSlug],
    queryFn: () => fetchRepo(normalizedSlug),
    initialData: () => getCachedRepo(queryClient, normalizedSlug)?.data,
    initialDataUpdatedAt: () => getCachedRepo(queryClient, normalizedSlug)?.updatedAt,
    // Repetir não muda um 404 nem um limite que ainda não resetou
    retry: (failureCount, error) =>
      !(error instanceof RateLimitError || error instanceof RepoNotFoundError) && failureCount < 1,
  });
}
