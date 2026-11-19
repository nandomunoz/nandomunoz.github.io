// RSS 2.0 by hand (plan Phase 9): one feed per language with its posts, newest first. The Spanish items keep the old
// WordPress address as their guid (not a permalink), so a reader that already has them does not show them twice.
import { loadBlog } from './blog.js';
import { pathFor, blogRest, type Locale } from '../i18n/ui';
import { getEntry } from 'astro:content';

const ORIGIN = 'https://nandomunoz.com';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const LANG = { es: 'es', en: 'en-gb', ar: 'ar' } as const;

export async function feedFor(lang: Locale) {
  const site = (await getEntry('site', 'site'))!.data;
  const { posts, categories } = await loadBlog(lang);
  const self = ORIGIN + (lang === 'es' ? '' : `/${lang}`) + '/rss.xml';
  const items = posts.map((p: any) => {
    const link = ORIGIN + pathFor(lang, 'blog', blogRest.post(p.slug));
    const guid = !p.data.translated && p.data.original ? `<guid isPermaLink="false">${esc(p.data.original)}</guid>` : `<guid isPermaLink="true">${link}</guid>`;
    return `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${link}</link>
      ${guid}
      <pubDate>${p.date.toUTCString()}</pubDate>
      <dc:creator>${esc(site.name)}</dc:creator>
      <category>${esc(categories[p.category].name)}</category>
      <description>${esc(p.data.excerpt)}</description>
    </item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(site.name)}</title>
    <link>${ORIGIN}${pathFor(lang, 'blog')}</link>
    <description>${esc(site[lang].metaDescription)}</description>
    <language>${LANG[lang]}</language>
    <lastBuildDate>${posts[0].date.toUTCString()}</lastBuildDate>
    <atom:link href="${self}" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
