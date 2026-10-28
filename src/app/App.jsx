import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '@/app/router';
import ThemeProvider from '@/contexts/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    // Dados do GitHub mudam pouco: evita refetch ao navegar entre páginas (requisito 8)
    queries: { staleTime: 1000 * 60 * 10, refetchOnWindowFocus: false, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
