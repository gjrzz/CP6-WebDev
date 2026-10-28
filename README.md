# Gabriel Juarez — Portfólio

Portfólio pessoal em React com projetos carregados direto do GitHub, formulário de contato com dashboard privado e identidade visual editorial inspirada em skate e objetos do dia a dia.

> Checkpoint 3 de Web Development (FIAP) — **Stack e Harness Engineering**.

- **Site:** https://gabrieljuarez.vercel.app
- **Vídeo:** _link do YouTube (não listado)_

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

| Arquivo           | Conteúdo                                       | Proporção | Tamanho mínimo |
| ----------------- | ---------------------------------------------- | --------- | -------------- |
| `hero-skate.jpg`  | Hero: andando de skate                         | 4:5       | 1280 × 1600    |
| `hero-trampo.jpg` | Hero: no trabalho                              | 4:5       | 1280 × 1600    |
| `hero-setup.jpg`  | Hero: setup                                    | 4:5       | 1280 × 1600    |
| `caderno.png`     | Caderno/shape com adesivos, recortado          | 3:4       | 1280 × 1707    |
| `bancada.jpg`     | Tapete antiestático visto de cima, com o papel | 16:9      | 1280 × 720     |
| `mao-cartao.png`  | Mão segurando o cartão em branco, recortada    | 4:5       | 1280 × 1600    |

As três fotos do hero precisam ter a mesma proporção, porque se alternam no mesmo espaço.

### Banco (Supabase)

1. Crie um projeto no Supabase.
2. Rode `supabase/migrations/0001_init.sql` no SQL Editor.
3. Desative o cadastro público e crie seu usuário em **Authentication**.

## Scripts

| Script                            | Descrição                            |
| --------------------------------- | ------------------------------------ |
| `npm run dev`                     | Servidor de desenvolvimento          |
| `npm run build` / `preview`       | Build de produção e pré-visualização |
| `npm run lint` / `lint:fix`       | ESLint                               |
| `npm run format` / `format:check` | Prettier                             |
| `npm test` / `test:watch`         | Testes com Vitest                    |
| `npm run images`                  | Gera AVIF/WebP de `src/assets/raw`   |

## Arquitetura

Estrutura de pastas, fluxo de dados, rotas e nomenclatura: [`docs/architecture.md`](docs/architecture.md).

```
src/
├── app/         # providers e rotas
├── pages/       # uma por rota
├── components/  # ui (genéricos), layout, sections (blocos da home)
├── hooks/       # lógica e estado (TanStack Query)
├── services/    # acesso a APIs, sem React
├── contexts/    # tema e autenticação
├── lib/         # utilitários e schemas Zod
└── styles/      # CSS global e tokens
```

## Padrões do projeto

- **Branches:** GitHub Flow. `main` sempre publicável; trabalho em `feature/*`, `fix/*`, `docs/*`, `chore/*`, integrado por pull request com CI verde.
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
