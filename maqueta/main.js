import { content, blog } from './shared/content.js';
import { B, row, coverLoop, blogUrl, projectsUrl, projectUrl, footer } from './blog/parts.js';
import { themeSwitch, onMode } from './shared/theme.js';
import { RainField } from './rain.js';
import { DotBlock, HeroField, fieldPoints, drawPoints, fly, hash, clamp, loadTone } from './dots.js';
import { consent } from './shared/consent.js';

const T = {
  es: {
    skip: 'Saltar al contenido', bio: 'Bio', work: 'Proyectos',
    hintFine: 'haz clic para escanear', hintCoarse: 'toca para escanear',
    legendTitle: 'Cómo leer los bloques',
    legend: 'Cada bloque es un proyecto. Cuanto más reciente, más denso; cuanto más largo su texto, más alto. Su número va calado en la trama, y sus puntos dibujan el proyecto.',
    count: (n, a, b) => `${n} proyectos · ${a}–${b}`, open: 'Abrir', close: 'Cerrar', shot: (n) => `Captura de ${n}`,
    demo: 'Ver demo', repo: 'Ver código', prev: 'Anterior', next: 'Siguiente',
    blog: 'Blog', allPosts: 'Todos los artículos',
    of: 'de', sections: 'Secciones', projects: 'Proyectos', other: 'Español', newTab: '(se abre en otra pestaña)'
  },
  en: {
    skip: 'Skip to content', bio: 'Bio', work: 'Projects',
    hintFine: 'click to scan', hintCoarse: 'tap to scan',
    legendTitle: 'How to read the blocks',
    legend: 'Each block is a project. The newer, the denser; the longer its text, the taller. Its number is cut into the dots, and its dots draw the project.',
    count: (n, a, b) => `${n} projects · ${a}–${b}`, open: 'Open', close: 'Close', shot: (n) => `Screenshot of ${n}`,
    demo: 'See demo', repo: 'See code', prev: 'Previous', next: 'Next',
    blog: 'Blog', allPosts: 'All posts',
    of: 'of', sections: 'Sections', projects: 'Projects', other: 'English', newTab: '(opens in a new tab)'
  }
};
const FEATURED = ['luz', 'quien-canta-hoy', 'streetcai', 'ikay', 'toolbar-aem'];
const DENSITY = { 2023: 0.36, 2024: 0.52, 2025: 0.68, 2026: 0.86 };
const densityOf = (y) => DENSITY[y] ?? 0.6;

const mq = (q) => matchMedia(q);
const reduce = mq('(prefers-reduced-motion: reduce)').matches;
const fine = mq('(hover: hover) and (pointer: fine)').matches;
const sdaView = CSS.supports('animation-timeline: view()');
const sdaScroll = CSS.supports('animation-timeline: scroll()');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else if (k === 'style') n.style.cssText = v; else n.setAttribute(k, v);
  }
  n.append(...kids.filter(Boolean));
  return n;
};
const pad = (n) => String(n).padStart(2, '0');
const cellSize = () => (innerWidth < 768 ? 7 : innerWidth < 1024 ? 8 : 9);

const [c, bl] = await Promise.all([content(), blog()]);
const t = T[c.lang];
// the home shows four projects; the rest live on /proyectos/
const allProjects = c.projects;
c.projects = FEATURED.map((id) => allProjects.find((p) => p.id === id)).filter(Boolean);
document.documentElement.lang = c.lang;
document.documentElement.classList.add('js', reduce ? 'still' : 'moving');
if (!sdaView) document.documentElement.classList.add('no-sda');

// ------------------------------------------------------------- texts
$$('[data-t]').forEach((n) => { const v = t[n.dataset.t]; if (typeof v === 'string') n.textContent = v; });
$('#nav').setAttribute('aria-label', t.sections);
$('.panel__nav').setAttribute('aria-label', t.projects);
$$('[data-slot]').forEach((n) => { n.textContent = c[n.dataset.slot]; });
$('.hero__hint').textContent = fine ? t.hintFine : t.hintCoarse;
document.querySelector('main').after(footer(c));
consent();
themeSwitch();
// a new mode: the dots are redrawn in its colours (and, in light, read the pictures the other way round)
onMode(() => { hero.repaint(); titles.forEach((x) => x.f && x.f.repaint()); build(); if (panel.open) restField(); });
const lang = $('#lang');
if (c.lang === 'en') { lang.href = '?'; lang.hreflang = 'es'; lang.lang = 'es'; lang.textContent = T.es.other; }
else { lang.textContent = T.en.other; }
document.title = c.name;

