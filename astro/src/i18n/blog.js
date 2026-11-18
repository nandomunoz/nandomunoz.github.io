// Blog and project interface strings in the three languages (plan Phase 8). Ported from the maqueta's
// blog/parts.js (B); `blogStrings(lang)` picks one. Counts and plurals as functions: the Arabic ones follow
// the language's rules (one and two have their own words, 3–10 the plural, 11 and up the singular).

// Arabic counts: 1 and 2 have their own words, 3–10 take the plural, 11 and up take the singular after the number
const arN = (n, one, two, few, many) => (n === 1 ? one : n === 2 ? two : n % 100 >= 3 && n % 100 <= 10 ? `${n} ${few}` : `${n} ${many}`);
const arPosts = (n) => arN(n, 'مقال واحد', 'مقالان', 'مقالات', 'مقالًا');
const arProjects = (n) => arN(n, 'مشروع واحد', 'مشروعان', 'مشاريع', 'مشروعًا');
const arResults = (n) => arN(n, 'نتيجة واحدة', 'نتيجتان', 'نتائج', 'نتيجة');
const arMin = (m) => arN(m, 'دقيقة واحدة', 'دقيقتان', 'دقائق', 'دقيقة');

const strings = {
  es: {
    blog: 'Blog', deck: 'Código, inteligencia artificial, gestión de equipos y Carnaval de Cádiz.',
    count: (n, a, b) => `${n} artículos · ${a === b ? a : `${a}–${b}`}`, countOne: (n) => (n === 1 ? '1 artículo' : `${n} artículos`),
    all: 'Todos los artículos', categories: 'Categorías', allCategories: 'Todas las categorías', tags: 'Etiquetas', allTags: 'Todas las etiquetas',
    min: (m) => `${m} min de lectura`, minShort: (m) => `${m} min`, latest: 'Lo último',
    newer: 'Más recientes', older: 'Anteriores', page: (a, b) => `Página ${a} de ${b}`, pages: 'Páginas',
    toc: 'En este artículo', timeline: 'Línea de tiempo', shareThis: 'Compartir artículo', copy: 'Copiar enlace', copied: 'Enlace copiado', codeCopy: 'Copiar', codeCopyLabel: 'Copiar el ejemplo de código', copyFail: 'Selecciona el enlace y cópialo', shareLink: 'Enlace del artículo', sectionLink: 'Enlace a esta sección', shareOn: 'Compartir en', email: 'Correo', close: 'Cerrar', newTab: '(se abre en otra pestaña)',
    prev: 'Anterior', next: 'Siguiente', newerPost: 'Más reciente', olderPost: 'Más antiguo', related: 'Sigue leyendo', back: 'Volver al blog',
    by: 'Escrito por', authorMore: 'Más sobre mí', write: 'Escríbeme',
    published: 'Publicado', reading: 'Lectura', in: 'en', tagged: 'Etiquetados con', tagDeck: (t) => `Los artículos del blog etiquetados con ${t}.`, tagsDeck: 'Las etiquetas del blog y cuántos artículos tiene cada una.', categoriesDeck: 'Las categorías del blog y los artículos de cada una.',
    nf: 'No encontrado', nfText: 'Esta página no existe o ha cambiado de sitio.',
    legendTitle: 'Cómo leer las tramas', legend: 'Cada categoría tiene su trama; cuanto más largo el artículo, más densa.',
    nfKicker: 'Error 404 · Página no encontrada', nfTitle: 'Esta página se ha deshecho en puntos.',
    nfLead: 'No hay nada en', nfLead2: '. Puede que el enlace esté mal escrito o que la página se haya mudado.',
    nfHint: 'Toca para escanear', nfHintFine: 'Haz clic para escanear',
    nfSearch: 'Buscar en el blog y los proyectos', nfPlaceholder: 'Margaret Hamilton, carnaval, IA…',
    nfMaybe: '¿Buscabas esto?', nfResults: (n) => (n === 1 ? '1 resultado' : `${n} resultados`), nfNone: 'Nada por aquí. Prueba con otra palabra.',
    nfWays: 'O empieza por aquí', nfHome: 'Inicio', nfLatest: 'Lo último del blog', project: 'Proyecto', post: 'Artículo',
    onlyEs: '', listNote: '', autoNote: '', autoLink: '', watch: 'Ver el vídeo', code: 'Ver el código', play: 'Reproducir vídeo',
    projects: 'Proyectos', allProjects: 'Todos los proyectos', projPage: 'Ficha completa',
    projDeck: 'Una selección de lo que he publicado en GitHub: sistemas de diseño, herramientas, experimentos con IA y el Carnaval de Cádiz.',
    projCount: (n, a, b) => `${n} proyectos · ${a}–${b}`, projCountOne: (n) => (n === 1 ? '1 proyecto' : `${n} proyectos`),
    allTech: 'Todas', techLabel: 'Tecnología', year: 'Año', demo: 'Ver demo', repo: 'Ver código', shot: (n) => `Captura de ${n}`, moreProjects: 'Más proyectos',
    newTab: '(se abre en otra pestaña)', projLegendTitle: 'Cómo leer los bloques',
    projLegend: 'Cuanto más reciente el proyecto, más densa su trama; su kanji va dibujado en ella.'
  },
  en: {
    blog: 'Blog', deck: 'Code, artificial intelligence, team management and the Cádiz Carnival.',
    count: (n, a, b) => `${n} posts · ${a === b ? a : `${a}–${b}`}`, countOne: (n) => (n === 1 ? '1 post' : `${n} posts`),
    all: 'All posts', categories: 'Categories', allCategories: 'All categories', tags: 'Tags', allTags: 'All tags',
    min: (m) => `${m} min read`, minShort: (m) => `${m} min`, latest: 'Latest',
    newer: 'Newer', older: 'Older', page: (a, b) => `Page ${a} of ${b}`, pages: 'Pages',
    toc: 'In this post', timeline: 'Timeline', shareThis: 'Share this post', copy: 'Copy link', copied: 'Link copied', codeCopy: 'Copy', codeCopyLabel: 'Copy code example', copyFail: 'Select the link and copy it', shareLink: 'Link to this post', sectionLink: 'Link to this section', shareOn: 'Share on', email: 'Email', close: 'Close', newTab: '(opens in a new tab)',
    prev: 'Previous', next: 'Next', newerPost: 'Newer', olderPost: 'Older', related: 'Keep reading', back: 'Back to the blog',
    by: 'Written by', authorMore: 'More about me', write: 'Write to me',
    published: 'Published', reading: 'Reading', in: 'in', tagged: 'Tagged', tagDeck: (t) => `The blog posts tagged ${t}.`, tagsDeck: 'The blog’s tags and how many posts each has.', categoriesDeck: 'The blog’s categories and the posts in each.',
    nf: 'Not found', nfText: 'This page doesn’t exist or has moved.',
    legendTitle: 'How to read the screens', legend: 'Each category has its own screen; the longer the post, the denser.',
    nfKicker: 'Error 404 · Page not found', nfTitle: 'This page has come apart into dots.',
    nfLead: 'There’s nothing at', nfLead2: '. The link may be mistyped, or the page may have moved.',
    nfHint: 'Tap to scan', nfHintFine: 'Click to scan',
    nfSearch: 'Search the blog and the projects', nfPlaceholder: 'Margaret Hamilton, carnival, AI…',
    nfMaybe: 'Were you looking for this?', nfResults: (n) => (n === 1 ? '1 result' : `${n} results`), nfNone: 'Nothing here. Try another word.',
    nfWays: 'Or start here', nfHome: 'Home', nfLatest: 'Latest on the blog', project: 'Project', post: 'Post',
    onlyEs: 'This post is only available in Spanish.', listNote: 'The posts are translated automatically from the Spanish originals.',
    autoNote: 'Originally written in Spanish. This translation is automatic and may contain mistakes.', autoLink: 'Read the original in Spanish', watch: 'Watch the video', code: 'See the code', play: 'Play video',
    projects: 'Projects', allProjects: 'All projects', projPage: 'Full page',
    projDeck: 'A selection of what I’ve published on GitHub: design systems, tools, AI experiments and the Cádiz Carnival.',
    projCount: (n, a, b) => `${n} projects · ${a}–${b}`, projCountOne: (n) => (n === 1 ? '1 project' : `${n} projects`),
    allTech: 'All', techLabel: 'Technology', year: 'Year', demo: 'See demo', repo: 'See code', shot: (n) => `Screenshot of ${n}`, moreProjects: 'More projects',
    newTab: '(opens in a new tab)', projLegendTitle: 'How to read the blocks',
    projLegend: 'The newer the project, the denser its screen; its kanji is drawn in it.'
  },
  ar: {
    blog: 'المدونة', deck: 'الكود والذكاء الاصطناعي وإدارة الفرق وكرنفال قادس.',
    count: (n, a, b) => `${arPosts(n)} · ${a === b ? a : `${a}–${b}`}`, countOne: (n) => arPosts(n),
    all: 'كل المقالات', categories: 'التصنيفات', allCategories: 'كل التصنيفات', tags: 'الوسوم', allTags: 'كل الوسوم',
    min: (m) => `قراءة ${arMin(m)}`, minShort: (m) => `${m} د`, latest: 'الأحدث',
    newer: 'الأحدث', older: 'الأقدم', page: (a, b) => `الصفحة ${a} من ${b}`, pages: 'الصفحات',
    toc: 'في هذا المقال', timeline: 'الخط الزمني', shareThis: 'مشاركة المقال', copy: 'نسخ الرابط', copied: 'تم نسخ الرابط', codeCopy: 'نسخ', codeCopyLabel: 'نسخ مثال الشيفرة', copyFail: 'حدّد الرابط وانسخه', shareLink: 'رابط المقال', sectionLink: 'رابط إلى هذا القسم', shareOn: 'المشاركة على', email: 'البريد', close: 'إغلاق', newTab: '(يُفتح في تبويب جديد)',
    prev: 'السابق', next: 'التالي', newerPost: 'الأحدث', olderPost: 'الأقدم', related: 'تابع القراءة', back: 'العودة إلى المدونة',
    by: 'بقلم', authorMore: 'المزيد عني', write: 'راسلني',
    published: 'نُشر', reading: 'القراءة', in: 'في', tagged: 'الموسومة بـ', tagDeck: (t) => `مقالات المدونة الموسومة بـ ${t}.`, tagsDeck: 'وسوم المدونة وعدد المقالات في كل منها.', categoriesDeck: 'تصنيفات المدونة والمقالات في كل منها.',
    nf: 'غير موجودة', nfText: 'هذه الصفحة غير موجودة أو انتقلت إلى مكان آخر.',
    legendTitle: 'كيف تُقرأ الأنماط', legend: 'لكل تصنيف نمطه؛ وكلما طال المقال زادت كثافة نمطه.',
    nfKicker: 'خطأ 404 · الصفحة غير موجودة', nfTitle: 'تفتّتت هذه الصفحة إلى نقاط.',
    nfLead: 'لا يوجد شيء في', nfLead2: '. ربما كُتب الرابط خطأً أو انتقلت الصفحة إلى مكان آخر.',
    nfHint: 'المس للمسح', nfHintFine: 'انقر للمسح',
    nfSearch: 'ابحث في المدونة والمشاريع', nfPlaceholder: 'Margaret Hamilton، الكرنفال، الذكاء الاصطناعي…',
    nfMaybe: 'هل كنت تبحث عن هذا؟', nfResults: (n) => arResults(n), nfNone: 'لا شيء هنا. جرّب كلمة أخرى.',
    nfWays: 'أو ابدأ من هنا', nfHome: 'الرئيسية', nfLatest: 'آخر ما في المدونة', project: 'مشروع', post: 'مقال',
    onlyEs: 'هذا المقال متوفر بالإسبانية فقط.', listNote: 'المقالات مترجمة آليًا عن أصلها الإسباني.',
    autoNote: 'كُتب هذا المقال في الأصل بالإسبانية. هذه الترجمة آلية وقد تحتوي على أخطاء.', autoLink: 'اقرأ النسخة الأصلية بالإسبانية', watch: 'شاهد الفيديو', code: 'شاهد الشيفرة', play: 'تشغيل الفيديو',
    projects: 'المشاريع', allProjects: 'كل المشاريع', projPage: 'الصفحة الكاملة',
    projDeck: 'مختارات مما نشرته على GitHub: أنظمة تصميم وأدوات وتجارب مع الذكاء الاصطناعي وكرنفال قادس.',
    projCount: (n, a, b) => `${arProjects(n)} · ${a}–${b}`, projCountOne: (n) => arProjects(n),
    allTech: 'الكل', techLabel: 'التقنية', year: 'السنة', demo: 'شاهد العرض', repo: 'شاهد الشيفرة', shot: (n) => `لقطة شاشة لـ ${n}`, moreProjects: 'مشاريع أخرى',
    newTab: '(يُفتح في تبويب جديد)', projLegendTitle: 'كيف تُقرأ الكتل',
    projLegend: 'كلما كان المشروع أحدث زادت كثافة نمطه؛ ورمز الكانجي الخاص به مرسوم فيه.'
  }
}

/** @param {'es' | 'en' | 'ar'} lang */
export const blogStrings = (lang) => strings[lang];
/** The arrows that say back and forward turn over where the text runs right to left. */
export const arrows = (/** @type {'es' | 'en' | 'ar'} */ lang) => (lang === 'ar' ? { prev: '→', next: '←' } : { prev: '←', next: '→' });
