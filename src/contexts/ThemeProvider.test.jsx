import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@/app/router';
import ThemeProvider from '@/contexts/ThemeProvider';
import { THEME_STORAGE_KEY } from '@/lib/theme';

function renderApp() {
  render(
    <ThemeProvider>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />
    </ThemeProvider>,
  );
}

// jsdom não implementa matchMedia
function mockPrefersLight(matches) {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches }));
}

describe('Tema', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('alternar o tema grava no localStorage e muda o data-theme', async () => {
    mockPrefersLight(false);
    renderApp();
    expect(document.documentElement.dataset.theme).toBe('dark');

    await userEvent.click(screen.getByRole('button', { name: /ativar tema claro/i }));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: /ativar tema escuro/i })).toBeInTheDocument();
  });

  it('na primeira visita segue o prefers-color-scheme', () => {
    mockPrefersLight(true);
    renderApp();
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('alterna mesmo com o localStorage bloqueado', async () => {
    mockPrefersLight(false);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    renderApp();

    await userEvent.click(screen.getByRole('button', { name: /ativar tema claro/i }));

    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
