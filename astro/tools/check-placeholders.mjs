// ⟦…⟧ marks something only the owner knows (the contact address, the host's name): the build must not be published
// with one left. Scans dist/ and lists them; exits 1 unless --warn.
import fs from 'node:fs';
import path from 'node:path';
const dist = new URL('../dist/', import.meta.url).pathname;
const found = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (e.name.endsWith('.html')) for (const m of fs.readFileSync(f, 'utf8').matchAll(/⟦[^⟧]*⟧/g)) found.push([path.relative(dist, f), m[0]]);
  }
})(dist);
const by = {};
for (const [f, m] of found) (by[m] ??= new Set()).add('/' + f.replace(/index\.html$/, ''));
for (const [m, pages] of Object.entries(by)) console.log(`${m}  → ${[...pages].join(', ')}`);
console.log(found.length ? `${found.length} placeholders to fill before publishing` : '✓ no placeholders left');
if (found.length && !process.argv.includes('--warn')) process.exit(1);
