// The search index of the 404 (plan Phase 9): one small JSON per language with every post and project — title, a line
// of context, address and the text to match, lower-cased and without accents (the page normalises what is typed the same way).
import { getCollection } from 'astro:content';
import { loadBlog } from './blog.js';
import { loadProjects } from './projects.js';
import { blogStrings } from '../i18n/blog.js';
import { pathFor, blogRest, type Locale } from '../i18n/ui';

export const norm = (s: string) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/<[^>]+>/g, ' ');

export async function searchIndex(lang: Locale) {
  const B = blogStrings(lang);
  const { posts, categories, tags } = await loadBlog(lang);
  const { projects } = await loadProjects(lang);
  return [
    ...posts.map((p: any) => ({
      kind: B.post, title: p.data.title, sub: `${categories[p.category].name} · ${p.year}`, href: pathFor(lang, 'blog', blogRest.post(p.slug)),
      hay: norm([p.data.title, p.data.excerpt, p.tags.map((t: string) => tags[t].label).join(' '), categories[p.category].name].join(' '))
    })),
    ...projects.map((p: any) => ({
      kind: B.project, title: p.name, sub: `${p.tech.join(' · ')} · ${p.year}`, href: pathFor(lang, 'projects', p.id), hay: norm([p.name, p.kicker, p.tech.join(' ')].join(' '))
    }))
  ];
}
