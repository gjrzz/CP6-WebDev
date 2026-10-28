import { contactSchema } from '@/lib/contactSchema';

const valid = {
  name: 'Ana',
  email: 'ana@exemplo.com',
  message: 'Quero conversar sobre um projeto novo.',
};

function errorsFor(data) {
  const result = contactSchema.safeParse(data);
  return result.success ? {} : result.error.flatten().fieldErrors;
}

describe('contactSchema', () => {
  it('aceita uma mensagem válida', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('dá uma mensagem específica para cada campo', () => {
    expect(errorsFor({ ...valid, name: 'A' }).name).toEqual([
      'o nome precisa ter no mínimo 2 caracteres',
    ]);
    expect(errorsFor({ ...valid, email: 'ana@' }).email).toEqual(['e-mail inválido']);
    expect(errorsFor({ ...valid, message: 'curta demais' }).message).toEqual([
      'a mensagem precisa ter no mínimo 20 caracteres',
    ]);
  });

  it('respeita os limites máximos da tabela', () => {
    expect(errorsFor({ ...valid, name: 'a'.repeat(101) }).name).toBeDefined();
    expect(errorsFor({ ...valid, message: 'a'.repeat(2001) }).message).toBeDefined();
  });

  it('ignora espaços nas pontas ao contar os caracteres', () => {
    expect(errorsFor({ ...valid, message: `   ${'a'.repeat(19)}   ` }).message).toBeDefined();
  });
});
