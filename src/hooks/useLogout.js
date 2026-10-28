import { useMutation } from '@tanstack/react-query';
import { signOut } from '@/services/auth';

// Sem sessão, a rota protegida manda para o login sozinha
export function useLogout() {
  return useMutation({ mutationFn: signOut });
}
