---
name: commit
description: Analisa as mudanças pendentes e cria commits pequenos no padrão Conventional Commits em português. Use quando o pedido for commitar, ou ao final de uma funcionalidade.
---

# Commits no padrão do projeto

1. Confirme que não está na `main` (`git branch --show-current`). Se estiver, pare e peça para criar uma branch.
2. Leia `git status` e `git diff` (incluindo `git diff --staged`).
3. Agrupe as mudanças por propósito. Cada grupo vira um commit. Exemplos de separação:
   - service + hook novos → `feat(github): busca repositórios do usuário`
   - componente visual → `feat(home): adiciona cards de projeto com skeleton`
   - testes → `test(contato): cobre mensagens de validação`
   - docs → `docs: atualiza status dos requisitos`
4. Para cada grupo: `git add <arquivos do grupo>` e `git commit -m "<tipo>(<escopo>): <descrição>"`.
   - Tipos válidos: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
   - Descrição no imperativo, em português, minúsculas, sem ponto final, até 100 caracteres.
5. Se o hook `pre-commit` (lint-staged) ou `commit-msg` (commitlint) falhar, leia o erro, corrija e tente de novo. Nunca use `--no-verify`.
6. Mostre ao final a lista de commits criados (`git log --oneline main..HEAD`).
