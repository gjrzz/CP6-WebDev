import { fetchRepos, RateLimitError } from '@/services/github';

function mockResponse({ status = 200, body = [], headers = {} }) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => headers[name] ?? null },
    json: async () => body,
  };
}

const repo = {
  name: 'meu-app',
  description: 'Um app',
  language: 'JavaScript',
  updated_at: '2026-10-12T15:00:00Z',
  html_url: 'https://github.com/gjrzz/meu-app',
  homepage: '',
  topics: ['react'],
  stargazers_count: 3,
  fork: false,
  archived: false,
};

describe('fetchRepos', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('remove forks e arquivados e mapeia só os campos usados', async () => {
    const body = [
      repo,
      { ...repo, name: 'fork', fork: true },
      { ...repo, name: 'antigo', archived: true },
    ];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse({ body })));

    await expect(fetchRepos()).resolves.toEqual([
      {
        name: 'meu-app',
        description: 'Um app',
        language: 'JavaScript',
        updatedAt: '2026-10-12T15:00:00Z',
        htmlUrl: 'https://github.com/gjrzz/meu-app',
        homepage: null,
        topics: ['react'],
        stars: 3,
      },
    ]);
  });

  it('lança RateLimitError com o horário de reset no 403 sem cota', async () => {
    const response = mockResponse({
      status: 403,
      headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1793200000' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    const error = await fetchRepos().catch((err) => err);
    expect(error).toBeInstanceOf(RateLimitError);
    expect(error.resetAt).toEqual(new Date(1793200000 * 1000));
  });

  it('lança RateLimitError no 429', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse({ status: 429 })));
    await expect(fetchRepos()).rejects.toBeInstanceOf(RateLimitError);
  });

  it('trata o 403 com cota restante como erro comum', async () => {
    const response = mockResponse({ status: 403, headers: { 'x-ratelimit-remaining': '42' } });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    const error = await fetchRepos().catch((err) => err);
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(RateLimitError);
  });
});
