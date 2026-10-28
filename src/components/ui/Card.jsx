export default function Card({ className = '', ...props }) {
  return (
    <div className={`border-paper/10 bg-paper/5 rounded-2xl border p-6 ${className}`} {...props} />
  );
}
