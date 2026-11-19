// The blog's data, prepared at build time (plan Phase 8): the posts of a language newest first, each with its
// slug, year, words, minutes, category, tags and the pattern of its screen; the categories and tags with
// their counts; related, previous and next; pages of five. Ported from the maqueta's shared/content.js (blog()).
import { getCollection } from 'astro:content';
import { readingStats } from './reading.js';

export const PAGE_SIZE = 5;

/** @typedef {'es' | 'en' | 'ar'} Locale */
const LOCALE = { es: 'es', en: 'en-GB', ar: 'ar-SY-u-nu-latn' }; // British English; the Arabic of Syria keeps the Latin digits of the site's numbers

/** A date as «19 de octubre de 2026». @param {Locale} lang @param {Date | string} d */
export const longDate = (lang, d) => new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(d));
export const isoDate = (/** @type {Date} */ d) => d.toISOString().slice(0, 10);
export const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');

const hashStr = (/** @type {string} */ s) => { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0) ?? 0; h = Math.imul(h, 16777619); } return h >>> 0; };

/** @param {Locale} lang */
export async function loadBlog(lang) {
  const [entries, cats, tagList] = await Promise.all([
    getCollection('posts', (e) => e.id.endsWith('/' + lang)),
    getCollection('categories'),
    getCollection('tags')
  ]);
  const posts = entries
    .map((e) => {
      const { words, minutes } = readingStats(e.body ?? '');
      return { entry: e, slug: e.id.split('/')[0], data: e.data, date: e.data.date, year: e.data.date.getUTCFullYear(), words, minutes, category: e.data.category, tags: e.data.tags };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((p, i, all) => {
      const ws = all.map((q) => q.words), lo = Math.min(...ws), hi = Math.max(...ws);
      return { ...p, n: i + 1, density: 0.38 + 0.52 * ((p.words - lo) / (hi - lo || 1)), seed: hashStr(p.slug) };
    });
  const categories = Object.fromEntries(cats.map((c) => [c.data.id, { id: c.data.id, kind: c.data.kind, name: c.data[lang].name, desc: c.data[lang].desc, count: posts.filter((p) => p.category === c.data.id).length }]));
  const tags = Object.fromEntries(tagList.map((t) => [t.data.id, { id: t.data.id, label: t.data[lang], count: posts.filter((p) => p.tags.includes(t.data.id)).length }]));
  return { posts, categories, tags };
}

/** Pages of five: [[post…], [post…]] @template T @param {T[]} list @returns {T[][]} */
export const pagesOf = (list, size = PAGE_SIZE) => Array.from({ length: Math.max(1, Math.ceil(list.length / size)) }, (_, i) => list.slice(i * size, (i + 1) * size));

/** Same category first, then shared tags; newest first among equals. */
export function relatedTo(post, posts, n = 3) {
  const score = (o) => (o.category === post.category ? 2 : 0) + o.tags.filter((t) => post.tags.includes(t)).length;
  return posts.filter((o) => o !== post && score(o) > 0).sort((a, b) => score(b) - score(a) || b.date.getTime() - a.date.getTime()).slice(0, n);
}

/** Groups a newest-first list by year: [[2026, [post…]], [2025, [post…]]]
 * @param {any[]} posts @returns {[number, any[]][]} */
export function byYear(posts) {
  /** @type {[number, any[]][]} */
  const out = [];
  for (const p of posts) { const g = out.at(-1); if (g && g[0] === p.year) g[1].push(p); else out.push([p.year, [p]]); }
  return out;
}

/** The years a list spans, for «11 artículos · 2022–2026». */
export const span = (posts) => { const ys = posts.map((p) => p.year); return [Math.min(...ys), Math.max(...ys)]; };
