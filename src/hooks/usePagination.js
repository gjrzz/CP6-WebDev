import { useState } from 'react';

// Paginação de uma lista em memória. `direction` (1 ou -1) diz para que lado animar a troca.
export function usePagination(items, perPage) {
  const [state, setState] = useState({ page: 0, direction: 0 });
  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  // Se a lista diminuir e a página atual deixar de existir, volta para a primeira
  const page = state.page < pageCount ? state.page : 0;

  const goTo = (target, direction) => {
    if (target < 0 || target >= pageCount) return;
    setState({ page: target, direction });
  };

  return {
    page,
    pageCount,
    direction: state.direction,
    pageItems: items.slice(page * perPage, (page + 1) * perPage),
    hasPrev: page > 0,
    hasNext: page < pageCount - 1,
    next: () => goTo(page + 1, 1),
    prev: () => goTo(page - 1, -1),
  };
}
