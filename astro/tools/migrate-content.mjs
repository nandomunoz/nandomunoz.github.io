// One-off (re-runnable) migration of the maqueta's content into Astro's collections (plan, Phase 3):
//   node tools/migrate-content.mjs
// Reads  ../data/{site,projects,kanjis-repos}.json, ../maqueta/shared/{blog,content-ar,kanji-cells}.json|js
//        and the images of ../maqueta/img.
// Writes src/content/{site,projects,categories,tags}.json, src/content/posts/<id>/{index,en,ar}.md
//        (index.md is the Spanish original; en.md and ar.md the machine translations), the posts' cover and
//        its halftone tone next to them, the body images in public/img/blog/posts/ (they stay <picture>s with
//        their prebuilt avif and webp, because raw HTML in Markdown cannot go through astro:assets) and the
//        projects' screenshots in src/assets/projects/.
// Blocks become Markdown where Markdown says it exactly (paragraphs, headings, lists, code) and raw HTML
// where it does not (pull quotes, video facades, tweets, tables, timelines): no MDX.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'astro');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const wr = (p, s) => { fs.mkdirSync(path.dirname(path.join(OUT, p)), { recursive: true }); fs.writeFileSync(path.join(OUT, p), s); };
const json = (o) => JSON.stringify(o, null, 2) + '\n';
const cp = (from, to) => { fs.mkdirSync(path.dirname(path.join(OUT, to)), { recursive: true }); fs.copyFileSync(path.join(ROOT, from), path.join(OUT, to)); };
const yaml = (v) => JSON.stringify(v); // JSON is valid YAML: quoting and unicode for free

// The kanji of each project and its gloss live in the maqueta's JS (shared/kanji-cells.js)
const tmp = path.join(os.tmpdir(), 'kanji-cells-migrate.mjs');
fs.writeFileSync(tmp, fs.readFileSync(path.join(ROOT, 'maqueta/shared/kanji-cells.js'), 'utf8').replace('const MEANING', 'export const MEANING'));
const { KANJI_OF, MEANING } = await import(pathToFileURL(tmp).href);

const HIDDEN = new Set(['coac-analisis', 'illo-loader']); // Trama does not show them (maqueta/shared/content.js)
const FEATURED = ['luz', 'quien-canta-hoy', 'streetcai', 'ikay', 'toolbar-aem'];
const LANGS = ['es', 'en', 'ar'];

// ---------------------------------------------------------------- site
const site = rd('data/site.json'), ar = rd('maqueta/shared/content-ar.json');
const own = (s) => (s.handle.includes('soynando.com') || s.url.includes('soynando.com')
  ? { ...s, handle: s.handle.replace('soynando.com', 'nandomunoz.com'), url: s.url.replace('soynando.com', 'nandomunoz.com') } : s);
wr('src/content/site.json', json({
  name: site.name, nick: site.nick, monogram: site.monogram, domain: 'nandomunoz.com',
  socials: [...site.socials, ...site.extraSocials].map(own),
  es: site.i18n.es, en: site.i18n.en, ar: { ...site.i18n.en, ...ar.site }
}));

// ---------------------------------------------------------------- projects
const projects = rd('data/projects.json');
let n = 0;
const out = projects.map((p) => {
  const hidden = HIDDEN.has(p.id), ch = KANJI_OF[p.id];
  const shot = ['jpg'].map((e) => `maqueta/img/proyectos/${p.id}.${e}`).find((f) => fs.existsSync(path.join(ROOT, f)));
  if (shot && !hidden) { cp(shot, `src/assets/projects/${p.id}.jpg`); if (fs.existsSync(path.join(ROOT, `maqueta/img/proyectos/${p.id}.tone.webp`))) cp(`maqueta/img/proyectos/${p.id}.tone.webp`, `src/assets/projects/${p.id}.tone.webp`); }
  return {
    id: p.id, order: hidden ? null : ++n, hidden, featured: FEATURED.includes(p.id),
    name: p.name, year: Number(p.year), tech: p.tech, demo: p.demo, repo: p.repo, plate: p.plate,
    kanji: ch ? { char: ch, meaning: { es: MEANING[ch][0], en: MEANING[ch][1], ar: MEANING[ch][2] } } : null,
    shot: shot && !hidden ? { src: `../assets/projects/${p.id}.jpg`, tone: `../assets/projects/${p.id}.tone.webp` } : null,
    es: p.es, en: p.en, ar: ar.projects[p.id] ? { kicker: ar.projects[p.id].kicker, body: ar.projects[p.id].body } : null
  };
});
wr('src/content/projects.json', json(out));

