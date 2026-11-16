// Trama · the blog pages. One module, four templates picked by <body data-page>:
//   list      /blog/?p=2                  every post, newest first, paginated
//   post      /blog/articulo/?a=<id>      one post
//   category  /blog/categoria/[?c=<id>]   all categories, or the posts of one
//   tag       /blog/etiqueta/[?t=<id>]    all tags, or the posts of one
// Unknown ids render a "not found" page (the 404 of the sandbox).
import { content, blog, lang } from '../shared/content.js';
import { DotBlock, HeroField, clamp, easeOut, loadTone } from '../dots.js';
import { RainField } from '../rain.js';
import { B, url, blogUrl, postUrl, catUrl, tagUrl, homeUrl, date, pad, el, row, postDots, coverTone, coverPicture, projectPicture, coverLoop, projectTone, projectsUrl, projectUrl, projectRow, projectDots, glossEl, footer } from './parts.js';
import { consent, allowed, grant, CT } from '../shared/consent.js';
import { themeSwitch, onMode } from '../shared/theme.js';
import { POLICY as P, UPDATED } from '../shared/cookies-policy.js';
import { CREDITS as CR, UPDATED as CR_UPDATED } from '../shared/credits.js';
import { getConsent } from '/assets/vendor/luz/cookie-consent.min.js';

const PER_PAGE = 5;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search);
const page = document.body.dataset.page;
const isProj = page === 'projects' || page === 'project';

const [c, b] = await Promise.all([content(), blog()]);
const H = {
  es: { skip: 'Saltar al contenido', bio: 'Bio', work: 'Proyectos', other: 'English', sections: 'Secciones' },
  en: { skip: 'Skip to content', bio: 'Bio', work: 'Projects', other: 'Español', sections: 'Sections' }
}[lang];
document.documentElement.lang = lang;
document.documentElement.classList.add('js', 'docked', reduce ? 'still' : 'moving');

// ------------------------------------------------------------- chrome
const other = new URL(location.href);
if (lang === 'en') other.searchParams.delete('lang'); else other.searchParams.set('lang', 'en');
const navItem = (n, href, label, current) => el('li', {}, el('a', { href, 'aria-current': current ? 'page' : null },
  el('span', { class: 'nav__n', 'aria-hidden': 'true', text: n }), ' ', el('span', { text: label })));
const main = el('main', { id: 'main', class: 'blog' });
const put = (...kids) => main.append(...kids.filter(Boolean));
document.body.prepend(
  el('a', { class: 'skip', href: '#main', text: H.skip }),
  el('header', { class: 'top' },
    el('a', { class: 'top__mark', href: homeUrl() }, el('span', { 'aria-hidden': 'true', text: 'NM' }), el('span', { text: c.name })),
    el('a', { class: 'top__lang', href: other.pathname + other.search, hreflang: lang === 'en' ? 'es' : 'en', lang: lang === 'en' ? 'es' : 'en', text: H.other })),
  el('nav', { class: 'nav', id: 'nav', 'aria-label': H.sections }, el('ol', {},
    navItem('01', homeUrl('#bio'), H.bio), navItem('02', projectsUrl(), H.work, isProj),
    navItem('03', blogUrl(), B.blog, page !== '404' && page !== 'cookies' && page !== 'creditos' && !isProj), navItem('04', homeUrl('#contacto'), c.contactTitle))),
  main,
  footer(c));
consent();
themeSwitch();
onMode(() => { build(); titles.forEach((t) => t.f && t.f.repaint()); });

// ------------------------------------------------------------- dots
// every screen assembles once when it comes into view; the pointer pushes it
const cellSize = () => (innerWidth < 768 ? 7 : innerWidth < 1024 ? 8 : 9);
const screens = [];
// a screen with `tone` (a grey map's url) draws that picture once it loads
function screen(cv, opts, tone) {
  const s = { cv, opts, block: null };
  screens.push(s);
  if (tone) loadTone(tone).then((t) => {
    if (!t) return;
    s.tone = t;
    if (s.block) { s.block.o.tone = t; s.block.resize(); }
  });
  return s;
}
function build() {
  const cell = cellSize();
  for (const s of screens) {
    const p = s.block ? s.block.p : reduce ? 1 : 0;
    s.block = new DotBlock(s.cv, { cell, ...(typeof s.opts === 'function' ? s.opts(cell) : s.opts), tone: s.tone });
    s.block.draw(p, true);
  }
}
function assemble(s) {
  if (s.looping) return;
  if (reduce) return s.block.draw(1, true);
  const t0 = performance.now(), from = s.block.p;
  const step = (now) => {
    const k = clamp((now - t0) / 1300);
    s.block.draw(from + (1 - from) * easeOut(k));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// the share dialog (when there is no system share sheet): the link, a button
// to copy it, and the usual places as plain links (nothing loads from them
// until the reader picks one). Built once, refilled on each open.
let shareDlg = null;
function shareDialog({ title, url: link }) {
  const e = encodeURIComponent, t = e(title), u = e(link);
  const places = [
    ['WhatsApp', `https://wa.me/?text=${t}%20${u}`],
    ['X (Twitter)', `https://twitter.com/intent/tweet?text=${t}&url=${u}`],
    ['Telegram', `https://t.me/share/url?url=${u}&text=${t}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ['Bluesky', `https://bsky.app/intent/compose?text=${t}%20${u}`],
    [B.email, `mailto:?subject=${t}&body=${u}`]
  ];
  if (!shareDlg) {
    const close = el('button', { type: 'button', class: 'share__close' }, el('span', { text: B.close }), el('span', { 'aria-hidden': 'true', text: ' ×' }));
    shareDlg = el('dialog', { class: 'consent__dialog share__dialog', 'aria-labelledby': 'share-title' },
      el('div', { class: 'share__head' },
        el('h2', { class: 'consent__dialog-title', id: 'share-title', text: B.shareThis }), close),
      el('p', { class: 'share__what' }),
      el('label', { class: 'share__field-label', for: 'share-url', text: B.shareLink }),
      el('div', { class: 'share__copy' },
        el('input', { class: 'share__url', id: 'share-url', type: 'text', readonly: '' }),
        el('button', { type: 'button', class: 'share__btn share__copybtn' }, el('span', { text: B.copy }))),
      el('p', { class: 'share__status', role: 'status' }),
      el('p', { class: 'share__field-label', id: 'share-on', text: B.shareOn }),
      el('ul', { class: 'share__places', 'aria-labelledby': 'share-on' }));
    close.addEventListener('click', () => shareDlg.close());
    shareDlg.addEventListener('click', (ev) => {
      if (ev.target === shareDlg) shareDlg.close();               // a click on the backdrop
      else if (ev.target.closest('.share__places a')) shareDlg.close();
    });
    const field = $('.share__url', shareDlg), status = $('.share__status', shareDlg);
    field.addEventListener('focus', () => field.select());
    $('.share__copybtn', shareDlg).addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(field.value); status.textContent = B.copied; } catch { field.focus(); status.textContent = B.copyFail; }
      clearTimeout(status.tm);
      status.tm = setTimeout(() => { status.textContent = ''; }, 2400);
    });
    document.body.append(shareDlg);
  }
  $('.share__what', shareDlg).textContent = title;
  $('.share__url', shareDlg).value = link;
  $('.share__status', shareDlg).textContent = '';
  $('.share__places', shareDlg).replaceChildren(...places.map(([name, href]) => el('li', {},
    href.startsWith('mailto:')
      ? el('a', { href, text: name })
      : el('a', { href, target: '_blank', rel: 'noopener' }, el('span', { text: name }), el('span', { class: 'vh', text: ' ' + B.newTab }), el('span', { 'aria-hidden': 'true', text: ' ↗' })))));
  return shareDlg;
}

