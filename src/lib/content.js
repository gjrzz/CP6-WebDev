// Textos e mídias da home, fora do JSX para editar sem mexer nos componentes

export const HERO = {
  sentence:
    'Gabriel is a São Paulo-based IT Analyst and developer, who builds tools, automations and systems.',
  // Moldura das fotos (paisagem, como a referência). Cada foto preenche a moldura cortando as
  // sobras (object-fit: cover); `focus` é o ponto que fica visível no corte.
  frame: { width: 4, height: 3 },
  // Largura de exibição da moldura (atributo sizes). Também usada no preload da 1ª foto,
  // injetado no build pelo vite.config.js: os dois precisam bater
  photoSizes: '(min-width: 1024px) 32rem, (min-width: 640px) 24rem, 18rem',
  // width/height são os tamanhos reais dos originais em src/assets/raw (atributos do <img>)
  photos: [
    {
      name: 'hero-skate',
      alt: 'Gabriel saltando de skate em frente a um prédio',
      width: 864,
      height: 445,
      focus: '50% 50%',
    },
    {
      name: 'hero-trampo',
      alt: 'Prédio de escritórios em São Paulo visto de baixo, entre árvores',
      width: 1600,
      height: 1400,
      focus: '50% 40%',
    },
    {
      name: 'hero-setup',
      alt: 'Setup de trabalho do Gabriel com dois monitores e PC iluminado',
      width: 1280,
      height: 960,
      focus: '50% 50%',
    },
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

export const CONTACT = {
  // Mão em pinça, recortada; o cartão (código) entra entre o polegar e os dedos.
  // Na foto, a mão termina num corte reto onde estava o papel; acima dele, só o polegar.
  hand: {
    name: 'hand',
    alt: 'Minha mão entregando o cartão de contato',
    width: 1200,
    height: 1600,
    // Ponto da pinça em fração da foto: `y` é a altura do corte reto, que encosta na borda
    // de baixo do cartão. Se a foto mudar, ajuste.
    pinch: { x: 0.5, y: 0.455 },
  },
  // Caneta apoiada no canto do cartão (decorativa: alt vazio)
  pen: { name: 'pen', width: 1024, height: 1024 },
  front: "Let's build something",
  hint: 'click to flip',
  success: 'Mensagem enviada! Eu respondo em breve.',
  error: 'Não foi possível enviar agora. Tente de novo em instantes.',
};

// Detalhes que surgem com a rolagem (fitas, adesivos, rabiscos). Só decoração:
// tudo fica escondido do leitor de tela.
export const DECOR = {
  tapes: {
    // Fita amarela entre o hero e o caderno; a de papel entre a bancada e o contato
    caution: ['ride on', 'build', 'automate', 'ship'],
    masking: ['tools', 'automations', 'systems'],
  },
  // Palavras grandes nas margens. tone: highlight (amarelo), paper (cor do texto) ou
  // ink (só contorno); font: gothic, bubble, brush; size: lg (padrão) ou xl;
  // outline: contorno preto fino (usado nas que ficam sobre as fitas)
  stickers: {
    afterHero: [
      {
        text: 'ride on',
        font: 'brush',
        tone: 'highlight',
        size: 'xl',
        outline: true,
        side: 'right',
        tilt: 8,
      },
    ],
    afterProjects: [
      { text: "00's kid", font: 'bubble', tone: 'paper', side: 'left', tilt: -10 },
      { text: 'build stuff', font: 'gothic', tone: 'ink', side: 'right', tilt: 6 },
    ],
    beforeContact: [
      {
        text: 'grind',
        font: 'brush',
        tone: 'paper',
        size: 'xl',
        outline: true,
        side: 'left',
        tilt: -7,
      },
    ],
  },
  scribbles: {
    toProjects: 'my stuff',
    toContact: 'say hi',
  },
};
