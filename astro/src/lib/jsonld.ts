// schema.org nodes (plan Phase 9, §7/§8): the person and the site on the home; a BlogPosting and its breadcrumb on
// every post, with the translations tied together; the project pages build their own SoftwareSourceCode.
// Everything comes from the content collections, nothing is written by hand.
import { getEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/ui';

const ORIGIN = 'https://nandomunoz.com';
export const abs = (path: string) => (path.startsWith('http') ? path : ORIGIN + path);
const inLang = (l: Locale) => l;

/** The person: the main entity of the home, referenced from everywhere else. */
export async function personNode(lang: Locale) {
  const site = (await getEntry('site', 'site'))!.data;
  const parts = site[lang].kicker.split('·').map((x: string) => x.trim());
  return {
    '@type': 'Person', '@id': `${ORIGIN}/#person`, name: site.name, alternateName: site.nick, jobTitle: parts[0],
    address: { '@type': 'PostalAddress', addressLocality: parts.at(-1) }, url: `${ORIGIN}/`,
    // the old soynando.com stays as one of his addresses, so the redirects and the new site read as the same entity
    sameAs: [...site.socials.filter((s) => s.id !== 'blog' && s.id !== 'rss').map((s) => s.url), 'https://soynando.com']
  };
}

/** The home: WebSite + ProfilePage + Person. */
export async function homeGraph(lang: Locale, url: string, description: string) {
  const site = (await getEntry('site', 'site'))!.data;
  return [
    { '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: site.name, inLanguage: ['es', 'en', 'ar'], publisher: { '@id': `${ORIGIN}/#person` } },
    { '@type': 'ProfilePage', '@id': `${abs(url)}#profile`, url: abs(url), name: site.name, description, inLanguage: inLang(lang), isPartOf: { '@id': `${ORIGIN}/#website` }, mainEntity: { '@id': `${ORIGIN}/#person` } },
    await personNode(lang)
  ];
}

export const breadcrumb = (items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(url) }))
});

/** A cover cropped to a ratio, for rich results (Google asks for 16:9, 4:3 and 1:1) and for social cards (1200 × 630). */
export async function cropped(src: ImageMetadata, w: number, h: number) {
  const img = await getImage({ src, width: w, height: h, fit: 'cover', format: 'jpg' });
  return abs(img.src);
}

interface PostInfo {
  lang: Locale; url: string; title: string; excerpt: string; date: Date; cover: ImageMetadata; section: string; tags: string[];
  /** the same post in the other languages: [lang, url] */
  others: [Locale, string][]; translated: boolean; crumbs: [string, string][];
}
export async function postGraph(p: PostInfo) {
  const images = await Promise.all([cropped(p.cover, 1200, 675), cropped(p.cover, 1200, 900), cropped(p.cover, 1200, 1200)]);
  const posting: Record<string, unknown> = {
    '@type': 'BlogPosting', '@id': `${abs(p.url)}#post`, url: abs(p.url), mainEntityOfPage: abs(p.url), headline: p.title, description: p.excerpt,
    datePublished: p.date.toISOString().slice(0, 10), dateModified: p.date.toISOString().slice(0, 10), inLanguage: inLang(p.lang), image: images,
    articleSection: p.section, keywords: p.tags.join(', '), author: { '@id': `${ORIGIN}/#person` }, publisher: { '@id': `${ORIGIN}/#person` }, isPartOf: { '@id': `${ORIGIN}/#website` }
  };
  // the Spanish original lists its translations; a translation points back to the original
  if (p.translated) posting.translationOfWork = { '@id': `${abs(p.others.find(([l]) => l === 'es')![1])}#post` };
  else posting.workTranslation = p.others.map(([, u]) => ({ '@id': `${abs(u)}#post` }));
  return [posting, breadcrumb(p.crumbs), await personNode(p.lang)];
}
