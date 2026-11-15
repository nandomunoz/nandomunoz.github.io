// soynando.com (WordPress REST dump) → maqueta/shared/blog.json blocks.
// Sandbox tool, run by hand:
//   curl -s "https://soynando.com/wp-json/wp/v2/posts?per_page=100&_fields=id,date,slug,link,title,excerpt,content,categories,tags" -o <dir>/posts.json
//   (and /categories, /tags the same way into cats.json, tags.json)
//   PUPPETEER=<path to puppeteer-core> node maqueta/tools/soynando-to-blog.cjs maqueta/shared/blog.json <dir>
// It parses each post with the browser's DOMParser (headless Chromium) and
// keeps only links, em, strong, code, br and cite inside the text.
const fs = require('fs');
const puppeteer = require(process.env.PUPPETEER || '/home/ares/.npm/_npx/089d1fe0e470556a/node_modules/puppeteer-core');
const D = process.argv[3] || __dirname;
const posts = JSON.parse(fs.readFileSync(D + '/posts.json'));
const cats = JSON.parse(fs.readFileSync(D + '/cats.json'));
const tags = JSON.parse(fs.readFileSync(D + '/tags.json'));
const OUT = process.argv[2];

(async () => {
  const exe = require('child_process').execSync('ls -d ~/.cache/ms-playwright/chromium_headless_shell-1243/*/chrome-headless-shell', { shell: '/bin/bash' }).toString().trim();
  const b = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox'] });
  const p = await b.newPage();
  p.on('console', (m) => console.log('page:', m.text()));
  const conv = await p.evaluate((posts) => {
    const KEEP = { A: 'a', EM: 'em', I: 'em', STRONG: 'strong', B: 'strong', CODE: 'code', BR: 'br', CITE: 'cite', SUB: 'sub', SUP: 'sup' };
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // inline HTML, whitelisted
    function inl(node) {
      let out = '';
      for (const n of node.childNodes) {
        if (n.nodeType === 3) { out += esc(n.textContent.replace(/ /g, ' ')); continue; }
        if (n.nodeType !== 1) continue;
        const t = KEEP[n.tagName];
        if (n.tagName === 'SVG' || n.tagName === 'svg' || n.tagName === 'SCRIPT') continue;
        if (!t) { out += inl(n); continue; }
        if (t === 'br') { out += '<br>'; continue; }
        if (t === 'a') {
          let href = n.getAttribute('href') || '';
          if (!/^(https?:|mailto:|#)/.test(href)) { out += inl(n); continue; }
          out += `<a href="${esc(href).replace(/"/g, '&quot;')}">${inl(n)}</a>`; continue;
        }
        out += `<${t}>${inl(n)}</${t}>`;
      }
      return out;
    }
    const clean = (h) => h.replace(/\s*<br>\s*$/g, '').replace(/\s+/g, ' ').trim();
    const text = (n) => n.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
    const unknown = {};

    function block(n, out) {
      if (n.nodeType === 3) { const t = n.textContent.trim(); if (t) out.push({ p: esc(t) }); return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName, cls = n.className || '';
      if (tag === 'P') { const h = clean(inl(n)); if (h) out.push({ p: h }); return; }
      if (/^H[1-6]$/.test(tag)) { const t = text(n); if (t) out.push({ h: t, lv: tag === 'H2' || tag === 'H1' ? 2 : 3 }); return; }
      if (tag === 'UL' || tag === 'OL') {
        if (cls.includes('timeline')) return timelineV(n, out);
        out.push({ ul: [...n.children].map((li) => clean(inl(li))).filter(Boolean), ...(tag === 'OL' ? { ol: true } : {}) }); return;
      }
      if (tag === 'PRE') { out.push({ code: n.textContent.replace(/\n$/, '') }); return; }
      if (tag === 'BLOCKQUOTE') {
        if (cls.includes('twitter-tweet')) return tweet(n, out);
        const cite = n.querySelector('cite'); const c = cite ? clean(inl(cite)) : null; if (cite) cite.remove();
        const ps = [...n.querySelectorAll('p')].map((x) => clean(inl(x))).filter(Boolean);
        out.push({ quote: ps.length ? ps : [clean(inl(n))], ...(c ? { cite: c } : {}) }); return;
      }
      if (tag === 'FIGURE') {
        const cap = n.querySelector('figcaption'); const capH = cap ? clean(inl(cap)) : null;
        if (cls.includes('wp-block-pullquote')) {
          const cite = n.querySelector('cite'); const c = cite ? clean(inl(cite)) : null; if (cite) cite.remove();
          out.push({ pull: [...n.querySelectorAll('p')].map((x) => clean(inl(x))).filter(Boolean), ...(c ? { cite: c } : {}) }); return;
        }
        if (cls.includes('wp-block-image') || n.querySelector(':scope > img, :scope > a > img')) {
          const img = n.querySelector('img');
          out.push({ img: img.getAttribute('src'), alt: img.getAttribute('alt') || '', w: +img.getAttribute('width') || null, hgt: +img.getAttribute('height') || null, ...(capH ? { cap: capH } : {}) }); return;
        }
        if (cls.includes('youtube')) {
          const y = n.querySelector('lite-youtube'), f = n.querySelector('iframe');
          let id = y ? y.getAttribute('videoid') : (f && (f.src.match(/embed\/([\w-]+)/) || [])[1]);
          const params = y ? y.getAttribute('params') : '';
          out.push({ yt: id, title: y ? y.getAttribute('title') : (f && f.title) || '', ...(params ? { params } : {}), ...(capH ? { cap: capH } : {}) }); return;
        }
        if (cls.includes('twitter')) { const bq = n.querySelector('blockquote'); if (bq) return tweet(bq, out, capH); }
        if (cls.includes('wp-block-table')) {
          const t = n.querySelector('table');
          out.push({ table: { head: [...t.querySelectorAll('thead th')].map((x) => clean(inl(x))), rows: [...t.querySelectorAll('tbody tr')].map((tr) => [...tr.children].map((x) => clean(inl(x)))) }, ...(capH ? { cap: capH } : {}) }); return;
        }
        const ifr = n.querySelector('iframe');
        if (ifr) return frame(ifr, out, capH);
        unknown['figure.' + cls] = (unknown['figure.' + cls] || 0) + 1;
        [...n.childNodes].forEach((c) => block(c, out)); return;
      }
      if (tag === 'IFRAME') return frame(n, out);
      if (tag === 'SCRIPT') { const s = n.getAttribute('src') || ''; if (s.includes('gist.github.com')) out.push({ gist: s.replace(/\.js$/, '') }); return; }
      if (tag === 'TABLE') { block(Object.assign(document.createElement('figure'), { className: 'wp-block-table', innerHTML: n.outerHTML }), out); return; }
      if (tag === 'DIV' || tag === 'SECTION') {
        if (cls.includes('is-style-timeline') || cls.includes('timeline')) {
          const slides = [...n.querySelectorAll('.timeline__slide')];
          if (slides.length) {
            out.push({ timeline: slides.map((s) => ({ when: text(s.querySelector('.timeline__when') || s.querySelector('.timeline__date') || s), title: clean(inl(s.querySelector('.timeline__title') || s)), text: clean(inl(s.querySelector('.timeline__text') || document.createElement('p'))) })) });
            return;
          }
          const v = n.querySelector('.timeline-vertical, ol.timeline-vertical, ul.timeline-vertical');
          if (v || n.querySelector('.timeline-vertical__step')) return timelineV(n, out);
        }
        if (n.querySelector('.timeline-vertical__step')) return timelineV(n, out);
        [...n.childNodes].forEach((c) => block(c, out)); return;
      }
      if (tag === 'NAV' || tag === 'BUTTON' || tag === 'svg' || tag === 'SVG') return;
      if (tag === 'HR') { out.push({ hr: true }); return; }
      unknown[tag + '.' + cls] = (unknown[tag + '.' + cls] || 0) + 1;
      const h = clean(inl(n)); if (h) out.push({ p: h });
    }
    function timelineV(n, out) {
      const steps = [...n.querySelectorAll('.timeline-vertical__step')];
      out.push({ timeline: steps.map((s) => ({
        when: text(s.querySelector('.timeline-vertical__when')),
        title: clean(inl(s.querySelector('.timeline-vertical__title'))),
        text: clean(inl(s.querySelector('.timeline-vertical__text') || document.createElement('p'))),
        by: [...s.querySelectorAll('.timeline-vertical__ring [aria-label]')].map((x) => x.getAttribute('aria-label')).join(', ') || undefined
      })) });
    }
    function tweet(bq, out, cap) {
      const links = [...bq.querySelectorAll('a')]; const last = links[links.length - 1];
      const p = bq.querySelector('p');
      const by = text(bq).split('—').pop().replace(text(last || bq), '').trim();
      out.push({ tweet: p ? clean(inl(p)) : '', by, url: last ? last.href.replace(/\?.*$/, '') : '', date: last ? text(last) : '' });
    }
    function frame(f, out, cap) {
      const src = f.getAttribute('src') || '';
      if (src.includes('youtube')) { out.push({ yt: (src.match(/embed\/([\w-]+)/) || [])[1], title: f.title || '', ...(cap ? { cap } : {}) }); return; }
      let link = src;
      const m = src.match(/[?&]href=([^&]+)/); if (m) link = decodeURIComponent(m[1]);
      out.push({ embed: link, host: new URL(link).hostname.replace(/^www\./, ''), ...(cap ? { cap } : {}) });
    }

    const res = posts.map((post) => {
      const doc = new DOMParser().parseFromString(`<body>${post.content.rendered}</body>`, 'text/html');
      const out = [];
      [...doc.body.childNodes].forEach((n) => block(n, out));
      const ex = new DOMParser().parseFromString(post.excerpt.rendered, 'text/html').body.textContent.replace(/ /g, ' ').replace(/\s*\[(…|&hellip;|\.\.\.)\]\s*$/, '…').replace(/\s+/g, ' ').trim();
      const title = new DOMParser().parseFromString(post.title.rendered, 'text/html').body.textContent.trim();
      return { slug: post.slug, title, excerpt: ex, body: out };
    });
    return { res, unknown };
  }, posts);
  console.log('unknown', conv.unknown);
  await b.close();

  const catMap = Object.fromEntries(cats.map((c) => [c.id, c]));
  const tagMap = Object.fromEntries(tags.map((t) => [t.id, t]));
  const CAT = {
    'hablo-de-codigo-y-gestion': { id: 'codigo-y-gestion', kind: 3, es: { name: 'Código y gestión', desc: 'Frontend, inteligencia artificial, historia de la informática y cómo se lidera un equipo.' }, en: { name: 'Code and management', desc: 'Frontend, artificial intelligence, computing history and how a team is led.' } },
    'hablo-de-literatura-y-pensamiento': { id: 'literatura-y-pensamiento', kind: 2, es: { name: 'Literatura y pensamiento', desc: 'Análisis literarios y filosóficos de los popurrís del Carnaval de Cádiz.' }, en: { name: 'Literature and thought', desc: 'Literary and philosophical readings of the Cádiz Carnival popurrís.' } }
  };
  const TAG_EN = { 'carnaval-de-cadiz': 'Cádiz Carnival', css: 'CSS', 'gestion-de-equipos': 'Team management', iahoraque: 'iahoraque', 'inteligencia-artificial': 'Artificial intelligence', javascript: 'JavaScript', 'poesia-contemporanea': 'Contemporary poetry', privacidad: 'Privacy', 'web-components': 'Web Components', 'historia-de-la-informatica': 'Computing history' };
  const used = new Set();
  const out = {
    _note: 'Artículos de soynando.com (WordPress REST API, ' + new Date().toISOString().slice(0, 10) + '), solo en español; categorías y etiquetas tal como están allí. Generado por scratchpad/wp/conv.cjs.',
    source: 'https://soynando.com',
    categories: {},
    tags: {},
    posts: posts.map((post, i) => {
      const c = CAT[catMap[post.categories[0]].slug];
      post.tags.forEach((t) => used.add(t));
      const v = conv.res[i];
      return { id: post.slug, date: post.date.slice(0, 10), category: c.id, tags: post.tags.map((t) => tagMap[t].slug), url: post.link, es: { title: v.title, excerpt: v.excerpt, body: v.body } };
    })
  };
  out.categories = Object.fromEntries(Object.values(CAT).map((c) => [c.id, { kind: c.kind, es: c.es, en: c.en }]));
  out.tags = Object.fromEntries([...used].map((t) => [tagMap[t].slug, { es: tagMap[t].name, en: TAG_EN[tagMap[t].slug] || tagMap[t].name }]));
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  const kinds = {};
  out.posts.forEach((p) => p.es.body.forEach((x) => { const k = Object.keys(x)[0]; kinds[k] = (kinds[k] || 0) + 1; }));
  console.log(kinds, fs.statSync(OUT).size);
})();
