import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRepos, RateLimitError } from '@/services/github';
import { readReposCache, writeReposCache } from '@/lib/reposCache';

export const GITHUB_REPOS_KEY = ['github', 'repos'];

async function fetchAndCacheRepos() {
  const repos = await fetchRepos();
  writeReposCache(repos);
  return repos;
}

export function useGithubRepos() {
  // Cache salvo entra como dado inicial: com menos de 10 min (staleTime global), nem chama a API
  const [cached] = useState(readReposCache);

  return useQuery({
    queryKey: GITHUB_REPOS_KEY,
    queryFn: fetchAndCacheRepos,
    initialData: cached?.repos,
    initialDataUpdatedAt: cached?.savedAt,
    // Repetir não adianta enquanto o limite não reseta
    retry: (failureCount, error) => !(error instanceof RateLimitError) && failureCount < 1,
  });
}
