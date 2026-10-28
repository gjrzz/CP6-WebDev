// Sem destaques escolhidos no dashboard, os mais recentes ocupam o lugar
export const DEFAULT_FEATURED_COUNT = 3;

// Separa os destacados (na ordem de `featuredNames`) dos demais (na ordem recebida).
// Nomes que não existem na lista (repositório apagado ou arquivado) são ignorados.
export function splitFeatured(projects, featuredNames = []) {
  const byName = new Map(projects.map((project) => [project.name, project]));
  const featured = featuredNames.map((name) => byName.get(name)).filter(Boolean);
  const featuredSet = new Set(featured.map((project) => project.name));
  return { featured, others: projects.filter((project) => !featuredSet.has(project.name)) };
}

// Ordem da home: destaques primeiro, marcados com `featured`; sem nenhum destaque válido,
// os 3 mais recentes fazem esse papel
export function orderProjects(projects, featuredNames = []) {
  let { featured, others } = splitFeatured(projects, featuredNames);
  if (featured.length === 0) {
    featured = projects.slice(0, DEFAULT_FEATURED_COUNT);
    others = projects.slice(DEFAULT_FEATURED_COUNT);
  }
  return [...featured.map((project) => ({ ...project, featured: true })), ...others];
}
