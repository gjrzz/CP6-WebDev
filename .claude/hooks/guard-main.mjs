// PreToolUse: impede o Claude de commitar ou dar push direto na main.
// Lê o JSON do hook pela stdin; exit code 2 bloqueia a ação e devolve a mensagem ao Claude.
import { execSync } from 'node:child_process';

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  const command = JSON.parse(input || '{}').tool_input?.command ?? '';
  if (!/\bgit\s+(commit|push)\b/.test(command)) process.exit(0);

  let branch = '';
  try {
    branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  } catch {
    process.exit(0);
  }

  if (branch === 'main' || branch === 'master') {
    console.error(
      `Bloqueado: você está na branch "${branch}". Crie uma branch antes (ex.: git switch -c feature/nome-da-tarefa), conforme docs/conventions.md.`,
    );
    process.exit(2);
  }
  process.exit(0);
});
