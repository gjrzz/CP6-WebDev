import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';
import TextButton from '@/components/ui/TextButton';
import { formatDateTime } from '@/lib/formatDate';

// Acima disso o texto passa de 2 linhas no card e ganha "ver mais"
const LONG_MESSAGE = 160;

// Uma mensagem recebida. Os dados e a ação de marcar chegam por props.
export default function MessageItem({ message, onToggle, toggling = false }) {
  const { id, name, email, message: text, answered, createdAt } = message;
  const [expanded, setExpanded] = useState(false);
  const textId = `mensagem-${id}`;
  const reply = `mailto:${email}?subject=${encodeURIComponent('Re: contato pelo portfólio')}`;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display truncate text-xl">{name}</h3>
          <TextButton href={reply}>{email}</TextButton>
        </div>
        <Tag variant={answered ? 'default' : 'accent'}>{answered ? 'respondida' : 'pendente'}</Tag>
      </div>

      <p id={textId} className={`text-sm whitespace-pre-line ${expanded ? '' : 'line-clamp-2'}`}>
        {text}
      </p>
      {text.length > LONG_MESSAGE && (
        <TextButton
          aria-expanded={expanded}
          aria-controls={textId}
          onClick={() => setExpanded((value) => !value)}
          className="self-start"
        >
          {expanded ? 'ver menos' : 'ver mais'}
        </TextButton>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <time dateTime={createdAt} className="text-muted font-mono text-xs">
          {formatDateTime(createdAt)}
        </time>
        <Button variant="ghost" loading={toggling} onClick={() => onToggle(!answered)}>
          {answered ? 'marcar como pendente' : 'marcar como respondida'}
        </Button>
      </div>
    </Card>
  );
}
