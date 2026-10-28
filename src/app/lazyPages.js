import { lazy } from 'react';

// Páginas do dono fora do bundle inicial (o Suspense fica no AuthLayout).
// Em arquivo próprio para o Fast Refresh: o router.jsx exporta dados, não componentes.
export const LoginPage = lazy(() => import('@/pages/LoginPage'));
export const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
