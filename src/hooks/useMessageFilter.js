import { useSearchParams } from 'react-router';
import { DEFAULT_FILTER, parseFilter } from '@/lib/filterMessages';

// Filtro na URL (?filtro=pendentes): sobrevive ao F5 e pode virar favorito
export function useMessageFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = parseFilter(searchParams.get('filtro'));

  const setFilter = (value) => {
    setSearchParams(value === DEFAULT_FILTER ? {} : { filtro: value }, { replace: true });
  };

  return [filter, setFilter];
}
