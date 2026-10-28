import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="text-muted font-mono text-sm">404</p>
        <h1 className="font-display mt-2 text-4xl">Essa página não existe.</h1>
        <Link to="/" className="mt-6 inline-block underline underline-offset-4">
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}
