import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Tag from '@/components/ui/Tag';
import { formatDate } from '@/lib/formatDate';

export default function ProjectDetails({ project }) {
  const { name, description, language, topics, stars, updatedAt, htmlUrl, homepage } = project;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl break-words md:text-5xl">{name}</h1>
        <p className="text-muted mt-3 text-lg">{description || 'Sem descrição.'}</p>
      </div>

      <dl className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
        {language && (
          <div>
            <dt className="text-muted">Linguagem</dt>
            <dd>{language}</dd>
          </div>
        )}
        <div>
          <dt className="text-muted">Estrelas</dt>
          <dd>{stars}</dd>
        </div>
        <div>
          <dt className="text-muted">Atualizado em</dt>
          <dd>
            <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
          </dd>
        </div>
      </dl>

      {topics.length > 0 && (
        <ul aria-label="Tópicos" className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <li key={topic}>
              <Tag>{topic}</Tag>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-3">
        <Button href={htmlUrl} target="_blank" rel="noreferrer">
          Ver no GitHub
        </Button>
        {homepage && (
          <Button href={homepage} variant="ghost" target="_blank" rel="noreferrer">
            Ver online
          </Button>
        )}
      </div>
    </div>
  );
}

export function ProjectDetailsSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span className="sr-only">Carregando projeto…</span>
      <div>
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="mt-3 h-6 w-full" />
      </div>
      <div className="flex gap-8">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>
    </div>
  );
}