const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  screens.filter((s) => s.cv === e.target).forEach(assemble);
  io.unobserve(e.target);
}), { rootMargin: '0px 0px -8% 0px' });
if (fine && !reduce) {
  addEventListener('pointermove', (e) => {
    const cv = e.target.closest?.('canvas');
    for (const s of screens) {
      if (!s.block) continue;
      if (s.cv === cv) {
        const r = cv.getBoundingClientRect();
        s.block.ptr = { x: (e.clientX - r.left) * (s.block.w / r.width), y: (e.clientY - r.top) * (s.block.w / r.width) };
        s.block.draw(s.block.p, true);
      } else if (s.block.ptr) { s.block.ptr = null; s.block.draw(s.block.p, true); }
    }
  }, { passive: true });
}

// titles that resolve from noise into dots (short ones only)
const titles = [];
function decode(h) {
  const text = h.textContent;
  const cv = el('canvas', { class: 'title-dots', 'aria-hidden': 'true' });
  h.replaceChildren(el('span', { class: 'vh', text }), cv);
  titles.push({ cv, text, f: null });
}

// ------------------------------------------------------------- shared bits
const kindOf = (p) => b.categories[p.category].kind;
const years = (ps) => { const ys = ps.map((p) => p.year); return [Math.min(...ys), Math.max(...ys)]; };

function head({ n = '03', crumbs = [], title, deck, count, decodeTitle = true }) {
  const h1 = el('h1', { class: decodeTitle ? 'bhead__title decode' : 'bhead__title', text: title });
  const node = el('header', { class: 'bhead' },
    crumbs.length ? el('p', { class: 'crumbs' }, ...crumbs.flatMap(([label, href], i) => [i ? el('span', { 'aria-hidden': 'true', text: ' / ' }) : null, el('a', { href, text: label })])) : el('p', { class: 'sec-head__n', 'aria-hidden': 'true', text: n }),
    h1,
    deck ? el('p', { class: 'bhead__deck', text: deck }) : null,
    count ? el('p', { class: 'bhead__count', text: count }) : null);
  if (decodeTitle) decode(h1);
  return node;
}

function chips(current) {
  return el('nav', { class: 'chips', 'aria-label': B.categories }, el('ul', {},
    ...Object.values(b.categories).filter((k) => k.count).map((k) => el('li', {},
      el('a', { href: catUrl(k.id), 'aria-current': current === k.id ? 'page' : null },
        el('span', { text: k.name }), el('sup', { text: k.count })))),
    el('li', { class: 'chips__more' }, el('a', { href: url('/blog/categoria/'), 'aria-current': current === '*' ? 'page' : null, text: B.allCategories })),
    el('li', { class: 'chips__more' }, el('a', { href: url('/blog/etiqueta/'), text: B.tags }))));
}

// a list of rows, grouped by year
function rows(posts, { group = true } = {}) {
  const wrap = el('div', { class: 'blist' });
  let ol = null, year = null;
  for (const p of posts) {
    if (!ol || (group && p.year !== year)) {
      year = p.year;
      ol = el('ol', { class: 'brows' });
      wrap.append(group ? el('section', { class: 'byear', 'aria-label': String(year) }, el('h2', { class: 'byear__n', text: year }), ol) : ol);
    }
    const r = row(p, b);
    ol.append(r.li);
    const sc = screen(r.cv, { rows: 9, ...r.dots, label: '' }, r.tone);
    if (r.fig) { sc.looping = true; coverLoop(r.fig, () => sc.block, { offset: 1.3 * ol.children.length, colour: false }); }
  }
  return wrap;
}

function pager(cur, total, to) {
  if (total < 2) return null;
  const nums = el('ol', {}, ...Array.from({ length: total }, (_, i) => el('li', {},
    el('a', { href: to(i + 1), 'aria-current': i + 1 === cur ? 'page' : null, 'aria-label': B.page(i + 1, total), text: pad(i + 1) }))));
  return el('nav', { class: 'pager', 'aria-label': B.pages },
    cur > 1 ? el('a', { class: 'pager__dir', href: to(cur - 1), rel: 'prev', text: '← ' + B.newer }) : el('span', { class: 'pager__dir is-off', text: '← ' + B.newer }),
    nums,
    cur < total ? el('a', { class: 'pager__dir', href: to(cur + 1), rel: 'next', text: B.older + ' →' }) : el('span', { class: 'pager__dir is-off', text: B.older + ' →' }));
}

