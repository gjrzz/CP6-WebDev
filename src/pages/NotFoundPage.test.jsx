import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@/app/router';

describe('Rotas', () => {
  it('exibe a página 404 para uma rota inexistente', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/rota-que-nao-existe'] });
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /essa página não existe/i })).toBeInTheDocument();
  });
});
