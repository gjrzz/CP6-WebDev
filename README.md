# Gabriel Juarez — Portfólio

Portfólio pessoal em React com projetos carregados direto do GitHub, formulário de contato com dashboard privado e identidade visual editorial inspirada em skate e objetos do dia a dia.

> Checkpoint 3 de Web Development (FIAP) — **Stack e Harness Engineering**.

- **Site:** https://gabrieljuarez.vercel.app
- **Repositório:** https://github.com/gjrzz/CP6-WebDev
- **Vídeo:** _link do YouTube (não listado)_

## O que tem no site

- **Home em quatro cenas:** hero tipográfico com fotos em crossfade, caderno com adesivos que abre e mostra os projetos, bancada com a stack "carimbada" sobre um blueprint e um cartão de contato que vira para mostrar o formulário.
- **Projetos do GitHub:** carregados pela API, sem cadastro manual, com descrição, linguagem e data da última atualização. Cada um tem sua página em `/projetos/:slug`. Os estados de carregando, erro e lista vazia aparecem na tela, e o site trata o limite de requisições da API usando cache.
- **Contato:** validação por campo, envio por e-mail ao dono (EmailJS) e mensagem salva no Supabase.
- **Dashboard privado** (`/dashboard`): login, lista de mensagens com filtro e "marcar como respondida", e escolha dos projetos em destaque na home.
- **Tema claro/escuro** salvo entre visitas, respeito a `prefers-reduced-motion` e página 404 amigável.

## Tecnologias

React 19 · Vite · React Router · TanStack Query · Supabase (Auth + Postgres) · EmailJS · React Hook Form + Zod · Tailwind CSS v4 · Motion · Vitest + Testing Library · ESLint + Prettier · Husky + lint-staged + commitlint · GitHub Actions · Vercel

Por que cada uma foi escolhida (e o que perdi em troca): [`docs/decisions.md`](docs/decisions.md).

## Como rodar

Requisitos: Node 20+ e npm.

```bash
git clone https://github.com/gjrzz/CP6-WebDev.git
cd CP6-WebDev
npm install          # também instala os hooks do Git (Husky)
cp .env.example .env # preencha as variáveis
npm run dev
```

### Variáveis de ambiente

Todas estão descritas em [`.env.example`](.env.example). O `.env` nunca vai para o repositório.

### Imagens

As fotos originais ficam em `src/assets/raw/`, que não vai para o Git. O comando abaixo gera em `src/assets/img/` as versões AVIF e WebP em 640 e 1280 px, e essas sim vão para o repositório:

```bash
npm run images
```

Enquanto uma foto não existe, o site mostra uma caixa vazia do mesmo tamanho, no lugar dela. Depois de rodar o comando, a foto aparece sem mudar código. Use **PNG** para recortes com fundo transparente e **JPG** para fotos retangulares. Com pelo menos 1280 px de largura, o script gera os dois tamanhos.

| Arquivo               | Conteúdo                                                                   | Proporção | Tamanho mínimo  |
| --------------------- | -------------------------------------------------------------------------- | --------- | --------------- |
| `hero-skate.jpeg`     | Hero: andando de skate                                                     | qualquer  | 1280 de largura |
| `hero-trampo.jpeg`    | Hero: no trabalho                                                          | qualquer  | 1280 de largura |
| `hero-setup.jpeg`     | Hero: setup                                                                | qualquer  | 1280 de largura |
| `notebook_closed.png` | Capa do caderno com adesivos, recortada                                    | 11:6      | 1408 × 768      |
| `notebook_opened.png` | Caderno aberto com páginas em branco, recortado                            | 11:6      | 1408 × 768      |
| `bancada.png`         | Textura de blueprint, sem folha (a folha é CSS); vira ladrilho, ver abaixo | qualquer  | 640 de largura  |
| `hand.png`            | Mão em pinça, recortada (o cartão entra entre o polegar e os dedos)        | 3:4       | 1200 × 1600     |
| `pen.png`             | Caneta, recortada                                                          | 1:1       | 1024 × 1024     |

O blueprint da bancada é repetido como fundo, então passa antes por um espelhamento 2×2 (para não aparecer emenda) e só depois pelo script de otimização. Gere só ele, numa pasta temporária, para não regerar as outras fotos:

```powershell
New-Item -ItemType Directory -Force "$env:TEMP\raw-bancada" | Out-Null
node scripts/mirror-tile.mjs src/assets/raw/bancada.png "$env:TEMP\raw-bancada\bancada.png"
Remove-Item src/assets/img/bancada-*
node scripts/optimize-images.mjs "$env:TEMP\raw-bancada" src/assets/img
```

