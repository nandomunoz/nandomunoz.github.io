// Checks that every post's Markdown renders to the same text, links, images, headings and list items as the
// blocks it came from (maqueta/shared/blog.json), in the three languages:  node tools/verify-content.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { satteri } from '@astrojs/markdown-satteri';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const blog = JSON.parse(fs.readFileSync(path.join(ROOT, 'maqueta/shared/blog.json'), 'utf8'));
// The same processor and options as astro.config.mjs
const proc = await satteri({ features: { smartPunctuation: false, headingAttributes: true } }).createRenderer({ syntaxHighlight: false, gfm: false });

const ENT = { amp: '&', quot: '"', lt: '<', gt: '>', nbsp: ' ', apos: "'" };
const text = (h) => h.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ')
  .replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e] ?? m))
  .replace(/\s+/g, ' ').trim();
const count = (h, re) => (h.match(re) || []).length;

// what the blocks say, as text (the order is the document's)
const WATCH = { es: 'Ver en YouTube', en: 'Watch on YouTube', ar: 'شاهد على YouTube' };
function expected(body, L) {
  const parts = [];
  for (const x of body) {
    if (x.p != null) parts.push(x.p);
    else if (x.h) parts.push(x.h);
    else if (x.ul) parts.push(...x.ul);
    else if (x.code != null) parts.push(x.code.replace(/&/g, '&amp;').replace(/</g, '&lt;'));  // literal text, not markup
    else if (x.img) parts.push(x.cap || '');
    else if (x.quote) parts.push(...x.quote, x.cite || '');
    else if (x.pull) parts.push(...x.pull, x.cite || '');
    else if (x.yt) parts.push(`<a href="https://www.youtube.com/watch?v=${x.yt}">`, x.title, `${WATCH[L]} ↗`, x.cap || '');
    else if (x.tweet != null) parts.push(x.tweet, x.by, '·', x.date || 'X', `<a href="${x.url}">`);
    else if (x.embed) parts.push(`<a href="${x.embed}">`, x.embed, x.cap || '');
    else if (x.gist) parts.push(`<a href="${x.gist}">`, x.gist);
    else if (x.table) parts.push(...x.table.head, ...x.table.rows.flat(), x.cap || '');
    else if (x.timeline) for (const s of x.timeline) parts.push(s.when, s.title, s.text || '', s.by || '');
  }
  return parts;
}

let bad = 0, total = 0;
for (const p of blog.posts) for (const L of ['es', 'en', 'ar']) {
  total++;
  const file = path.join(ROOT, 'astro/src/content/posts', p.id, `${L === 'es' ? 'index' : L}.md`);
  const body = fs.readFileSync(file, 'utf8').replace(/^---[\s\S]*?\n---\n/, '');
  const html = (await proc.render(body)).code;
  const want = expected(p[L].body, L);
  const norm = (s) => text(s).replace(/\s+/g, '');
  const a = norm(html), b = norm(want.join(' '));
  const wantHtml = want.join('\n');
  const problems = [];
  if (a !== b) {
    let i = 0; while (a[i] === b[i]) i++;
    problems.push(`text differs at char ${i}: got «${a.slice(Math.max(0, i - 25), i + 40)}» / want «${b.slice(Math.max(0, i - 25), i + 40)}»`);
  }
  for (const [name, re] of [['links', /<a\s/g], ['em', /<em[\s>]/g], ['strong', /<strong[\s>]/g], ['br', /<br\s*\/?>/g]]) {
    const g = count(html, re), w = count(wantHtml, re);
    if (g !== w) problems.push(`${name}: ${g} rendered, ${w} in the blocks`);
  }
  const h2 = p[L].body.filter((x) => x.h && x.lv !== 3).length, h3 = p[L].body.filter((x) => x.h && x.lv === 3).length;
  if (count(html, /<h2[\s>]/g) !== h2) problems.push(`h2: ${count(html, /<h2[\s>]/g)} vs ${h2}`);
  if (count(html, /<h3[\s>]/g) !== h3) problems.push(`h3: ${count(html, /<h3[\s>]/g)} vs ${h3}`);
  if (count(html, /<img\s/g) !== p[L].body.filter((x) => x.img).length) problems.push('images differ');
  if (problems.length) { bad++; console.log(`✗ ${p.id}/${L}\n   ${problems.join('\n   ')}`); }
}
console.log(bad ? `${bad} of ${total} files differ` : `✓ ${total} files (11 posts × 3 languages) render what the blocks say`);
process.exit(bad ? 1 : 0);
