import { Link } from 'react-router';

const focusRing =
  'focus-visible:outline-accent rounded focus-visible:outline-2 focus-visible:outline-offset-4';

export default function Header({ name, links = [], actions }) {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
      <Link to="/" className={`font-display text-lg italic ${focusRing}`}>
        {name}
      </Link>
      <div className="flex items-center gap-6">
        <nav aria-label="Principal">
          <ul className="flex gap-4 text-sm">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`text-muted hover:text-paper transition-colors ${focusRing}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {actions}
      </div>
    </header>
  );
}
