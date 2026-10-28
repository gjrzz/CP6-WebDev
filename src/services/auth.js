// Supabase Auth carregado sob demanda (ver services/supabase.js): só as rotas de login e
// dashboard chegam aqui, então a home não baixa o SDK.
async function getClient() {
  const { supabase } = await import('@/services/supabase');
  return supabase;
}

export class InvalidCredentialsError extends Error {
  constructor(options) {
    super('E-mail ou senha incorretos', options);
    this.name = 'InvalidCredentialsError';
  }
}

export async function getSession() {
  const supabase = await getClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error('Não foi possível verificar a sessão', { cause: error });
  return data.session;
}

export async function signIn({ email, password }) {
  const supabase = await getClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // 400 = credenciais inválidas; o resto (rede, servidor) é erro genérico
    if (error.status === 400) throw new InvalidCredentialsError({ cause: error });
    throw new Error('Não foi possível entrar agora', { cause: error });
  }
  return data.session;
}

export async function signOut() {
  const supabase = await getClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Não foi possível sair', { cause: error });
}

// Avisa a cada mudança de sessão (login, logout, token renovado). Devolve a função que cancela.
export async function onAuthChange(callback) {
  const supabase = await getClient();
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}
