import { Navigate, useLocation } from 'react-router';
import { PageSpinner } from '@/components/layout/AuthLayout';
import { useAuth } from '@/hooks/useAuth';

// Sem sessão, manda para o login guardando a origem (o login volta para cá depois)
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageSpinner label="Verificando acesso" />;
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
