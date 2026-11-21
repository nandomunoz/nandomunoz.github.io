// SEO checks on the built site (plan Phase 9): what a crawler and a social preview read, page by page, without a browser.
//   · every indexable page: one canonical (absolute, its own address), a unique title (10–70) and description (50–170), one h1,
//     html lang that matches its language folder, Open Graph and Twitter tags with an image that exists, JSON-LD that parses
//   · hreflang: every alternate exists, points back (reciprocal) and includes itself; x-default present
//   · noindex pages (404s) are out of the sitemap; every sitemap URL is a page that exists, is indexable and is its own canonical
//   · robots.txt names the sitemap; RSS feeds exist per language; no internal link to http:
// Run after `npm run build`:  npm run seo
import fs from 'node:fs';
import path from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const ORIGIN = 'https://nandomunoz.com';
const bad = [], warn = [];
const fail = (page, what) => bad.push(`${page}: ${what}`);

const pages = {};   // path → html
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (e.name === 'index.html' || e.name === '404.html') {
      const rel = '/' + path.relative(dist, f).replace(/index\.html$/, '').replace(/404\.html$/, '404.html');
      pages[rel] = fs.readFileSync(f, 'utf8');
    }
  }
})(dist);

const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const metas = (h) => [...h.matchAll(/<meta\b[^>]*>/g)].map((m) => m[0]);
const meta = (h, key) => { const t = metas(h).find((m) => attr(m, 'name') === key || attr(m, 'property') === key); return t && attr(t, 'content'); };
const links = (h, rel) => [...h.matchAll(/<link\b[^>]*>/g)].map((m) => m[0]).filter((l) => attr(l, 'rel') === rel);
const exists = (u) => { const p = new URL(u, ORIGIN).pathname; return fs.existsSync(path.join(dist, p.endsWith('/') ? p + 'index.html' : p)); };
const lang = (p) => (p.startsWith('/en/') ? 'en' : p.startsWith('/ar/') ? 'ar' : 'es');

