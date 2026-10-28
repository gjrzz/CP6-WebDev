import { useMutation } from '@tanstack/react-query';
import { preloadMessages, saveMessage } from '@/services/messages';
import { notifyOwner, preloadEmail } from '@/services/email';

// Baixa os SDKs antes do envio (ex.: quando o cartão de contato vira)
export function preloadContactServices() {
  return Promise.all([preloadMessages(), preloadEmail()]).catch(() => {
    // Falha no pré-carregamento não importa: o envio tenta de novo
  });
}

// Salva no Supabase e avisa por e-mail em paralelo. Basta uma das duas funcionar para a
// mensagem chegar ao dono (dashboard ou e-mail); só é erro quando as duas falham.
// Assim o visitante não reenvia uma mensagem que já foi salva.
export async function deliverMessage({ website, ...fields }) {
  // Honeypot preenchido = robô: finge sucesso sem enviar nada
  if (website) return { saved: false, emailed: false };

  const [saved, emailed] = await Promise.allSettled([saveMessage(fields), notifyOwner(fields)]);
  if (saved.status === 'rejected' && emailed.status === 'rejected') {
    throw new Error('Não foi possível enviar a mensagem', { cause: saved.reason });
  }
  return { saved: saved.status === 'fulfilled', emailed: emailed.status === 'fulfilled' };
}

export function useSendMessage() {
  return useMutation({ mutationFn: deliverMessage });
}