As fotos do hero podem ter proporções diferentes: elas aparecem numa moldura 4:3, cortadas no ponto de foco de cada uma (`HERO.photos[].focus` em `src/lib/content.js`, ex.: `'50% 40%'`). Ao trocar uma foto, atualize lá também o `width`/`height` dela. As duas fotos do caderno, ao contrário, precisam ter a mesma proporção, que trocam de lugar ao abrir. Os projetos são escritos sobre as páginas do `notebook_opened.png` em posições definidas em porcentagem (`NOTEBOOK.pages` em `src/lib/content.js`): se essa foto mudar, ajuste lá.

### Banco (Supabase)

1. Crie um projeto no Supabase.
2. Rode `supabase/migrations/0001_init.sql` no SQL Editor.
3. Desative o cadastro público e crie seu usuário em **Authentication**.

### E-mail do formulário (EmailJS)

1. Crie um serviço de e-mail e um template no EmailJS.
2. No template, use as variáveis `{{name}}`, `{{email}}`, `{{message}}` e `{{time}}` (data e hora do envio em pt-BR).
3. Para o "Responder" ir direto ao visitante, configure o campo **Reply To** do template como `{{email}}`.
4. Preencha `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` e `VITE_EMAILJS_PUBLIC_KEY` no `.env` e na Vercel.

## Scripts

| Script                            | Descrição                                   |
| --------------------------------- | ------------------------------------------- |
| `npm run dev`                     | Servidor de desenvolvimento                 |
| `npm run build` / `preview`       | Build de produção e pré-visualização        |
| `npm run lint` / `lint:fix`       | ESLint                                      |
| `npm run format` / `format:check` | Prettier                                    |
| `npm test` / `test:watch`         | Testes com Vitest                           |
| `npm run analyze`                 | Build + mapa do bundle em `dist/stats.html` |
| `npm run images`                  | Gera AVIF/WebP de `src/assets/raw`          |

## Arquitetura

Estrutura de pastas, fluxo de dados, rotas e nomenclatura: [`docs/architecture.md`](docs/architecture.md).

```
src/
├── app/         # providers e rotas
├── pages/       # uma por rota
├── components/
│   ├── ui/        # peças genéricas: Button, TextButton, Card, Skeleton…
│   ├── layout/    # cabeçalho, rodapé, proteção de rota, páginas de aviso
│   ├── sections/  # blocos da home: Hero, caderno, bancada, contato
│   ├── dashboard/ # mensagens e destaques
│   └── decor/     # decoração da rolagem (aria-hidden)
├── hooks/       # lógica e estado (TanStack Query, animações de rolagem)
├── services/    # acesso a APIs, sem React
├── contexts/    # tema e autenticação
├── lib/         # utilitários, conteúdo e schemas Zod
├── assets/img/  # fotos geradas em AVIF/WebP
└── styles/      # CSS global e tokens
```

## Padrões do projeto

- **Branches:** GitHub Flow. `main` sempre publicável e protegida (só entra por pull request com o CI verde); trabalho em `feature/*`, `fix/*`, `refactor/*`, `docs/*`, `chore/*`.
- **CI:** GitHub Actions roda lint, Prettier, testes e build em cada PR. Cada merge na `main` vira deploy na Vercel.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/pt-br/) em português, verificados pelo commitlint (ex.: `feat(contato): adiciona validação por campo`).
- **Código:** ESLint + Prettier aplicados em cada commit pelo Husky + lint-staged.
- **Nomenclatura:** componentes em PascalCase, hooks começando com `use`, services em camelCase.

Detalhes em [`docs/conventions.md`](docs/conventions.md).

## Harness de IA

O projeto é desenvolvido com **Claude Code**. Tudo que orienta a IA está versionado:

| Arquivo                                          | Papel                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| [`CLAUDE.md`](CLAUDE.md)                         | Instruções do projeto: regras inegociáveis, comandos e importação dos docs                             |
| [`docs/`](docs)                                  | Requisitos (checklist do CP), arquitetura, convenções, design e decisões                               |
| [`.claude/settings.json`](.claude/settings.json) | Permissões (bloqueia ler `.env` e `push --force`) e hooks                                              |
| [`.claude/hooks/`](.claude/hooks)                | `guard-main` impede commit/push na `main`; `format-file` roda Prettier + ESLint a cada arquivo editado |
| [`.claude/skills/`](.claude/skills)              | `/feature`, `/commit` e `/component`: fluxos padronizados                                              |
| [`.claude/agents/`](.claude/agents)              | `code-reviewer` e `requirements-checker`                                                               |
| [`.mcp.json`](.mcp.json)                         | MCPs do Supabase (somente leitura) e Context7 (documentação atualizada das libs)                       |

A IA segue os padrões por três camadas: **instrução** (CLAUDE.md e docs), **automação** (hooks do Claude Code, Husky, commitlint e CI) e **revisão** (agentes).
