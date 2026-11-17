// Trama · six takes on the language switch with a state dot (sandbox only; the markup is
// that of blog/parts.js langSwitch: a group, the page's language as aria-current text,
// the other as a link with its lang and its name). 01 is the one in style.css; the rest
// are in interruptor.css. Pressing the other language here only flips the samples.
import { themeSwitch } from '../shared/theme.js';

const LANGS = [['es', 'ES', 'Español', 'idioma actual'], ['en', 'EN', 'English', 'current language']];
const TAKES = [
  ['01', 'El de la web', 's1', 'langs--switch', 'El que está ahora: la pista de puntos, el idioma activo relleno de tinta con su punto encendido y un anillo vacío en el otro.'],
  ['02', 'Con pieza deslizante', 's2', 'langs--sw-b', 'La misma pista, pero el relleno es una pieza que se desliza de un idioma al otro. Se ve que es una palanca de dos posiciones. Si el sistema pide menos movimiento, salta sin animar. En la web real solo se vería deslizarse con la transición entre páginas.'],
  ['03', 'Palanca entre los códigos', 's3', 'langs--sw-c', 'ES, una palanca pequeña con un punto, EN. El punto descansa del lado del idioma activo, que además va en tinta y en negrita. Ocupa lo mismo de ancho pero pesa menos: no hay relleno.'],
  ['04', 'Cuadrado', 's4', 'langs--sw-d', 'Los marcos de la web son rectos y de puntos (las tarjetas, las tablas). El interruptor es un rectángulo de puntos y su punto de estado es un píxel cuadrado.'],
  ['05', 'Relleno de puntos', 's5', 'langs--sw-e', 'El idioma activo no es un bloque de tinta sino una trama de puntos en el verde, como la que llena las imágenes de la web, con un contorno fino. Es la más de la casa y la más ligera.'],
  ['06', 'Solo el destino', 's6', 'langs--sw-f', 'Sin pareja ni pista: una sola píldora con el idioma al que lleva el clic (EN en español, ES en inglés). Es lo que menos sitio ocupa. El idioma actual sigue en el árbol para los lectores de pantalla.']
];
const el = (tag, props = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) { if (v == null) continue; if (k === 'text') n.textContent = v; else n.setAttribute(k, v); }
  n.append(...kids.filter(Boolean)); return n;
};
let cur = 'es', prev = 'es';
const langs = (cls, extra = '') => {
  const slide = cls === 'langs--sw-b', toggle = cls === 'langs--sw-c', dest = cls === 'langs--sw-f';
  const g = el('span', { class: `langs ${cls}${toggle ? ` is-${cur}` : ''} ${extra}`.trim(), role: 'group', 'aria-label': 'Idioma' },
    ...LANGS.flatMap(([l, code, name, now], i) => [
      toggle && i ? el('span', { class: 'langs__sep', 'aria-hidden': 'true', text: '·', 'data-toggle': '' }) : null,
      l === cur
        ? el('span', { class: 'langs__cur', 'data-i': i, lang: l, 'aria-current': 'true' }, code, el('span', { class: 'vh', text: ` · ${name}, ${now}` }))
        : el('a', { href: '#', 'data-i': i, 'data-lang': l, hreflang: l, lang: l, 'aria-label': name, title: name, text: code })].filter(Boolean)),
    slide ? el('span', { class: 'langs__thumb', 'aria-hidden': 'true', style: `--pos:${LANGS.findIndex((x) => x[0] === prev)}`, 'data-pos': LANGS.findIndex((x) => x[0] === cur) }) : null);
  return g;
};
const ctxHead = (cls) => el('div', { class: 'ctx' },
  el('a', { class: 'ctx__mark', href: '#' }, el('span', { 'aria-hidden': 'true', text: 'NM' }), 'Nando Muñoz'),
  el('span', { class: 'ctx__links' }, ...['Bio', 'Proyectos', 'Blog'].map((t) => el('a', { href: '#', text: t }))),
  langs(cls, 'top__lang'));
const ctxFoot = (cls) => el('div', { class: 'vfoot' },
  el('div', {}, el('p', { class: 'foot__h', text: 'Sobre esta web' }), el('ul', {}, ...['Privacidad', 'Cookies', 'Créditos y licencia'].map((t) => el('li', {}, el('a', { href: '#', text: t }))))),
  el('div', {}, el('p', { class: 'foot__h', text: 'Preferencias' }), el('ul', {}, el('li', { class: 'foot__pref' }, el('span', { class: 'foot__k', text: 'Idioma' }), langs(cls, 'foot__lang')))));
const render = () => {
  document.getElementById('slots').replaceChildren(...TAKES.map(([n, name, id, cls, idea]) => el('section', { class: 'vx', id },
    el('p', { class: 'vx__tag' }, el('b', { text: n }), name),
    el('p', { class: 'vx__idea', text: idea }),
    el('div', { class: 'vx__row vx__row--wide' },
      el('div', {}, el('p', { class: 'vx__cap', text: 'En la cabecera, junto a los enlaces de la web' }), ctxHead(cls)),
      el('div', {}, el('p', { class: 'vx__cap', text: 'En el pie, en «Preferencias»' }), ctxFoot(cls))))));
  // the sliding thumb starts where it was and goes where it is now
  requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll('.langs__thumb').forEach((t) => t.style.setProperty('--pos', t.dataset.pos))));
};
document.addEventListener('click', (e) => {
  const t = e.target.closest?.('[data-toggle]');
  const a = t ? t.parentElement.querySelector('[data-lang]') : e.target.closest?.('[data-lang]');
  if (a) { e.preventDefault(); prev = cur; cur = a.dataset.lang; document.documentElement.lang = cur; render(); }
  else if (e.target.closest?.('.ctx a, .vfoot a')) e.preventDefault();
});
render();
themeSwitch();
