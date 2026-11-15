// Trama · the blog pages. One module, four templates picked by <body data-page>:
//   list      /blog/?p=2                  every post, newest first, paginated
//   post      /blog/articulo/?a=<id>      one post
//   category  /blog/categoria/[?c=<id>]   all categories, or the posts of one
//   tag       /blog/etiqueta/[?t=<id>]    all tags, or the posts of one
// Unknown ids render a "not found" page (the 404 of the sandbox).
import { content, blog, lang } from '../../shared/content.js';
import { DotBlock, HeroField, clamp, easeOut } from '../dots.js';
import { B, url, blogUrl, postUrl, catUrl, tagUrl, homeUrl, date, pad, el, row, postDots } from './parts.js';

const PER_PAGE = 5;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search);
const page = document.body.dataset.page;

const [c, b] = await Promise.all([content(), blog()]);
const H = {
  es: { skip: 'Saltar al contenido', back: 'Trama', bio: 'Bio', work: 'Proyectos', other: 'English', sections: 'Secciones', footer: 'Maqueta 01 · Trama · Blog' },
  en: { skip: 'Skip to content', back: 'Trama', bio: 'Bio', work: 'Projects', other: 'Español', sections: 'Sections', footer: 'Mock-up 01 · Trama · Blog' }
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
    el('a', { class: 'top__mark', href: homeUrl() }, el('span', { 'aria-hidden': 'true', text: '01' }), el('span', { text: 'Trama' })),
    el('a', { class: 'top__lang', href: other.pathname + other.search, hreflang: lang === 'en' ? 'es' : 'en', lang: lang === 'en' ? 'es' : 'en', text: H.other })),
  el('nav', { class: 'nav', id: 'nav', 'aria-label': H.sections }, el('ol', {},
    navItem('01', homeUrl('#bio'), H.bio), navItem('02', homeUrl('#trabajo'), H.work),
    navItem('03', blogUrl(), B.blog, true), navItem('04', homeUrl('#contacto'), c.contactTitle))),
  main,
  el('footer', { class: 'foot' },
    el('p', {}, `${c.name} · ${new Date().getFullYear()}`),
    el('p', {}, el('a', { href: '/maqueta/', text: lang === 'en' ? 'All versions' : 'Todas las versiones' }), ` · ${H.footer} · ${B.sample}`)));

