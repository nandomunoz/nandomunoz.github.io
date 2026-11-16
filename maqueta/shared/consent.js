// Trama · the cookie banner: LUZ's <luz-cookie-consent> (@luz-ds/catalog,
// vendored in /assets/vendor/luz/cookie-consent.min.js by tools/luz-sync.mjs)
// with its markup written here in both languages and its look in
// maqueta/style.css (.luz-cookie-consent: Trama's charcoal, dots and type).
//
// The site sets no cookies of its own and has no analytics: the one thing to
// ask about is YouTube, whose player (youtube-nocookie.com) and thumbnails
// (i.ytimg.com) only load in a post when "youtube" is granted. LUZ's behaviour
// is kept as it is: fixed at the bottom without taking focus (here a small
// card in the corner rather than a full band), Accept and Reject side by side,
// a choice that closes it at once (no "Saved" step: a live region says it), the
// choice in localStorage ("luz-consent", LUZ's own format) for 180 days, and
// an «Ajustes de cookies» button in the footer that opens it again. The
// choices, which LUZ keeps in a <details>, open here in a modal <dialog>
// (Settings). No JS → no banner (nothing third-party loads either). Besides the
// banner, each post's video asks in its own gate (blog/blog.js).
//
// LUZ stores the policy version with each choice but never compares it, so
// nothing here promises that a changed policy asks again (plan, K2).
//
//   import { consent, allowed, grant, openConsent, CT, POLICY } from '../shared/consent.js';
//   consent();               // after the footer is in the page
//   allowed('youtube')       // → true / false
//   grant('youtube')         // store it from a post's own "watch here" button
//   openConsent()            // show the banner again (the footer's button), from any «change» button
import { getConsent } from '/assets/vendor/luz/cookie-consent.min.js';
import { lang } from './content.js';
import { el, url } from '../blog/parts.js';

const KEY = 'luz-consent';
export const POLICY = url('/cookies/'); // the policy page (shared/cookies-policy.js)
const VERSION = 'soynando-2026-11'; // the policy shown, stored with each choice (not compared: see above)

