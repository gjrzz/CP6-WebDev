const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });
const timeFormatter = new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' });
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

// "12 de out. de 2026"
export function formatDate(value) {
  return dateFormatter.format(new Date(value));
}

// "14:32"
export function formatTime(value) {
  return timeFormatter.format(new Date(value));
}

// "28/10/2026, 14:32"
export function formatDateTime(value) {
  return dateTimeFormatter.format(new Date(value));
}