function featured(p) {
  const cat = b.categories[p.category];
  const cv = el('canvas', { 'aria-hidden': 'true' });
  const sc = screen(cv, (cell) => ({ rows: innerWidth < 1024 ? 22 : 30, ...postDots(p, b.posts, cat.kind) }), coverTone(p));
  const dots = p.cover
    ? el('div', { class: 'feat__dots cover-loop' }, coverPicture(p, { alt: '' }), cv)
    : el('div', { class: 'feat__dots' }, cv);
  if (p.cover) { sc.looping = true; coverLoop(dots, () => sc.block); }
  return el('article', { class: 'feat' },
    dots,
    el('div', { class: 'feat__text' },
      el('p', { class: 'feat__kicker' }, el('span', { text: B.latest }), ' · ', el('a', { href: catUrl(cat.id), text: cat.name })),
      el('h2', { class: p.title.length > 48 ? 'feat__title feat__title--long' : 'feat__title' }, el('a', { href: postUrl(p), text: p.title })),
      el('p', { class: 'feat__excerpt', text: p.excerpt }),
      el('p', { class: 'feat__meta' }, el('time', { datetime: p.date, text: date(p.date) }), ' · ', B.min(p.minutes))));
}

// ------------------------------------------------------------- 404
// Matrix rain with the desk picture drawn in it (a click scans);
// the address that failed; a search over posts and projects, prefilled from
// that address; the four sections; the latest posts.
const later = [];
const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/<[^>]+>/g, ' ');
function notFound() {
  document.title = `404 · ${B.nf} · ${c.name}`;
  document.documentElement.classList.add('is-lost');
  const shown = decodeURIComponent(location.pathname + location.search).replace(/[?&]lang=en/, '');

  // the field
  const cv = el('canvas', { class: 'lost__field', 'aria-hidden': 'true' });
  const hint = el('p', { class: 'lost__hint', 'aria-hidden': 'true', text: fine ? B.nfHintFine : B.nfHint });
  const stage = el('div', { class: 'lost__stage' }, cv, hint);
  later.push(() => {
    const f = new RainField(cv, { mask: 'image', dots: true });                  // the rain, with the desk picture drawn in it (rain.js)
    f.start();
    cv.addEventListener('pointerdown', (e) => {
      const r = cv.getBoundingClientRect(); f.poke(e.clientX - r.left, e.clientY - r.top);
      hint.classList.add('is-done');
    });
    new IntersectionObserver(([e]) => (e.isIntersecting ? f.start() : f.stop())).observe(cv);
    addEventListener('resize', () => { clearTimeout(f.tm); f.tm = setTimeout(() => f.layout(), 200); });
    onMode(() => f.repaint());
  });

  // search
  const index = [
    ...b.posts.map((p) => ({ kind: B.post, title: p.title, sub: `${b.categories[p.category].name} · ${p.year}`, href: postUrl(p),
      hay: norm([p.title, p.excerpt, p.tags.map((t) => b.tags[t].label).join(' '), b.categories[p.category].name].join(' ')) })),
    ...c.projects.map((p) => ({ kind: B.project, title: p.name, sub: `${p.tech.join(' · ')} · ${p.year}`, href: projectUrl(p),
      hay: norm([p.name, p.kicker, p.tech.join(' ')].join(' ')) }))
  ];
  const input = el('input', { type: 'search', id: 'lost-q', name: 'q', autocomplete: 'off', placeholder: B.nfPlaceholder, spellcheck: 'false' });
  const status = el('p', { class: 'lost__status', role: 'status' });
  const list = el('ol', { class: 'lost__results' });
  const find = (raw, guess) => {
    const words = norm(raw).split(/[^a-z0-9ñ]+/).filter((w) => w.length > 1);
    const hits = !words.length ? [] : index
      .map((it) => ({ it, s: words.filter((w) => it.hay.includes(w)).length }))
      .filter((x) => (guess ? x.s > 0 : x.s === words.length))
      .sort((x, y) => y.s - x.s).slice(0, 6).map((x) => x.it);
    list.replaceChildren(...hits.map((it) => el('li', {}, el('a', { href: it.href },
      el('span', { class: 'lost__kind', text: it.kind }), el('span', { class: 'lost__rtitle', text: it.title }), el('span', { class: 'lost__sub', text: it.sub })))));
    status.textContent = !words.length ? '' : hits.length ? (guess ? B.nfMaybe : B.nfResults(hits.length)) : guess ? '' : B.nfNone;
  };
  input.addEventListener('input', () => find(input.value));
  // a first guess from the address: /blog/articulo/?a=margaret → «margaret»
  const guess = (q.get('a') || q.get('c') || q.get('t') || location.pathname.split('/').filter(Boolean).pop() || '')
    .replace(/\.html?$/, '').replace(/[-_+]/g, ' ');
  if (page !== '404' || !/^(trama|maqueta)$/.test(guess)) find(guess, true);

  const way = (n, label, href) => el('li', {}, el('a', { href }, el('span', { class: 'lost__n', 'aria-hidden': 'true', text: n }), el('span', { text: label }), el('span', { class: 'lost__arrow', 'aria-hidden': 'true', text: '→' })));

  put(el('section', { class: 'lost', 'aria-labelledby': 'lost-title' },
    stage,
    el('div', { class: 'lost__copy' },
      el('p', { class: 'lost__kicker', text: B.nfKicker }),
      el('h1', { class: 'lost__title', id: 'lost-title', text: B.nfTitle }),
      el('p', { class: 'lost__lead' }, B.nfLead + ' ', el('code', { text: shown }), B.nfLead2)),
    el('form', { class: 'lost__search', role: 'search', onsubmit: 'return false' },
      el('label', { for: 'lost-q', text: B.nfSearch }),
      el('div', { class: 'lost__field-row' }, input),
      status, list),
    el('nav', { class: 'lost__ways', 'aria-labelledby': 'lost-ways' },
      el('h2', { id: 'lost-ways', text: B.nfWays }),
      el('ul', {}, way('01', H.bio, homeUrl('#bio')), way('02', H.work, projectsUrl()), way('03', B.blog, blogUrl()), way('04', c.contactTitle, homeUrl('#contacto')))),
    el('section', { class: 'lost__latest', 'aria-labelledby': 'lost-latest' },
      el('h2', { id: 'lost-latest', text: B.nfLatest }), rows(b.posts.slice(0, 3), { group: false }))));
}

