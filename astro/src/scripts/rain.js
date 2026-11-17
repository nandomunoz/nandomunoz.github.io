// Trama · Lluvia: Matrix rain on a canvas, with a mask cut out of it. Used by the
// home's hero (the cycle: the name, the poster's cats and the desk picture in turn),
// the 404 (the desk picture) and the sandbox in variantes/.
// The rain is Nando's «The Matrix Rain Cool» pen: its glyphs (3e4 + random·33), a drop
// per column writing a new glyph at its head (bright) every tick while the ones it
// leaves behind fade into a sheet of code that is always there, the columns in groups
// as on the poster. The mask is cut out of that sheet, to the pixel, so its shapes take
// a little of the page's own colour (over a faint wash): the name after the film's
// title (wide serif capitals sliced into shifted strips), the poster's two cats, or a
// picture read by its light. Below the baseline the rain dissolves into the page. The
// first time a field loads, the pen's rain: the sheet starts empty and every column's
// drop falls in green, writing it, before the mask fades in. A click (or a tap) scans
// in a circle, as the colour-mode button reveals the page: a dotted green ring grows
// from the point, decoding every cell it crosses, the green easing out behind it.
// It moves for 5 s and then rests on a still frame (WCAG 2.2.2); a pointer moving
// over it, a touch or a click wakes it for another 5 s. Reduced motion: no loop at all.
//
//   const f = new RainField(canvas, { mask: 'cycle' | 'name' | 'cats' | 'image', name, src, dots });
//   (dots: the site's dots, small and on a fine grid, instead of the pen's glyphs)
//   f.layout(); f.start(); f.poke(x, y); f.repaint(); f.stop();
import { rng, clamp } from './dots.js';
import { CATS } from './gatos.js';
import deskUrl from '../assets/escritorio.jpg?url';

const TAU = Math.PI * 2;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;
let P = {};
export function readP() {
  const s = getComputedStyle(document.documentElement), g = (n) => s.getPropertyValue(n).trim();
  P = { ink: g('--dot-ink'), mid: g('--dot-mid'), accent: g('--dot-accent'), faint: g('--faint'), mute: g('--mute'), bg: g('--bg') };
  P.green = g('--matrix') || '#3dff7a';                             // the scan's Matrix green (luz-theme-trama.css, per colour mode)
}

