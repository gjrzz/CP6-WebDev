const FEATURED_CACHE_KEY = 'github-featured';

// Última lista de destaques (nomes, em ordem), como o reposCache faz com os repositórios:
// a home já abre na ordem certa, sem esperar o Supabase
export function readFeaturedCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(FEATURED_CACHE_KEY));
    if (Array.isArray(cache?.names) && Number.isFinite(cache.savedAt)) return cache;
  } catch {
    // localStorage bloqueado ou conteúdo corrompido: segue sem cache
  }
  return null;
}

export function writeFeaturedCache(names) {
  try {
    localStorage.setItem(FEATURED_CACHE_KEY, JSON.stringify({ names, savedAt: Date.now() }));
  } catch {
    // Sem persistência, o cache em memória do TanStack Query ainda vale nesta visita
  }
}
