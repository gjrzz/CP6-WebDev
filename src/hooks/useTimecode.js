import { useEffect, useState } from 'react';

const FPS = 24;
// Atualiza ~12 vezes por segundo: o quadro (FF) parece correr sem renderizar a cada frame
const TICK_MS = 1000 / 12;

const pad = (value) => String(value).padStart(2, '0');

// "HH:MM:SS:FF" a partir dos milissegundos gravados
export function formatTimecode(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const frames = Math.floor(((ms % 1000) / 1000) * FPS);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(totalSeconds % 60)}:${pad(frames)}`;
}

// Timecode de filmadora contando desde a montagem. Parado quando `running` é falso
// (ex.: reduced motion) e enquanto a aba está oculta.
export function useTimecode(running = true) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    // Soma o próprio intervalo a cada tique, sem ler o relógio: para um timecode decorativo,
    // um pequeno desvio não importa, e nunca anda para trás
    const id = setInterval(() => {
      // Aba oculta não conta: ao voltar, segue de onde parou
      if (!document.hidden) setElapsed((value) => value + TICK_MS);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running]);

  return formatTimecode(elapsed);
}