// ------------------------------------------------------------- pages
function listPage() {
  const total = Math.ceil(b.posts.length / PER_PAGE);
  const cur = clamp(parseInt(q.get('p'), 10) || 1, 1, total);
  const slice = b.posts.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
  const [a, z] = years(b.posts);
  document.title = `Blog${cur > 1 ? ` · ${B.page(cur, total)}` : ''} · ${c.name}`;
  put(
    head({ title: B.blog, deck: B.deck, count: B.count(b.posts.length, a, z) + (cur > 1 ? ` · ${B.page(cur, total)}` : '') }),
    chips(),
    cur === 1 ? featured(slice[0]) : null,
    rows(cur === 1 ? slice.slice(1) : slice),
    pager(cur, total, blogUrl));
}

function categoryPage() {
  const id = q.get('c');
  if (!id) {
    document.title = `${B.categories} · Blog · ${c.name}`;
    const grid = el('ul', { class: 'cats' }, ...Object.values(b.categories).map((k) => {
      const cv = el('canvas', { 'aria-hidden': 'true' });
      screen(cv, { rows: 12, density: 0.75, kind: k.kind, seed: 31 + k.kind });
      return el('li', { class: 'cat' }, el('div', { class: 'cat__dots' }, cv),
        el('h2', { class: 'cat__name' }, el('a', { href: catUrl(k.id), text: k.name })),
        el('p', { class: 'cat__desc', text: k.desc }),
        el('p', { class: 'cat__count', text: B.countOne(k.count) }));
    }));
    put(head({ crumbs: [[B.blog, blogUrl()]], title: B.categories, count: `${Object.keys(b.categories).length} · ${B.countOne(b.posts.length)}` }),
      el('aside', { class: 'legend' }, el('h3', { text: B.legendTitle }), el('p', { text: B.legend })), grid);
    return;
  }
  const k = b.categories[id];
  if (!k) return notFound();
  const posts = b.posts.filter((p) => p.category === id);
  const total = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const cur = clamp(parseInt(q.get('p'), 10) || 1, 1, total);
  document.title = `${k.name} · Blog · ${c.name}`;
  put(
    head({ crumbs: [[B.blog, blogUrl()], [B.categories, url('/blog/categoria/')]], title: k.name, deck: k.desc, count: B.countOne(posts.length) }),
    chips(id),
    rows(posts.slice((cur - 1) * PER_PAGE, cur * PER_PAGE)),
    pager(cur, total, (n) => url('/blog/categoria/', { c: id, p: n > 1 ? n : null })));
}

function tagPage() {
  const id = q.get('t');
  if (!id) {
    document.title = `${B.tags} · Blog · ${c.name}`;
    const max = Math.max(...Object.values(b.tags).map((t) => t.count));
    const cloud = el('ul', { class: 'tags tags--cloud' }, ...Object.values(b.tags).filter((t) => t.count)
      .sort((x, y) => y.count - x.count || x.label.localeCompare(y.label))
      .map((t) => el('li', { style: `--w:${(t.count / max).toFixed(2)}` }, el('a', { href: tagUrl(t.id) }, el('span', { text: '#' + t.label }), el('sup', { text: t.count })))));
    put(head({ crumbs: [[B.blog, blogUrl()]], title: B.tags, count: `${Object.values(b.tags).filter((t) => t.count).length} ${B.tags.toLowerCase()}` }), cloud);
    return;
  }
  const t = b.tags[id];
  if (!t) return notFound();
  const posts = b.posts.filter((p) => p.tags.includes(id));
  document.title = `#${t.label} · Blog · ${c.name}`;
  put(
    head({ crumbs: [[B.blog, blogUrl()], [B.tags, url('/blog/etiqueta/')]], title: '#' + t.label, count: `${B.tagged} #${t.label} · ${B.countOne(posts.length)}` }),
    el('ul', { class: 'tags' }, ...Object.values(b.tags).filter((x) => x.count && x.id !== id).map((x) => el('li', {}, el('a', { href: tagUrl(x.id), text: '#' + x.label })))),
    rows(posts));
}

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// <luz-timeline>'s own script, copied by tools/luz-sync.mjs; defines the element when evaluated
let timelineLoaded = false;
const lazyTimeline = () => { if (!timelineLoaded) { timelineLoaded = true; import('/assets/vendor/luz/timeline.min.js').catch(() => {}); } };
// a timeline's date: a <time> with its machine-readable value when the text gives one
// ("11 de junio de 2018", "junio de 2018", "1206"); "Siglo IV a. C." stays plain text
const MONTHS = { enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12 };
function dated(when) {
  const t = String(when).trim().toLowerCase();
  const p = (n) => String(n).padStart(2, '0');
  let m, iso = null;
  if ((m = /^(\d{1,2}) de ([a-zé]+) de (\d{3,4})$/.exec(t)) && MONTHS[m[2]]) iso = `${m[3].padStart(4, '0')}-${p(MONTHS[m[2]])}-${p(m[1])}`;
  else if ((m = /^([a-zé]+) de (\d{3,4})$/.exec(t)) && MONTHS[m[1]]) iso = `${m[2].padStart(4, '0')}-${p(MONTHS[m[1]])}`;
  else if (/^\d{4}$/.test(t)) iso = t;
  return iso ? el('time', { class: 'luz-timeline__date', datetime: iso, text: when }) : el('span', { class: 'luz-timeline__date', text: when });
}
const html = (tag, attrs, s) => { const n = el(tag, attrs); n.innerHTML = s; return n; };
const caption = (s) => (s ? html('figcaption', {}, s) : null);
const outLink = (href, label, sub) => el('a', { class: 'card', href, target: '_blank', rel: 'noopener' },
  el('span', { class: 'card__label', text: label }), el('span', { class: 'card__sub', text: sub }), el('span', { class: 'card__arrow', 'aria-hidden': 'true', text: '↗' }));

