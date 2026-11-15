// Trama · the cookie banner: LUZ's <luz-cookie-consent> (@luz-ds/catalog,
// vendored in /assets/vendor/luz/cookie-consent.min.js by tools/luz-sync.mjs)
// with its markup written here in both languages and its look in
// maqueta/style.css (.luz-cookie-consent: Trama's charcoal, dots and type).
//
// The site sets no cookies of its own and has no analytics: the one thing to
// ask about is YouTube, whose player (youtube-nocookie.com) and thumbnails
// only load in a post when "youtube" is granted. LUZ's behaviour is kept as
// it is: fixed at the bottom without taking focus (here a small card in the
// corner rather than a full band), Accept and Reject side by side, a
// choice that closes it at once (no "Saved" step: a live region says it), the choice in localStorage ("luz-consent") for 180 days, and a
// "Cookies" button in the footer that opens it again. The choices, which LUZ
// keeps in a <details>, open here in a modal <dialog> (Settings). No JS → no banner
// (nothing third-party loads either).
//
//   import { consent, allowed, grant } from '../shared/consent.js';
//   consent();               // after the footer is in the page
//   allowed('youtube')       // → true / false
//   grant('youtube')         // store it from a post's own "watch here" button
import { getConsent } from '/assets/vendor/luz/cookie-consent.min.js';
import { lang } from './content.js';
import { el, url } from '../blog/parts.js';

const KEY = 'luz-consent';
const POLICY = url('/cookies/'); // the policy page (shared/cookies-policy.js)
const VERSION = 'soynando-2026-11'; // the policy shown, stored with each choice

export const CT = {
  es: {
    title: 'Cookies',
    text: 'Sin cookies propias. Solo los vídeos de YouTube las usan, si los cargas.',
    policy: 'Política de cookies', policyMore: 'Leer la política de cookies',
    all: 'Aceptar', none: 'Rechazar', choose: 'Ajustes',
    dialog: 'Ajustes de cookies', dialogText: 'Esta web no usa cookies propias ni analítica. Elige qué puede cargarse desde fuera:',
    legend: 'Contenido externo',
    youtube: 'Vídeos de YouTube', youtubeHint: 'El reproductor y las miniaturas (youtube-nocookie.com). YouTube guarda sus cookies al reproducir.',
    save: 'Guardar', cancel: 'Cancelar',
    done: 'Guardado. Cámbialo desde «Ajustes de cookies», en el pie.', close: 'Cerrar',
    saved: 'Preferencias de cookies guardadas. Puedes cambiarlas desde «Ajustes de cookies», en el pie.',
    open: 'Ajustes de cookies',
    gate: 'Este vídeo está en YouTube. Para verlo aquí hay que aceptar sus cookies; si prefieres no hacerlo, puedes verlo en YouTube.',
    gateYes: 'Aceptar y ver aquí', gateNo: 'Ver en YouTube', newTab: '(se abre en otra pestaña)'
  },
  en: {
    title: 'Cookies',
    text: 'No cookies of our own. Only YouTube videos use them, if you load them.',
    policy: 'Cookie policy', policyMore: 'Read the cookie policy',
    all: 'Accept', none: 'Reject', choose: 'Settings',
    dialog: 'Cookie settings', dialogText: 'This site sets no cookies of its own and no analytics. Choose what may load from elsewhere:',
    legend: 'Outside content',
    youtube: 'YouTube videos', youtubeHint: 'The player and thumbnails (youtube-nocookie.com). YouTube stores its cookies when a video plays.',
    save: 'Save', cancel: 'Cancel',
    done: 'Saved. Change it from “Cookie settings” in the footer.', close: 'Close',
    saved: 'Cookie preferences saved. You can change them from “Cookie settings” in the footer.',
    open: 'Cookie settings',
    gate: 'This video is on YouTube. To watch it here, its cookies have to be accepted; if you would rather not, you can watch it on YouTube.',
    gateYes: 'Accept and watch here', gateNo: 'Watch on YouTube', newTab: '(opens in a new tab)'
  }
}[lang];

export const allowed = (name) => !!getConsent(KEY)?.granted.includes(name);

// A post's "watch here" counts as a choice: stored in LUZ's own record, and
// announced with LUZ's event, as if it had been ticked in the banner.
export function grant(name) {
  const now = Date.now(), before = getConsent(KEY) ?? { asked: [], granted: [] };
  const record = { policy: VERSION, asked: [...new Set([...before.asked, name])], granted: [...new Set([...before.granted, name])], expires: now + 180 * 864e5, given: new Date(now).toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify({ version: 1, ...record })); } catch { /* storage blocked: this page only */ }
  document.dispatchEvent(new CustomEvent('luz:consent', { detail: { ...record, withdrawn: [] } }));
}

