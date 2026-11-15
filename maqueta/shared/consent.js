// Trama · the cookie banner: LUZ's <luz-cookie-consent> (@luz-ds/catalog,
// vendored in /assets/vendor/luz/cookie-consent.min.js by tools/luz-sync.mjs)
// with its markup written here in both languages and its look in
// maqueta/style.css (.luz-cookie-consent: Trama's charcoal, dots and type).
//
// The site sets no cookies of its own and has no analytics: the one thing to
// ask about is YouTube, whose player (youtube-nocookie.com) and thumbnails
// only load in a post when "youtube" is granted. LUZ's behaviour is kept as
// it is: a band fixed at the bottom that does not take focus, Accept and
// Reject side by side, a <details> to choose, a confirmation that takes
// focus, the choice in localStorage ("luz-consent") for 180 days, and a
// "Cookies" button in the footer that opens it again. No JS → no banner
// (nothing third-party loads either).
//
//   import { consent, allowed, grant } from '../shared/consent.js';
//   consent();               // after the footer is in the page
//   allowed('youtube')       // → true / false
//   grant('youtube')         // store it from a post's own "watch here" button
import { getConsent } from '/assets/vendor/luz/cookie-consent.min.js';
import { lang } from './content.js';
import { el } from '../blog/parts.js';

const KEY = 'luz-consent';
const POLICY = 'https://soynando.com/politica-de-cookies/';
const VERSION = 'soynando-2026-11'; // the policy shown, stored with each choice

export const CT = {
  es: {
    title: 'Cookies',
    text: 'Esta web no usa cookies propias ni analítica. Solo algunos artículos traen vídeos de YouTube, que guardan sus cookies si los cargas aquí.',
    policy: 'Política de cookies',
    all: 'Aceptar vídeos', none: 'Rechazar', choose: 'Elegir', legend: 'Qué se puede cargar',
    youtube: 'Vídeos de YouTube', youtubeHint: 'youtube-nocookie.com: el reproductor y sus miniaturas.',
    save: 'Guardar mi elección',
    done: 'Guardado. Puedes cambiarlo cuando quieras desde «Cookies», en el pie.', close: 'Cerrar',
    open: 'Cookies',
    gate: 'Este vídeo es de YouTube y, si lo ves aquí, YouTube guardará sus cookies.',
    gateYes: 'Verlo aquí', gateNo: 'Abrir en YouTube', newTab: '(se abre en otra pestaña)'
  },
  en: {
    title: 'Cookies',
    text: 'This site sets no cookies of its own and no analytics. Only some posts carry YouTube videos, which store their cookies if you load them here.',
    policy: 'Cookie policy (Spanish)',
    all: 'Accept videos', none: 'Reject', choose: 'Choose', legend: 'What may load',
    youtube: 'YouTube videos', youtubeHint: 'youtube-nocookie.com: the player and its thumbnails.',
    save: 'Save my choice',
    done: 'Saved. You can change it any time from “Cookies” in the footer.', close: 'Close',
    open: 'Cookies',
    gate: 'This video is on YouTube and, if you watch it here, YouTube will store its cookies.',
    gateYes: 'Watch here', gateNo: 'Open on YouTube', newTab: '(opens in a new tab)'
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
  const btn = (value, text) => el('button', { class: 'consent__btn', value, text });
  const banner = el('luz-cookie-consent', {},
    el('section', { class: 'luz-cookie-consent', 'data-luz-consent': '', 'data-luz-consent-key': KEY, 'data-luz-consent-policy': VERSION, 'aria-labelledby': 'consent-title', hidden: '' },
      el('div', { class: 'consent__ask', 'data-luz-consent-ask': '' },
        el('div', { class: 'consent__copy' },
          el('h2', { class: 'luz-cookie-consent__title', id: 'consent-title', text: CT.title }),
          el('p', { class: 'consent__text' }, CT.text, ' ', el('a', { href: POLICY, hreflang: 'es' }, CT.policy), '.')),
        el('form', { class: 'consent__actions' }, btn('all', CT.all), btn('none', CT.none)),
        el('details', { class: 'luz-cookie-consent__choices' },
          el('summary', { text: CT.choose }),
          el('form', {},
            el('fieldset', {},
              el('legend', { text: CT.legend }),
              el('label', { class: 'consent__check' },
                el('input', { type: 'checkbox', name: 'youtube', value: 'youtube', 'aria-describedby': 'consent-yt' }),
                el('span', { text: CT.youtube })),
              el('p', { class: 'consent__hint', id: 'consent-yt', text: CT.youtubeHint })),
            el('div', { class: 'consent__actions' }, btn('save', CT.save))))),
      el('div', { class: 'consent__done', 'data-luz-consent-done': '', tabindex: '-1', hidden: '' },
        el('p', { text: CT.done }),
        el('button', { class: 'consent__btn', type: 'button', 'data-luz-consent-close': '', text: CT.close }))));
  // the way back in, in the footer (hidden, its room kept, until the script
  // runs); before the banner goes in, since LUZ wires the open buttons then
  const foot = document.querySelector('.foot__nav ul');
  if (foot && !foot.querySelector('[data-luz-consent-open]'))
    foot.append(el('li', {}, el('button', { type: 'button', class: 'foot__consent', 'data-luz-consent-open': '', hidden: '', text: CT.open })));
  // first in the page after the skip link: where LUZ wants it when the window
  // is too short for a fixed band
  const skip = document.querySelector('.skip');
  if (skip) skip.after(banner); else document.body.prepend(banner);
}
