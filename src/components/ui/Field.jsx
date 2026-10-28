import { useId } from 'react';

const tones = {
  default: {
    label: 'text-muted',
    control: 'border-paper/30 text-paper focus-visible:border-paper',
    error: 'text-danger',
  },
  // Sobre papel (cartão de contato): cores fixas, iguais nos dois temas
  page: {
    label: 'text-page-muted',
    control: 'border-page-ink/40 text-page-ink focus-visible:border-page-ink',
    error: 'text-page-error',
  },
};

// Campo com label e erro ligados por aria-describedby. Recebe tudo por props
// (inclusive o `ref` e os handlers do register do React Hook Form).
export default function Field({ label, error, multiline = false, tone = 'default', ...props }) {
  const id = useId();
  const errorId = `${id}-erro`;
  const Control = multiline ? 'textarea' : 'input';
  const colors = tones[tone];

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={`font-mono text-xs tracking-widest uppercase ${colors.label}`}>
        {label}
      </label>
      <Control
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`border-b bg-transparent py-1.5 outline-none ${multiline ? 'min-h-28 resize-y' : ''} ${colors.control}`}
        {...props}
      />
      {error && (
        <p id={errorId} className={`text-xs ${colors.error}`}>
          {error}
        </p>
      )}
    </div>
  );
}