// the bio's last words point to the blog and the projects
const BIO_LINKS = { es: [['mis artículos', '#blog'], ['mis proyectos', projectsUrl()]], en: [['my articles', '#blog'], ['my projects', projectsUrl()]] }[c.lang];
const linked = (text) => {
  const out = []; let rest = text;
  for (const [words, href] of BIO_LINKS) {
    const at = rest.lastIndexOf(words);
    if (at < 0) continue;
    out.push(rest.slice(0, at), el('a', { href, text: words })); rest = rest.slice(at + words.length);
  }
  return [...out, rest];
};
$('#bio-text').append(...c.bio.map((p, i) => el('p', { class: 'reveal' + (i === 0 ? ' bio__lead' : '') }, ...linked(p))));

const years = allProjects.map((p) => p.year);
$('#work-count').textContent = t.count(allProjects.length, Math.min(...years), Math.max(...years));
$('#work-all').href = projectsUrl();
$('#work-all [data-slot2]').textContent = B.allProjects;

// ------------------------------------------------------------- legend
const blocks = []; // { block, back?, stage, p }
const legend = $('#legend-keys');
for (const y of Object.keys(DENSITY)) {
  const cv = el('canvas', { 'aria-hidden': 'true' });
  legend.append(el('li', {}, cv, el('span', { text: y })));
}

// ------------------------------------------------------------- projects
const works = $('#works');
// each project's screenshot, read as tone: its front block draws the picture
// in dots (the year still sets how many). Without it, the pattern from its id.
const SHOTS = new URL('./img/proyectos/', import.meta.url);
const tones = {};
const shot = (p) => el('picture', {},
  el('source', { srcset: new URL(`${p.id}.avif`, SHOTS), type: 'image/avif' }),
  el('source', { srcset: new URL(`${p.id}.webp`, SHOTS), type: 'image/webp' }),
  el('img', { src: new URL(`${p.id}.jpg`, SHOTS), alt: t.shot(p.name), width: 1200, height: 750, loading: 'lazy', decoding: 'async' }));
const lens = c.projects.map((p) => p.body.join(' ').length);
const minL = Math.min(...lens), maxL = Math.max(...lens);
c.projects.forEach((p, i) => {
  const h = hash(p.id);
  const front = el('canvas', { class: 'front', 'aria-hidden': 'true' });
  const back = el('canvas', { class: 'back', 'aria-hidden': 'true' });
  const block = el('div', { class: 'item__block', 'data-i': i }, back, front);
  const stage = el('div', { class: 'item__stage' }, block);
  const openBtn = el('button', { class: 'item__open', type: 'button', 'aria-haspopup': 'dialog', 'data-i': i },
    el('span', { text: t.open }), el('span', { class: 'vh', text: ' ' + p.name }), el('span', { class: 'item__arrow', 'aria-hidden': 'true', text: '→' }));
  const text = el('div', { class: 'item__text' },
    el('p', { class: 'item__meta' }, el('span', { class: 'item__n', text: pad(p.n) }), el('span', { text: p.year })),
    el('h3', { class: 'item__name', text: p.name }),
    el('p', { class: 'item__kicker', text: p.kicker }),
    el('ul', { class: 'tech' }, ...p.tech.map((x) => el('li', { text: x }))),
    openBtn);
  const li = el('li', { class: 'item', style: `--k:${i};--w:${58 + (h % 43)}%;--depth:${(h >> 4) % 3}` }, stage, text);
  works.append(li);
  const len = (lens[i] - minL) / (maxL - minL || 1);
  const opts = (cell) => ({ cell, rows: Math.round((innerWidth < 1024 ? 9 : 11) + len * (innerWidth < 1024 ? 20 : 26)), density: densityOf(p.year), kind: h % 6, seed: h, label: pad(p.n), corner: i % 2 });
  const fb = { make: (cell) => new DotBlock(front, { ...opts(cell), tone: tones[p.id] }), stage, front, li, i };
  blocks.push(fb);
  blocks.push({ make: (cell) => new DotBlock(back, { ...opts(cell), density: densityOf(p.year) * 0.5, kind: (h >> 3) % 6, seed: h ^ 0xabc, label: '' }), stage, back: true });
  loadTone(new URL(`${p.id}.tone.webp`, SHOTS)).then((tn) => {
    if (!tn) return;
    tones[p.id] = tn;
    if (fb.block) { fb.block.o.tone = tn; fb.block.resize(); }
  });
});