function renderBlock(x, k, toc, ids) {
  if (x.p != null) return html('p', { class: k === 0 ? 'prose__lead' : null }, x.p);
  if (x.h) {
    let id = slug(x.h) || 'seccion'; while (ids.has(id)) id += '-'; ids.add(id);
    if (x.lv === 3) return el('h3', { id, text: x.h });
    toc.push([id, x.h]);
    return el('h2', { id }, el('span', { text: x.h }), el('a', { class: 'prose__anchor', href: '#' + id, 'aria-hidden': 'true', tabindex: '-1', text: '#' }));
  }
  if (x.img) return el('figure', { class: 'prose__fig' },
    // local files (maqueta/img/blog/posts/, from tools/soynando-images.cjs) come in avif, webp and jpg
    /\.jpe?g$/.test(x.img) && x.img.startsWith('/')
      ? el('picture', {},
        el('source', { srcset: x.img.replace(/\.jpe?g$/, '.avif'), type: 'image/avif' }),
        el('source', { srcset: x.img.replace(/\.jpe?g$/, '.webp'), type: 'image/webp' }),
        el('img', { src: x.img, alt: x.alt, loading: 'lazy', decoding: 'async', width: x.w, height: x.hgt }))
      : el('img', { src: x.img, alt: x.alt, loading: 'lazy', decoding: 'async', width: x.w, height: x.hgt }),
    caption(x.cap));
  if (x.quote) return el('blockquote', {}, ...x.quote.map((s) => html('p', {}, s)), x.cite ? html('cite', {}, x.cite) : null);
  if (x.pull) return el('figure', { class: 'pull' }, el('blockquote', {}, ...x.pull.map((s) => html('p', {}, s))), x.cite ? html('figcaption', {}, x.cite) : null);
  if (x.ul) return el(x.ol ? 'ol' : 'ul', {}, ...x.ul.map((s) => html('li', {}, s)));
  if (x.code != null) return el('pre', { class: 'prose__code', 'data-lang': x.lang || 'code' }, el('code', { text: x.code }));
  if (x.yt) return video(x);
  if (x.tweet != null) return el('figure', { class: 'tweet' },
    html('blockquote', {}, x.tweet),
    el('figcaption', {}, el('span', { text: x.by }), ' · ', el('a', { href: x.url, target: '_blank', rel: 'noopener', text: x.date || 'X' })));
  if (x.embed) return el('figure', { class: 'prose__card' }, outLink(x.embed, B.watch, x.host), caption(x.cap));
  if (x.gist) return el('figure', { class: 'prose__card' }, outLink(x.gist, B.code, 'gist.github.com'));
  if (x.table) return el('figure', { class: 'prose__table' },
    el('div', { class: 'prose__scroll', tabindex: '0' }, el('table', {},
      x.table.head.length ? el('thead', {}, el('tr', {}, ...x.table.head.map((s) => html('th', { scope: 'col' }, s)))) : null,
      el('tbody', {}, ...x.table.rows.map((r) => el('tr', {}, ...r.map((s) => html('td', {}, s))))))), caption(x.cap));
  if (x.timeline) {
    // LUZ's <luz-timeline>: horizontal (one card at a time, a rail of dates) by default,
    // layout="vertical" (every step down a line) when the block says so. The chunk is
    // loaded once; until it is (or without JS) the ordered list is the timeline.
    lazyTimeline();
    return el('luz-timeline', { 'aria-label': x.label || B.timeline, ...(x.layout === 'vertical' ? { layout: 'vertical' } : {}) },
      el('ol', { class: 'luz-timeline' }, ...x.timeline.map((s) => el('li', { class: 'luz-timeline__item' },
        dated(s.when), html('p', { class: 'luz-timeline__title' }, s.title),
        s.text ? html('p', { class: 'luz-timeline__text' }, s.text) : null,
        s.by ? el('p', { class: 'luz-timeline__by', text: s.by }) : null))));
  }
  if (x.hr) return el('hr');
  return null;
}

// YouTube behind a facade: nothing loads from youtube until you press play.
// Without consent for YouTube (none given yet, or rejected) the frame says so
// up front — so it never looks broken: the video's title, that it is on
// YouTube and needs its cookies, "Accept and watch here" (grants "youtube"
// and plays) and "Watch on YouTube ↗"; no thumbnail is fetched either. With
// consent it is the usual facade with its thumbnail. A choice made in the
// cookie banner while the page is open swaps one for the other.
function video(x) {
  const start = (x.params || '').match(/start=(\d+)/);
  const fig = el('figure', { class: 'video' });
  const frame = el('div', { class: 'video__frame' });
  const play = () => {
    const f = el('iframe', { src: `https://www.youtube-nocookie.com/embed/${x.yt}?autoplay=1${start ? '&start=' + start[1] : ''}`, title: x.title, allow: 'autoplay; encrypted-media; picture-in-picture', allowfullscreen: '' });
    frame.replaceChildren(f); f.focus();
  };
  const facade = () => {
    const btn = el('button', { type: 'button', class: 'video__play', 'aria-label': `${B.play}: ${x.title}` },
      el('img', { src: `https://i.ytimg.com/vi/${x.yt}/hqdefault.jpg`, alt: '', loading: 'lazy' }),
      el('span', { class: 'video__btn', 'aria-hidden': 'true' }, el('span', { text: '▶' })),
      el('span', { class: 'video__title', text: x.title }));
    btn.addEventListener('click', play);
    return btn;
  };
  const gate = () => {
    const yes = el('button', { type: 'button', class: 'consent__btn', text: CT.gateYes });
    yes.addEventListener('click', () => { grant('youtube'); play(); });
    return el('div', { class: 'video__gate', role: 'group', 'aria-label': x.title },
      el('p', { class: 'video__gate-title' }, el('span', { class: 'video__gate-icon', 'aria-hidden': 'true', text: '▶' }), x.title),
      el('p', { text: CT.gate }),
      el('div', { class: 'consent__actions' }, yes,
        el('a', { class: 'consent__btn consent__btn--quiet', href: `https://www.youtube.com/watch?v=${x.yt}${start ? '&t=' + start[1] + 's' : ''}`, target: '_blank', rel: 'noopener' },
          CT.gateNo, '\u00a0↗', el('span', { class: 'vh', text: ' ' + CT.newTab }))));
  };
  const show = () => { if (!frame.querySelector('iframe')) frame.replaceChildren(allowed('youtube') ? facade() : gate()); };
  show();
  document.addEventListener('luz:consent', () => { if (frame.isConnected && !frame.contains(document.activeElement)) show(); });
  fig.append(...[frame, caption(x.cap)].filter(Boolean));
  return fig;
}

