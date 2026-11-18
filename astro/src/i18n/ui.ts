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

/** What comes after a route's segment: the same text in every language, or one per language (a category is
 *  «categoria» in Spanish and «category» in English and Arabic). */
export type Rest = string | Partial<Record<Locale, string>>;

/** The path of a route in a language, with the trailing slash: pathFor('en', 'projects', 'luz') → /en/projects/luz/ */
export function pathFor(l: Locale, route: Route, rest: Rest = ''): string {
  const seg = segments[route][locales.indexOf(l)];
  const r = typeof rest === 'string' ? rest : (rest[l] ?? '');
  return `${prefix(l)}/${seg ? seg + '/' : ''}${r ? r.replace(/^\/|\/$/g, '') + '/' : ''}`.replace('//', '/');
}

/** The blog's pages, by language: lists are /blog/, /blog/2/…; a category is /blog/categoria/x/ (es) or
 *  /blog/category/x/; a tag /blog/etiqueta/x/ or /blog/tag/x/. Returns the `rest` for pathFor(l, 'blog', …). */
const CAT = { es: 'categoria', en: 'category', ar: 'category' } as const;
const TAG = { es: 'etiqueta', en: 'tag', ar: 'tag' } as const;
export const blogRest = {
  page: (n: number) => (n > 1 ? String(n) : ''),
  post: (slug: string) => slug,
  categories: (): Rest => ({ es: CAT.es, en: CAT.en, ar: CAT.ar }),
  category: (id: string, n = 1): Rest => Object.fromEntries(locales.map((l) => [l, `${CAT[l]}/${id}${n > 1 ? '/' + n : ''}`])),
  tags: (): Rest => ({ es: TAG.es, en: TAG.en, ar: TAG.ar }),
  tag: (id: string, n = 1): Rest => Object.fromEntries(locales.map((l) => [l, `${TAG[l]}/${id}${n > 1 ? '/' + n : ''}`]))
};

export const ui = {
  es: {
    skip: 'Saltar al contenido', siteName: 'Nando Muñoz', sections: 'Principal', bio: 'Bio', work: 'Proyectos', blog: 'Blog',
    language: 'Idioma', currentLanguage: 'idioma actual', newTab: '(se abre en otra pestaña)',
    foot: {
      sections: 'Secciones', follow: 'Sígueme', about: 'Sobre esta web', privacy: 'Privacidad', cookies: 'Cookies', credits: 'Créditos y licencia',
      cookieSettings: 'Ajustes de cookies',
      legal: ['Contenido © ', ', salvo lo que se acredite aparte en los ', 'créditos', '. Hecho con ', ' (licencia MIT). Cómo usa las cookies esta web, en la ', 'política de cookies', '; puedes cambiar tus ', 'ajustes de cookies', ' cuando quieras.']
    },
    home: {
      pre: 'una web de', motto: 'Proyecto, el motivo. Humano, el centro. TecnologIA, sólo el medio', key: '(Proyecto|Humano|IA|motivo|centro|medio)', green: ['Proyecto', 'Humano', 'IA'],
      legendTitle: 'Cómo leer los bloques', legend: 'Cada bloque es un proyecto. Cuanto más reciente, más denso; cuanto más largo su texto, más alto. Su kanji va dibujado en grande; la trama de fondo sale de su captura.',
      open: 'Abrir', allProjects: 'Todos los proyectos', allPosts: 'Todos los artículos', bioLinks: [['mis artículos', 'blog'], ['mis proyectos', 'projects']],
      count: (n: number, a: number, b: number) => `${n} proyectos · ${a}–${b}`
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
    home: {
      pre: 'a site by', motto: 'Project, the reason. Human, the core. TechnologAI, only the means', key: '(Project|Human|AI|reason|core|means)', green: ['Project', 'Human', 'AI'],
      legendTitle: 'How to read the blocks', legend: 'Each block is a project. The newer, the denser; the longer its text, the taller. Its kanji is drawn big; the field behind it comes from its screenshot.',
      open: 'Open', allProjects: 'All projects', allPosts: 'All posts', bioLinks: [['my articles', 'blog'], ['my projects', 'projects']],
      count: (n: number, a: number, b: number) => `${n} projects · ${a}–${b}`
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
    home: {
      pre: 'موقع من إنجاز', motto: 'المشروع: السبب. الإنسان: المحور. الذكاء الاصطناعي: مجرّد وسيلة', key: '(المشروع|الإنسان|الذكاء الاصطناعي|السبب|المحور|وسيلة)', green: ['المشروع', 'الإنسان', 'الذكاء الاصطناعي'],
      legendTitle: 'كيف تُقرأ الكتل', legend: 'كل كتلة مشروع. كلما كان أحدث زادت كثافته؛ وكلما طال نصه زاد ارتفاعها. رمز الكانجي الخاص به مرسوم بحجم كبير؛ والنمط في الخلفية مأخوذ من لقطة شاشته.',
      open: 'افتح', allProjects: 'كل المشاريع', allPosts: 'كل المقالات', bioLinks: [['مقالاتي', 'blog'], ['مشاريعي', 'projects']],
      count: (n: number, a: number, b: number) => `${n === 1 ? 'مشروع واحد' : n === 2 ? 'مشروعان' : n % 100 >= 3 && n % 100 <= 10 ? n + ' مشاريع' : n + ' مشروعًا'} · ${a}–${b}`
    },
    theme: { legend: 'نمط الألوان', light: 'فاتح', 'high-contrast': 'تباين عالٍ', dark: 'داكن' }
  }
} satisfies Record<Locale, Record<string, unknown>>;
