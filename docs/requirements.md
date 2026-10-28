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
- ⬜ Link compartilhado abre direto na página certa, inclusive com F5 (`vercel.json` com rewrite)

## 2. Estados de carregamento

- 🟨 Todo dado de API exibe carregando, erro e lista vazia (listagem e página do projeto prontas)
- ✅ Indicador visual enquanto carrega (skeleton nos cards, spinner no envio do formulário)
- ✅ Botão de enviar bloqueado durante o envio (`ContactForm.test.jsx`)

## 3. Integração com o GitHub

- ✅ Projetos carregados pela API do GitHub, sem cadastro manual
- ✅ Cada card exibe descrição, linguagem e data da última atualização
- ✅ Tratamento do limite de requisições da API (403/429 → mensagem + cache, ver decisão 16)

## 4. Formulário de contato

- ✅ Validação por campo com mensagem específica (ex.: "e-mail inválido", "mínimo 20 caracteres")
- 🟨 Mensagem enviada por e-mail ao dono **e** salva para consulta no dashboard — código pronto e testado com mocks; falta testar com as chaves reais (Supabase + EmailJS)
- ✅ Feedback de sucesso ou erro após o envio

## 5. Dashboard do dono

- ⬜ Acesso protegido por login, redirecionando quem não está autenticado
- ⬜ Lista das mensagens recebidas, com opção de marcar como respondida
- ⬜ Seleção dos projetos em destaque na home

## 6. Preferências do visitante

- ✅ Tema claro/escuro persistido entre visitas

## 7. Interface

- ⬜ Layout responsivo testado em celular e desktop
- 🟨 Componentes visuais reaproveitados (mesmo botão, mesmo card em todas as páginas)
- 🟨 Identidade visual própria (ver `docs/design.md`) — hero tipográfico, caderno de projetos, bancada carimbada, fontes e animações de entrada prontos

## 8. Performance

- ⬜ Lighthouse mobile ≥ 80 em performance
- 🟨 Imagens otimizadas (WebP/AVIF, tamanho certo, lazy) — pipeline e `Picture` prontos; faltam as fotos
- 🟨 Dashboard e elementos pesados carregados sob demanda (`React.lazy`) — formulário, Supabase e EmailJS prontos (decisão 19); falta o dashboard
- 🟨 Sem saltos de layout (CLS) — skeleton com a mesma altura do card
- ✅ Sem requisições repetidas à API do GitHub ao navegar (cache do TanStack Query + `localStorage`; a página do projeto reaproveita a listagem)

## 9. Testes

- ✅ Validação do formulário de contato (`contactSchema.test.js`, `ContactForm.test.jsx`)
- ⬜ Bloqueio do dashboard sem login
- ✅ Rota inexistente exibe 404 (`NotFoundPage.test.jsx`)

## 10. Deploy

- ⬜ Site publicado com URL pública
- ⬜ Deploy automático a cada push na `main` (integração Vercel ↔ GitHub)

## 11. Versionamento

- ✅ Padrão de commits definido e verificado (Conventional Commits + commitlint)
- ✅ Estratégia de branches definida (GitHub Flow, ver `docs/conventions.md`)
- ✅ Padrões descritos no README e nas instruções da IA (`CLAUDE.md`)
- ⬜ Proteção da branch `main` no GitHub (exigir PR + CI)

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
