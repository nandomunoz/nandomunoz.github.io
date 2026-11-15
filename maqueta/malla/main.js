// Malla — a sheet of graph paper that folds like cloth.
// The grid is drawn on a fixed canvas from a height field (noise + pointer +
// ripples + scroll), seen in perspective. Text sits in whole cells that are
// pinned flat; the sheet folds more the deeper you go and is ironed flat at
// the contact section. The letters of the name are printed on the cloth and
// ride its folds; the projects are cells that float on it and unfold into a
// page (View Transition).
import { content } from '../shared/content.js';

const T = {
  es: {
    skip: 'Saltar a las obras', nav: 'Secciones', who: 'Quién', works: 'Obras', contact: 'Contacto',
    demo: 'Ver demo', repo: 'Ver código', close: 'Cerrar', prev: 'Anterior', next: 'Siguiente',
    hintFine: 'Mueve el puntero: la malla cede. Haz clic en el papel para dejar caer una gota.',
    hintTouch: 'Toca el papel: la malla cede.',
    fold: 'Pliegue', other: 'English', otherHref: '?lang=en', otherLang: 'en',
    back: 'Maqueta', flat: 'Aquí la malla se plancha.', open: 'Abrir', of: 'de', year: 'Año',
    tech: 'Técnica', cell: 'Celda', where: 'Madrid', scroll: 'Baja', lifted: 'celdas levantadas',
    nameLabel: 'Fernando Muñoz'
  },
  en: {
    skip: 'Skip to the works', nav: 'Sections', who: 'Who', works: 'Works', contact: 'Contact',
    demo: 'Live demo', repo: 'Source code', close: 'Close', prev: 'Previous', next: 'Next',
    hintFine: 'Move the pointer: the mesh gives way. Click the paper to drop a drop.',
    hintTouch: 'Touch the paper: the mesh gives way.',
    fold: 'Fold', other: 'Español', otherHref: '?', otherLang: 'es',
    back: 'Sandbox', flat: 'Here the mesh is ironed flat.', open: 'Open', of: 'of', year: 'Year',
    tech: 'Stack', cell: 'Cell', where: 'Madrid', scroll: 'Down', lifted: 'lifted cells',
    nameLabel: 'Fernando Muñoz'
  }
};

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const pad = (n) => String(n).padStart(2, '0');
let li = 0;
const letters = (word) => [...word].map((ch) => `<span class="ch" style="--d:${li++ * 70}">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
const colName = (i) => { let s = ''; i += 1; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };

const c = await content();
const t = T[c.lang];
document.documentElement.lang = c.lang;
$('.skip').textContent = t.skip;

/* ---------- markup ---------- */

const main = $('#main');
const N = c.projects.length;
const [first, ...rest] = c.name.split(' ');
const last = rest.join(' ');

main.innerHTML = `
<section class="sec hero" id="top" aria-labelledby="name">
  <p class="cell meta" data-flat><span class="in"><span class="lab">${esc(t.where)} · N 40°25′ W 3°42′</span></span></p>
  <a class="cell lang" data-flat href="${t.otherHref}" hreflang="${t.otherLang}" lang="${t.otherLang}"><span class="in"><span class="lab">${t.other}</span></span></a>
  <h1 class="name" id="name"><span class="sr">${esc(c.name)}</span><span class="line l1" aria-hidden="true">${letters(first)}</span><span class="line l2" aria-hidden="true">${letters(last)}</span></h1>
  <div class="cell intro" data-flat><div class="in">
    <p class="lab kicker">${esc(c.kicker)}</p>
    <p class="deck">${esc(c.deck)}</p>
  </div></div>
  <p class="cell hint" data-flat><span class="in"><span class="lab">${fine.matches ? t.hintFine : t.hintTouch}</span></span></p>
  <a class="cell cue" data-flat href="#quien"><span class="in"><span class="lab">${t.scroll}</span><span class="arrow" aria-hidden="true">↓</span></span></a>
</section>

<section class="sec bio" id="quien" aria-labelledby="h-quien">
  <h2 class="cell head" id="h-quien" data-flat><span class="in"><span class="coord lab" aria-hidden="true"></span><span class="ht">${t.who}</span></span></h2>
  ${c.bio.map((p, i) => `<div class="cell para p${i}" data-flat><div class="in"><span class="coord lab" aria-hidden="true"></span><p>${esc(p)}</p></div></div>`).join('')}
</section>

<section class="sec works" id="obras" aria-labelledby="h-obras">
  <h2 class="cell head" id="h-obras" data-flat><span class="in"><span class="coord lab" aria-hidden="true"></span><span class="ht">${t.works}</span><span class="count" aria-hidden="true">${pad(N)}</span></span></h2>
  <p class="cell note" data-flat><span class="in"><span class="lab">${N} ${t.lifted}</span></span></p>
  ${c.projects.map((p, i) => `
  <div class="slot" data-i="${i}">
    <article class="tile" id="t-${esc(p.id)}">
      <span class="shadow" aria-hidden="true"></span>
      <a class="face" href="#${esc(p.id)}" aria-haspopup="dialog">
        <span class="row lab"><span class="num">${pad(i + 1)}</span><span class="coord" aria-hidden="true"></span><span class="yr">${p.year}</span></span>
        <h3 class="nm">${esc(p.name)}</h3>
        <span class="kk">${esc(p.kicker)}</span>
        <span class="tech lab">${p.tech.map(esc).join(' · ')}</span>
      </a>
    </article>
  </div>`).join('')}
</section>

<section class="sec contact" id="contacto" aria-labelledby="h-contacto">
  <p class="cell head" data-flat><span class="in"><span class="coord lab" aria-hidden="true"></span><span class="ht">${t.contact}</span></span></p>
  <h2 class="cell big" id="h-contacto" data-flat><span class="in">${esc(c.contactTitle)}</span></h2>
  <p class="cell ctext" data-flat><span class="in">${esc(c.contactText)}</span></p>
  <ul class="socials" role="list">
    ${c.socials.map((s) => `<li class="cell soc" data-flat><a class="in" href="${esc(s.url)}" rel="me noopener" target="_blank"><span class="sl">${esc(s.label)}</span><span class="sh">${esc(s.handle)}</span><span class="sa" aria-hidden="true">↗</span></a></li>`).join('')}
  </ul>
  <p class="cell flat" data-flat><span class="in"><span class="lab">${t.flat}</span></span></p>
  <footer class="cell foot" data-flat><span class="in lab"><a href="../">← ${t.back} · 02 Malla</a><span>${esc(c.nick)} · ${new Date().getFullYear()}</span></span></footer>
</section>`;
main.removeAttribute('aria-busy');

const bar = $('.bar');
bar.setAttribute('aria-label', t.nav);
bar.innerHTML = `<a href="#top" class="bn">${esc(c.name)}</a><a href="#quien">${t.who}</a><a href="#obras">${t.works}</a><a href="#contacto">${t.contact}</a>`;
bar.hidden = false;
$('.gauge__lab').textContent = t.fold;

/* ---------- grid geometry & layout ---------- */

const root = document.documentElement;
let cols = 8, u = 48, W = 0, H = 0;
const bp = () => (cols >= 24 ? 'xl' : cols >= 20 ? 'lg' : cols >= 12 ? 'md' : 'sm');
// desktop specs are written for 24 columns and scaled to 20
const X = (cc) => (cols === 24 ? cc : Math.round((cc - 1) * cols / 24) + 1);
const Wd = (w) => (cols === 24 ? w : Math.max(1, Math.round(w * cols / 24)));

function place(el, col, w, row, minH = 1) {
  el.style.gridColumn = `${col} / span ${w}`;
  el.style.gridRow = `${row} / span 1`;
  const inner = el.firstElementChild;
  const h = Math.max(minH, Math.ceil((inner.offsetHeight + 2) / u));
  el.style.gridRow = `${row} / span ${h}`;
  el._r = row; el._h = h; el._c = col;
  return row + h;
}

function fitName() {
  const h1 = $('.name');
  const l1 = $('.l1', h1), l2 = $('.l2', h1);
  const target = { sm: cols - 0.3, md: cols - 2.4, lg: cols * 0.66, xl: cols * 0.64 }[bp()] * u;
  h1.style.fontSize = '100px';
  const ext = (l) => { const a = l.firstElementChild.getBoundingClientRect(), b = l.lastElementChild.getBoundingClientRect(); return b.right - a.left; };
  const w1 = ext(l1), w2 = ext(l2);
  let fs = 100 * target / Math.max(w1, w2);
  fs = Math.min(fs, 460);
  h1.style.fontSize = `${fs}px`;
  // each line occupies whole rows
  const k = Math.max(1, Math.ceil((fs * 0.76) / u));
  h1.style.lineHeight = `${k * u}px`;
  return k;
}

function layout() {
  cols = parseInt(getComputedStyle(root).getPropertyValue('--cols')) || 8;
  W = root.clientWidth; H = innerHeight;
  u = W / cols;
  root.style.setProperty('--u', `${u}px`);
  const b = bp();

  // hero
  const hero = $('.hero');
  const k = fitName();
  const rowsVis = Math.ceil(H / u);
  const name = $('.name');
  if (b === 'sm') {
    place($('.meta', hero), 2, 5, 2);
    place($('.lang', hero), 7, 2, 2);
    name.style.gridColumn = `1 / span ${cols}`; name.style.gridRow = `4 / span ${2 * k}`;
    let r = 4 + 2 * k + 1;
    r = place($('.intro', hero), 2, 6, r) + 1;
    r = place($('.hint', hero), 2, 5, r);
    place($('.cue', hero), 7, 1, r - 1);
    hero.style.height = `${Math.max(r + 1, Math.min(rowsVis, r + 5)) * u}px`;
  } else {
    const rows = Math.max(Math.min(rowsVis, Math.ceil(1100 / u)), 2 * k + 9);
    place($('.meta', hero), 2, b === 'md' ? 4 : X(4), 2);
    place($('.lang', hero), cols - 2, 2, 2);
    name.style.gridColumn = `2 / span ${cols - 2}`;
    const nr = Math.max(4, Math.floor((rows - 2 * k) / 2) - 1);
    name.style.gridRow = `${nr} / span ${2 * k}`;
    const ib = place($('.intro', hero), 2, b === 'md' ? 5 : X(6), nr + 2 * k + 1);
    place($('.hint', hero), b === 'md' ? 8 : X(17), b === 'md' ? 4 : Wd(5), nr + 2 * k + 1);
    place($('.cue', hero), cols - 1, 1, Math.max(rows - 2, ib));
    hero.style.height = `${Math.max(rows, ib + 2) * u}px`;
  }

  // bio
  const bio = $('.bio');
  const ps = $$('.para', bio), head = $('.head', bio);
  let end;
  if (b === 'sm') {
    let r = place(head, 2, 3, 2) + 1;
    r = place(ps[0], 2, 6, r) + 2;
    r = place(ps[1], 3, 5, r) + 2;
    end = place(ps[2], 2, 4, r) + 2;
  } else if (b === 'md') {
    let r = place(head, 2, 3, 2) + 1;
    const e0 = place(ps[0], 2, 7, r);
    const e1 = place(ps[1], 7, 5, e0 + 1);
    end = place(ps[2], 3, 4, e1 + 1) + 3;
  } else {
    place(head, 2, Wd(3), 3);
    const e0 = place(ps[0], X(5), Wd(10), 3);
    const e1 = place(ps[1], X(16), Wd(7), 7);
    end = place(ps[2], X(8), Wd(6), Math.max(e0, e1 - 2) + 2) + 4;
  }
  bio.style.height = `${end * u}px`;

  // works
  const works = $('.works');
  const slots = $$('.slot', works);
  const wh = $('.head', works), note = $('.note', works);
  let r;
  if (b === 'sm') {
    r = place(wh, 2, 6, 1) ;
    r = place(note, 2, 4, r) + 2;
    slots.forEach((s, i) => {
      const off = [2, 3, 2, 1][i % 4];
      const w = off === 3 ? 5 : 6;
      r = placeTile(s, off, w, r, i % 3 === 0 ? 5 : 4) + (i % 2 ? 2 : 1);
    });
  } else if (b === 'md') {
    r = place(wh, 2, 6, 1);
    r = place(note, 8, 4, r - 1) + 2;
    for (let i = 0; i < N; i += 2) {
      const e0 = placeTile(slots[i], 2, 5, r, 5);
      const e1 = slots[i + 1] ? placeTile(slots[i + 1], 7 + (i % 4 ? 0 : 0), 5, r + 2, 5) : e0;
      r = Math.max(e0, e1) + 1;
    }
  } else {
    r = place(wh, 2, Wd(10), 1);
    place(note, X(17), Wd(5), r - 1);
    r += 3;
    const P = [
      [{ c: 2, w: 9, h: 6, d: 0 }, { c: 14, w: 7, h: 5, d: 3 }],
      [{ c: 5, w: 6, h: 5, d: 0 }, { c: 13, w: 10, h: 6, d: 1 }],
      [{ c: 2, w: 6, h: 5, d: 2 }, { c: 10, w: 6, h: 5, d: 0 }, { c: 18, w: 6, h: 5, d: 3 }]
    ];
    let i = 0, p = 0;
    while (i < N) {
      const band = P[p++ % P.length];
      let bandEnd = r;
      for (const s of band) {
        if (i >= N) break;
        bandEnd = Math.max(bandEnd, placeTile(slots[i++], X(s.c), Wd(s.w), r + s.d, s.h));
      }
      r = bandEnd + 2;
    }
  }
  works.style.height = `${(r + 2) * u}px`;

  // contact
  const ct = $('.contact');
  const socs = $$('.soc', ct);
  if (b === 'sm') {
    let r2 = place($('.head', ct), 2, 3, 3) + 1;
    r2 = place($('.big', ct), 1, 8, r2);
    r2 = place($('.ctext', ct), 2, 6, r2) + 1;
    socs.forEach((s) => { r2 = place(s, 1, 8, r2); });
    r2 = place($('.flat', ct), 2, 6, r2 + 1) + 2;
    r2 = place($('.foot', ct), 1, 8, r2);
    ct.style.height = `${r2 * u}px`;
  } else {
    const wide = b !== 'md';
    let r2 = place($('.head', ct), 2, wide ? Wd(3) : 3, 4) + 1;
    r2 = place($('.big', ct), 2, wide ? cols - 2 : cols - 2, r2);
    const er = place($('.ctext', ct), wide ? X(15) : 6, wide ? Wd(8) : 6, r2);
    r2 = Math.max(er, r2 + 1) + 1;
    socs.forEach((s, i) => {
      if (wide) place(s, 2 + i * Wd(5) + (i ? i * 0 : 0), Wd(5), r2, 3);
      else place(s, 2, cols - 2, r2 + i);
    });
    r2 += wide ? 4 : socs.length + 1;
    r2 = place($('.flat', ct), wide ? X(15) : 2, wide ? Wd(8) : 6, r2 + 1) + 3;
    r2 = place($('.foot', ct), 1, cols, r2);
    ct.style.height = `${r2 * u}px`;
  }

  measure();
}

function placeTile(slot, col, w, row, h) {
  slot.style.gridColumn = `${col} / span ${w}`;
  slot.style.gridRow = `${row} / span ${h}`;
  const face = $('.face', slot);
  // grow if the text does not fit
  const need = Math.ceil((face.scrollHeight + 2) / u);
  const hh = Math.max(h, need);
  slot.style.gridRow = `${row} / span ${hh}`;
  slot._r = row; slot._c = col; slot._h = hh;
  return row + hh;
}

/* ---------- measurements in document coordinates ---------- */

let flats = [], anchors = [], chars = [], tilesM = [], heroBottom = 0, nameBottom = 0;
const docTop = (el) => el.getBoundingClientRect().top + scrollY;

function measure() {
  flats = $$('[data-flat]').map((el) => {
    const r = el.getBoundingClientRect();
    return { x0: r.left, x1: r.right, y0: r.top + scrollY, y1: r.bottom + scrollY };
  });
  // spreadsheet coordinates of every placed cell
  $$('[data-flat], .slot').forEach((el) => {
    const co = el.querySelector('.coord');
    if (!co) return;
    const r = el.getBoundingClientRect();
    const colI = Math.round(r.left / u), rowI = Math.round((r.top + scrollY) / u) + 1;
    co.textContent = `${colName(colI)}·${pad(rowI)}`;
  });
  const y = (s) => docTop($(s));
  const bioT = y('.bio'), wT = y('.works'), cT = y('.contact');
  const wB = wT + $('.works').offsetHeight;
  heroBottom = bioT;
  nameBottom = docTop($('.name')) + $('.name').offsetHeight * 0.6;
  // fold amplitude along the page: gentle, deeper, deepest, then ironed flat
  anchors = [[0, 0.7], [bioT, 0.5], [wT, 0.8], [wB - 4 * u, 1.5], [cT - 2 * u, 1.2], [cT + 3 * u, 0], [1e9, 0]];
  chars = $$('.name .ch').map((el) => {
    el.style.transform = '';
    const r = el.getBoundingClientRect();
    return { el, x: r.left + r.width / 2, y: r.top + scrollY + r.height / 2, w: Math.max(r.width, 8), h: r.height * 0.7 };
  });
  tilesM = $$('.tile').map((el) => {
    const r = el.parentElement.getBoundingClientRect();
    return { el, x: r.left + r.width / 2, y: r.top + scrollY + r.height / 2, h: r.height };
  });
}

function amp(wy) {
  for (let i = 1; i < anchors.length; i++) {
    const [y1, a1] = anchors[i];
    if (wy <= y1) {
      const [y0, a0] = anchors[i - 1];
      const k = Math.min(1, Math.max(0, (wy - y0) / (y1 - y0 || 1)));
      const s = k * k * (3 - 2 * k);
      return a0 + (a1 - a0) * s;
    }
  }
  return 0;
}

/* ---------- noise ---------- */

const perm = new Uint8Array(512);
{
  const p = [...Array(256).keys()];
  let s = 20260202;
  for (let i = 255; i > 0; i--) { s = (s * 1664525 + 1013904223) >>> 0; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
}
const GX = [1, -1, 1, -1, 1, -1, 0, 0], GY = [1, 1, -1, -1, 0, 0, 1, -1];
function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const X0 = xi & 255, Y0 = yi & 255;
  const g = (h, dx, dy) => GX[h & 7] * dx + GY[h & 7] * dy;
  const aa = perm[X0 + perm[Y0]], ab = perm[X0 + perm[Y0 + 1]];
  const ba = perm[X0 + 1 + perm[Y0]], bb = perm[X0 + 1 + perm[Y0 + 1]];
  const fu = xf * xf * xf * (xf * (xf * 6 - 15) + 10), fv = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
  const x1 = g(aa, xf, yf) + fu * (g(ba, xf - 1, yf) - g(aa, xf, yf));
  const x2 = g(ab, xf, yf - 1) + fu * (g(bb, xf - 1, yf - 1) - g(ab, xf, yf - 1));
  return x1 + fv * (x2 - x1);
}

/* ---------- the field ---------- */

let time = 0, intro = 1, sv = 0;
const ptr = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, s: 0, ts: 0 };
const ripples = [];

function zAt(x, wy) {
  const a = amp(wy) * intro * u * 1.1;
  const f1 = 1 / (4.6 * u), f2 = 1 / (1.9 * u);
  let z = 0;
  if (a > 0.01) {
    z = a * (noise(x * f1 + time * 0.035, wy * f1 - time * 0.025) + 0.45 * noise(x * f2 - time * 0.05 + 31.7, wy * f2 + 7.3));
  }
  if (sv) z += sv * u * Math.sin(wy / (u * 2.6) - time * 5 + x / (u * 9)) * Math.min(1, amp(wy) + 0.25);
  for (const r of ripples) {
    const age = time - r.t0;
    const d = Math.hypot(x - r.x, wy - r.y);
    const k = (d - age * u * 8) / (u * 1.1);
    if (k > -4 && k < 4) z += r.a * u * Math.exp(-k * k) * Math.sin(k * 3) * Math.exp(-age * 1.1);
  }
  return z;
}

function maskAt(x, wy, list) {
  let m = 1;
  const f = 1.4 * u, p = 0.18 * u;
  for (const r of list) {
    const dx = Math.max(r.x0 - p - x, 0, x - r.x1 - p);
    const dy = Math.max(r.y0 - p - wy, 0, wy - r.y1 - p);
    if (dx > f || dy > f) continue;
    const d = Math.hypot(dx, dy);
    if (d >= f) continue;
    const k = d / f;
    m *= k * k * (3 - 2 * k);
    if (m === 0) return 0;
  }
  return m;
}

const F = 1700;
// displacement of a point of the sheet (document coords), with the slope from
// finite differences
function dispAt(x, wy, list) {
  const e = u / 5;
  const z = zAt(x, wy);
  const gx = (zAt(x + e, wy) - z) / e, gy = (zAt(x, wy + e) - z) / e;
  return disp(x, wy, z, gx, gy, list);
}
function disp(x, wy, z, gx, gy, list) {
  const sy = wy - scrollY;
  const G = 0.62 * u;
  let dx = gx * G + (x - W / 2) * z / F;
  let dy = gy * G + (sy - H / 2) * z / F;
  if (ptr.s > 0.001) {
    const vx = x - ptr.x, vy = sy - ptr.y;
    const R = 2.4 * u;
    const q = Math.exp(-(vx * vx + vy * vy) / (R * R)) * ptr.s;
    dx += vx * q * 0.55; dy += vy * q * 0.55;
  }
  const m = maskAt(x, wy, list);
  return [dx * m, dy * m, z * m];
}

/* ---------- canvas ---------- */

const cv = $('#sheet');
const ctx = cv.getContext('2d');
let dpr = 1, PX = new Float32Array(0), PY = new Float32Array(0), Z = new Float32Array(0);

function resizeCanvas() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  cv.style.width = `${W}px`; cv.style.height = `${H}px`;
}

function draw() {
  const sub = u > 52 ? 5 : 4, step = u / sub;
  const sy = scrollY;
  const nx = Math.ceil((W + 2 * u) / step) + 1;
  const wy0 = Math.floor((sy - u) / u) * u;
  const ny = Math.ceil((H + 3 * u) / step) + 1;
  const n = nx * ny;
  if (Z.length < n) { Z = new Float32Array(n); PX = new Float32Array(n); PY = new Float32Array(n); }
  const vis = flats.filter((r) => r.y1 > sy - 3 * u && r.y0 < sy + H + 3 * u);
  for (let j = 0; j < ny; j++) {
    const wy = wy0 + j * step;
    for (let i = 0; i < nx; i++) Z[j * nx + i] = zAt(-u + i * step, wy);
  }
  for (let j = 0; j < ny; j++) {
    const wy = wy0 + j * step;
    for (let i = 0; i < nx; i++) {
      const k = j * nx + i, x = -u + i * step;
      const gx = (Z[k + (i < nx - 1 ? 1 : 0)] - Z[k - (i > 0 ? 1 : 0)]) / (step * ((i > 0 && i < nx - 1) ? 2 : 1));
      const gy = (Z[k + (j < ny - 1 ? nx : 0)] - Z[k - (j > 0 ? nx : 0)]) / (step * ((j > 0 && j < ny - 1) ? 2 : 1));
      const [dx, dy] = disp(x, wy, Z[k], gx, gy, vis);
      // the hand: a slow wobble fixed to the paper
      const wx = 0.9 * noise(x * 0.021 + 11, wy * 0.021) + 0.35 * noise(x * 0.09, wy * 0.09 + 5);
      const wyy = 0.9 * noise(x * 0.021, wy * 0.021 + 23) + 0.35 * noise(x * 0.09 + 9, wy * 0.09);
      PX[k] = x + dx + wx * 1.6;
      PY[k] = wy - sy + dy + wyy * 1.6;
    }
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.beginPath();
  for (let i = 0; i < nx; i += sub) {
    ctx.moveTo(PX[i], PY[i]);
    for (let j = 1; j < ny; j++) ctx.lineTo(PX[j * nx + i], PY[j * nx + i]);
  }
  const off = 0;
  for (let j = off; j < ny; j += sub) {
    const b = j * nx;
    ctx.moveTo(PX[b], PY[b]);
    for (let i = 1; i < nx; i++) ctx.lineTo(PX[b + i], PY[b + i]);
  }
  ctx.lineWidth = u > 52 ? 2.1 : 1.7;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = '#141414';
  ctx.stroke();
}

/* the name is printed on the cloth: each letter takes the local affine map */
function ride() {
  if (scrollY > heroBottom) return;
  for (const ch of chars) {
    const hw = ch.w / 2, hh = ch.h / 2;
    const L = dispAt(ch.x - hw, ch.y, flats), R = dispAt(ch.x + hw, ch.y, flats);
    const Tt = dispAt(ch.x, ch.y - hh, flats), B = dispAt(ch.x, ch.y + hh, flats);
    const a = 1 + (R[0] - L[0]) / ch.w, b = (R[1] - L[1]) / ch.w;
    const cc = (B[0] - Tt[0]) / ch.h, d = 1 + (B[1] - Tt[1]) / ch.h;
    const ex = (L[0] + R[0] + Tt[0] + B[0]) / 4, ey = (L[1] + R[1] + Tt[1] + B[1]) / 4;
    const zz = (L[2] + R[2]) / 2;
    const s = 1 + zz / F * 2;
    ch.el.style.transform = `matrix(${(a * s).toFixed(4)},${b.toFixed(4)},${cc.toFixed(4)},${(d * s).toFixed(4)},${ex.toFixed(2)},${ey.toFixed(2)})`;
  }
}

/* the project cells float on the sheet: tilt with its slope, rise with its height */
function float() {
  const sy = scrollY;
  for (const tm of tilesM) {
    if (tm.y + tm.h < sy - u || tm.y - tm.h > sy + H + u) continue;
    const e = u;
    const z = zAt(tm.x, tm.y);
    const gx = (zAt(tm.x + e, tm.y) - zAt(tm.x - e, tm.y)) / (2 * e);
    const gy = (zAt(tm.x, tm.y + e) - zAt(tm.x, tm.y - e)) / (2 * e);
    tm.el.style.transform = `translateZ(${(z * 0.9).toFixed(1)}px) rotateX(${(-gy * 16).toFixed(2)}deg) rotateY(${(gx * 16).toFixed(2)}deg)`;
  }
}

const gaugeVal = $('.gauge__val'), gaugeBar = $('.gauge__bar i');
let lastG = -1;
function gauge() {
  const a = amp(scrollY + H / 2) * intro;
  const v = Math.round(a * 100) / 100;
  if (v === lastG) return;
  lastG = v;
  gaugeVal.textContent = v.toFixed(2);
  gaugeBar.style.transform = `scaleX(${Math.min(1, a / 1.6).toFixed(3)})`;
}

/* ---------- loop ---------- */

let t0 = performance.now(), lastY = scrollY, running = false, raf = 0;
function frame(now) {
  raf = 0;
  const still = reduce.matches;
  time = still ? 0 : (now - t0) / 1000;
  const k = Math.min(1, time / 2.2);
  intro = still ? 1 : 1 + 2.4 * Math.pow(1 - k, 3);
  ptr.x += (ptr.tx - ptr.x) * 0.14; ptr.y += (ptr.ty - ptr.y) * 0.14;
  ptr.s += (ptr.ts - ptr.s) * 0.06;
  if (still) ptr.s = 0;
  const dy = scrollY - lastY; lastY = scrollY;
  sv += (Math.max(-0.5, Math.min(0.5, dy * 0.006)) - sv) * 0.08;
  if (Math.abs(sv) < 0.002 || still) sv = 0;
  for (let i = ripples.length - 1; i >= 0; i--) if (time - ripples[i].t0 > 3.2) ripples.splice(i, 1);
  draw(); ride(); float(); gauge();
  if (!still && !document.hidden) raf = requestAnimationFrame(frame);
}
function kick() { if (!raf) raf = requestAnimationFrame(frame); }

/* ---------- interaction ---------- */

addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse' || reduce.matches) return;
  if (ptr.x < -1e3) { ptr.x = e.clientX; ptr.y = e.clientY; }
  ptr.tx = e.clientX; ptr.ty = e.clientY; ptr.ts = 1;
}, { passive: true });
document.addEventListener('pointerleave', () => { ptr.ts = 0; });
addEventListener('touchstart', (e) => {
  if (reduce.matches) return;
  const p = e.touches[0];
  ptr.x = ptr.tx = p.clientX; ptr.y = ptr.ty = p.clientY; ptr.ts = 1;
}, { passive: true });
addEventListener('touchmove', (e) => { const p = e.touches[0]; ptr.tx = p.clientX; ptr.ty = p.clientY; }, { passive: true });
addEventListener('touchend', () => { ptr.ts = 0; }, { passive: true });
addEventListener('click', (e) => {
  if (reduce.matches || e.target.closest('a, button, .cell, .tile, dialog, .bar')) return;
  ripples.push({ x: e.clientX, y: e.clientY + scrollY, t0: time, a: 0.9 });
  if (ripples.length > 5) ripples.shift();
});
addEventListener('scroll', () => { if (reduce.matches) kick(); }, { passive: true });
document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
reduce.addEventListener('change', () => { measure(); kick(); });

// tilt of a lifted cell toward the pointer
for (const tile of $$('.tile')) {
  const face = $('.face', tile);
  face.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = face.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    tile.style.setProperty('--ry', `${(px * 14).toFixed(2)}deg`);
    tile.style.setProperty('--rx', `${(-py * 14).toFixed(2)}deg`);
  });
  face.addEventListener('pointerleave', () => { tile.style.setProperty('--rx', '0deg'); tile.style.setProperty('--ry', '0deg'); });
}

// the bar arrives once the name has scrolled away; the section in view is marked
const io = new IntersectionObserver((es) => {
  for (const e of es) {
    if (e.isIntersecting) $$('a', bar).forEach((a) => a.toggleAttribute('aria-current', a.getAttribute('href') === `#${e.target.id}`));
  }
}, { rootMargin: '-45% 0px -45% 0px' });
$$('.sec').forEach((s) => io.observe(s));
let past = null;
function checkPast() {
  const p = scrollY > nameBottom;
  if (p !== past) { past = p; root.classList.toggle('past', p); }
}
addEventListener('scroll', checkPast, { passive: true });

