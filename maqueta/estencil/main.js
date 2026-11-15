// 04 · Esténcil — renders the real content and drives the layers:
// pointer parallax, the abyss glyph that changes with each section, the
// project sheet opened through a view transition (an iris through a letter),
// and a fallback for browsers without scroll-driven animations.
import { content } from '../shared/content.js';

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const letters = (w) => [...w].map((l) => `<span>${esc(l)}</span>`).join('');
const pad = (n) => String(n).padStart(2, '0');

const L = {
  es: {
    skip: 'Saltar al contenido', bioTitle: 'Quién escribe', bioWord: 'SOY',
    worksTitle: 'Proyectos', worksWord: 'OBRA',
    worksHint: 'Trece trabajos, cada uno a su profundidad. Pulsa un nombre para abrirlo.',
    helloWord: 'HOLA', demo: 'Ver demo', repo: 'Ver código', close: 'Cerrar',
    prev: '← Anterior', next: 'Siguiente →', open: 'Abrir', other: 'EN', otherHref: '?lang=en', otherLang: 'en'
  },
  en: {
    skip: 'Skip to content', bioTitle: 'Who writes', bioWord: 'I AM',
    worksTitle: 'Projects', worksWord: 'WORK',
    worksHint: 'Thirteen works, each one at its own depth. Press a name to open it.',
    helloWord: 'HELLO', demo: 'View demo', repo: 'View code', close: 'Close',
    prev: '← Previous', next: 'Next →', open: 'Open', other: 'ES', otherHref: './', otherLang: 'es'
  }
};

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const sda = CSS.supports('animation-timeline: view()');

const c = await content();
const t = L[c.lang];
document.documentElement.lang = c.lang;

// ── render ──────────────────────────────────────────────
const slot = (n) => $(`[data-slot="${n}"]`);
$('.skip').textContent = t.skip;
const lang = $('.mark__lang');
lang.textContent = t.other; lang.href = t.otherHref; lang.hreflang = lang.lang = t.otherLang;

slot('kicker').textContent = c.kicker;
slot('deck').textContent = c.deck;
slot('bioTitle').textContent = t.bioTitle;
slot('bioWord').innerHTML = letters(t.bioWord.replace(' ', ''));
slot('bio').innerHTML = c.bio.map((p) => `<p>${esc(p)}</p>`).join('');
slot('worksTitle').textContent = t.worksTitle;
slot('worksWord').innerHTML = letters(t.worksWord);
slot('worksHint').textContent = t.worksHint;
slot('contactTitle').textContent = c.contactTitle;
slot('contactText').textContent = c.contactText;
slot('helloWord').innerHTML = letters(t.helloWord);
slot('year').textContent = new Date().getFullYear();
slot('socials').innerHTML = c.socials.map((s) =>
  `<li><a href="${esc(s.url)}" rel="me noopener"><b>${esc(s.label)}</b><small>${esc(s.handle)}</small></a></li>`).join('');

const projects = c.projects;
slot('projects').innerHTML = projects.map((p, i) => `
  <li class="d${[0, 1, 2, 1][i % 4]}" id="p-${esc(p.id)}">
    <button class="proj" type="button" data-i="${i}" aria-haspopup="dialog">
      <span class="proj__name">${esc(p.name)}</span>
      <span class="proj__meta">
        <span class="proj__num">${pad(i + 1)}</span>
        <span class="proj__kicker">${esc(p.kicker)}</span>
        <span>${p.year} · ${esc(p.tech.slice(0, 3).join(' / '))}</span>
        <span class="proj__go" aria-hidden="true">${t.open} →</span>
      </span>
    </button>
  </li>`).join('');

// ── pointer parallax (fine pointers only) ───────────────
const root = document.documentElement;
if (matchMedia('(pointer: fine)').matches) {
  let raf = 0, x = 0, y = 0;
  addEventListener('pointermove', (e) => {
    if (reduce.matches) return;
    x = (e.clientX / innerWidth) * 2 - 1;
    y = (e.clientY / innerHeight) * 2 - 1;
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0;
      root.style.setProperty('--mx', x.toFixed(3));
      root.style.setProperty('--my', y.toFixed(3));
    });
  }, { passive: true });
}

// ── the abyss: one glyph per section, the project number in the reel ──
const abyss = $('.abyss span');
let glyph = 'N';
const setGlyph = (g) => {
  if (g === glyph) return;
  glyph = g;
  if (reduce.matches) { abyss.textContent = g; return; }
  abyss.parentElement.classList.add('swap');
  setTimeout(() => { abyss.textContent = g; abyss.parentElement.classList.remove('swap'); }, 280);
};
const glyphs = new Map([
  [$('.hero'), 'N'], [$('.bio'), t.bioWord.at(-1)], [$('.works__head'), t.worksWord[0]], [$('.contact'), '@']
]);
$$('.reel li').forEach((li, i) => glyphs.set(li, pad(i + 1)));
function $$(s) { return [...document.querySelectorAll(s)]; }
const seen = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) setGlyph(glyphs.get(e.target));
}, { rootMargin: '-45% 0px -45% 0px' });
glyphs.forEach((_, el) => seen.observe(el));

