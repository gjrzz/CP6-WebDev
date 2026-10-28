const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });
const timeFormatter = new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' });

// "12 de out. de 2026"
export function formatDate(value) {
  return dateFormatter.format(new Date(value));
}

// "14:32"
export function formatTime(value) {
  return timeFormatter.format(new Date(value));
}
