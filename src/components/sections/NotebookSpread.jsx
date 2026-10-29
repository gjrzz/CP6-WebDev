import Picture from '@/components/ui/Picture';
import TextButton from '@/components/ui/TextButton';
import { NOTEBOOK } from '@/lib/content';

// Caderno aberto: a foto é o fundo e o conteúdo fica sobre as páginas, posicionado em %
// para escalar junto com a foto
export default function NotebookSpread({ left, right }) {
  const { opened, pages } = NOTEBOOK;

  return (
    <div className="relative" style={{ aspectRatio: `${opened.width} / ${opened.height}` }}>
      <Picture
        name={opened.name}
        alt=""
        width={opened.width}
        height={opened.height}
        sizes="(min-width: 1152px) 1088px, 100vw"
        className="w-full"
      />
      <div className="absolute" style={pages.left}>
        {left}
      </div>
      <div className="absolute" style={pages.right}>
        {right}
      </div>
    </div>
  );
}

const scribbleWidths = ['55%', '90%', '75%', '35%'];

// Skeleton "rabiscado": linhas finas no lugar das duas anotações da página
export function NotebookScribbles() {
  return (
    <div className="divide-page-ink/15 grid h-full grid-rows-2 divide-y">
      {[0, 1].map((note) => (
        <div key={note} className="flex flex-col justify-center gap-3 py-3">
          {scribbleWidths.map((width, line) => (
            <span
              key={line}
              style={{ width }}
              className="bg-page-ink/15 block h-0.5 rounded-full motion-safe:animate-pulse"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Erro ou lista vazia escritos à tinta na página
export function NotebookMessage({ title, message, onRetry, role }) {
  return (
    <div role={role} className="text-page-ink flex h-full flex-col justify-center gap-3">
      <p className="font-display text-2xl italic">{title}</p>
      {message && <p className="text-page-muted text-sm">{message}</p>}
      {onRetry && (
        <TextButton tone="page" onClick={onRetry} className="self-start">
          tentar de novo
        </TextButton>
      )}
    </div>
  );
}
