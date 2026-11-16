// Trama · blog pieces shared by the home (section 03) and the blog pages:
// strings, URLs that keep ?lang=en, dates and the post row.
import { lang } from '../shared/content.js';

export const BASE = '/maqueta';

export const B = {
  es: {
    blog: 'Blog', deck: 'Código, inteligencia artificial, gestión de equipos y Carnaval de Cádiz.',
    count: (n, a, b) => `${n} artículos · ${a === b ? a : `${a}–${b}`}`, countOne: (n) => (n === 1 ? '1 artículo' : `${n} artículos`),
    all: 'Todos los artículos', categories: 'Categorías', allCategories: 'Todas las categorías', tags: 'Etiquetas', allTags: 'Todas las etiquetas',
    min: (m) => `${m} min de lectura`, minShort: (m) => `${m} min`, latest: 'Lo último',
    newer: 'Más recientes', older: 'Anteriores', page: (a, b) => `Página ${a} de ${b}`, pages: 'Páginas',
    toc: 'En este artículo', timeline: 'Línea de tiempo', shareThis: 'Compartir artículo', copy: 'Copiar enlace', copied: 'Enlace copiado', copyFail: 'Selecciona el enlace y cópialo', shareLink: 'Enlace del artículo', shareOn: 'Compartir en', email: 'Correo', close: 'Cerrar', newTab: '(se abre en otra pestaña)',
    prev: 'Anterior', next: 'Siguiente', related: 'Sigue leyendo', back: 'Volver al blog',
    by: 'Escrito por', authorMore: 'Más sobre mí', write: 'Escríbeme',
    published: 'Publicado', reading: 'Lectura', number: 'Nº', in: 'en', tagged: 'Etiquetados con',
    nf: 'No encontrado', nfText: 'Esta página no existe o ha cambiado de sitio.',
    legendTitle: 'Cómo leer las tramas', legend: 'Cada categoría tiene su trama; cuanto más largo el artículo, más densa.',
    nfKicker: 'Error 404 · Página no encontrada', nfTitle: 'Esta página se ha deshecho en puntos.',
    nfLead: 'No hay nada en', nfLead2: '. Puede que el enlace esté mal escrito o que la página se haya mudado.',
    nfHint: 'Toca para escanear', nfHintFine: 'Haz clic para escanear',
    nfSearch: 'Buscar en el blog y los proyectos', nfPlaceholder: 'Margaret Hamilton, carnaval, IA…',
    nfMaybe: '¿Buscabas esto?', nfResults: (n) => (n === 1 ? '1 resultado' : `${n} resultados`), nfNone: 'Nada por aquí. Prueba con otra palabra.',
    nfWays: 'O empieza por aquí', nfHome: 'Inicio', nfLatest: 'Lo último del blog', project: 'Proyecto', post: 'Artículo',
    onlyEs: '', watch: 'Ver el vídeo', code: 'Ver el código', play: 'Reproducir vídeo',
    projects: 'Proyectos', allProjects: 'Todos los proyectos', projPage: 'Ficha completa',
    projDeck: 'Todo lo que he publicado en GitHub: sistemas de diseño, herramientas, experimentos con IA y el Carnaval de Cádiz.',
    projCount: (n, a, b) => `${n} proyectos · ${a}–${b}`, projCountOne: (n) => (n === 1 ? '1 proyecto' : `${n} proyectos`),
    allTech: 'Todas', techLabel: 'Tecnología', year: 'Año', demo: 'Ver demo', repo: 'Ver código', moreProjects: 'Más proyectos',
    newTab: '(se abre en otra pestaña)', projLegendTitle: 'Cómo leer los bloques',
    projLegend: 'Cuanto más reciente el proyecto, más densa su trama; su número va calado en ella.'
  },
  en: {
    blog: 'Blog', deck: 'Code, artificial intelligence, team management and the Cádiz Carnival.',
    count: (n, a, b) => `${n} posts · ${a === b ? a : `${a}–${b}`}`, countOne: (n) => (n === 1 ? '1 post' : `${n} posts`),
    all: 'All posts', categories: 'Categories', allCategories: 'All categories', tags: 'Tags', allTags: 'All tags',
    min: (m) => `${m} min read`, minShort: (m) => `${m} min`, latest: 'Latest',
    newer: 'Newer', older: 'Older', page: (a, b) => `Page ${a} of ${b}`, pages: 'Pages',
    toc: 'In this post', timeline: 'Timeline', shareThis: 'Share this post', copy: 'Copy link', copied: 'Link copied', copyFail: 'Select the link and copy it', shareLink: 'Link to this post', shareOn: 'Share on', email: 'Email', close: 'Close', newTab: '(opens in a new tab)',
    prev: 'Previous', next: 'Next', related: 'Keep reading', back: 'Back to the blog',
    by: 'Written by', authorMore: 'More about me', write: 'Write to me',
    published: 'Published', reading: 'Reading', number: 'No.', in: 'in', tagged: 'Tagged',
    nf: 'Not found', nfText: 'This page doesn’t exist or has moved.',
    legendTitle: 'How to read the screens', legend: 'Each category has its own screen; the longer the post, the denser.',
    nfKicker: 'Error 404 · Page not found', nfTitle: 'This page has come apart into dots.',
    nfLead: 'There’s nothing at', nfLead2: '. The link may be mistyped, or the page may have moved.',
    nfHint: 'Tap to scan', nfHintFine: 'Click to scan',
    nfSearch: 'Search the blog and the projects', nfPlaceholder: 'Margaret Hamilton, carnival, AI…',
    nfMaybe: 'Were you looking for this?', nfResults: (n) => (n === 1 ? '1 result' : `${n} results`), nfNone: 'Nothing here. Try another word.',
    nfWays: 'Or start here', nfHome: 'Home', nfLatest: 'Latest on the blog', project: 'Project', post: 'Post',
    onlyEs: 'This post is only available in Spanish.', watch: 'Watch the video', code: 'See the code', play: 'Play video',
    projects: 'Projects', allProjects: 'All projects', projPage: 'Full page',
    projDeck: 'Everything I’ve published on GitHub: design systems, tools, AI experiments and the Cádiz Carnival.',
    projCount: (n, a, b) => `${n} projects · ${a}–${b}`, projCountOne: (n) => (n === 1 ? '1 project' : `${n} projects`),
    allTech: 'All', techLabel: 'Technology', year: 'Year', demo: 'See demo', repo: 'See code', moreProjects: 'More projects',
    newTab: '(opens in a new tab)', projLegendTitle: 'How to read the blocks',
    projLegend: 'The newer the project, the denser its screen; its number is cut into it.'
  }
}[lang];

