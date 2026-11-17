// Walks dist/ and checks every internal link, image, script and stylesheet resolves to a file, and every
// #fragment exists in its page (plan Phase 10):  node tools/check-links.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) f.isDirectory() ? walk(path.join(d, f.name)) : f.name.endsWith('.html') && files.push(path.join(d, f.name)); })(DIST);

// code samples are text, not links: what is inside <pre> and <code> is left out
const html = new Map(files.map((f) => [f, fs.readFileSync(f, 'utf8').replace(/<(pre|code)[\s\S]*?<\/\1>/g, '')]));
const resolve = (url) => {
  const p = decodeURIComponent(url.replace(/[?#].*$/, ''));
  const abs = path.join(DIST, p);
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
  const idx = path.join(abs, 'index.html');
  return fs.existsSync(idx) ? idx : null;
};
const ids = new Map();
const idsOf = (f) => { if (!ids.has(f)) ids.set(f, new Set([...html.get(f).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))); return ids.get(f); };

let bad = 0, n = 0;
for (const [file, src] of html) {
  const page = '/' + path.relative(DIST, file).replace(/index\.html$/, '');
  const links = [...src.matchAll(/\s(?:href|src|srcset|poster)="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0]));
  for (const link of new Set(links)) {
    if (!link || /^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(link)) continue;
    n++;
    const [pathPart, hash] = link.split('#');
    const target = pathPart ? resolve(pathPart.startsWith('/') ? pathPart : path.posix.join(page, pathPart)) : file;
    if (!target) { bad++; console.log(`✗ ${page}  → ${link}  (no such file)`); continue; }
    if (hash && target.endsWith('.html') && !idsOf(target).has(decodeURIComponent(hash))) { bad++; console.log(`✗ ${page}  → ${link}  (no #${hash} in the target)`); }
  }
}
console.log(bad ? `${bad} broken of ${n} internal links in ${files.length} pages` : `✓ ${n} internal links in ${files.length} pages, none broken`);
process.exit(bad ? 1 : 0);
