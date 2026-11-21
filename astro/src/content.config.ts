// Content collections (plan, Phase 3). The data was migrated once from the maqueta (now removed);
// from here on this is the source of truth.
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const locales = ['es', 'en', 'ar'] as const;

/** A link that is data for an href: http or https only (z.url() alone would let `javascript:` or `data:` through). */
const httpUrl = z.url().refine((u) => /^https?:\/\//i.test(u), { message: 'must be an http(s) URL' });

/** A name and a short description in every language. */
const named = z.object({ name: z.string(), desc: z.string() });
const label = z.object({ es: z.string(), en: z.string(), ar: z.string() });

const posts = defineCollection({
  // index.md is the Spanish original; en.md and ar.md are the (machine) translations.
  loader: glob({ pattern: '*/{index,en,ar}.md', base: './src/content/posts', generateId: ({ entry }) => entry.replace(/\/index\.md$/, '/es').replace(/\.md$/, '') }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      date: z.coerce.date(),
      category: z.string(),
      tags: z.array(z.string()),
      lang: z.enum(locales),
      /** true for en and ar: shows the «translated automatically» notice and links to the original */
      translated: z.boolean(),
      /** The WordPress address, kept only to build the redirects and the RSS guid */
      original: httpUrl,
      cover: z.object({
        src: image(),
        /** the grey read as halftone by the dot engine */
        tone: image().optional(),
        w: z.number(),
        h: z.number(),
        alt: z.string().min(1), // WCAG 1.1.1: the cover is content
        credit: z.string().optional()
      })
    })
});

const projects = defineCollection({
  loader: file('./src/content/projects.json'),
  schema: ({ image }) => {
    const text = z.object({ kicker: z.string(), body: z.array(z.string()), quote: z.string().optional(), caption: z.string().optional() });
    return z.object({
      id: z.string(),
      /** the number shown in the blocks; null for the projects Trama does not show */
      order: z.number().int().nullable(),
      hidden: z.boolean(),
      featured: z.boolean(),
      name: z.string(),
      year: z.number().int(),
      tech: z.array(z.string()),
      demo: httpUrl.nullable().optional(),
      /** null for a private repository: no link to it */
      repo: httpUrl.nullable(),
      plate: z.string().optional(),
      kanji: z.object({ char: z.string(), meaning: label }).nullable(),
      shot: z.object({ src: image(), tone: image().optional() }).nullable(),
      es: text,
      en: text,
      ar: text.nullable()
    });
  }
});

const categories = defineCollection({
  loader: file('./src/content/categories.json'),
  schema: z.object({ id: z.string(), kind: z.number().int(), es: named, en: named, ar: named })
});

const tags = defineCollection({
  loader: file('./src/content/tags.json'),
  schema: z.object({ id: z.string(), es: z.string(), en: z.string(), ar: z.string() })
});

const social = z.object({ id: z.string(), label: z.string(), handle: z.string(), url: httpUrl });
const ui = z.looseObject({ title: z.string(), metaDescription: z.string(), kicker: z.string(), deck: z.string(), bio: z.array(z.string()).or(z.string()), contactTitle: z.string(), contactText: z.string(), motto: z.any() });
const site = defineCollection({
  loader: file('./src/content/site.json', { parser: (text) => [{ id: 'site', ...JSON.parse(text) }] }),
  schema: z.object({ id: z.string(), name: z.string(), nick: z.string().optional(), monogram: z.string().optional(), domain: z.string(), socials: z.array(social), es: ui, en: ui, ar: ui })
});

export const collections = { posts, projects, categories, tags, site };
