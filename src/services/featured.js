import { getSupabaseConfig } from '@/services/config';

// Leitura pública pela API REST, sem o SDK: a home lê os destaques sem baixar o supabase-js.
// A chave publishable não é JWT, então vai só no cabeçalho apikey (sem Authorization: Bearer).
export async function fetchFeatured() {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/featured_projects?select=repo_name,position&order=position`,
    { headers: { apikey: key } },
  );
  if (!response.ok) {
    throw new Error(`Não foi possível carregar os destaques (HTTP ${response.status})`);
  }
  const rows = await response.json();
  return rows.map((row) => row.repo_name);
}

// Escrita só no dashboard (dono autenticado), pelo SDK que já está carregado ali
async function getClient() {
  const { supabase } = await import('@/services/supabase');
  return supabase;
}

export async function addFeatured(repoName) {
  const supabase = await getClient();
  // Próxima posição a partir do maior valor atual (não do tamanho da lista):
  // depois de remover um item do meio, a posição nova não repete uma existente
  const { data, error } = await supabase
    .from('featured_projects')
    .select('position')
    .order('position', { ascending: false })
    .limit(1);
  if (error) throw new Error('Não foi possível ler os destaques', { cause: error });

  const position = data.length > 0 ? data[0].position + 1 : 0;
  const { error: insertError } = await supabase
    .from('featured_projects')
    .insert({ repo_name: repoName, position });
  if (insertError) throw new Error('Não foi possível destacar o projeto', { cause: insertError });
}

export async function removeFeatured(repoName) {
  const supabase = await getClient();
  const { error } = await supabase.from('featured_projects').delete().eq('repo_name', repoName);
  if (error) throw new Error('Não foi possível tirar o destaque', { cause: error });
}
