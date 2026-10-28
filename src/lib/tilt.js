// Inclinação fixa entre -max e max graus derivada do texto: o mesmo card
// chega sempre com o mesmo ângulo, sem mudar a cada render.
export function tiltFor(text, max = 3) {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  const unit = (Math.abs(hash) % 1000) / 999;
  return Math.round((unit * 2 * max - max) * 10) / 10;
}