function postPage() {
  const i = b.posts.findIndex((p) => p.id === q.get('a'));
  if (i < 0) return notFound();
  const p = b.posts[i], cat = b.categories[p.category];
  document.title = `${p.title} · ${c.name}`;
  document.documentElement.classList.add('reading');

  // body (inline HTML in the blocks was whitelisted by the converter)
  const toc = [], ids = new Set();
  const body = el('div', { class: 'prose', lang: p.postLang !== lang ? p.postLang : null });
  p.body.forEach((x, k) => { const n = renderBlock(x, k, toc, ids); if (n) body.append(n); });
  $$('a[href^="http"]', body).forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });

  // share: one button. The system's own share sheet where the browser has
  // one (navigator.share: phones, Safari, Chrome on Windows/macOS); anywhere
  // else, or if it fails for any reason but the reader cancelling, a dialog
  // with the link to copy and the usual places
  const share = el('div', { class: 'share' });
  const shareBtn = el('button', { type: 'button', class: 'share__btn', 'aria-haspopup': 'dialog' }, el('span', { text: B.shareThis }));
  shareBtn.addEventListener('click', async () => {
    const data = { title: p.title, text: p.excerpt, url: location.href.replace(/#.*$/, '') };
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      try { await navigator.share(data); return; } catch (e) { if (e.name === 'AbortError') return; }
    }
    shareDialog(data).showModal();
  });
  share.append(shareBtn);

  const aside = el('aside', { class: 'post__side' },
    toc.length > 1 ? el('details', { class: 'toc', open: innerWidth >= 1024 ? '' : null },
      el('summary', { text: B.toc }),
      el('ol', {}, ...toc.map(([id, text], k) => el('li', {}, el('a', { href: '#' + id }, el('span', { class: 'toc__n', 'aria-hidden': 'true', text: pad(k + 1) }), el('span', { text })))))) : null,
    share);

  // cover
  const cover = el('canvas', { 'aria-hidden': 'true' });
  // with a featured image the band opens to ~2.4:1 (at most 60 % of the screen) so the picture reads
  const coverRows = (cell) => (p.cover
    ? Math.round(Math.min(innerHeight * 0.6, (cover.parentElement?.clientWidth || innerWidth) / 2.4) / cell)
    : innerWidth < 768 ? 18 : innerWidth < 1024 ? 22 : 26);
  const coverScreen = screen(cover, (cell) => ({ rows: coverRows(cell), ...postDots(p, b.posts, cat.kind), corner: 1 }), coverTone(p));
  if (p.cover) { coverScreen.looping = true; requestAnimationFrame(() => coverLoop(cover.parentElement, () => coverScreen.block)); }

  // prev/next (older = next in reading order down the list)
  const newer = b.posts[i - 1], older = b.posts[i + 1];
  const pn = el('nav', { class: 'post__nav', 'aria-label': B.blog },
    newer ? el('a', { href: postUrl(newer), rel: 'prev' }, el('span', { class: 'post__dir', text: '← ' + B.prev }), el('span', { class: 'post__to', text: newer.title })) : el('span'),
    older ? el('a', { href: postUrl(older), rel: 'next' }, el('span', { class: 'post__dir', text: B.next + ' →' }), el('span', { class: 'post__to', text: older.title })) : el('span'));

  // related: same category first, then shared tags
  const score = (o) => (o.category === p.category ? 2 : 0) + o.tags.filter((tg) => p.tags.includes(tg)).length;
  const related = b.posts.filter((o) => o !== p && score(o) > 0).sort((x, y) => score(y) - score(x) || y.date.localeCompare(x.date)).slice(0, 3);

  put(el('article', { class: 'post' },
    el('header', { class: 'post__head' },
      el('p', { class: 'crumbs' }, el('a', { href: blogUrl(), text: B.blog }), el('span', { 'aria-hidden': 'true', text: ' / ' }), el('a', { href: catUrl(cat.id), text: cat.name })),
      el('h1', { class: 'post__title', text: p.title, lang: p.postLang !== lang ? p.postLang : null }),
      el('p', { class: 'post__deck', text: p.excerpt, lang: p.postLang !== lang ? p.postLang : null }),
      p.postLang !== lang ? el('p', { class: 'post__note', text: B.onlyEs }) : null,
      el('dl', { class: 'post__meta' },
        el('div', {}, el('dt', { text: B.published }), el('dd', {}, el('time', { datetime: p.date, text: date(p.date) }))),
        el('div', {}, el('dt', { text: B.reading }), el('dd', { text: B.min(p.minutes) })),
        el('div', {}, el('dt', { text: B.number }), el('dd', { class: 'post__n', text: pad(p.n) })))),
    p.cover
      ? el('figure', { class: 'post__cover' },
        el('div', { class: 'cover-loop' }, coverPicture(p, { fetchpriority: 'high' }), cover),
        // the credit is its own line (the alt describes the picture, it does not credit it)
        p.cover.credit ? html('figcaption', { class: 'post__credit' }, p.cover.credit) : null)
      : el('div', { class: 'post__cover' }, cover),
    el('div', { class: 'post__grid' }, aside, el('div', { class: 'post__main' },
      body,
      el('ul', { class: 'tags', 'aria-label': B.tags }, ...p.tags.map((tg) => el('li', {}, el('a', { href: tagUrl(tg), text: '#' + b.tags[tg].label })))),
      el('section', { class: 'author', 'aria-label': B.by },
        el('p', { class: 'author__by', text: B.by }),
        el('p', { class: 'author__name', text: c.name }),
        el('p', { class: 'author__kicker', text: c.kicker }),
        el('p', { class: 'author__links' }, el('a', { href: homeUrl('#bio'), text: B.authorMore }), el('a', { href: homeUrl('#contacto'), text: B.write }))))),
    pn,
    related.length ? el('section', { class: 'related', 'aria-labelledby': 'rel-title' },
      el('h2', { id: 'rel-title', class: 'related__title', text: B.related }), rows(related, { group: false })) : null));

  // reading progress
  document.body.append(el('div', { class: 'progress', 'aria-hidden': 'true' }, el('i')));
  if (!CSS.supports('animation-timeline: scroll()') || reduce) {
    const set = () => document.documentElement.style.setProperty('--p', clamp(scrollY / (document.documentElement.scrollHeight - innerHeight)).toFixed(4));
    addEventListener('scroll', set, { passive: true }); set();
  }
  // the toc marks the section being read
  const tio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    $$('.toc a').forEach((a) => (a.hash === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  }), { rootMargin: '-20% 0px -70% 0px' });
  $$('.prose h2').forEach((h) => tio.observe(h));
}

