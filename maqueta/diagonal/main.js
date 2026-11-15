import { content } from '../shared/content.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const SQ2 = Math.SQRT2;

const T = {
  es: {
    skip: 'Saltar a las obras', top: 'Volver arriba', about: 'Sobre mí', works: 'Obras',
    worksNote: 'Cada barra es un proyecto. Ábrela y se pone recta.',
    tech: 'Técnica', demo: 'Ver demo', repo: 'Ver código', close: 'Cerrar',
    prev: 'Anterior', next: 'Siguiente', projectsNav: 'Proyectos', of: 'de',
    colophon: 'Maqueta 03 · Diagonal — barras a 45°, Blaze sobre Soft Oat.',
    other: 'EN', otherHref: '?lang=en', otherLang: 'en'
  },
  en: {
    skip: 'Skip to the works', top: 'Back to top', about: 'About', works: 'Works',
    worksNote: 'Every bar is a project. Open one and it straightens out.',
    tech: 'Built with', demo: 'Live demo', repo: 'Source code', close: 'Close',
    prev: 'Previous', next: 'Next', projectsNav: 'Projects', of: 'of',
    colophon: 'Layout 03 · Diagonal — bars at 45°, Blaze on Soft Oat.',
    other: 'ES', otherHref: './', otherLang: 'es'
  }
};

/* deterministic randomness, so the weave is the same on every visit */
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const pad2 = (n) => String(n).padStart(2, '0');
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

const c = await content();
const t = T[c.lang];
root.lang = c.lang;
document.title = `Diagonal · ${c.name}`;

/* ---------- static texts ---------- */
$$('[data-t]').forEach((n) => { if (t[n.dataset.t]) n.textContent = t[n.dataset.t]; });
$$('[data-t-aria]').forEach((n) => n.setAttribute('aria-label', t[n.dataset.tAria]));
const lang = $('.lang');
lang.textContent = t.other; lang.href = t.otherHref; lang.hreflang = t.otherLang; lang.lang = t.otherLang;
const slot = (k, v) => $$(`[data-slot="${k}"]`).forEach((n) => { n.textContent = v; });
slot('name', c.name); slot('nick', c.nick); slot('kicker', c.kicker); slot('kickerFoot', c.kicker);
slot('deck', c.deck); slot('contactTitle', c.contactTitle); slot('contactText', c.contactText);
slot('count', pad2(c.projects.length));

const bio = $('[data-slot="bio"]');
c.bio.forEach((p, i) => bio.append(el('p', i === 0 ? 'lead' : '', p)));

/* the deck, set as a little cover of bands */
const deck = $('.deck');
const dl = deckLines(c.deck);
deck.style.setProperty('--n', dl.length);
dl.forEach((line, i) => {
  const b = el('span', 'deck-band');
  b.style.setProperty('--i', i);
  b.append(el('span', '', line));
  deck.append(b);
});
function deckLines(s) {
  const w = s.toUpperCase().split(/\s+/);
  const lim = Math.ceil(s.length / 3) + 1;
  const out = []; let cur = '';
  for (const x of w) {
    if (cur && (cur + ' ' + x).length > lim) { out.push(cur); cur = x; } else cur = cur ? cur + ' ' + x : x;
  }
  if (cur) out.push(cur);
  return out;
}

/* ---------- projects: one bar each ---------- */
const stack = $('[data-slot="projects"]');
const R = rng(7);
c.projects.forEach((p, i) => {
  const li = el('li', 'item');
  li.id = `p-${p.id}`;
  li.style.setProperty('--i', i);
  li.style.setProperty('--dir', i % 2 ? 1 : -1);
  li.style.setProperty('--off', (R() * 2 - 1).toFixed(3));
  li.style.setProperty('--k', ((R() * 0.7 + 0.3) * (i % 2 ? 1 : -1)).toFixed(3));
  const a = el('a', 'pbar');
  a.href = `#obra/${p.id}`;
  a.dataset.id = p.id;
  const label = el('span', 'pl');
  label.append(el('span', 'pno', pad2(i + 1)), el('span', 'pn', p.name), el('span', 'py', p.year));
  a.append(label, el('span', 'pk', p.kicker));
  li.append(a);
  stack.append(li);
});

