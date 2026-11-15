// The images inside soynando.com's posts → maqueta/img/blog/posts/<id>-<n>.{avif,webp,jpg}
// (for <picture>), and each block's `img` in maqueta/shared/blog.json becomes the
// local .jpg path with its real width and height. Once the site is soynando.com
// there is no WordPress left to serve /wp-content/uploads/, so nothing may
// point there. Only blocks that still point at it are touched; run again after
// a re-import.
//   node maqueta/tools/soynando-images.cjs
// Needs ImageMagick.
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '../..');
const JSON_PATH = path.join(root, 'maqueta/shared/blog.json');
const out = path.join(root, 'maqueta/img/blog/posts');
const PUBLIC = '/maqueta/img/blog/posts';
// images a post points at that no longer exist in WordPress (404 there too),
// and the file in the media library that is the same picture
const MOVED = {
  'https://soynando.com/wp-content/uploads/2020/11/ikay-1024x341.jpg': 'https://soynando.com/wp-content/uploads/2022/05/ikay.jpg'
};

(async () => {
  const blog = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  fs.mkdirSync(out, { recursive: true });
  for (const p of blog.posts) {
    for (const lang of Object.keys(p).filter((k) => p[k] && p[k].body)) {
      p[lang].body.forEach((x, i) => {
        if (!x.img || !/^https?:\/\/(www\.)?soynando\.com\//.test(x.img)) return;
        x._from = x.img;
      });
      for (const [i, x] of p[lang].body.entries()) {
        if (!x._from) continue;
        const name = `${p.id}-${i}`, base = path.join(out, name), src = base + '.src';
        const res = await fetch(MOVED[x._from] || x._from);
        if (!res.ok) { console.log('✗', name, res.status, x._from); delete x._from; continue; }
        fs.writeFileSync(src, Buffer.from(await res.arrayBuffer()));
        const big = ['-auto-orient', '-resize', '1600x>', '-strip'];
        execFileSync('magick', [src, ...big, '-quality', '50', base + '.avif']);
        execFileSync('magick', [src, ...big, '-quality', '72', base + '.webp']);
        execFileSync('magick', [src, ...big, '-quality', '80', base + '.jpg']);
        fs.unlinkSync(src);
        const [w, h] = execFileSync('magick', ['identify', '-format', '%w %h', base + '.jpg']).toString().split(' ').map(Number);
        x.img = `${PUBLIC}/${name}.jpg`; x.w = w; x.hgt = h;
        console.log('✓', name, `${w}×${h}`, x.alt ? '' : '(no alt)');
        delete x._from;
      }
    }
  }
  fs.writeFileSync(JSON_PATH, JSON.stringify(blog, null, 1));
})();
