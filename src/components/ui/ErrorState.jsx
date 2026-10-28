import Button from '@/components/ui/Button';

export default function ErrorState({
  title = 'Algo deu errado',
  message,
  onRetry,
  className = '',
}) {
  return (
    <div role="alert" className={`flex flex-col items-center gap-3 py-10 text-center ${className}`}>
      <p className="font-display text-xl">{title}</p>
      {message && <p className="text-muted text-sm">{message}</p>}
      {onRetry && (
        <Button variant="ghost" onClick={onRetry}>
          Tentar de novo
        </Button>
      )}
    </div>
  );
}
