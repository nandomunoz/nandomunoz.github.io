// Screenshots of each project's demo (the repo's own index.html, served from a shallow clone,
// when it has no public demo but ships a demo page; the README as GitHub draws it when it has
// neither; or the image named in IMAGES),
// saved as maqueta/img/proyectos/<id>.{avif,webp,jpg} for <picture>, plus
// <id>.tone.webp (192 px, grey) that the dot engine samples.
// The home reads them only to place dots; the panel shows them in grey.
//   node maqueta/tools/project-shots.cjs [id…]
// Needs playwright-core (PLAYWRIGHT_CORE=/path/to/playwright-core), a Chromium
// (CHROME=/path/to/chrome if playwright's own is missing) and ImageMagick.
const path = require('path');
const fs = require('fs');
const os = require('os');
const http = require('http');
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

// repos with no public demo that ship a demo page of their own (index.html): cloned and served here
const LOCAL = { 'illo-loader': 'main', 'js-subtype': 'master' };
const ZOOM = { 'illo-loader': 4 };   // the loaders are tiny: enlarged (a smaller viewport at a higher pixel ratio) so the picture says what they are
// repos with nothing to open: the README is the picture (just the rendered article, not GitHub's chrome)
const README = ['libros-del-mundo'];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.gif': 'image/gif', '.png': 'image/png', '.svg': 'image/svg+xml' };
function serveRepo(p) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `shot-${p.id}-`));
  execFileSync('git', ['clone', '-q', '--depth', '1', p.repo, dir]);
  return new Promise((ok) => {
    const srv = http.createServer((req, res) => {
      const f = path.join(dir, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
      if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
    }).listen(0, () => ok({ url: `http://localhost:${srv.address().port}/`, close: () => srv.close() }));
  });
}

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
      } else if (LOCAL[p.id]) {
        const srv = await serveRepo(p), z = ZOOM[p.id] || 1;
        const ctx = await browser.newContext({ viewport: { width: 1440 / z, height: 900 / z }, deviceScaleFactor: z, colorScheme: 'dark' });
        const pg = await ctx.newPage();
        await pg.goto(srv.url, { waitUntil: 'networkidle', timeout: 30000 });
        await pg.waitForTimeout(1500);
        await pg.screenshot({ path: png }); await ctx.close(); srv.close();
      } else if (README.includes(p.id)) {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        const box = await page.locator('article.markdown-body').first().boundingBox();
        await page.screenshot({ path: png, fullPage: true, clip: { x: box.x, y: box.y, width: Math.min(box.width, 1200), height: Math.min(box.width, 1200) * 0.625 } });   // 16:10, like the others
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
