// The page's chrome as progressive enhancement (plan Phase 4). Everything here has an HTML/CSS
// fallback: the menu is already a pill on a phone, the language list opens without script, the
// links already point to the right pages.
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

// ---------------------------------------------------------------- language dropdowns
// Placed under the button (or over it when there is no room below), at its edge, never out of the window.
for (const dd of document.querySelectorAll('.lang-dd')) {
  const btn = dd.querySelector('.lang-dd__btn'), menu = dd.querySelector('.lang-dd__list');
  if (!btn || !menu) continue;
  const place = () => {
    const b = btn.getBoundingClientRect(), h = menu.offsetHeight, w = menu.offsetWidth, below = innerHeight - b.bottom;
    const up = below < h + 12 && b.top > below, end = b.left + b.width / 2 > innerWidth / 2;
    menu.style.top = `${up ? Math.max(8, b.top - h - 6) : b.bottom + 6}px`;
    menu.style.left = `${Math.min(Math.max(8, end ? b.right - w : b.left), innerWidth - w - 8)}px`;
  };
  menu.addEventListener('toggle', (e) => { btn.setAttribute('aria-expanded', String(e.newState === 'open')); if (e.newState === 'open') place(); });
  menu.addEventListener('keydown', (e) => {
    const items = [...menu.querySelectorAll('a')], i = items.indexOf(document.activeElement);
    const to = { ArrowDown: (i + 1) % items.length, ArrowUp: (i - 1 + items.length) % items.length, Home: 0, End: items.length - 1 }[e.key];
    if (to != null && items.length) { e.preventDefault(); items[to].focus(); }
  });
  btn.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown') return;
    e.preventDefault();
    if (!menu.matches(':popover-open')) menu.showPopover();
    menu.querySelector('a')?.focus();
  });
  addEventListener('resize', () => { if (menu.matches(':popover-open')) menu.hidePopover(); });
}

// The language links keep the #fragment of where you are (the page is the same, in another language)
const langLinks = [...document.querySelectorAll('.lang-dd__list a[hreflang], .foot__group a[hreflang]')];
const base = new Map(langLinks.map((a) => [a, a.getAttribute('href')]));
const keepHash = () => langLinks.forEach((a) => a.setAttribute('href', base.get(a) + location.hash));
keepHash();
addEventListener('hashchange', keepHash);

// ---------------------------------------------------------------- the menu: dock on scroll, mark the section in view
const nav = document.getElementById('nav');
const hero = document.querySelector('.hero__copy');
if (nav && hero && !root.classList.contains('docked')) {
  // On a phone the nav is already the pill (CSS); from 48em it docks once the hero's copy has scrolled away.
  let docked = false;
  const set = (d) => {
    if (d === docked) return;
    docked = d;
    const flip = () => root.classList.toggle('docked', d);
    if (document.startViewTransition && !reduce.matches && matchMedia('(min-width: 48em)').matches) document.startViewTransition(flip);
    else flip();
  };
  new IntersectionObserver(([e]) => set(!e.isIntersecting), { rootMargin: '-35% 0px 0px 0px' }).observe(hero);
}
const links = [...(nav?.querySelectorAll('a') ?? [])].filter((a) => a.hash && a.pathname === location.pathname);
if (links.length) {
  const secs = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => (a.hash === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach((s) => io.observe(s));
}

// ---------------------------------------------------------------- the progress rail where scroll timelines do not exist (Firefox)
if (!CSS.supports('animation-timeline: scroll()') || reduce.matches) {
  const set = () => root.style.setProperty('--p', (scrollY / Math.max(1, root.scrollHeight - innerHeight)).toFixed(4));
  addEventListener('scroll', set, { passive: true });
  set();
}