/* ---------- socials, inverse bars ---------- */
const socials = $('[data-slot="socials"]');
c.socials.forEach((s, i) => {
  const li = el('li', 'item');
  li.style.setProperty('--i', i);
  li.style.setProperty('--dir', i % 2 ? 1 : -1);
  const a = el('a', 'sbar');
  a.href = s.url; a.rel = 'me noopener'; a.target = '_blank';
  a.append(el('span', 'sl', s.label), el('span', 'sh', s.handle), el('span', 'sa', '↗'));
  li.append(a);
  socials.append(li);
});

/* ---------- the hero weave ---------- */
const hero = $('.hero');
const weave = $('.weave');
const plane = $('.plane');
const meter = el('span', 'meter');
document.body.append(meter);

function measure(text, cls) {
  meter.className = `meter ${cls}`;
  meter.textContent = text;
  return meter.getBoundingClientRect().width / 100; // width per px of font-size
}

function buildWeave() {
  const W = weave.clientWidth, H = weave.clientHeight;
  const wide = innerWidth >= 1024, mid = innerWidth >= 768;
  const tB = wide ? 54 : mid ? 42 : 31;           // bar thickness
  const g = wide ? 13 : mid ? 10 : 8;              // gap (the white line between bars)
  const cell = 2 * (tB + g);
  const n = Math.ceil(Math.hypot(W, H) / cell) + 2;
  const D = n * cell;
  plane.replaceChildren();
  plane.style.width = plane.style.height = `${D}px`;
  plane.style.setProperty('--D', `${D}px`);
  plane.style.setProperty('--amp', `${(cell * 0.3) | 0}px`);

  /* name: two lines of condensed caps, fitted to the diagonal */
  const [first, ...rest] = c.name.toUpperCase().split(' ');
  const lines = [first, rest.join(' ')];
  const per = Math.max(...lines.map((l) => measure(l, 'm-name')));
  const diag = Math.min(W, H) * SQ2;
  let F = (diag * (wide ? 0.6 : 0.6)) / per;
  F = Math.min(F, cell * (wide ? 2.6 : 2.3));
  const lh = F * 0.93;
  const snapUp = (v) => Math.ceil(v / cell);
  const aw = snapUp(per * F + F * 0.25), ah = snapUp(lh * 2 + F * 0.12);
  const mid0 = Math.floor(n / 2);
    const A = { x: mid0 - Math.floor(aw / 2), y: mid0 - Math.floor(ah / 2), w: aw, h: ah };

  /* perpendicular band: the nick, like the author on the cover */
  const nick = c.nick.toUpperCase();
  const bw = 1;
  const FB = cell * 0.68;
  const blen = measure(nick, 'm-name') * FB;
  const B = { x: A.x + (mid ? Math.round(A.w * 0.55) : 0), y: A.y + A.h, w: bw, h: snapUp(blen + FB * 0.3) };

  /* kicker band, above the name */
  const FK = cell * 0.3;
  const klen = measure(c.kicker.toUpperCase(), 'm-kick') * FK;
  const K = { x: A.x, y: A.y - 1, w: snapUp(klen + FK), h: 1 };

  const bands = [A, B, K];
  const hits = (i, j) => bands.some((b) => i >= b.x && i < b.x + b.w && j >= b.y && j < b.y + b.h);

  /* orientation of every free cell; runs merge into longer bars */
  const r = rng(1971);
  const ori = [];
  for (let j = 0; j < n; j++) {
    ori[j] = [];
    for (let i = 0; i < n; i++) ori[j][i] = hits(i, j) ? 0 : (r() < 0.5 ? 1 : 2);
  }
  const frag = document.createDocumentFragment();
  const cx = D / 2, cy = D / 2;
  const addBar = (x, y, w, h, dirH) => {
    const b = el('i', `b ${dirH ? 'h' : 'v'}`);
    b.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    const k = (r() * 0.8 + 0.2) * (r() < 0.5 ? -1 : 1);
    const dist = Math.hypot(x + w / 2 - cx, y + h / 2 - cy) / (D / 2);
    b.style.setProperty('--k', k.toFixed(3));
    b.style.setProperty('--d', `${(dist * 700 + r() * 260) | 0}ms`);
    b.style.setProperty('--from', `${(Math.sign(k) * D * 0.75) | 0}px`);
    b.style.setProperty('--sx', (r() * 400) | 0);
    frag.append(b);
  };
  const runs = (get, len, emit) => {
    for (let a = 0; a < n; a++) {
      let s = 0;
      while (s < n) {
        if (!get(a, s)) { s++; continue; }
        let e = s; while (e < n && get(a, e)) e++;
        let p = s;
        while (p < e) {
          const L = Math.min(e - p, 1 + ((r() * 3) | 0));
          emit(a, p, L);
          p += L;
        }
        s = e;
      }
    }
  };
  // horizontal (in the plane) bars: two per cell row
  runs((j, i) => ori[j][i] === 1, n, (j, i, L) => {
    for (let k = 0; k < 2; k++) addBar(i * cell + g / 2, j * cell + g / 2 + k * (tB + g), L * cell - g, tB, true);
  });
  runs((i, j) => ori[j][i] === 2, n, (i, j, L) => {
    for (let k = 0; k < 2; k++) addBar(i * cell + g / 2 + k * (tB + g), j * cell + g / 2, tB, L * cell - g, false);
  });
  plane.append(frag);

  /* the bands with type */
  const band = (R0, cls, html) => {
    const d = el('div', `band ${cls}`);
    d.style.cssText = `left:${R0.x * cell}px;top:${R0.y * cell}px;width:${R0.w * cell}px;height:${R0.h * cell}px`;
    d.append(...html);
    plane.append(d);
    return d;
  };
  const nameBand = band(A, 'b-name', lines.map((l, i) => {
    const s = el('span', 'nl', l); s.style.setProperty('--i', i); return s;
  }));
  nameBand.style.setProperty('--F', `${F}px`);
  nameBand.style.setProperty('--lh', `${lh}px`);
  const nb = band(B, 'b-nick', [el('span', 'nk', nick)]);
  nb.style.setProperty('--F', `${FB}px`);
  const kb = band(K, 'b-kick', [el('span', 'kk', c.kicker.toUpperCase())]);
  kb.style.setProperty('--F', `${FK}px`);

  hero.classList.remove('woven');
  void hero.offsetWidth;
  hero.classList.add('woven');
}

