import { Suspense } from 'react';
import { Outlet } from 'react-router';
import AuthProvider from '@/contexts/AuthProvider';
import Spinner from '@/components/ui/Spinner';

// Envolve só as rotas do dono (/login e /dashboard): o Supabase Auth não carrega na home
export default function AuthLayout() {
  return (
    <AuthProvider>
      {/* React 19 leva o <meta> para o <head>: login e dashboard fora dos buscadores */}
      <meta name="robots" content="noindex" />
      <Suspense fallback={<PageSpinner />}>
        <Outlet />
      </Suspense>
    </AuthProvider>
  );
}

export function PageSpinner({ label }) {
  return (
    <div className="grid min-h-[60dvh] place-items-center">
      <Spinner label={label} className="size-8" />
    </div>
  );
}