const titles = new Map(), descs = new Map(), indexable = new Set(), alt = {};
for (const [p, h] of Object.entries(pages)) {
  const noindex = /<meta[^>]*name="robots"[^>]*noindex/.test(h);
  if (noindex) continue;
  indexable.add(p);
  const canon = links(h, 'canonical');
  if (canon.length !== 1) fail(p, `${canon.length} canonical links`);
  else if (attr(canon[0], 'href') !== ORIGIN + p) fail(p, `canonical ${attr(canon[0], 'href')} is not its own address`);
  const title = h.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  if (title.length < 10 || title.length > 70) (title.length < 3 || title.length > 130 ? fail : (a, b) => warn.push(`${a}: ${b}`))(p, `title length ${title.length}: ${title}`);
  titles.set(title, [...(titles.get(title) ?? []), p]);
  const d = meta(h, 'description') ?? '';
  if (d.length < 25) fail(p, `description length ${d.length}`);
  else if (d.length > 200) warn.push(`${p}: description length ${d.length} (a snippet cuts it at about 160)`);
  descs.set(d, [...(descs.get(d) ?? []), p]);
  const h1 = [...h.matchAll(/<h1[\s>]/g)].length;
  if (h1 !== 1) fail(p, `${h1} h1`);
  const hl = h.match(/<html[^>]*\blang="([^"]*)"/)?.[1];
  if (hl?.split('-')[0] !== lang(p)) fail(p, `html lang ${hl} in a ${lang(p)} page`);
  for (const k of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:locale', 'twitter:card']) if (!meta(h, k)) fail(p, `no ${k}`);
  const img = meta(h, 'og:image');
  if (img && !exists(img)) fail(p, `og:image missing: ${img}`);
  if (meta(h, 'og:url') && meta(h, 'og:url') !== ORIGIN + p) fail(p, `og:url ${meta(h, 'og:url')}`);
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const needsLd = /^\/(en\/|ar\/)?$/.test(p) || meta(h, 'og:type') === 'article' || /^\/(proyectos|en\/projects|ar\/projects)\/[^/]+\/$/.test(p);
  if (ld.length > 1 || (needsLd && !ld.length)) fail(p, `${ld.length} JSON-LD blocks`);
  else if (ld.length) try { const j = JSON.parse(ld[0][1]); if (!Array.isArray(j['@graph']) || !j['@graph'].every((n) => n['@type'])) fail(p, 'JSON-LD without @graph of typed nodes'); } catch (e) { fail(p, `JSON-LD does not parse: ${e.message}`); }
  alt[p] = Object.fromEntries(links(h, 'alternate').filter((l) => attr(l, 'hreflang')).map((l) => [attr(l, 'hreflang'), attr(l, 'href')]));
  if (/href="http:\/\/(?:www\.)?nandomunoz\.com/.test(h)) fail(p, 'internal link over http');
}
// unique within a language (the same title in two languages is how it is); the two articles the owner has not merged yet only warn
const dupe = (label, map) => { for (const [t, ps] of map) for (const l of ['es', 'en', 'ar']) {
  const same = ps.filter((x) => lang(x) === l && (label === 'title' || !/\/\d+\/$/.test(x)));   // (page 2 of a list shares page 1's description)
  if (same.length < 2) continue;
  const posts = same.every((x) => /\/blog\/[^/]+\/$/.test(x) && !/\/(2|3|categoria|category|etiqueta|tag)\//.test(x) && meta(pages[x], 'og:type') === 'article');
  (posts ? (a, b) => warn.push(`${a}: ${b}`) : fail)(same[0], `the ${label} «${t.slice(0, 60)}» is shared by ${same.length} pages (${same.slice(0, 3).join(', ')})`);
} };
dupe('title', titles); dupe('description', descs);

// hreflang
for (const [p, a] of Object.entries(alt)) {
  const langs = Object.keys(a);
  if (!langs.length) continue;
  if (!a['x-default']) fail(p, 'hreflang without x-default');
  if (a[lang(p)] !== ORIGIN + p) fail(p, `hreflang does not include itself (${a[lang(p)]})`);
  for (const [l, href] of Object.entries(a)) {
    if (!exists(href)) { fail(p, `hreflang ${l} → ${href} does not exist`); continue; }
    const back = alt[new URL(href).pathname];
    if (l !== 'x-default' && back && back[lang(p)] !== ORIGIN + p) fail(p, `hreflang ${l} → ${href} does not point back`);
  }
}

// sitemap
const sm = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const inMap = new Set(locs.map((u) => new URL(u).pathname));
for (const u of locs) {
  const p = new URL(u).pathname;
  if (!exists(u)) fail('sitemap', `${u} does not exist`);
  else if (!indexable.has(p)) fail('sitemap', `${u} is noindex or has no canonical`);
}
for (const p of indexable) if (!inMap.has(p) && !/\/\d+\/$/.test(p)) fail(p, 'indexable but not in the sitemap');   // (the paginated lists are left out on purpose)
// robots and feeds
const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) fail('robots.txt', 'does not name the sitemap');
if (!/^Disallow: \/eastereggs\/$/m.test(robots)) fail('robots.txt', 'does not disallow /eastereggs/ (games, not for search or AI)');
(function eggs(d) {                                                   // every easter-egg page says noindex, and none is in the sitemap
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) eggs(f);
    else if (e.name.endsWith('.html') && !/<meta[^>]*name="robots"[^>]*noindex[^>]*noai/.test(fs.readFileSync(f, 'utf8'))) fail('/' + path.relative(dist, f), 'easter egg without noindex and noai');
  }
})(path.join(dist, 'eastereggs'));
if (/\/eastereggs\//.test(fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8'))) fail('sitemap.xml', 'lists an easter egg');
for (const f of ['rss.xml', 'en/rss.xml', 'ar/rss.xml']) if (!fs.existsSync(path.join(dist, f))) fail(f, 'missing');

warn.forEach((w) => console.log('  ~', w));
bad.forEach((b) => console.log('  ✗', b));
console.log(bad.length ? `\n${bad.length} SEO problem(s) in ${indexable.size} indexable pages` : `✓ SEO: ${indexable.size} indexable pages, ${locs.length} in the sitemap, hreflang reciprocal`);
if (bad.length) process.exit(1);
