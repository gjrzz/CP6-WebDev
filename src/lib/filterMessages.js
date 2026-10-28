export const MESSAGE_FILTERS = [
  { value: 'todas', label: 'Todas', empty: 'Nenhuma mensagem ainda.' },
  { value: 'pendentes', label: 'Pendentes', empty: 'Nenhuma mensagem pendente.' },
  { value: 'respondidas', label: 'Respondidas', empty: 'Nenhuma mensagem respondida.' },
];

export const DEFAULT_FILTER = 'todas';

const predicates = {
  todas: () => true,
  pendentes: (message) => !message.answered,
  respondidas: (message) => message.answered,
};

// Valor da URL (?filtro=): qualquer coisa desconhecida ou ausente vira "todas"
export function parseFilter(value) {
  return Object.hasOwn(predicates, value) ? value : DEFAULT_FILTER;
}

export function filterMessages(messages, filter) {
  return messages.filter(predicates[parseFilter(filter)]);
}

// { todas: 5, pendentes: 3, respondidas: 2 }
export function countByFilter(messages) {
  return Object.fromEntries(
    MESSAGE_FILTERS.map(({ value }) => [value, filterMessages(messages, value).length]),
  );
}
