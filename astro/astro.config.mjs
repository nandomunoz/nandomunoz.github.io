import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

// nandomunoz.com — see .claude/plan-soynando-astro.md (Phase 1).
export default defineConfig({
  site: 'https://nandomunoz.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  prefetch: false, // Speculation Rules instead
  // The posts keep their text exactly as written: no smart punctuation (it would change quotes and
  // dashes) and no GFM (its autolinks would nest a link inside a link whose text is a URL; tables and
  // other special blocks are written as HTML).
  markdown: { gfm: false, processor: satteri({ features: { smartPunctuation: false, headingAttributes: true } }) },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'ar'],
    routing: { prefixDefaultLocale: false }
  }
});
