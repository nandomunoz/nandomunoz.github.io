// The colour mode: LUZ's <luz-theme-mode> as one round button fixed at the bottom of the window (plan
// Phase 4; ported from the maqueta's shared/theme.js). A click steps light → high contrast → dark; the
// choice is kept in localStorage ("luz-theme") only once the visitor makes it. There is no Auto: the
// site is dark unless chosen otherwise, or unless the system asks for more contrast. Before the first
// paint the <head> writes data-mode on <html> (a one-line script), so there is no flash.
// The mode changes as a circle that grows out of the button (a View Transition on the root).
import '@luz-ds/core/theme-mode';

const root = document.documentElement;
const lang = root.lang.startsWith('ar') ? 'ar' : root.lang.startsWith('en') ? 'en' : 'es';
const T = {
  es: { legend: 'Modo de color', light: 'Claro', 'high-contrast': 'Contraste alto', dark: 'Oscuro' },
  en: { legend: 'Colour mode', light: 'Light', 'high-contrast': 'High contrast', dark: 'Dark' },
  ar: { legend: 'نمط الألوان', light: 'فاتح', 'high-contrast': 'تباين عالٍ', dark: 'داكن' }
}[lang];
const ICON = {
  light: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  'high-contrast': '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/>',
  dark: '<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10Z"/>'
};
const BG = { light: '#e9eff5', dark: '#292929', 'high-contrast': '#000' }; // <meta name="theme-color">
const now = () => root.dataset.mode || 'dark';

// LUZ's element wants a radio group; it stays in the page (hidden by CSS) because it holds the state. A
// disabled `auto` radio is only the starting state: it carries the icon and name of the mode the page
// opened in, so the button never shows blank and a click never lands back on it.
const option = (value, mode, disabled = false) =>
  `<label class="luz-theme-mode__option"><input class="luz-theme-mode__input" type="radio" name="luz-theme-mode" value="${value}"${disabled ? ' disabled' : ''}>` +
  `<svg class="luz-theme-mode__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON[mode]}</svg>${T[mode]}</label>`;
document.body.insertAdjacentHTML('beforeend',
  `<luz-theme-mode><fieldset class="luz-theme-mode__group"><legend class="luz-theme-mode__legend">${T.legend}</legend>` +
  [option('auto', now(), true), option('light', 'light'), option('high-contrast', 'high-contrast'), option('dark', 'dark')].join('') +
  '</fieldset></luz-theme-mode>');

const el = document.querySelector('luz-theme-mode');
el.autoMode = () => 'dark'; // LUZ's Auto would follow the system's colour scheme; Trama does not
const sync = () => {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BG[now()] || BG.dark);
  document.dispatchEvent(new CustomEvent('trama:mode', { detail: { mode: now() } })); // canvases redraw with the new palette
};
document.addEventListener('luz-theme-mode:change', (e) => {
  sync();
  const auto = el.querySelector('input[value="auto"]')?.closest('label');
  if (e.detail.auto && auto && auto.textContent.trim() !== T[e.detail.mode]) {
    auto.querySelector('.luz-theme-mode__icon').innerHTML = ICON[e.detail.mode];
    auto.lastChild.textContent = T[e.detail.mode];
    el.refresh(); // the button's name and icon, again
  }
});
sync();

// The click is caught before LUZ's own handler (capture phase) so the mode changes once, inside the
// transition, to the same next mode LUZ would pick. The radius reaches the farthest corner exactly.
el.addEventListener('click', (e) => {
  const btn = e.target.closest?.('.luz-theme-mode__button');
  if (!btn || !document.startViewTransition || document.visibilityState === 'hidden' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const values = [...el.querySelectorAll('input[type=radio]')].filter((r) => !r.disabled).map((r) => r.value);
  if (!values.length) return;
  const next = values[(values.indexOf(el.choice) + 1) % values.length];
  e.stopImmediatePropagation();
  const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  root.style.setProperty('--vt-x', `${x}px`);
  root.style.setProperty('--vt-y', `${y}px`);
  root.style.setProperty('--vt-r', `${Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)))}px`);
  root.dataset.vt = 'theme';
  const done = () => { if (root.dataset.vt === 'theme') delete root.dataset.vt; };
  try {
    const vt = document.startViewTransition(() => { el.choice = next; });
    vt.finished.then(done, done);
    vt.ready.catch(() => {});
  } catch { el.choice = next; done(); }
}, true);
