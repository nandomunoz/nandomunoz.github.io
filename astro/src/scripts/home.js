// The home's behaviour (plan Phase 6): the rain over the cover with the poster typed in, the projects' cards that tilt under the pointer, and the reveal of what scrolls
// in where CSS scroll timelines do not exist. The dotted blocks themselves are mounted by blocks.js.
import { RainField } from './rain.js';
import { typePoster } from './poster.js';
import { greenOnHover } from './green.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
if (!CSS.supports('animation-timeline: view()')) root.classList.add('no-sda');

// ------------------------------------------------------------- the cover
const cv = document.querySelector('[data-rain]');
const heroEl = document.querySelector('.hero');
let hero = null, onScreen = true;
if (cv && heroEl) {
  hero = new RainField(cv, { mask: 'cycle', name: cv.dataset.name, dots: true });
  cv.dataset.mounted = '';
  const sync = () => (onScreen && !document.hidden ? hero.start() : hero.stop());
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }).observe(heroEl);
  document.addEventListener('visibilitychange', sync);                // a tab in the background does not draw
  cv.addEventListener('pointerdown', (e) => { const r = cv.getBoundingClientRect(); hero.poke(e.clientX - r.left, e.clientY - r.top); });
  const deck = document.querySelector('.hero__deck');
  const p = JSON.parse(deck.dataset.poster);
  typePoster(
    { deck, name: document.querySelector('.hero__name'), kicker: document.querySelector('.hero__kicker'), bill: document.querySelector('.hero__billing') },
    { motto: p.motto, key: new RegExp(p.key), green: new Set(p.green), reduce }
  ).play(900);
}

// ------------------------------------------------------------- cards tilt under the pointer
const works = document.querySelector('.works');
if (works && fine && !reduce) {
  const cool = (n) => { n.classList.remove('is-hot'); n.style.removeProperty('--rx'); n.style.removeProperty('--ry'); };
  works.addEventListener('pointermove', (e) => {
    const blk = e.target.closest('.item__block');
    $$('.item__block.is-hot', works).forEach((n) => n !== blk && cool(n));
    if (!blk) return;
    const r = blk.getBoundingClientRect();
    blk.classList.add('is-hot');
    blk.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`);
    blk.style.setProperty('--rx', `${(0.5 - (e.clientY - r.top) / r.height) * 7}deg`);
  });
  works.addEventListener('pointerleave', () => $$('.item__block.is-hot', works).forEach(cool));
}
greenOnHover();                                                       // the projects' dotted fields turn green under the pointer

// ------------------------------------------------------------- reveal fallback
if (root.classList.contains('no-sda') && !reduce) {
  const rio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal, .item__text').forEach((n) => rio.observe(n));
}

// ------------------------------------------------------------- relayout and colour mode
let rw = innerWidth, tm;
addEventListener('resize', () => {
  clearTimeout(tm);
  tm = setTimeout(() => { if (innerWidth === rw) return; rw = innerWidth; hero?.layout(); }, 180);
});
document.addEventListener('trama:mode', () => { hero?.repaint(); });

await document.fonts.ready;
// the field lays itself out once its title font is ready (rain.js); here only if the canvas has another size by now
if (hero && (hero.f.w !== cv.clientWidth || hero.f.h !== cv.clientHeight)) hero.layout();
hero?.start();
