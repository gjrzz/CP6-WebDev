// PostToolUse: formata (Prettier) e corrige (ESLint) o arquivo que o Claude acabou de editar.
// Erros que o ESLint não consegue corrigir voltam para o Claude pela stderr (exit 2).
import { spawnSync } from 'node:child_process';

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  const file = JSON.parse(input || '{}').tool_input?.file_path;
  if (!file || /node_modules|[\\/]dist[\\/]/.test(file)) process.exit(0);

  const shell = process.platform === 'win32';
  if (/\.(jsx?|css|md|json|html)$/.test(file)) {
    spawnSync('npx', ['prettier', '--write', '--log-level', 'warn', file], {
      shell,
      stdio: 'ignore',
    });
  }
  if (/\.jsx?$/.test(file)) {
    const lint = spawnSync('npx', ['eslint', '--fix', file], { shell, encoding: 'utf8' });
    if (lint.status !== 0) {
      console.error(`ESLint encontrou problemas em ${file}:\n${lint.stdout}${lint.stderr}`);
      process.exit(2);
    }
  }
  process.exit(0);
});
