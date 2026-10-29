# Roadmap e prompts

Escopo completo do portfólio, dividido em branches pequenas. Cada branch vira um PR e atende requisitos de `docs/requirements.md`. Os prompts abaixo são para colar no Claude Code, na ordem.

## Escopo

### Dentro

- Home de rolagem única: hero tipográfico, caderno de projetos, bancada com stack, cartão de contato.
- Projetos vindos da API do GitHub (`gjrzz`), com destaques escolhidos no dashboard.
- Página por projeto em `/projetos/:slug`.
- Formulário de contato: valida, salva no Supabase e envia e-mail.
- Login do dono e dashboard (mensagens + destaques), carregado sob demanda.
- Tema claro/escuro persistido.
- Testes, Lighthouse mobile ≥ 80, deploy automático.

### Fora (não fazer agora)

- Skatista animado, cenas 3D, partículas e qualquer WebGL.
- Blog, CMS, internacionalização.
- Cadastro de usuários além do dono.
- Backend próprio.

## Como usar

1. Comece cada tarefa com `git switch main && git pull`.
2. Cole o prompt da tarefa. Em tarefas grandes, ative o **Plan Mode** (`Shift+Tab`) para revisar o plano antes do código.
3. Ao final, peça: `use o agente code-reviewer para revisar a branch`.
4. Faça push, abra o PR, espere o CI e faça o merge. A Vercel publica sozinha.
5. Marque a tarefa aqui com ✅.

## Fotos para produzir (até sexta)

Fundo removido, em PNG de alta resolução, salvas em `src/assets/raw/` (o script de otimização gera as versões finais):

- [ ] 3 a 5 fotos para o hero (você andando de skate, no trabalho, setup)
- [ ] Caderno ou shape de skate coberto de adesivos (fechado e "aberto")
- [ ] Tapete antiestático ou mesa vista de cima, folha de papel em branco, 2 ou 3 objetos (caneta, chave de fenda, fone)
- [ ] Sua mão segurando um cartão em branco (o texto entra por código)

---

## Quinta 29/10 — base e dados

### 1. `feature/ui-kit` — componentes base · req. 2, 7, 12

```
/feature kit de componentes base em src/components/ui

Crie: Card, Skeleton, Spinner, ErrorState (mensagem + botão "tentar de novo" que recebe onRetry), EmptyState e Tag. Ajuste o Button existente para aceitar a prop `loading` (mostra Spinner e fica disabled).
Todos recebem dados só por props, usam os tokens de cor e aceitam className.
Crie também Header (nome à esquerda, links de navegação e espaço para o botão de tema) e Footer com links em formato de path: /github/, /in/, /mail/, /cv/. Coloque os dois no RootLayout.
Escreva teste para o Button em estado loading (desabilitado e com spinner).
```

### 2. `feature/theme` — tema persistido · req. 6

```
/feature tema claro/escuro persistido

ThemeContext em src/contexts com hook useTheme em src/hooks. O tema é salvo no localStorage (com try/catch) e aplicado como data-theme no <html>. Na primeira visita, siga prefers-color-scheme.
Evite o "flash" do tema errado: adicione um script inline mínimo no index.html que aplica o data-theme antes do React carregar.
Defina as cores do tema claro como variáveis em src/styles/index.css, sem duplicar classes nos componentes.
Botão de alternância no Header, com aria-label.
Teste: alternar o tema grava no localStorage e muda o data-theme.
```

### 3. `feature/github-projects` — projetos do GitHub · req. 2, 3, 8

```
/feature listagem de projetos vinda da API do GitHub

services/github.js: busca os repositórios públicos de VITE_GITHUB_USERNAME (ordenados por updated_at, sem forks, sem arquivados). Se a resposta for 403 ou 429, lance um erro específico de "limite de requisições" com o horário de reset do header x-ratelimit-reset.
hooks/useGithubRepos.js com TanStack Query (usa o staleTime global; nada de refetch ao navegar).
components/ui/ProjectCard.jsx: nome, descrição, linguagem, data da última atualização formatada em pt-BR (lib/formatDate.js) e link para /projetos/<nome-do-repo>.
Seção temporária ProjectsSection na home com os 3 estados: grade de Skeletons com o mesmo tamanho do card (sem salto de layout), ErrorState (mensagem diferente para limite de requisições) e EmptyState.
Testes: o card exibe os dados do repositório; a seção mostra o estado de erro quando o service falha (mock do service).
```

### 4. `feature/project-page` — página do projeto · req. 1, 2, 8

```
/feature página individual do projeto em /projetos/:slug

Rota /projetos/:slug no router. hooks/useGithubRepo(slug): busca o repositório e usa o cache da listagem como initialData quando existir (não refaça a requisição vindo da home).
A página mostra nome, descrição, linguagem, tópicos, estrelas, data de atualização, link para o GitHub e o link do homepage se houver.
Se o repositório não existir (404 da API), renderize a NotFoundPage. Se a API falhar, mostre ErrorState com retry.
Defina o document.title com o nome do projeto.
Teste: acessar /projetos/inexistente mostra a página 404.
```

