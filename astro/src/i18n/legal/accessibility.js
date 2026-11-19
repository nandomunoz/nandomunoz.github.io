// The accessibility statement (plan Phase 10), in Spanish, English and Arabic. It says what was really checked and what was not:
// a self-assessment, not an external audit. When something is checked (a screen reader, Safari), change it here and the date.
// Same blocks as the other legal pages (credits.js).
//
// Contact address: hola@soynando.com (owner, 2026-11-18). ⟦…⟧ would mark anything else only the owner knows: do not publish with it.
export const UPDATED = '2026-11-18';

export const ACCESSIBILITY = {
  es: {
    title: 'Accesibilidad',
    deck: 'Cómo de accesible es esta web, cómo lo he comprobado y qué falta por comprobar.',
    updated: 'Actualizada el',
    blocks: [
      { h: 'Estado' },
      { p: 'Esta web apunta al nivel AA de las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2. Cumple <strong>parcialmente</strong>: lo que he podido comprobar sale bien, y lo que falta por comprobar está abajo, sin esconderlo.' },
      { h: 'Lo que he comprobado' },
      { ul: [
        'Pruebas automáticas (axe-core) en todos los tipos de página, a 375 y a 1280 píxeles, en los tres idiomas y en los tres modos de color (claro, oscuro y alto contraste): sin fallos graves.',
        'Teclado: se puede llegar a todo con Tab, el foco se ve y el menú o la tarjeta de cookies no lo tapan.',
        'Sin JavaScript, todas las páginas se leen y sus enlaces funcionan.',
        'Zoom y ventanas estrechas hasta 320 píxeles, sin scroll horizontal; el espaciado de texto que cada persona elija no recorta nada.',
        'Colores forzados del sistema y «reducir movimiento».',
        'Navegadores: Chromium y Firefox.'
      ] },
      { h: 'Lo que todavía no he comprobado' },
      { ul: [
        'Con lectores de pantalla (NVDA, VoiceOver, TalkBack). Las pruebas automáticas solo encuentran una parte de los problemas: falta oír cómo suena de verdad.',
        'En Safari.',
        'En un móvil de gama baja: la lluvia de la portada podría ir justa.'
      ] },
      { h: 'Limitaciones que conozco' },
      { ul: [
        'La portada y los títulos hechos de puntos se mueven un momento y se quedan quietos; con «reducir movimiento» no se mueven nada. Los puntos son decoración: los lectores de pantalla leen el texto de siempre.',
        'Los artículos en inglés y en árabe están traducidos por máquina, y cada uno lo avisa. Las letras de Carnaval y los tuits que se quedan en español llevan marcado su idioma.',
        'Algunas imágenes dentro de artículos antiguos todavía no tienen descripción.'
      ] },
      { h: 'Cómo lo he evaluado' },
      { p: 'Es una evaluación mía, no una auditoría externa.' },
      { h: 'Si algo no te funciona' },
      { p: 'Escríbeme a <a href="mailto:hola@soynando.com" dir="ltr">hola@soynando.com</a> y cuéntame qué página, qué dispositivo y qué ayuda usas. Te contesto en menos de un mes y lo corrijo.' }
    ]
  },
  en: {
    title: 'Accessibility',
    deck: 'How accessible this site is, how I have checked it and what is still to check.',
    updated: 'Updated on',
    blocks: [
      { h: 'Status' },
      { p: 'This site aims for level AA of the Web Content Accessibility Guidelines (WCAG) 2.2. It conforms <strong>partially</strong>: what I have been able to check comes out well, and what is still to check is listed below, not hidden.' },
      { h: 'What I have checked' },
      { ul: [
        'Automated tests (axe-core) on every type of page, at 375 and 1280 pixels, in the three languages and the three colour modes (light, dark and high contrast): no serious failures.',
        'Keyboard: everything can be reached with Tab, the focus is visible and neither the menu nor the cookie card covers it.',
        'Without JavaScript every page reads and its links work.',
        'Zoom and narrow windows down to 320 pixels, with no sideways scrolling; the text spacing each person chooses cuts nothing off.',
        'The system’s forced colours and “reduce motion”.',
        'Browsers: Chromium and Firefox.'
      ] },
      { h: 'What I have not checked yet' },
      { ul: [
        'With screen readers (NVDA, VoiceOver, TalkBack). Automated tests only find part of the problems: how it really sounds is still to hear.',
        'In Safari.',
        'On a low-end phone: the cover’s rain may run tight.'
      ] },
      { h: 'Limitations I know of' },
      { ul: [
        'The cover and the titles made of dots move for a moment and then stay still; with “reduce motion” they do not move at all. The dots are decoration: screen readers read the usual text.',
        'The posts in English and Arabic are machine-translated, and each says so. The Carnival lyrics and tweets that stay in Spanish are marked with their language.',
        'Some images inside older posts have no description yet.'
      ] },
      { h: 'How I assessed it' },
      { p: 'It is my own assessment, not an external audit.' },
      { h: 'If something does not work for you' },
      { p: 'Write to <a href="mailto:hola@soynando.com" dir="ltr">hola@soynando.com</a> and tell me which page, which device and which assistive technology you use. I answer in less than a month and fix it.' }
    ]
  },
  ar: {
    title: 'إمكانية الوصول',
    deck: 'ما مدى سهولة الوصول إلى هذا الموقع، وكيف فحصته، وما الذي لم يُفحص بعد.',
    updated: 'حُدِّث في',
    blocks: [
      { h: 'الحالة' },
      { p: 'يسعى هذا الموقع إلى المستوى AA من إرشادات إمكانية الوصول إلى محتوى الويب (WCAG) 2.2. وهو مطابق <strong>جزئيًا</strong>: ما استطعت فحصه ظهر سليمًا، وما لم يُفحص بعد مذكور أدناه دون إخفاء.' },
      { h: 'ما فحصته' },
      { ul: [
        'اختبارات آلية (axe-core) على كل أنواع الصفحات، بعرض 375 و1280 بكسل، وبالعربية والإسبانية والإنجليزية وفي أنماط الألوان الثلاثة (فاتح وداكن وتباين عالٍ): لا أخطاء جسيمة.',
        'لوحة المفاتيح: يمكن الوصول إلى كل شيء بزر Tab، والتركيز ظاهر، ولا تغطيه القائمة ولا بطاقة الكوكيز.',
        'دون JavaScript تُقرأ كل صفحة وتعمل روابطها.',
        'التكبير والنوافذ الضيقة حتى 320 بكسل دون تمرير أفقي؛ وتباعد النص الذي يختاره كل شخص لا يقطع شيئًا.',
        'ألوان النظام القسرية و«تقليل الحركة».',
        'المتصفحات: Chromium وFirefox.'
      ] },
      { h: 'ما لم أفحصه بعد' },
      { ul: [
        'بقارئات الشاشة (NVDA وVoiceOver وTalkBack). الاختبارات الآلية لا تكشف إلا جزءًا من المشكلات: ما زال عليّ أن أسمع كيف يبدو فعلًا.',
        'في Safari.',
        'على هاتف متواضع: قد يكون مطر الغلاف ثقيلًا عليه.'
      ] },
      { h: 'قيود أعرفها' },
      { ul: [
        'الغلاف والعناوين المصنوعة من نقاط تتحرك لحظة ثم تثبت؛ ومع «تقليل الحركة» لا تتحرك أبدًا. النقاط زخرفة: قارئات الشاشة تقرأ النص المعتاد.',
        'المقالات بالإنجليزية والعربية مترجمة آليًا، وكل مقال ينبّه إلى ذلك. وكلمات أغاني الكرنفال والتغريدات التي تبقى بالإسبانية موسومة بلغتها.',
        'بعض الصور داخل المقالات القديمة ليس لها وصف بعد.'
      ] },
      { h: 'كيف قيّمته' },
      { p: 'هذا تقييم مني، وليس تدقيقًا خارجيًا.' },
      { h: 'إن لم يعمل لك شيء' },
      { p: 'اكتب لي على <a href="mailto:hola@soynando.com" dir="ltr">hola@soynando.com</a> وأخبرني بالصفحة والجهاز والتقنية المساعدة التي تستخدمها. أجيبك في أقل من شهر وأصلحه.' }
    ]
  }
};
