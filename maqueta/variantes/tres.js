// Trama · the lever between the codes with three languages: ES, EN and AR (sandbox only).
// The group keeps its own left-to-right order whatever the page's direction; the code is
// in Latin letters (as ES and EN), the name in Arabic goes in the lang="ar" link's label.
import { themeSwitch } from '../shared/theme.js';

const LANGS = [['es', 'ES', 'Español', 'idioma actual', 'ltr'], ['en', 'EN', 'English', 'current language', 'ltr'], ['ar', 'AR', 'العربية', 'اللغة الحالية', 'rtl']];
const SAMPLE = { es: ['Bio', 'Proyectos', 'Blog'], en: ['Bio', 'Projects', 'Blog'], ar: ['نبذة', 'المشاريع', 'المدونة'] };
const FOOT = { es: ['Sobre esta web', 'Privacidad', 'Cookies', 'Preferencias', 'Idioma'], en: ['About this site', 'Privacy', 'Cookies', 'Preferences', 'Language'], ar: ['عن الموقع', 'الخصوصية', 'ملفات تعريف الارتباط', 'التفضيلات', 'اللغة'] };
const TAKES = [
  ['01', 'Palanca con tres paradas', 't1', 'langs--t1', 'Los tres códigos en fila y debajo una pista de puntos con un punto encendido que descansa bajo el idioma activo (en tinta y negrita) y se desliza al elegir otro. Es la palanca de dos posiciones estirada: con dos se ve como antes, con tres sigue siendo una línea. Cada código sigue siendo un enlace.'],
  ['02', 'Píldora con tres sitios', 't2', 'langs--t2', 'La píldora del interruptor de la web con tres huecos y la pieza de tinta deslizante. Más peso y más ancho (unos 11 rem), pero lee como un control a la primera.']
];
const el = (tag, props = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) { if (v == null) continue; if (k === 'text') n.textContent = v; else n.setAttribute(k, v); }
  n.append(...kids.filter(Boolean)); return n;
};
let cur = 'es', prev = 'es';
const idx = (l) => LANGS.findIndex((x) => x[0] === l);
const langs = (cls, extra = '') => el('span', { class: `langs ${cls} ${extra}`.trim(), role: 'group', 'aria-label': { es: 'Idioma', en: 'Language', ar: 'اللغة' }[cur], dir: 'ltr' },
  ...LANGS.map(([l, code, name, now], i) => l === cur
    ? el('span', { class: 'langs__cur', 'data-i': i, lang: l, 'aria-current': 'true' }, code, el('span', { class: 'vh', text: ` · ${name}, ${now}` }))
    : el('a', { href: '#', 'data-i': i, 'data-lang': l, hreflang: l, lang: l, 'aria-label': name, title: name, text: code })),
  cls === 'langs--t1' ? el('span', { class: 'langs__track', 'aria-hidden': 'true' }) : null,
  el('span', { class: 'langs__thumb', 'aria-hidden': 'true', style: `--pos:${idx(prev)}`, 'data-pos': idx(cur) }));
const dir = () => (cur === 'ar' ? 'rtl' : 'ltr');
const ctxHead = (cls) => el('div', { class: 'ctx', dir: dir(), lang: cur },
  el('a', { class: 'ctx__mark', href: '#' }, el('span', { 'aria-hidden': 'true', text: 'NM' }), 'Nando Muñoz'),
  el('span', { class: 'ctx__links' }, ...SAMPLE[cur].map((t) => el('a', { href: '#', text: t }))),
  langs(cls, 'top__lang'));
const ctxFoot = (cls) => { const f = FOOT[cur]; return el('div', { class: 'vfoot', dir: dir(), lang: cur },
  el('div', {}, el('p', { class: 'foot__h', text: f[0] }), el('ul', {}, ...f.slice(1, 3).map((t) => el('li', {}, el('a', { href: '#', text: t }))))),
  el('div', {}, el('p', { class: 'foot__h', text: f[3] }), el('ul', {}, el('li', { class: 'foot__pref' }, el('span', { class: 'foot__k', text: f[4] }), langs(cls, 'foot__lang'))))); };
const render = () => {
  document.getElementById('slots').replaceChildren(...TAKES.map(([n, name, id, cls, idea]) => el('section', { class: 'vx', id },
    el('p', { class: 'vx__tag' }, el('b', { text: n }), name),
    el('p', { class: 'vx__idea', text: idea }),
    el('div', { class: 'vx__row vx__row--wide' },
      el('div', {}, el('p', { class: 'vx__cap', text: 'En la cabecera, junto a los enlaces de la web' }), ctxHead(cls)),
      el('div', {}, el('p', { class: 'vx__cap', text: 'En el pie, en «Preferencias»' }), ctxFoot(cls))))));
  requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll('.langs__thumb').forEach((t) => t.style.setProperty('--pos', t.dataset.pos))));
};
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('[data-lang]');
  if (a) { e.preventDefault(); prev = cur; cur = a.dataset.lang; document.documentElement.lang = cur; render(); }
  else if (e.target.closest?.('.ctx a, .vfoot a')) e.preventDefault();
});
render();
themeSwitch();