export function consent() {
  if (document.querySelector('luz-cookie-consent')) return;
  const btn = (value, text, cls = '') => el('button', { class: `consent__btn ${cls}`.trim(), value, text });
  // the choices live in a modal <dialog> of their own, inside LUZ's section
  // so that its script still finds the checkbox and gets the Save submit
  const settings = el('button', { type: 'button', class: 'consent__btn consent__btn--quiet', 'aria-haspopup': 'dialog', text: CT.choose });
  const cancel = el('button', { type: 'button', class: 'consent__btn consent__btn--quiet', text: CT.cancel });
  const choices = el('form', {},
    el('p', { class: 'consent__lead', text: CT.dialogText }),
    el('fieldset', {},
      el('legend', { text: CT.legend }),
      el('label', { class: 'consent__check' },
        el('input', { type: 'checkbox', name: 'youtube', value: 'youtube', 'aria-describedby': 'consent-yt' }),
        el('span', { text: CT.youtube })),
      el('p', { class: 'consent__hint', id: 'consent-yt', text: CT.youtubeHint })),
    el('p', { class: 'consent__policy' }, el('a', { href: POLICY, text: CT.policyMore })),
    el('div', { class: 'consent__actions' }, btn('save', CT.save), cancel));
  const dialog = el('dialog', { class: 'consent__dialog', 'aria-labelledby': 'consent-dialog-title' },
    el('h2', { class: 'consent__dialog-title', id: 'consent-dialog-title', text: CT.dialog }), choices);
  settings.addEventListener('click', () => dialog.showModal());
  cancel.addEventListener('click', () => dialog.close());
  // Save: the dialog closes first, then LUZ (listening on the section) stores
  // the choice and moves focus to its confirmation
  choices.addEventListener('submit', () => dialog.close());
  dialog.addEventListener('click', (e) => e.target === dialog && dialog.close()); // a click on the backdrop
  const banner = el('luz-cookie-consent', {},
    el('section', { class: 'luz-cookie-consent', 'data-luz-consent': '', 'data-luz-consent-key': KEY, 'data-luz-consent-policy': VERSION, 'aria-labelledby': 'consent-title', hidden: '' },
      el('div', { class: 'consent__ask', 'data-luz-consent-ask': '' },
        el('h2', { class: 'luz-cookie-consent__title', id: 'consent-title', text: CT.title }),
        el('p', { class: 'consent__text' }, CT.text, ' ', el('a', { href: POLICY, text: CT.policy }), '.'),
        el('div', { class: 'consent__row' },
          el('form', { class: 'consent__actions' }, btn('all', CT.all), btn('none', CT.none)),
          settings),
        dialog),
      el('div', { class: 'consent__done', 'data-luz-consent-done': '', tabindex: '-1', hidden: '' },
        el('p', { text: CT.done }),
        el('button', { class: 'consent__btn', type: 'button', 'data-luz-consent-close': '', text: CT.close }))));
  // the way back in, in the footer (hidden, its room kept, until the script
  // runs); before the banner goes in, since LUZ wires the open buttons then
  const foot = document.querySelector('.foot__nav ul');
  if (foot && !foot.querySelector('[data-luz-consent-open]'))
    foot.append(el('li', {}, el('a', { href: POLICY, text: CT.policy })),
      el('li', {}, el('button', { type: 'button', class: 'foot__consent', 'data-luz-consent-open': '', hidden: '', text: CT.open })));
  // first in the page after the skip link: where LUZ wants it when the window
  // is too short for a fixed card
  const skip = document.querySelector('.skip');
  if (skip) skip.after(banner); else document.body.prepend(banner);
  const box = banner.querySelector('[data-luz-consent]');
  pillRoom(box);
  closeOnChoice(box);
}

// Once a choice is made — Accept, Reject, Save in the settings, or a post's
// "Accept and watch here" — the card goes away at once (LUZ would show a
// "Saved" step first). The news goes to screen readers in a polite live
// region; focus, if it was in the card, goes back to the footer's Cookies
// button when that opened it, else to <main> without scrolling the page.
function closeOnChoice(box) {
  const status = el('p', { class: 'vh', role: 'status' });
  document.body.append(status);
  let opener = null;
  document.querySelector('[data-luz-consent-open]')?.addEventListener('click', (e) => { opener = e.currentTarget; });
  document.addEventListener('luz:consent', () => {
    const hadFocus = box.contains(document.activeElement);
    box.hidden = true;
    document.documentElement.style.removeProperty('--luz-consent-h');
    status.textContent = '';
    setTimeout(() => { status.textContent = CT.saved; }, 50);
    if (hadFocus) {
      const to = opener?.isConnected ? opener : document.querySelector('main');
      if (to?.localName === 'main' && !to.hasAttribute('tabindex')) to.tabIndex = -1;
      to?.focus({ preventScroll: true });
    }
    opener = null;
  });
}

// The docked pill moves to the left edge while the card shows: it stays on
// the card's line when it fits to its left, else it rides on top of it
// (body[data-consent="stack"], read by style.css). Measured, since the pill's
// width depends on the language and the width of the window.
function pillRoom(box) {
  const nav = document.querySelector('.nav');
  if (!nav || !box) return;
  const fit = () => {
    delete document.body.dataset.consent;
    if (box.hidden) return;
    const n = nav.getBoundingClientRect(), c = box.getBoundingClientRect();
    if (n.right + 12 > c.left && n.left < c.right) document.body.dataset.consent = 'stack';
  };
  const ro = new ResizeObserver(fit);
  ro.observe(nav); ro.observe(box);
  new MutationObserver(fit).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  // the card came or went: let the pill glide to its new place
  let t;
  new MutationObserver(() => {
    document.body.dataset.glide = '';
    clearTimeout(t); t = setTimeout(() => delete document.body.dataset.glide, 1000);
    fit();
  }).observe(box, { attributes: true, attributeFilter: ['hidden'] });
}
