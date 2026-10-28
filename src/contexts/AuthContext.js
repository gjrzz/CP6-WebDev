import { createContext } from 'react';

// Separado do AuthProvider para o Fast Refresh (o arquivo do componente só exporta componentes)
export const AuthContext = createContext(null);