// ------------------------------------------------------------- dots
// every screen assembles once when it comes into view; the pointer pushes it
const cellSize = () => (innerWidth < 768 ? 7 : innerWidth < 1024 ? 8 : 9);
const screens = [];
function screen(cv, opts) { const s = { cv, opts, block: null }; screens.push(s); return s; }
function build() {
  const cell = cellSize();
  for (const s of screens) {
    const p = s.block ? s.block.p : reduce ? 1 : 0;
    s.block = new DotBlock(s.cv, { cell, ...(typeof s.opts === 'function' ? s.opts(cell) : s.opts) });
    s.block.draw(p, true);
  }
}
function assemble(s) {
  if (reduce) return s.block.draw(1, true);
  const t0 = performance.now(), from = s.block.p;
  const step = (now) => {
    const k = clamp((now - t0) / 1300);
    s.block.draw(from + (1 - from) * easeOut(k));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
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
    screen(r.cv, { rows: 9, ...r.dots, label: '' });
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
  screen(cv, (cell) => ({ rows: innerWidth < 1024 ? 22 : 30, ...postDots(p, b.posts, cat.kind), corner: 1 }));
  return el('article', { class: 'feat' },
    el('div', { class: 'feat__dots' }, cv),
    el('div', { class: 'feat__text' },
      el('p', { class: 'feat__kicker' }, el('span', { text: B.latest }), ' · ', el('a', { href: catUrl(cat.id), text: cat.name })),
      el('h2', { class: 'feat__title' }, el('a', { href: postUrl(p), text: p.title })),
      el('p', { class: 'feat__excerpt', text: p.excerpt }),
      el('p', { class: 'feat__meta' }, el('time', { datetime: p.date, text: date(p.date) }), ' · ', B.min(p.minutes))));
}

function notFound() {
  document.title = `${B.nf} · Blog · ${c.name}`;
  put(head({ title: '404', deck: B.nfText }), el('p', { class: 'back' }, el('a', { href: blogUrl(), text: '← ' + B.back })));
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

function postPage() {
  const i = b.posts.findIndex((p) => p.id === q.get('a'));
  if (i < 0) return notFound();
  const p = b.posts[i], cat = b.categories[p.category];
  document.title = `${p.title} · ${c.name}`;
  document.documentElement.classList.add('reading');

  // body
  const toc = [];
  const body = el('div', { class: 'prose' }, ...p.body.map((x, k) => {
    if (typeof x === 'string') return el('p', { class: k === 0 ? 'prose__lead' : null, text: x });
    if (x.h) { const id = slug(x.h); toc.push([id, x.h]); return el('h2', { id }, el('span', { text: x.h }), el('a', { class: 'prose__anchor', href: '#' + id, 'aria-hidden': 'true', tabindex: '-1', text: '#' })); }
    if (x.code) return el('pre', { class: 'prose__code', 'data-lang': x.lang }, el('code', { text: x.code }));
    if (x.quote) return el('blockquote', {}, el('p', { text: x.quote }));
    if (x.ul) return el('ul', {}, ...x.ul.map((li) => el('li', { text: li })));
    return null;
  }));

  // share
  const share = el('div', { class: 'share' }, el('p', { class: 'share__label', text: B.share }));
  const copy = el('button', { type: 'button', class: 'share__btn' }, el('span', { text: B.copy }));
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); } catch { /* the sandbox may be on plain http */ }
    copy.firstChild.textContent = B.copied;
    setTimeout(() => { copy.firstChild.textContent = B.copy; }, 1800);
  });
  share.append(copy);
  if (navigator.share) {
    const sys = el('button', { type: 'button', class: 'share__btn', text: B.share + ' ↗' });
    sys.addEventListener('click', () => navigator.share({ title: p.title, url: location.href }).catch(() => {}));
    share.append(sys);
  }

  const aside = el('aside', { class: 'post__side' },
    toc.length > 1 ? el('details', { class: 'toc', open: innerWidth >= 1024 ? '' : null },
      el('summary', { text: B.toc }),
      el('ol', {}, ...toc.map(([id, text], k) => el('li', {}, el('a', { href: '#' + id }, el('span', { class: 'toc__n', 'aria-hidden': 'true', text: pad(k + 1) }), el('span', { text })))))) : null,
    share);

  // cover
  const cover = el('canvas', { 'aria-hidden': 'true' });
  screen(cover, () => ({ rows: innerWidth < 768 ? 18 : innerWidth < 1024 ? 22 : 26, ...postDots(p, b.posts, cat.kind), corner: 1 }));

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
      el('h1', { class: 'post__title', text: p.title }),
      el('p', { class: 'post__deck', text: p.excerpt }),
      el('dl', { class: 'post__meta' },
        el('div', {}, el('dt', { text: B.published }), el('dd', {}, el('time', { datetime: p.date, text: date(p.date) }))),
        el('div', {}, el('dt', { text: B.reading }), el('dd', { text: B.min(p.minutes) })),
        el('div', {}, el('dt', { text: B.number }), el('dd', { class: 'post__n', text: pad(p.n) })))),
    el('div', { class: 'post__cover' }, cover),
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

({ list: listPage, post: postPage, category: categoryPage, tag: tagPage }[page] || notFound)();

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
let rw = innerWidth;
addEventListener('resize', () => {
  clearTimeout(build.tm);
  build.tm = setTimeout(() => { if (innerWidth === rw) return; rw = innerWidth; build(); titles.forEach((t) => t.f && t.f.layout()); }, 180);
});
