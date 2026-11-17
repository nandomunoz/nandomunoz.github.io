// Trama · the lever with three stops (ES, EN, AR), six takes (sandbox only). Same markup
// as tres.js: a group that keeps its left-to-right order whatever the page's direction,
// each code a link with its lang and its name, the page's language as aria-current text;
// the track, the mark, the nodes and the caption are decoration (aria-hidden).
import { themeSwitch } from '../shared/theme.js';

const LANGS = [['es', 'ES', 'Español', 'idioma actual'], ['en', 'EN', 'English', 'current language'], ['ar', 'AR', 'العربية', 'اللغة الحالية']];
const SAMPLE = { es: ['Bio', 'Proyectos', 'Blog'], en: ['Bio', 'Projects', 'Blog'], ar: ['نبذة', 'المشاريع', 'المدونة'] };
const FOOT = { es: ['Sobre esta web', 'Privacidad', 'Cookies', 'Preferencias', 'Idioma'], en: ['About this site', 'Privacy', 'Cookies', 'Preferences', 'Language'], ar: ['عن الموقع', 'الخصوصية', 'ملفات تعريف الارتباط', 'التفضيلات', 'اللغة'] };
const TAKES = [
  ['01', 'Un punto debajo', 'p1', 'La que te gustó: la pista de puntos bajo los códigos y un punto verde que descansa bajo el idioma activo.'],
  ['02', 'Tramo encendido', 'p2', 'En vez de un punto, un tramo de puntos verdes bajo el idioma activo, como el subrayado de puntos de la paginación y del menú. La pista se lee como «un sitio entre tres» y el idioma activo como «la línea encendida», sin inventar un símbolo nuevo.'],
  ['03', 'Paradas con nodos', 'p3', 'Un anillo en cada parada unidos por la línea de puntos, y el activo relleno. Se ve que son tres sitios fijos y que estás en uno. Es la más explicada y la que más se parece a un paso a paso.'],
  ['04', 'Pista encima', 'p4', 'La marca arriba de los códigos y no debajo: queda más pegada a la línea de enlaces de la cabecera y deja el texto en la base de la línea. Cambia poco, pero cambia cómo se alinea con los enlaces.'],
  ['05', 'Resplandor', 'p5', 'Sin marca única: los puntos de la pista se encienden en verde alrededor del idioma activo y se apagan con la distancia. Es la más de la casa (la trama que se enciende) y la más delicada: si hay poca luz se ve poco.'],
  ['06', 'Con el nombre', 'p6', 'El punto y, debajo, el nombre del idioma activo en su propia lengua («Español», «English», «العربية»). Dice entero lo que el código abrevia. Es la más alta: una tercera línea en la cabecera y el pie.']
];
const el = (tag, props = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) { if (v == null) continue; if (k === 'text') n.textContent = v; else n.setAttribute(k, v); }
  n.append(...kids.filter(Boolean)); return n;
};
let cur = 'es', prev = 'es';
const idx = (l) => LANGS.findIndex((x) => x[0] === l);
const langs = (id, extra = '') => el('span', { class: `langs langs--p langs--${id} ${extra}`.trim(), role: 'group', 'aria-label': { es: 'Idioma', en: 'Language', ar: 'اللغة' }[cur], dir: 'ltr' },
  ...LANGS.map(([l, code, name, now], i) => l === cur
    ? el('span', { class: 'langs__cur', 'data-i': i, lang: l, 'aria-current': 'true' }, code, el('span', { class: 'vh', text: ` · ${name}, ${now}` }))
    : el('a', { href: '#', 'data-i': i, 'data-lang': l, hreflang: l, lang: l, 'aria-label': name, title: name, text: code })),
  el('span', { class: 'langs__track', 'aria-hidden': 'true' }),
  ...(id === 'p3' ? [0, 1, 2].map((n) => el('span', { class: 'langs__node', 'data-n': n, 'aria-hidden': 'true' })) : []),
  el('span', { class: 'langs__thumb', 'aria-hidden': 'true', style: `--pos:${idx(prev)}`, 'data-pos': idx(cur) }),
  id === 'p6' ? el('span', { class: 'langs__name', 'aria-hidden': 'true', lang: cur, style: `grid-column:${idx(cur) + 1}`, text: LANGS[idx(cur)][2] }) : null);
const dir = () => (cur === 'ar' ? 'rtl' : 'ltr');
const ctxHead = (id) => el('div', { class: 'ctx', dir: dir(), lang: cur },
  el('a', { class: 'ctx__mark', href: '#' }, el('span', { 'aria-hidden': 'true', text: 'NM' }), 'Nando Muñoz'),
  el('span', { class: 'ctx__links' }, ...SAMPLE[cur].map((t) => el('a', { href: '#', text: t }))),
  langs(id, 'top__lang'));
const ctxFoot = (id) => { const f = FOOT[cur]; return el('div', { class: 'vfoot', dir: dir(), lang: cur },
  el('div', {}, el('p', { class: 'foot__h', text: f[0] }), el('ul', {}, ...f.slice(1, 3).map((t) => el('li', {}, el('a', { href: '#', text: t }))))),
  el('div', {}, el('p', { class: 'foot__h', text: f[3] }), el('ul', {}, el('li', { class: 'foot__pref' }, el('span', { class: 'foot__k', text: f[4] }), langs(id, 'foot__lang'))))); };
const render = () => {
  document.getElementById('slots').replaceChildren(...TAKES.map(([n, name, id, idea]) => el('section', { class: 'vx', id },
    el('p', { class: 'vx__tag' }, el('b', { text: n }), name),
    el('p', { class: 'vx__idea', text: idea }),
    el('div', { class: 'vx__row vx__row--wide' },
      el('div', {}, el('p', { class: 'vx__cap', text: 'En la cabecera, junto a los enlaces de la web' }), ctxHead(id)),
      el('div', {}, el('p', { class: 'vx__cap', text: 'En el pie, en «Preferencias»' }), ctxFoot(id))))));
  requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll('.langs__thumb').forEach((t) => t.style.setProperty('--pos', t.dataset.pos))));
};
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('[data-lang]');
  if (a) { e.preventDefault(); prev = cur; cur = a.dataset.lang; document.documentElement.lang = cur; render(); }
  else if (e.target.closest?.('.ctx a, .vfoot a')) e.preventDefault();
});
render();
themeSwitch();
