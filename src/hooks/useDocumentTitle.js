import { useEffect } from 'react';

// Define o título da aba e devolve o anterior ao sair da página
export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
