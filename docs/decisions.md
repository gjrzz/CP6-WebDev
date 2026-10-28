# Decisões de stack

Formato de cada decisão: **opções comparadas → critério → escolha → o que aceitei perder**. Esta é a base da parte "Justificativas da stack" do vídeo. Registre aqui toda decisão nova.

## 1. Linguagem: JavaScript

- **Comparei:** JavaScript, TypeScript.
- **Critério:** prazo de 6 dias e domínio do código que vou ter que explicar na entrevista.
- **Escolha:** JavaScript, com JSDoc pontual e Zod validando os dados de fora (formulário).
- **Perdi:** checagem de tipos em tempo de build e autocomplete mais preciso entre módulos.

## 2. Build: Vite

- **Comparei:** Vite, Next.js.
- **Critério:** é uma SPA sem necessidade de SSR; quero o setup mais simples possível na Vercel.
- **Escolha:** Vite.
- **Perdi:** SSR/SSG e otimização automática de imagens do Next. Compenso com imagens pré-otimizadas e lazy loading.

## 3. Rotas: React Router

- **Comparei:** React Router, TanStack Router, wouter.
- **Critério:** maturidade, documentação e `errorElement` pronto para a página de erro.
- **Escolha:** React Router.
- **Perdi:** a tipagem de rotas e params do TanStack Router (que pesaria mais com TS) e o tamanho mínimo do wouter.

## 4. Dados remotos: TanStack Query

- **Comparei:** `useEffect` + `useState`, SWR, TanStack Query.
- **Critério:** precisa de cache entre páginas (requisito 8), estados de loading/erro (requisito 2) e mutações (dashboard).
- **Escolha:** TanStack Query com `staleTime` de 10 min.
- **Perdi:** ~13 kB gzip no bundle e mais um conceito para explicar. O SWR é menor, mas tem menos ferramentas para mutações.

## 5. Backend: Supabase

- **Comparei:** Supabase, Firebase, backend próprio em Node.
- **Critério:** login + banco + regras de acesso sem manter servidor, no plano gratuito.
- **Escolha:** Supabase (Postgres + Auth + Row Level Security).
- **Perdi:** controle total de um backend próprio; fico dependente do plano gratuito (projeto pausa após inatividade).

## 6. E-mail: EmailJS

- **Comparei:** EmailJS, Formspree, Edge Function do Supabase + Resend.
- **Critério:** enviar e-mail sem servidor e com configuração rápida.
- **Escolha:** EmailJS chamado pelo front, em paralelo ao insert no Supabase.
- **Perdi:** a chave pública fica exposta no front (mitigada pelas restrições de domínio do EmailJS) e o envio não é transacional com o insert. Uma Edge Function seria mais robusta.

## 7. Formulário: React Hook Form + Zod

- **Comparei:** validação manual, Formik + Yup, React Hook Form + Zod.
- **Critério:** mensagem específica por campo, poucos re-renders e schema reaproveitável nos testes.
- **Escolha:** React Hook Form + Zod.
- **Perdi:** duas dependências a mais em vez de validação manual.

## 8. Estilo: Tailwind CSS v4

- **Comparei:** CSS Modules, Tailwind, MUI/shadcn.
- **Critério:** identidade visual própria (biblioteca de componentes puxaria para um visual genérico) e velocidade.
- **Escolha:** Tailwind com tokens próprios.
- **Perdi:** HTML mais verboso nas classes e componentes prontos (modal, toast) que teria de graça no MUI.

## 9. Animação: Motion (Framer Motion)

- **Comparei:** CSS puro, Motion, GSAP + ScrollTrigger.
- **Critério:** API declarativa em JSX, animação ligada ao scroll e suporte a `prefers-reduced-motion`.
- **Escolha:** Motion.
- **Perdi:** o controle fino de timelines pinadas do GSAP.

## 10. Estado global: Context + localStorage

- **Comparei:** Context, Zustand, Redux Toolkit.
- **Critério:** só há dois estados globais (tema e sessão), que mudam raramente.
- **Escolha:** Context API. Dados do servidor ficam no TanStack Query, não em estado global.
- **Perdi:** seletores do Zustand para evitar re-renders, que aqui não fazem falta.

## 11. Testes: Vitest + Testing Library

- **Comparei:** Vitest + Testing Library, Jest, Playwright.
- **Critério:** mesma config do Vite e testes do ponto de vista do usuário.
- **Escolha:** Vitest + Testing Library.
- **Perdi:** testes E2E em navegador real (Playwright), que pegariam integração com Supabase de verdade.

## 12. Fluxo de Git: GitHub Flow + Conventional Commits

- **Comparei:** GitHub Flow, Git Flow, trunk-based; Conventional Commits, Gitmoji.
- **Critério:** projeto individual com deploy contínuo; mensagens legíveis por máquina (commitlint).
- **Escolha:** GitHub Flow com PR e CI; Conventional Commits verificados pelo commitlint.
- **Perdi:** branches de release e hotfix do Git Flow, desnecessárias aqui.

## 13. Deploy: Vercel

- **Comparei:** Vercel, Netlify, GitHub Pages.
- **Critério:** deploy automático por push, preview por PR e rewrite de SPA simples.
- **Escolha:** Vercel, com CI de qualidade no GitHub Actions.
- **Perdi:** nada relevante para o escopo; o GitHub Pages exigiria gambiarra de 404 para SPA.
