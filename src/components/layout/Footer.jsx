export default function Footer({ links = [] }) {
  return (
    <footer className="px-4 py-8 md:px-8">
      <ul className="flex flex-wrap gap-6 font-mono text-sm">
        {links.map((link) => {
          // mailto abre o app de e-mail; só links web abrem em nova aba
          const external = !link.href.startsWith('mailto:');
          return (
            <li key={link.label}>
              <a
                href={link.href}
                {...(external && { target: '_blank', rel: 'noreferrer' })}
                // Sublinhado cresce da esquerda no hover (scaleX, só transform)
                className="text-muted hover:text-paper focus-visible:outline-accent relative rounded transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:after:transition-none"
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </footer>
  );
}
