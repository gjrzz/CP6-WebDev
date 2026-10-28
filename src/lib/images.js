// Versões geradas por `npm run images`. O glob vira URLs com hash no build;
// sem arquivos, o mapa fica vazio e o Picture mostra só a caixa reservada.
const files = import.meta.glob('/src/assets/img/*.{avif,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const FILE_PATTERN = /\/([^/]+)-(\d+)\.(avif|webp)$/;

function buildIndex(entries) {
  const index = {};
  for (const [filePath, url] of entries) {
    const match = filePath.match(FILE_PATTERN);
    if (!match) continue;
    const [, name, width, format] = match;
    index[name] ??= { avif: [], webp: [] };
    index[name][format].push({ url, width: Number(width) });
  }
  return index;
}

const images = buildIndex(Object.entries(files));

function toSrcSet(variants) {
  return [...variants]
    .sort((a, b) => a.width - b.width)
    .map(({ url, width }) => `${url} ${width}w`)
    .join(', ');
}

// { avif, webp, src } com os srcset prontos, ou null se a imagem ainda não foi gerada
export function getImageSources(name) {
  const image = images[name];
  if (!image?.webp.length) return null;

  const largestWebp = image.webp.reduce((a, b) => (b.width > a.width ? b : a));
  return {
    avif: image.avif.length ? toSrcSet(image.avif) : null,
    webp: toSrcSet(image.webp),
    src: largestWebp.url,
  };
}
