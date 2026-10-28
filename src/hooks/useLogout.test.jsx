import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogout } from '@/hooks/useLogout';
import { MESSAGES_KEY } from '@/hooks/useMessages';
import { signOut } from '@/services/auth';

vi.mock('@/services/auth', () => ({ signOut: vi.fn() }));

describe('useLogout', () => {
  it('ao sair, tira as mensagens do cache', async () => {
    vi.mocked(signOut).mockResolvedValue();
    const queryClient = new QueryClient();
    queryClient.setQueryData(MESSAGES_KEY, [{ id: 'a', name: 'Ana' }]);
    queryClient.setQueryData(['github', 'repos'], [{ name: 'publico' }]);

    const { result } = renderHook(() => useLogout(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(queryClient.getQueryData(MESSAGES_KEY)).toBeUndefined();
    // Dados públicos continuam em cache
    expect(queryClient.getQueryData(['github', 'repos'])).toEqual([{ name: 'publico' }]);
  });
});
