import { useEffect, useState } from 'react';

// true depois que o navegador fica ocioso pela primeira vez após a montagem (ou depois de
// `timeout` ms, o que vier antes). Para adiar o que não precisa estar no primeiro carregamento.
export function useIdle(timeout = 1500) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    // Safari não tem requestIdleCallback: cai no setTimeout
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdle(true), timeout);
    return () => clearTimeout(id);
  }, [timeout]);

  return idle;
}