---

## Sexta 30/10 — identidade visual

### 5. `chore/image-pipeline` — imagens otimizadas · req. 8

```
/feature pipeline de otimização de imagens

Instale sharp como devDependency. Crie scripts/optimize-images.mjs que lê src/assets/raw/*.png e gera em src/assets/img/ versões WebP e AVIF em 2 larguras (640 e 1280), preservando transparência. Adicione o script "images" no package.json. Ignore src/assets/raw no Git.
Crie components/ui/Picture.jsx que recebe o nome base da imagem, alt, width e height e renderiza <picture> com AVIF, WebP, srcset, sizes, loading="lazy" por padrão e prop priority (eager + fetchpriority="high").
Registre a decisão em docs/decisions.md.
```

### 6. `feature/hero` — hero tipográfico · req. 7

```
/feature hero tipográfico da home (veja docs/design.md, seção Narrativa, item 1)

Frase: "Gabriel is a São Paulo-based IT Analyst and developer, who builds tools, automations and systems."
Cada palavra-chave com um estilo: "G" gigante só em contorno, "abriel" em itálico pesado, palavras espaçadas e finas, "IT Analyst / Developer" na vertical à direita no desktop (horizontal no celular).
No centro, uma foto que troca em crossfade a cada 3s (Picture com priority na primeira).
Fontes do Google com apenas os pesos usados e display=swap, pré-carregadas no index.html.
Entrada com Motion (opacity + y, stagger nas palavras). Com prefers-reduced-motion, tudo aparece pronto e a foto não troca sozinha.
O texto inteiro precisa existir no DOM como texto real (h1).
```

Animações combinadas (28/10): cada palavra entra com um movimento próprio ("G" com scale, "abriel" deslizando, cargo subindo); parallax leve na foto (`useScroll` em `y`); componente `Reveal` (entrada no scroll, uma vez só) usado pelas seções seguintes; cards de projeto entrando como adesivos (inclinação fixa por nome que assenta com spring, atraso por coluna). Motion via `LazyMotion` + `m`.

### 7. `feature/projects-notebook` — caderno de projetos · req. 3, 7

```
/feature caderno de stickers com os projetos (docs/design.md, item 2)

Substitua a ProjectsSection temporária. Um caderno coberto de adesivos (imagem) com o texto "click to open". Ao clicar (é um <button>), ele abre com rotateY e mostra os projetos: primeiro os destaques (por enquanto, os 3 mais recentes; o dashboard muda isso depois), depois os demais, em páginas navegáveis com setas e teclado (← →).
Reaproveite ProjectCard e os estados de loading, erro e vazio.
No celular, o caderno já abre direto em uma lista vertical, sem a animação 3D.
Anime só transform e opacity.
```

Animações combinadas: no hover, o caderno inclina de leve (`rotate: -2deg`) e cresce, como adesivo descolando; ao abrir, os cards entram em stagger reaproveitando o `Reveal`. Ajuste posterior (`feature/notebook-scroll`): no desktop, a capa entra pelo canto direito (inclinada e menor) e desliza até o centro acompanhando a rolagem (`useScroll` + `useTransform`, sem scroll-jacking); com reduced motion, já fica no centro.

### 8. `feature/workbench` — bancada e stack · req. 7

```
/feature bancada com a stack carimbada (docs/design.md, item 3)

Seção com a imagem da bancada vista de cima e uma folha de papel. Quando a seção entra na tela, palavras são "carimbadas" letra por letra no papel, cada letra numa fonte diferente (gótica, bubble, pincel, serifada), com scale + rotate em spring e stagger. Em seguida aparecem a stack (React, Vite, Supabase…) e um resumo da experiência (IT Analyst na Monte Bravo, gestão de frota macOS/Windows, automações).
Os dados ficam em src/lib/content.js, não espalhados no JSX.
Com prefers-reduced-motion, as palavras aparecem prontas.
```

Animações combinadas: "tranco" de carimbo em cada letra (chega de `scale: 1.4` com `rotate` aleatório e assenta com spring).

---

## Sábado 31/10 — contato e dashboard

### 9. `feature/contact-form` — formulário · req. 2, 4, 9

```
/feature formulário de contato com cartão que vira (docs/design.md, item 4)

lib/contactSchema.js com Zod: nome (mín. 2), e-mail válido ("e-mail inválido"), mensagem (mín. 20: "a mensagem precisa ter no mínimo 20 caracteres"). Mensagens em português, uma por campo.
Formulário com React Hook Form + zodResolver, erros abaixo de cada campo com aria-describedby.
services/supabase.js (cliente único), services/messages.js (insert em messages) e services/email.js (EmailJS; instale @emailjs/browser). hooks/useSendMessage.js com useMutation: salva no Supabase e envia o e-mail.
Botão de enviar com loading e desabilitado durante o envio. Feedback de sucesso (limpa o form) e de erro.
Visual: a mão segurando o cartão "Let's build something"; ao clicar, o cartão vira (rotateY) e mostra o formulário.
Testes: mensagens de erro por campo ao enviar vazio/inválido; botão desabilitado enquanto envia (mock do service).
```

