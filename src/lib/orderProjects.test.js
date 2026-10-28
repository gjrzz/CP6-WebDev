import { orderProjects } from '@/lib/orderProjects';

const projects = ['a', 'b', 'c', 'd', 'e'].map((name) => ({ name }));
const names = (list) => list.map((project) => project.name);
const featuredNames = (list) => names(list.filter((project) => project.featured));

describe('orderProjects', () => {
  it('sem destaques escolhidos, marca os 3 mais recentes', () => {
    const ordered = orderProjects(projects);
    expect(names(ordered)).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(featuredNames(ordered)).toEqual(['a', 'b', 'c']);
  });

  it('coloca os destaques primeiro, na ordem escolhida', () => {
    const ordered = orderProjects(projects, ['d', 'b']);
    expect(names(ordered)).toEqual(['d', 'b', 'a', 'c', 'e']);
    expect(featuredNames(ordered)).toEqual(['d', 'b']);
  });

  it('ignora nomes que não existem e volta ao padrão se nenhum existir', () => {
    expect(featuredNames(orderProjects(projects, ['x', 'c']))).toEqual(['c']);
    expect(featuredNames(orderProjects(projects, ['x']))).toEqual(['a', 'b', 'c']);
  });
});