// ---------------------------------------------------------------- the name's mask
// NANDO MUÑOZ after the Matrix title (one line; NANDO over MUÑOZ on a phone): wide serif capitals (Playfair Display, already
// in the repo under the OFL, stretched sideways and tracked out), each letter sliced
// into two or three horizontal strips at its own heights, the strips nudged left and
// right with a hairline gap between, and at some cuts a thin streak running past the
// letter. Its last baseline sits on `base` (px). Drawn once per size into a mask.
const TITLE = (px) => `600 ${px}px "Playfair Display", Georgia, "Times New Roman", serif`;
function nameMask(w, h, narrow, baseY, text = 'Nando Muñoz') {
  const T = text.toUpperCase(), sp = T.indexOf(' '), lines = narrow && sp > 0 ? [T.slice(0, sp), T.slice(sp + 1)] : [T], rand = rng(7);
  const SX = narrow ? 1.12 : 1.12, TRACK = narrow ? 0.1 : 0.17, SPACE = 0.9, LEAD = 0.42;  // stretch; tracking, word space and leading in cap heights
  const t = document.createElement('canvas').getContext('2d'); t.font = TITLE(100);
  const cap = t.measureText('N').actualBoundingBoxAscent;
  const adv = (ch) => (ch === ' ' ? SPACE * cap : t.measureText(ch).width * SX);
  const lineW = (line) => [...line].reduce((sum, ch, i) => sum + adv(ch) + (i && line[i - 1] !== ' ' && ch !== ' ' ? TRACK * cap : 0), 0);
  const W = Math.max(...lines.map(lineW)), H = lines.length * cap + (lines.length - 1) * LEAD * cap;
  const k = Math.min((w * (narrow ? 0.9 : 0.92)) / W, (h * (narrow ? 0.56 : 0.42)) / H);   // units of the 100px font → px
  const dpr = Math.min(devicePixelRatio || 1, 2), mc = document.createElement('canvas'); mc.width = Math.round(w * dpr); mc.height = Math.round(h * dpr);
  const m = mc.getContext('2d'); m.setTransform(dpr, 0, 0, dpr, 0, 0); m.font = TITLE(100 * k); m.textBaseline = 'alphabetic'; m.fillStyle = '#000';
  const C = cap * k;
  lines.forEach((line, li) => {
    let x = (w - lineW(line) * k) / 2;
    const base = baseY - (lines.length - 1 - li) * (1 + LEAD) * C;
    [...line].forEach((ch, i) => {
      if (ch === ' ') { x += adv(ch) * k; return; }
      if (i && line[i - 1] !== ' ') x += TRACK * C;
      const lw = adv(ch) * k, n = rand() < 0.45 ? 2 : 1, cuts = [];
      for (let j = 0; j < n; j++) cuts.push(0.26 + rand() * 0.5);
      cuts.sort((a, b) => a - b);
      const edges = [-0.7, ...cuts, 1.2], gap = Math.max(1.2, C * 0.022);
      for (let j = 0; j < edges.length - 1; j++) {                   // each strip, nudged sideways
        const top = base - C + edges[j] * C + (j ? gap / 2 : 0), bot = base - C + edges[j + 1] * C - (j < edges.length - 2 ? gap / 2 : 0);
        const dx = j === 0 ? 0 : (rand() < 0.5 ? -1 : 1) * lw * (0.03 + rand() * 0.06);
        m.save(); m.beginPath(); m.rect(x - lw, top, lw * 3, bot - top); m.clip();
        m.translate(x + dx, base); m.scale(SX, 1); m.fillText(ch, 0, 0); m.restore();
      }
      for (const c of cuts) if (rand() < 0.35) {                        // now and then a streak off the cut, past the letter's side
        const y = base - C + c * C, right = rand() < 0.5, len = lw * (0.25 + rand() * 0.6);
        m.fillRect(right ? x + lw * 0.95 : x + lw * 0.05 - len, y - 0.5, len, 1);
      }
      x += lw;
    });
  });
  return mc;
}

// ---------------------------------------------------------------- the cats' mask
// The poster's two cats (gatos.js), as they stand on it: the back half of one
// leaving on the left edge, the front half coming in on the right, paws on the
// baseline, as tall as the field allows (each no wider than half of it).
function catsMask(w, h, narrow, baseY) {
  const L = CATS.left, R = CATS.right, tall = CATS.base - Math.min(L.y0, R.y0);
  const s = Math.min((baseY * (narrow ? 0.62 : 0.8)) / tall, (w * 0.47) / (L.x1 - L.x0), (w * 0.47) / (CATS.W - R.x0));
  const dpr = Math.min(devicePixelRatio || 1, 2), mc = document.createElement('canvas'); mc.width = Math.round(w * dpr); mc.height = Math.round(h * dpr);
  const m = mc.getContext('2d'); m.fillStyle = '#000';
  const put = (shape, tx) => {
    m.setTransform(dpr * s, 0, 0, dpr * s, dpr * tx, dpr * (baseY - CATS.base * s));
    const p = shape.pts; m.beginPath(); m.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) m.lineTo(p[i], p[i + 1]); m.closePath(); m.fill();
  };
  put(L, -L.x0 * s - 1);                                            // flush with the left edge
  put(R, w - CATS.W * s + 1);                                       // flush with the right edge
  return mc;
}

