import { useMutation } from '@tanstack/react-query';
import { signIn } from '@/services/auth';

// A sessão nova chega ao AuthProvider pelo onAuthStateChange; aqui só o estado do envio
export function useLogin() {
  return useMutation({ mutationFn: signIn });
}
