import Spinner from '@/components/ui/Spinner';

const variants = {
  primary: 'bg-paper text-ink hover:bg-accent hover:text-on-accent',
  ghost: 'border border-paper/30 text-paper hover:border-paper',
  // Sobre papel (cartão de contato): cores fixas, iguais nos dois temas
  ink: 'bg-page-ink text-page-paper hover:bg-page-ink/85',
};

export default function Button({
  variant = 'primary',
  loading = false,
  disabled,
  href,
  className = '',
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`;

  // Com href vira link externo com o mesmo visual (loading e disabled não se aplicam)
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  );
}
