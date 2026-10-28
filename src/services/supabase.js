import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/services/config';

// Cliente único. Importe este módulo com import() dinâmico: o supabase-js (~50 KB gzip)
// fica fora do chunk inicial e só é baixado quando alguém vai usá-lo.
const { url, key } = getSupabaseConfig();
export const supabase = createClient(url, key);
