import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LazyMotion, domAnimation } from 'motion/react';
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
        {/* Só as features de animação usadas (~24 KB em vez de ~43 KB); `strict` barra o
            componente `motion` completo, então os componentes usam `m` */}
        <LazyMotion features={domAnimation} strict>
          <RouterProvider router={router} />
        </LazyMotion>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