// ---------------------------------------------------------------- categories, tags
const blog = rd('maqueta/shared/blog.json');
wr('src/content/categories.json', json(Object.entries(blog.categories).map(([id, c]) => ({
  id, kind: c.kind, es: c.es, en: c.en, ar: ar.blog.categories[id]
}))));
wr('src/content/tags.json', json(Object.entries(blog.tags).map(([id, t]) => ({
  id, es: t.es, en: t.en, ar: ar.blog.tags[id] ?? t.en
}))));

// ---------------------------------------------------------------- posts
const plain = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const caption = (c) => (c ? `<figcaption>${c}</figcaption>` : '');
const startOf = (params) => (/start=(\d+)/.exec(params || '') || [])[1];
const oneLine = (h) => h.replace(/\n\s*/g, ' '); // no blank line may split an HTML block

// A stray backtick in the text (WordPress left them as plain characters) would open a Markdown code span
const tick = (s) => s.replace(/`/g, '\\`');

function renderBlock(x, L, pid) {
  const lang = L !== 'es' && x.lang === 'es' ? ' lang="es"' : '';
  if (x.p != null) return tick(x.p);
  if (x.h) return `${x.lv === 3 ? '###' : '##'} ${tick(x.h)}`;
  if (x.ul) return x.ul.map((s, i) => `${x.ol ? `${i + 1}.` : '-'} ${tick(s)}`).join('\n');
  if (x.code != null) { const f = x.code.includes('```') ? '````' : '```'; return `${f}${x.lang || ''}\n${x.code}\n${f}`; }
  if (x.img) {
    const f = x.img.split('/').pop();
    const base = f.replace(/\.jpe?g$/, '');
    for (const e of ['jpg', 'webp', 'avif']) { const from = `maqueta/img/blog/posts/${base}.${e}`; if (fs.existsSync(path.join(ROOT, from))) cp(from, `public/img/blog/posts/${base}.${e}`); }
    const src = `/img/blog/posts/${f}`;
    return oneLine(`<figure class="fig"><picture><source srcset="${src.replace(/\.jpe?g$/, '.avif')}" type="image/avif"><source srcset="${src.replace(/\.jpe?g$/, '.webp')}" type="image/webp"><img src="${src}" alt="${esc(x.alt)}" width="${x.w}" height="${x.hgt}" loading="lazy" decoding="async"></picture>${caption(x.cap)}</figure>`);
  }
  if (x.quote) return oneLine(`<blockquote${lang}>${x.quote.map((s) => `<p>${s}</p>`).join('')}${x.cite ? `<cite>${x.cite}</cite>` : ''}</blockquote>`);
  if (x.pull) return oneLine(`<figure class="pull"><blockquote${lang}>${x.pull.map((s) => `<p>${s}</p>`).join('')}</blockquote>${caption(x.cite)}</figure>`);
  if (x.yt) { const st = startOf(x.params); return oneLine(`<figure class="video"><yt-facade video="${x.yt}" title="${esc(x.title)}"${st ? ` start="${st}"` : ''}></yt-facade>${caption(x.cap)}</figure>`); }
  if (x.tweet != null) return oneLine(`<figure class="tweet"><blockquote lang="es">${x.tweet}</blockquote><figcaption><span>${x.by}</span> · <a href="${x.url}" rel="noopener">${x.date || 'X'}</a></figcaption></figure>`);
  if (x.embed) return oneLine(`<figure class="embed" data-host="${x.host}"><a href="${x.embed}" rel="noopener">${x.embed}</a>${caption(x.cap)}</figure>`);
  if (x.gist) return oneLine(`<figure class="embed" data-host="gist.github.com"><a href="${x.gist}" rel="noopener">${x.gist}</a></figure>`);
  if (x.table) return oneLine(`<figure class="table"><div class="scroll" tabindex="0" role="region" aria-label="${esc(plain(x.cap || ''))}"><table>${x.table.head.length ? `<thead><tr>${x.table.head.map((s) => `<th scope="col">${s}</th>`).join('')}</tr></thead>` : ''}<tbody>${x.table.rows.map((r) => `<tr>${r.map((s) => `<td>${s}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${caption(x.cap)}</figure>`);
  if (x.timeline) return oneLine(`<luz-timeline aria-label="${esc(plain(x.label || ''))}"${x.layout === 'vertical' ? ' layout="vertical"' : ''}><ol class="luz-timeline">${x.timeline.map((s) => `<li class="luz-timeline__item"><time>${s.when}</time><p class="luz-timeline__title">${s.title}</p>${s.text ? `<p class="luz-timeline__text">${s.text}</p>` : ''}${s.by ? `<p class="luz-timeline__by">${s.by}</p>` : ''}</li>`).join('')}</ol></luz-timeline>`);
  if (x.hr) return '---';
  throw new Error(`unknown block in ${pid}/${L}: ${Object.keys(x)}`);
}

// Covers that reach the maqueta without alt text (the plan's Phase 3 asked to review them). Written
// here, looking at the images, so the maqueta's blog.json stays as it is.
const ALT = {
  'introduccion-a-la-ia': {
    es: 'Grabado antiguo y coloreado del Turco mecánico: un autómata con turbante y abrigo de pieles, sentado ante un tablero de ajedrez, con las puertas del mueble abiertas que enseñan engranajes y palancas',
    en: 'Old coloured engraving of the Mechanical Turk: an automaton in a turban and fur coat, seated at a chessboard, with the doors of its cabinet open to show gears and levers',
    ar: 'نقش قديم ملوّن لـ«التركي الآلي»: دمية آلية بعمامة ومعطف من الفرو تجلس أمام رقعة شطرنج، وأبواب الصندوق مفتوحة تُظهر التروس والرافعات'
  },
  'carnaval-analisis-del-popurri-de-los-sumisos': {
    es: 'Fotografía en sepia de los componentes de la comparsa Los Sumisos, disfrazados de payasos con la cara pintada, cantando en un escenario',
    en: 'Sepia photograph of the members of the comparsa Los Sumisos, dressed as clowns with painted faces, singing on a stage',
    ar: 'صورة بلون سيبيا لأعضاء فرقة «لوس سوميسوس» (comparsa)، متنكرين في هيئة مهرّجين بوجوه مطلية، يغنّون على خشبة المسرح'
  }
};
ALT['introduccion-a-la-ia-2'] = ALT['introduccion-a-la-ia']; // the same engraving

for (const p of blog.posts) {
  const dir = `src/content/posts/${p.id}`;
  cp(`maqueta/img/blog/${p.id}.jpg`, `${dir}/cover.jpg`);
  if (fs.existsSync(path.join(ROOT, `maqueta/img/blog/${p.id}.tone.webp`))) cp(`maqueta/img/blog/${p.id}.tone.webp`, `${dir}/cover.tone.webp`);
  for (const L of LANGS) {
    const t = p[L];
    const fm = {
      title: t.title, excerpt: t.excerpt, date: p.date, category: p.category, tags: p.tags, lang: L,
      translated: L !== 'es', original: p.url,
      cover: { src: './cover.jpg', tone: './cover.tone.webp', w: p.cover.w, h: p.cover.h, alt: ALT[p.id]?.[L] ?? (L === 'es' ? p.cover.alt : p.cover[`alt_${L}`] ?? p.cover.alt), ...(p.cover.credit ? { credit: p.cover.credit } : {}) }
    };
    const front = ['---', ...Object.entries(fm).map(([k, v]) => `${k}: ${yaml(v)}`), '---'].join('\n');
    const body = t.body.map((x) => renderBlock(x, L, p.id)).join('\n\n');
    wr(`${dir}/${L === 'es' ? 'index' : L}.md`, `${front}\n\n${body}\n`);
  }
}
console.log(`site, ${out.length} projects (${n} visible), ${blog.posts.length} posts × 3 languages`);
