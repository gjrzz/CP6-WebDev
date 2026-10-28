import { render, screen } from '@testing-library/react';
import Picture from '@/components/ui/Picture';
import { getImageSources } from '@/lib/images';

vi.mock('@/lib/images', () => ({ getImageSources: vi.fn() }));

const sources = {
  avif: '/hero-640.avif 640w, /hero-1280.avif 1280w',
  webp: '/hero-640.webp 640w, /hero-1280.webp 1280w',
  src: '/hero-1280.webp',
};

function renderPicture(props = {}) {
  return render(
    <Picture
      name="hero-skate"
      alt="Gabriel andando de skate"
      width={800}
      height={1000}
      {...props}
    />,
  );
}

describe('Picture', () => {
  beforeEach(() => vi.mocked(getImageSources).mockReturnValue(sources));

  it('oferece AVIF antes de WebP, com srcset e sizes', () => {
    const { container } = renderPicture({ sizes: '50vw' });
    const [avif, webp] = container.querySelectorAll('source');

    expect(avif).toHaveAttribute('type', 'image/avif');
    expect(avif).toHaveAttribute('srcset', sources.avif);
    expect(webp).toHaveAttribute('type', 'image/webp');
    expect(webp).toHaveAttribute('sizes', '50vw');
  });

  it('carrega sob demanda por padrão, com alt e dimensões', () => {
    renderPicture();
    const img = screen.getByRole('img', { name: 'Gabriel andando de skate' });

    expect(img).toHaveAttribute('src', sources.src);
    expect(img).toHaveAttribute('width', '800');
    expect(img).toHaveAttribute('height', '1000');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).not.toHaveAttribute('fetchpriority');
  });

  it('com priority carrega na hora e com prioridade alta', () => {
    renderPicture({ priority: true });
    const img = screen.getByRole('img');

    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
  });

  it('sem a imagem gerada, reserva o mesmo espaço e mantém o alt', () => {
    vi.mocked(getImageSources).mockReturnValue(null);
    const { container } = renderPicture();
    const placeholder = screen.getByRole('img', { name: 'Gabriel andando de skate' });

    expect(placeholder.tagName).toBe('svg');
    expect(placeholder).toHaveAttribute('width', '800');
    expect(placeholder).toHaveAttribute('height', '1000');
    expect(placeholder).toHaveAttribute('viewBox', '0 0 800 1000');
    expect(container.querySelector('picture')).not.toBeInTheDocument();
  });
});
