import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Skeleton from '@/components/ui/Skeleton';
import MessageItem from '@/components/dashboard/MessageItem';
import { useMarkAnswered } from '@/hooks/useMarkAnswered';
import { useMessageFilter } from '@/hooks/useMessageFilter';
import { useMessages } from '@/hooks/useMessages';
import { countByFilter, filterMessages, MESSAGE_FILTERS } from '@/lib/filterMessages';

function MessagesSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <span className="sr-only">Carregando mensagens…</span>
      {[0, 1, 2].map((item) => (
        <Card key={item} className="flex flex-col gap-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </Card>
      ))}
    </div>
  );
}

export default function MessagesPanel() {
  const { data: messages, isPending, isError, refetch } = useMessages();
  const [filter, setFilter] = useMessageFilter();
  const markAnswered = useMarkAnswered();
  const counts = messages ? countByFilter(messages) : null;
  const current = MESSAGE_FILTERS.find((option) => option.value === filter);

  let content;
  if (isPending) {
    content = <MessagesSkeleton />;
  } else if (isError) {
    content = (
      <ErrorState
        title="Não foi possível carregar as mensagens"
        message="Verifique sua conexão."
        onRetry={refetch}
      />
    );
  } else {
    const visible = filterMessages(messages, filter);
    content =
      visible.length === 0 ? (
        <EmptyState message={current.empty} />
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((message) => (
            <li key={message.id}>
              <MessageItem
                message={message}
                toggling={markAnswered.isPending && markAnswered.variables?.id === message.id}
                onToggle={(answered) => markAnswered.mutate({ id: message.id, answered })}
              />
            </li>
          ))}
        </ul>
      );
  }

  return (
    <section aria-labelledby="mensagens-titulo" className="flex flex-col gap-6">
      <h2 id="mensagens-titulo" className="font-display text-2xl italic">
        Mensagens
      </h2>

      <div role="group" aria-label="Filtrar mensagens" className="flex flex-wrap gap-2">
        {MESSAGE_FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={filter === option.value}
            onClick={() => setFilter(option.value)}
            className="border-paper/30 aria-pressed:bg-paper aria-pressed:text-ink hover:border-paper focus-visible:outline-accent rounded-full border px-4 py-1.5 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {option.label}
            {counts && ` (${counts[option.value]})`}
          </button>
        ))}
      </div>

      {markAnswered.isError && (
        <p role="alert" className="text-danger text-sm">
          Não foi possível atualizar a mensagem. O status voltou ao anterior; tente de novo.
        </p>
      )}

      {content}
    </section>
  );
}