// a path under Trama with its query, keeping the language
export function url(path, q = {}) {
  const u = new URL(BASE + path, location.origin);
  for (const [k, v] of Object.entries(q)) if (v != null && v !== '') u.searchParams.set(k, v);
  if (lang === 'en') u.searchParams.set('lang', 'en');
  return u.pathname + u.search;
}
export const blogUrl = (page) => url('/blog/', page > 1 ? { p: page } : {});
export const postUrl = (p) => url('/blog/articulo/', { a: p.id });
export const catUrl = (id) => url('/blog/categoria/', { c: id });
export const tagUrl = (id) => url('/blog/etiqueta/', { t: id });
export const homeUrl = (hash = '') => url('/') + hash;
export const projectsUrl = (tech) => url('/proyectos/', tech ? { tech } : {});
export const projectUrl = (p) => url('/proyectos/proyecto/', { p: p.id });

// the footer of every page: © name · year, the site's ways and the motto
const FOOT = {
  es: { label: 'Pie', bio: 'Bio', work: 'Proyectos', blog: 'Blog', contact: 'Contacto', credits: 'Créditos', other: 'English', otherLang: 'en' },
  en: { label: 'Footer', bio: 'Bio', work: 'Projects', blog: 'Blog', contact: 'Contact', credits: 'Credits', other: 'Español', otherLang: 'es' }
}[lang];
// this same page in the other language (what the header's link points to)
function otherLangHref() {
  const u = new URL(location.href);
  if (lang === 'en') u.searchParams.delete('lang'); else u.searchParams.set('lang', 'en');
  return u.pathname + u.search;
}
export const footer = (c) => el('footer', { class: 'foot' },
  el('p', { class: 'foot__by', text: `© ${c.name} · ${new Date().getFullYear()}` }),
  el('nav', { class: 'foot__nav', 'aria-label': FOOT.label }, el('ul', {},
    ...[[FOOT.bio, homeUrl('#bio')], [FOOT.work, projectsUrl()], [FOOT.blog, blogUrl()], [FOOT.contact, homeUrl('#contacto')], [FOOT.credits, url('/creditos/')]]
      .map(([text, href]) => el('li', {}, el('a', { href, text }))),
    el('li', { class: 'foot__lang' }, el('a', { href: otherLangHref(), hreflang: FOOT.otherLang, lang: FOOT.otherLang, text: FOOT.other })))),
  el('p', { class: 'foot__motto', text: c.motto }));

