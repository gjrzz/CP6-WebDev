// Textos e mídias da home, fora do JSX para editar sem mexer nos componentes

export const HERO = {
  sentence:
    'Gabriel is a São Paulo-based IT Analyst and developer, who builds tools, automations and systems.',
  // Mesma proporção 4:5 das fotos (ver README, seção "Imagens")
  photoSize: { width: 640, height: 800 },
  photos: [
    { name: 'hero-skate', alt: 'Gabriel andando de skate em São Paulo' },
    { name: 'hero-trampo', alt: 'Gabriel trabalhando no computador' },
    { name: 'hero-setup', alt: 'Setup de trabalho do Gabriel' },
  ],
};

export const NOTEBOOK = {
  // Proporção 3:4 (ver README, seção "Imagens")
  cover: { name: 'caderno', alt: 'Caderno coberto de adesivos', width: 600, height: 800 },
  // Dois cards em cada página do caderno aberto
  perPage: 4,
};
