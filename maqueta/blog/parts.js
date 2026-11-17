// Trama · blog pieces shared by the home (section 03) and the blog pages:
// strings, URLs that keep ?lang=en, dates and the post row.
import { lang } from '../shared/content.js';
import { kanjiOf, kanjiGloss } from '../shared/kanji-cells.js';

export const BASE = '/maqueta';

export const B = {
  es: {
    blog: 'Blog', deck: 'Código, inteligencia artificial, gestión de equipos y Carnaval de Cádiz.',
    count: (n, a, b) => `${n} artículos · ${a === b ? a : `${a}–${b}`}`, countOne: (n) => (n === 1 ? '1 artículo' : `${n} artículos`),
    all: 'Todos los artículos', categories: 'Categorías', allCategories: 'Todas las categorías', tags: 'Etiquetas', allTags: 'Todas las etiquetas',
    min: (m) => `${m} min de lectura`, minShort: (m) => `${m} min`, latest: 'Lo último',
    newer: 'Más recientes', older: 'Anteriores', page: (a, b) => `Página ${a} de ${b}`, pages: 'Páginas',
    toc: 'En este artículo', timeline: 'Línea de tiempo', shareThis: 'Compartir artículo', copy: 'Copiar enlace', copied: 'Enlace copiado', codeCopy: 'Copiar', codeCopyLabel: 'Copiar el ejemplo de código', copyFail: 'Selecciona el enlace y cópialo', shareLink: 'Enlace del artículo', shareOn: 'Compartir en', email: 'Correo', close: 'Cerrar', newTab: '(se abre en otra pestaña)',
    prev: 'Anterior', next: 'Siguiente', newerPost: 'Más reciente', olderPost: 'Más antiguo', related: 'Sigue leyendo', back: 'Volver al blog',
    by: 'Escrito por', authorMore: 'Más sobre mí', write: 'Escríbeme',
    published: 'Publicado', reading: 'Lectura', in: 'en', tagged: 'Etiquetados con',
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
    projDeck: 'Una selección de lo que he publicado en GitHub: sistemas de diseño, herramientas, experimentos con IA y el Carnaval de Cádiz.',
    projCount: (n, a, b) => `${n} proyectos · ${a}–${b}`, projCountOne: (n) => (n === 1 ? '1 proyecto' : `${n} proyectos`),
    allTech: 'Todas', techLabel: 'Tecnología', year: 'Año', demo: 'Ver demo', repo: 'Ver código', shot: (n) => `Captura de ${n}`, moreProjects: 'Más proyectos',
    newTab: '(se abre en otra pestaña)', projLegendTitle: 'Cómo leer los bloques',
    projLegend: 'Cuanto más reciente el proyecto, más densa su trama; su kanji va dibujado en ella.'
  },
  en: {
    blog: 'Blog', deck: 'Code, artificial intelligence, team management and the Cádiz Carnival.',
    count: (n, a, b) => `${n} posts · ${a === b ? a : `${a}–${b}`}`, countOne: (n) => (n === 1 ? '1 post' : `${n} posts`),
    all: 'All posts', categories: 'Categories', allCategories: 'All categories', tags: 'Tags', allTags: 'All tags',
    min: (m) => `${m} min read`, minShort: (m) => `${m} min`, latest: 'Latest',
    newer: 'Newer', older: 'Older', page: (a, b) => `Page ${a} of ${b}`, pages: 'Pages',
    toc: 'In this post', timeline: 'Timeline', shareThis: 'Share this post', copy: 'Copy link', copied: 'Link copied', codeCopy: 'Copy', codeCopyLabel: 'Copy code example', copyFail: 'Select the link and copy it', shareLink: 'Link to this post', shareOn: 'Share on', email: 'Email', close: 'Close', newTab: '(opens in a new tab)',
    prev: 'Previous', next: 'Next', newerPost: 'Newer', olderPost: 'Older', related: 'Keep reading', back: 'Back to the blog',
    by: 'Written by', authorMore: 'More about me', write: 'Write to me',
    published: 'Published', reading: 'Reading', in: 'in', tagged: 'Tagged',
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
    projDeck: 'A selection of what I’ve published on GitHub: design systems, tools, AI experiments and the Cádiz Carnival.',
    projCount: (n, a, b) => `${n} projects · ${a}–${b}`, projCountOne: (n) => (n === 1 ? '1 project' : `${n} projects`),
    allTech: 'All', techLabel: 'Technology', year: 'Year', demo: 'See demo', repo: 'See code', shot: (n) => `Screenshot of ${n}`, moreProjects: 'More projects',
    newTab: '(opens in a new tab)', projLegendTitle: 'How to read the blocks',
    projLegend: 'The newer the project, the denser its screen; its kanji is drawn in it.'
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

// the footer of every page, in four labelled groups and a last line (plan-maqueta.md §5):
// Sections (the pill's names and numbers), Follow me (the socials), About this site (the
// small print: privacy, cookie policy, credits and licence) and Preferences (what changes
// something here: the language; the colour mode is the round button, not a row here). The cookie
// settings button sits in the small print: shared/consent.js (LUZ) wires it.
export const MOTTO = { es: 'Proyecto, el motivo. Humano, el centro. TecnologIA, sólo el medio', en: 'Project, the reason. Human, the core. TechnologAI, only the means' }[lang];
const FOOT = {
  es: { sections: 'Secciones', follow: 'Sígueme', about: 'Sobre esta web', prefs: 'Preferencias', bio: 'Bio', work: 'Proyectos', blog: 'Blog',
    privacy: 'Privacidad', cookies: 'Cookies', credits: 'Créditos y licencia', language: 'Idioma', cookieSettings: 'Ajustes de cookies',
    legal: ['Contenido © ', ', salvo lo que se acredite aparte en los ', 'créditos', '. Hecho con ', ' (licencia MIT). Cómo usa las cookies esta web, en la ', 'política de cookies', '; puedes cambiar tus ', 'ajustes de cookies', ' cuando quieras.'] },
  en: { sections: 'Sections', follow: 'Follow me', about: 'About this site', prefs: 'Preferences', bio: 'Bio', work: 'Projects', blog: 'Blog',
    privacy: 'Privacy', cookies: 'Cookies', credits: 'Credits and licence', language: 'Language', cookieSettings: 'Cookie settings',
    legal: ['Content © ', ', except what is credited separately in the ', 'credits', '. Made with ', ' (MIT licence). How this site uses cookies, in the ', 'cookie policy', '; you can change your ', 'cookie settings', ' whenever you like.'] }
}[lang];
// this same page in a language (Spanish is the page without ?lang)
function langHref(l) {
  const u = new URL(location.href);
  if (l === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang');
  return u.pathname + u.search;
}
// the language switch: a button with the name of the page's language and, when pressed, the list of
// languages (a popover of links, in the top layer so nothing clips it). A disclosure, not an ARIA menu:
// the button says expanded or not, Esc and a press outside close it (the platform), the arrows move
// through the list. The page's own language is plain text (aria-current), the others links to this same
// page in them, each with its language. In the masthead and, the same, in the footer. No choice is stored:
// the ?lang in every link carries it.
const LANGS = [['es', 'Español'], ['en', 'English']];
const SVGNS = 'http://www.w3.org/2000/svg';
const chevron = () => { // five dots in a V
  const s = document.createElementNS(SVGNS, 'svg');
  s.setAttribute('class', 'lang-dd__chev'); s.setAttribute('viewBox', '0 0 5 3'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
  for (const [cx, cy] of [[.5, .5], [4.5, .5], [1.5, 1.5], [3.5, 1.5], [2.5, 2.5]]) {
    const c = document.createElementNS(SVGNS, 'circle'); c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', .5); s.append(c);
  }
  return s;
};
const dot = () => el('span', { class: 'lang-dd__dot', 'aria-hidden': 'true' });
let ddCount = 0;
export function langSwitch(cls = 'langs') {
  const id = `lang-dd-${++ddCount}`, label = lang === 'en' ? 'Language' : 'Idioma', now = lang === 'en' ? 'current language' : 'idioma actual';
  const here = LANGS.find(([l]) => l === lang);
  const btn = el('button', { type: 'button', class: 'lang-dd__btn', 'aria-expanded': 'false', 'aria-controls': id, popovertarget: id },
    el('span', { class: 'vh', text: `${label}: ` }), el('span', { lang, text: here[1] }), chevron());
  const menu = el('ul', { class: 'lang-dd__list', id, popover: 'auto', dir: 'ltr', 'aria-label': label },
    ...LANGS.map(([l, name]) => el('li', {}, l === lang
      ? el('span', { class: 'lang-dd__cur', lang: l, 'aria-current': 'true' }, dot(), el('span', { text: name }), el('span', { class: 'vh', text: `, ${now}` }))
      : el('a', { href: langHref(l), hreflang: l, lang: l }, dot(), el('span', { text: name })))));
  // under the button, or over it when there is no room below; at its edge, never out of the window
  const place = () => {
    const b = btn.getBoundingClientRect(), h = menu.offsetHeight, w = menu.offsetWidth, below = innerHeight - b.bottom;
    const up = below < h + 12 && b.top > below, end = b.left + b.width / 2 > innerWidth / 2;
    menu.style.top = `${up ? Math.max(8, b.top - h - 6) : b.bottom + 6}px`;
    menu.style.left = `${Math.min(Math.max(8, end ? b.right - w : b.left), innerWidth - w - 8)}px`;
  };
  menu.addEventListener('toggle', (e) => { btn.setAttribute('aria-expanded', e.newState === 'open'); if (e.newState === 'open') place(); });
  menu.addEventListener('keydown', (e) => {
    const items = [...menu.querySelectorAll('a')], i = items.indexOf(document.activeElement), to = { ArrowDown: (i + 1) % items.length, ArrowUp: (i - 1 + items.length) % items.length, Home: 0, End: items.length - 1 }[e.key];
    if (to != null && items.length) { e.preventDefault(); items[to].focus(); }
  });
  btn.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); if (!menu.matches(':popover-open')) menu.showPopover(); menu.querySelector('a')?.focus(); } });
  addEventListener('resize', () => { if (menu.matches(':popover-open')) menu.hidePopover(); });
  return el('span', { class: `${cls} lang-dd` }, btn, menu);
}
const ext = (href, text) => el('a', { href, target: '_blank', rel: 'noopener' }, el('span', { text }), el('span', { class: 'vh', text: ' ' + B.newTab }), el('span', { 'aria-hidden': 'true', text: ' ↗' }));
const group = (id, title, tag, props, ...kids) => el(tag, { class: 'foot__group', 'aria-labelledby': id, ...props }, el('h2', { class: 'foot__h', id, text: title }), ...kids);
const list = (...items) => el('ul', {}, ...items.map((i) => el('li', {}, i)));
const page = (href, text) => el('a', { href, text });
const pref = (label, value, button) => el('li', { class: 'foot__pref' }, el('span', { class: 'foot__k', text: label }), value, button);
export const footer = (c) => el('footer', { class: 'foot' },
  el('div', { class: 'foot__groups' },
    group('foot-sections', FOOT.sections, 'nav', {},
      list(...[['01', FOOT.bio, homeUrl('#bio')], ['02', FOOT.work, projectsUrl()], ['03', FOOT.blog, blogUrl()], ['04', c.contactTitle, homeUrl('#contacto')]]
        .map(([n, text, href]) => el('a', { href }, el('span', { class: 'foot__n', 'aria-hidden': 'true', text: n }), ' ', el('span', { text }))))),
    group('foot-follow', FOOT.follow, 'section', {},
      list(...['github', 'linkedin', 'x', 'rss'].map((id) => c.socials.find((x) => x.id === id)).filter(Boolean).map((x) => ext(x.url, x.label)))),   // the footer's four (the home's «Escríbeme» has them all)
    group('foot-about', FOOT.about, 'nav', {},
      // the cookie settings button is the way back into the banner (shared/consent.js: LUZ wires it, hidden until then)
      list(page(url('/privacidad/'), FOOT.privacy), page(url('/cookies/'), FOOT.cookies),
        el('button', { type: 'button', class: 'foot__consent', 'data-luz-consent-open': '', hidden: '', text: FOOT.cookieSettings }), page(url('/creditos/'), FOOT.credits))),
    group('foot-prefs', FOOT.prefs, 'section', { class: 'foot__group foot__group--bare' },
      el('ul', {},
        pref(FOOT.language, langSwitch('langs foot__lang'))))),
  el('div', { class: 'foot__end' },
    el('p', { class: 'foot__by' }, FOOT.legal[0], c.name, FOOT.legal[1], page(url('/creditos/'), FOOT.legal[2]), FOOT.legal[3], ext('https://luzds.com/', 'LUZ'), FOOT.legal[4],
      page(url('/cookies/'), FOOT.legal[5]), FOOT.legal[6],
      el('button', { type: 'button', class: 'foot__consent', 'data-luz-consent-open': '', hidden: '', text: FOOT.legal[7] }), FOOT.legal[8])));

