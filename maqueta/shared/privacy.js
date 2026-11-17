// Trama · the privacy page (/maqueta/privacidad/), in Spanish, English and Arabic.
// Short and in the same plain language as the cookie policy. It says only what
// the site really does: no sign-up, forms, comments, newsletter, adverts or
// analytics; the host sees the visit like any server; Google only after the
// «yes» to YouTube. Draft from .claude/informe-legal-maqueta.md §6.2. Same
// blocks as shared/cookies-policy.js.
//
// ⟦…⟧ marks something only the owner knows (contact address; the host's name once
// it is chosen, plan D2): do not publish with it.
import { lang } from './content.js';

export const UPDATED = '2026-11-16';

export const PRIVACY = {
  es: {
    title: 'Privacidad',
    deck: 'Qué datos tuyos pasan por esta web, quién los ve y cómo pedir que se borren.',
    read: 'Se lee en 2 minutos',
    updated: 'Actualizada el',
    blocks: [
      { h: 'Quién soy' },
      { p: 'Soy Nando Muñoz, una persona que tiene esta web como blog y portafolio personal. Yo decido qué se hace con tus datos aquí. Escríbeme a ⟦correo de contacto⟧ para cualquier cosa de privacidad.' },
      { h: 'Lo que NO pido' },
      { p: 'Esta web no tiene registro, ni formularios, ni comentarios, ni boletín, ni publicidad, ni estadísticas de visitas. No te pido ningún dato.' },
      { h: 'Lo que pasa cuando entras' },
      { p: 'Para que una página llegue a tu pantalla, tu navegador la pide al servicio donde está alojada la web. En esa petición van tu dirección IP (la de tu conexión), tu navegador y la página que pides. El servicio guarda un registro técnico para protegerse de ataques. Lo hace el servicio por sí mismo; yo no veo esos registros ni los uso. Su base legal es el interés del servicio en su seguridad (RGPD, art. 6.1.f).' },
      { h: 'Vídeos de YouTube' },
      { p: 'Solo si pulsas «Aceptar y ver aquí». Entonces tu navegador se conecta con Google (YouTube), que recibe tu IP y puede guardar cookies. En esa parte Google y yo decidimos juntos cómo se carga el vídeo: yo elijo ponerlo y Google decide qué hace con tus datos. La base legal es tu consentimiento (art. 6.1.a), y puedes retirarlo cuando quieras. Hay más datos en la <a href="{cookies}">política de cookies</a>.' },
      { h: 'Si sales en una foto o en un tuit' },
      { p: 'Algunos artículos enseñan fotos de agrupaciones del Carnaval o tuits de otras personas, con su nombre. Si sales y quieres que lo quite, escríbeme a ⟦correo de contacto⟧.' },
      { h: 'Si me escribes' },
      { p: 'Si me escribes por correo o por una red social, uso tu nombre, tu dirección y lo que me cuentes solo para contestarte, y lo borro cuando la conversación termina, salvo que una ley me obligue a guardarlo. La base legal es mi interés legítimo en contestar a quien me escribe (RGPD, art. 6.1.f).' },
      { h: 'Con quién se comparten' },
      { p: 'Con nadie más que el servicio donde está la web, y con Google solo si aceptas los vídeos. Con una autoridad, si la ley lo exige.' },
      { h: 'Tus derechos' },
      { p: 'Puedes pedirme que te diga qué datos tengo de ti, que los corrija, que los borre, que deje de usarlos o que te los dé para llevarlos a otro sitio. Te contesto en menos de un mes. Si crees que no he respetado tus derechos, puedes reclamar ante la <a href="https://www.aepd.es/">Agencia Española de Protección de Datos</a>.' },
      { h: 'Cambios' },
      { p: 'Si cambio algo, lo verás en la fecha de arriba.' }
    ]
  },
  en: {
    title: 'Privacy',
    deck: 'What data of yours passes through this site, who sees it and how to ask for it to be deleted.',
    read: 'A 2-minute read',
    updated: 'Updated on',
    blocks: [
      { h: 'Who I am' },
      { p: 'I am Nando Muñoz, a person who runs this site as a personal blog and portfolio. I decide what is done with your data here. Write to ⟦contact email⟧ about anything privacy-related.' },
      { h: 'What I do NOT ask' },
      { p: 'This site has no sign-up, no forms, no comments, no newsletter, no advertising and no visit statistics. I do not ask you for any data.' },
      { h: 'What happens when you visit' },
      { p: 'For a page to reach your screen, your browser asks it from the service that hosts the site. That request carries your IP address (your connection’s), your browser and the page you ask for. The service keeps a technical record to protect itself from attacks. The service does this on its own; I do not see or use those records. Its legal basis is the service’s interest in its own security (GDPR, art. 6.1.f).' },
      { h: 'YouTube videos' },
      { p: 'Only if you press “Accept and watch here”. Then your browser connects to Google (YouTube), which receives your IP and may keep cookies. For that part Google and I decide together how the video is loaded: I choose to put it there and Google decides what it does with your data. The legal basis is your consent (art. 6.1.a), and you can take it back whenever you like. There is more in the <a href="{cookies}">cookie policy</a>.' },
      { h: 'If you appear in a photo or a tweet' },
      { p: 'Some posts show photos of Carnival groups or other people’s tweets, with their names. If you appear and want me to remove it, write to ⟦contact email⟧.' },
      { h: 'If you write to me' },
      { p: 'If you write to me by email or on a social network, I use your name, your address and what you tell me only to answer you, and I delete it when the conversation ends, unless a law makes me keep it. The legal basis is my legitimate interest in answering whoever writes to me (GDPR, art. 6.1.f).' },
      { h: 'Who it is shared with' },
      { p: 'Nobody but the service where the site is hosted, and Google only if you accept videos. With an authority, if the law requires it.' },
      { h: 'Your rights' },
      { p: 'You can ask me what data I hold about you, to correct it, to delete it, to stop using it or to give it to you to take elsewhere. I answer in under a month. If you think I have not respected your rights, you can complain to the Spanish data protection authority, the <a href="https://www.aepd.es/en">AEPD</a>.' },
      { h: 'Changes' },
      { p: 'If I change something, you will see it in the date above.' }
    ]
  },
  ar: {
    title: 'الخصوصية',
    deck: 'ما البيانات الخاصة بك التي تمرّ عبر هذا الموقع، ومن يراها، وكيف تطلب حذفها.',
    read: 'قراءة في دقيقتين',
    updated: 'آخر تحديث في',
    blocks: [
      { h: 'من أنا' },
      { p: 'أنا Nando Muñoz، شخص يدير هذا الموقع كمدوّنة شخصية ومعرض لأعماله. أنا من يقرّر ما يُفعل ببياناتك هنا. راسلني على ⟦عنوان البريد للتواصل⟧ في أي أمر يخصّ الخصوصية.' },
      { h: 'ما الذي لا أطلبه' },
      { p: 'ليس في هذا الموقع تسجيل، ولا نماذج، ولا تعليقات، ولا نشرة بريدية، ولا إعلانات، ولا إحصاءات للزيارات. لا أطلب منك أي بيانات.' },
      { h: 'ماذا يحدث عند زيارتك' },
      { p: 'لكي تصل الصفحة إلى شاشتك، يطلبها متصفّحك من الخدمة التي يُستضاف عليها الموقع. يحمل هذا الطلب عنوان IP الخاص بك (عنوان اتصالك بالإنترنت)، ونوع متصفّحك، والصفحة التي تطلبها. تحتفظ الخدمة بسجلّ تقني لتحمي نفسها من الهجمات. تفعل الخدمة ذلك من تلقاء نفسها؛ أنا لا أرى هذه السجلات ولا أستخدمها. الأساس القانوني لذلك هو مصلحة الخدمة في أمنها، وفق اللائحة العامة لحماية البيانات (GDPR)، المادة 6.1.f.' },
      { h: 'فيديوهات YouTube' },
      { p: 'يحدث هذا فقط عند الضغط على «قبول والمشاهدة هنا». عندها يتصل متصفّحك بشركة Google (YouTube)، وهي تتلقّى عنوان IP الخاص بك وقد تحفظ ملفات تعريف الارتباط (الكوكيز). في هذا الجزء أقرّر أنا و Google معًا كيف يُحمَّل الفيديو: أنا أختار وضعه هنا، و Google تقرّر ماذا تفعل ببياناتك. الأساس القانوني هو موافقتك (المادة 6.1.a)، ويمكنك سحبها متى شئت. تجد المزيد في <a href="{cookies}">سياسة ملفات تعريف الارتباط</a>.' },
      { h: 'عند ظهورك في صورة أو تغريدة' },
      { p: 'تعرض بعض المقالات صورًا لفرق الكرنفال أو تغريدات لأشخاص آخرين، مع أسمائهم. إذا ظهرت فيها وتريد أن أحذفها، راسلني على ⟦عنوان البريد للتواصل⟧.' },
      { h: 'عند مراسلتي' },
      { p: 'إذا راسلتني بالبريد الإلكتروني أو عبر شبكة اجتماعية، أستخدم اسمك وعنوانك وما تخبرني به فقط للرد عليك، وأحذفه عند انتهاء المحادثة، إلا إذا ألزمني القانون بالاحتفاظ به. الأساس القانوني هو مصلحتي المشروعة في الرد على من يراسلني، وفق اللائحة العامة لحماية البيانات (GDPR)، المادة 6.1.f.' },
      { h: 'مع من تُشارَك البيانات' },
      { p: 'لا تُشارَك مع أحد غير الخدمة التي يُستضاف عليها الموقع، ومع Google فقط إذا وافقت على عرض الفيديوهات. وتُشارَك مع جهة رسمية إذا أوجب القانون ذلك.' },
      { h: 'حقوقك' },
      { p: 'يمكنك أن تطلب مني أن أخبرك بالبيانات التي أحتفظ بها عنك، أو أن أصحّحها، أو أن أحذفها، أو أن أتوقف عن استخدامها، أو أن أعطيك نسخة منها لتنقلها إلى مكان آخر. أردّ عليك في أقل من شهر. إذا رأيت أنني لم أحترم حقوقك، يمكنك تقديم شكوى إلى <a href="https://www.aepd.es/en">الوكالة الإسبانية لحماية البيانات (AEPD)</a>.' },
      { h: 'التغييرات' },
      { p: 'إذا غيّرت شيئًا، فسترى ذلك في التاريخ أعلاه.' }
    ]
  }
}[lang];
