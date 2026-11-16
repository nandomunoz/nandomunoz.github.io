// Trama · the hero's poster (the motto on top, the credits at the foot) typed in letter by letter
// with a thin terminal cursor; each letter comes out in a wake (a dim green, a dark one on the paper: --trace) and settles (style.css: .caret).
//
//   import { typePoster } from './shared/poster.js';
//   typePoster({ deck, name, kicker, bill }, { motto, key, green, reduce });
//   → { play(), stop() }; with reduce (or no motion) the finished poster is set at once.
//
// The motto is one line per sentence. Words in `green` take the accent; the rest of `key`
// goes in italics. Every letter is its own inline-block (a word joiner keeps a word from breaking
// mid-way); the plain text stays in a hidden copy for screen readers.

const rnd = (a, b) => a + Math.random() * (b - a);

function rich(text, key, green) {
  return text.split(key).map((s, i) => {
    if (i % 2 === 0) return document.createTextNode(s);
    const e = document.createElement(green.has(s) ? 'b' : 'em');
    if (green.has(s)) e.className = 'ia';
    e.textContent = s; return e;
  });
}

function charify(el) {
  const text = el.textContent, vis = document.createElement('span');
  vis.className = 'vis'; vis.setAttribute('aria-hidden', 'true'); vis.append(...el.childNodes);
  const kids = [...vis.childNodes]; vis.replaceChildren();
  let word = null;                                                  // each word in a block that does not break
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

export function typePoster({ deck, name, kicker, bill }, { motto, key, green, reduce = false }) {
  const lines = motto.split(/(?<=\.)\s+/).map((s) => { const l = document.createElement('span'); l.className = 'l'; l.append(...rich(s, key, green)); return l; });
  deck.replaceChildren(...lines);
  if (reduce) return { play() {}, stop() {} };

  const L = lines.map(charify), N = charify(name), Kk = charify(kicker);
  const all = [...L.flat(), ...N, ...Kk];
  all.forEach((x) => { x.style.visibility = 'hidden'; });
  bill.classList.add('off');
  let tok = 0, caret = null; const anims = [];
  const stop = () => { tok++; anims.splice(0).forEach((a) => a.cancel()); caret?.remove(); caret = null; };

  // the letters come out on a timeline (not one sleep after another), so a busy main thread
  // drops frames but never stretches the typing: each letter has its own moment
  function play(delay = 420) {
    stop(); const t = tok;
    const G = getComputedStyle(document.documentElement).getPropertyValue('--trace').trim();
    caret = document.createElement('span'); caret.className = 'caret blink'; caret.setAttribute('aria-hidden', 'true');
    all[0].before(caret);
    const plan = []; let at = delay, billAt = 0;
    const type = (chars, min, max) => chars.forEach((x) => {
      plan.push({ x, at }); const ch = x.textContent;
      at += ch === ',' ? 200 : ch === '.' ? 360 : rnd(min, max);
    });
    L.forEach((line) => { type(line, 22, 46); at += 110; });
    billAt = at; at += 220; type(N, 46, 70); at += 160; type(Kk, 9, 15);
    const end = at, t0 = performance.now(); let i = 0, last = 0, billOn = false;
    const tick = (now) => {
      if (t !== tok) return;
      const e = now - t0;
      while (i < plan.length && plan[i].at <= e) {
        const { x } = plan[i++]; x.style.visibility = ''; x.after(caret); last = e;
        anims.push(x.animate([{ color: G }], { duration: 900, easing: 'ease-out' }));   // the beam's wake: it comes out in a dim (dark, on the paper) green and settles
      }
      if (!billOn && e >= billAt) { billOn = true; bill.classList.remove('off'); }
      caret.classList.toggle('blink', e - last > 90);
      if (e < end + 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  return { play, stop };
}
