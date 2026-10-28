// Valida as variáveis do Supabase com mensagem clara. Sem isso, um valor vazio ou colado
// com quebra de linha (aconteceu na Vercel) só aparece como erro genérico na tela.
function check(name, value) {
  let problem = null;
  if (!value) problem = `${name} não configurada (veja .env.example)`;
  else if (/\s/.test(value)) problem = `${name} inválida: contém espaço ou quebra de linha`;

  if (problem) {
    // Intencional: é o que aparece no DevTools quando o deploy está mal configurado
    console.error(`[supabase] ${problem}`);
    throw new Error(problem);
  }
  return value;
}

export function getSupabaseConfig() {
  return {
    url: check('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
    key: check('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
  };
}
