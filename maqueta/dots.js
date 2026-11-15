// Trama · the dot engine. Ordered dither (Bayer 8×8) mixed with seeded noise,
// a 3×5 digit font, text sampled from Archivo into a cell grid, and three
// drawers: the hero field (particles that resolve from noise into the name),
// a project block (a dithered rectangle that assembles with scroll) and the
// flight of dots between two sets of points (opening a project).

// The dots' three colours come from the tokens of the current colour mode
// (--dot-ink, --dot-mid, --dot-blaze in style.css) and are read again whenever
// the mode changes (shared/theme.js calls readPalette). LIGHT: the dots are
// dark on paper, so a picture is read the other way round (halftone below).
const PAL = { ink: '#f4f2ee', mid: '#c98a8f', blaze: '#963641' };
export let LIGHT = false;
export function readPalette() {
  const cs = getComputedStyle(document.documentElement), g = (n, d) => cs.getPropertyValue(n).trim() || d;
  PAL.ink = g('--dot-ink', PAL.ink); PAL.mid = g('--dot-mid', PAL.mid); PAL.blaze = g('--dot-blaze', PAL.blaze);
  LIGHT = document.documentElement.dataset.mode === 'light';
}
readPalette();
export const DPR = () => Math.min(window.devicePixelRatio || 1, 2);

const B8 = (() => {
  const m = [[0, 2], [3, 1]];
  let b = m;
  for (let k = 0; k < 2; k++) {
    const n = b.length, r = [];
    for (let y = 0; y < n * 2; y++) {
      r[y] = [];
      for (let x = 0; x < n * 2; x++) r[y][x] = 4 * b[y % n][x % n] + m[(y / n) | 0][(x / n) | 0];
    }
    b = r;
  }
  return b.map((row) => row.map((v) => (v + 0.5) / 64));
})();
export const bayer = (x, y) => B8[y & 7][x & 7];

