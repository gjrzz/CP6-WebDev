import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/app/App';
// Fontes hospedadas no próprio site: só o eixo de peso da Fraunces (normal e itálico)
// e o 400 latino da mono. O preload do woff2 do h1 é injetado no build (vite.config.js).
import '@fontsource-variable/fraunces/wght.css';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@/styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
