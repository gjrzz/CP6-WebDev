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
                className="text-muted hover:text-paper focus-visible:outline-accent rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
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
