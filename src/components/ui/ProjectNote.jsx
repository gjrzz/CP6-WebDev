import { Link } from 'react-router';
import { formatDate } from '@/lib/formatDate';
import { tiltFor } from '@/lib/tilt';

// Traço irregular de marca-texto atrás do "destaque"
function Highlight({ children }) {
  return (
    <span className="text-page-ink relative isolate inline-block px-1 font-mono text-[0.65rem] tracking-widest uppercase">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        className="text-page-highlight absolute inset-0 -z-10 h-full w-full"
      >
        <path d="M1 6 C 25 2, 55 7, 99 3 L 98 17 C 70 19, 35 14, 2 18 Z" fill="currentColor" />
      </svg>
      {children}
    </span>
  );
}

// Projeto "escrito" na página do caderno: sem card, em tinta sobre o papel
export default function ProjectNote({ project, featured = false }) {
  const { name, description, language, updatedAt } = project;

  return (
    <article
      className="text-page-ink relative flex h-full flex-col justify-center gap-1.5 py-3"
      style={{ rotate: `${tiltFor(name, 1)}deg` }}
    >
      <div className="flex items-center gap-2">
        <h3 className="font-display min-w-0 truncate text-2xl italic">
          {/* O ::after estica o link sobre a anotação inteira */}
          <Link
            to={`/projetos/${name}`}
            className="decoration-page-highlight focus-visible:after:outline-page-ink after:absolute after:inset-0 after:rounded-md hover:underline hover:decoration-4 hover:underline-offset-4 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2"
          >
            {name}
          </Link>
        </h3>
        {featured && <Highlight>destaque</Highlight>}
      </div>
      <p className="text-page-muted line-clamp-2 text-sm">{description || 'Sem descrição.'}</p>
      <p className="text-page-muted font-mono text-xs">
        {language && `${language} · `}
        <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
      </p>
    </article>
  );
}
