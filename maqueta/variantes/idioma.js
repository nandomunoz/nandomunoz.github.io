// Trama · the language switch in four takes (sandbox only). The markup is the one of
// blog/parts.js (langSwitch): a group, the page's language as aria-current text, the
// other as a link with its lang and its name; the takes differ in look (idioma.css),
// the third also in what it writes (the name instead of the code), the second in a
// globe drawn in dots. Pressing the other language here only flips the samples.
import { themeSwitch } from '../shared/theme.js';

const LANGS = [['es', 'ES', 'Español', 'idioma actual'], ['en', 'EN', 'English', 'current language']];
const TAKES = [
  ['01', 'El interruptor', 'v1', 'Una pista de puntos con el idioma activo relleno en tinta, como un interruptor de dos posiciones. Un enlace es una palabra; esto es un control. Es lo que más se separa de los enlaces y lo que más sitio ocupa.'],
  ['02', 'El globo', 'v2', 'Un globo dibujado con puntos delante de los códigos, y todo lo demás como hoy. El símbolo dice «idioma» antes que las letras. Cuesta poco: un solo SVG decorativo.'],
  ['03', 'Con su nombre', 'v3', '«Español · English» en su propia tipografía de lectura (Archivo, minúsculas), no en el mono de los lugares de la web. Se distingue por la letra y cada idioma se nombra en sí mismo.'],
  ['05', 'Interruptor con punto de estado', 'v5', 'La mezcla de 01 y 04: la pista de puntos con el idioma activo relleno en tinta, y delante de cada idioma el punto de estado (verde encendido en el activo, anillo vacío en el otro). Es la que se aplica en la cabecera y en el pie.'],
  ['04', 'El punto de estado', 'v4', 'La gramática de un botón de radio: un punto delante de cada idioma, relleno y verde en el activo, un anillo vacío en el otro. Sin subrayados: nada se parece a un enlace.']
];
const el = (tag, props = {}, ...kids) => {
  const n = document.createElementNS(props.ns || 'http://www.w3.org/1999/xhtml', tag);
  for (const [k, v] of Object.entries(props)) { if (k === 'ns' || v == null) continue; if (k === 'text') n.textContent = v; else n.setAttribute(k, v); }
  n.append(...kids.filter(Boolean)); return n;
};
const SVG = 'http://www.w3.org/2000/svg';
// a globe in dots: a 9×9 grid, the points inside the circle, the equator and the meridian a little larger
const globe = () => {
  const dots = [];
  for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) {
    if (Math.hypot(x - 4, y - 4) > 4.2) continue;
    dots.push(el('circle', { ns: SVG, cx: x * 2 + 1, cy: y * 2 + 1, r: x === 4 || y === 4 ? 1 : 0.62 }));
  }
  return el('svg', { ns: SVG, class: 'langs__globe', viewBox: '0 0 18 18', 'aria-hidden': 'true', focusable: 'false' }, ...dots);
};
let cur = 'es';
const langs = (v, cls = '') => {
  const byName = v === 'v3';
  return el('span', { class: `langs langs--${v}${v === 'v5' ? ' langs--switch' : ''} ${cls}`.trim(), role: 'group', 'aria-label': 'Idioma' },
    v === 'v2' ? globe() : null,
    ...LANGS.flatMap(([l, code, name, now], i) => [
      i && v !== 'v1' && v !== 'v4' && v !== 'v5' ? el('span', { class: 'langs__sep', 'aria-hidden': 'true', text: '·' }) : null,
      l === cur
        ? el('span', { class: 'langs__cur', lang: l, 'aria-current': 'true' }, byName ? name : code, el('span', { class: 'vh', text: ` · ${name}, ${now}` }))
        : el('a', { href: '#', 'data-lang': l, hreflang: l, lang: l, ...(byName ? {} : { 'aria-label': name, title: name }), text: byName ? name : code })].filter(Boolean)));
};
const ctxHead = (v) => el('div', { class: 'ctx' },
  el('a', { class: 'ctx__mark', href: '#' }, el('span', { 'aria-hidden': 'true', text: 'NM' }), 'Nando Muñoz'),
  el('span', { class: 'ctx__links' }, ...['Bio', 'Proyectos', 'Blog'].map((t) => el('a', { href: '#', text: t }))),
  langs(v, 'top__lang'));
const ctxFoot = (v) => el('div', { class: 'vfoot' },
  el('div', {}, el('p', { class: 'foot__h', text: 'Sobre esta web' }), el('ul', {}, ...['Privacidad', 'Cookies', 'Créditos y licencia'].map((t) => el('li', {}, el('a', { href: '#', text: t }))))),
  el('div', {}, el('p', { class: 'foot__h', text: 'Preferencias' }), el('ul', {}, el('li', { class: 'foot__pref' }, el('span', { class: 'foot__k', text: 'Idioma' }), langs(v, 'foot__lang')))));
const render = () => {
  const slots = document.getElementById('slots');
  slots.replaceChildren(...TAKES.map(([n, name, v, idea]) => el('section', { class: 'vx', id: v },
    el('p', { class: 'vx__tag' }, el('b', { text: n }), name),
    el('p', { class: 'vx__idea', text: idea }),
    el('div', { class: 'vx__row' },
      el('div', {}, el('p', { class: 'vx__cap', text: 'En la cabecera, junto a los enlaces de la web' }), ctxHead(v)),
      el('div', {}, el('p', { class: 'vx__cap', text: 'En el pie, en «Preferencias»' }), ctxFoot(v))))));
};
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('[data-lang]');
  if (a) { e.preventDefault(); cur = a.dataset.lang; document.documentElement.lang = cur; render(); document.querySelector(`[data-lang]`)?.blur(); }
  else if (e.target.closest?.('.ctx a, .vfoot a')) e.preventDefault();
});
render();
themeSwitch();
