// A block of code in a post (plan Phase 8), with LUZ's own highlighter (HTML, CSS, JS, JSON and shell; six token classes,
// escapes what it writes) and a copy button. A post says no language for its code, so it is guessed. The look is in
// blog.css (.code, .code__bar, .luz-code-block and the --luz-code-* tokens of the theme, one scheme per colour mode).
import { highlightBlock } from '@luz-ds/core/highlight';
import { blogStrings } from '../i18n/blog.js';

const lang = document.documentElement.lang.startsWith('ar') ? 'ar' : document.documentElement.lang.startsWith('en') ? 'en' : 'es';
const B = blogStrings(lang);
const LUZ = new Set(['css', 'html', 'js', 'jsx', 'json', 'bash', 'sh', 'shell']);
const ALIAS = { javascript: 'js', mjs: 'js', ts: 'js', typescript: 'js', tsx: 'jsx', htm: 'html', xml: 'html', svg: 'html', scss: 'css', zsh: 'sh', console: 'sh' };
const PLAIN = { markdown: 'markdown', md: 'markdown', yaml: 'yaml', yml: 'yaml', text: 'text', txt: 'text', plain: 'text' }; // named, but LUZ's highlighter does not know them: shown as they are
const NAMES = { markdown: 'Markdown', yaml: 'YAML', text: 'Texto', js: 'JavaScript', jsx: 'JSX', css: 'CSS', html: 'HTML', json: 'JSON', sh: 'Shell', bash: 'Shell', shell: 'Shell' };

function guess(src, hint) {
  const l = (hint || '').toLowerCase(), a = ALIAS[l] || l;
  if (PLAIN[a]) return PLAIN[a];
  if (LUZ.has(a)) return a;
  const s = src.trim();
  if (/^</.test(s)) return 'html';
  if (/^[[{]/.test(s)) { try { JSON.parse(s); return 'json'; } catch { /* a JS object, then */ } }
  if (/^(\$ |npm |npx |yarn |pnpm |git |cd |curl |sudo |#!)/.test(s)) return 'sh';
  if (!/\b(function|const|let|var|=>|import|class|return)\b/.test(s) && /[^{}]+\{[^{}]*:[^{}]*\}/.test(s)) return 'css';
  return 'js';
}
const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else n.setAttribute(k, v); }
  n.append(...kids);
  return n;
};
const status = el('p', { class: 'vh', role: 'status' });
document.body.append(status);

let n = 0;
for (const old of document.querySelectorAll('.prose pre')) {
  n++;
  if (old.closest('.code')) continue;
  const src = (old.querySelector('code') ?? old).textContent.replace(/\n$/, '');
  const hint = (old.querySelector('code')?.className.match(/language-(\w+)/) ?? [])[1];
  const l = guess(src, hint);
  const pre = el('pre', { class: 'luz-code-block', 'data-lang': l, tabindex: '0', role: 'region', 'aria-label': `${NAMES[l]} ${n}` }, el('code', { text: src }));
  if (!Object.values(PLAIN).includes(l)) highlightBlock(pre);
  const btn = el('button', { type: 'button', class: 'luz-copy-btn code__copy', 'aria-label': `${B.codeCopyLabel} (${NAMES[l]})`, text: B.codeCopy });
  let tm;
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(src); } catch { status.textContent = B.copyFail; return; }
    btn.classList.add('is-copied'); btn.textContent = B.copied; status.textContent = '';
    setTimeout(() => { status.textContent = B.copied; }, 50);
    clearTimeout(tm); tm = setTimeout(() => { btn.classList.remove('is-copied'); btn.textContent = B.codeCopy; }, 2000);
  });
  old.replaceWith(el('div', { class: 'code' }, el('div', { class: 'code__bar' }, el('span', { class: 'code__lang', text: NAMES[l] }), btn), pre));
}
