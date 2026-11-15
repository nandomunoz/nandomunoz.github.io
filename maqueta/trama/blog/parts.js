// Trama · blog pieces shared by the home (section 03) and the blog pages:
// strings, URLs that keep ?lang=en, dates and the post row.
import { lang } from '../../shared/content.js';

export const BASE = '/maqueta/trama';

export const B = {
  es: {
    blog: 'Blog', deck: 'Código, inteligencia artificial, gestión de equipos y Carnaval de Cádiz.',
    count: (n, a, b) => `${n} artículos · ${a === b ? a : `${a}–${b}`}`, countOne: (n) => (n === 1 ? '1 artículo' : `${n} artículos`),
    all: 'Todos los artículos', categories: 'Categorías', allCategories: 'Todas las categorías', tags: 'Etiquetas', allTags: 'Todas las etiquetas',
    min: (m) => `${m} min de lectura`, minShort: (m) => `${m} min`, latest: 'Lo último',
    newer: 'Más recientes', older: 'Anteriores', page: (a, b) => `Página ${a} de ${b}`, pages: 'Páginas',
    toc: 'En este artículo', share: 'Compartir', copy: 'Copiar enlace', copied: 'Enlace copiado',
    prev: 'Anterior', next: 'Siguiente', related: 'Sigue leyendo', back: 'Volver al blog',
    by: 'Escrito por', authorMore: 'Más sobre mí', write: 'Escríbeme',
    published: 'Publicado', reading: 'Lectura', number: 'Nº', in: 'en', tagged: 'Etiquetados con',
    nf: 'No encontrado', nfText: 'Esta página no existe o ha cambiado de sitio.',
    legendTitle: 'Cómo leer las tramas', legend: 'Cada categoría tiene su trama; cuanto más largo el artículo, más densa.',
    sample: 'Artículos de soynando.com.',
    nfKicker: 'Error 404 · Página no encontrada', nfTitle: 'Esta página se ha deshecho en puntos.',
    nfLead: 'No hay nada en', nfLead2: '. Puede que el enlace esté mal escrito o que la página se haya mudado.',
    nfHint: 'Toca la trama para recomponerla', nfHintFine: 'Haz clic en la trama para recomponerla',
    nfSearch: 'Buscar en el blog y los proyectos', nfPlaceholder: 'Margaret Hamilton, carnaval, IA…',
    nfMaybe: '¿Buscabas esto?', nfResults: (n) => (n === 1 ? '1 resultado' : `${n} resultados`), nfNone: 'Nada por aquí. Prueba con otra palabra.',
    nfWays: 'O empieza por aquí', nfHome: 'Inicio', nfLatest: 'Lo último del blog', project: 'Proyecto', post: 'Artículo',
    original: 'Original', onlyEs: '', watch: 'Ver el vídeo', code: 'Ver el código', play: 'Reproducir vídeo'
  },
  en: {
    blog: 'Blog', deck: 'Code, artificial intelligence, team management and the Cádiz Carnival.',
    count: (n, a, b) => `${n} posts · ${a === b ? a : `${a}–${b}`}`, countOne: (n) => (n === 1 ? '1 post' : `${n} posts`),
    all: 'All posts', categories: 'Categories', allCategories: 'All categories', tags: 'Tags', allTags: 'All tags',
    min: (m) => `${m} min read`, minShort: (m) => `${m} min`, latest: 'Latest',
    newer: 'Newer', older: 'Older', page: (a, b) => `Page ${a} of ${b}`, pages: 'Pages',
    toc: 'In this post', share: 'Share', copy: 'Copy link', copied: 'Link copied',
    prev: 'Previous', next: 'Next', related: 'Keep reading', back: 'Back to the blog',
    by: 'Written by', authorMore: 'More about me', write: 'Write to me',
    published: 'Published', reading: 'Reading', number: 'No.', in: 'in', tagged: 'Tagged',
    nf: 'Not found', nfText: 'This page doesn’t exist or has moved.',
    legendTitle: 'How to read the screens', legend: 'Each category has its own screen; the longer the post, the denser.',
    sample: 'Posts from soynando.com.',
    nfKicker: 'Error 404 · Page not found', nfTitle: 'This page has come apart into dots.',
    nfLead: 'There’s nothing at', nfLead2: '. The link may be mistyped, or the page may have moved.',
    nfHint: 'Tap the dots to put it back together', nfHintFine: 'Click the dots to put it back together',
    nfSearch: 'Search the blog and the projects', nfPlaceholder: 'Margaret Hamilton, carnival, AI…',
    nfMaybe: 'Were you looking for this?', nfResults: (n) => (n === 1 ? '1 result' : `${n} results`), nfNone: 'Nothing here. Try another word.',
    nfWays: 'Or start here', nfHome: 'Home', nfLatest: 'Latest on the blog', project: 'Project', post: 'Post',
    original: 'Original', onlyEs: 'This post is only available in Spanish.', watch: 'Watch the video', code: 'See the code', play: 'Play video'
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
  return { density: 0.38 + 0.52 * ((p.words - lo) / (hi - lo || 1)), kind, seed: hashStr(p.id), label: pad(p.n) };
}
function hashStr(s) { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

// one row of a post list: screen thumbnail · date · title · excerpt · category
export function row(p, b) {
  const cat = b.categories[p.category];
  const cv = el('canvas', { class: 'brow__dots', 'aria-hidden': 'true' });
  const li = el('li', { class: 'brow' },
    el('div', { class: 'brow__thumb' }, cv),
    el('p', { class: 'brow__meta' },
      el('time', { datetime: p.date, text: dateShort(p.date) }),
      el('a', { class: 'brow__cat', href: catUrl(cat.id), text: cat.name }),
      el('span', { text: B.minShort(p.minutes) })),
    el('h3', { class: 'brow__title', lang: p.postLang !== lang ? p.postLang : null }, el('a', { href: postUrl(p), text: p.title })),
    el('p', { class: 'brow__excerpt', lang: p.postLang !== lang ? p.postLang : null, text: p.excerpt }));
  return { li, cv, dots: postDots(p, b.posts, cat.kind) };
}
