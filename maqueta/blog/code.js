// Trama · a block of code in a post, with LUZ's own pieces (vendored in assets/vendor/luz/): its syntax
// highlighter (highlight.js: HTML, CSS, JS, JSON and shell, six token classes, no innerHTML but the one
// it escapes itself) and its copy button (clipboard.js: the click, the live-region announcement, the
// words in the page's language). The look is Trama's (blog.css: a bar with the language and the button
// over the code, a real monospace face; style.css: LUZ's --luz-code-* colour tokens, one scheme per mode).
//
// A post says no language for its code, so it is guessed here (HTML, JSON, shell, CSS, else JS).
//
//   import { codeBlock } from './code.js';
//   codeBlock(source, { lang, labels: { copy, copyCode }, el })  → the element
import { highlightBlock } from '/assets/vendor/luz/highlight.min.js';
import { initCopyButtons } from '/assets/vendor/luz/clipboard.min.js';
import { loadLocales } from '/assets/vendor/luz/i18n.min.js';

// what LUZ's highlighter knows by name, and the aliases a post may use
const LUZ = new Set(['css', 'html', 'js', 'jsx', 'json', 'bash', 'sh', 'shell']);
const ALIAS = { javascript: 'js', mjs: 'js', ts: 'js', typescript: 'js', tsx: 'jsx', htm: 'html', xml: 'html', svg: 'html', scss: 'css', zsh: 'sh', console: 'sh' };
const NAMES = { js: 'JavaScript', jsx: 'JSX', css: 'CSS', html: 'HTML', json: 'JSON', sh: 'Shell', bash: 'Shell', shell: 'Shell' };

export function guess(src, lang) {
  const l = (lang || '').toLowerCase(), a = ALIAS[l] || l;
  if (LUZ.has(a)) return a;
  const s = src.trim();
  if (/^</.test(s)) return 'html';
  if (/^[[{]/.test(s)) { try { JSON.parse(s); return 'json'; } catch { /* a JS object, then */ } }
  if (/^(\$ |npm |npx |yarn |pnpm |git |cd |curl |sudo |#!)/.test(s)) return 'sh';
  if (!/\b(function|const|let|var|=>|import|class|return)\b/.test(s) && /[^{}]+\{[^{}]*:[^{}]*\}/.test(s)) return 'css';
  return 'js';
}

let started = false;
export function codeBlock(src, { lang, labels, el }) {
  if (!started) { started = true; loadLocales(); initCopyButtons(); }       // LUZ's words in the page's language, and the click
  const l = guess(src, lang);
  const pre = el('pre', { class: 'luz-code-block', 'data-lang': l, tabindex: '0', role: 'region', 'aria-label': NAMES[l] }, el('code', { text: src }));
  highlightBlock(pre);
  const btn = el('button', { type: 'button', class: 'luz-copy-btn code__copy', 'aria-label': `${labels.copyCode} (${NAMES[l]})`, text: labels.copy });
  btn.dataset.copy = src;
  return el('div', { class: 'code' },
    el('div', { class: 'code__bar' }, el('span', { class: 'code__lang', text: NAMES[l] }), btn),
    pre);
}
