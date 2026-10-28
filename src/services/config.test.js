import { getSupabaseConfig } from '@/services/config';

describe('getSupabaseConfig', () => {
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('devolve URL e chave válidas', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://projeto.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable_abc');
    expect(getSupabaseConfig()).toEqual({
      url: 'https://projeto.supabase.co',
      key: 'sb_publishable_abc',
    });
  });

  it('acusa variável vazia com o nome dela', () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable_abc');
    expect(() => getSupabaseConfig()).toThrow('VITE_SUPABASE_URL não configurada');
  });

  it('acusa chave com quebra de linha (o erro que aconteceu na Vercel)', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://projeto.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable_abc\nsb_publishable_abc');
    expect(() => getSupabaseConfig()).toThrow(
      'VITE_SUPABASE_ANON_KEY inválida: contém espaço ou quebra de linha',
    );
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('VITE_SUPABASE_ANON_KEY'));
  });
});
