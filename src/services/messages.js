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

function toMessage(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    answered: row.answered,
    createdAt: row.created_at,
  };
}

// Só o dono autenticado lê (RLS); mais recentes primeiro
export async function listMessages() {
  const { supabase } = await preloadMessages();
  const { data, error } = await supabase
    .from('messages')
    .select('id, name, email, message, answered, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Não foi possível carregar as mensagens', { cause: error });
  return data.map(toMessage);
}

export async function setAnswered(id, answered) {
  const { supabase } = await preloadMessages();
  const { error } = await supabase.from('messages').update({ answered }).eq('id', id);
  if (error) throw new Error('Não foi possível atualizar a mensagem', { cause: error });
}
