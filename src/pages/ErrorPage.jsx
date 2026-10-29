import { useRouteError } from 'react-router';
import StatusPage from '@/components/layout/StatusPage';

export default function ErrorPage() {
  const error = useRouteError();
  if (import.meta.env.DEV) console.error(error);

  return <StatusPage title="Algo deu errado." message="Tente recarregar a página em instantes." />;
}
