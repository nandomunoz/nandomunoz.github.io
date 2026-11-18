// The quality gate of the built site (plan Phase 10), in headless Chromium against dist/ (run `npm run build` first):
//   · axe-core (WCAG 2.2 AA + best practice) at 375 and 1280 px with reduced motion: no serious or critical issue, in every template and language;
//     dark, light and high contrast on the key pages
//   · reflow at 320 px: nothing scrolls sideways
//   · without JS: every template still has its <h1>, text and links
//   · the cookie choice: not one request to Google/YouTube before a «yes», and none after «Reject»
//   · focus: Tab through a page at 375 × 667 with the cookie card and the menu pill up; no focused element ends up covered (WCAG 2.4.11)
//   · no JS errors or failed requests of the site's own
// Exits 1 on any failure.   npm run audit            (CHROMIUM=/path/to/chrome to choose the browser; without it, Playwright's)
//                           npm run audit -- --quick (axe in dark only, a handful of pages)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright-core');
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const dist = new URL('../dist/', import.meta.url).pathname;
const quick = process.argv.includes('--quick');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let f = path.join(dist, decodeURIComponent(req.url.split('?')[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404, { 'Content-Type': 'text/html' }); return res.end(fs.readFileSync(path.join(dist, '404.html'))); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] ?? 'application/octet-stream' });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// one page of every template, in the three languages
const ARTICLE = 'carnaval-de-cadiz-analisis-del-popuri-de-los-renacidos', POST = 'margaret-hamilton';
const L = { es: '', en: '/en', ar: '/ar' };
const T = {
  es: { projects: '/proyectos/', project: '/proyectos/luz/', cat: '/blog/categoria/', tags: '/blog/etiqueta/', policy: '/politica-de-cookies/', privacy: '/privacidad/', credits: '/creditos/', access: '/accesibilidad/', notfound: '/404.html' },
  en: { projects: '/projects/', project: '/projects/luz/', cat: '/blog/category/', tags: '/blog/tag/', policy: '/cookie-policy/', privacy: '/privacy/', credits: '/credits/', access: '/accessibility/', notfound: '/404/' },
  ar: { projects: '/projects/', project: '/projects/luz/', cat: '/blog/category/', tags: '/blog/tag/', policy: '/cookie-policy/', privacy: '/privacy/', credits: '/credits/', access: '/accessibility/', notfound: '/404/' }
};
const pages = [];
for (const l of Object.keys(L)) {
  const p = L[l], t = T[l];
  pages.push([`${l} home`, `${p}/`], [`${l} projects`, p + t.projects], [`${l} project`, p + t.project], [`${l} blog`, `${p}/blog/`], [`${l} blog p2`, `${p}/blog/2/`],
    [`${l} post`, `${p}/blog/${POST}/`], [`${l} post+video`, `${p}/blog/${ARTICLE}/`], [`${l} post+code`, `${p}/blog/aprendiendo-web-components/`], [`${l} categories`, p + t.cat], [`${l} category`, `${p + t.cat}${l === 'es' ? 'literatura-y-pensamiento' : 'literatura-y-pensamiento'}/`],
    [`${l} tags`, p + t.tags], [`${l} cookies`, p + t.policy], [`${l} privacy`, p + t.privacy], [`${l} credits`, p + t.credits], [`${l} accessibility`, p + t.access], [`${l} 404`, p + t.notfound]);
}
const key = new Set(['es home', 'es post+video', 'es projects', 'es cookies', 'ar home', 'ar post', 'en home']);
const fails = [], note = (ok, what) => { if (!ok) { fails.push(what); console.log('  ✗', what); } return ok; };

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
// every page of every test reports a Content-Security-Policy violation (the policy is a <meta>, tools/csp.mjs) as a failure
const newContext = browser.newContext.bind(browser);
browser.newContext = async (...args) => {
  const ctx = await newContext(...args);
  ctx.on('page', (pg) => pg.on('console', (m) => /Content[- ]Security[- ]Policy/i.test(m.text()) && note(false, `CSP violation on ${pg.url()}: ${m.text().slice(0, 200)}`)));
  return ctx;
};
const google = /youtube|ytimg|googlevideo|google\.com|gstatic/;
const exists = (u) => fs.existsSync(path.join(dist, new URL(u, base).pathname.replace(/\/$/, '/index.html')));

