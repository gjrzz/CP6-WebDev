# Arquitetura

## Stack

| Camada                 | Tecnologia                                         |
| ---------------------- | -------------------------------------------------- |
| Build / dev server     | Vite                                               |
| UI                     | React 19 (JavaScript, `.jsx`)                      |
| Rotas                  | React Router (`createBrowserRouter`)               |
| Dados remotos e cache  | TanStack Query                                     |
| Backend (auth + banco) | Supabase                                           |
| E-mail do formulário   | EmailJS                                            |
| Formulários            | React Hook Form + Zod                              |
| Estilo                 | Tailwind CSS v4 (tokens em `src/styles/index.css`) |
| Animação               | Motion (Framer Motion)                             |
| Testes                 | Vitest + Testing Library                           |
| Qualidade              | ESLint, Prettier, Husky, lint-staged, commitlint   |
| Deploy                 | Vercel (deploy automático da `main`)               |

## Estrutura de pastas

```
src/
├── app/            # App.jsx (providers) e router.jsx (definição das rotas)
├── pages/          # Uma página por rota. Monta a tela com components + hooks.
├── components/
│   ├── ui/         # Peças genéricas e reaproveitáveis: Button, Card, Skeleton, Input…
│   ├── layout/     # Estrutura comum: RootLayout, Header, Footer, AuthLayout, ProtectedRoute
│   ├── sections/   # Blocos grandes da home: Hero, ProjectsNotebook, Workbench, ContactCard
│   ├── dashboard/  # Blocos do dashboard: MessagesPanel, MessageItem, FeaturedPanel
│   └── decor/      # Decoração da rolagem (aria-hidden): SkateProgress, TapeBand, Sticker, SectionBreak
├── hooks/          # Lógica e estado: useGithubRepos, useTheme, useAuth, useMessages…
├── services/       # Acesso externo puro (sem React): github.js, supabase.js, auth.js, messages.js, email.js
├── contexts/       # Contextos globais: ThemeContext, AuthContext
├── lib/            # Utilitários e schemas (ex.: contactSchema.js com Zod, formatDate.js)
├── assets/         # Imagens importadas pelo código (WebP/AVIF)
├── styles/         # CSS global e tokens do Tailwind
└── test/           # Setup do Vitest
```

### Critério de divisão

- **services** não importam React. Recebem parâmetros, fazem a chamada, devolvem dados ou lançam erro.
- **hooks** conectam services ao React (TanStack Query, estado, efeitos). É o único lugar onde `useQuery`/`useMutation` aparecem.
- **components/ui** não sabem de onde vêm os dados: recebem tudo por props.
- **pages** compõem hooks + components. Se uma página passar de ~150 linhas, extraia seções.
- Teste fica ao lado do arquivo testado: `ContactForm.jsx` → `ContactForm.test.jsx`.

## Fluxo de dados

```
GitHub REST API ──▶ services/github.js ──▶ hooks/useGithubRepos (TanStack Query, cache 10 min + localStorage)
                                                      │
                                                      ├──▶ hooks/useHomeProjects ──▶ sections/ProjectsNotebook
Supabase REST (featured_projects, sem SDK)            │      (destaques primeiro; espera no máx. 1,5 s)
  ──▶ services/featured.js ──▶ hooks/useFeatured ─────┘
                                                      └──▶ pages/ProjectPage (/projetos/:slug)

Dashboard: FeaturedPanel ──▶ hooks/useToggleFeatured ──▶ services/featured.js (SDK, autenticado)

ContactForm ──▶ lib/contactSchema (Zod) ──▶ hooks/useSendMessage
                                              ├──▶ services/messages.js → Supabase (tabela messages)
                                              └──▶ services/email.js    → EmailJS (e-mail para o dono)

AuthLayout (AuthProvider, só em /login e /dashboard; ver decisão 20)
LoginPage (lazy) ──▶ services/auth.js (Supabase Auth) ──▶ ProtectedRoute ──▶ DashboardPage (lazy)
                                                                   ├── lista/atualiza messages
                                                                   └── marca featured_projects
```

## Rotas

| Rota              | Página        | Observação                            |
| ----------------- | ------------- | ------------------------------------- |
| `/`               | HomePage      | Hero, projetos, bancada, contato      |
| `/projetos/:slug` | ProjectPage   | `slug` = nome do repositório          |
| `/login`          | LoginPage     | Supabase Auth (e-mail e senha)        |
| `/dashboard`      | DashboardPage | Protegida, carregada com `React.lazy` |
| `*`               | NotFoundPage  | 404                                   |
| erro de rota      | ErrorPage     | `errorElement` do router              |

Falha de API dentro de uma página usa um componente de erro próprio (`components/ui/ErrorState`), com botão "tentar de novo" chamando `refetch`.

## Banco (Supabase)

Esquema em `supabase/migrations/`. Resumo:

- `messages`: `id`, `name`, `email`, `message`, `answered` (bool), `created_at`. Visitante anônimo só pode **inserir**; o dono autenticado lê e atualiza.
- `featured_projects`: `repo_name` (PK), `position`, `created_at`. Qualquer um lê; só o dono autenticado escreve.

## Nomenclatura

| O quê                  | Padrão                        | Exemplo                           |
| ---------------------- | ----------------------------- | --------------------------------- |
| Componentes e páginas  | PascalCase, arquivo `.jsx`    | `ProjectCard.jsx`, `HomePage.jsx` |
| Hooks                  | camelCase começando com `use` | `useGithubRepos.js`               |
| Services e utilitários | camelCase, arquivo `.js`      | `github.js`, `formatDate.js`      |
| Contextos              | PascalCase + `Context`        | `ThemeContext.jsx`                |
| Constantes             | UPPER_SNAKE_CASE              | `GITHUB_USERNAME`                 |
| Variáveis de ambiente  | `VITE_` + UPPER_SNAKE_CASE    | `VITE_SUPABASE_URL`               |
| Rotas (URL)            | kebab-case em português       | `/projetos/meu-app`               |
| Testes                 | mesmo nome + `.test.jsx`      | `ContactForm.test.jsx`            |
