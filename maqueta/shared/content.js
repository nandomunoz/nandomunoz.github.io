// The real content of the portfolio, read from the site's own data files
// (data/site.json, data/projects.json), so every layout in the sandbox shows
// the same texts. Language from ?lang=en (Spanish by default).
//
//   import { content } from '../shared/content.js';
//   const c = await content();
//   c.name, c.nick, c.kicker, c.deck, c.bio[], c.contactTitle, c.contactText, c.motto,
//   c.socials[{ id, label, handle, url }],
//   c.projects[{ id, name, year, tech[], demo, repo, kicker, body[] }], c.lang
// Languages: Spanish (default), English (?lang=en) and Arabic of Syria (?lang=ar, written right to left).
// `lang` is the key of every text table; `htmlLang` goes on <html lang>; `dir` on <html dir>.
const asked = new URLSearchParams(location.search).get('lang');
export const lang = asked === 'en' || asked === 'ar' ? asked : 'es';
export const htmlLang = lang === 'ar' ? 'ar-SY' : lang;
export const dir = lang === 'ar' ? 'rtl' : 'ltr';
export const rtl = dir === 'rtl';
document.documentElement.lang = htmlLang;
document.documentElement.dir = dir;

// The Arabic texts of the home, the projects and the blog's categories and tags live in their own file
// (maqueta/shared/content-ar.json), so the Cassette's data files stay as they are.
const arabic = () => fetch('/maqueta/shared/content-ar.json').then((r) => r.json());

export async function content() {
  const [site, projects, ar] = await Promise.all([
    ...['site', 'projects'].map((f) => fetch(`/data/${f}.json`).then((r) => r.json())),
    lang === 'ar' ? arabic() : null
  ]);
  const t = lang === 'ar' ? { ...site.i18n.en, ...ar.site } : site.i18n[lang];
  return {
    lang,
    name: site.name,
    nick: site.nick,
    kicker: t.kicker,
    deck: t.deck,
    bio: t.bio,
    contactTitle: t.contactTitle,
    contactText: t.contactText,
    motto: t.motto,
    socials: [...site.socials, ...site.extraSocials],
    projects: projects.map((p, i) => ({
      id: p.id, n: i + 1, name: p.name, year: p.year, tech: p.tech, demo: p.demo, repo: p.repo,
      kicker: lang === 'ar' ? ar.projects[p.id].kicker : p[lang].kicker, body: lang === 'ar' ? ar.projects[p.id].body : p[lang].body
    }))
  };
}

// The blog: the articles of soynando.com (maqueta/shared/blog.json, made by
// maqueta/tools/soynando-to-blog.cjs), newest first. Posts only in Spanish
// fall back to it: `postLang` says which language the text is in.
//   const b = await blog();
//   b.posts[{ id, n, date, year, category, tags[], url, postLang, cover{ w, h, alt, src }, title, excerpt, body[], words, minutes }]
//   b.categories{ id: { id, name, desc, kind, count } }, b.tags{ id: { id, label, count } }
// body blocks: { p } (inline HTML) | { h, lv } | { img, alt, cap } | { quote[], cite } | { pull[], cite }
//   | { ul[], ol } | { code } | { yt, title, cap } | { tweet, by, url, date } | { embed, host }
//   | { gist } | { table: { head[], rows[][] }, cap } | { timeline: [{ when, title, text }] } | { hr }
export async function blog() {
  const [raw, ar] = await Promise.all([fetch('/maqueta/shared/blog.json').then((r) => r.json()), lang === 'ar' ? arabic() : null]);
  const strip = (s) => String(s).replace(/<[^>]+>/g, ' ');
  const text = (b) => strip([b.p, b.h, b.quote, b.pull, b.ul, b.tweet, b.timeline && b.timeline.map((x) => `${x.title} ${x.text}`), b.table && b.table.rows.flat()]
    .flat().filter(Boolean).join(' '));
  const posts = raw.posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((p, i, all) => {
      const postLang = p[lang] ? lang : 'es', t = p[postLang];
      const words = t.body.map(text).join(' ').split(/\s+/).filter(Boolean).length;
      return {
        id: p.id, n: all.length - i, date: p.date, year: +p.date.slice(0, 4), category: p.category, tags: p.tags, url: p.url, postLang, cover: p.cover || null,
        title: t.title, excerpt: t.excerpt, body: t.body, words, minutes: Math.max(1, Math.round(words / 220))
      };
    });
  const categories = Object.fromEntries(Object.entries(raw.categories).map(([id, c]) =>
    [id, { id, kind: c.kind, name: (lang === 'ar' ? ar.blog.categories[id] : c[lang]).name, desc: (lang === 'ar' ? ar.blog.categories[id] : c[lang]).desc, count: posts.filter((p) => p.category === id).length }]));
  const tags = Object.fromEntries(Object.entries(raw.tags).map(([id, t]) =>
    [id, { id, label: lang === 'ar' ? ar.blog.tags[id] : t[lang], count: posts.filter((p) => p.tags.includes(id)).length }]));
  return { posts, categories, tags };
}
