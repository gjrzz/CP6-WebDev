import { formatDateTime } from '@/lib/formatDate';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// O SDK só é baixado quando precisa, como o do Supabase
export function preloadEmail() {
  return import('@emailjs/browser');
}

// Avisa o dono por e-mail. As chaves batem com as variáveis do template no EmailJS:
// {{name}}, {{email}}, {{message}} e {{time}}.
export async function notifyOwner({ name, email, message, sentAt = new Date() }) {
  const { default: emailjs } = await preloadEmail();
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      { name, email, message, time: formatDateTime(sentAt) },
      { publicKey: PUBLIC_KEY },
    );
  } catch (error) {
    // O EmailJS rejeita com { status, text }, não com um Error
    throw new Error(`Não foi possível enviar o e-mail: ${error?.text ?? error}`, { cause: error });
  }
}
