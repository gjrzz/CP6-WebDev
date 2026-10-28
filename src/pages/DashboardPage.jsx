import Button from '@/components/ui/Button';
import MessagesPanel from '@/components/dashboard/MessagesPanel';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLogout } from '@/hooks/useLogout';

// Carregada com React.lazy (ver router.jsx): fora do bundle inicial.
// Os destaques entram na próxima tarefa.
export default function DashboardPage() {
  useDocumentTitle('Dashboard · Gabriel Juarez');
  const { session } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl italic">Dashboard</h1>
          <p className="text-muted mt-1 font-mono text-xs">{session?.user?.email}</p>
        </div>
        <Button variant="ghost" loading={isPending} onClick={() => logout()}>
          Sair
        </Button>
      </div>
      <MessagesPanel />
    </section>
  );
}
