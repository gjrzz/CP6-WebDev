import { act, renderHook } from '@testing-library/react';
import { useCrossfade } from '@/hooks/useCrossfade';

describe('useCrossfade', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('avança a cada intervalo e volta ao início depois da última', () => {
    const { result } = renderHook(() => useCrossfade(3, { interval: 3000 }));
    expect(result.current).toBe(0);

    act(() => vi.advanceTimersByTime(3000));
    expect(result.current).toBe(1);

    act(() => vi.advanceTimersByTime(6000));
    expect(result.current).toBe(0);
  });

  it('fica parado quando pausado (reduced motion)', () => {
    const { result } = renderHook(() => useCrossfade(3, { paused: true }));
    act(() => vi.advanceTimersByTime(10000));
    expect(result.current).toBe(0);
  });
});
