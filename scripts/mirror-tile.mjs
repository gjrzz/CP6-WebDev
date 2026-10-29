// Transforma uma textura num ladrilho espelhado 2×2, que repete sem emenda em CSS.
// Uso: node scripts/mirror-tile.mjs <entrada.png> <saída.png>
import sharp from 'sharp';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('Uso: node scripts/mirror-tile.mjs <entrada.png> <saída.png>');
  process.exit(1);
}

const { width, height } = await sharp(input).metadata();
const copy = (image) => image.png().toBuffer();

const tiles = await Promise.all([
  copy(sharp(input)),
  copy(sharp(input).flop()),
  copy(sharp(input).flip()),
  copy(sharp(input).flip().flop()),
]);

await sharp({ create: { width: width * 2, height: height * 2, channels: 4, background: '#0000' } })
  .composite([
    { input: tiles[0], left: 0, top: 0 },
    { input: tiles[1], left: width, top: 0 },
    { input: tiles[2], left: 0, top: height },
    { input: tiles[3], left: width, top: height },
  ])
  .png()
  .toFile(output);

console.log(`✓ ${output} (${width * 2} × ${height * 2})`);
