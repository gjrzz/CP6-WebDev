import { useQuery } from '@tanstack/react-query';
import { listMessages } from '@/services/messages';

export const MESSAGES_KEY = ['messages'];

export function useMessages() {
  return useQuery({
    queryKey: MESSAGES_KEY,
    queryFn: listMessages,
    // Mensagem nova pode chegar a qualquer momento: ao voltar para a aba, busca de novo
    // (o padrão global de 10 min sem refetch vale para o GitHub, que muda pouco)
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}