// legend keys and decorative fields
$$('canvas', legend).forEach((cv, k) => {
  const y = Object.keys(DENSITY)[k];
  blocks.push({ make: () => new DotBlock(cv, { cell: 6, rows: 7, density: DENSITY[y], kind: 6, seed: 7 + k }), stage: cv, deco: true, fixed: true });
});
$$('.bio__cols canvas').forEach((cv, k) => {
  blocks.push({ make: (cell) => new DotBlock(cv, { cell, rows: [34, 24, 44][k], density: [1, 0.75, 0.95][k], kind: [1, 3, 2][k], seed: 101 + k }), stage: cv, deco: true });
});
blocks.push({ make: (cell) => new DotBlock($('#contact-field'), { cell, rows: innerWidth < 1024 ? 16 : 22, density: 0.8, kind: 0, seed: 404 }), stage: $('#contact-field'), deco: true });

let lastCell = 0;
function build() {
  const cell = cellSize();
  blocks.forEach((b) => {
    const p = b.block ? b.block.p : reduce ? 1 : 0;
    b.block = b.make(cell);
    b.block.draw(p, true);
  });
  lastCell = cell;
  tick();
}

// ------------------------------------------------------------- blog: the latest three
{
  const ys = bl.posts.map((p) => p.year);
  $('#blog-count').textContent = B.count(bl.posts.length, Math.min(...ys), Math.max(...ys));
  $('#blog-all').href = blogUrl();
  bl.posts.slice(0, 3).forEach((p, k) => {
    const r = row(p, bl);
    $('#blog-rows').append(r.li);
    const rb = { make: (cell) => new DotBlock(r.cv, { cell, rows: 9, ...r.dots, label: '', tone: tones['post:' + p.id] }), stage: r.cv, deco: true };
    blocks.push(rb);
    if (r.fig) { rb.looping = true; coverLoop(r.fig, () => rb.block, { offset: 1.3 * k, colour: false }); }
    if (r.tone) loadTone(r.tone).then((tn) => {
      if (!tn) return;
      tones['post:' + p.id] = tn;
      if (rb.block) { rb.block.o.tone = tn; rb.block.resize(); }
    });
  });
}

// ------------------------------------------------------------- socials
// no «Blog» among the networks: the blog is this site (data/site.json keeps it for the other versions)
$('#socials').append(...c.socials.filter((s) => s.id !== 'blog').map((s) => el('li', {},
  el('a', { href: s.url, rel: 'me noopener', target: '_blank' },
    el('span', { class: 'socials__label', text: s.label }),
    el('span', { class: 'socials__lead', 'aria-hidden': 'true' }),
    el('span', { class: 'socials__handle', text: s.handle }),
    el('span', { class: 'vh', text: ' ' + t.newTab })))));

// ------------------------------------------------------------- hero
// Matrix rain with a mask cut out of it, in turn the name, the poster's cats and the desk
// picture (rain.js); a click scans in a circle
const hero = new RainField($('#hero-field'), { mask: 'cycle', name: c.name });
const heroEl = $('.hero');
new IntersectionObserver(([e]) => (e.isIntersecting ? hero.start() : hero.stop())).observe(heroEl);
hero.cv.addEventListener('pointerdown', (e) => {
  const r = hero.cv.getBoundingClientRect();
  hero.poke(e.clientX - r.left, e.clientY - r.top);
});

// ------------------------------------------------------------- scroll
// each block assembles as it rises into view and dissolves as it leaves
const visible = new Set();
const io = new IntersectionObserver((es) => es.forEach((e) => {
  blocks.filter((x) => x.stage === e.target).forEach((x) => {
    if (e.isIntersecting) visible.add(x);
    else { visible.delete(x); if (x.block && !reduce && !x.fixed && !x.looping) x.block.draw(0); }
  });
  schedule();
}), { rootMargin: '15% 0px' });
let pending = false;
function tick() {
  pending = false;
  const vh = innerHeight;
  for (const b of visible) {
    if (!b.block || b.looping) continue;
    if (reduce || b.fixed) { b.block.draw(1); continue; }
    const r = b.stage.getBoundingClientRect();
    const enter = clamp((vh - r.top) / (vh * 0.55));
    const leave = clamp(r.bottom / (vh * 0.4));
    b.block.draw(Math.min(enter, leave));
  }
  if (!sdaScroll || reduce) document.documentElement.style.setProperty('--p', (scrollY / (document.documentElement.scrollHeight - vh)).toFixed(4));
}
const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(tick); } };
addEventListener('scroll', schedule, { passive: true });

let rw = innerWidth;
addEventListener('resize', () => {
  clearTimeout(build.tm);
  build.tm = setTimeout(() => {
    if (innerWidth === rw && cellSize() === lastCell) return;
    rw = innerWidth;
    hero.layout();
    relayoutTitles();
    build();
    if (panel.open) restField();
  }, 180);
});

