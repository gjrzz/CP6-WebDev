import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut } from '@/services/auth';
import { MESSAGES_KEY } from '@/hooks/useMessages';

// Sem sessão, a rota protegida manda para o login sozinha. As mensagens saem da memória:
// dados privados não ficam no cache depois de sair.
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => queryClient.removeQueries({ queryKey: MESSAGES_KEY }),
  });
}
