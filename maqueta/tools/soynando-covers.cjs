// The featured image of each soynando.com post → maqueta/img/blog/<id>.{avif,webp,jpg}
// (for <picture>) plus <id>.tone.webp (192 px, grey, read by the dot engine),
// and `cover: { w, h, alt }` on each post of maqueta/shared/blog.json.
// It only adds covers: the posts' text is left as soynando-to-blog.cjs made it.
//   node maqueta/tools/soynando-covers.cjs [id…]
// Needs ImageMagick. The featured image matters for SEO later (og:image,
// JSON-LD `image`), so it is kept as a real image with its alt, not only dots.
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const API = 'https://soynando.com/wp-json/wp/v2';
const root = path.resolve(__dirname, '../..');
const JSON_PATH = path.join(root, 'maqueta/shared/blog.json');
const out = path.join(root, 'maqueta/img/blog');
const only = process.argv.slice(2);

// WordPress alts sometimes come with Markdown asterisks or stray spaces
const cleanAlt = (s) => String(s || '').replace(/\*\*/g, '').replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();

(async () => {
  const blog = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const get = async (u) => { const r = await fetch(u); if (!r.ok) throw new Error(`${r.status} ${u}`); return r.json(); };
  const wp = await get(`${API}/posts?per_page=100&_fields=slug,featured_media`);
  const ids = wp.map((x) => x.featured_media).filter(Boolean);
  const media = ids.length ? await get(`${API}/media?per_page=100&include=${ids.join(',')}&_fields=id,source_url,alt_text`) : [];
  fs.mkdirSync(out, { recursive: true });
  for (const p of blog.posts) {
    if (only.length && !only.includes(p.id)) continue;
    const w = wp.find((x) => x.slug === p.id), m = w && media.find((x) => x.id === w.featured_media);
    if (!m) { console.log('–', p.id, 'no featured image'); delete p.cover; continue; }
    const res = await fetch(m.source_url);
    if (!res.ok) { console.log('✗', p.id, res.status, m.source_url); continue; }
    const src = path.join(out, `${p.id}.src`);
    fs.writeFileSync(src, Buffer.from(await res.arrayBuffer()));
    const base = path.join(out, p.id);
    const big = ['-auto-orient', '-resize', '1600x>', '-strip'];
    execFileSync('magick', [src, ...big, '-quality', '50', base + '.avif']);
    execFileSync('magick', [src, ...big, '-quality', '72', base + '.webp']);
    execFileSync('magick', [src, ...big, '-quality', '78', base + '.jpg']);
    execFileSync('magick', [src, '-auto-orient', '-resize', '192x', '-colorspace', 'Gray', '-quality', '80', base + '.tone.webp']);
    fs.unlinkSync(src);
    const [cw, ch] = execFileSync('magick', ['identify', '-format', '%w %h', base + '.jpg']).toString().split(' ').map(Number);
    p.cover = { w: cw, h: ch, alt: cleanAlt(m.alt_text) };
    console.log('✓', p.id, `${cw}×${ch}`, p.cover.alt ? '' : '(no alt)');
  }
  fs.writeFileSync(JSON_PATH, JSON.stringify(blog, null, 1));
})();
