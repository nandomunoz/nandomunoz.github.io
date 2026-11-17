// Trama · the language switch as a dropdown, ES / EN / AR (sandbox only). A disclosure, not
// an ARIA menu: a button (aria-expanded, aria-controls) and a list of links in a popover, so
// light dismiss, Esc and top-layer come from the platform; the script only places it (under
// the button, or over it when there is no room below, to the button's edge) and moves between
// items with the arrow keys. The current language is plain text with aria-current.
import { themeSwitch } from '../shared/theme.js';

const LANGS = [['es', 'ES', 'Español', 'idioma actual'], ['en', 'EN', 'English', 'current language'], ['ar', 'AR', 'العربية', 'اللغة الحالية']];
const LABEL = { es: 'Idioma', en: 'Language', ar: 'اللغة' };
const SAMPLE = { es: ['Bio', 'Proyectos', 'Blog'], en: ['Bio', 'Projects', 'Blog'], ar: ['نبذة', 'المشاريع', 'المدونة'] };
const FOOT = { es: ['Sobre esta web', 'Privacidad', 'Cookies', 'Preferencias', 'Idioma'], en: ['About this site', 'Privacy', 'Cookies', 'Preferences', 'Language'], ar: ['عن الموقع', 'الخصوصية', 'ملفات تعريف الارتباط', 'التفضيلات', 'اللغة'] };
const el = (tag, props = {}, ...kids) => {
  const n = document.createElementNS(props.ns || 'http://www.w3.org/1999/xhtml', tag);
  for (const [k, v] of Object.entries(props)) { if (k === 'ns' || v == null) continue; if (k === 'text') n.textContent = v; else n.setAttribute(k, v); }
  n.append(...kids.filter(Boolean)); return n;
};
const SVG = 'http://www.w3.org/2000/svg';
const chevron = () => el('svg', { ns: SVG, class: 'lang-dd__chev', viewBox: '0 0 5 3', 'aria-hidden': 'true', focusable: 'false' },
  ...[[.5, .5], [4.5, .5], [1.5, 1.5], [3.5, 1.5], [2.5, 2.5]].map(([cx, cy]) => el('circle', { ns: SVG, cx, cy, r: .5 })));
let cur = 'es', n = 0;
const dropdown = (align) => {
  const id = `lang-dd-${++n}`;
  const btn = el('button', { type: 'button', class: 'lang-dd__btn', 'aria-expanded': 'false', 'aria-controls': id, 'aria-haspopup': 'true', popovertarget: id },
    el('b', { 'aria-hidden': 'true', text: LANGS.find((l) => l[0] === cur)[1] }),
    el('span', { class: 'vh', text: `${LABEL[cur]}: ${LANGS.find((l) => l[0] === cur)[2]}` }), chevron());
  const list = el('ul', { class: 'lang-dd__list', id, popover: 'auto', dir: 'ltr', 'aria-label': LABEL[cur] },
    ...LANGS.map(([l, code, name, now]) => el('li', {}, l === cur
      ? el('span', { class: 'lang-dd__cur', lang: l, 'aria-current': 'true' }, el('span', { class: 'lang-dd__dot', 'aria-hidden': 'true' }), el('span', { class: 'lang-dd__code', 'aria-hidden': 'true', text: code }), el('span', { class: 'lang-dd__name', text: name }), el('span', { class: 'vh', text: `, ${now}` }))
      : el('a', { href: '#', 'data-lang': l, hreflang: l, lang: l }, el('span', { class: 'lang-dd__dot', 'aria-hidden': 'true' }), el('span', { class: 'lang-dd__code', 'aria-hidden': 'true', text: code }), el('span', { class: 'lang-dd__name', text: name })))));
  const place = () => {
    const b = btn.getBoundingClientRect(), h = list.offsetHeight, w = list.offsetWidth, below = innerHeight - b.bottom, up = below < h + 12 && b.top > below;
    list.style.top = `${up ? Math.max(8, b.top - h - 6) : b.bottom + 6}px`;
    const left = align === 'end' ? b.right - w : b.left;
    list.style.left = `${Math.min(Math.max(8, left), innerWidth - w - 8)}px`;
  };
  list.addEventListener('toggle', (e) => {
    const open = e.newState === 'open';
    btn.setAttribute('aria-expanded', open);
    if (open) place();
  });
  list.addEventListener('keydown', (e) => {
    const items = [...list.querySelectorAll('a')], i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); items.at(-1)?.focus(); }
  });
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); list.matches(':popover-open') || list.showPopover(); list.querySelector('a')?.focus(); }
  });
  return el('span', { class: 'lang-dd' }, btn, list);
};
const dir = () => (cur === 'ar' ? 'rtl' : 'ltr');
const ctxHead = () => el('div', { class: 'ctx', dir: dir(), lang: cur },
  el('a', { class: 'ctx__mark', href: '#' }, el('span', { 'aria-hidden': 'true', text: 'NM' }), 'Nando Muñoz'),
  el('span', { class: 'ctx__links' }, ...SAMPLE[cur].map((t) => el('a', { href: '#', text: t }))),
  dropdown(cur === 'ar' ? 'start' : 'end'));
const ctxFoot = () => { const f = FOOT[cur]; return el('div', { class: 'vfoot', dir: dir(), lang: cur },
  el('div', {}, el('p', { class: 'foot__h', text: f[0] }), el('ul', {}, ...f.slice(1, 3).map((t) => el('li', {}, el('a', { href: '#', text: t }))))),
  el('div', {}, el('p', { class: 'foot__h', text: f[3] }), el('ul', {}, el('li', { class: 'foot__pref' }, el('span', { class: 'foot__k', text: f[4] }), dropdown('start'))))); };
const render = () => {
  document.getElementById('slots').replaceChildren(el('section', { class: 'vx' },
    el('div', { class: 'vx__row vx__row--wide' },
      el('div', {}, el('p', { class: 'vx__cap', text: 'En la cabecera, junto a los enlaces de la web' }), ctxHead()),
      el('div', {}, el('p', { class: 'vx__cap', text: 'En el pie, en «Preferencias»' }), ctxFoot())),
    el('div', { style: 'height:55vh' })));
};
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('[data-lang]');
  if (a) { e.preventDefault(); cur = a.dataset.lang; document.documentElement.lang = cur; document.querySelectorAll('.lang-dd__list:popover-open').forEach((l) => l.hidePopover()); render(); }
  else if (e.target.closest?.('.ctx a, .vfoot a')) e.preventDefault();
});
addEventListener('resize', () => document.querySelectorAll('.lang-dd__list:popover-open').forEach((l) => l.hidePopover()));
render();
themeSwitch();
