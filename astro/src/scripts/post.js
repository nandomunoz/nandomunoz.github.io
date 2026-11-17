// A post's enhancements (plan Phase 8): the share button (the system's sheet where there is one, else a
// dialog), the table of contents marking the section being read, external links that say they open another
// tab, code blocks and scrolling tables you can reach with the keyboard, the reading progress where scroll
// timelines do not exist. Everything is already in the HTML; without this the page reads the same.
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- share
const btn = document.querySelector('[data-share]');
const dlg = document.querySelector('[data-share-dialog]');
if (btn && dlg) {
  btn.hidden = false;
  btn.addEventListener('click', async () => {
    const data = { title: btn.dataset.title, text: btn.dataset.text, url: btn.dataset.url };
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      try { await navigator.share(data); return; } catch (e) { if (e.name === 'AbortError') return; }
    }
    dlg.querySelector('.share__status').textContent = '';
    dlg.showModal();
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('.share__places a')) dlg.close(); });
  const field = dlg.querySelector('.share__url'), status = dlg.querySelector('.share__status');
  field.addEventListener('focus', () => field.select());
  let tm;
  dlg.querySelector('[data-copy]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(field.value); status.textContent = status.dataset.copied; }
    catch { field.focus(); status.textContent = status.dataset.copyfail; }
    clearTimeout(tm); tm = setTimeout(() => { status.textContent = ''; }, 2400);
  });
}

// ---------------------------------------------------------------- the table of contents
const toc = document.querySelector('.toc');
if (toc && matchMedia('(min-width: 64em)').matches) toc.open = true;
const links = [...document.querySelectorAll('.toc a')];
if (links.length) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => (a.hash === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  }), { rootMargin: '-20% 0px -70% 0px' });
  document.querySelectorAll('.prose h2[id]').forEach((h) => io.observe(h));
}

// ---------------------------------------------------------------- the prose
const prose = document.querySelector('.prose');
if (prose) {
  const note = prose.dataset.newTab || '';
  for (const a of prose.querySelectorAll('a[href^="http"]')) {
    if (new URL(a.href).origin === location.origin) continue;
    a.target = '_blank'; a.rel = 'noopener';
    if (note) { const s = document.createElement('span'); s.className = 'vh'; s.textContent = ' ' + note; a.append(s); }
  }
  // a block of code or a table that scrolls sideways must be reachable with the keyboard (WCAG 2.1.1)
  for (const pre of prose.querySelectorAll('pre')) {
    if (pre.scrollWidth <= pre.clientWidth) continue;
    pre.tabIndex = 0; pre.setAttribute('role', 'region'); pre.setAttribute('aria-label', root.lang.startsWith('ar') ? 'شيفرة' : root.lang.startsWith('en') ? 'Code' : 'Código');
  }
}

// ---------------------------------------------------------------- timelines: LUZ's element, loaded only when the post has one
// (until it is, or without JS, the ordered list is the timeline)
if (document.querySelector('luz-timeline')) import('@luz-ds/catalog/timeline').catch(() => {});

// ---------------------------------------------------------------- reading progress
if (!CSS.supports('animation-timeline: scroll()') || reduce) {
  const set = () => root.style.setProperty('--p', Math.min(1, Math.max(0, scrollY / Math.max(1, root.scrollHeight - innerHeight))).toFixed(4));
  addEventListener('scroll', set, { passive: true }); set();
}
