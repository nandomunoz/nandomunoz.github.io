// The sitemap (plan Phase 9): every indexable page with its alternates in the other languages (hreflang) and the
// posts' dates. Left out: the style guide, a tag with fewer than two posts (noindex) and the paginated lists.
import { getCollection } from 'astro:content';
import { loadBlog } from '../lib/blog.js';
import { pathFor, blogRest, locales, type Locale, type Route, type Rest } from '../i18n/ui';

const esc = (s: string) => s.replace(/&/g, '&amp;');
interface Page { route: Route; rest?: Rest; lastmod?: string }

export async function GET({ site }: { site: URL }) {
  const origin = site.origin;
  const blog = await loadBlog('es');
  const projects = (await getCollection('projects')).filter((p) => !p.data.hidden);
  const pages: Page[] = [
    { route: 'home' }, { route: 'projects' }, { route: 'blog' }, { route: 'privacy' }, { route: 'cookies' }, { route: 'credits' },
    ...projects.map((p) => ({ route: 'projects' as Route, rest: p.data.id })),
    ...blog.posts.map((p: any) => ({ route: 'blog' as Route, rest: blogRest.post(p.slug), lastmod: p.date.toISOString().slice(0, 10) })),
    { route: 'blog', rest: blogRest.categories() },
    ...Object.values(blog.categories).filter((c: any) => c.count > 0).map((c: any) => ({ route: 'blog' as Route, rest: blogRest.category(c.id) })),
    { route: 'blog', rest: blogRest.tags() },
    ...Object.values(blog.tags).filter((t: any) => t.count >= 2).map((t: any) => ({ route: 'blog' as Route, rest: blogRest.tag(t.id) }))
  ];
  const url = (l: Locale, p: Page) => origin + pathFor(l, p.route, p.rest ?? '');
  const entries = pages.flatMap((p) => locales.map((l) => `  <url>
    <loc>${esc(url(l, p))}</loc>${p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ''}
${locales.map((a) => `    <xhtml:link rel="alternate" hreflang="${a === 'ar' ? 'ar' : a}" href="${esc(url(a, p))}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(url('es', p))}"/>
  </url>`));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
