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

## 14. Commits: feitos por mim, não pela IA

- **Comparei:** a IA roda `git add`/`git commit`/`git push` sozinha; a IA só propõe e eu executo.
- **Critério:** controle e revisão de cada commit antes de entrar no histórico (o histórico é avaliado e vou ter que explicá-lo).
- **Escolha:** eu faço todos os commits e pushes. A IA só cria a branch da tarefa e, no fim, entrega um plano de commits (skill `/commit`) com os comandos prontos para colar. `git add`, `git commit` e `git push` ficam no `deny` do `.claude/settings.json`.
- **Perdi:** velocidade: cada tarefa termina com um passo manual meu em vez de commits automáticos.

## 15. Tema claro/escuro: troca de tokens por `data-theme`

- **Comparei:** variante `dark:` do Tailwind em cada componente; redefinir os valores dos tokens (`ink`, `paper`, `muted`, `accent`) sob `[data-theme='light']`.
- **Critério:** não duplicar classes nos componentes e não piscar o tema errado no carregamento.
- **Escolha:** os tokens são semânticos (`ink` = fundo, `paper` = texto) e trocam de valor no tema claro. Um script inline no `index.html` aplica o `data-theme` antes do React (salvo no `localStorage` → `prefers-color-scheme`). O `ThemeContext` só grava no `localStorage` quando o visitante escolhe; até lá, vale a preferência do sistema. Novo token `on-accent` (`#0a0a0a`, fixo) para texto sobre o amarelo, que no tema claro ficaria ilegível com `text-ink`.
- **Contrastes do tema claro** (fundo `#f5f5f0`):
  - `accent` `#a87a12`: 3,5:1 sobre o fundo (≥ 3:1 para anel de foco e elementos de interface). O amarelo do tema escuro, `#e8c35a`, daria ~1,6:1.
  - `on-accent` `#0a0a0a` sobre `#a87a12`: 5,2:1 (≥ 4,5:1 para texto).
  - `muted` `#6b6b66`: 4,9:1 (≥ 4,5:1 para texto). O `#8a8a85` do tema escuro daria só 3,2:1.
- **Perdi:** o amarelo da marca não é idêntico nos dois temas, e a regra de leitura do tema existe em dois lugares (script inline e `src/lib/theme.js`), que precisam ficar em sincronia.

## 16. Limite de requisições do GitHub: erro próprio + cache no `localStorage`

- **Comparei:** só o cache em memória do TanStack Query; um backend/proxy com token; cache em memória + última lista salva no `localStorage`.
- **Critério:** sem token, a API do GitHub permite 60 requisições por hora por IP, e o projeto não tem backend próprio (fora do escopo). O visitante não pode ver a seção vazia porque a cota acabou.
- **Escolha:** o `services/github.js` lança `RateLimitError` (com o horário de reset) só no 429 ou no 403 com `x-ratelimit-remaining: 0`; outros 403 são erro comum. Cada busca bem-sucedida grava a lista já mapeada (`{ name, description, language, updatedAt, htmlUrl, homepage, topics, stars }`) no `localStorage`, que volta como `initialData` + `initialDataUpdatedAt` do `useQuery`: com menos de 10 min nem chama a API. No erro de limite com cache, os cards salvos aparecem com um aviso discreto; sem cache, `ErrorState` com o horário de reset. O hook não repete a requisição quando o erro é de limite.
- **Perdi:** a lista salva pode estar desatualizada enquanto o limite durar, e ela ocupa alguns KB no `localStorage` do visitante.

## 17. Imagens: script com `sharp` + `<picture>` com AVIF e WebP

- **Comparei:** exportar as imagens à mão; plugin de imagem no build do Vite (`vite-imagetools`); script próprio com `sharp` rodado sob demanda; CDN de imagens (Cloudinary).
- **Critério:** Lighthouse mobile ≥ 80 sem deixar o build mais lento nem depender de serviço externo, e manter a transparência dos recortes.
- **Escolha:** `npm run images` (`scripts/optimize-images.mjs`) lê `.png`/`.jpg`/`.jpeg` de `src/assets/raw/` (fora do Git) e gera AVIF (qualidade 50) e WebP (80) em 640 e 1280 px em `src/assets/img/` (no Git, porque a Vercel não tem os originais). Não amplia fotos menores e pula o que já está atualizado. O `components/ui/Picture` acha as versões por `import.meta.glob` (URLs com hash) e renderiza `<picture>` com `srcset`, `sizes`, `width`/`height`, `loading="lazy"` e, com `priority`, `fetchpriority="high"`. Sem a foto gerada, reserva o mesmo espaço com um SVG vazio (sem CLS) e mantém o `alt`.
- **Perdi:** é preciso lembrar de rodar `npm run images` ao trocar uma foto, e as versões geradas aumentam o tamanho do repositório.

## 18. Fontes hospedadas no site e Motion enxuto

