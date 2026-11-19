// The social card of every page that has no picture of its own (plan Phase 9, D7): the cover of the home in each
// language, 1200 × 630, taken from the built site once the poster has been typed in. Needs Chromium (playwright-core)
// and `npm run build` + a server on :4399 (python3 -m http.server 4399 -d dist). Run it again when the cover changes.
//   node tools/og-home.mjs <path to playwright-core> <chromium executable>
import { createRequire } from 'node:module';
const [pw, exe] = process.argv.slice(2);
const { chromium } = createRequire(pw.endsWith('/') ? pw : pw + '/')('playwright-core');
const b = await chromium.launch({ executablePath: exe });
for (const [l, path] of [['es', '/'], ['en', '/en/'], ['ar', '/ar/']]) {
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.addInitScript(() => localStorage.setItem('luz-theme', 'dark'));
  await p.goto('http://127.0.0.1:4399' + path);
  await p.waitForTimeout(7500);                                   // typed in, rain fallen
  await p.addStyleTag({ content: 'header.top, .nav, .luz-theme-mode__button, .caret, .rail, luz-cookie-consent { display: none !important }' });   // a card shows the cover, not the interface
  await p.screenshot({ path: new URL(`../public/og/${l}.jpg`, import.meta.url).pathname, type: 'jpeg', quality: 82 });
  await p.close();
  console.log('✓ public/og/' + l + '.jpg');
}
await b.close();