// the screen of a project, as on the home: denser the newer, its number cut in
const DENSITY = { 2023: 0.36, 2024: 0.52, 2025: 0.68, 2026: 0.86 };
export function projectDots(p) { const h = hashStr(p.id); return { density: DENSITY[p.year] ?? 0.6, kind: h % 6, seed: h, label: pad(p.n) }; }

// one row of the project list: screen · number and year · name · kicker · tech
export function projectRow(p) {
  const cv = el('canvas', { class: 'brow__dots', 'aria-hidden': 'true' });
  const li = el('li', { class: 'brow prow' },
    el('div', { class: 'brow__thumb' }, cv),
    el('p', { class: 'brow__meta' },
      el('span', { class: 'prow__n', text: pad(p.n) }),
      el('span', { text: p.year }),
      el('span', { text: p.tech.join(' · ') })),
    el('h3', { class: 'brow__title prow__name' }, el('a', { href: projectUrl(p), text: p.name })),
    el('p', { class: 'brow__excerpt', text: p.kicker }));
  return { li, cv, dots: projectDots(p) };
}

const fmt = new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' });
const fmtShort = new Intl.DateTimeFormat(lang, { day: '2-digit', month: 'short' });
export const date = (d) => fmt.format(new Date(d + 'T12:00:00'));
export const dateShort = (d) => fmtShort.format(new Date(d + 'T12:00:00')).replace('.', '');
export const pad = (n) => String(n).padStart(2, '0');

export const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else if (k === 'style') n.style.cssText = v; else n.setAttribute(k, v);
  }
  n.append(...kids.filter((k) => k != null && k !== false));
  return n;
};