// ------------------------------------------------------------- projects
// /proyectos/?tech=<name>   every project, newest year first, filterable by technology
// /proyectos/proyecto/?p=<id>  one project
function projRows(list, { group = true } = {}) {
  const wrap = el('div', { class: 'blist' });
  let ol = null, year = null;
  for (const p of list) {
    if (!ol || (group && p.year !== year)) {
      year = p.year;
      ol = el('ol', { class: 'brows' });
      wrap.append(group ? el('section', { class: 'byear', 'aria-label': String(year) }, el('h2', { class: 'byear__n', text: year }), ol) : ol);
    }
    const r = projectRow(p);
    ol.append(r.li);
    screen(r.cv, { rows: 9, ...r.dots, label: '', gloss: 0 }, projectTone(p));
  }
  return wrap;
}
const byYear = (a, z) => z.year - a.year || a.n - z.n;

function projectsPage() {
  const all = c.projects.slice().sort(byYear);
  const techs = {};
  all.forEach((p) => p.tech.forEach((x) => { techs[x] = (techs[x] || 0) + 1; }));
  const want = q.get('tech');
  const tech = want && Object.keys(techs).find((x) => x.toLowerCase() === want.toLowerCase());
  if (want && !tech) return notFound();
  const list = tech ? all.filter((p) => p.tech.includes(tech)) : all;
  const ys = all.map((p) => p.year);
  document.title = `${B.projects}${tech ? ' · ' + tech : ''} · ${c.name}`;

  const keys = el('ul', { class: 'legend__keys' }, ...[2023, 2024, 2025, 2026].map((y, k) => {
    const cv = el('canvas', { 'aria-hidden': 'true' });
    screen(cv, { cell: 6, rows: 7, density: { 2023: 0.36, 2024: 0.52, 2025: 0.68, 2026: 0.86 }[y], kind: 6, seed: 7 + k });
    return el('li', {}, cv, el('span', { text: y }));
  }));
  put(
    head({ n: '02', title: B.projects, deck: B.projDeck, count: tech ? `${tech} · ${B.projCountOne(list.length)}` : B.projCount(all.length, Math.min(...ys), Math.max(...ys)) }),
    el('nav', { class: 'chips', 'aria-label': B.techLabel }, el('ul', {},
      el('li', {}, el('a', { href: projectsUrl(), 'aria-current': tech ? null : 'page' }, el('span', { text: B.allTech }), el('sup', { text: all.length }))),
      ...Object.entries(techs).sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])).map(([x, n]) => el('li', {},
        el('a', { href: projectsUrl(x), 'aria-current': tech === x ? 'page' : null }, el('span', { text: x }), el('sup', { text: n })))))),
    el('aside', { class: 'legend' }, el('h3', { text: B.projLegendTitle }), el('p', { text: B.projLegend }), keys),
    projRows(list));
}

