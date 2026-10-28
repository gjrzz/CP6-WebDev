import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLogout } from '@/hooks/useLogout';

// Carregada com React.lazy (ver router.jsx): fora do bundle inicial.
// Mensagens e destaques entram nas próximas tarefas.
export default function DashboardPage() {
  useDocumentTitle('Dashboard · Gabriel Juarez');
  const { session } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl italic">Dashboard</h1>
          <p className="text-muted mt-1 font-mono text-xs">{session?.user?.email}</p>
        </div>
        <Button variant="ghost" loading={isPending} onClick={() => logout()}>
          Sair
        </Button>
      </div>
    </section>
  );
}