export function rng(seed) {
  let s = (seed >>> 0) || 0x9e3779b9;
  return () => {
    s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

export function hash(str) {
  let h = 2166136261;
  for (const ch of String(str)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function h2(ix, iy, seed) {
  let h = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
export function noise(x, y, seed = 0) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = h2(ix, iy, seed), b = h2(ix + 1, iy, seed), c = h2(ix, iy + 1, seed), d = h2(ix + 1, iy + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (t) => t * t * (3 - 2 * t);
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// 3×5 digits, one string per row
const DIGITS = {
  0: ['111', '101', '101', '101', '111'], 1: ['010', '110', '010', '010', '111'],
  2: ['111', '001', '111', '100', '111'], 3: ['111', '001', '111', '001', '111'],
  4: ['101', '101', '111', '001', '001'], 5: ['111', '100', '111', '001', '111'],
  6: ['111', '100', '111', '101', '111'], 7: ['111', '001', '001', '001', '001'],
  8: ['111', '101', '111', '101', '111'], 9: ['111', '101', '111', '001', '111']
};
// cells of a number set in the 3×5 font, `scale` cells per font pixel
export function digitCells(str, scale = 1) {
  const out = [];
  [...str].forEach((d, k) => {
    const g = DIGITS[d];
    if (!g) return;
    for (let y = 0; y < 5; y++) for (let x = 0; x < 3; x++) {
      if (g[y][x] !== '1') continue;
      for (let sy = 0; sy < scale; sy++) for (let sx = 0; sx < scale; sx++)
        out.push([(k * 4 + x) * scale + sx, y * scale + sy]);
    }
  });
  return { cells: out, w: (str.length * 4 - 1) * scale, h: 5 * scale };
}

// Coverage (0–1) of `text` set in Archivo, sampled on a cols×rows grid
export function sampleText(text, cols, rows, { weight = 900, stretch = 'normal', fill = 0.94, align = 'center' } = {}) {
  const S = 8, W = cols * S, H = rows * S;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const font = (size) => `${weight} ${stretch} ${size}px Archivo, system-ui, sans-serif`;
  let size = (H * fill) / 0.72;
  ctx.font = font(size);
  let m = ctx.measureText(text);
  if (m.width > W * fill) { size *= (W * fill) / m.width; ctx.font = font(size); m = ctx.measureText(text); }
  ctx.fillStyle = '#fff';
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  const asc = m.actualBoundingBoxAscent, desc = m.actualBoundingBoxDescent;
  ctx.fillText(text, align === 'left' ? m.actualBoundingBoxLeft + S : W / 2, H / 2 + (asc - desc) / 2);
  const data = ctx.getImageData(0, 0, W, H).data;
  const cov = new Float32Array(cols * rows);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    cov[((y / S) | 0) * cols + ((x / S) | 0)] += data[(y * W + x) * 4 + 3];
  for (let i = 0; i < cov.length; i++) cov[i] /= 255 * S * S;
  return cov;
}

// The density patterns of the reference sheet: fades, clusters, columns, a core
export function pattern(kind, x, y, cols, rows, seed) {
  const u = x / Math.max(1, cols - 1), v = y / Math.max(1, rows - 1);
  const n = noise(x / 5, y / 4, seed);
  if (kind === 6) return 0.85 + 0.3 * n;                                 // flat
  switch (kind % 6) {
    case 0: return 0.2 + 0.8 * u * (0.7 + 0.6 * n);                      // fades to the right
    case 1: return (1 - 0.8 * v) * (0.75 + 0.5 * n);                      // fades downward
    case 2: return Math.pow(noise(x / 6, y / 6, seed), 1.4) * 1.5;        // clusters
    case 3: return (((x >> 2) & 1) ? 1 : 0.35) * (0.7 + 0.5 * n);          // columns
    case 4: { const d = Math.hypot(u - 0.5, (v - 0.5) * 0.8); return clamp(1.25 - d * 2) * (0.7 + 0.5 * n); } // core
    default: return (0.3 + 0.7 * (1 - u)) * (0.6 + 0.8 * n);               // fades to the left
  }
}

function sizeCanvas(cv, w, h) {
  const r = DPR();
  cv.width = Math.round(w * r); cv.height = Math.round(h * r);
  const ctx = cv.getContext('2d');
  ctx.setTransform(r, 0, 0, r, 0, 0);
  return ctx;
}

// ---------------------------------------------------------------- tone
// A picture read as tone: its grey levels stretched to 0–1 (2nd–98th
// percentile). `mean` lets a block light, on average, as many cells as its
// density (the year) asks: the picture decides where the dots go and how big
// they are, the year still decides how many.
export function loadTone(src) {
  return new Promise((ok) => {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => {
      const w = im.naturalWidth, h = im.naturalHeight;
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(im, 0, 0);
      const px = ctx.getImageData(0, 0, w, h).data, g = new Float32Array(w * h);
      for (let i = 0; i < g.length; i++) g[i] = (px[i * 4] * 0.2126 + px[i * 4 + 1] * 0.7152 + px[i * 4 + 2] * 0.0722) / 255;
      // a light picture (a page on white) is read in negative, so the dots
      // draw the thing and not the paper around it: ink is light here
      let raw = 0;
      for (let i = 0; i < g.length; i++) raw += g[i];
      const negated = raw / g.length > 0.55;
      if (negated) for (let i = 0; i < g.length; i++) g[i] = 1 - g[i];
      const sorted = Float32Array.from(g).sort();
      const lo = sorted[(g.length * 0.02) | 0], hi = sorted[(g.length * 0.98) | 0], span = Math.max(0.05, hi - lo);
      let sum = 0;
      for (let i = 0; i < g.length; i++) { g[i] = clamp((g[i] - lo) / span); sum += g[i]; }
      ok({ w, h, g, negated, mean: Math.max(0.08, sum / g.length) });
    };
    im.onerror = () => ok(null);
    im.src = src;
  });
}

// Halftone a cell: whether it lights (dithered against the year's density,
// nudged by the tone) and how big its dot is (the tone itself).
export const halftone = (t, tone, density, threshold) => {
  // light mode: the dots are dark, so they draw the dark parts of a photo
  // (a picture already read as a negative, a page on white, draws its content either way)
  const flip = LIGHT && !t.negated, v = flip ? 1 - tone : tone, mean = Math.max(0.08, flip ? 1 - t.mean : t.mean);
  const d = density * (0.3 + 0.7 * v / mean);
  return threshold < d ? 0.12 + 0.36 * Math.pow(v, 0.8) : 0;
};

// The tone under cell (x, y) of a cols×rows grid of cw×ch cells, the
// picture laid in like object-fit: cover, its focus near the top (where a
// page shows what it is).
export function toneAt(t, x, y, cols, rows, cw, ch, fy = 0.15) {
  const W = cols * cw, H = rows * ch, s = Math.max(W / t.w, H / t.h);
  const ox = (t.w * s - W) / 2, oy = (t.h * s - H) * fy;
  const ix = Math.min(t.w - 1, Math.max(0, ((x + 0.5) * cw + ox) / s | 0));
  const iy = Math.min(t.h - 1, Math.max(0, ((y + 0.5) * ch + oy) / s | 0));
  return t.g[iy * t.w + ix];
}

// ---------------------------------------------------------------- blocks
// A project block: a dithered rectangle. `density` (the year) sets how many
// cells are lit, `rows` (the length of its text) sets its height, `label`
// (its number) is cut into it in the 3×5 font. With `tone` (loadTone) the
// dots draw the project's picture instead of a pattern.
export class DotBlock {
  constructor(canvas, o) {
    this.cv = canvas;
    this.o = { cell: 8, rows: 14, density: 0.6, kind: 0, seed: 1, label: '', corner: 0, ...o };
    this.p = 0; this.ptr = null; this.cells = [];
    this.resize();
  }
  resize() {
    const o = this.o, w = this.cv.clientWidth || this.cv.parentElement.clientWidth;
    if (!w) return;
    const cols = Math.max(8, Math.floor(w / o.cell));
    const rows = o.rows, cw = w / cols, h = rows * o.cell;
    this.cv.style.height = h + 'px';
    this.w = w; this.h = h; this.cw = cw; this.ch = o.cell;
    this.ctx = sizeCanvas(this.cv, w, h);
    const rand = rng(o.seed), cells = [];
    // the label, its margin cleared
    const glyph = new Set(), clear = new Set();
    if (o.label) {
      const scale = rows >= 16 && cols >= 30 ? 2 : 1;
      const g = digitCells(o.label, scale);
      const gx = o.corner ? cols - g.w - 2 : 2, gy = o.corner ? rows - g.h - 2 : 2;
      for (let y = -1; y <= g.h; y++) for (let x = -1; x <= g.w; x++) clear.add((gy + y) * cols + gx + x);
      g.cells.forEach(([x, y]) => glyph.add((gy + y) * cols + gx + x));
    }
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const id = y * cols + x, r1 = rand(), r2 = rand();
      let on, size;
      if (glyph.has(id)) { on = true; size = 0.46; }
      else if (clear.has(id)) on = false;
      else {
        const th = bayer(x, y) * 0.62 + r1 * 0.38;
        if (o.tone) {
          size = halftone(o.tone, toneAt(o.tone, x, y, cols, rows, cw, o.cell), o.density, th);
          on = size > 0;
        } else {
          const d = o.density * pattern(o.kind, x, y, cols, rows, o.seed);
          on = th < d;
          size = 0.26 + 0.14 * clamp(d);
        }
      }
      if (on) cells.push({ x: (x + 0.5) * cw, y: (y + 0.5) * o.cell, r: size * Math.min(cw, o.cell), rank: glyph.has(id) ? r2 * 0.25 : r2, g: glyph.has(id) });
    }
    this.cells = cells;
    this.draw(this.p, true);
  }
  // p: 0 (dust) → 1 (assembled). ptr: {x,y} in canvas px or null
  draw(p, force) {
    if (!this.ctx) return;
    if (!force && Math.abs(p - this.p) < 0.004 && !this.ptr && !this.hadPtr) return;
    this.p = p; this.hadPtr = !!this.ptr;
    const ctx = this.ctx, R = 70, ptr = this.ptr;
    ctx.clearRect(0, 0, this.w, this.h);
    const paths = [new Path2D(), new Path2D(), new Path2D()];
    for (const c of this.cells) {
      const k = clamp((p * 1.2 - c.rank) / 0.2);
      if (k <= 0) continue;
      let x = c.x, y = c.y, r = c.r * (0.35 + 0.65 * smooth(k)), b = 0;
      // not yet settled: the dot drifts in from below
      y += (1 - smooth(k)) * 14;
      if (ptr) {
        const dx = x - ptr.x, dy = y - ptr.y, d = Math.hypot(dx, dy);
        if (d < R) {
          const f = Math.pow(1 - d / R, 2);
          x += (dx / (d || 1)) * f * 16; y += (dy / (d || 1)) * f * 16;
          r *= 1 + f * 0.6; b = f > 0.35 ? 2 : f > 0.08 ? 1 : 0;
        }
      }
      paths[b].moveTo(x + r, y);
      paths[b].arc(x, y, r, 0, Math.PI * 2);
    }
    ctx.fillStyle = PAL.ink; ctx.fill(paths[0]);
    ctx.fillStyle = PAL.mid; ctx.fill(paths[1]);
    ctx.fillStyle = PAL.blaze; ctx.fill(paths[2]);
  }
  // the lit dots, in viewport coordinates
  points() {
    const b = this.cv.getBoundingClientRect(), sx = b.width / this.w || 1;
    return this.cells
      .filter((c) => c.rank < this.p * 1.2)
      .map((c) => ({ x: b.left + c.x * sx, y: b.top + c.y * sx, r: c.r }));
  }
}

// ---------------------------------------------------------------- hero
// The name as particles: they start as noise scattered over the canvas and
// fall into place; floating dithered patches around it echo the reference
// sheet. The pointer pushes them (blaze where it touches).
export class HeroField {
  // lost: share of the letters' dots that have fallen to the floor of the
  // field (more towards the right); mend() puts them back for a moment.
  constructor(canvas, text, { reduce = false, plain = 0, lost = 0 } = {}) {
    this.cv = canvas; this.text = text; this.reduce = reduce; this.plain = plain; this.lost = lost; this.mendT = 0;
    this.ptr = null; this.t0 = 0; this.running = false; this.wave = null;
    this.layout();
  }
  layout() {
    const w = this.cv.clientWidth, h = this.cv.clientHeight;
    if (!w || !h) return;
    this.w = w; this.h = h;
    this.ctx = sizeCanvas(this.cv, w, h);
    const narrow = w < 640, plain = this.plain;
    const cell = plain ? h / plain : narrow ? 7.5 : w < 1100 ? 9.5 : w < 1600 ? 11 : 13;
    const cols = Math.floor(w / cell), rows = Math.floor(h / cell);
    const cw = w / cols, ch = h / rows;
    this.cell = cell;
    const rand = rng(hash(this.text) ^ cols);
    // the name, at the foot of the field
    const tCols = plain ? cols : cols - (narrow ? 2 : 6);
    const tRows = plain ? rows : Math.min(rows - 6, narrow ? Math.round(tCols * 0.5) : Math.round(tCols * 0.27));
    const tx = plain ? 0 : Math.round((cols - tCols) / 2), ty = plain ? 0 : rows - tRows - (narrow ? 1 : 2);
    const cov = plain
      ? sampleText(this.text, tCols, tRows, { stretch: 'semi-condensed', weight: 800, fill: 0.86, align: 'left' })
      : sampleText(this.text.toUpperCase(), tCols, tRows, { stretch: narrow ? 'extra-condensed' : 'semi-condensed', fill: 1 });
    const covAt = (x, y) => (x < tx || y < ty || x >= tx + tCols || y >= ty + tRows) ? 0 : cov[(y - ty) * tCols + (x - tx)];
    // floating patches above the name
    const patches = [], n = plain ? 0 : narrow ? 4 : 7, top = ty - 3;
    for (let k = 0, tries = 0; k < n && tries < 400; tries++) {
      const pw = Math.round((narrow ? 9 : 12) + rand() * (narrow ? 16 : 30));
      const ph = Math.round((narrow ? 4 : 5) + rand() * (narrow ? 7 : 12));
      const px = Math.round(1 + rand() * (cols - pw - 2)), py = Math.round(1 + rand() * (top - ph - 1));
      if (py < 1 || px < 1) continue;
      if (patches.some((q) => px < q.x + q.w + 3 && px + pw + 3 > q.x && py < q.y + q.h + 2 && py + ph + 2 > q.y)) continue;
      patches.push({ x: px, y: py, w: pw, h: ph, kind: (rand() * 6) | 0, d: 0.55 + rand() * 0.5, seed: (rand() * 1e6) | 0 });
      k++;
    }
    const parts = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const c = covAt(x, y);
      let r = 0, kind = 0;
      if (c > 0.5) { r = 0.44; kind = 1; }
      else if (c > 0.12 && bayer(x, y) < c * 1.4) { r = 0.22; kind = 2; }
      else {
        const q = patches.find((q) => x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h);
        if (q) {
          const d = q.d * pattern(q.kind, x - q.x, y - q.y, q.w, q.h, q.seed);
          if (bayer(x, y) * 0.6 + rand() * 0.4 < d) { r = 0.24 + 0.16 * clamp(d); kind = 3; }
        } else if (!plain && rand() < 0.012 * (0.3 + y / rows)) { r = 0.16; kind = 4; }
      }
      if (!r) continue;
      const hx = (x + 0.5) * cw, hy = (y + 0.5) * ch;
      parts.push({
        hx, hy, x: rand() * w, y: rand() * h, sx: 0, sy: 0, vx: 0, vy: 0,
        r: r * Math.min(cw, ch), kind, ph: rand() * 6.28,
        delay: kind === 1 ? 250 + (x - tx) / tCols * 700 + rand() * 300 : rand() * 900
      });
    }
    if (this.lost) {
      for (const p of parts) {
        if (p.kind !== 1) continue;
        const u = clamp((p.hx / w - 0.45) / 0.5);
        if (rand() > this.lost * (0.25 + 1.75 * u * u)) continue;
        p.lost = true; p.ox = p.hx; p.oy = p.hy;
        p.hx = clamp(p.hx + (rand() - 0.5) * cw * 10, p.r, w - p.r);
        p.hy = h - p.r - 1 - rand() * rand() * ch * 2.2;
        p.fx = p.hx; p.fy = p.hy;
      }
    }
    parts.forEach((p) => { p.sx = p.x; p.sy = p.y; });
    if (this.reduce || this.done) parts.forEach((p) => { p.x = p.hx; p.y = p.hy; });
    this.parts = parts;
    this.intro = !(this.reduce || this.done);
    this.t0 = performance.now();
    this.frame(performance.now());
  }
  start() {
    if (this.running || this.reduce) return;
    this.running = true;
    const loop = (t) => { if (!this.running) return; this.frame(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  stop() { this.running = false; }
  poke(x, y) { if (!this.reduce) this.wave = { x, y, t: performance.now() }; }
  mend() { this.mendT = performance.now(); if (this.reduce) { this.parts.forEach((p) => { if (p.lost) { p.x = p.ox; p.y = p.oy; } }); this.frame(this.mendT); } }
  frame(now) {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = now - this.t0, ptr = this.ptr, R = this.w < 640 ? 70 : 130;
    let introLeft = false;
    const paths = [new Path2D(), new Path2D(), new Path2D()];
    const dust = new Path2D();
    const wave = this.wave && (now - this.wave.t) < 1400 ? this.wave : null;
    const mending = this.lost && this.mendT && now - this.mendT < 2600;
    for (const p of this.parts) {
      if (p.lost && !this.intro && !this.reduce) {
        // mended: back to its place in the letter; otherwise it falls and bounces on the floor
        p.hx = mending ? p.ox : p.fx; p.hy = mending ? p.oy : p.fy;
        if (!mending) {
          let fx = 0;
          if (ptr) { const dx = p.x - ptr.x, dy = p.y - ptr.y, d = Math.hypot(dx, dy); if (d < R) fx = (dx / (d || 1)) * Math.pow(1 - d / R, 2) * 6; }
          p.vx = (p.vx + fx) * 0.94; p.vy += 0.55;
          p.x = clamp(p.x + p.vx, p.r, this.w - p.r); p.y += p.vy;
          if (p.y > p.fy) { p.y = p.fy; p.vy *= -0.32; p.vx *= 0.8; if (Math.abs(p.vy) < 0.6) p.vy = 0; }
          p.hx = p.x; p.hy = p.fy;
          paths[1].moveTo(p.x + p.r, p.y); paths[1].arc(p.x, p.y, p.r, 0, 6.283);
          continue;
        }
      }
      if (this.intro) {
        const k = clamp((t - p.delay) / 1300);
        if (k < 1) introLeft = true;
        const e = easeInOut(k);
        p.x = p.sx + (p.hx - p.sx) * e; p.y = p.sy + (p.hy - p.sy) * e;
      } else if (!this.reduce) {
        let fx = (p.hx - p.x) * 0.06, fy = (p.hy - p.y) * 0.06;
        if (ptr) {
          const dx = p.x - ptr.x, dy = p.y - ptr.y, d = Math.hypot(dx, dy);
          if (d < R) { const f = Math.pow(1 - d / R, 2) * 5; fx += (dx / (d || 1)) * f; fy += (dy / (d || 1)) * f; }
        }
        if (wave) {
          const age = (now - wave.t) / 1400, ring = age * Math.max(this.w, this.h) * 0.9;
          const dx = p.x - wave.x, dy = p.y - wave.y, d = Math.hypot(dx, dy), band = Math.abs(d - ring);
          if (band < 40) { const f = (1 - band / 40) * 3 * (1 - age); fx += (dx / (d || 1)) * f; fy += (dy / (d || 1)) * f; }
        }
        p.vx = (p.vx + fx) * 0.8; p.vy = (p.vy + fy) * 0.8;
        p.x += p.vx; p.y += p.vy;
      }
      const disp = Math.hypot(p.x - p.hx, p.y - p.hy);
      let r = p.r;
      if (p.kind === 4) { r *= 0.6 + 0.4 * Math.sin(now / 900 + p.ph); dust.moveTo(p.x + r, p.y); dust.arc(p.x, p.y, Math.max(0.3, r), 0, 6.283); continue; }
      const b = this.intro ? (disp > 60 ? 1 : 0) : disp > 9 ? 2 : disp > 2.5 ? 1 : 0;
      paths[b].moveTo(p.x + r, p.y);
      paths[b].arc(p.x, p.y, r, 0, 6.283);
    }
    if (this.intro && !introLeft) { this.intro = false; this.done = true; }
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalAlpha = 0.55; ctx.fillStyle = PAL.ink; ctx.fill(dust); ctx.globalAlpha = 1;
    ctx.fillStyle = PAL.ink; ctx.fill(paths[0]);
    ctx.fillStyle = PAL.mid; ctx.fill(paths[1]);
    ctx.fillStyle = PAL.blaze; ctx.fill(paths[2]);
  }
}

// ---------------------------------------------------------------- field
// The open project's field, on a full-screen canvas: a dithered region with
// the project's number set big in it.
export function fieldPoints(w, h, { region, label, density = 0.7, seed = 1, cell = 9, tone = null }) {
  const { x: rx, y: ry, w: rw, h: rh } = region;
  const cols = Math.floor(rw / cell), rows = Math.floor(rh / cell);
  const rand = rng(seed), out = [];
  // with a picture the number gives it room: a quarter of the height, not half
  const scale = Math.max(2, Math.floor(Math.min((cols - 4) / (label.length * 4 - 1), (rows * (tone ? 0.22 : 0.55)) / 5)));
  const g = digitCells(label, scale);
  const gx = 2, gy = rows - g.h - 2;
  const glyph = new Set(g.cells.map(([x, y]) => (gy + y) * cols + gx + x));
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const id = y * cols + x;
    const inBox = x >= gx - 1 && x <= gx + g.w && y >= gy - 1 && y <= gy + g.h;
    let r = 0;
    if (glyph.has(id)) r = 0.45;
    else if (!inBox) {
      const v = y / rows, u = x / cols;
      const th = bayer(x, y) * 0.6 + rand() * 0.4;
      if (tone) {
        r = halftone(tone, toneAt(tone, x, y, cols, rows, rw / cols, rh / rows), density, th);
        if (!r) continue;
      } else {
        const d = density * (0.25 + 0.95 * Math.pow(noise(x / 7, y / 6, seed), 1.3)) * (1 - 0.55 * v) * (0.6 + 0.4 * (1 - u));
        if (th < d) r = 0.2 + 0.16 * clamp(d);
        else continue;
      }
    } else continue;
    out.push({ x: rx + (x + 0.5) * (rw / cols), y: ry + (y + 0.5) * (rh / rows), r: r * cell * 1.0, g: glyph.has(id) });
  }
  return out;
}

export function drawPoints(ctx, w, h, pts) {
  ctx.clearRect(0, 0, w, h);
  const a = new Path2D();
  for (const p of pts) { a.moveTo(p.x + p.r, p.y); a.arc(p.x, p.y, p.r, 0, 6.283); }
  ctx.fillStyle = PAL.ink; ctx.fill(a);
}

// Flight: every target dot leaves from one of the source dots and curves
// to its place; mid-flight the dots burn blaze.
export function fly(cv, sources, targets, { dur = 950, reverse = false } = {}) {
  const w = cv.clientWidth, h = cv.clientHeight;
  const ctx = sizeCanvas(cv, w, h);
  const rand = rng(targets.length * 7919 + sources.length);
  const n = sources.length;
  const legs = targets.map((t, i) => {
    const s = n ? sources[(i * 2654435761 >>> 0) % n] : { x: rand() * w, y: rand() * h, r: t.r };
    const a = reverse ? t : s, b = reverse ? s : t;
    const mx = (a.x + b.x) / 2 + (rand() - 0.5) * w * 0.5, my = (a.y + b.y) / 2 + (rand() - 0.5) * h * 0.5;
    return { a, b, mx, my, delay: rand() * 0.3 };
  });
  return new Promise((done) => {
    const t0 = performance.now();
    const step = (now) => {
      const T = clamp((now - t0) / dur);
      ctx.clearRect(0, 0, w, h);
      const p0 = new Path2D(), p1 = new Path2D(), p2 = new Path2D();
      for (const l of legs) {
        const k = easeInOut(clamp((T - l.delay) / 0.7)), u = 1 - k;
        const x = u * u * l.a.x + 2 * u * k * l.mx + k * k * l.b.x;
        const y = u * u * l.a.y + 2 * u * k * l.my + k * k * l.b.y;
        const r = l.a.r + (l.b.r - l.a.r) * k;
        const heat = Math.sin(k * Math.PI);
        const path = heat > 0.6 ? p2 : heat > 0.15 ? p1 : p0;
        path.moveTo(x + r, y); path.arc(x, y, Math.max(0.4, r), 0, 6.283);
      }
      ctx.fillStyle = PAL.ink; ctx.fill(p0);
      ctx.fillStyle = PAL.mid; ctx.fill(p1);
      ctx.fillStyle = PAL.blaze; ctx.fill(p2);
      if (T < 1) requestAnimationFrame(step); else done(ctx);
    };
    requestAnimationFrame(step);
  });
}
