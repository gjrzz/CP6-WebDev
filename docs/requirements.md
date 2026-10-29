# Requisitos — CP3 Portfolio (Stack e Harness Engineering)

Fonte: enunciado do professor no Notion. **Todos os requisitos são obrigatórios.** Prazo: **03/11**.
Status: ⬜ não iniciado · 🟨 em andamento · ✅ concluído. Atualize ao terminar cada item.

## Entrega (tarefa do Teams)

- ⬜ Link do repositório no GitHub (público)
- ⬜ Link do site publicado na Vercel
- ⬜ Link do vídeo no YouTube (não listado)

## 1. Rotas

- ✅ Link individual para cada projeto (`/projetos/:slug`)
- ✅ Página amigável para rota inexistente (404), inclusive para repositório inexistente em `/projetos/:slug`
- 🟨 Página amigável para falha no carregamento da API (`ErrorState` com retry na home e na página do projeto)
- ✅ Link compartilhado abre direto na página certa, inclusive com F5 (`vercel.json` com rewrite; testado em produção)

## 2. Estados de carregamento

- ✅ Todo dado de API exibe carregando, erro e lista vazia (projetos, página do projeto, mensagens e destaques)
- ✅ Indicador visual enquanto carrega (skeleton nos cards, spinner no envio do formulário)
- ✅ Botão de enviar bloqueado durante o envio (`ContactForm.test.jsx`)

## 3. Integração com o GitHub

- ✅ Projetos carregados pela API do GitHub, sem cadastro manual
- ✅ Cada card exibe descrição, linguagem e data da última atualização
- ✅ Tratamento do limite de requisições da API (403/429 → mensagem + cache, ver decisão 16)

## 4. Formulário de contato

- ✅ Validação por campo com mensagem específica (ex.: "e-mail inválido", "mínimo 20 caracteres")
- ✅ Mensagem enviada por e-mail ao dono **e** salva para consulta no dashboard (testado em produção com Supabase + EmailJS)
- ✅ Feedback de sucesso ou erro após o envio

## 5. Dashboard do dono

- ✅ Acesso protegido por login, redirecionando quem não está autenticado (`ProtectedRoute`, decisão 20)
- ✅ Lista das mensagens recebidas, com opção de marcar como respondida (filtro por status na URL, atualização otimista; cache limpo ao sair)
- ✅ Seleção dos projetos em destaque na home (decisão 21)

## 6. Preferências do visitante

- ✅ Tema claro/escuro persistido entre visitas

## 7. Interface

- 🟨 Layout responsivo testado em celular e desktop — testado no celular; corrigida a ordem do hero (cargos escondidos atrás da foto); conferir de novo após o deploy
- 🟨 Componentes visuais reaproveitados (mesmo botão, mesmo card em todas as páginas)
- ✅ Identidade visual própria (ver `docs/design.md`) — hero tipográfico, caderno de projetos, bancada carimbada sobre blueprint, cartão de contato com a mão, fontes, animações de entrada e detalhes da rolagem

## 8. Performance

- ✅ Lighthouse mobile ≥ 80 em performance — produção: medianas de 5 rodadas 85 antes e 85/87 depois da `perf/lighthouse`; o efeito das mudanças ficou dentro do ruído da medição (decisão 22)
- ✅ Imagens otimizadas (WebP/AVIF, tamanho certo, lazy) — todas as fotos geradas pelo pipeline e servidas pelo `Picture`; o blueprint da bancada é fundo CSS em AVIF/WebP com `image-set`, baixado só quando a seção é desenhada
- ✅ Dashboard e elementos pesados carregados sob demanda (`React.lazy`): login, dashboard, formulário, Supabase e EmailJS em chunks próprios (decisões 19 e 20)
- ✅ Sem saltos de layout (CLS): 0 em todas as medições do Lighthouse (skeletons do tamanho do conteúdo, molduras com proporção fixa)
- ✅ Sem requisições repetidas à API do GitHub ao navegar (cache do TanStack Query + `localStorage`; a página do projeto reaproveita a listagem)

## 9. Testes

- ✅ Validação do formulário de contato (`contactSchema.test.js`, `ContactForm.test.jsx`)
- ✅ Bloqueio do dashboard sem login (`ProtectedRoute.test.jsx`)
- ✅ Rota inexistente exibe 404 (`NotFoundPage.test.jsx`)

## 10. Deploy

- ✅ Site publicado com URL pública
- ✅ Deploy automático a cada push na `main` (integração Vercel ↔ GitHub)

## 11. Versionamento

- ✅ Padrão de commits definido e verificado (Conventional Commits + commitlint)
- ✅ Estratégia de branches definida (GitHub Flow, ver `docs/conventions.md`)
- ✅ Padrões descritos no README e nas instruções da IA (`CLAUDE.md`)
- ✅ Proteção da branch `main` no GitHub (exigir PR + CI): ruleset ativo com pull request obrigatório, check `check` do CI obrigatório, force push e exclusão bloqueados

## 12. Arquitetura e padronização

- ✅ Estrutura de pastas com responsabilidades claras
- ⬜ Componentes pequenos, lógica em hooks/services (manter durante o projeto)
- ✅ Convenções de nomenclatura documentadas
- ✅ Lint e formatação antes de cada commit (Husky + lint-staged)

## Repositório

- ⬜ Histórico de commits distribuído ao longo do prazo
- ✅ `.env` fora do repositório e `.env.example` documentado
- 🟨 README com projeto, tecnologias e como rodar

## Vídeo (até 8 min, rosto e tela visíveis)

- ⬜ Stack e arquitetura (diagrama de pastas e fluxo de dados, critério de divisão de componentes, caminho branch → deploy)
- ⬜ Justificativas da stack (opções comparadas, critério, o que se aceitou perder) — base em `docs/decisions.md`
- ⬜ Harness de IA (ferramenta e modelo, CLAUDE.md, skills, MCPs, agentes, como garantem os padrões)
