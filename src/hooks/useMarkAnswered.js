import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setAnswered } from '@/services/messages';
import { MESSAGES_KEY } from '@/hooks/useMessages';

// Atualização otimista: o status muda na hora; se o Supabase falhar, volta ao anterior
export function useMarkAnswered() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, answered }) => setAnswered(id, answered),
    onMutate: async ({ id, answered }) => {
      // Uma busca em andamento sobrescreveria o valor otimista com o antigo
      await queryClient.cancelQueries({ queryKey: MESSAGES_KEY });
      const previous = queryClient.getQueryData(MESSAGES_KEY);
      queryClient.setQueryData(MESSAGES_KEY, (messages) =>
        messages?.map((message) => (message.id === id ? { ...message, answered } : message)),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(MESSAGES_KEY, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: MESSAGES_KEY }),
  });
}
