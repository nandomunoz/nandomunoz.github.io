// Screenshots of each project's demo (or its GitHub page when it has none, or
// the image named in IMAGES),
// saved as maqueta/img/proyectos/<id>.{avif,webp,jpg} for <picture>, plus
// <id>.tone.webp (192 px, grey) that the dot engine samples.
// The home reads them only to place dots; the panel shows them in grey.
//   node maqueta/tools/project-shots.cjs [id…]
// Needs playwright-core (PLAYWRIGHT_CORE=/path/to/playwright-core), a Chromium
// (CHROME=/path/to/chrome if playwright's own is missing) and ImageMagick.
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');

const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'maqueta/img/proyectos');
const projects = require(path.join(root, 'data/projects.json'));
const only = process.argv.slice(2);
// projects whose picture is an image of their own rather than a screenshot
const IMAGES = {
  'toolbar-aem': 'https://raw.githubusercontent.com/nandovejer/toolbar-aem/master/toolbar-aem-01.jpeg'
};

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, colorScheme: 'dark' });
  for (const p of projects) {
    if (only.length && !only.includes(p.id)) continue;
    const url = p.demo || p.repo;
    const png = path.join(out, `${p.id}.png`);
    try {
      if (IMAGES[p.id]) {
        const res = await fetch(IMAGES[p.id]);
        if (!res.ok) throw new Error(`${res.status} ${IMAGES[p.id]}`);
        fs.writeFileSync(png, Buffer.from(await res.arrayBuffer()));
      } else {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1500);
        await page.screenshot({ path: png });
      }
    } catch (e) { console.log('✗', p.id, e.message.split('\n')[0]); continue; }
    const base = path.join(out, p.id);
    execFileSync('magick', [png, '-resize', '1200x', '-quality', '50', base + '.avif']);
    execFileSync('magick', [png, '-resize', '1200x', '-quality', '72', base + '.webp']);
    execFileSync('magick', [png, '-resize', '1200x', '-quality', '78', '-strip', base + '.jpg']);
    // a tiny grey copy, read only by the dot engine (tone per cell)
    execFileSync('magick', [png, '-resize', '192x', '-colorspace', 'Gray', '-quality', '80', base + '.tone.webp']);
    fs.unlinkSync(png);
    console.log('✓', p.id, IMAGES[p.id] || url);
  }
  await browser.close();
})();
