// The projects' data, prepared at build time (plan Phase 7): the 13 visible ones newest year first, each with its
// text in the language, the options of its dotted screen, its technologies counted and related projects.
import { getCollection } from 'astro:content';
import { densityOf, hashStr } from './home.js';

/** @typedef {'es' | 'en' | 'ar'} Locale */

/** @param {Locale} lang */
export async function loadProjects(lang) {
  const entries = (await getCollection('projects')).filter((p) => !p.data.hidden);
  const lens = entries.map((p) => p.data.es.body.join(' ').length);
  const lo = Math.min(...lens), hi = Math.max(...lens);
  const projects = entries
    .map((e) => {
      const d = e.data, h = hashStr(d.id), text = d[lang] ?? d.es;
      const len = (d.es.body.join(' ').length - lo) / (hi - lo || 1);
      return {
        id: d.id, n: d.order ?? 0, name: d.name, year: d.year, tech: d.tech, demo: d.demo ?? null, repo: d.repo,
        kicker: text.kicker, body: text.body, shot: d.shot, kanji: d.kanji, gloss: d.kanji?.meaning[lang] ?? '', h, len,
        /** the dotted screen of a row (a thumbnail) and of the project's own page */
        row: { rows: 9, density: densityOf(d.year), kind: h % 6, seed: h, tone: d.shot?.tone?.src },
        cover: {
          size: 32, rows: Math.round(18 + len * 12), density: densityOf(d.year), kind: h % 6, seed: h, label: d.kanji?.char ?? String(d.order ?? 0).padStart(2, '0'),
          gloss: (d.kanji?.meaning[lang] ?? '').length, corner: 1, frame: true, tone: d.shot?.tone?.src, narrow: { size: 24, rows: Math.round(14 + len * 12) }
        }
      };
    })
    .sort((a, b) => b.year - a.year || a.n - b.n);
  /** @type {Record<string, number>} */
  const techs = {};
  for (const p of projects) for (const t of p.tech) techs[t] = (techs[t] || 0) + 1;
  return { projects, techs };
}

/** Projects that share technologies, most shared first, then newest. */
export function relatedProjects(p, projects, n = 3) {
  const shared = (o) => o.tech.filter((x) => p.tech.includes(x)).length;
  return projects.filter((o) => o !== p && shared(o) > 0).sort((a, b) => shared(b) - shared(a) || b.year - a.year || a.n - b.n).slice(0, n);
}

/** A technology as it appears in the address and in the filter: «Chrome Extension» → chrome-extension. */
export const techSlug = (/** @type {string} */ t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
