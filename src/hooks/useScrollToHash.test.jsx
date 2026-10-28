import { render } from '@testing-library/react';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router';
import { useScrollToHash } from '@/hooks/useScrollToHash';

function Layout() {
  useScrollToHash();
  return <Outlet />;
}

function renderAt(url) {
  const routes = [
    { path: '/', element: <Layout />, children: [{ index: true, element: <div id="projetos" /> }] },
  ];
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [url] })} />);
}

function mockReducedMotion(matches) {
  window.matchMedia = vi.fn().mockReturnValue({ matches });
}

describe('useScrollToHash', () => {
  beforeEach(() => {
    // jsdom não implementa scrollIntoView nem matchMedia
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('rola suave até a âncora da url', () => {
    mockReducedMotion(false);
    renderAt('/#projetos');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('rola sem animação com prefers-reduced-motion', () => {
    mockReducedMotion(true);
    renderAt('/#projetos');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'auto',
      block: 'start',
    });
  });

  it('não rola sem hash', () => {
    mockReducedMotion(false);
    renderAt('/');
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});
