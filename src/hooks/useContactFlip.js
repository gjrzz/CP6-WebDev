import { useState } from 'react';
import { preloadContactServices } from '@/hooks/useSendMessage';

// Estado do cartão de contato. No primeiro sinal de interesse (mouse, foco ou clique),
// `prepare` baixa o formulário (`loadForm`) e os SDKs; `flip` também vira o cartão.
export function useContactFlip(loadForm) {
  const [flipped, setFlipped] = useState(false);
  const [wanted, setWanted] = useState(false);

  const prepare = () => {
    if (wanted) return;
    setWanted(true);
    loadForm();
    preloadContactServices();
  };

  const flip = () => {
    prepare();
    setFlipped(true);
  };

  return { flipped, wanted, prepare, flip };
}
