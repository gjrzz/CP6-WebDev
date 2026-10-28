---
name: commit
description: Analisa as mudanças pendentes e entrega um plano de commits pequenos no padrão Conventional Commits em português, como comandos PowerShell para o Gabriel colar. Não commita. Use quando o pedido for commitar, ou ao final de uma funcionalidade.
---

# Plano de commits no padrão do projeto

Os commits e o push são feitos pelo Gabriel. **Nunca rode `git add`, `git commit` nem `git push`.**

1. Confirme que não está na `main` (`git branch --show-current`). Se estiver, pare e peça para criar uma branch.
2. Leia `git status` e `git diff` (incluindo `git diff --staged`).
3. Agrupe as mudanças por propósito. Cada grupo vira um commit. Exemplos de separação:
   - service + hook novos → `feat(github): busca repositórios do usuário`
   - componente visual → `feat(home): adiciona cards de projeto com skeleton`
   - testes → `test(contato): cobre mensagens de validação`
   - docs → `docs: atualiza status dos requisitos`
4. Para cada grupo, escreva a mensagem seguindo `docs/conventions.md`:
   - Formato `<tipo>(<escopo opcional>): <descrição>`.
   - Tipos válidos: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
   - Descrição no imperativo, em português, minúsculas, sem ponto final, até 100 caracteres.
   - Um commit = um propósito. Se precisar de "e", são dois commits.
5. Entregue um único bloco PowerShell pronto para colar, com um par `git add` + `git commit` por grupo, na ordem em que devem ser feitos, terminando com o push da branch:

   ```powershell
   git add src/services/github.js src/hooks/useGithubRepos.js
   git commit -m "feat(github): busca repositórios do usuário"

   git add docs/requirements.md
   git commit -m "docs: atualiza status dos requisitos"

   git push -u origin <branch-atual>
   ```

   - Liste os arquivos explicitamente; nada de `git add .` ou `git add -A`.
   - Caminhos com espaço vão entre aspas.
   - Deixe de fora arquivos que não pertencem à tarefa e avise quais são.

6. Lembre o Gabriel de que o `pre-commit` (lint-staged) e o `commit-msg` (commitlint) rodam em cada commit. Se algum falhar, ele pode colar o erro aqui para você corrigir. Nunca sugira `--no-verify`.
