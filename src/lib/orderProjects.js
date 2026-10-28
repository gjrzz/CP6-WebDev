// Sem destaques escolhidos no dashboard, os mais recentes ocupam o lugar
export const DEFAULT_FEATURED_COUNT = 3;

// Destaques primeiro (na ordem de `featuredNames`), marcados com `featured`; depois os demais
// na ordem recebida. Nomes que não existem na lista são ignorados.
export function orderProjects(projects, featuredNames = []) {
  const byName = new Map(projects.map((project) => [project.name, project]));
  let featured = featuredNames.map((name) => byName.get(name)).filter(Boolean);
  if (featured.length === 0) featured = projects.slice(0, DEFAULT_FEATURED_COUNT);

  const featuredSet = new Set(featured.map((project) => project.name));
  return [
    ...featured.map((project) => ({ ...project, featured: true })),
    ...projects.filter((project) => !featuredSet.has(project.name)),
  ];
}
