import { z } from 'zod';

// Mesmos limites do check da tabela messages (supabase/migrations/0001_init.sql)
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'o nome precisa ter no mínimo 2 caracteres')
    .max(100, 'o nome pode ter no máximo 100 caracteres'),
  email: z.string().trim().pipe(z.email('e-mail inválido')),
  message: z
    .string()
    .trim()
    .min(20, 'a mensagem precisa ter no mínimo 20 caracteres')
    .max(2000, 'a mensagem pode ter no máximo 2000 caracteres'),
  // Honeypot: campo invisível que só robô preenche (ver useSendMessage)
  website: z.string().optional(),
});
