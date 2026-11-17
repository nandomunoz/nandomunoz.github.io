// Mounts the dotted blocks of a page (plan Phase 5). The HTML carries everything the engine needs, already
// computed at build time:
//
//   <canvas data-dots='{"kind":2,"density":0.52,"rows":14,"seed":7}' aria-hidden="true"></canvas>
//
// options of dots.js's DotBlock (cell is chosen here from the width: 7, 8 or 9 px) plus
//   tone   the URL of a grey picture to draw as halftone (loadTone)
//   fixed  true: always assembled (it does not assemble with the scroll)
// Without JS the canvas keeps its CSS fallback (a field of dots, see blocks.css). Each block assembles as it
// rises into view and dissolves as it leaves; it sleeps while it is off screen; it is redrawn with the new
// palette when the colour mode changes (trama:mode, from theme.js); with reduced motion it is simply drawn.
import { DotBlock, loadTone, readPalette, clamp } from './dots.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const cellSize = () => (innerWidth < 768 ? 7 : innerWidth < 1024 ? 8 : 9);

/** canvas → { cv, opts, tone, block, fixed } */
export const registry = new Map();
const visible = new Set();
let lastCell = 0, lastWidth = innerWidth, pending = false;

function make(e, cell) {
  const o = { cell, ...e.opts };
  if (e.tone) o.tone = e.tone;
  return new DotBlock(e.cv, o);
}
function build() {
  const cell = cellSize();
  for (const e of registry.values()) {
    const p = e.block ? e.block.p : reduce ? 1 : 0;
    e.block = make(e, cell);
    e.block.draw(p, true);
  }
  lastCell = cell;
  tick();
}

function tick() {
  pending = false;
  const vh = innerHeight;
  for (const e of visible) {
    if (!e.block) continue;
    if (reduce || e.fixed) { e.block.draw(1); continue; }
    const r = e.cv.getBoundingClientRect();
    e.block.draw(Math.min(clamp((vh - r.top) / (vh * 0.55)), clamp(r.bottom / (vh * 0.4))));
  }
}
const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(tick); } };

const io = new IntersectionObserver((es) => es.forEach((x) => {
  const e = registry.get(x.target);
  if (!e) return;
  if (x.isIntersecting) visible.add(e);
  else { visible.delete(e); if (e.block && !reduce && !e.fixed) e.block.draw(0); }
  schedule();
}), { rootMargin: '15% 0px' });

/** Mounts every `canvas[data-dots]` under `root` that is not mounted yet; returns the new entries. */
export function mountDots(root = document) {
  const added = [];
  for (const cv of root.querySelectorAll('canvas[data-dots]:not([data-mounted])')) {
    let opts;
    try { opts = JSON.parse(cv.dataset.dots || '{}'); } catch { continue; }
    const { tone, fixed, ...rest } = opts;
    const e = { cv, opts: rest, tone: null, block: null, fixed: !!fixed };
    registry.set(cv, e);
    cv.dataset.mounted = '';
    e.block = make(e, cellSize());
    e.block.draw(reduce || e.fixed ? 1 : 0, true);
    if (tone) loadTone(tone).then((t) => { if (t) { e.tone = t; e.block.o.tone = t; e.block.resize(); e.block.draw(e.block.p, true); } });
    if (fine && !reduce) {
      cv.addEventListener('pointermove', (ev) => {
        const r = cv.getBoundingClientRect(), k = e.block.w / r.width || 1;
        e.block.ptr = { x: (ev.clientX - r.left) * k, y: (ev.clientY - r.top) * k };
        e.block.draw(e.block.p, true);
      });
      cv.addEventListener('pointerleave', () => { e.block.ptr = null; e.block.draw(e.block.p, true); });
    }
    io.observe(cv);
    added.push(e);
  }
  lastCell = cellSize();
  return added;
}

addEventListener('scroll', schedule, { passive: true });
let tm;
addEventListener('resize', () => {
  clearTimeout(tm);
  tm = setTimeout(() => {
    if (innerWidth === lastWidth && cellSize() === lastCell) return;
    lastWidth = innerWidth;
    build();
  }, 180);
});
// a new colour mode: read the palette again and redraw every block
document.addEventListener('trama:mode', () => { readPalette(); for (const e of registry.values()) e.block?.draw(e.block.p, true); });
// a tab in the background does not draw (the scroll and the observer already sleep; this covers a resize while hidden)
document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });

mountDots();
