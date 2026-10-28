import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

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

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts(PRELOADED_FONTS)],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
  },
});