// ── fallback for scroll-driven animations ───────────────
if (!sda && !reduce.matches) {
  root.classList.add('no-sda');
  const rows = $$('.row'), names = $$('.proj__name');
  const reveal = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: .3 });
  $$('.giant').forEach((g) => reveal.observe(g));
  let tick = 0;
  const update = () => {
    tick = 0;
    const vh = innerHeight;
    const hp = Math.min(1, scrollY / vh);
    rows.forEach((r) => r.style.setProperty('--p', hp));
    names.forEach((n) => {
      const b = n.getBoundingClientRect();
      if (b.bottom < -50 || b.top > vh + 50) return;
      n.style.setProperty('--p', Math.min(1, Math.max(0, (vh - b.top) / (vh + b.height))).toFixed(3));
    });
  };
  addEventListener('scroll', () => { if (!tick) tick = requestAnimationFrame(update); }, { passive: true });
  update();
}

// ── project sheet ───────────────────────────────────────
const sheet = $('.sheet');
const [prevBtn, closeBtn, nextBtn] = sheet.querySelectorAll('.sheet__nav button');
prevBtn.textContent = t.prev; nextBtn.textContent = t.next; closeBtn.textContent = t.close;
let current = -1;
let opener = null;

function fill(i) {
  const p = projects[i];
  current = i;
  $('.sheet__num', sheet).textContent = pad(i + 1);
  $('.sheet__kicker', sheet).textContent = `${pad(i + 1)} / ${pad(projects.length)} · ${p.kicker} · ${p.year}`;
  $('.sheet__name', sheet).textContent = p.name;
  $('.sheet__tech', sheet).innerHTML = p.tech.map((x) => `<li>${esc(x)}</li>`).join('');
  $('.sheet__body', sheet).innerHTML = p.body.map((x) => `<p>${esc(x)}</p>`).join('');
  $('.sheet__links', sheet).innerHTML =
    (p.demo ? `<a href="${esc(p.demo)}" rel="noopener">${t.demo} ↗</a>` : '') +
    (p.repo ? `<a href="${esc(p.repo)}" rel="noopener">${t.repo} ↗</a>` : '');
  sheet.scrollTop = 0;
}

const transition = (fn, closing = false) => {
  if (!document.startViewTransition || reduce.matches) { fn(); return Promise.resolve(); }
  root.classList.toggle('closing', closing);
  const vt = document.startViewTransition(fn);
  return vt.finished.finally(() => root.classList.remove('closing'));
};

function aim(el) {
  // the iris opens from the counter of the word: the middle of its first letter
  const b = el.getBoundingClientRect();
  const x = Math.max(0, b.left) + Math.min(b.width, innerWidth) * .12;
  root.style.setProperty('--cx', `${Math.round(x)}px`);
  root.style.setProperty('--cy', `${Math.round(b.top + b.height * .45)}px`);
}

function open(i, from) {
  opener = from || opener;
  const name = from && $('.proj__name', from);
  if (name) { aim(name); name.style.viewTransitionName = 'pname'; }
  sheet.style.viewTransitionName = 'sheet';
  transition(() => {
    if (name) name.style.viewTransitionName = '';
    fill(i);
    $('.sheet__name', sheet).style.viewTransitionName = 'pname';
    if (!sheet.open) sheet.showModal();
    sheet.scrollTop = 0;
    closeBtn.focus({ preventScroll: true });
  }).then(() => {
    $('.sheet__name', sheet).style.viewTransitionName = '';
    sheet.style.viewTransitionName = '';
  });
  history.replaceState(null, '', `#${projects[i].id}`);
}

function close() {
  if (!sheet.open) return;
  const target = opener || $(`.proj[data-i="${current}"]`);
  const name = $(`.proj[data-i="${current}"] .proj__name`);
  sheet.style.viewTransitionName = 'sheet';
  $('.sheet__name', sheet).style.viewTransitionName = 'pname';
  transition(() => {
    $('.sheet__name', sheet).style.viewTransitionName = '';
    sheet.close();
    if (name) name.style.viewTransitionName = 'pname';
    target?.focus({ preventScroll: true });
  }, true).then(() => {
    if (name) name.style.viewTransitionName = '';
    sheet.style.viewTransitionName = '';
  });
  history.replaceState(null, '', location.pathname + location.search);
  opener = null;
}

slot('projects').addEventListener('click', (e) => {
  const b = e.target.closest('.proj');
  if (b) open(+b.dataset.i, b);
});
sheet.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
sheet.addEventListener('click', (e) => {
  const go = e.target.closest('[data-go]')?.dataset.go;
  if (!go) return;
  if (go === 'close') return close();
  const n = (current + +go + projects.length) % projects.length;
  opener = $(`.proj[data-i="${n}"]`);
  transition(() => { fill(n); closeBtn.focus({ preventScroll: true }); });
  history.replaceState(null, '', `#${projects[n].id}`);
});
sheet.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' && !e.target.closest('a')) nextBtn.click();
  if (e.key === 'ArrowLeft' && !e.target.closest('a')) prevBtn.click();
});

// deep link: #luz opens LUZ
const deep = projects.findIndex((p) => `#${p.id}` === location.hash);
if (deep >= 0) { fill(deep); sheet.showModal(); sheet.scrollTop = 0; closeBtn.focus(); }
