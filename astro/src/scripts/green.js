// Trama · the projects' dotted fields (the cards and the open panel) turn green while
// the pointer is over them, easing in and back out when it leaves. It works on any
// canvas without touching its engine: each layer of the field gets a twin canvas laid
// right on top of it (same box, same transform, so it follows the card's 3D tilt), and
// every frame the twin copies the layer's own pixels tinted green. Whatever covers the
// field (the panel's sheet) covers the green too. Reduced motion: it switches, no ease.
//
//   greenOnHover(root = document, only = the projects' dotted fields)
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 260;                                                    // ms to turn green, and back
const on = new Map();                                                // field (its top layer) → { a: 0–1, want: 0 | 1 }
const twins = new WeakMap();                                         // layer → its green twin
let raf = 0, last = 0;

const green = () => getComputedStyle(document.documentElement).getPropertyValue('--matrix').trim() || '#22c55e';
const isTwin = (c) => c.dataset.twin === '1';
// the canvases that make one field: a project card has a back and a front layer
const layers = (cv) => { const b = cv.closest('.item__block'); return b ? [...b.querySelectorAll('canvas')].filter((c) => !isTwin(c)) : [cv]; };

function twinOf(c) {
  let t = twins.get(c);
  if (!t || !t.isConnected) {
    t = document.createElement('canvas');
    t.dataset.twin = '1'; t.setAttribute('aria-hidden', 'true');
    t.style.cssText = 'position:absolute;pointer-events:none;margin:0;opacity:0';
    twins.set(c, t);
  }
  if (t.previousElementSibling !== c) c.after(t);
  // the same box and transform as the layer, in the same containing block
  const cs = getComputedStyle(c);
  t.style.left = c.offsetLeft + 'px'; t.style.top = c.offsetTop + 'px';
  t.style.width = c.offsetWidth + 'px'; t.style.height = c.offsetHeight + 'px';
  t.style.transform = cs.transform === 'none' ? '' : cs.transform; t.style.transformOrigin = cs.transformOrigin;
  t.style.zIndex = cs.zIndex === 'auto' ? '' : cs.zIndex;
  if (t.width !== c.width || t.height !== c.height) { t.width = c.width; t.height = c.height; }
  return t;
}

function frame(now) {
  const dt = Math.min(64, now - (last || now)); last = now;
  const G = green();
  for (const [cv, s] of on) {
    s.a = reduce ? s.want : Math.max(0, Math.min(1, s.a + (s.want ? 1 : -1) * (dt / EASE)));
    const done = (!s.want && s.a <= 0) || !cv.isConnected, k = s.a * s.a * (3 - 2 * s.a);
    for (const c of layers(cv)) {
      if (done) { const t = twins.get(c); if (t) t.remove(); continue; }
      if (!c.width) continue;
      const t = twinOf(c), g = t.getContext('2d');
      g.globalCompositeOperation = 'copy'; g.drawImage(c, 0, 0);
      g.globalCompositeOperation = 'source-in'; g.fillStyle = G; g.fillRect(0, 0, t.width, t.height);
      g.globalCompositeOperation = 'source-over';
      t.style.opacity = String(k * (parseFloat(getComputedStyle(c).opacity) || 1));
    }
    if (done) on.delete(cv);
  }
  if (on.size) raf = requestAnimationFrame(frame);
  else { raf = 0; last = 0; }
}

function set(cv, want) {
  const ls = layers(cv); cv = ls[ls.length - 1];                      // one entry per field, keyed by its top layer
  if (!want && !on.has(cv)) return;
  const s = on.get(cv) || { a: 0 }; s.want = want; on.set(cv, s);
  if (!raf) raf = requestAnimationFrame(frame);
}

export function greenOnHover(root = document, only = '.item__stage canvas, #panel-field') {
  const field = (e) => (e.target instanceof HTMLCanvasElement && !isTwin(e.target) && e.target.matches(only) ? e.target : null);
  root.addEventListener('pointerover', (e) => { const cv = field(e); if (cv && e.pointerType === 'mouse') set(cv, 1); });
  root.addEventListener('pointerout', (e) => { const cv = field(e); if (cv && !(e.relatedTarget && cv.contains(e.relatedTarget))) set(cv, 0); });
}