// ---------------------------------------------------------------- axe + reflow + console
console.log('axe, reflow and console');
for (const [name, url] of pages) {
  if (!exists(url) && !url.endsWith('404.html')) { note(false, `${name}: ${url} is not in dist/`); continue; }
  if (quick && !key.has(name)) continue;
  const modes = quick || !key.has(name) ? ['dark'] : ['dark', 'light', 'high-contrast'];
  for (const width of [375, 1280]) for (const mode of modes) {
    const ctx = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: 'reduce' });
    await ctx.addInitScript((m) => localStorage.setItem('luz-theme', m), mode);
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', (e) => errs.push(e.message));
    pg.on('console', (m) => m.type() === 'error' && !/404/.test(m.text()) && errs.push(m.text()));
    await pg.goto(base + url);
    await pg.waitForTimeout(900);
    await pg.evaluate(axeSource);
    const r = await pg.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
    const hard = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    note(!hard.length, `${name} @${width} ${mode}: ${hard.map((v) => v.id + ' ×' + v.nodes.length).join(', ')}`);
    note(!(await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), `${name} @${width} ${mode}: scrolls sideways`);
    note(!errs.length, `${name} @${width} ${mode}: errors ${errs.slice(0, 2).join(' | ')}`);
    await ctx.close();
  }
  // reflow at 320
  const ctx = await browser.newContext({ viewport: { width: 320, height: 700 } });
  const pg = await ctx.newPage();
  await pg.goto(base + url); await pg.waitForTimeout(500);
  note(!(await pg.evaluate(() => document.documentElement.scrollWidth > 321)), `${name} @320: scrolls sideways`);
  await ctx.close();
}

// ---------------------------------------------------------------- without JavaScript
console.log('without JS');
for (const [name, url] of pages) {
  if (!exists(url) && !url.endsWith('404.html')) continue;
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const pg = await ctx.newPage();
  await pg.goto(base + url);
  const r = await pg.evaluate(() => ({ h1: document.querySelectorAll('h1').length, text: document.querySelector('main')?.innerText.length ?? 0, links: document.querySelectorAll('main a[href]').length }));
  note(r.h1 === 1 && r.text > 150 && r.links >= 1, `${name} without JS: h1 ${r.h1}, ${r.text} chars, ${r.links} links`);
  await ctx.close();
}

// ---------------------------------------------------------------- nothing from Google before a «yes»
console.log('cookie choice and network');
for (const [label, action] of [['no choice', null], ['reject', 'none']]) {
  for (const url of [`/blog/${ARTICLE}/`, '/', '/en/blog/' + ARTICLE + '/']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pg = await ctx.newPage();
    const asked = [];
    pg.on('request', (r) => google.test(new URL(r.url()).hostname) && asked.push(r.url()));
    await pg.goto(base + url);
    await pg.waitForTimeout(800);
    if (action) { await pg.click(`.luz-cookie-consent button[value="${action}"]`); await pg.waitForTimeout(500); }
    await pg.mouse.wheel(0, 6000); await pg.waitForTimeout(500);
    note(!asked.length, `${label} ${url}: requests to Google ${asked.slice(0, 2).join(' ')}`);
    await ctx.close();
  }
}
{ // a «yes» in a video's gate lets the player in
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pg = await ctx.newPage();
  await pg.goto(`${base}/blog/${ARTICLE}/`); await pg.waitForTimeout(800);
  await pg.locator('.video__gate .consent__btn').first().click(); await pg.waitForTimeout(800);
  note((await pg.locator('.video iframe[src^="https://www.youtube-nocookie.com/"]').count()) === 1, 'a yes in the gate does not open the player');
  await ctx.close();
}

// ---------------------------------------------------------------- focus is never covered (2.4.11)
console.log('focus order at 375 × 667');
for (const url of ['/', `/blog/${POST}/`, '/proyectos/', '/politica-de-cookies/', '/ar/']) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, reducedMotion: 'reduce' });
  const pg = await ctx.newPage();
  await pg.goto(base + url); await pg.waitForTimeout(900);
  let covered = null, n = 0;
  for (; n < 60; n++) {
    await pg.keyboard.press('Tab');
    const r = await pg.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return null;
      const b = e.getBoundingClientRect();
      if (!b.width || !b.height) return { skip: true };
      // sample the corners and centre of what is visible: at least one point must hit the element itself
      const xs = [0.15, 0.5, 0.85], ys = [0.2, 0.5, 0.8];
      const hit = xs.flatMap((x) => ys.map((y) => document.elementFromPoint(Math.min(innerWidth - 1, Math.max(0, b.left + b.width * x)), Math.min(innerHeight - 1, Math.max(0, b.top + b.height * y))))).some((h) => h && (e.contains(h) || h.contains(e)));
      return { hit, name: e.outerHTML.slice(0, 70) };
    });
    if (r && !r.skip && !r.hit) { covered = r.name; break; }
  }
  note(!covered, `focus ${url}: covered ${covered}`);
  await ctx.close();
}

