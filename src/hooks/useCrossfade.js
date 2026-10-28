import { useEffect, useState } from 'react';

// Índice que avança a cada `interval` ms e volta ao início depois do último.
// Parado quando `paused` (ex.: reduced motion) e enquanto a aba está oculta.
export function useCrossfade(total, { interval = 3000, paused = false } = {}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || total < 2) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setIndex((current) => (current + 1) % total);
    }, interval);
    return () => clearInterval(id);
  }, [total, interval, paused]);

  return index;
}