// ------------------------------------------------------------- pointer on blocks
if (fine && !reduce) {
  works.addEventListener('pointermove', (e) => {
    const blk = e.target.closest('.item__block');
    $$('.item__block.is-hot', works).forEach((n) => n !== blk && cool(n));
    if (!blk) return;
    const i = +blk.dataset.i, r = blk.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    blk.classList.add('is-hot');
    blk.style.setProperty('--ry', `${((x / r.width) - 0.5) * 14}deg`);
    blk.style.setProperty('--rx', `${(0.5 - (y / r.height)) * 12}deg`);
    const b = blocks.find((q) => q.i === i && q.front);
    const fr = b.front.getBoundingClientRect();
    b.block.ptr = { x: (e.clientX - fr.left) * (b.block.w / fr.width), y: (e.clientY - fr.top) * (b.block.w / fr.width) };
    b.block.draw(b.block.p, true);
  });
  works.addEventListener('pointerleave', () => $$('.item__block.is-hot', works).forEach(cool));
}
function cool(n) {
  n.classList.remove('is-hot');
  n.style.removeProperty('--rx'); n.style.removeProperty('--ry');
  const b = blocks.find((q) => q.i === +n.dataset.i && q.front);
  if (b && b.block) { b.block.ptr = null; b.block.draw(b.block.p, true); }
}

// ------------------------------------------------------------- panel
const panel = $('#panel'), sheet = $('#panel-sheet'), pf = $('#panel-field');
let cur = -1, field = [], busy = false;
const regionOf = () => (innerWidth >= 1024
  ? { x: 0, y: 0, w: innerWidth * 0.42, h: innerHeight }
  : { x: 0, y: 0, w: innerWidth, h: Math.round(innerHeight * 0.34) });
const fieldFor = (i) => fieldPoints(innerWidth, innerHeight, {
  region: regionOf(), label: pad(c.projects[i].n), density: densityOf(c.projects[i].year) + 0.1,
  seed: hash(c.projects[i].id), cell: innerWidth >= 1024 ? 11 : 8, tone: tones[c.projects[i].id]
});
function restField() {
  field = fieldFor(cur);
  const ctx = pf.getContext('2d'), r = Math.min(devicePixelRatio || 1, 2);
  pf.width = innerWidth * r; pf.height = innerHeight * r;
  ctx.setTransform(r, 0, 0, r, 0, 0);
  drawPoints(ctx, innerWidth, innerHeight, field);
}
function fill(i) {
  const p = c.projects[i];
  cur = i;
  $('#p-meta').textContent = `${pad(p.n)} · ${p.year}`;
  $('#p-kicker').textContent = p.kicker;
  $('#p-title').textContent = p.name;
  $('#p-tech').replaceChildren(...p.tech.map((x) => el('li', { text: x })));
  $('#p-text').replaceChildren(...p.body.map((x) => el('p', { text: x })));
  $('#p-shot').replaceChildren(shot(p));
  const links = [];
  if (p.demo) links.push(el('a', { href: p.demo, target: '_blank', rel: 'noopener' }, el('span', { text: t.demo }), el('span', { class: 'vh', text: ' ' + t.newTab }), el('span', { 'aria-hidden': 'true', text: ' ↗' })));
  if (p.repo) links.push(el('a', { href: p.repo, target: '_blank', rel: 'noopener' }, el('span', { text: t.repo }), el('span', { class: 'vh', text: ' ' + t.newTab }), el('span', { 'aria-hidden': 'true', text: ' ↗' })));
  links.push(el('a', { href: projectUrl(p) }, el('span', { text: B.projPage }), el('span', { 'aria-hidden': 'true', text: ' →' })));
  $('#p-links').replaceChildren(...links);
  const n = c.projects.length, a = (i - 1 + n) % n, b = (i + 1) % n;
  $('#p-prev').replaceChildren(el('span', { class: 'panel__dir', text: '← ' + t.prev }), el('span', { class: 'panel__to', text: c.projects[a].name }));
  $('#p-next').replaceChildren(el('span', { class: 'panel__dir', text: t.next + ' →' }), el('span', { class: 'panel__to', text: c.projects[b].name }));
  $('#p-prev').dataset.i = a; $('#p-next').dataset.i = b;
  sheet.scrollTop = 0;
}
const frontOf = (i) => blocks.find((q) => q.i === i && q.front);

