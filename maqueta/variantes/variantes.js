// Trama · the hero's rain, in four takes (the engine is ../rain.js): 01 the name as
// the mask, 02 the poster's cats, 03 the desk picture, 04 the three in turn (the one
// on the home). A click scans in a circle. Sandbox only.
import { RainField } from '../rain.js';
import { themeSwitch, onMode } from '../shared/theme.js';
import { content } from '../shared/content.js';

const c = await content().catch(() => null) || { name: 'Nando Muñoz', kicker: '', deck: '' };
const tpl = document.getElementById('copy');
const fields = [];
for (const sec of document.querySelectorAll('.vx')) {
  sec.append(tpl.content.cloneNode(true));
  sec.querySelectorAll('[data-slot]').forEach((n) => { n.textContent = c[n.dataset.slot]; });
  const cv = sec.querySelector('canvas');
  const f = new RainField(cv, { mask: sec.dataset.mask || 'name', name: c.name, ...(sec.dataset.src ? { src: sec.dataset.src } : {}) });
  fields.push(f);
  cv.addEventListener('pointerdown', (e) => { const r = cv.getBoundingClientRect(); f.poke(e.clientX - r.left, e.clientY - r.top); });
  new ResizeObserver(() => f.layout()).observe(cv);
  new IntersectionObserver(([en]) => (en.isIntersecting ? f.start() : f.stop()), { threshold: 0.05 }).observe(sec);
}
themeSwitch();
onMode(() => fields.forEach((f) => f.repaint()));
