// The real content of the portfolio, read from the site's own data files
// (data/site.json, data/projects.json), so every layout in the sandbox shows
// the same texts. Language from ?lang=en (Spanish by default).
//
//   import { content } from '../shared/content.js';
//   const c = await content();
//   c.name, c.nick, c.kicker, c.deck, c.bio[], c.contactTitle, c.contactText,
//   c.socials[{ id, label, handle, url }],
//   c.projects[{ id, name, year, tech[], demo, repo, kicker, body[] }], c.lang
export const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'es';

export async function content() {
  const [site, projects] = await Promise.all(
    ['site', 'projects'].map((f) => fetch(`/data/${f}.json`).then((r) => r.json()))
  );
  const t = site.i18n[lang];
  return {
    lang,
    name: site.name,
    nick: site.nick,
    kicker: t.kicker,
    deck: t.deck,
    bio: t.bio,
    contactTitle: t.contactTitle,
    contactText: t.contactText,
    socials: site.socials,
    projects: projects.map((p) => ({
      id: p.id, name: p.name, year: p.year, tech: p.tech, demo: p.demo, repo: p.repo,
      kicker: p[lang].kicker, body: p[lang].body
    }))
  };
}

// The blog (sample texts in maqueta/shared/blog.json), newest first.
//   const b = await blog();
//   b.posts[{ id, n, date, year, category, tags[], title, excerpt, body[], words, minutes }]
//   b.categories{ id: { id, name, desc, kind, count } }, b.tags{ id: { id, label, count } }
// body blocks: 'paragraph' | { h } | { code, lang } | { quote } | { ul: [] }
export async function blog() {
  const raw = await fetch('/maqueta/shared/blog.json').then((r) => r.json());
  const text = (b) => (typeof b === 'string' ? b : b.h || b.code || b.quote || (b.ul || []).join(' '));
  const posts = raw.posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((p, i, all) => {
      const words = p[lang].body.map(text).join(' ').split(/\s+/).length;
      return {
        id: p.id, n: all.length - i, date: p.date, year: +p.date.slice(0, 4), category: p.category, tags: p.tags,
        title: p[lang].title, excerpt: p[lang].excerpt, body: p[lang].body, words, minutes: Math.max(1, Math.round(words / 200))
      };
    });
  const categories = Object.fromEntries(Object.entries(raw.categories).map(([id, c]) =>
    [id, { id, kind: c.kind, name: c[lang].name, desc: c[lang].desc, count: posts.filter((p) => p.category === id).length }]));
  const tags = Object.fromEntries(Object.entries(raw.tags).map(([id, t]) =>
    [id, { id, label: t[lang], count: posts.filter((p) => p.tags.includes(id)).length }]));
  return { posts, categories, tags };
}
