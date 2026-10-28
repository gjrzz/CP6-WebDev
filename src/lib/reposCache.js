const REPOS_CACHE_KEY = 'github-repos';

// Última lista que veio da API, para sobreviver ao limite de requisições entre visitas
export function readReposCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(REPOS_CACHE_KEY));
    if (Array.isArray(cache?.repos) && Number.isFinite(cache.savedAt)) return cache;
  } catch {
    // localStorage bloqueado ou conteúdo corrompido: segue sem cache
  }
  return null;
}

export function writeReposCache(repos) {
  try {
    localStorage.setItem(REPOS_CACHE_KEY, JSON.stringify({ repos, savedAt: Date.now() }));
  } catch {
    // Sem persistência, o cache em memória do TanStack Query ainda vale nesta visita
  }
}
