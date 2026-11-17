// Interface strings, routes and per-language facts (plan §5, §6). Ported from the maqueta's
// H and B objects (main.js, blog/blog.js, blog/parts.js); grows with each phase.
export const locales = ['es', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const htmlLang: Record<Locale, string> = { es: 'es', en: 'en', ar: 'ar-SY' };
export const dir: Record<Locale, 'ltr' | 'rtl'> = { es: 'ltr', en: 'ltr', ar: 'rtl' };
/** hreflang: Arabic without a region so it is not tied to one country (plan I7) */
export const hreflang: Record<Locale, string> = { es: 'es', en: 'en', ar: 'ar' };
export const languageName: Record<Locale, string> = { es: 'Español', en: 'English', ar: 'العربية' };

/** Prefix of a locale's URLs: '' for Spanish, '/en', '/ar'. */
export const prefix = (l: Locale) => (l === 'es' ? '' : `/${l}`);

/** Route segments per locale (plan §5). Slugs of what lies below them are the same in every language. */
const segments = {
  home: ['', '', ''],
  projects: ['proyectos', 'projects', 'projects'],
  blog: ['blog', 'blog', 'blog'],
  privacy: ['privacidad', 'privacy', 'privacy'],
  cookies: ['politica-de-cookies', 'cookie-policy', 'cookie-policy'],
  credits: ['creditos', 'credits', 'credits'],
  estilo: ['estilo', 'estilo', 'estilo']
} as const;
export type Route = keyof typeof segments;

/** The path of a route in a language, with the trailing slash: pathFor('en', 'projects', 'luz') → /en/projects/luz/ */
export function pathFor(l: Locale, route: Route, rest = ''): string {
  const seg = segments[route][locales.indexOf(l)];
  return `${prefix(l)}/${seg ? seg + '/' : ''}${rest ? rest.replace(/^\/|\/$/g, '') + '/' : ''}`.replace('//', '/');
}

export const ui = {
  es: {
    skip: 'Saltar al contenido', siteName: 'Nando Muñoz', sections: 'Principal', bio: 'Bio', work: 'Proyectos', blog: 'Blog',
    language: 'Idioma', currentLanguage: 'idioma actual', newTab: '(se abre en otra pestaña)',
    foot: {
      sections: 'Secciones', follow: 'Sígueme', about: 'Sobre esta web', privacy: 'Privacidad', cookies: 'Cookies', credits: 'Créditos y licencia',
      cookieSettings: 'Ajustes de cookies',
      legal: ['Contenido © ', ', salvo lo que se acredite aparte en los ', 'créditos', '. Hecho con ', ' (licencia MIT). Cómo usa las cookies esta web, en la ', 'política de cookies', '; puedes cambiar tus ', 'ajustes de cookies', ' cuando quieras.']
    },
    theme: { legend: 'Modo de color', light: 'Claro', 'high-contrast': 'Contraste alto', dark: 'Oscuro' }
  },
  en: {
    skip: 'Skip to content', siteName: 'Nando Muñoz', sections: 'Main', bio: 'Bio', work: 'Projects', blog: 'Blog',
    language: 'Language', currentLanguage: 'current language', newTab: '(opens in a new tab)',
    foot: {
      sections: 'Sections', follow: 'Follow me', about: 'About this site', privacy: 'Privacy', cookies: 'Cookies', credits: 'Credits and licence',
      cookieSettings: 'Cookie settings',
      legal: ['Content © ', ', except what is credited separately in the ', 'credits', '. Made with ', ' (MIT licence). How this site uses cookies, in the ', 'cookie policy', '; you can change your ', 'cookie settings', ' whenever you like.']
    },
    theme: { legend: 'Colour mode', light: 'Light', 'high-contrast': 'High contrast', dark: 'Dark' }
  },
  ar: {
    skip: 'انتقل إلى المحتوى', siteName: 'Nando Muñoz', sections: 'القائمة الرئيسية', bio: 'نبذة', work: 'المشاريع', blog: 'المدونة',
    language: 'اللغة', currentLanguage: 'اللغة الحالية', newTab: '(يُفتح في تبويب جديد)',
    foot: {
      sections: 'الأقسام', follow: 'تابعني', about: 'عن هذا الموقع', privacy: 'الخصوصية', cookies: 'الكوكيز', credits: 'الاعتمادات والترخيص',
      cookieSettings: 'إعدادات الكوكيز',
      legal: ['المحتوى © ', '، باستثناء ما يُنسب إلى أصحابه في ', 'الاعتمادات', '. صُنع بـ ', ' (رخصة MIT). كيف يستخدم هذا الموقع الكوكيز، في ', 'سياسة الكوكيز', '؛ ويمكنك تغيير ', 'إعدادات الكوكيز', ' متى شئت.']
    },
    theme: { legend: 'نمط الألوان', light: 'فاتح', 'high-contrast': 'تباين عالٍ', dark: 'داكن' }
  }
} satisfies Record<Locale, Record<string, unknown>>;
