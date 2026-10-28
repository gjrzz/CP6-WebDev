import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFeatured } from '@/services/featured';
import { readFeaturedCache, writeFeaturedCache } from '@/lib/featuredCache';

export const FEATURED_KEY = ['featured'];

async function fetchAndCacheFeatured() {
  const names = await fetchFeatured();
  writeFeaturedCache(names);
  return names;
}

// Nomes dos repositórios em destaque, na ordem de position
export function useFeatured() {
  // Cache salvo como dado inicial: com menos de 10 min (staleTime global), nem chama a API
  const [cached] = useState(readFeaturedCache);

  return useQuery({
    queryKey: FEATURED_KEY,
    queryFn: fetchAndCacheFeatured,
    initialData: cached?.names,
    initialDataUpdatedAt: cached?.savedAt,
  });
}