let lastW = 0;
function maybeRebuild() {
  if (Math.abs(innerWidth - lastW) < 2) return;
  lastW = innerWidth;
  buildWeave();
}
await document.fonts.load('900 100px Archivo').catch(() => {});
await document.fonts.ready;
maybeRebuild();
let rz;
addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(maybeRebuild, 180); });

/* ---------- motion: scroll and pointer ---------- */
const sash = $('.sash');
let heroH = hero.offsetHeight;
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    heroH = hero.offsetHeight;
    const out = Math.min(1, Math.max(0, scrollY / heroH));
    hero.style.setProperty('--out', out.toFixed(4));
    root.classList.toggle('past-hero', scrollY > heroH * 0.55);
    root.style.setProperty('--sy', scrollY.toFixed(0));
  });
}
if (!reduce.matches) {
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
} else {
  addEventListener('scroll', () => root.classList.toggle('past-hero', scrollY > hero.offsetHeight * 0.55), { passive: true });
}

/* pointer: bars shift along their own axis, the plane tilts in depth */
if (fine.matches && !reduce.matches) {
  let px = 0, py = 0, tx = 0, ty = 0, raf = 0;
  const loop = () => {
    px += (tx - px) * 0.08; py += (ty - py) * 0.08;
    root.style.setProperty('--px', px.toFixed(4));
    root.style.setProperty('--py', py.toFixed(4));
    raf = Math.abs(tx - px) + Math.abs(ty - py) > 0.0005 ? requestAnimationFrame(loop) : 0;
  };
  addEventListener('pointermove', (e) => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = (e.clientY / innerHeight) * 2 - 1;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
}

/* fallback for browsers without scroll-driven animations */
if (!CSS.supports('animation-timeline: view()')) {
  root.classList.add('no-sda');
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -12% 0px' });
  $$('.item, .deck-band, .lone, .tag, .bio p, .cross').forEach((n) => io.observe(n));
}

/* ---------- the project sheet ---------- */
const sheet = $('.sheet');
const S = (k) => $(`[data-sheet="${k}"]`, sheet);
let openId = null;
let lastBar = null;

function fillSheet(id) {
  const i = c.projects.findIndex((p) => p.id === id);
  const p = c.projects[i];
  S('no').textContent = `${pad2(i + 1)} / ${pad2(c.projects.length)}`;
  S('name').textContent = p.name;
  S('year').textContent = p.year;
  S('kicker').textContent = p.kicker;
  const tech = S('tech'); tech.replaceChildren(...p.tech.map((x) => el('li', '', x)));
  const body = S('body'); body.replaceChildren(...p.body.map((x, k) => el('p', k === 0 ? 'lead' : '', x)));
  const links = S('links'); links.replaceChildren();
  for (const [k, url] of [['demo', p.demo], ['repo', p.repo]]) {
    if (!url) continue;
    const a = el('a', `lk lk-${k}`);
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    a.append(el('span', '', t[k]), el('i', '', '↗'));
    links.append(a);
  }
  const prev = c.projects[(i - 1 + c.projects.length) % c.projects.length];
  const next = c.projects[(i + 1) % c.projects.length];
  const pn = S('prev'), nn = S('next');
  pn.href = `#obra/${prev.id}`; pn.replaceChildren(el('small', '', t.prev), el('span', '', prev.name));
  nn.href = `#obra/${next.id}`; nn.replaceChildren(el('small', '', t.next), el('span', '', next.name));
  $('.sheet-close', sheet).href = `#p-${id}`;
  // lattice fragment, a different slice per project
  const lat = $('.sheet-lattice', sheet); lat.replaceChildren();
  const r = rng(i * 97 + 3);
  for (let k = 0; k < 9; k++) {
    const b = el('i');
    b.style.setProperty('--k', k);
    b.style.setProperty('--len', (40 + r() * 60).toFixed(0));
    b.style.setProperty('--o', (r() * 40).toFixed(0));
    lat.append(b);
  }
  return p;
}

function transition(update, kind) {
  if (!document.startViewTransition || reduce.matches) { update(); return Promise.resolve(); }
  root.dataset.vt = kind;
  const vt = document.startViewTransition(update);
  vt.finished.finally(() => { delete root.dataset.vt; });
  return vt.finished;
}

function route() {
  const m = location.hash.match(/^#obra\/(.+)$/);
  const id = m && c.projects.some((p) => p.id === m[1]) ? m[1] : null;
  if (id === openId) return;
  const bar = id ? $(`.pbar[data-id="${CSS.escape(id)}"]`) : null;

  if (id && !openId) {
    // a bar swings to horizontal and becomes the page header
    lastBar = bar;
    if (bar) bar.style.viewTransitionName = 'bar';
    transition(() => {
      if (bar) bar.style.viewTransitionName = '';
      fillSheet(id);
      sheet.hidden = false;
      root.classList.add('sheet-open');
      sheet.querySelector('.sheet-scroll').scrollTop = 0;
    }, 'open').then(() => S('name').focus({ preventScroll: true }));
    if (!document.startViewTransition || reduce.matches) S('name').focus({ preventScroll: true });
  } else if (id && openId) {
    transition(() => { fillSheet(id); sheet.querySelector('.sheet-scroll').scrollTop = 0; }, 'swap')
      .then(() => S('name').focus({ preventScroll: true }));
    lastBar = bar;
  } else {
    const back = lastBar || $(`.pbar[data-id="${CSS.escape(openId)}"]`);
    transition(() => {
      sheet.hidden = true;
      root.classList.remove('sheet-open');
      if (back) {
        back.closest('.item').scrollIntoView({ block: 'center' });
        back.style.viewTransitionName = 'bar';
      }
    }, 'close').then(() => { if (back) { back.style.viewTransitionName = ''; back.focus({ preventScroll: true }); } });
    if (!document.startViewTransition || reduce.matches) back?.focus({ preventScroll: true });
  }
  openId = id;
}
addEventListener('hashchange', route);
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && openId) { e.preventDefault(); location.hash = `p-${openId}`; }
});
// keep focus inside the sheet while it is open
sheet.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const f = $$('a[href], button, [tabindex="0"]', sheet).filter((n) => n.offsetParent || n === document.activeElement);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
// the hero cue
$('.cue').textContent = `↓ ${t.works} · ${pad2(c.projects.length)}`;
route();
root.classList.add('ready');
