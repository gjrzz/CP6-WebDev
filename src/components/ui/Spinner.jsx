export default function Spinner({ label = 'Carregando', className = '' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block size-5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}
