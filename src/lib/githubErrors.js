import { RateLimitError } from '@/services/github';
import { formatTime } from '@/lib/formatDate';

// Texto do ErrorState para falhas da API do GitHub; `subject` é o que não carregou
export function getGithubErrorText(error, subject) {
  if (!(error instanceof RateLimitError)) {
    return { title: `Não foi possível carregar ${subject}`, message: 'Verifique sua conexão.' };
  }
  const when = error.resetAt ? `às ${formatTime(error.resetAt)}` : 'em alguns minutos';
  return {
    title: 'O GitHub limitou as requisições',
    message: `Tente de novo ${when}.`,
  };
}
