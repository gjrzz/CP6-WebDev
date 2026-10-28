import { deliverMessage } from '@/hooks/useSendMessage';
import { saveMessage } from '@/services/messages';
import { notifyOwner } from '@/services/email';

vi.mock('@/services/messages', () => ({ saveMessage: vi.fn(), preloadMessages: vi.fn() }));
vi.mock('@/services/email', () => ({ notifyOwner: vi.fn(), preloadEmail: vi.fn() }));

const fields = {
  name: 'Ana',
  email: 'ana@exemplo.com',
  message: 'Quero conversar sobre um projeto.',
};

describe('deliverMessage', () => {
  beforeEach(() => {
    vi.mocked(saveMessage).mockReset().mockResolvedValue();
    vi.mocked(notifyOwner).mockReset().mockResolvedValue();
  });

  it('salva e envia o e-mail com os mesmos dados', async () => {
    await expect(deliverMessage({ ...fields, website: '' })).resolves.toEqual({
      saved: true,
      emailed: true,
    });
    expect(saveMessage).toHaveBeenCalledWith(fields);
    expect(notifyOwner).toHaveBeenCalledWith(fields);
  });

  it('é sucesso se só uma das duas falhar', async () => {
    vi.mocked(notifyOwner).mockRejectedValue(new Error('emailjs fora'));
    await expect(deliverMessage(fields)).resolves.toEqual({ saved: true, emailed: false });

    vi.mocked(notifyOwner).mockResolvedValue();
    vi.mocked(saveMessage).mockRejectedValue(new Error('supabase fora'));
    await expect(deliverMessage(fields)).resolves.toEqual({ saved: false, emailed: true });
  });

  it('é erro quando as duas falham', async () => {
    vi.mocked(saveMessage).mockRejectedValue(new Error('supabase fora'));
    vi.mocked(notifyOwner).mockRejectedValue(new Error('emailjs fora'));
    await expect(deliverMessage(fields)).rejects.toThrow('Não foi possível enviar a mensagem');
  });

  it('com o honeypot preenchido, não envia nada', async () => {
    await deliverMessage({ ...fields, website: 'http://spam.example' });
    expect(saveMessage).not.toHaveBeenCalled();
    expect(notifyOwner).not.toHaveBeenCalled();
  });
});
