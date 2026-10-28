import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email('e-mail inválido')),
  password: z.string().min(1, 'informe a senha'),
});
