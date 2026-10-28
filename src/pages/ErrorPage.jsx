import { Link, useRouteError } from 'react-router';

export default function ErrorPage() {
  const error = useRouteError();
  if (import.meta.env.DEV) console.error(error);

  return (
    <section className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <h1 className="font-display text-4xl">Algo deu errado.</h1>
        <p className="text-muted mt-2">Tente recarregar a página em instantes.</p>
        <Link to="/" className="mt-6 inline-block underline underline-offset-4">
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}
