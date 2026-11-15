// Trama's logo as favicon: the «NM» of the mark (Doto's 5×7 dot letters,
// read from the font's own grid), one dot per lit cell, ink on charcoal.
// Writes maqueta/favicon.svg, favicon-32.png and apple-touch-icon.png.
//   node maqueta/tools/favicon.cjs        (the PNGs need sharp; the SVG does not)
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..');
const N = ['10001', '10001', '11001', '10101', '10011', '10001', '10001'];
const M = ['10001', '10001', '11011', '10101', '10001', '10001', '10001'];
const BG = '#292929', INK = '#f4f2ee';

// the glyphs side by side with one empty column between: 11 × 7 cells
const rows = N.map((r, i) => r + '0' + M[i]);
function svg(size, { pad = 0.105, r = 0.43, bg = true } = {}) {
  const cols = rows[0].length, p = (size * (1 - 2 * pad)) / cols;           // cell pitch
  const x0 = (size - cols * p) / 2, y0 = (size - rows.length * p) / 2;
  const dots = rows.flatMap((row, j) => [...row].map((c, i) => c === '1'
    ? `<circle cx="${(x0 + (i + 0.5) * p).toFixed(2)}" cy="${(y0 + (j + 0.5) * p).toFixed(2)}" r="${(p * r).toFixed(2)}"/>` : null)).filter(Boolean);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    `<title>NM</title>${bg ? `<rect width="${size}" height="${size}" fill="${BG}"/>` : ''}<g fill="${INK}">${dots.join('')}</g></svg>\n`;
}
fs.writeFileSync(path.join(OUT, 'favicon.svg'), svg(64));
(async () => {
  let sharp;
  try { sharp = require('sharp'); } catch { try { sharp = require('/home/ares/.npm/_npx/089d1fe0e470556a/node_modules/sharp'); } catch { console.log('favicon.svg only (no sharp)'); return; } }
  // small sizes: bigger dots and less margin so the letters survive 16–32 px
  await sharp(Buffer.from(svg(256, { pad: 0.07, r: 0.46 }))).resize(32, 32).png().toFile(path.join(OUT, 'favicon-32.png'));
  // the home-screen icon: a little more air around it
  await sharp(Buffer.from(svg(512, { pad: 0.16 }))).resize(180, 180).png().toFile(path.join(OUT, 'apple-touch-icon.png'));
  console.log('favicon.svg, favicon-32.png, apple-touch-icon.png');
})();
