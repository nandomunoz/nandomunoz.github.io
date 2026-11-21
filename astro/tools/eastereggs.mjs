// The other versions of the portfolio (Disquetes, VHS, Digital, Cassette) are static pages of the Cassette site, kept at the repo's
// root: eastereggs/<version>/<es|en>/ and the assets/ they load. They are published with this site, so the footer's barcode leads
// somewhere real: this copies both into dist/ as they are (/eastereggs/…, /assets/…). Runs after `astro build`, before csp.mjs.
// They carry their own Content-Security-Policy (build.mjs), which csp.mjs leaves alone.
// They are games, not content: in the copy they get a robots meta that keeps them out of search engines, snippets, caches and
// AI use (robots.txt disallows the folder too, and the sitemap never lists them). The Cassette's own pages are left as they are.
// Their logo (the brand, rel="home") leads out of the games, to this site's home in the page's language, instead of reloading
// the version (`./`): there `/en/` sends the Cassette's own English version to itself, so it cannot be done in build.mjs.
import fs from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const repo = new URL('../../', import.meta.url);
const VERSIONS = ['cassette', 'disquetes', 'vhs', 'digital'];
const ROBOTS = '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noai, noimageai">';

for (const dir of ['eastereggs', 'assets']) {
  if (!fs.existsSync(new URL(`${dir}/`, repo))) { console.error(`✗ ${dir}/ is missing at the repo's root`); process.exit(1); }
  // a path of this site must never be overwritten by a copy (nor the other way round)
  if (fs.existsSync(new URL(`${dir}/`, dist))) { console.error(`✗ dist/${dir}/ already exists: it would be overwritten`); process.exit(1); }
  fs.cpSync(new URL(`${dir}/`, repo), new URL(`${dir}/`, dist), { recursive: true });
}
let marked = 0, rehomed = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = new URL(e.name + (e.isDirectory() ? '/' : ''), dir);
    if (e.isDirectory()) { walk(f); continue; }
    if (!e.name.endsWith('.html')) continue;
    let html = fs.readFileSync(f, 'utf8');
    html = html.replace(/<meta[^>]*name="robots"[^>]*>\s*/g, '');                    // ours replaces any other
    const next = /<meta charset="[^"]*">/.test(html) ? html.replace(/(<meta charset="[^"]*">)/, `$1${ROBOTS}`) : html.replace(/<head([^>]*)>/, `<head$1>${ROBOTS}`);
    if (next === html) { console.error(`✗ ${f.pathname}: no <head> to put the robots meta in`); process.exit(1); }
    const lang = f.pathname.match(/\/eastereggs\/[a-z]+\/(es|en)\/index\.html$/)?.[1];
    let out = next;
    if (lang) {                                                         // a version's home (the stubs one level up have no logo)
      const brand = /(<a class="brand" href=")\.\/(" rel="home">)/;
      if (!brand.test(out)) { console.error(`✗ ${f.pathname}: the logo link is not where tools/eastereggs.mjs expects it`); process.exit(1); }
      out = out.replace(brand, `$1${lang === 'es' ? '/' : '/en/'}$2`); rehomed++;
    }
    fs.writeFileSync(f, out); marked++;
  }
})(new URL('eastereggs/', dist));
for (const v of VERSIONS) for (const l of ['es', 'en']) {
  if (!fs.existsSync(new URL(`eastereggs/${v}/${l}/index.html`, dist))) { console.error(`✗ eastereggs/${v}/${l}/ is not in dist/`); process.exit(1); }
}
console.log(`✓ ${VERSIONS.length} versions of the Cassette site in dist/eastereggs/ (and their assets/), ${marked} pages noindex, ${rehomed} logos lead to the site's home`);
