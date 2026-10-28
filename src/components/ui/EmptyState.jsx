export default function EmptyState({ message, children, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-3 py-10 text-center ${className}`}>
      <p className="text-muted text-sm">{message}</p>
      {children}
    </div>
  );
}
