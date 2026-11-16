// Trama · the Cartel invertido with four ways of coming in. The poster (the title on top, the credits
// at the foot) is the same in each; what changes is how the text arrives: 01 typed under a dotted green
// beam that leaves each letter glowing, 02 decoded from the rain's symbols, 03 built from slices,
// 04 falling like rain. Each section replays when it comes back into view, or with its «repetir»
// button. Sandbox only.
import { RainField } from '../rain.js';
import { themeSwitch, onMode } from '../shared/theme.js';
import { content } from '../shared/content.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js', reduce ? 'still' : 'moving');
const c = await content().catch(() => null) || { name: 'Nando Muñoz', kicker: '', deck: '' };
await Promise.all([document.fonts.load('200 100px Archivo'), document.fonts.load('700 20px Doto')].map((p) => p.catch(() => null)));
const MOTTO = 'Proyecto, el motivo. Humano, el centro. TecnologIA, sólo el medio';   // this take's own motto

const $ = (r, s) => r.querySelector(s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rnd = (a, b) => a + Math.random() * (b - a);
const glyph = () => String.fromCharCode(30000 + ((Math.random() * 33) | 0));   // the rain's symbols (3e4 + random·33)

// ---------------------------------------------------------------- the text
const KEY = /(Proyecto|Humano|IA|motivo|centro|medio)/;
const GREEN = new Set(['Proyecto', 'Humano', 'IA']);
function rich(text) {
  return text.split(KEY).map((s, i) => {
    if (i % 2 === 0) return document.createTextNode(s);
    const e = document.createElement(GREEN.has(s) ? 'b' : 'em');
    if (GREEN.has(s)) e.className = 'ia';
    e.textContent = s; return e;
  });
}
// every letter its own inline-block (for typing, decoding, falling); a word joiner between the letters of a word keeps
// it from breaking mid-word; the plain text goes in a hidden copy for screen readers
function charify(el) {
  const text = el.textContent, vis = document.createElement('span');
  vis.className = 'vis'; vis.setAttribute('aria-hidden', 'true'); vis.append(...el.childNodes);
  // each word in a block that does not break (the letters inside are blocks of their own, and the browser
  // may wrap between two of them): split the top-level text on spaces, keep the elements (a, b, em) with their word
  const kids = [...vis.childNodes]; vis.replaceChildren();
  let word = null;
  const put = (node) => { if (!word) { word = document.createElement('span'); word.className = 'wd'; vis.append(word); } word.append(node); };
  for (const k of kids) {
    if (k.nodeType !== 3) { put(k); continue; }
    k.textContent.split(/( )/).forEach((s) => { if (s === ' ') { vis.append(document.createTextNode(' ')); word = null; } else if (s) put(document.createTextNode(s)); });
  }
  const nodes = [], w = document.createTreeWalker(vis, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) nodes.push(w.currentNode);
  const flat = nodes.map((n) => n.textContent).join(''), chars = [];
  let pos = 0;
  for (const n of nodes) {
    const frag = document.createDocumentFragment();
    for (const ch of n.textContent) {
      pos += ch.length;
      if (ch === ' ') { frag.append(document.createTextNode(' ')); continue; }
      const s = document.createElement('span'); s.className = 'c'; s.textContent = ch; frag.append(s); chars.push(s);
      const next = flat[pos]; if (next && next !== ' ') frag.append(document.createTextNode('⁠'));
    }
    n.replaceWith(frag);
  }
  const vh = document.createElement('span'); vh.className = 'vh'; vh.textContent = text;
  el.replaceChildren(vis, vh);
  return chars;
}
// the slices (03) work on whole lines: the content stays in a base, aria-hidden clones go over it
function clones(el, n) {
  const kids = [...el.childNodes], base = document.createElement('span');
  base.append(...kids); el.append(base);
  const copies = Array.from({ length: n }, () => {
    const s = document.createElement('span'); s.setAttribute('aria-hidden', 'true');
    s.append(...kids.map((k) => k.cloneNode(true))); el.append(s); return s;
  });
  return { base, copies };
}

// ---------------------------------------------------------------- one poster
function poster(sec, f) {
  const type = sec.dataset.anim;
  const deck = $(sec, '.t6__deck'), name = $(sec, '.t6__name'), kicker = $(sec, '.t6__kicker'), bill = $(sec, '.t6__billing');
  const lines = MOTTO.split(/(?<=\.)\s+/).map((s) => { const l = document.createElement('span'); l.className = 'l'; l.append(...rich(s)); return l; });
  deck.replaceChildren(...lines); name.textContent = c.name; kicker.textContent = c.kicker;
  const poke = (fx, fy) => { const r = f.cv.getBoundingClientRect(); f.poke(r.width * fx, r.height * fy); };
  let tok = 0; const anims = []; const timers = new Set(); let caret = null;
  const track = (a) => { anims.push(a); return a; };
  const stop = () => { tok++; anims.splice(0).forEach((a) => a.cancel()); timers.forEach(clearInterval); timers.clear(); caret?.remove(); caret = null; };
  const done = () => { sec.classList.add('is-done'); };
  const hideBill = () => bill.classList.add('off'), showBill = () => bill.classList.remove('off');

  // ---- build, reset and play per kind (each is built only for the section that uses it)
  const K = {};

  K.type = () => {
    const L = lines.map(charify), N = charify(name), Kk = charify(kicker);
    const all = [...L.flat(), ...N, ...Kk];
    return {
      reset() { all.forEach((x) => { x.style.visibility = 'hidden'; }); hideBill(); },
      async play(t) {
        const alive = () => t === tok, G = getComputedStyle(document.documentElement).getPropertyValue('--trace').trim();
        caret = document.createElement('span'); caret.className = 'caret blink'; caret.setAttribute('aria-hidden', 'true');
        all[0].before(caret); await sleep(420); if (!alive()) return;
        const type = async (chars, min, max) => {
          for (const x of chars) {
            if (!alive()) return;
            x.style.visibility = ''; caret.classList.remove('blink'); x.after(caret);
            track(x.animate([{ color: G }], { duration: 900, easing: 'ease-out' }));   // the beam's wake: it comes out in a dim (dark, on the paper) green and settles
            const ch = x.textContent; await sleep(ch === ',' ? 200 : ch === '.' ? 360 : rnd(min, max));
            if (!alive()) return;
            caret.classList.add('blink');
          }
        };
        for (const line of L) { await type(line, 22, 46); if (!alive()) return; await sleep(110); }
        showBill(); await sleep(220); if (!alive()) return;
        await type(N, 46, 70); if (!alive()) return;
        await sleep(160); await type(Kk, 9, 15); if (!alive()) return;
        caret?.classList.add('blink'); done();
      }
    };
  };

  K.decode = () => {
    const L = lines.map(charify), N = charify(name), Kk = charify(kicker);
    const groups = [{ chars: L.flat(), at: 0, per: 32, jit: 260 }, { chars: N, at: 1250, per: 70, jit: 160 }, { chars: Kk, at: 1650, per: 10, jit: 140 }];
    const all = groups.flatMap((g) => g.chars);
    return {
      reset() {
        all.forEach((x) => {                                          // each letter keeps its own width while it is a symbol
          if (x.dataset.f === undefined) x.dataset.f = x.textContent;
          x.classList.remove('scr', 'flash'); x.style.width = ''; x.textContent = x.dataset.f; x.style.opacity = '';
        });
        all.forEach((x) => { x.style.width = x.offsetWidth + 'px'; x.style.opacity = '0'; x.classList.add('scr'); x.style.textAlign = 'center'; });
        hideBill();
      },
      async play(t) {
        const start = performance.now(), plan = [];
        groups.forEach((g) => g.chars.forEach((x, i) => plan.push({ x, at: g.at, rt: g.at + i * g.per + rnd(0, g.jit), ok: false })));
        const end = Math.max(...plan.map((p) => p.rt));
        poke(0.45, 0.2); let billShown = false;
        const iv = setInterval(() => {
          if (t !== tok) { clearInterval(iv); return; }
          const now = performance.now() - start;
          for (const p of plan) {
            if (p.ok) continue;
            if (now < p.at) continue;
            if (now < p.rt) { p.x.style.opacity = '1'; p.x.textContent = glyph(); continue; }
            p.ok = true; p.x.textContent = p.x.dataset.f; p.x.classList.remove('scr'); p.x.classList.add('flash'); p.x.style.opacity = '1'; p.x.style.width = '';
            const x = p.x; setTimeout(() => x.classList.remove('flash'), 600);
          }
          if (!billShown && now > 1250) { billShown = true; showBill(); }
          if (now > end + 40) { clearInterval(iv); timers.delete(iv); done(); }
        }, 55);
        timers.add(iv);
      }
    };
  };

  K.slices = () => {
    const parts = [...lines.map((l) => [l, 3]), [name, 3], [kicker, 2]].map(([el, n], i) => {
      el.classList.add('sl-host'); const { base, copies } = clones(el, n);
      base.className = 'sl-base'; copies.forEach((s, j) => { s.className = 'sl'; s.style.clipPath = `inset(${(j * 100) / n}% 0 ${((n - 1 - j) * 100) / n}% 0)`; });
      return { el, base, copies, i };
    });
    return {
      reset() { parts.forEach((p) => { p.base.style.visibility = 'hidden'; p.copies.forEach((s) => { s.style.display = ''; s.style.opacity = '0'; }); }); hideBill(); },
      async play(t) {
        const delays = [0, 260, 520, 1150, 1450], ends = [];
        parts.forEach((p, i) => p.copies.forEach((s, j) => {
          const dx = ((i + j) % 2 ? 1 : -1) * (24 + j * 10);
          const a = track(s.animate([{ transform: `translateX(${dx}vw)`, opacity: 0 }, { opacity: 1, offset: .22 }, { transform: 'translateX(0)', opacity: 1 }],
            { duration: 900, delay: delays[i] + j * 110, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }));
          ends.push(a.finished.catch(() => null));
        }));
        await sleep(1150); if (t !== tok) return; showBill();
        await Promise.all(ends); if (t !== tok) return;
        parts.forEach((p) => { p.base.style.visibility = ''; p.copies.forEach((s) => { s.style.display = 'none'; }); });
        poke(0.5, 0.35); done();
      }
    };
  };

  K.rain = () => {
    const L = lines.map(charify), N = charify(name), Kk = charify(kicker);
    return {
      reset() { [...L.flat(), ...N, ...Kk].forEach((x) => { x.style.opacity = '0'; }); hideBill(); },
      async play(t) {
        const G = getComputedStyle(document.documentElement).getPropertyValue('--blaze').trim();
        const drop = (x, delay, fall) => {
          const final = getComputedStyle(x).color;
          track(x.animate([
            { transform: `translateY(-${fall}em)`, opacity: 0, color: G, filter: 'blur(4px)' },
            { opacity: 1, filter: 'blur(1.5px)', offset: .14 },
            { transform: 'translateY(0)', color: G, filter: 'blur(0)', offset: .66, easing: 'ease-out' },
            { transform: 'translateY(-.09em)', color: G, offset: .8, easing: 'ease-in' },
            { transform: 'translateY(0)', color: final, opacity: 1, filter: 'none' }],
          { duration: rnd(640, 900), delay, fill: 'both', easing: 'cubic-bezier(.55,0,.85,.45)' }));
        };
        L.forEach((line, li) => line.forEach((x) => drop(x, li * 300 + rnd(0, 560), 3.4)));
        N.forEach((x) => drop(x, 1250 + rnd(0, 380), 1.8));
        Kk.forEach((x) => drop(x, 1650 + rnd(0, 380), 1.2));
        await sleep(1250); if (t !== tok) return; showBill();
        await sleep(1500); if (t !== tok) return; poke(0.5, 0.3); done();
      }
    };
  };

  // ---- run
  const k = K[type]();                                              // only this section's kind is built, on its own elements
  const restart = () => {
    stop(); sec.classList.remove('is-done'); k.reset(); const t = tok;
    setTimeout(() => { if (t === tok) k.play(t); }, 170);
  };
  const clear = () => { stop(); sec.classList.remove('is-done'); k.reset(); };
  return { restart, clear };
}

// ---------------------------------------------------------------- the sections
const fields = [];
for (const sec of document.querySelectorAll('.en')) {
  const cv = sec.querySelector('canvas');
  const f = new RainField(cv, { mask: 'cycle', name: c.name, dots: true });
  fields.push(f);
  cv.addEventListener('pointerdown', (e) => { const r = cv.getBoundingClientRect(); f.poke(e.clientX - r.left, e.clientY - r.top); });
  new ResizeObserver(() => f.layout()).observe(cv);
  const deckEl = $(sec, '.t6__deck');
  if (reduce) {                                                       // no animation: the finished poster
    deckEl.replaceChildren(...MOTTO.split(/(?<=\.)\s+/).map((s) => { const l = document.createElement('span'); l.className = 'l'; l.append(...rich(s)); return l; }));
    $(sec, '.t6__name').textContent = c.name; $(sec, '.t6__kicker').textContent = c.kicker; sec.querySelector('.en__replay').hidden = true;
    new IntersectionObserver(([en]) => (en.isIntersecting ? f.start() : f.stop()), { threshold: 0.2 }).observe(sec);
    continue;
  }
  const p = poster(sec, f);
  sec.querySelector('.en__replay').addEventListener('click', p.restart);
  new IntersectionObserver(([en]) => { if (en.isIntersecting) { f.start(); p.restart(); } else { f.stop(); p.clear(); } }, { threshold: 0.4 }).observe(sec);
}
themeSwitch();
onMode(() => fields.forEach((f) => f.repaint()));
