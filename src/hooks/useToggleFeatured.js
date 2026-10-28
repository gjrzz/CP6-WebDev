import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFeatured, removeFeatured } from '@/services/featured';
import { FEATURED_KEY } from '@/hooks/useFeatured';

// Atualização otimista: destacar entra no fim da fila na hora; se falhar, volta ao anterior
export function useToggleFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, featured }) => (featured ? addFeatured(name) : removeFeatured(name)),
    onMutate: async ({ name, featured }) => {
      await queryClient.cancelQueries({ queryKey: FEATURED_KEY });
      const previous = queryClient.getQueryData(FEATURED_KEY);
      queryClient.setQueryData(FEATURED_KEY, (names = []) =>
        featured
          ? [...names.filter((item) => item !== name), name]
          : names.filter((item) => item !== name),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(FEATURED_KEY, context?.previous);
    },
    // A busca nova também atualiza o cache do localStorage (ver useFeatured)
    onSettled: () => queryClient.invalidateQueries({ queryKey: FEATURED_KEY }),
  });
}
