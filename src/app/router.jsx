import { createBrowserRouter } from 'react-router';
import RootLayout from '@/components/layout/RootLayout';
import HomePage from '@/pages/HomePage';
import ProjectPage from '@/pages/ProjectPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ErrorPage from '@/pages/ErrorPage';

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projetos/:slug', element: <ProjectPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