// fallback for the tiles' entrance when there is no scroll-driven animation
if (!CSS.supports('animation-timeline: view()')) {
  root.classList.add('no-sda');
  const io2 = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.tile').forEach((el) => io2.observe(el));
}

/* ---------- the page: a cell unfolds ---------- */

const dlg = $('#page');
let cur = -1;
function fill(i) {
  const p = c.projects[i];
  const prev = (i + N - 1) % N, next = (i + 1) % N;
  dlg.innerHTML = `
  <article class="sheet">
    <header class="ph lab">
      <span>${pad(i + 1)} ${t.of} ${pad(N)}</span>
      <span>${p.year}</span>
      <button class="x" type="button" data-close><span>${t.close}</span> <span aria-hidden="true">✕</span></button>
    </header>
    <p class="pk lab">${esc(p.kicker)}</p>
    <h2 class="pt" id="page-title">${esc(p.name)}</h2>
    <ul class="ptech" role="list" aria-label="${t.tech}">${p.tech.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="pb">${p.body.map((x) => `<p>${esc(x)}</p>`).join('')}</div>
    <p class="plinks">
      ${p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener">${t.demo} <span aria-hidden="true">↗</span></a>` : ''}
      ${p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener">${t.repo} <span aria-hidden="true">↗</span></a>` : ''}
    </p>
    <nav class="pn lab" aria-label="${t.works}">
      <a href="#${esc(c.projects[prev].id)}" data-go="${prev}"><span aria-hidden="true">←</span> ${esc(c.projects[prev].name)}</a>
      <a href="#${esc(c.projects[next].id)}" data-go="${next}">${esc(c.projects[next].name)} <span aria-hidden="true">→</span></a>
    </nav>
  </article>`;
  cur = i;
}
const vt = (fn) => (document.startViewTransition && !reduce.matches ? document.startViewTransition(fn).finished : (fn(), Promise.resolve()));
const tileOf = (i) => $$('.tile')[i];
const names = (on, el, sheet) => {
  const v = on ? ['sheet', 'ttl'] : ['', ''];
  el.style.viewTransitionName = v[0];
  sheet.style.viewTransitionName = v[1];
};

function open(i) {
  const tile = tileOf(i);
  const face = $('.face', tile), nm = $('.nm', tile);
  names(true, face, nm);
  vt(() => {
    names(false, face, nm);
    fill(i);
    names(true, $('.sheet', dlg), $('.pt', dlg));
    if (!dlg.open) dlg.showModal();
    root.classList.add('reading');
  }).then(() => { const s = $('.sheet', dlg); if (s) names(false, s, $('.pt', dlg)); });
  history.replaceState(null, '', `#${c.projects[i].id}`);
}
function go(i) {
  vt(() => { fill(i); $('.sheet', dlg).scrollTop = 0; dlg.scrollTop = 0; $('[data-close]', dlg).focus(); });
  history.replaceState(null, '', `#${c.projects[i].id}`);
}
function close() {
  if (!dlg.open) return;
  const i = cur, tile = tileOf(i), face = $('.face', tile), nm = $('.nm', tile);
  const s = $('.sheet', dlg);
  names(true, s, $('.pt', dlg));
  vt(() => {
    names(false, s, $('.pt', dlg));
    dlg.close();
    root.classList.remove('reading');
    tile.scrollIntoView({ block: 'center', behavior: 'instant' });
    names(true, face, nm);
  }).then(() => { names(false, face, nm); face.focus({ preventScroll: true }); });
  history.replaceState(null, '', `${location.pathname}${location.search}#obras`);
}

main.addEventListener('click', (e) => {
  const a = e.target.closest('.face');
  if (!a) return;
  e.preventDefault();
  open(+a.closest('.slot').dataset.i);
});
dlg.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]') || e.target === dlg) { e.preventDefault(); close(); return; }
  const g = e.target.closest('[data-go]');
  if (g) { e.preventDefault(); go(+g.dataset.go); }
});
dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });

/* ---------- boot ---------- */

let rt = 0;
function relayout() { layout(); resizeCanvas(); kick(); }
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(relayout, 80); });
await document.fonts.ready;
relayout();
root.classList.add('ready');
checkPast();
// fonts can settle after first layout
setTimeout(() => { layout(); kick(); }, 400);
const hash = decodeURIComponent(location.hash.slice(1));
const hi = c.projects.findIndex((p) => p.id === hash);
if (hi >= 0) open(hi);
