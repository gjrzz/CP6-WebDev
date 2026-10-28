import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { getInitialTheme, storeTheme } from '@/lib/theme';

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Só salva quando o visitante escolhe; até lá, vale a preferência do sistema
  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    storeTheme(next);
    setTheme(next);
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