async function open(i) {
  if (busy) return;
  busy = true;
  fill(i);
  const src = frontOf(i).block.points();
  document.documentElement.classList.add('locked');
  panel.classList.add('is-forming');
  panel.showModal();
  requestAnimationFrame(() => panel.classList.add('is-on'));
  field = fieldFor(i);
  if (reduce) restField();
  else { await fly(pf, src, field, { dur: 1000 }); restField(); }
  panel.classList.remove('is-forming');
  busy = false;
}
async function close() {
  if (busy || !panel.open) return;
  busy = true;
  const item = frontOf(cur);
  item.li.scrollIntoView({ block: 'center', behavior: 'instant' });
  tick();
  panel.classList.add('is-forming');
  panel.classList.remove('is-on');
  if (!reduce) {
    await new Promise((r) => setTimeout(r, 180));
    const dst = item.block.points();
    await fly(pf, dst, field, { dur: 800, reverse: true });
  }
  panel.close();
  pf.getContext('2d').clearRect(0, 0, pf.width, pf.height);
  document.documentElement.classList.remove('locked');
  $('.item__open', item.li).focus({ preventScroll: true });
  busy = false;
}
async function go(i) {
  if (busy) return;
  busy = true;
  const from = field;
  panel.classList.add('is-forming');
  await new Promise((r) => setTimeout(r, reduce ? 0 : 200));
  fill(i);
  field = fieldFor(i);
  if (!reduce) await fly(pf, from, field, { dur: 750 });
  restField();
  panel.classList.remove('is-forming');
  $('#p-title').focus({ preventScroll: true });
  busy = false;
}

works.addEventListener('click', (e) => {
  const n = e.target.closest('.item__open, .item__block');
  if (n) open(+n.dataset.i);
});
$('#p-close').addEventListener('click', close);
panel.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
panel.addEventListener('click', (e) => { if (e.target === panel || e.target === pf) close(); });
$('#p-prev').addEventListener('click', (e) => go(+e.currentTarget.dataset.i));
$('#p-next').addEventListener('click', (e) => go(+e.currentTarget.dataset.i));
panel.addEventListener('keydown', (e) => {
  if (e.target.closest('a, button') && e.key === 'Enter') return;
  if (e.key === 'ArrowRight') go(+$('#p-next').dataset.i);
  if (e.key === 'ArrowLeft') go(+$('#p-prev').dataset.i);
});

// ------------------------------------------------------------- nav docks (View Transition)
const nav = $('#nav');
let docked = false;
new IntersectionObserver(([e]) => {
  const d = !e.isIntersecting;
  if (d === docked) return;
  docked = d;
  const flip = () => document.documentElement.classList.toggle('docked', d);
  if (document.startViewTransition && !reduce && !panel.open) document.startViewTransition(flip);
  else flip();
}, { rootMargin: '-35% 0px 0px 0px' }).observe($('.hero__copy'));
// mark the section in view
const secs = ['bio', 'trabajo', 'blog', 'contacto'].map((id) => document.getElementById(id));
const sectionIO = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  $$('a', nav).forEach((a) => (a.hash === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
}), { rootMargin: '-45% 0px -50% 0px' });
secs.forEach((s) => sectionIO.observe(s));

// ------------------------------------------------------------- titles resolve from noise into dots
const titles = [];
$$('.decode').forEach((h) => {
  const text = h.textContent;
  const cv = el('canvas', { class: 'title-dots', 'aria-hidden': 'true' });
  h.replaceChildren(el('span', { class: 'vh', text }), cv);
  const item = { h, cv, text, f: null };
  titles.push(item);
  cv.addEventListener('pointermove', (e) => { if (item.f) { const r = cv.getBoundingClientRect(); item.f.ptr = { x: e.clientX - r.left, y: e.clientY - r.top }; } });
  cv.addEventListener('pointerleave', () => { if (item.f) item.f.ptr = null; });
});
const titleIO = new IntersectionObserver((es) => es.forEach((e) => {
  const item = titles.find((x) => x.cv === e.target);
  if (e.isIntersecting && e.intersectionRatio > 0.4) {
    if (!item.f) item.f = new HeroField(item.cv, item.text, { reduce, plain: 13 });
    item.f.start();
  } else if (!e.isIntersecting && item.f) item.f.stop();
}), { threshold: [0, 0.5] });
const relayoutTitles = () => titles.forEach((x) => x.f && x.f.layout());

// ------------------------------------------------------------- reveal fallback
if (!sdaView && !reduce) {
  const rio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal, .item__text').forEach((n) => rio.observe(n));
}

// ------------------------------------------------------------- go
await document.fonts.ready;
build();
$$('.item__stage, .bio__cols canvas, #contact-field, #legend-keys canvas, .brow__dots').forEach((n) => io.observe(n));
hero.layout();
hero.start();
titles.forEach((x) => titleIO.observe(x.cv));
