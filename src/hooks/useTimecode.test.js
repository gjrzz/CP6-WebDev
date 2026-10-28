import { act, renderHook } from '@testing-library/react';
import { formatTimecode, useTimecode } from '@/hooks/useTimecode';

describe('formatTimecode', () => {
  it('formata horas, minutos, segundos e quadros (24 fps)', () => {
    expect(formatTimecode(0)).toBe('00:00:00:00');
    expect(formatTimecode(12_500)).toBe('00:00:12:12');
    expect(formatTimecode(3_723_000)).toBe('01:02:03:00');
  });
});

describe('useTimecode', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('conta o tempo enquanto roda', () => {
    const { result } = renderHook(() => useTimecode(true));
    act(() => vi.advanceTimersByTime(2000));
    expect(result.current).toMatch(/^00:00:0[12]:\d\d$/);
    expect(result.current).not.toBe('00:00:00:00');
  });

  it('parado (reduced motion), fica em zero', () => {
    const { result } = renderHook(() => useTimecode(false));
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current).toBe('00:00:00:00');
  });
});
