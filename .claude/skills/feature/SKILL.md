---
name: feature
description: Implementa uma funcionalidade do portfólio de ponta a ponta seguindo o fluxo do projeto (branch, plano, código, testes, commits). Use quando o pedido for construir ou alterar uma funcionalidade, ex. "/feature cards do github".
---

# Fluxo de funcionalidade

Siga os passos em ordem. Não pule o plano nem a verificação.

1. **Contexto.** Releia em `docs/requirements.md` o(s) requisito(s) que esta tarefa atende e confira `docs/architecture.md` para saber em quais pastas cada parte entra.
2. **Branch.** Garanta que a árvore está limpa (`git status`). Crie a branch a partir da `main`: `git switch main`, depois `git switch -c feature/<nome-kebab>` (ou o prefixo certo de `docs/conventions.md`). O `git pull` fica com o Gabriel.
3. **Plano.** Antes de escrever código, liste para o Gabriel:
   - arquivos que vai criar ou alterar, com a pasta de cada um;
   - como fica a divisão service → hook → componente;
   - quais estados de tela existem (carregando, erro, vazio, sucesso);
   - quais testes vai escrever;
   - a sequência de commits prevista.
     Espere a confirmação se a tarefa mexer em mais de 5 arquivos ou adicionar dependência.
4. **Implementação.** Comece pelo service, depois o hook, depois os componentes. Reaproveite `components/ui` antes de criar peça nova. Siga os padrões de animação e imagem de `docs/design.md`.
5. **Testes.** Escreva o teste ao lado do arquivo (`*.test.jsx`), cobrindo o comportamento visível para o usuário.
6. **Verificação.** Rode `npm run lint`, `npm test` e `npm run build`. Só siga com tudo passando.
7. **Commits.** Use a skill `commit`: commits pequenos, um propósito cada, em Conventional Commits.
8. **Fechamento.** Atualize o status em `docs/requirements.md` (no mesmo PR), registre decisões novas em `docs/decisions.md`, e sugira ao Gabriel o título e a descrição do PR seguindo `.github/pull_request_template.md`. Não faça push nem merge sem ele pedir.
