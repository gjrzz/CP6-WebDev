// Carrega o cliente só quando precisa (ver services/supabase.js)
export function preloadMessages() {
  return import('@/services/supabase');
}

export async function saveMessage({ name, email, message }) {
  const { supabase } = await preloadMessages();
  // Sem .select() depois do insert: o visitante não tem permissão de leitura em messages
  const { error } = await supabase.from('messages').insert({ name, email, message });
  if (error) throw new Error(`Não foi possível salvar a mensagem: ${error.message}`);
}
