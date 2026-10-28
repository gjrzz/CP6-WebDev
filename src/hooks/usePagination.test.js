import { act, renderHook } from '@testing-library/react';
import { usePagination } from '@/hooks/usePagination';

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9];

describe('usePagination', () => {
  it('avança e volta sem passar dos limites', () => {
    const { result } = renderHook(() => usePagination(items, 4));
    expect(result.current.pageItems).toEqual([1, 2, 3, 4]);
    expect(result.current.pageCount).toBe(3);
    expect(result.current.hasPrev).toBe(false);

    act(() => result.current.prev());
    expect(result.current.page).toBe(0);

    act(() => result.current.next());
    act(() => result.current.next());
    expect(result.current.pageItems).toEqual([9]);
    expect(result.current.direction).toBe(1);
    expect(result.current.hasNext).toBe(false);

    act(() => result.current.next());
    expect(result.current.page).toBe(2);

    act(() => result.current.prev());
    expect(result.current.direction).toBe(-1);
  });

  it('volta para a primeira página se a lista diminuir', () => {
    const { result, rerender } = renderHook(({ list }) => usePagination(list, 4), {
      initialProps: { list: items },
    });
    act(() => result.current.next());
    act(() => result.current.next());

    rerender({ list: [1, 2, 3] });
    expect(result.current.page).toBe(0);
    expect(result.current.pageItems).toEqual([1, 2, 3]);
  });
});