// ---------------------------------------------------------------- text spacing (1.4.12) and forced colours
console.log('the project panel open');
for (const [url, label] of [['/', 'es'], ['/en/', 'en'], ['/ar/', 'ar']]) for (const width of [375, 1280]) {
  const ctx = await browser.newContext({ viewport: { width, height: 760 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => localStorage.setItem('luz-consent', JSON.stringify({ version: 1, policy: 'x', asked: ['youtube'], granted: [], expires: Date.now() + 1e10, given: new Date().toISOString() })));
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', (e) => errs.push(e.message));
  await pg.goto(base + url); await pg.waitForTimeout(800);
  const card = pg.locator('.item__open').first();
  await card.scrollIntoViewIfNeeded(); await pg.waitForTimeout(500);
  await card.click(); await pg.waitForTimeout(900);
  const st = await pg.evaluate(() => ({ open: document.querySelector('[data-panel]').open, inside: !!document.activeElement?.closest('[data-panel]'), path: location.pathname }));
  note(st.open && st.inside, `panel ${label} @${width}: open ${st.open}, focus inside ${st.inside}`);
  note(/\/(proyectos|projects)\/[a-z-]+\/$/.test(st.path), `panel ${label} @${width}: the address is not the project's (${st.path})`);
  await pg.evaluate(axeSource);
  const r = await pg.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
  const hard = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  note(!hard.length, `panel ${label} @${width}: ${hard.map((v) => v.id + ' ×' + v.nodes.length).join(', ')}`);
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(500);
  const back = await pg.evaluate(() => ({ open: document.querySelector('[data-panel]').open, focus: document.activeElement?.className, path: location.pathname }));
  note(!back.open && back.focus === 'item__open' && !/\/(proyectos|projects)\//.test(back.path), `panel ${label} @${width}: Esc left it open or lost the focus (${JSON.stringify(back)})`);
  note(!errs.length, `panel ${label} @${width}: errors ${errs[0]}`);
  await ctx.close();
}

console.log('layout shift and LCP (unthrottled: the shift is the same, the LCP only a floor)');
for (const [name, url] of [['es home', '/'], ['es post', `/blog/${POST}/`], ['es projects', '/proyectos/'], ['es project', '/proyectos/luz/'], ['ar home', '/ar/']]) {
  for (const width of [375, 1280]) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 700 : 800 } });
    const pg = await ctx.newPage();
    await pg.addInitScript(() => {
      window.__cls = 0; window.__lcp = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    await pg.goto(base + url); await pg.waitForTimeout(2500);
    const { cls, lcp } = await pg.evaluate(() => ({ cls: window.__cls, lcp: window.__lcp }));
    console.log(`  ${name} @${width}: CLS ${cls.toFixed(3)}, LCP ${Math.round(lcp)} ms`);
    note(cls < 0.1, `${name} @${width}: CLS ${cls.toFixed(3)} (limit 0.1)`);
    note(lcp < 2500, `${name} @${width}: LCP ${Math.round(lcp)} ms (limit 2500)`);
    await ctx.close();
  }
}

console.log('text spacing and forced colours');
const SPACING = '*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-block-end:2em!important}';
for (const [name, url] of pages) {
  if (!exists(url) && !url.endsWith('404.html')) continue;
  if (quick && !key.has(name)) continue;
  for (const width of [375, 1280]) {
    const ctx = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: 'reduce' });
    const pg = await ctx.newPage();
    await pg.goto(base + url);
    await pg.addStyleTag({ content: SPACING });
    await pg.waitForTimeout(500);
    // text that a box cuts off: a clipping box whose content does not fit
    const cut = await pg.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => {
      if (e.closest('canvas, .vh, [hidden], luz-cookie-consent') || !e.textContent.trim()) return false;
      const c = getComputedStyle(e);
      if (!/hidden|clip/.test(c.overflowX + c.overflowY) || c.position === 'fixed') return false;
      return e.scrollHeight > e.clientHeight + 2 && /hidden|clip/.test(c.overflowY) || e.scrollWidth > e.clientWidth + 2 && /hidden|clip/.test(c.overflowX);
    }).map((e) => e.className || e.tagName).slice(0, 3));
    note(!cut.length, `${name} @${width} with the text spacing of 1.4.12: clipped ${cut.join(', ')}`);
    note(!(await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), `${name} @${width} with the text spacing of 1.4.12: scrolls sideways`);
    await ctx.close();
  }
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, forcedColors: 'active', reducedMotion: 'reduce' });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', (e) => errs.push(e.message));
  await pg.goto(base + url); await pg.waitForTimeout(500);
  note(!errs.length && !(await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), `${name} in forced colours: ${errs[0] ?? 'scrolls sideways'}`);
  await ctx.close();
}

await browser.close();
server.close();
console.log(fails.length ? `\n${fails.length} failure(s)` : '\n✓ audit passed');
process.exit(fails.length ? 1 : 0);
