const variants = {
  default: 'bg-paper/10 text-paper',
  accent: 'bg-accent text-ink',
};

export default function Tag({ variant = 'default', className = '', ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
