import { createContext } from 'react';

// Separado do ThemeProvider para o Fast Refresh (o arquivo do componente só exporta componentes)
export const ThemeContext = createContext(null);
