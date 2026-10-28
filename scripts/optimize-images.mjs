// Gera as versões otimizadas (AVIF e WebP, 640 e 1280 px) das fotos em src/assets/raw.
// Uso: npm run images [-- <pasta-de-entrada> <pasta-de-saída>]
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const RAW_DIR = path.resolve(process.argv[2] ?? path.join(ROOT, 'src/assets/raw'));
const OUT_DIR = path.resolve(process.argv[3] ?? path.join(ROOT, 'src/assets/img'));

const WIDTHS = [640, 1280];
const EXTENSIONS = ['.png', '.jpg', '.jpeg'];
// AVIF e WebP preservam o canal alfa dos PNG recortados
const FORMATS = {
  avif: { quality: 50 },
  webp: { quality: 80, alphaQuality: 90 },
};

async function listSources() {
  try {
    const files = await readdir(RAW_DIR);
    return files.filter((file) => EXTENSIONS.includes(path.extname(file).toLowerCase())).sort();
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function isUpToDate(output, sourceTime) {
  try {
    return (await stat(output)).mtimeMs >= sourceTime;
  } catch {
    return false;
  }
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`.padStart(8);
}

async function optimize(file) {
  const source = path.join(RAW_DIR, file);
  const name = path.parse(file).name;
  const sourceTime = (await stat(source)).mtimeMs;
  const { width: sourceWidth } = await sharp(source).metadata();

  // Não amplia: só gera as larguras que a foto original comporta
  const widths = WIDTHS.filter((width) => width <= sourceWidth);
  if (widths.length === 0) {
    console.warn(`! ${file}: ${sourceWidth}px de largura; use pelo menos ${WIDTHS[0]}px`);
    widths.push(sourceWidth);
  } else if (sourceWidth > widths.at(-1) && sourceWidth < WIDTHS.at(-1)) {
    // Entre dois tamanhos (ex.: 864px): gera também na largura original, para não jogar
    // fora a resolução que existe acima dos 640
    widths.push(sourceWidth);
  }

  for (const width of widths) {
    for (const [format, options] of Object.entries(FORMATS)) {
      const output = path.join(OUT_DIR, `${name}-${width}.${format}`);
      if (await isUpToDate(output, sourceTime)) {
        console.log(`  ${path.basename(output)} (sem mudanças)`);
        continue;
      }
      // rotate() aplica a orientação do EXIF das fotos de celular
      const info = await sharp(source).rotate().resize({ width })[format](options).toFile(output);
      console.log(`✓ ${path.basename(output).padEnd(28)} ${formatSize(info.size)}`);
    }
  }
}

const sources = await listSources();
if (sources.length === 0) {
  const shownDir = RAW_DIR.startsWith(ROOT) ? path.relative(ROOT, RAW_DIR) : RAW_DIR;
  console.warn(`Nenhuma imagem .png, .jpg ou .jpeg em ${shownDir}.`);
  console.warn('Adicione as fotos (lista no README, seção "Imagens") e rode de novo.');
  process.exit(0);
}

await mkdir(OUT_DIR, { recursive: true });

const seen = new Set();
for (const file of sources) {
  const name = path.parse(file).name;
  if (seen.has(name)) {
    console.warn(`! ${file}: já existe outra imagem chamada "${name}"; ignorada`);
    continue;
  }
  seen.add(name);

  try {
    await optimize(file);
  } catch (error) {
    console.error(`✗ ${file}: ${error.message}`);
    process.exitCode = 1;
  }
}
