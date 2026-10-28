# CLAUDE.md — Portfólio Gabriel Juarez (CP3 WebDev / FIAP)

Site de portfólio em React, publicado na Vercel. Entrega em **03/11**. Leia os documentos abaixo antes de qualquer tarefa; eles são a fonte da verdade do projeto.

@docs/requirements.md
@docs/architecture.md
@docs/conventions.md
@docs/design.md

A ordem das tarefas, o escopo e o que está fora dele ficam em `docs/roadmap.md`: não implemente nada listado em "Fora".

As justificativas das escolhas de stack ficam em `docs/decisions.md`: consulte antes de propor trocar uma biblioteca e registre ali qualquer decisão nova.

## Regras inegociáveis

1. **Nunca trabalhe na `main`.** Toda tarefa começa numa branch `tipo/descricao` (ver `docs/conventions.md`). Um hook bloqueia `git commit` e `git push` na `main`.
2. **Os commits e pushes são feitos pelo Gabriel.** Você nunca roda `git add`, `git commit` nem `git push` (só cria a branch da tarefa com `git switch -c`). Ao final de cada tarefa, entregue um **plano de commits** com a skill `/commit`: commits em Conventional Commits, em português, pequenos e com um propósito só (o commitlint rejeita mensagens fora do padrão).
3. **JavaScript (.js/.jsx), sem TypeScript.** Imports internos sempre com o alias `@/`.
4. **Lógica fora dos componentes visuais.** Chamada de API vai em `src/services/`, estado e efeitos em `src/hooks/`. Componente em `pages/` e `components/` só monta a tela.
5. **Todo dado assíncrono tem 3 estados na tela:** carregando (skeleton), erro e lista vazia.
6. **Nada de segredo no código.** Variáveis em `.env` (fora do Git) e documentadas em `.env.example`. Nunca leia nem exiba o `.env`.
7. **Performance é requisito:** anime só `transform` e `opacity`, imagens em WebP/AVIF com `width`/`height` e `loading="lazy"`, páginas e cenas pesadas com `React.lazy`.
8. **Acessibilidade:** respeite `prefers-reduced-motion`, todo texto importante existe no DOM (não só em imagem), imagens têm `alt`.

## Antes de dizer que terminou

Rode, nesta ordem, e só conclua com tudo passando:

```bash
npm run lint
npm test
npm run build
```

Depois atualize o status do requisito em `docs/requirements.md`.

## Comandos

| Comando                     | O que faz             |
| --------------------------- | --------------------- |
| `npm run dev`               | Servidor local (Vite) |
| `npm run lint` / `lint:fix` | ESLint                |
| `npm run format`            | Prettier em tudo      |
| `npm test` / `test:watch`   | Vitest                |
| `npm run build`             | Build de produção     |

## Skills e agentes do projeto

- `/feature <descrição>`: fluxo completo de uma funcionalidade (branch → plano → código → testes → commits).
- `/commit`: agrupa as mudanças e entrega o plano de commits (comandos para o Gabriel colar), sem commitar.
- `/component <Nome>`: cria componente seguindo a arquitetura.
- Agente `code-reviewer`: revisa o diff contra a arquitetura e as convenções. Use antes de abrir PR.
- Agente `requirements-checker`: confere o que falta para cumprir os requisitos do CP.