// the screen of a project, as on the home: denser the newer, its kanji drawn in
const DENSITY = { 2023: 0.36, 2024: 0.52, 2025: 0.68, 2026: 0.86 };
// the first sense of the project's kanji meaning, in the page's language (a tiny caption in the
// corner of its picture; '' when the project has no kanji) and the caption itself
export const glossOf = (p) => kanjiGloss(kanjiOf(p.id), lang);
export const glossEl = (p) => { const t = glossOf(p); return t ? el('span', { class: 'gloss', text: t }) : null; };
export function projectDots(p) { const h = hashStr(p.id); return { density: DENSITY[p.year] ?? 0.6, kind: h % 6, seed: h, label: kanjiOf(p.id) || pad(p.n), gloss: glossOf(p).length }; }

// one row of the project list: screen · year and tech · name · kicker
export function projectRow(p) {
  const cv = el('canvas', { class: 'brow__dots', 'aria-hidden': 'true' });
  const li = el('li', { class: 'brow prow' },
    el('div', { class: 'brow__thumb' }, cv),
    el('p', { class: 'brow__meta' },
      el('span', { text: p.year }),
      el('span', { text: p.tech.join(' · ') })),
    el('h3', { class: 'brow__title prow__name' }, el('a', { href: projectUrl(p), text: p.name })),
    el('p', { class: 'brow__excerpt', text: p.kicker }));
  return { li, cv, dots: projectDots(p) };
}