// ---------------------------------------------------------------- an image as the mask
// A picture instead of a silhouette: it covers the field (cropped around a focal
// point) and its light decides where the rain stays: dark parts cut it away, lit
// parts keep it, so the scene is drawn in the rain itself. The picture is only read
// for its pixels here, never shown. Loaded once; the field is rebuilt when it lands.
const pics = {};
function picture(src, onload) {
  if (!pics[src]) { const im = new Image(); pics[src] = im; im.decoding = 'async'; im.src = src; }
  const im = pics[src];
  if (!im.complete || !im.naturalWidth) { im.addEventListener('load', onload, { once: true }); return null; }
  return im;
}
function imageMask(w, h, im, fx = 0.45, fy = 0.42) {
  const dpr = Math.min(devicePixelRatio || 1, 2), W = Math.round(w * dpr), H = Math.round(h * dpr);
  const mc = document.createElement('canvas'); mc.width = W; mc.height = H;
  const m = mc.getContext('2d', { willReadFrequently: true });
  const s = Math.max(W / im.naturalWidth, H / im.naturalHeight), dw = im.naturalWidth * s, dh = im.naturalHeight * s;
  m.drawImage(im, clamp(W / 2 - dw * fx, W - dw, 0), clamp(H / 2 - dh * fy, H - dh, 0), dw, dh);   // cover, around the focal point
  const d = m.getImageData(0, 0, W, H), p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const lum = (0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2]) / 255;
    const keep = clamp((lum - 0.06) / 0.42), k = keep * keep * (3 - 2 * keep);   // how much rain stays: none in the dark, all in the light
    p[i] = p[i + 1] = p[i + 2] = 0; p[i + 3] = Math.round((1 - k) * 255);
  }
  m.putImageData(d, 0, 0);
  return mc;
}

// ---------------------------------------------------------------- shared grid
function grid(f) {
  const { w, h } = f, narrow = w < 640;
  const cell = narrow ? 7.5 : w < 1100 ? 9.5 : w < 1600 ? 11 : 13;
  const cols = Math.floor(w / cell), rows = Math.floor(h / cell);
  Object.assign(f, { narrow, lite: narrow || coarse, cell, cols, rows, cw: w / cols, ch: h / rows, R: narrow ? 70 : 130 });
}

