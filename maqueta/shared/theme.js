// Trama · the colour mode: LUZ's <luz-theme-mode> (assets/vendor/luz/theme-mode.min.js,
// copied by tools/luz-sync.mjs) as one round button fixed at the bottom right.
// Click steps through light → high contrast → dark → light…; the choice is kept in
// localStorage ("luz-theme") only once the visitor makes it (see the cookie policy).
// There is no Auto to pick: the site is dark unless chosen otherwise, or unless the
// system asks for more contrast. Before the first paint each page's head writes
// data-mode on <html> (a one-line script, so there is no flash); the palettes are in
// style.css, the button's look at the end of it.
//
// LUZ's element wants a radio group; it stays in the page (hidden by CSS) because
// it holds the state. An `auto` radio, disabled, is only the starting state: it
// carries the icon and name of the mode the page opened in, so the button never
// shows blank, and a click never lands back on it.
import { lang } from './content.js';
import { readPalette } from '../dots.js';

const T = {
  es: { legend: 'Modo de color', light: 'Claro', 'high-contrast': 'Contraste alto', dark: 'Oscuro' },
  en: { legend: 'Colour mode', light: 'Light', 'high-contrast': 'High contrast', dark: 'Dark' }
}[lang];
const ICON = {
  light: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  'high-contrast': '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/>',
  dark: '<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10Z"/>'
};
const BG = { light: '#f4f2ee', dark: '#292929', 'high-contrast': '#000' };  // <meta name="theme-color">

const root = document.documentElement;
const now = () => root.dataset.mode || 'dark';

export async function themeSwitch() {
  const option = (value, mode, disabled = false) =>
    `<label class="luz-theme-mode__option"><input class="luz-theme-mode__input" type="radio" name="luz-theme-mode" value="${value}"${disabled ? ' disabled' : ''}>` +
    `<svg class="luz-theme-mode__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON[mode]}</svg>${T[mode]}</label>`;
  document.body.insertAdjacentHTML('beforeend',
    `<luz-theme-mode><fieldset class="luz-theme-mode__group"><legend class="luz-theme-mode__legend">${T.legend}</legend>` +
    [option('auto', now(), true), option('light', 'light'), option('high-contrast', 'high-contrast'), option('dark', 'dark')].join('') +
    '</fieldset></luz-theme-mode>');
  // the palette (canvas colours), the browser's chrome and any page code follow the mode
  const sync = () => {
    readPalette();
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BG[now()] || BG.dark);
  };
  document.addEventListener('luz-theme-mode:change', sync);
  sync();
  await import('/assets/vendor/luz/theme-mode.min.js');
}

// run `fn` whenever the mode changes (a page redraws its dots); `detail.mode` is the new one
export const onMode = (fn) => document.addEventListener('luz-theme-mode:change', (e) => fn(e.detail.mode));
