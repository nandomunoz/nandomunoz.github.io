// Interface strings and per-language facts. Grows with each phase.
export const locales = ['es', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const htmlLang: Record<Locale, string> = { es: 'es', en: 'en', ar: 'ar-SY' };
export const dir: Record<Locale, 'ltr' | 'rtl'> = { es: 'ltr', en: 'ltr', ar: 'rtl' };
export const languageName: Record<Locale, string> = { es: 'Español', en: 'English', ar: 'العربية' };

export const ui = {
  es: { skip: 'Saltar al contenido', siteName: 'Nando Muñoz' },
  en: { skip: 'Skip to content', siteName: 'Nando Muñoz' },
  ar: { skip: 'انتقل إلى المحتوى', siteName: 'Nando Muñoz' }
} satisfies Record<Locale, Record<string, string>>;

/** Prefix of a locale's URLs: '' for Spanish, '/en', '/ar'. */
export const prefix = (l: Locale) => (l === 'es' ? '' : `/${l}`);
