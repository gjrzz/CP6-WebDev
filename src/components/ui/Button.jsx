const variants = {
  primary: 'bg-paper text-ink hover:bg-accent',
  ghost: 'border border-paper/30 text-paper hover:border-paper',
};

export default function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
