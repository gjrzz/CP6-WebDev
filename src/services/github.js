const API_URL = 'https://api.github.com';

// O CI não tem .env: sem a variável, usa o usuário do portfólio
export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'gjrzz';

export class RateLimitError extends Error {
  constructor(resetAt) {
    super('Limite de requisições da API do GitHub atingido');
    this.name = 'RateLimitError';
    this.resetAt = resetAt;
  }
}

// 403 só é limite quando a cota acabou; os outros 403 são erro comum
function isRateLimited(response) {
  if (response.status === 429) return true;
  return response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0';
}

function getResetAt(headers) {
  const reset = Number(headers.get('x-ratelimit-reset'));
  if (reset) return new Date(reset * 1000);

  // O limite secundário (429) costuma mandar só retry-after, em segundos
  const retryAfter = Number(headers.get('retry-after'));
  if (retryAfter) return new Date(Date.now() + retryAfter * 1000);

  return null;
}

export function toProject(repo) {
  return {
    name: repo.name,
    description: repo.description,
    language: repo.language,
    updatedAt: repo.updated_at,
    htmlUrl: repo.html_url,
    homepage: repo.homepage || null,
    topics: repo.topics ?? [],
    stars: repo.stargazers_count,
  };
}

export async function fetchRepos() {
  const response = await fetch(
    `${API_URL}/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?sort=updated&per_page=100`,
    { headers: { Accept: 'application/vnd.github+json' } },
  );

  if (isRateLimited(response)) throw new RateLimitError(getResetAt(response.headers));
  if (!response.ok) throw new Error(`A API do GitHub respondeu ${response.status}`);

  const repos = await response.json();
  return repos.filter((repo) => !repo.fork && !repo.archived).map(toProject);
}
