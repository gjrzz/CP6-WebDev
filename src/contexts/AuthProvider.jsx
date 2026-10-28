import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { getSession, onAuthChange } from '@/services/auth';

// Sessão do Supabase: `loading` até a primeira leitura terminar, para a rota protegida
// não redirecionar antes de saber se o dono está logado.
export default function AuthProvider({ children }) {
  const [state, setState] = useState({ session: null, loading: true });

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    getSession()
      .then((session) => active && setState({ session, loading: false }))
      // Sem conseguir ler a sessão, trata como deslogado (a rota protegida manda para o login)
      .catch(() => active && setState({ session: null, loading: false }));

    onAuthChange((session) => active && setState({ session, loading: false })).then((stop) => {
      if (active) unsubscribe = stop;
      else stop();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <AuthContext value={value}>{children}</AuthContext>;
}
