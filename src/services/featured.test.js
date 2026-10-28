import { addFeatured, fetchFeatured } from '@/services/featured';
import { supabase } from '@/services/supabase';

vi.mock('@/services/supabase', () => ({ supabase: { from: vi.fn() } }));

const URL = 'https://projeto.supabase.co';
const KEY = 'sb_publishable_chave';

describe('fetchFeatured', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_SUPABASE_URL', URL);
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', KEY);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('lê pela API REST só com o cabeçalho apikey e devolve os nomes em ordem', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { repo_name: 'cp6-webdev', position: 0 },
        { repo_name: 'frota', position: 3 },
      ],
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchFeatured()).resolves.toEqual(['cp6-webdev', 'frota']);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${URL}/rest/v1/featured_projects?select=repo_name,position&order=position`);
    // Chave publishable não é JWT: nada de Authorization: Bearer
    expect(options.headers).toEqual({ apikey: KEY });
  });

  it('lança erro com o status HTTP quando a API falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(fetchFeatured()).rejects.toThrow('HTTP 503');
  });
});

describe('addFeatured', () => {
  // Encadeamento mínimo do query builder do supabase-js usado pelo service
  function mockTable({ maxPosition }) {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const limit = vi.fn().mockResolvedValue({
      data: maxPosition === null ? [] : [{ position: maxPosition }],
      error: null,
    });
    const order = vi.fn(() => ({ limit }));
    const select = vi.fn(() => ({ order }));
    vi.mocked(supabase.from).mockReturnValue({ select, insert });
    return { insert };
  }

  it('entra depois da maior posição atual, mesmo com buracos na sequência', async () => {
    // Ex.: posições 0 e 5 depois de remover as do meio: a próxima é 6, não 2
    const { insert } = mockTable({ maxPosition: 5 });
    await addFeatured('novo');
    expect(insert).toHaveBeenCalledWith({ repo_name: 'novo', position: 6 });
  });

  it('o primeiro destaque fica na posição 0', async () => {
    const { insert } = mockTable({ maxPosition: null });
    await addFeatured('primeiro');
    expect(insert).toHaveBeenCalledWith({ repo_name: 'primeiro', position: 0 });
  });
});