const locale = lang === 'en' ? 'en-GB' : lang;                   // the English is British (16 November 2026)
const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });
const fmtShort = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' });
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
// a project's own screenshot (made by tools/project-shots.cjs): the demo, or the repo's demo page, or its README
export function projectPicture(p, alt, img = {}) {
  const f = `${IMG}proyectos/${p.id}`;
  return el('picture', {},
    el('source', { srcset: f + '.avif', type: 'image/avif' }),
    el('source', { srcset: f + '.webp', type: 'image/webp' }),
    el('img', { src: f + '.jpg', alt, width: 1200, height: 750, loading: 'lazy', decoding: 'async', ...img }));
}
export function coverPicture(p, img = {}) {
  const f = `${IMG}blog/${p.id}`;
  return el('picture', {},
    el('source', { srcset: f + '.avif', type: 'image/avif' }),
    el('source', { srcset: f + '.webp', type: 'image/webp' }),
    el('img', { src: f + '.jpg', alt: p.cover.alt, width: p.cover.w, height: p.cover.h, decoding: 'async', ...img }));
}

// A featured image (the blog's featured post, every post row) plays ONE cycle
// when it first comes into view and then rests (WCAG 2.2.2: nothing may move
// for good): dots → black and white → colour → black and white, ending on the
// black and white it rests in (the last step of the loop, the dots gathering
// again, is left out, or it would sink to dots only to rise again). Hovering
// the picture or its title, or keyboard focus on the title, plays it once more
// (it sinks back to dots first, from the rest, so there is no jump).
// One clock drives everything (no chained CSS transitions), so each step
// flows into the next. The dots don't fade: they come apart and gather with
// the engine itself (draw(p), 1 → 0 → 1).
// `fig` holds the <picture> and the canvas (.cover-loop); `block()` returns
// its current DotBlock (it is rebuilt on resize); `offset` (s) staggers a
// list so its rows don't start together. Paused off screen; with reduced
// motion it rests in black and white at once (.is-shown) and hover gives the
// colour, with no cycle at all.
// `colour: false` (the thumbnails of post rows) skips the colour: dots ↔
// black and white only, on a shorter table, and no colour on hover either.
// The caller marks its block as looping, so nothing else draws it.
// The whole cycle is under 5 s (WCAG 2.2.2: moving for longer than that needs a way to stop it).
const LOOP_COLOUR = [     // [seconds, dots, light, colour] at the end of each step
  [0.25, 1, 0, 0],        // hold: dots
  [1.0, 0, 1, 0],         // dots come apart, the photo rises in black and white
  [0.3, 0, 1, 0],         // hold: black and white
  [1.0, 0, 1, 1],         // colour comes in
  [0.8, 0, 1, 1],         // hold: colour
  [1.0, 0, 1, 0],         // colour goes
  [0.3, 0, 1, 0],         // hold: black and white (it rests here)
  [1.0, 1, 0, 0]          // the photo sinks, the dots gather (only in the loop's own order, not played)
];
const LOOP_BW = [         // the same, without the colour
  [0.25, 1, 0, 0],        // hold: dots
  [1.0, 0, 1, 0],         // dots come apart, the photo rises in black and white
  [0.5, 0, 1, 0],         // hold: black and white (it rests here)
  [1.0, 1, 0, 0]          // the photo sinks, the dots gather (not played)
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
  const full = withColour ? LOOP_COLOUR : LOOP_BW, cycle = full.slice(0, -1);
  const again = [[0.6, 1, 0, 0], ...cycle];                        // from the rest: sink to dots, then the cycle
  if (!withColour) fig.classList.add('cover-loop--bw');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return fig.classList.add('is-shown');
  let on = false, seen = false, playing = false, seq = cycle, from = [0, 1, 0, 0], clock = 0, last = 0, raf = 0;
  // the rest: black and white, no dots (.is-rest, blog.css), the inline filters back to the stylesheet's
  const rest = () => { playing = false; pic.style.filter = img.style.filter = ''; fig.classList.add('is-rest'); };
  // `clock` runs in ms from the start of `seq`; a negative start is the stagger (the first state, held longer)
  const play = (s, f, delay = 0) => {
    if (playing) return;
    playing = true; seq = s; from = f; clock = -delay * 1000; last = performance.now();
    fig.classList.remove('is-rest');
    if (on) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
  };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting === on) return;
    on = e.isIntersecting;
    if (!on) return;
    if (!seen) { seen = true; play(cycle, from, offset % 5); }       // the first time it is seen: its one cycle
    else if (playing) { last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
  }).observe(fig);
  // hover on the picture or its title (not a touch, which would run it on every tap), or keyboard focus on the title
  const host = fig.closest('.brow, .feat'), links = host ? [...host.querySelectorAll('h2 a, h3 a')] : [];
  const replay = (e) => { if (seen && e.pointerType !== 'touch') play(again, [0, 0, 1, 0]); };
  for (const n of [fig, ...links]) n.addEventListener('pointerenter', replay);
  for (const a of links) a.addEventListener('focus', () => { if (seen && a.matches(':focus-visible')) play(again, [0, 0, 1, 0]); });
  function frame(now) {
    if (!on || !playing) return;
    clock += Math.min(now - last, 100); last = now;                 // (a stalled frame must not skip the cycle)
    let t = Math.max(0, clock) / 1000, prev = from, v = null;
    for (const step of seq) {
      if (t <= step[0]) { const k = ease(t / step[0]); v = [1, 2, 3].map((j) => prev[j] + (step[j] - prev[j]) * k); break; }
      t -= step[0]; prev = step;
    }
    const done = !v;
    if (done) v = prev.slice(1);                                    // past the last step: the state it ends in
    const [dots, light, colour] = v, b = block();
    if (b) b.draw(dots, true);
    pic.style.filter = `brightness(${sink.b + (1 - sink.b) * light}) contrast(${sink.c + (1 - sink.c) * light})`;
    img.style.filter = `grayscale(${1 - colour})`;
    if (done) rest(); else raf = requestAnimationFrame(frame);
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