// the screen of a post: its category's pattern, denser the longer it is
export function postDots(p, posts, kind) {
  const ws = posts.map((q) => q.words), lo = Math.min(...ws), hi = Math.max(...ws);
  // no number cut into it: a post's number means nothing (a project's is its place in the list)
  return { density: 0.38 + 0.52 * ((p.words - lo) / (hi - lo || 1)), kind, seed: hashStr(p.id), label: '' };
}
function hashStr(s) { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

// a post's featured image (maqueta/img/blog/, made by tools/soynando-covers.cjs):
// the real picture for the article (SEO: alt, size; later og:image and the
// JSON-LD image) and a grey tone map the dots draw it from
const IMG = '/maqueta/img/';
export const coverTone = (p) => (p.cover ? `${IMG}blog/${p.id}.tone.webp` : null);
export const projectTone = (p) => `${IMG}proyectos/${p.id}.tone.webp`;
export function coverPicture(p, img = {}) {
  const f = `${IMG}blog/${p.id}`;
  return el('picture', {},
    el('source', { srcset: f + '.avif', type: 'image/avif' }),
    el('source', { srcset: f + '.webp', type: 'image/webp' }),
    el('img', { src: f + '.jpg', alt: p.cover.alt, width: p.cover.w, height: p.cover.h, decoding: 'async', ...img }));
}

// A featured image cycles on its own while it is on screen (the article's
// cover, the blog's featured post, every post row):
// dots → black and white → colour → black and white → dots, and again.
// One clock drives everything (no chained CSS transitions), so each step
// flows into the next and the loop has no seam. The dots don't fade: they
// come apart and gather with the engine itself (draw(p), 1 → 0 → 1).
// `fig` holds the <picture> and the canvas (.cover-loop); `block()` returns
// its current DotBlock (it is rebuilt on resize); `offset` (s) staggers a
// list so its rows don't breathe together. Paused off screen; with reduced
// motion it rests in black and white (.is-shown) and hover gives the colour.
// `colour: false` (the thumbnails of post rows) skips the colour: dots ↔
// black and white only, on a shorter table, and no colour on hover either.
// The caller marks its block as looping, so nothing else draws it.
const LOOP_COLOUR = [     // [seconds, dots, light, colour] at the end of each step
  [1.6, 1, 0, 0],         // hold: dots
  [1.8, 0, 1, 0],         // dots come apart, the photo rises in black and white
  [0.9, 0, 1, 0],         // hold: black and white
  [1.6, 0, 1, 1],         // colour comes in
  [2.0, 0, 1, 1],         // hold: colour
  [1.6, 0, 1, 0],         // colour goes
  [0.9, 0, 1, 0],         // hold: black and white
  [1.8, 1, 0, 0]          // the photo sinks, the dots gather
];
const LOOP_BW = [         // the same, without the colour
  [1.6, 1, 0, 0],         // hold: dots
  [1.8, 0, 1, 0],         // dots come apart, the photo rises in black and white
  [2.4, 0, 1, 0],         // hold: black and white
  [1.8, 1, 0, 0]          // the photo sinks, the dots gather
];
// how far a picture sinks under its dots depends on the mode (--sink-b, --sink-c)
let sink = { b: 0.32, c: 1.1 };
const readSink = () => {
  const cs = getComputedStyle(document.documentElement);
  sink = { b: parseFloat(cs.getPropertyValue('--sink-b')) || 0.32, c: parseFloat(cs.getPropertyValue('--sink-c')) || 1.1 };
};
readSink();
document.addEventListener('luz-theme-mode:change', readSink);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export function coverLoop(fig, block, { offset = 0, colour: withColour = true } = {}) {
  const pic = fig.querySelector('picture'), img = fig.querySelector('img');
  const LOOP = withColour ? LOOP_COLOUR : LOOP_BW, LOOP_T = LOOP.reduce((s, x) => s + x[0], 0);
  if (!withColour) fig.classList.add('cover-loop--bw');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return fig.classList.add('is-shown');
  let on = false, t0 = performance.now() - offset * 1000, paused = t0 + offset * 1000;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting === on) return;
    on = e.isIntersecting;
    if (on) { t0 += performance.now() - paused; requestAnimationFrame(frame); } else paused = performance.now();
  }).observe(fig);
  function frame(now) {
    if (!on) return;
    let t = ((now - t0) / 1000) % LOOP_T, prev = LOOP[LOOP.length - 1], v = prev.slice(1);
    for (const step of LOOP) {
      if (t <= step[0]) { const k = ease(t / step[0]); v = [1, 2, 3].map((j) => prev[j] + (step[j] - prev[j]) * k); break; }
      t -= step[0]; prev = step;
    }
    const [dots, light, colour] = v, b = block();
    if (b) b.draw(dots, true);
    pic.style.filter = `brightness(${sink.b + (1 - sink.b) * light}) contrast(${sink.c + (1 - sink.c) * light})`;
    img.style.filter = `grayscale(${1 - colour})`;
    requestAnimationFrame(frame);
  }
}

// one row of a post list: screen thumbnail · date · title · excerpt · category
export function row(p, b) {
  const cat = b.categories[p.category];
  const cv = el('canvas', { class: 'brow__dots', 'aria-hidden': 'true' });
  const li = el('li', { class: 'brow' },
    // with a featured image the thumbnail is its picture under its dots (alt
    // empty: the title next to it already says what the row is)
    p.cover ? el('div', { class: 'brow__thumb cover-loop' }, coverPicture(p, { alt: '', loading: 'lazy' }), cv) : el('div', { class: 'brow__thumb' }, cv),
    el('p', { class: 'brow__meta' },
      el('time', { datetime: p.date, text: dateShort(p.date) }),
      el('a', { class: 'brow__cat', href: catUrl(cat.id), text: cat.name }),
      el('span', { text: B.minShort(p.minutes) })),
    el('h3', { class: 'brow__title', lang: p.postLang !== lang ? p.postLang : null }, el('a', { href: postUrl(p), text: p.title })),
    el('p', { class: 'brow__excerpt', lang: p.postLang !== lang ? p.postLang : null, text: p.excerpt }));
  return { li, cv, fig: p.cover ? cv.parentElement : null, dots: postDots(p, b.posts, cat.kind), tone: coverTone(p) };
}
