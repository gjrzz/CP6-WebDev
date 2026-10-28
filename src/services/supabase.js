import { createClient } from '@supabase/supabase-js';

// Cliente único. Importe este módulo com import() dinâmico: o supabase-js (~50 KB gzip)
// fica fora do chunk inicial e só é baixado quando alguém vai usá-lo.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
