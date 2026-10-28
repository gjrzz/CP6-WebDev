import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@/app/router';
import ThemeProvider from '@/contexts/ThemeProvider';

describe('Rotas', () => {
  it('exibe a página 404 para uma rota inexistente', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/rota-que-nao-existe'] });
    render(
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>,
    );
    expect(screen.getByRole('heading', { name: /essa página não existe/i })).toBeInTheDocument();
  });
});