export const CT = {
  es: {
    title: 'Cookies',
    text: 'Sin cookies propias. Solo los vídeos de YouTube las usan, si los cargas.',
    policy: 'Política de cookies', policyMore: 'Leer la política de cookies',
    all: 'Aceptar', none: 'Rechazar', choose: 'Ajustes',
    dialog: 'Ajustes de cookies', dialogText: 'Esta web no usa cookies propias ni cuenta tus visitas. Elige si pueden cargarse vídeos de YouTube:',
    legend: 'Contenido externo',
    youtube: 'Vídeos de YouTube', youtubeHint: 'El reproductor (youtube-nocookie.com) y las fotos pequeñas de los vídeos (i.ytimg.com), de Google. YouTube puede guardar cookies al reproducir. Tu elección vale 180 días.',
    save: 'Guardar', cancel: 'Cancelar',
    done: 'Guardado. Cámbialo desde «Ajustes de cookies», en el pie.', close: 'Cerrar',
    saved: 'Ajustes de cookies guardados. Puedes cambiarlos desde «Ajustes de cookies», en el pie.',
    open: 'Ajustes de cookies',
    video: 'Vídeo de YouTube',
    gate: 'Este vídeo está en YouTube (Google). Para verlo aquí, tu navegador se conectará con Google, que verá tu dirección IP (la de tu conexión) y puede guardar cookies. Recordaré tu «sí» 180 días, para todos los vídeos.',
    gateOr: 'Si prefieres no hacerlo, ábrelo en YouTube: allí valen las normas de YouTube.',
    gateYes: 'Aceptar y ver aquí', gateNo: 'Ver en YouTube', newTab: '(se abre en otra pestaña)'
  },
  en: {
    title: 'Cookies',
    text: 'No cookies of our own. Only YouTube videos use them, if you load them.',
    policy: 'Cookie policy', policyMore: 'Read the cookie policy',
    all: 'Accept', none: 'Reject', choose: 'Settings',
    dialog: 'Cookie settings', dialogText: 'This site sets no cookies of its own and does not count your visits. Choose whether YouTube videos may load:',
    legend: 'Outside content',
    youtube: 'YouTube videos', youtubeHint: 'The player (youtube-nocookie.com) and the small pictures of the videos (i.ytimg.com), from Google. YouTube may keep cookies when a video plays. Your choice lasts 180 days.',
    save: 'Save', cancel: 'Cancel',
    done: 'Saved. Change it from “Cookie settings” in the footer.', close: 'Close',
    saved: 'Cookie settings saved. You can change them from “Cookie settings” in the footer.',
    open: 'Cookie settings',
    video: 'YouTube video',
    gate: 'This video is on YouTube (Google). To watch it here, your browser will connect to Google, which will see your IP address (your connection’s) and may keep cookies. I will remember your “yes” for 180 days, for all videos.',
    gateOr: 'If you would rather not, open it on YouTube: YouTube’s own rules apply there.',
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

// the way back in: the footer's button is LUZ's open button; any other «change my
// choice» button of the page (the policy's) carries data-consent-open and presses it
export const openConsent = () => document.querySelector('[data-luz-consent-open]')?.click();

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
  // a press that starts and ends on the backdrop closes it; a text selection that slips out
  // of the card, or a stray tap on its padding (inside its box), does not lose the choice
  let down = false;
  const outside = (e) => { const r = dialog.getBoundingClientRect(); return e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom); };
  dialog.addEventListener('pointerdown', (e) => { down = outside(e); });
  dialog.addEventListener('click', (e) => { if (down && outside(e)) dialog.close(); down = false; });
  const banner = el('luz-cookie-consent', {},
    el('section', { class: 'luz-cookie-consent', 'data-luz-consent': '', 'data-luz-consent-key': KEY, 'data-luz-consent-policy': VERSION, 'aria-labelledby': 'consent-title', 'data-nosnippet': '', hidden: '' },
      el('div', { class: 'consent__ask', 'data-luz-consent-ask': '' },
        // a <p>, not a heading: the card comes first in the page and an <h2> would precede the <h1>
        el('p', { class: 'luz-cookie-consent__title', id: 'consent-title', text: CT.title }),
        el('p', { class: 'consent__text' }, CT.text, ' ', el('a', { href: POLICY, text: CT.policy }), '.'),
        el('div', { class: 'consent__row' },
          el('form', { class: 'consent__actions' }, btn('all', CT.all), btn('none', CT.none)),
          settings),
        dialog),
      el('div', { class: 'consent__done', 'data-luz-consent-done': '', tabindex: '-1', hidden: '' },
        el('p', { text: CT.done }),
        el('button', { class: 'consent__btn', type: 'button', 'data-luz-consent-close': '', text: CT.close }))));
  // first in the page after the skip link: where LUZ wants it when the window
  // is too short for a fixed card. The footer's open button (parts.js) already
  // exists: LUZ wires the open buttons when the banner goes in
  const skip = document.querySelector('.skip');
  if (skip) skip.after(banner); else document.body.prepend(banner);
  const box = banner.querySelector('[data-luz-consent]');
  pillRoom(box);
  closeOnChoice(box);
}

// Once a choice is made — Accept, Reject, Save in the settings, or a post's
// "Accept and watch here" — the card goes away at once (LUZ would show a
// "Saved" step first). The news goes to screen readers in a polite live
// region; focus, if it was in the card, goes back to the button that opened
// it (the footer's, or the policy page's) else to <main> without scrolling.
function closeOnChoice(box) {
  const status = el('p', { class: 'vh', role: 'status' });
  document.body.append(status);
  let opener = null;
  document.addEventListener('click', (e) => {
    const b = e.target.closest?.('[data-consent-open], [data-luz-consent-open]');
    if (!b) return;
    if (b.hasAttribute('data-consent-open')) { opener = b; openConsent(); }       // the policy's button presses the footer's
    else if (!opener?.isConnected) opener = b;
  });
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
