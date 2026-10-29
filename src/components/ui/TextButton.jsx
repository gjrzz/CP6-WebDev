const tones = {
  default: 'text-muted hover:text-paper focus-visible:outline-accent text-xs',
  // Escrito à tinta nas páginas do caderno: cores fixas, iguais nos dois temas
  page: 'decoration-page-highlight focus-visible:outline-page-ink text-sm decoration-2',
};

// Ação discreta em texto mono sublinhado ("ver mais", "fechar caderno", "tentar de novo")
export default function TextButton({ tone = 'default', href, className = '', children, ...props }) {
  const classes = `rounded font-mono underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 ${tones[tone]} ${className}`;

  // Com href vira link com o mesmo visual
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
