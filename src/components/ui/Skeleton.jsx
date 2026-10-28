// Pulse anima só opacity; com prefers-reduced-motion fica parado
export default function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-paper/10 rounded-md motion-safe:animate-pulse ${className}`}
    />
  );
}
