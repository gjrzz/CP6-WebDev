import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
// Só dados (sem imports): o build lê a 1ª foto do hero e o sizes dela daqui
import { HERO } from './src/lib/content.js';

// Fonte do h1 do hero: o preload começa o download antes do CSS ser lido
const PRELOADED_FONTS = ['fraunces-latin-wght-normal'];

// O nome final do woff2 tem hash, então o <link rel="preload"> só pode ser
// escrito depois do bundle pronto
function preloadFonts(names) {
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, { bundle }) {
        return Object.values(bundle ?? {})
          .filter(
            (file) =>
              file.fileName.endsWith('.woff2') &&
              names.some((name) => file.fileName.includes(`/${name}-`)),
          )
          .map((file) => ({
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: `/${file.fileName}`,
              as: 'font',
              type: 'font/woff2',
              crossorigin: '',
            },
            injectTo: 'head',
          }));
      },
    },
  };
}

// Foto do LCP (a 1ª do hero): num SPA ela só seria descoberta depois do JS executar.
// O preload com o mesmo srcset/sizes do <picture> começa o download junto com o JS.
// Só AVIF: quem não suporta ignora o preload (type) e baixa o WebP normalmente depois.
function preloadLcpImage({ name, sizes }) {
  return {
    name: 'preload-lcp-image',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, { bundle }) {
        const pattern = new RegExp(`/${name}-(\\d+)-[^/]+\\.avif$`);
        const variants = Object.values(bundle ?? {})
          .map((file) => ({ file, match: file.fileName.match(pattern) }))
          .filter(({ match }) => match)
          .map(({ file, match }) => ({ url: `/${file.fileName}`, width: Number(match[1]) }))
          .sort((a, b) => a.width - b.width);
        if (variants.length === 0) return [];

        return [
          {
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'image',
              type: 'image/avif',
              imagesrcset: variants.map(({ url, width }) => `${url} ${width}w`).join(', '),
              imagesizes: sizes,
              fetchpriority: 'high',
            },
            injectTo: 'head',
          },
        ];
      },
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    preloadFonts(PRELOADED_FONTS),
    preloadLcpImage({ name: HERO.photos[0].name, sizes: HERO.photoSizes }),
    // Mapa do bundle só sob flag (npm run analyze ou ANALYZE=true): o build normal não muda
    (mode === 'analyze' || process.env.ANALYZE === 'true') &&
      visualizer({
        filename: 'dist/stats.html',
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
  },
}));
