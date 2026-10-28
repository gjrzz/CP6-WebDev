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
  // As duas fotos têm 1408 × 768 (com margem transparente): a capa e o caderno aberto
  // ocupam o mesmo espaço, e a troca entre eles não mexe no layout
  cover: {
    name: 'notebook_closed',
    alt: 'Caderno de capa vermelha coberto de adesivos de skate',
    width: 1408,
    height: 768,
  },
  opened: { name: 'notebook_opened', width: 1408, height: 768 },
  // Área escrevível de cada página, em % da foto aberta: a esquerda começa depois da borda
  // rasgada, a direita depois das argolas do espiral e antes do elástico.
  // Se a foto do caderno aberto mudar, ajuste aqui.
  pages: {
    left: { left: '21%', right: '55%', top: '12%', bottom: '12%' },
    right: { left: '56%', right: '25%', top: '12%', bottom: '12%' },
  },
  // Dois projetos em cada página
  perPage: 4,
};

export const WORKBENCH = {
  // Só o tapete com objetos, sem a folha: a folha é CSS (ver README, seção "Imagens")
  photo: {
    name: 'bancada',
    alt: 'Tapete antiestático visto de cima, com ferramentas',
    width: 1600,
    height: 900,
  },
  // Carimbadas uma por linha, letra por letra
  words: ['tools', 'automations', 'systems'],
  stack: [
    {
      label: 'Dev',
      items: [
        'JavaScript',
        'TypeScript',
        'React',
        'Vite',
        'Node.js',
        'Python',
        'Flutter',
        'Supabase',
        'Tailwind',
        'Git',
        'Docker',
      ],
    },
    {
      label: 'Infra & TI',
      items: [
        'Microsoft Intune',
        'Apple Business Manager',
        'Entra ID',
        'Onboarding',
        'Audiovisual',
        'Suporte N1 e N2',
        'Hyper-V',
      ],
    },
  ],
  // `period: null` não aparece no site; preencha como '2024 – atual'
  experience: [
    {
      role: 'IT Analyst',
      company: 'Monte Bravo Corretora',
      period: null, // TODO: início – atual
      highlights: [
        'Gestão da frota de macOS e Windows, com MDM no Intune, ABM e Platform SSO com Entra ID.',
        'Onboarding de colaboradores, provisionamento de periféricos e deploy de políticas.',
        'Ferramentas internas: plataforma de service desk e automação de processos internos.',
      ],
    },
    {
      role: 'Suporte de TI',
      company: 'Matiz Assessoria Contábil',
      period: null, // TODO: início – fim
      highlights: ['Servidor local e NAS, rotina de backups e HelpDesk.'],
    },
  ],
  education: [
    {
      course: 'Engenharia de Software',
      school: 'FIAP',
      period: null, // TODO: início – atual
    },
  ],
  certifications: ['Bloomberg Terminal Technician'],
};
