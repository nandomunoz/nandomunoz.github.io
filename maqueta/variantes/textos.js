// Trama · the Cartel invertido take on the hero's three texts (name, role, motto) over the rain.
// Each section runs the home's own rain (rain.js: the cycle, in dots, a circular
// scan on click) and lays the copy over it. Sandbox only.
import { RainField } from '../rain.js';
import { themeSwitch, onMode } from '../shared/theme.js';
import { content } from '../shared/content.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js', reduce ? 'still' : 'moving');
const c = await content().catch(() => null) || { name: 'Nando Muñoz', kicker: '', deck: '' };
c.deck = 'Proyecto, el motivo. Humano, el centro. TecnologIA, sólo el medio';   // this take's own motto (the site's stays in data/site.json)

// the key words set apart in the accent (and the «IA» inside «TecnologIA»)
const KEY = /(Proyecto|Humano|IA|motivo|centro|medio)/;            // the words set apart in this take's motto
const GREEN = new Set(['Proyecto', 'Humano', 'IA']);                // in the accent (and the «IA» inside «TecnologIA»)
const withIA = (text) => text.split(KEY).map((s, i) => {
  if (i % 2 === 0) return document.createTextNode(s);
  if (GREEN.has(s)) { const b = document.createElement('b'); b.className = 'ia'; b.textContent = s; return b; }
  const e = document.createElement('em'); e.textContent = s; return e;   // «motivo», «centro», «medio»: in italics
});

const fields = [];
for (const sec of document.querySelectorAll('.tx')) {
  sec.querySelectorAll('[data-slot]').forEach((n) => {
    const text = c[n.dataset.slot] || '';
    if (n.hasAttribute('data-ia')) {
      // one line per sentence, as a poster sets it («Proyecto, el motivo.» / «Humano, el centro.» / …)
      const parts = text.split(/(?<=\.)\s+/);
      n.replaceChildren(...parts.map((s) => { const l = document.createElement('span'); l.className = 'l'; l.append(...withIA(s)); return l; }));
    }
    else if (n.hasAttribute('data-words')) {
      // word by word, each with its own delay; the words keep their spaces for screen readers
      n.replaceChildren(...text.split(' ').flatMap((w, i, all) => {
        const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i + 2);
        s.append(...withIA(w));
        return i < all.length - 1 ? [s, document.createTextNode(' ')] : [s];
      }));
    } else n.textContent = text;
  });

  const cv = sec.querySelector('canvas');
  const f = new RainField(cv, { mask: 'cycle', name: c.name, dots: true });
  fields.push(f);
  cv.addEventListener('pointerdown', (e) => { const r = cv.getBoundingClientRect(); f.poke(e.clientX - r.left, e.clientY - r.top); });
  new ResizeObserver(() => f.layout()).observe(cv);
  new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { f.start(); sec.classList.add('is-in'); } else f.stop();
  }, { threshold: 0.2 }).observe(sec);
}

themeSwitch();
onMode(() => fields.forEach((f) => f.repaint()));