function projectPage() {
  const all = c.projects.slice().sort(byYear);
  const i = all.findIndex((p) => p.id === q.get('p'));
  if (i < 0) return notFound();
  const p = all[i];
  document.title = `${p.name} · ${B.projects} · ${c.name}`;
  const out = (href, label) => el('a', { href, target: '_blank', rel: 'noopener' }, el('span', { text: label }), el('span', { class: 'vh', text: ' ' + B.newTab }), el('span', { 'aria-hidden': 'true', text: ' ↗' }));
  const links = el('p', { class: 'author__links plinks' }, p.demo ? out(p.demo, B.demo) : null, p.repo ? out(p.repo, B.repo) : null);

  const lens = all.map((x) => x.body.join(' ').length), lo = Math.min(...lens), hi = Math.max(...lens);
  const len = (p.body.join(' ').length - lo) / (hi - lo || 1);
  const cover = el('canvas', { 'aria-hidden': 'true' });
  screen(cover, () => ({ rows: Math.round((innerWidth < 1024 ? 14 : 18) + len * 12), size: innerWidth < 1024 ? 24 : 32, ...projectDots(p), corner: 1 }), projectTone(p));

  const prev = all[i - 1], next = all[i + 1];
  const pn = el('nav', { class: 'post__nav', 'aria-label': B.projects },
    prev ? el('a', { href: projectUrl(prev), rel: 'prev' }, el('span', { class: 'post__dir', text: '← ' + B.prev }), el('span', { class: 'post__to', text: prev.name })) : el('span'),
    next ? el('a', { href: projectUrl(next), rel: 'next' }, el('span', { class: 'post__dir', text: B.next + ' →' }), el('span', { class: 'post__to', text: next.name })) : el('span'));
  const shared = (o) => o.tech.filter((x) => p.tech.includes(x)).length;
  const related = all.filter((o) => o !== p && shared(o) > 0).sort((x, y) => shared(y) - shared(x) || byYear(x, y)).slice(0, 3);

  put(el('article', { class: 'post project' },
    el('header', { class: 'post__head' },
      el('p', { class: 'crumbs' }, el('a', { href: projectsUrl(), text: B.projects }), el('span', { 'aria-hidden': 'true', text: ' / ' }), el('span', { text: p.year })),
      el('h1', { class: 'post__title', text: p.name }),
      el('p', { class: 'post__deck', text: p.kicker }),
      el('dl', { class: 'post__meta' },
        el('div', {}, el('dt', { text: B.year }), el('dd', { text: p.year })),
        el('div', {}, el('dt', { text: B.techLabel }), el('dd', { class: 'ptech' }, ...p.tech.flatMap((x, k) => [k ? ' · ' : null, el('a', { href: projectsUrl(x), text: x })]).filter(Boolean)))),
      links),
    el('div', { class: 'post__cover' }, cover, glossEl(p)),
    el('div', { class: 'post__grid' }, el('aside', { class: 'post__side' }),
      el('div', { class: 'post__main' }, el('div', { class: 'prose' }, ...p.body.map((x, k) => el('p', { class: k === 0 ? 'prose__lead' : null, text: x }))),
        el('figure', { class: 'post__shot' }, projectPicture(p, B.shot(p.name))))),
    pn,
    related.length ? el('section', { class: 'related', 'aria-labelledby': 'rel-title' },
      el('h2', { id: 'rel-title', class: 'related__title', text: B.moreProjects }), projRows(related, { group: false })) : null));
}

// the cookie policy: its texts in shared/cookies-policy.js; a summary at a
// glance, the visitor's current choice (kept up to date) and plain sections
function cookiesPage() {
  document.title = `${P.title} · ${c.name}`;
  const now = () => {
    const status = el('p');
    const say = () => {
      const s = getConsent('luz-consent');
      status.textContent = !s ? P.now.none : s.granted.includes('youtube') ? P.now.yes : P.now.no;
    };
    say();
    document.addEventListener('luz:consent', say);
    const change = el('button', { type: 'button', class: 'consent__btn', text: P.now.change });
    change.addEventListener('click', () => document.querySelector('.foot__consent')?.click());
    return el('section', { class: 'now', 'aria-labelledby': 'now-title' },
      el('h2', { class: 'now__title', id: 'now-title', text: P.now.title }),
      el('div', { 'aria-live': 'polite' }, status), change);
  };
  const block = (x) => {
    if (x.h) return el('h2', { text: x.h });
    if (x.p) return html('p', {}, x.p.replace('{contact}', homeUrl('#contacto')));
    if (x.ul) return el('ul', {}, ...x.ul.map((li) => html('li', {}, li)));
    if (x.glance) return el('dl', { class: 'glance' }, ...x.glance.map(([k, v]) => el('div', {}, el('dt', { text: k }), el('dd', { text: v }))));
    if (x.now) return now();
    return null;
  };
  put(
    head({ crumbs: [[B.nfHome, homeUrl()]], title: P.title, deck: P.deck, count: `${P.updated} ${date(UPDATED)} · ${P.read}` }),
    el('div', { class: 'prose legal' }, ...P.blocks.map(block)));
}

// the credits: its texts in shared/credits.js; the credited featured images
// come from blog.json, one line per article
function creditsPage() {
  document.title = `${CR.title} · ${c.name}`;
  const block = (x) => {
    if (x.h) return el('h2', { id: slug(x.h) || null, text: x.h });
    if (x.p) return html('p', {}, x.p);
    if (x.ul) return el('ul', {}, ...x.ul.map((li) => html('li', {}, li)));
    if (x.covers) return el('ul', {}, ...b.posts.filter((p) => p.cover && p.cover.credit).map((p) =>
      el('li', {}, el('a', { href: postUrl(p), text: p.title, lang: p.postLang !== lang ? p.postLang : null }), ' · ', html('span', {}, p.cover.credit))));
    return null;
  };
  put(
    head({ crumbs: [[B.nfHome, homeUrl()]], title: CR.title, deck: CR.deck, count: `${CR.updated} ${date(CR_UPDATED)}` }),
    el('div', { class: 'prose legal' }, ...CR.blocks.map(block)));
}

({ list: listPage, post: postPage, category: categoryPage, tag: tagPage, projects: projectsPage, project: projectPage, cookies: cookiesPage, creditos: creditsPage }[page] || notFound)();

// ------------------------------------------------------------- go
await document.fonts.ready;
build();
screens.forEach((s) => io.observe(s.cv));
const tio = new IntersectionObserver((es) => es.forEach((e) => {
  const t = titles.find((x) => x.cv === e.target);
  if (e.isIntersecting) { if (!t.f) t.f = new HeroField(t.cv, t.text, { reduce, plain: 13 }); t.f.start(); }
  else if (t.f) t.f.stop();
}));
titles.forEach((t) => tio.observe(t.cv));
later.forEach((f) => f());
let rw = innerWidth;
addEventListener('resize', () => {
  clearTimeout(build.tm);
  build.tm = setTimeout(() => { if (innerWidth === rw) return; rw = innerWidth; build(); titles.forEach((t) => t.f && t.f.layout()); }, 180);
});
