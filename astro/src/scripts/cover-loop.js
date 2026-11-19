// A featured image (the blog's featured post, every post row) plays ONE cycle when it first comes into view and then rests
// (WCAG 2.2.2: nothing may move for good): dots → black and white → colour → black and white, ending on the black and white
// it rests in (the last step of the loop, the dots gathering again, is left out, or it would sink to dots only to rise
// again). Hovering the picture or its title, or keyboard focus on the title, plays it once more (it sinks back to dots
// first, from the rest, so there is no jump). Ported from the maqueta's blog/parts.js (coverLoop).
//
// One clock drives everything (no chained CSS transitions), so each step flows into the next. The dots don't fade: they come
// apart and gather with the engine itself (draw(p), 1 → 0 → 1). `.cover-loop` holds the <picture> and a canvas with its dots
// (data-loop: the DotBlock's options, ready from the build); without JS, or with reduced motion, it stays `.is-rest`: the
// picture in black and white, no dots (blog.css). Paused off screen. The thumbnails of post rows (`bw`) skip the colour:
// dots ↔ black and white only, on a shorter table, and no colour on hover either. The whole cycle is under 5 s.
import { DotBlock, loadTone, readPalette } from './dots.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cellSize = () => (innerWidth < 768 ? 7 : innerWidth < 1024 ? 8 : 9);
const LOOP_COLOUR = [     // [seconds, dots, light, colour] at the end of each step
  [0.25, 1, 0, 0],        // hold: dots
  [1.0, 0, 1, 0],         // dots come apart, the photo rises in black and white
  [0.3, 0, 1, 0],         // hold: black and white
  [1.0, 0, 1, 1],         // colour comes in
  [0.8, 0, 1, 1],         // hold: colour
  [1.0, 0, 1, 0],         // colour goes
  [0.3, 0, 1, 0],         // hold: black and white (it rests here)
  [1.0, 1, 0, 0]          // the photo sinks, the dots gather (only in the loop's own order, not played)
];
const LOOP_BW = [
  [0.25, 1, 0, 0],        // hold: dots
  [1.0, 0, 1, 0],         // dots come apart, the photo rises in black and white
  [0.5, 0, 1, 0],         // hold: black and white (it rests here)
  [1.0, 1, 0, 0]          // the photo sinks, the dots gather (not played)
];
// how far a picture sinks under its dots depends on the mode (--sink-b, --sink-c)
let sink = { b: 0.32, c: 1.1 };
const readSink = () => {
  const cs = getComputedStyle(document.documentElement);
  sink = { b: parseFloat(cs.getPropertyValue('--sink-b')) || 0.32, c: parseFloat(cs.getPropertyValue('--sink-c')) || 1.1 };
};
readSink();
document.addEventListener('trama:mode', () => { readPalette(); readSink(); });
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const figs = [...document.querySelectorAll('.cover-loop')].filter((f) => f.querySelector('canvas[data-loop]'));
const mounted = [];
figs.forEach((fig, k) => {
  if (reduce) return;                                            // it keeps its black and white rest, hover gives no cycle
  const cv = fig.querySelector('canvas[data-loop]'), pic = fig.querySelector('picture'), img = fig.querySelector('img');
  const { tone: toneUrl, bw, narrow, ...base } = JSON.parse(cv.dataset.loop);
  const self = { block: null, tone: null };
  const make = () => {
    const o = { cell: cellSize(), ...base, ...(innerWidth < 1024 ? narrow : null) };
    if (self.tone) o.tone = self.tone;
    return new DotBlock(cv, o);
  };
  const remake = () => { const p = self.block ? self.block.p : 1; self.block = make(); self.block.draw(p, true); };
  mounted.push(remake);
  if (toneUrl) loadTone(toneUrl).then((t) => { if (t) { self.tone = t; remake(); } });
  fig.classList.remove('is-rest');
  if (bw) fig.classList.add('cover-loop--bw');
  remake();

  const full = bw ? LOOP_BW : LOOP_COLOUR, cycle = full.slice(0, -1);
  const again = [[0.6, 1, 0, 0], ...cycle];                      // from the rest: sink to dots, then the cycle
  const offset = bw ? 1.3 * k : 0;                               // a list's rows do not start together
  let on = false, seen = false, playing = false, seq = cycle, from = [0, 1, 0, 0], clock = 0, last = 0, raf = 0;
  // the rest: black and white, no dots (.is-rest, blog.css), the inline filters back to the stylesheet's
  const rest = () => { playing = false; pic.style.filter = img.style.filter = ''; fig.classList.add('is-rest'); };
  // `clock` runs in ms from the start of `seq`; a negative start is the stagger (the first state, held longer)
  const play = (s, f, delay = 0) => {
    if (playing) return;
    playing = true; seq = s; from = f; clock = -delay * 1000; last = performance.now();
    fig.classList.remove('is-rest');
    if (on) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
  };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting === on) return;
    on = e.isIntersecting;
    if (!on) return;
    if (!seen) { seen = true; play(cycle, from, offset % 5); }   // the first time it is seen: its one cycle
    else if (playing) { last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
  }).observe(fig);
  // hover on the picture or its title (not a touch, which would run it on every tap), or keyboard focus on the title
  const host = fig.closest('.brow, .feat'), links = host ? [...host.querySelectorAll('h2 a, h3 a')] : [];
  const replay = (e) => { if (seen && e.pointerType !== 'touch') play(again, [0, 0, 1, 0]); };
  for (const n of [fig, ...links]) n.addEventListener('pointerenter', replay);
  for (const a of links) a.addEventListener('focus', () => { if (seen && a.matches(':focus-visible')) play(again, [0, 0, 1, 0]); });
  function frame(now) {
    if (!on || !playing) return;
    clock += Math.min(now - last, 100); last = now;              // (a stalled frame must not skip the cycle)
    let t = Math.max(0, clock) / 1000, prev = from, v = null;
    for (const step of seq) {
      if (t <= step[0]) { const e = ease(t / step[0]); v = [1, 2, 3].map((j) => prev[j] + (step[j] - prev[j]) * e); break; }
      t -= step[0]; prev = step;
    }
    const done = !v;
    if (done) v = prev.slice(1);                                 // past the last step: the state it ends in
    const [dots, light, colour] = v;
    if (self.block) self.block.draw(dots, true);
    pic.style.filter = `brightness(${sink.b + (1 - sink.b) * light}) contrast(${sink.c + (1 - sink.c) * light})`;
    img.style.filter = `grayscale(${1 - colour})`;
    if (done) rest(); else raf = requestAnimationFrame(frame);
  }
});

let tm, rw = innerWidth;
addEventListener('resize', () => {
  clearTimeout(tm);
  tm = setTimeout(() => { if (innerWidth === rw) return; rw = innerWidth; mounted.forEach((f) => f()); }, 180);
});
