// Page weight against the plan's budgets (plan Phase 10): HTML + CSS under 60 KB compressed, JS under 35 KB on the home
// and 20 KB on an article (what the page loads at once: its module scripts and their imports; lazy chunks are not counted).
// Measured on dist/ with gzip. Exits 1 when a page is over. Run after `npm run build`:   npm run budgets
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const dist = new URL('../dist/', import.meta.url).pathname;
const gz = (file) => zlib.gzipSync(fs.readFileSync(file), { level: 9 }).length;
const read = (url) => path.join(dist, url.replace(/^\//, '').split(/[?#]/)[0]);

// the files a module script pulls in: itself and its static imports (import "./x.js" / from "./x.js")
function jsOf(entry, seen = new Set()) {
  if (seen.has(entry) || !fs.existsSync(entry)) return seen;
  seen.add(entry);
  const src = fs.readFileSync(entry, 'utf8');
  for (const m of src.matchAll(/(?:from|import)\s*["'](\.[^"']+\.js)["']/g)) jsOf(path.resolve(path.dirname(entry), m[1]), seen);
  return seen;
}

const KB = (n) => (n / 1024).toFixed(1).padStart(5) + ' KB';
const pages = [
  ['home', 'index.html', 35], ['home (en)', 'en/index.html', 35], ['home (ar)', 'ar/index.html', 35],
  ['blog list', 'blog/index.html', 35], ['article', 'blog/margaret-hamilton/index.html', 20], ['article with video', 'blog/carnaval-de-cadiz-analisis-del-popuri-de-los-renacidos/index.html', 20],
  ['projects', 'proyectos/index.html', 35], ['project', 'proyectos/luz/index.html', 35], ['policy', 'politica-de-cookies/index.html', 20], ['404', '404.html', 35]
];
let bad = 0;
console.log('page'.padEnd(22), 'HTML'.padStart(8), 'CSS'.padStart(8), 'HTML+CSS'.padStart(9), ' JS'.padStart(9), '  budget');
for (const [name, file, jsBudget] of pages) {
  const html = fs.readFileSync(path.join(dist, file), 'utf8');
  const htmlGz = gz(path.join(dist, file));
  const css = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => read(m[1]));
  const cssGz = css.reduce((n, f) => n + gz(f), 0);
  const scripts = [...html.matchAll(/<script[^>]+type="module"[^>]+src="([^"]+)"/g)].map((m) => read(m[1]));
  const inline = [...html.matchAll(/<script type="module">([^]*?)<\/script>/g)].map((m) => m[1]);
  const files = new Set();
  for (const s of scripts) jsOf(s, files);
  for (const code of inline) for (const m of code.matchAll(/import\s*["'](\/[^"']+\.js)["']/g)) jsOf(read(m[1]), files);
  const jsGz = [...files].reduce((n, f) => n + gz(f), 0);
  const over = htmlGz + cssGz > 60 * 1024 || jsGz > jsBudget * 1024;
  if (over) bad++;
  console.log(name.padEnd(22), KB(htmlGz), KB(cssGz), KB(htmlGz + cssGz), KB(jsGz), `  ≤60 / ≤${jsBudget}`, over ? '  ✗ OVER' : '  ✓');
}
if (bad) { console.error(`${bad} page(s) over budget`); process.exit(1); }
