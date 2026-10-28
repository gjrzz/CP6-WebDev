import { Link } from 'react-router';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';
import { formatDate } from '@/lib/formatDate';

// Altura fixa compartilhada com o ProjectCardSkeleton: trocar um pelo outro não move o layout
export const PROJECT_CARD_HEIGHT = 'h-48';

export default function ProjectCard({ project, featured = false, className = '' }) {
  const { name, description, language, updatedAt } = project;

  return (
    <Card
      className={`relative flex flex-col gap-3 transition-transform motion-safe:hover:-translate-y-1 ${PROJECT_CARD_HEIGHT} ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display min-w-0 truncate text-xl">
          {/* O ::after estica o link sobre o card inteiro, mantendo o nome como texto do link */}
          <Link
            to={`/projetos/${name}`}
            className="focus-visible:after:outline-accent after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4"
          >
            {name}
          </Link>
        </h3>
        {featured && (
          <Tag variant="accent" className="shrink-0">
            destaque
          </Tag>
        )}
      </div>
      <p className="text-muted line-clamp-2 text-sm">{description || 'Sem descrição.'}</p>
      <div className="mt-auto flex items-center justify-between gap-2 text-xs">
        {language ? <Tag>{language}</Tag> : <span />}
        <span className="text-muted">
          Atualizado em <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
        </span>
      </div>
    </Card>
  );
}
