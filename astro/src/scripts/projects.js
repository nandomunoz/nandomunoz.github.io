// The technology filter of /proyectos/ (plan Phase 7). The chips are links to ?tech=<slug>; with JS they filter the
// rows in place (hiding the rest, and the years left empty) and keep the address in step, so a filtered list can be
// shared and the Back button works. Without JS the chips are not shown (CSS) and the whole list is.
const nav = document.querySelector('[data-tech-filter]');
const wrap = document.querySelector('[data-projects]');
if (nav && wrap) {
  const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const rows = [...wrap.querySelectorAll('.prow')].map((li) => ({ li, tech: JSON.parse(li.dataset.tech) }));
  const links = [...nav.querySelectorAll('a')];
  const apply = (want) => {
    const tech = want ? links.map((a) => a.dataset.tech).find((t) => t && slug(t) === want) : '';
    for (const { li, tech: ts } of rows) li.hidden = !!tech && !ts.includes(tech);
    for (const y of wrap.querySelectorAll('[data-year]')) y.hidden = ![...y.querySelectorAll('.prow')].some((li) => !li.hidden);
    for (const a of links) { if ((a.dataset.tech || '') === (tech || '')) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }
    const n = rows.filter((r) => !r.li.hidden).length;
    const count = document.querySelector('.bhead__count');
    if (count) { count.dataset.all ??= count.textContent; count.textContent = tech ? `${tech} · ${n}` : count.dataset.all; }
    window.dispatchEvent(new Event('scroll'));
  };
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    history.pushState({}, '', a.href);
    apply(new URL(a.href).searchParams.get('tech'));
  });
  addEventListener('popstate', () => apply(new URLSearchParams(location.search).get('tech')));
  apply(new URLSearchParams(location.search).get('tech'));
}
