// Titles that resolve from noise into dots (plan Phases 6 and 8): every `.decode` heading (the home's section titles, the
// short titles of the blog's and projects' pages) is drawn in dots when it comes into view; its text stays in the page for
// readers, hidden. The pointer stirs them. Reduced motion draws them still.
import { HeroField } from './dots.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const titles = [...document.querySelectorAll('.decode')].map((h) => {
  const text = h.textContent.trim();
  const c = document.createElement('canvas');
  c.className = 'title-dots'; c.setAttribute('aria-hidden', 'true');
  const vh = document.createElement('span'); vh.className = 'vh'; vh.textContent = text;
  h.replaceChildren(vh, c);
  const item = { c, text, f: null };
  c.addEventListener('pointermove', (e) => { if (item.f) { const r = c.getBoundingClientRect(); item.f.ptr = { x: e.clientX - r.left, y: e.clientY - r.top }; } });
  c.addEventListener('pointerleave', () => { if (item.f) item.f.ptr = null; });
  return item;
});
const io = new IntersectionObserver((es) => es.forEach((e) => {
  const item = titles.find((x) => x.c === e.target);
  if (e.isIntersecting && e.intersectionRatio > 0.4) {
    item.f ??= new HeroField(item.c, item.text, { reduce, plain: 13 });
    item.f.start();
  } else if (!e.isIntersecting && item.f) item.f.stop();
}), { threshold: [0, 0.5] });

let rw = innerWidth, tm;
addEventListener('resize', () => {
  clearTimeout(tm);
  tm = setTimeout(() => { if (innerWidth === rw) return; rw = innerWidth; titles.forEach((x) => x.f?.layout()); }, 180);
});
document.addEventListener('trama:mode', () => titles.forEach((x) => x.f?.repaint()));
document.fonts.ready.then(() => titles.forEach((x) => io.observe(x.c)));
