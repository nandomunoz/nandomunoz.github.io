// The home's data, prepared at build time (plan Phase 6): which projects are featured, and for each the
// options its dotted block needs (density by year, kind and seed by id, rows by text length), so the page
// ships them in `data-dots` and the browser only draws. Ported from the maqueta's main.js.

/** The six projects of the home, in this order; the rest live on /proyectos/. */
export const FEATURED = ['luz', 'luz-ai', 'quien-canta-hoy', 'streetcai', 'ikay', 'toolbar-aem'];
/** Denser the newer. */
export const DENSITY = { 2023: 0.36, 2024: 0.52, 2025: 0.68, 2026: 0.86 };
export const densityOf = (/** @type {number} */ y) => DENSITY[y] ?? 0.6;

export const hashStr = (/** @type {string} */ s) => { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0) ?? 0; h = Math.imul(h, 16777619); } return h >>> 0; };

/** The dot options of every featured project's front and back layers.
 * @param {any[]} projects the featured projects, in order @param {'es'|'en'|'ar'} lang */
export function projectBlocks(projects, lang) {
  const lens = projects.map((p) => p.data[lang === 'ar' && !p.data.ar ? 'es' : lang].body.join(' ').length);
  const lo = Math.min(...lens), hi = Math.max(...lens);
  return projects.map((p, i) => {
    const d = p.data, h = hashStr(d.id), len = (lens[i] - lo) / (hi - lo || 1);
    const gloss = d.kanji?.meaning[lang] ?? '';
    const front = {
      size: 32 + (len > 0.5 ? 8 : 0), rows: Math.round(11 + len * 26), density: densityOf(d.year), kind: h % 6, seed: h,
      label: d.kanji?.char ?? String(i + 1).padStart(2, '0'), gloss: gloss.length, corner: i % 2, frame: true,
      narrow: { size: 24 + (len > 0.5 ? 8 : 0), rows: Math.round(9 + len * 20) }
    };
    const back = { ...front, density: densityOf(d.year) * 0.5, kind: (h >> 3) % 6, seed: h ^ 0xabc, ghost: true, frame: false };
    return { p, h, gloss, front, back };
  });
}
