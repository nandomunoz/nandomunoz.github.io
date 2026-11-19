// Inventory and backup of the old WordPress (soynando.com) from its PUBLIC side: the Yoast sitemaps and the REST API
// (posts, pages, categories, tags, media, with their rendered HTML), the feed and robots.txt. No login, nothing is written to
// the site. It answers plan Phase 0/11: which old addresses exist, which of them the redirects cover, and keeps a copy of
// what the API gives (not a database backup: comments, plugins and private drafts are not reachable this way).
//
//   node tools/wp-inventory.mjs <output-dir> [--media]     (--media also downloads the original image files)
//
// Writes <output-dir>/{sitemap-urls.txt, rest/*.json, feed.xml, robots.txt, media/…, report.md}. Keep the folder out of the repo.
import fs from 'node:fs';
import path from 'node:path';

const ORIGIN = 'https://soynando.com';
const out = path.resolve(process.argv[2] ?? '');
if (!process.argv[2]) { console.error('usage: node tools/wp-inventory.mjs <output-dir> [--media]'); process.exit(2); }
const withMedia = process.argv.includes('--media');
fs.mkdirSync(path.join(out, 'rest'), { recursive: true });

const get = async (url, as = 'text') => {
  const r = await fetch(url, { headers: { 'user-agent': 'inventory-script' }, redirect: 'follow' });
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return as === 'json' ? r.json() : as === 'buffer' ? Buffer.from(await r.arrayBuffer()) : r.text();
};
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// 1. the sitemaps (what a search engine knows about)
const index = locs(await get(`${ORIGIN}/sitemap_index.xml`));
const sitemapUrls = {};
for (const sm of index) sitemapUrls[path.basename(sm, '.xml')] = locs(await get(sm));
fs.writeFileSync(path.join(out, 'sitemap-urls.txt'), Object.entries(sitemapUrls).map(([k, v]) => `# ${k}\n${v.join('\n')}`).join('\n\n') + '\n');

// 2. the REST API, every page of it
const rest = {};
for (const type of ['posts', 'pages', 'categories', 'tags', 'media', 'users']) {
  const all = [];
  for (let page = 1; ; page++) {
    let batch;
    try { batch = await get(`${ORIGIN}/wp-json/wp/v2/${type}?per_page=100&page=${page}&context=view`, 'json'); } catch { break; }
    all.push(...batch);
    if (batch.length < 100) break;
  }
  rest[type] = all;
  fs.writeFileSync(path.join(out, 'rest', `${type}.json`), JSON.stringify(all, null, 2));
}
fs.writeFileSync(path.join(out, 'feed.xml'), await get(`${ORIGIN}/feed/`));
fs.writeFileSync(path.join(out, 'robots.txt'), await get(`${ORIGIN}/robots.txt`));

// 3. the media files (optional: they are the heavy part)
let downloaded = 0;
if (withMedia) {
  for (const m of rest.media) {
    const url = m.source_url, dest = path.join(out, 'media', new URL(url).pathname.replace(/^\/wp-content\/uploads\//, ''));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (!fs.existsSync(dest)) { fs.writeFileSync(dest, await get(url, 'buffer')); downloaded++; }
  }
}

// 4. what the redirects cover (tools/redirects.mjs writes soynando-bulk-redirects.csv)
const csv = new URL('../redirects/soynando-bulk-redirects.csv', import.meta.url).pathname;
const rows = fs.existsSync(csv) ? fs.readFileSync(csv, 'utf8').trim().split('\n').map((l) => l.split(',')) : [];
const covered = (u) => {
  const p = 'soynando.com' + new URL(u).pathname;
  return rows.some(([s, , , , , sub]) => s === p || (sub === 'true' && p.startsWith(s)));
};
const lines = [`# soynando.com inventory (${new Date().toISOString().slice(0, 10)})`, ''];
const uncovered = [];
for (const [k, v] of Object.entries(sitemapUrls)) {
  lines.push(`## ${k} (${v.length})`);
  for (const u of v) { const ok = covered(u) || new URL(u).pathname === '/'; lines.push(`- ${ok ? '✓' : '✗'} ${u}`); if (!ok) uncovered.push(u); }
  lines.push('');
}
lines.push('## REST API', ...Object.entries(rest).map(([k, v]) => `- ${k}: ${v.length}`), withMedia ? `- media downloaded: ${downloaded}` : '- media: listed only (--media downloads the files)', '');
lines.push(`## Not covered by the redirects (${uncovered.length})`, ...uncovered.map((u) => `- ${u}`), '');
fs.writeFileSync(path.join(out, 'report.md'), lines.join('\n'));
console.log(lines.join('\n'));
