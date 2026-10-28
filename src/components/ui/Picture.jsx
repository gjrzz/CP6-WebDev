import { getImageSources } from '@/lib/images';

export default function Picture({
  name,
  alt,
  width,
  height,
  sizes = '100vw',
  priority = false,
  className = '',
}) {
  const sources = getImageSources(name);

  // Foto ainda não gerada: SVG vazio com o mesmo tamanho e proporção do <img>,
  // para a troca pela foto real não mover o layout. O alt continua acessível
  // (alt vazio = imagem decorativa, escondida do leitor de tela como o <img alt="">).
  if (!sources) {
    return (
      <svg
        {...(alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true })}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={`bg-paper/5 h-auto max-w-full ${className}`}
      />
    );
  }

  return (
    <picture>
      {sources.avif && <source type="image/avif" srcSet={sources.avif} sizes={sizes} />}
      <source type="image/webp" srcSet={sources.webp} sizes={sizes} />
      <img
        src={sources.src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className={`h-auto max-w-full ${className}`}
      />
    </picture>
  );
}