Animações combinadas: a mão com o cartão sobe de baixo ao entrar na tela (ajuste em `feature/contact-hand`: a mão segura o cartão em pinça e os dois sobem juntos acompanhando a rolagem até o fim da página, como quem entrega o cartão; ao virar, a mão solta e desce); o cartão flutua de leve em loop (`y` ±4px) até o hover. No rodapé, sublinhado dos links crescendo com `scaleX`. Evitar: cursor customizado, scroll-jacking e transição entre páginas.

Detalhes da rolagem (`feature/scroll-details`, depois das funcionalidades): mini skate descendo pela borda direita como indicador de progresso (inclina com a velocidade), fitas com texto deslizando entre seções, adesivos próprios (sem logos de marca) que "colam" nas margens e rabiscos à mão apontando para projetos e contato. Tudo `aria-hidden`, só `transform`/`opacity`/`pathLength`, estático com reduced motion; adesivos, rabiscos e skate só no desktop.

### 10. `feature/auth` — login e rota protegida · req. 5, 8, 9

```
/feature login do dono e rota protegida do dashboard

AuthContext com a sessão do Supabase (getSession + onAuthStateChange) e hook useAuth.
LoginPage em /login com e-mail e senha (React Hook Form + Zod), erro de credenciais e botão com loading. Após o login, volta para a página que o usuário tentou acessar.
components/layout/ProtectedRoute: enquanto a sessão carrega, mostra Spinner; sem sessão, redireciona para /login guardando a origem.
DashboardPage em /dashboard carregada com React.lazy + Suspense (fora do bundle inicial), por enquanto só com o título e o botão de sair.
Testes: acessar /dashboard sem login redireciona para /login; com sessão, renderiza o dashboard (mock do useAuth).
```

### 11. `feature/dashboard-messages` — mensagens · req. 2, 5

```
/feature lista de mensagens no dashboard

hooks/useMessages (lista, mais recentes primeiro) e useMarkAnswered (mutation que atualiza answered e invalida a lista), usando services/messages.js.
Tabela/lista com nome, e-mail (link mailto), trecho da mensagem, data e status. Filtro: todas / pendentes / respondidas. Botão "marcar como respondida" com loading.
Estados de carregando, erro e vazio.
```

### 12. `feature/dashboard-featured` — destaques · req. 3, 5

```
/feature seleção de projetos em destaque

services/featured.js e hooks useFeatured / useToggleFeatured usando a tabela featured_projects.
No dashboard, liste os repositórios do GitHub (reaproveite useGithubRepos) com um toggle de destaque em cada um.
Na home, o caderno mostra primeiro os repositórios em destaque, na ordem de position. Se não houver destaques, use os 3 mais recentes.
A leitura dos destaques é pública; só o dono altera (RLS já configurada).
```

---

## Domingo 01/11 — qualidade

### 13. `perf/lighthouse` — performance · req. 8

```
Rode o build e analise a performance com o objetivo de Lighthouse mobile ≥ 80.
Instale rollup-plugin-visualizer como devDependency e gere o relatório do bundle. Confirme que o dashboard e o @supabase/supabase-js usado só no dashboard estão fora do chunk inicial.
Verifique: imagens sem width/height, fontes bloqueando renderização, saltos de layout nos skeletons, imagens acima da dobra com lazy, animações em propriedades que não sejam transform/opacity.
Liste os problemas por impacto e corrija numa branch perf/lighthouse, um commit por correção. Registre o antes e depois em docs/decisions.md.
```

### 14. Conferência dos requisitos

```
Use o agente requirements-checker para conferir todos os requisitos. Depois crie as branches necessárias para fechar o que faltar, começando pelo que mais pesa na nota.
```

### 15. `test/coverage` — testes que faltarem · req. 9

```
/feature completar testes

Confira se existem e passam: validação do formulário (cada mensagem de erro), bloqueio do dashboard sem login, 404, estados de erro dos projetos e alternância de tema. Escreva os que faltarem.
```

---

## Segunda 02/11 — entrega

### 16. `docs/final` — README e entrega

```
/feature finalizar documentação

Atualize o README com o link da Vercel, prints da home (desktop e celular) e a seção de harness de IA conferida com os arquivos reais. Marque todos os itens de docs/requirements.md com o status verdadeiro.
```

### 17. Preparação do vídeo (sem branch)

```
Com base em docs/architecture.md, docs/decisions.md, CLAUDE.md e .claude/, monte em docs/video.md um roteiro de 7 minutos para o vídeo de entrevista:
1) stack e arquitetura (2 min) com um diagrama Mermaid da estrutura de pastas e outro do fluxo de dados, e o caminho de uma alteração da branch até o deploy;
2) justificativas da stack (2 min), escolhendo as 5 decisões mais fortes;
3) harness de IA (3 min): ferramenta e modelo, CLAUDE.md, skills, agentes, hooks e MCPs, mostrando um exemplo real de quando cada camada corrigiu a IA (procure no git log).
Indique em cada trecho qual arquivo ou tela mostrar.
```
