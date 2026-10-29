import { Link } from 'react-router';

// Página de aviso centralizada com volta para o início (404 e erro de rota)
export default function StatusPage({ eyebrow, title, message }) {
  return (
    <section className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        {eyebrow && <p className="text-muted font-mono text-sm">{eyebrow}</p>}
        <h1 className={`font-display text-4xl ${eyebrow ? 'mt-2' : ''}`}>{title}</h1>
        {message && <p className="text-muted mt-2">{message}</p>}
        <Link to="/" className="mt-6 inline-block underline underline-offset-4">
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}
