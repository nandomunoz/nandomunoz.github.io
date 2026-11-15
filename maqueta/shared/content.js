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