// ================================================================ Lluvia
const gi = () => (Math.random() * 33) | 0, ch33 = (i) => String.fromCharCode(30000 + i);   // the pen's glyphs: 3e4 + random·33 (田 由 甲 申 电 男 …)
const FAM = '"Noto Sans CJK JP", "Noto Sans JP", "Hiragino Sans", "Yu Gothic", "MS Gothic", sans-serif';
const WINDOW = 5000, SWAP = [1400, 3400, 4800];                                                            // how long it moves before it rests; the mask swap's fade in, hold end and fade out end (ms)
const TRAIL = 1600, L = 7, easeIn = (k) => k * k * (3 - 2 * k);                                           // how long a trail takes to fade, in how many steps
const lluvia = {
  build(f) {
    const { narrow, w, h } = f, rand = rng(44);
    const dots = f.opt.dots, fs = narrow ? 9 : w < 1100 ? 10 : 11;
    const gw = dots ? (narrow ? 5 : w < 1600 ? 6 : 7) : Math.round(fs * 1.1), gh = dots ? gw : Math.round(fs * 1.25);   // dots: a finer grid than the rest of the site
    const gc = Math.floor((w - 8) / gw), gr = Math.floor(h / gh), ox = (w - gc * gw) / 2;
    // columns: long runs with a blank between, as on the poster (few, so the name has an even field to be cut from)
    const on = new Uint8Array(gc);
    for (let x = 0; x < gc;) { const run = 12 + ((rand() * 14) | 0); for (let k = 0; k < run && x < gc; k++) on[x++] = 1; x++; }
    // a drop per column (its row, or -1 while it waits to start again), and per cell its glyph and when it was written
    const drop = new Int16Array(gc).map(() => (rand() < 0.75 ? Math.floor(rand() * gr) : -1));
    f.rain = { on, drop, c: Int8Array.from({ length: gc * gr }, gi), t: new Float64Array(gc * gr).fill(-1e9), acc: 0, now: performance.now() };
    const baseRow = gr - (narrow ? 3 : 5);                            // room under the name, where the rain fades out
    const mode = f.opt.mask, name = f.opt.name;
    f.cats = mode === 'cats'; f.pic = mode === 'image';
    if (mode === 'cycle') {
      // the fourth take: the name, the cats and the picture in turn, each crossfading into the next, round and round
      const im = picture(f.opt.src, () => f.resize()), base = baseRow * gh;
      f.cycle = [{ m: nameMask(w, h, narrow, base, name), line: 1 }, { m: catsMask(w, h, narrow, base), line: 1 }, { m: im ? imageMask(w, h, im) : null, line: 0 }];
      const mix = document.createElement('canvas'); mix.width = f.cycle[0].m.width; mix.height = f.cycle[0].m.height; f.mix = mix;
      f.cycleT0 = f.cycleT0 || performance.now(); f.mask = null;
    } else if (f.pic) { const im = picture(f.opt.src, () => f.resize()); f.mask = im ? imageMask(w, h, im) : null; }
    else f.mask = f.cats ? catsMask(w, h, narrow, baseRow * gh) : nameMask(w, h, narrow, baseRow * gh, name);   // the mask, on the baseline
    f.scans = []; f.sheet = null; f.footFade = null;
    Object.assign(f, { fs, gw, gh, gc, gr, ox, baseRow, glow: new Float64Array(gc).fill(-1e9), t0: performance.now() });
    if (reduce) for (let i = 0; i < 120; i++) { f.rain.now += 45; this.rainTick(f); }   // a still frame of the rain
    else if (!f.introDone) {
      // the first time it loads, the pen's rain: an empty sheet, every column's drop setting off from the top
      // (a few ticks apart), falling in green all the way down and writing the sheet as it goes
      f.rain.c.fill(-1);
      for (let c = 0; c < gc; c++) f.rain.drop[c] = -2 - Math.floor(rand() * 16);
      f.intro = new Uint8Array(gc).fill(1); f.introDone = true; f.nameIn = performance.now() + 1500;
    } else { f.intro = null; f.nameIn = 0; }
  },
  rainTick(f) {
    const { gc, gr } = f, r = f.rain, t = r.now;
    for (let c = 0; c < gc; c++) {
      if (!r.on[c]) continue;
      const y = r.drop[c], intro = f.intro && f.intro[c];
      if (y < -1) { r.drop[c]++; if (r.drop[c] === -1) r.drop[c] = 0; continue; }   // the intro's drops, counting down to their start
      if (y < 0) { if (Math.random() < 0.03) r.drop[c] = 0; continue; }
      if (y >= gr || (!intro && y > gr * 0.55 && Math.random() < 0.012)) { r.drop[c] = -1; if (intro) f.intro[c] = 0; continue; }   // some stop short (not in the intro)
      const i = y * gc + c; r.c[i] = gi(); r.t[i] = t; r.drop[c] = y + 1;
      if (Math.random() < 0.3) { const j = Math.floor(Math.random() * y) * gc + c; if (t - r.t[j] < TRAIL) r.c[j] = gi(); }   // a glyph in the trail changes
    }
  },
  // The still frame the field rests on (WCAG 2.2.2: nothing moves for more than 5 s): the intro's drops have all
  // landed (played without drawing, as reduced motion does), the sheet has had time to dim, and no green, scan or
  // mask swap is left, so the name stands at its full 25 %.
  settle(f) {
    const r = f.rain, falling = () => f.intro && r.on.some((on, c) => on && f.intro[c]);
    for (let i = 0; i < 400 && falling(); i++) { r.now += 45; this.rainTick(f); }
    for (let i = 0; i < 40; i++) { r.now += 45; this.rainTick(f); }
    f.intro = null; f.nameIn = 0; f.scans = []; f.glow.fill(-1e9); f.swap = null; f.still = true;
  },
  // a click scans in a circle, as the colour-mode button reveals the page: a ring grows from the point clicked, every
  // cell it crosses decodes (a new glyph) and turns green, and the green eases out behind it towards the centre
  click(f, x, y) { if (!reduce) f.scans.push({ x, y, t: f.now || performance.now(), R: 0 }); },
  scan(f, now) {
    const { gc, gr, gw, gh, ox, w, h } = f, r = f.rain, v = Math.max(w, h) * (f.lite ? 0.75 : 0.9), band = Math.max(w, h) * 0.45, out = [];
    f.scans = f.scans.filter((sc) => {
      const R0 = sc.R, R = ((now - sc.t) / 1000) * v; sc.R = R;
      for (let gy = 0; gy < gr; gy++) {
        const dy = (gy + 0.5) * gh - sc.y;
        if (Math.abs(dy) > R) continue;
        for (let c = 0; c < gc; c++) {
          if (!r.on[c]) continue;
          const dx = ox + (c + 0.5) * gw - sc.x, d = Math.hypot(dx, dy);
          if (d >= R0 && d < R && Math.random() < (f.opt.dots ? 0.3 : 1)) r.c[gy * gc + c] = gi();   // the ring passes: the cell decodes (dots: some of them, there are many more)
        }
      }
      out.push({ x: sc.x, y: sc.y, R, band });
      const far = Math.max(Math.hypot(sc.x, sc.y), Math.hypot(w - sc.x, sc.y), Math.hypot(sc.x, h - sc.y), Math.hypot(w - sc.x, h - sc.y));
      return R - band < far;
    });
    return out;
  },
  atlas(f) {                                                          // the 33 glyphs in mute, ink and green; rebuilt when the size or the colours change
    const key = `${f.gw}x${f.gh} ${f.opt.dots ? 'dots' : 'glyphs'} ${P.mute} ${P.ink} ${P.green}`;
    if (f.atlasKey === key) return f.atl;
    const dpr = Math.min(devicePixelRatio || 1, 2), w = Math.round(f.gw * dpr), h = Math.round(f.gh * dpr), cv = document.createElement('canvas');
    cv.width = w * 33; cv.height = h * 3;
    const g = cv.getContext('2d'); g.font = `500 ${f.fs * dpr}px ${FAM}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    [P.mute, P.ink, P.green].forEach((col, row) => { g.fillStyle = col; for (let k = 0; k < 33; k++) {
      if (f.opt.dots) { g.beginPath(); g.arc((k + 0.5) * w, (row + 0.5) * h, Math.min(w, h) * (0.16 + 0.17 * (k / 32)), 0, TAU); g.fill(); }   // a dot, its size standing for the glyph
      else g.fillText(ch33(k), (k + 0.5) * w, (row + 0.5) * h);
    } });
    f.atlasKey = key; return (f.atl = { cv, w, h });
  },
  frame(f, now, dt = 16) {
    const { ctx, w, h, gw, gh, gc, ox } = f, r = f.rain;
    if (!reduce) { r.acc += dt; let n = 0; while (r.acc > 45 && n++ < 4) { r.acc -= 45; r.now += 45; this.rainTick(f); } if (r.acc > 45) { r.acc = 0; r.now = now; } }
    const rings = reduce ? [] : this.scan(f, now);
    // the rain by age, over the sheet: the head in ink, the trail in mute fading down to the sheet's dim level.
    // Kept on a canvas of its own where only the cells whose look changed are redrawn, from the atlas.
    const A = this.atlas(f), aw = A.w, ah = A.h;
    if (!f.sheet || f.sheet.key !== f.atlasKey) {
      const dpr = Math.min(devicePixelRatio || 1, 2), cv = document.createElement('canvas'); cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cv3 = document.createElement('canvas'); cv3.width = cv.width; cv3.height = cv.height;
      const g3 = cv3.getContext('2d'); g3.setTransform(dpr, 0, 0, dpr, 0, 0);
      f.sheet = { cv, g, cv3, g3, key: f.atlasKey, seen: new Int16Array(r.t.length).fill(-1), seen2: new Int8Array(r.t.length).fill(-2) };
    }
    const sh = f.sheet, g = sh.g, g3 = sh.g3;
    for (let i = 0; i < r.t.length; i++) {
      if (!r.on[i % gc]) continue;
      const k = r.c[i];
      if (sh.seen2[i] !== k) {                                        // the green copy, for the scan: every glyph in green, at full strength
        sh.seen2[i] = k; const x = ox + (i % gc) * gw, y = ((i / gc) | 0) * gh;
        g3.clearRect(x, y, gw, gh); if (k >= 0) g3.drawImage(A.cv, k * aw, 2 * ah, aw, ah, x, y, gw, gh);
      }
      const age = r.now - r.t[i], lv = age < 45 ? L + 1 : age >= TRAIL ? L : ((age / TRAIL) * L) | 0, look = k < 0 ? -2 : k * 16 + lv;
      if (sh.seen[i] === look) continue;
      sh.seen[i] = look;
      const x = ox + (i % gc) * gw, y = ((i / gc) | 0) * gh;
      g.clearRect(x, y, gw, gh); if (k < 0) continue;
      g.globalAlpha = lv > L ? 0.9 : Math.max(f.lite ? 0.3 : 0.34, 0.75 * (1 - lv / L));
      g.drawImage(A.cv, k * aw, (lv > L ? 1 : 0) * ah, aw, ah, x, y, gw, gh);
    }
    g.globalAlpha = 1;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = P.mute; ctx.globalAlpha = 0.14; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1;   // a faint wash under the rain, so the mask's shapes stand out
    ctx.drawImage(sh.cv, 0, 0, w, h);
    // the scanned columns (and, at first load, the falling ones): the green copy over them, easing out over GLOW ms
    if (f.intro) for (let c = 0; c < gc; c++) if (f.intro[c] && r.drop[c] >= 0) f.glow[c] = now;
    const GLOW = 2200, dpr = sh.cv.width / w;
    for (let c = 0; c < gc; c++) {
      const a = 1 - (now - f.glow[c]) / GLOW; if (a <= 0 || !r.on[c]) continue;
      const x = ox + c * gw; ctx.globalAlpha = a * a;
      ctx.drawImage(sh.cv3, x * dpr, 0, gw * dpr, sh.cv3.height, x, 0, gw, h);
    }
    ctx.globalAlpha = 1;
    // the scans' green: the green copy seen through bands of the ring, strong at the front and fainter towards the
    // centre (clipped draws: only the bands are painted, cheap even on a big field)
    for (const sc of rings) {
      const bands = [[0, 0.06, 0.95], [0.06, 0.3, 0.55], [0.3, 0.65, 0.28], [0.65, 1, 0.1]];
      for (const [a0, a1, al] of bands) {
        const ro = Math.max(0, sc.R - a0 * sc.band), ri = Math.max(0, sc.R - a1 * sc.band); if (ro <= 0) continue;
        const x0 = Math.max(0, sc.x - ro), y0b = Math.max(0, sc.y - ro), x1 = Math.min(w, sc.x + ro), y1 = Math.min(h, sc.y + ro);
        if (x1 <= x0 || y1 <= y0b) continue;
        ctx.save(); ctx.beginPath(); ctx.arc(sc.x, sc.y, ro, 0, TAU); if (ri > 0) ctx.arc(sc.x, sc.y, ri, 0, TAU, true); ctx.clip('evenodd');
        ctx.globalAlpha = al; ctx.drawImage(sh.cv3, x0 * dpr, y0b * dpr, (x1 - x0) * dpr, (y1 - y0b) * dpr, x0, y0b, x1 - x0, y1 - y0b); ctx.restore();
      }
    }
    // the foot: the rain dissolves into the page below the name, so the field melts into the next section
    const y0 = f.baseRow * gh + 2;
    if (!f.footFade || f.footFade.y0 !== y0) {
      const gd = ctx.createLinearGradient(0, y0, 0, h);
      gd.addColorStop(0, 'rgba(0,0,0,0)'); gd.addColorStop(0.45, 'rgba(0,0,0,0.6)'); gd.addColorStop(0.8, 'rgba(0,0,0,0.93)'); gd.addColorStop(1, 'rgba(0,0,0,1)');
      f.footFade = { y0, gd };
    }
    ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = f.footFade.gd; ctx.fillRect(0, y0, w, h - y0);
    ctx.globalCompositeOperation = 'source-over';
    // the mask (the name, or the cats): cut out of the rain at 25 %, so it takes a little of the page's own colour
    const enter = f.nameIn ? easeIn(clamp((now - f.nameIn) / 1800)) : 1;   // at first load it fades in once the rain has filled the sheet
    ctx.globalAlpha = enter * (f.pic ? 1 : 0.25);                      // the name or the cats at 25 % opacity; a picture in full, or it would not read
    let line = f.pic ? 0 : 1;
    if (f.cycle) {
      // the name is the mask the field rests on; each time it wakes from rest it crossfades to the next one (the cats,
      // then the picture, in turn), holds, and fades back to the name before it rests again, all inside its 5 s. The two
      // shares are summed in a canvas of their own, so they add up instead of multiplying
      const sw = f.swap, u = sw ? now - sw.t : 0, A = f.cycle[0], B = f.cycle[sw ? sw.i : 0];
      const k = sw && u < SWAP[2] ? easeIn(u < SWAP[0] ? u / SWAP[0] : u < SWAP[1] ? 1 : clamp(1 - (u - SWAP[1]) / (SWAP[2] - SWAP[1]))) : 0;
      // and every mask breathes while it moves, between 0.2 and 0.25 opacity (at rest it holds the top of that)
      const op = reduce || f.still ? 0.25 : 0.2 + 0.05 * (0.5 - 0.5 * Math.cos(((now - f.cycleT0) / 3200) * Math.PI * 2));
      const g = f.mix.getContext('2d'); g.globalCompositeOperation = 'copy'; g.globalAlpha = 1; g.fillStyle = 'rgba(0,0,0,0)'; g.fillRect(0, 0, f.mix.width, f.mix.height);
      g.globalCompositeOperation = 'lighter';
      if (A.m) { g.globalAlpha = op * (1 - k); g.drawImage(A.m, 0, 0); }
      if (B.m && k > 0) { g.globalAlpha = op * k; g.drawImage(B.m, 0, 0); }
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      ctx.globalAlpha = enter; f.mask = f.mix; line = A.line * (1 - k) + B.line * k;
    }
    ctx.globalCompositeOperation = 'destination-out'; if (f.mask) ctx.drawImage(f.mask, 0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    // the scan rings: a dotted green circle at each front, with its reading on desktop
    for (const sc of rings) {
      ctx.fillStyle = P.green;
      const n = Math.max(12, Math.floor((TAU * sc.R) / 6));
      for (let j = 0; j < n; j++) {
        const a = (j / n) * TAU, x = sc.x + Math.cos(a) * sc.R, y = sc.y + Math.sin(a) * sc.R;
        if (x < -2 || y < -2 || x > w + 2 || y > h) continue;
        ctx.globalAlpha = y < y0 ? 1 : clamp(1 - (y - y0) / ((h - y0) * 0.7));   // it fades out at the foot, as the rain does
        ctx.fillRect(x - 0.9, y - 0.9, 1.8, 1.8);
      }
      ctx.globalAlpha = 1;
      if (!f.lite) {
        const a = -Math.PI / 4, lx = sc.x + Math.cos(a) * sc.R, ly = sc.y + Math.sin(a) * sc.R;
        if (lx > 0 && lx < w - 90 && ly > 14 && ly < h) {
          ctx.font = '600 10px "Chakra Petch", monospace'; ctx.letterSpacing = '2px'; ctx.textBaseline = 'bottom'; ctx.textAlign = 'left';
          ctx.fillText(`R ${String(Math.round(sc.R)).padStart(4, '0')} PX`, lx + 8, ly - 4); ctx.letterSpacing = '0px';
        }
      }
    }
    ctx.fillStyle = P.faint;                                           // the baseline: a dotted line under the name's row, where it stands
    ctx.globalAlpha = line; if (line > 0.01) for (let x = 4; x < w; x += 6) ctx.fillRect(x, f.baseRow * gh - 0.6, 1.2, 1.2);   // (a picture has no baseline)
    ctx.globalAlpha = 1;
  }
};

// ---------------------------------------------------------------- the field
const DESK = deskUrl;
const fontsReady = document.fonts.load(TITLE(100)).catch(() => null);
export class RainField {
  constructor(cv, opt = {}) {
    this.cv = cv; this.ctx = cv.getContext('2d'); this.running = false; this.raf = 0; this.last = 0; this.ptr = null;
    this.left = WINDOW; this.resting = false; this.swaps = 0;                    // ms of motion left before it rests; whether it rests; masks swapped in so far
    // a pointer over the field (or a touch) wakes it again for another 5 s; a click scans, the rest of the pointer only stirs it
    cv.addEventListener('pointermove', () => this.wake(true));
    cv.addEventListener('pointerdown', () => this.wake(false));
    this.f = { cv, ctx: this.ctx, opt: { mask: 'cycle', name: 'Nando Muñoz', src: DESK, ...opt }, now: performance.now(), speed: 0 };
    this.f.resize = () => this.layout();
    if (!P.ink) readP();
    this.ready = fontsReady.then(() => { this.fonts = true; this.layout(); });
  }
  layout() {
    const cv = this.cv, f = this.f, w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h || !this.fonts) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    f.w = w; f.h = h; grid(f); lluvia.build(f);
    if (this.resting) lluvia.settle(f);                               // a new size, still at rest: the sheet is rebuilt, so settle it again
    this.draw(performance.now(), this.resting ? 0 : 16);
  }
  draw(t, dt) { const f = this.f; if (!f.w) return; f.now = t; lluvia.frame(f, t, Math.min(dt, 50)); }
  repaint() { readP(); this.draw(performance.now(), this.resting ? 0 : 16); }
  poke(x, y) { if (this.f.w) { this.wake(false); lluvia.click(this.f, x, y); if (reduce) this.draw(performance.now(), 16); } }
  // The rain moves for 5 s of screen time (the clock only runs while it is drawn on screen) and then rests on a still
  // frame, so nothing moves on the page for good (WCAG 2.2.2). wake() gives it another 5 s; it does nothing while it is
  // already moving, so a pointer that keeps moving does not extend the window.
  loop = (t) => {
    if (!this.running) return;
    const dt = t - this.last; this.last = t;
    this.left -= Math.min(dt, 250);                                      // (a tab asleep for minutes costs 250 ms, not minutes)
    if (this.left <= 0) return this.rest();
    this.draw(t, dt); this.raf = requestAnimationFrame(this.loop);
  };
  rest() {
    this.resting = true; this.raf = 0;
    if (this.f.w) { lluvia.settle(this.f); this.draw(performance.now(), 0); }
  }
  wake(swap) {
    const f = this.f;
    if (reduce || !f.w || !this.resting) return;
    this.resting = false; this.left = WINDOW; f.still = false;
    if (swap && f.cycle) f.swap = { i: 1 + (this.swaps++ % (f.cycle.length - 1)), t: performance.now() };
    if (this.running) { this.last = performance.now(); this.raf = requestAnimationFrame(this.loop); }
  }
  start() {
    if (this.running || reduce) return;
    this.running = true; this.last = performance.now();
    if (!this.resting) this.raf = requestAnimationFrame(this.loop);
  }
  stop() { this.running = false; cancelAnimationFrame(this.raf); this.raf = 0; }
}
