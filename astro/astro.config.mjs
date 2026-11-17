import { defineConfig } from 'astro/config';

// nandomunoz.com — see .claude/plan-soynando-astro.md (Phase 1).
export default defineConfig({
  site: 'https://nandomunoz.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  prefetch: false, // Speculation Rules instead
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'ar'],
    routing: { prefixDefaultLocale: false }
  }
});
