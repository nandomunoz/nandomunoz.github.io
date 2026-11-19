// The 404's behaviour (plan Phase 9): the rain with the desk picture drawn in it, the address that failed, and a
// search over search.json (title, context, address and normalised text of every post and project).
import { RainField } from './rain.js';
import { blogStrings } from '../i18n/blog.js';

const root = document.querySelector('[data-lost]');
if (root) {
  const lang = document.documentElement.lang.startsWith('ar') ? 'ar' : document.documentElement.lang.startsWith('en') ? 'en' : 'es';
  const B = blogStrings(lang);
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s) => root.querySelector(s);
  const params = new URLSearchParams(location.search);

  // the address that failed: the page's own, or the one the Spanish 404 sent us here with (?from=)
  let shown = params.get('from') || location.pathname + location.search;
  try { shown = decodeURIComponent(shown); } catch { /* keep the raw text */ }
  $('[data-address]').textContent = shown.replace(/^\/(en|ar)\/404\/?$/, '/');

  // the rain
  const cv = $('.lost__field'), hint = $('.lost__hint');
  const rain = new RainField(cv, { mask: 'image', dots: true });
  new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? rain.start() : rain.stop())).observe(cv);
  document.addEventListener('visibilitychange', () => (document.hidden ? rain.stop() : rain.start()));
  cv.addEventListener('pointerdown', (e) => { const r = cv.getBoundingClientRect(); rain.poke(e.clientX - r.left, e.clientY - r.top); hint.classList.add('is-done'); });
  addEventListener('resize', () => { clearTimeout(rain.tm); rain.tm = setTimeout(() => rain.layout(), 200); });
  document.addEventListener('trama:mode', () => rain.repaint());
  const text = JSON.parse(hint.dataset.hint); hint.textContent = fine ? text.fine : text.touch; hint.hidden = false;

  // the search
  const form = $('.lost__search'), input = $('#lost-q'), status = $('.lost__status'), list = $('.lost__results');
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/<[^>]+>/g, ' ');
  fetch(root.dataset.index).then((r) => r.json()).then((index) => {
    const find = (raw, guess) => {
      const words = norm(raw).split(/[^a-z0-9ñ]+/).filter((w) => w.length > 1);
      const hits = !words.length ? [] : index
        .map((it) => ({ it, s: words.filter((w) => it.hay.includes(w)).length }))
        .filter((x) => (guess ? x.s > 0 : x.s === words.length))
        .sort((x, y) => y.s - x.s).slice(0, 6).map((x) => x.it);
      list.replaceChildren(...hits.map((it) => {
        const li = document.createElement('li'), a = document.createElement('a');
        a.href = it.href;
        for (const [cls, t] of [['lost__kind', it.kind], ['lost__rtitle', it.title], ['lost__sub', it.sub]]) { const s = document.createElement('span'); s.className = cls; s.textContent = t; a.append(s); }
        li.append(a); return li;
      }));
      status.textContent = !words.length ? '' : hits.length ? (guess ? B.nfMaybe : B.nfResults(hits.length)) : guess ? '' : B.nfNone;
    };
    form.hidden = false;
    form.addEventListener('submit', (e) => e.preventDefault());
    input.addEventListener('input', () => find(input.value));
    // a first guess from the address: /blog/margaret/ → «margaret»
    find((shown.split('?')[0].split('/').filter(Boolean).pop() || '').replace(/\.html?$/, '').replace(/[-_+]/g, ' '), true);
  }).catch(() => { /* no index: the ways below still lead somewhere */ });
}
