import { countByFilter, filterMessages, parseFilter } from '@/lib/filterMessages';

const messages = [
  { id: 1, answered: false },
  { id: 2, answered: true },
  { id: 3, answered: false },
];

describe('filterMessages', () => {
  it('separa pendentes e respondidas', () => {
    expect(filterMessages(messages, 'pendentes').map((m) => m.id)).toEqual([1, 3]);
    expect(filterMessages(messages, 'respondidas').map((m) => m.id)).toEqual([2]);
    expect(filterMessages(messages, 'todas')).toHaveLength(3);
  });

  it('conta as mensagens de cada filtro', () => {
    expect(countByFilter(messages)).toEqual({ todas: 3, pendentes: 2, respondidas: 1 });
  });

  it('usa "todas" para filtro ausente ou desconhecido', () => {
    expect(parseFilter(null)).toBe('todas');
    expect(parseFilter('lixo')).toBe('todas');
    expect(parseFilter('toString')).toBe('todas');
    expect(parseFilter('pendentes')).toBe('pendentes');
  });
});
