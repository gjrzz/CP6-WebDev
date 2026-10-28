import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Rola até o elemento do #hash depois de navegar com <Link to="/#secao">.
// Roda no layout, depois que a página filha montou, então o id já está no DOM.
export function useScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const element = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!element) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [pathname, hash]);
}
