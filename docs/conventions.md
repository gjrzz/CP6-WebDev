# Convenções de Git e código

## Branches — GitHub Flow

- `main` é sempre publicável: cada push nela vira deploy na Vercel.
- Toda mudança nasce numa branch curta a partir da `main` atualizada:

| Prefixo    | Uso                           | Exemplo                  |
| ---------- | ----------------------------- | ------------------------ |
| `feature/` | Funcionalidade nova           | `feature/github-cards`   |
| `fix/`     | Correção                      | `fix/form-double-submit` |
| `docs/`    | Só documentação               | `docs/readme-deploy`     |
| `chore/`   | Config, dependências, tooling | `chore/husky-setup`      |
| `style/`   | Visual sem mudar lógica       | `style/hero-typography`  |
| `test/`    | Só testes                     | `test/dashboard-guard`   |

- Nome em kebab-case, curto e descritivo.
- A branch volta para a `main` por **pull request** com o CI verde. Depois do merge, apague a branch.

### Caminho de uma alteração

```
git switch main && git pull
git switch -c feature/github-cards
# código + testes, commits pequenos
git push -u origin feature/github-cards
# abre PR → CI (lint, format, test, build) roda → Vercel gera preview
# merge na main → Vercel publica em produção
```

## Commits — Conventional Commits

Formato: `tipo(escopo opcional): descrição no imperativo, em português`

| Tipo           | Quando                                 |
| -------------- | -------------------------------------- |
| `feat`         | Funcionalidade nova para o usuário     |
| `fix`          | Correção de bug                        |
| `docs`         | Documentação                           |
| `style`        | Visual/formatação, sem mudar lógica    |
| `refactor`     | Reestruturação sem mudar comportamento |
| `perf`         | Melhoria de performance                |
| `test`         | Testes                                 |
| `build` / `ci` | Build, dependências, pipeline          |
| `chore`        | Manutenção geral e configs             |

Exemplos:

```
feat(contato): adiciona validação por campo com zod
fix(github): trata limite de requisições da API
perf(home): carrega o dashboard sob demanda
test(dashboard): cobre redirecionamento sem login
```

Regras:

- Um commit = um propósito. Se a descrição precisa de "e", provavelmente são dois commits.
- Descrição em minúsculas, sem ponto final, até 100 caracteres no cabeçalho.
- O `commitlint` (hook `commit-msg`) rejeita mensagens fora do padrão.

## Código

- Formatação automática pelo Prettier (aspas simples, ponto e vírgula, 100 colunas). Não discuta estilo; rode `npm run format`.
- ESLint com regras de hooks do React. Nada de `eslint-disable` sem comentário explicando o motivo.
- `lint-staged` roda ESLint e Prettier nos arquivos do commit (hook `pre-commit`).
- Classes do Tailwind são ordenadas automaticamente pelo plugin do Prettier.
- Use os tokens de cor (`ink`, `paper`, `muted`, `accent`); não escreva hex solto nos componentes.
- Sem `console.log` esquecido em código de produção.
