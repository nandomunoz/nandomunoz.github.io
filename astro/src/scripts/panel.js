// The project panel of the home (plan Phases 6–7). A project's card is a link to its page (it works without JS); with JS a
// click opens the project in a modal <dialog> instead: the block's dots fly into a field on one side and the sheet rises
// beside it. ←/→ move between the featured projects, Esc or the close button fly the dots back, and the focus returns to
// the card. The address becomes the project's own (/proyectos/<id>/) so the open panel can be shared, and Back closes it.
// The content is in the page (#panel-data): no request is made. Ported from the maqueta's main.js.
import { registry } from './blocks.js';
import { fly, fieldPoints, drawPoints } from './dots.js';

const dlg = document.querySelector('[data-panel]');
const raw = document.getElementById('panel-data');
if (dlg && raw) {
  const { projects, ui } = JSON.parse(raw.textContent);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => dlg.querySelector(s);
  const sheet = $('.panel__sheet'), pf = $('.panel__field');
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) { if (v == null) continue; if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else n.setAttribute(k, v); }
    n.append(...kids.filter(Boolean));
    return n;
  };
  const front = (i) => registry.get(document.querySelector(`.item__block[data-i="${i}"] .front`));
  const back = location.pathname;                                  // where the page was when it opened
  let cur = -1, field = [], busy = false, opener = null;

  const regionOf = () => (innerWidth >= 1024
    ? { x: innerWidth >= 1024 && document.documentElement.dir === 'rtl' ? innerWidth * 0.58 : 0, y: 0, w: innerWidth * 0.42, h: innerHeight }
    : { x: 0, y: 0, w: innerWidth, h: Math.round(innerHeight * 0.34) });
  const fieldFor = (i) => {
    const p = projects[i];
    return fieldPoints(innerWidth, innerHeight, { region: regionOf(), label: p.label, density: p.density + 0.1, seed: p.seed, cell: innerWidth >= 1024 ? 11 : 8, tone: front(i)?.tone ?? null, gloss: p.glossLen });
  };
  function restField() {
    field = fieldFor(cur);
    const ctx = pf.getContext('2d'), r = Math.min(devicePixelRatio || 1, 2);
    pf.width = innerWidth * r; pf.height = innerHeight * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    drawPoints(ctx, innerWidth, innerHeight, field);
  }
  const out = (href, label) => el('a', { href, target: '_blank', rel: 'noopener' }, el('span', { text: label }), el('span', { class: 'vh', text: ' ' + ui.newTab }), el('span', { 'aria-hidden': 'true', text: ' ↗' }));
  function fill(i) {
    const p = projects[i];
    cur = i;
    $('#p-meta').textContent = p.year;
    $('#p-gloss').textContent = p.gloss;
    $('#p-kicker').textContent = p.kicker;
    $('#p-title').textContent = p.name;
    $('#p-tech').replaceChildren(...p.tech.map((x) => el('li', { text: x })));
    $('#p-text').replaceChildren(...p.body.map((x) => el('p', { text: x })));
    $('#p-shot').replaceChildren(...(p.shot ? [el('picture', {},
      el('source', { srcset: p.shot.avif, type: 'image/avif' }), el('source', { srcset: p.shot.webp, type: 'image/webp' }),
      el('img', { src: p.shot.jpg, alt: p.shotAlt, width: 1200, height: 750, loading: 'lazy', decoding: 'async' }))] : []));
    $('#p-links').replaceChildren(...[p.demo && out(p.demo, ui.demo), out(p.repo, ui.repo),
      el('a', { href: p.url }, el('span', { text: ui.page }), el('span', { 'aria-hidden': 'true', text: ' ' + ui.arrows.next }))].filter(Boolean));
    const n = projects.length, a = (i - 1 + n) % n, b = (i + 1) % n;
    $('#p-prev').replaceChildren(el('span', { class: 'panel__dir', text: ui.arrows.prev + ' ' + ui.prev }), el('span', { class: 'panel__to', dir: 'ltr', text: projects[a].name }));
    $('#p-next').replaceChildren(el('span', { class: 'panel__dir', text: ui.next + ' ' + ui.arrows.next }), el('span', { class: 'panel__to', dir: 'ltr', text: projects[b].name }));
    $('#p-prev').dataset.i = a; $('#p-next').dataset.i = b;
    sheet.scrollTop = 0;
  }

  async function open(i, from, { push = true } = {}) {
    if (busy) return;
    busy = true; opener = from;
    if (push) history.pushState({ panel: true }, '', projects[i].url);
    fill(i);
    const src = front(i)?.block?.points() ?? [];
    document.documentElement.classList.add('locked');
    dlg.classList.add('is-forming');
    dlg.showModal();
    requestAnimationFrame(() => dlg.classList.add('is-on'));
    field = fieldFor(i);
    if (reduce) restField(); else { await fly(pf, src, field, { dur: 1000 }); restField(); }
    dlg.classList.remove('is-forming');
    busy = false;
  }
  const close = () => (dlg.open && history.state?.panel ? history.back() : doClose());
  async function doClose() {
    if (busy || !dlg.open) return;
    busy = true;
    const card = document.querySelector(`.item__open[data-i="${cur}"]`);
    card?.closest('li').scrollIntoView({ block: 'center', behavior: 'instant' });
    dlg.classList.add('is-forming');
    dlg.classList.remove('is-on');
    if (!reduce) {
      await new Promise((r) => setTimeout(r, 180));
      await new Promise((r) => requestAnimationFrame(r));
      const dst = front(cur)?.block?.points() ?? [];
      await fly(pf, dst, field, { dur: 800, reverse: true });
    }
    dlg.close();
    pf.getContext('2d').clearRect(0, 0, pf.width, pf.height);
    document.documentElement.classList.remove('locked');
    (opener?.isConnected ? opener : card)?.focus({ preventScroll: true });
    busy = false;
  }
  async function go(i) {
    if (busy) return;
    busy = true;
    const from = field;
    dlg.classList.add('is-forming');
    await new Promise((r) => setTimeout(r, reduce ? 0 : 200));
    fill(i);
    history.replaceState({ panel: true }, '', projects[i].url);
    field = fieldFor(i);
    if (!reduce) await fly(pf, from, field, { dur: 750 });
    restField();
    dlg.classList.remove('is-forming');
    $('#p-title').focus({ preventScroll: true });
    busy = false;
  }

  // a click on a card opens the panel; a modified click (new tab, new window) keeps the link's own way
  document.querySelector('.works')?.addEventListener('click', (e) => {
    const n = e.target.closest('.item__open, .item__block');
    if (!n || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    e.preventDefault();
    const i = +(n.dataset.i ?? n.closest('li').querySelector('.item__open').dataset.i);
    open(i, n.classList.contains('item__open') ? n : n.closest('li').querySelector('.item__open'));
  });
  $('#p-close').addEventListener('click', close);
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  addEventListener('popstate', () => { if (dlg.open) doClose(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target === pf) close(); });
  $('#p-prev').addEventListener('click', (e) => go(+e.currentTarget.dataset.i));
  $('#p-next').addEventListener('click', (e) => go(+e.currentTarget.dataset.i));
  dlg.addEventListener('keydown', (e) => {
    if (e.target.closest('a, button') && e.key === 'Enter') return;
    const rtl = document.documentElement.dir === 'rtl';
    if (e.key === 'ArrowRight') go(+$(rtl ? '#p-prev' : '#p-next').dataset.i);
    if (e.key === 'ArrowLeft') go(+$(rtl ? '#p-next' : '#p-prev').dataset.i);
  });
  let tm;
  addEventListener('resize', () => { if (!dlg.open) return; clearTimeout(tm); tm = setTimeout(() => { if (!busy) restField(); }, 180); });
  document.addEventListener('trama:mode', () => { if (dlg.open && !busy) restField(); });
}
