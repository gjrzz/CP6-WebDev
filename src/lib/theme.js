export const THEME_STORAGE_KEY = 'theme';

const THEMES = ['light', 'dark'];

// Mesma ordem do script inline do index.html: tema já aplicado → salvo → sistema
export function getInitialTheme() {
  const applied = document.documentElement.dataset.theme;
  if (THEMES.includes(applied)) return applied;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (THEMES.includes(stored)) return stored;
  } catch {
    // localStorage bloqueado (modo privado, cookies desativados): segue o sistema
  }

  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function storeTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Sem persistência, o tema ainda vale até recarregar a página
  }
}
