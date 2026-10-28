import { createBrowserRouter } from 'react-router';
import RootLayout from '@/components/layout/RootLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import ProjectPage from '@/pages/ProjectPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ErrorPage from '@/pages/ErrorPage';
import { DashboardPage, LoginPage } from '@/app/lazyPages';

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projetos/:slug', element: <ProjectPage /> },
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