- **Fontes: comparei** Google Fonts (`<link>` para fonts.googleapis.com) e self-host com Fontsource (`@fontsource-variable/fraunces` e `@fontsource/jetbrains-mono`).
- **Critério:** Lighthouse mobile ≥ 80 e privacidade do visitante.
  - **Bloqueio de renderização:** o CSS do Google Fonts é uma folha externa que bloqueia o primeiro render até chegar. Com o Fontsource, os `@font-face` entram no CSS do próprio site.
  - **Conexões extras:** o Google exige DNS + TLS para dois domínios (`fonts.googleapis.com` e `fonts.gstatic.com`), mesmo com `preconnect`. No self-host, as fontes vêm do mesmo domínio e da mesma conexão HTTP/2.
  - **Privacidade:** cada visita mandaria o IP do visitante ao Google (em 2022 um tribunal de Munique considerou isso violação do GDPR; a LGPD tem princípios parecidos). Self-host não envia nada a terceiros.
  - **Cache entre sites** do Google não existe mais: os navegadores particionam o cache por site desde 2020.
- **Escolha:** Fontsource, importando só o eixo de peso da Fraunces (normal e itálico, `font-display: swap`) e o 400 latino da JetBrains Mono. Os subsets são separados por `unicode-range`, e o navegador baixa só o `latin` (~37 KB normal e ~46 KB itálico). O woff2 normal latino da Fraunces, usado no `h1`, recebe `<link rel="preload">` injetado no build por um plugin no `vite.config.js` (o nome tem hash). Só ele é pré-carregado para não competir com a imagem do hero. A gótica, a bubble e a de pincel ficam para a bancada.
- **Motion: comparei** o componente `motion` completo (~43 KB) e `LazyMotion` + `domAnimation` + `m` (~24 KB, sem drag e layout animations, que não usamos).
- **Escolha:** `LazyMotion` com `strict` no `App`, que barra o uso do `motion` completo por engano. Medido no build: o Motion soma ~30 KB gzip ao chunk inicial, e o parallax (`useScroll`) ~3,5 KB disso. Carregar o `domAnimation` assíncrono tiraria isso do chunk inicial; fica para avaliar na tarefa de performance (#13), porque atrasaria a entrada do hero.
- **Perdi:** atualizar as fontes passa a ser `npm update`, e não automático. O itálico do `h1` ("abriel") não tem preload e pode aparecer um instante na fonte de fallback.

## 19. Formulário de contato: envio paralelo, SDKs e formulário sob demanda

- **Comparei (falha parcial):** erro se qualquer uma das operações falhar (salvar no Supabase ou e-mail pelo EmailJS); sucesso se pelo menos uma funcionar.
- **Critério:** a mensagem precisa chegar ao dono, e o visitante não deve reenviar algo que já foi salvo (duplicata no dashboard).
- **Escolha:** as duas rodam em paralelo (`Promise.allSettled` em `useSendMessage`). É sucesso se uma funcionar (a mensagem chegou pelo dashboard ou pelo e-mail) e erro só se as duas falharem. Um campo honeypot invisível faz robôs receberem "sucesso" sem enviar nada.
- **Comparei (carregamento):** importar Supabase, EmailJS e o formulário (React Hook Form + Zod) no bundle inicial; carregar tudo sob demanda.
- **Escolha:** `services/messages.js` e `services/email.js` usam `import()` dinâmico, e o `ContactForm` é `React.lazy`. Tudo é pré-carregado no primeiro sinal de interesse no cartão (mouse, foco ou clique). Medido no build: o chunk inicial ficou em 155,8 KB gzip; o formulário (36 KB), o Supabase (55 KB) e o EmailJS (1,5 KB) viraram chunks separados. As duas faces do cartão têm a mesma altura mínima, então o formulário carregar no verso não move o layout.
- **Perdi:** no sucesso parcial, o visitante não sabe que só uma das vias funcionou (o dono vê pelo dashboard ou pelo e-mail). Num primeiro clique sem hover (teclado ou toque rápido), o formulário pode levar um instante para aparecer no verso.

## 20. Autenticação só nas rotas do dono

- **Comparei:** `AuthProvider` no `App` (sessão disponível em todo o site); `AuthProvider` num layout de rota que envolve só `/login` e `/dashboard`.
- **Critério:** o `getSession()` baixa o Supabase (~55 KB gzip). No `App`, isso aconteceria em toda visita à home, desfazendo o carregamento sob demanda da decisão 19. Só o dono usa a sessão.
- **Escolha:** `components/layout/AuthLayout` (rota sem caminho) com `AuthProvider`, `Suspense` e `<meta name="robots" content="noindex">` (o React 19 leva o meta para o `<head>`). `LoginPage` e `DashboardPage` são `React.lazy` (em `app/lazyPages.js`, por causa do Fast Refresh). `ProtectedRoute` mostra um spinner até a primeira leitura da sessão e só então redireciona, guardando a origem para o login voltar para ela.
- **Perdi:** o resto do site não sabe se o dono está logado (ex.: não dá para mostrar um link "dashboard" no cabeçalho só para ele sem carregar o Supabase).

## 21. Destaques: leitura pública por REST, sem o SDK

- **Comparei:** ler `featured_projects` pelo `supabase-js` (o mesmo cliente do dashboard); ler pela API REST do Supabase com `fetch`.
- **Critério:** a home precisa dos destaques em toda visita. Pelo SDK, ela voltaria a baixar ~55 KB gzip que as decisões 19 e 20 tiraram dela.
- **Escolha:**
  - **Leitura:** `GET /rest/v1/featured_projects?select=repo_name,position&order=position` com `fetch`. A chave publishable (`sb_publishable_…`) não é JWT, então vai **só** no cabeçalho `apikey`, sem `Authorization: Bearer` (documentação do Supabase sobre as novas API keys). Testado contra o projeto real: leitura anônima responde 200; escrita anônima responde 401 (RLS + GRANTs).
  - **Escrita** (só no dashboard): pelo SDK, que já está carregado ali. A nova posição é `max(position) + 1`, para não repetir posição depois de remover um item do meio.
  - **Sem travar o caderno:** os destaques ficam no `localStorage`, como os repositórios (decisão 16), e voltam como `initialData`. Sem cache, `useHomeProjects` espera no máximo 1,5 s; depois mostra a ordem padrão (os 3 mais recentes) e reordena quando os destaques chegarem. Se a leitura falhar, fica a ordem padrão.
  - `services/config.js` valida `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (vazia, espaço ou quebra de linha) com mensagem clara no console. É o que teria mostrado na hora o erro do deploy em que a chave foi colada 5 vezes.
- **Perdi:** a leitura dos destaques não tem os tipos nem os helpers do SDK (a URL da consulta é montada à mão), e sem cache a lista pode reordenar uma vez depois de 1,5 s.

## 22. Performance mobile: medir certo e cortar trabalho do início

- **Como medi:** Lighthouse 13.6.0 (perfil mobile padrão: CPU 4× mais lenta, 4G simulado), local no Edge headless. A máquina oscila ±10 pontos entre rodadas, então cada medição usa **5 rodadas intercaladas** entre a `main` (base) e a branch, servidas com gzip e fallback de SPA como na Vercel, e compara as **medianas**. O `vite preview` não comprime os arquivos e inflava o LCP local; o `npm run dev` nunca foi usado.
- **Diagnóstico:** em produção (`main`), mediana **85** (85, 85, 93), CLS 0. O LCP é a 1ª foto do hero, que num SPA só aparece depois do JS. O gargalo era **CPU no início**: o React renderizava a home inteira de uma vez e o navegador calculava estilo e layout de tudo (~900 ms de "Style & Layout"), com tarefas longas de até 222 ms.
- **O que entrou (um commit por correção):**
  1. **Preload da foto do LCP** (`<link rel="preload" as="image" imagesrcset … imagesizes>`, injetado no build). A espera para começar o download caiu de ~100 para ~15 ms, mas sem efeito mensurável na nota: o LCP depende do JS, não do download.
  2. **2ª e 3ª fotos do hero só no ocioso** (`useIdle`), antes da 1ª troca do crossfade. Sem efeito mensurável sozinho.
  3. **Skate de progresso só no ocioso**: os listeners de rolagem saem do carregamento. Sem efeito mensurável sozinho.
  4. **`content-visibility: auto` nas seções abaixo da dobra** (caderno, bancada, contato), com `contain-intrinsic-size: auto <altura>`. O conteúdo **continua no DOM** (texto real, `#âncoras`, leitor de tela, Ctrl+F); o navegador só pula estilo, layout e pintura até a seção chegar perto. Foi o que mais pesou.
- **Antes × depois** (local, gzip, mediana de 5 intercaladas):

  |        | Nota   | TBT        | LCP   |
  | ------ | ------ | ---------- | ----- |
  | `main` | 74     | 431 ms     | 4,4 s |
  | branch | **84** | **142 ms** | 4,2 s |

  A branch ganhou em 4 dos 5 pares de rodadas. A meta (≥ 80) já era cumprida em produção; o ganho é de margem.

- **Descartado:** desmontar as seções de baixo com `React.lazy` + `IntersectionObserver` (tiraria texto importante do DOM e arriscaria salto ao navegar por `#contato`); tirar o Motion do chunk inicial (atrasaria a entrada do hero).
- **Mapa do bundle:** `npm run analyze` (ou `ANALYZE=true npm run build`) gera `dist/stats.html` com o `rollup-plugin-visualizer` (treemap, tamanhos gzip/brotli). O build normal não muda.
- **Perdi / próximo passo:** o LCP local segue em ~4,2 s porque a foto só é desenhada depois do JS executar. O próximo ganho grande seria pré-renderizar o HTML da home no build (SSG), o que muda a arquitetura e ficou fora do prazo.
