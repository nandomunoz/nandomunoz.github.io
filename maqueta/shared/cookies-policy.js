// Trama · the cookie policy (/maqueta/cookies/), in Spanish, English and Arabic.
// Written so that a twelve-year-old and a seventy-year-old both follow it:
// short sentences, one idea each, no legal or technical words without
// saying what they mean. It tells only what the site really does (see
// shared/consent.js): no cookies of its own, one note in the browser with the
// choice about YouTube (180 days), another with the colour mode (only if the
// button is pressed), YouTube only when allowed. It promises nothing the code
// does not do: the stored policy version is NOT compared, so it must not say
// the visitor will be asked again when this changes (plan, K2). When the site
// changes, change this and the date.
//
// Blocks: { h } a heading · { p } a paragraph (inline HTML: links, strong; {privacy}
//         and {cookies} become the pages' urls) · { ul: [] } a list (inline HTML)
//         · { glance: [[label, value]] } · { now: true } the visitor's current choice
//         and the button that opens the settings · { table: { label, head, rows } }
//
// ⟦…⟧ marks something only the owner knows (the contact address): do not publish with it.
import { lang } from './content.js';

export const UPDATED = '2026-11-16';

export const POLICY = {
  es: {
    title: 'Política de cookies',
    deck: 'Qué guarda esta web en tu ordenador o en tu móvil, explicado sin letra pequeña.',
    read: 'Se lee en 3 minutos',
    updated: 'Actualizada el',
    blocks: [
      { glance: [
        ['Cookies de esta web', 'Ninguna'],
        ['Publicidad', 'Ninguna'],
        ['Contar visitas o seguirte', 'No'],
        ['Vídeos de YouTube', 'Solo si tú dices que sí'],
        ['Lo que se guarda', 'Tu respuesta sobre YouTube y, si lo pulsas, el modo de color que elijas']
      ] },
      { now: true },

      { h: '¿Qué es una cookie?' },
      { p: 'Una cookie es una notita que una página web deja guardada en tu navegador, el programa con el que ves internet (Chrome, Safari, Firefox…).' },
      { p: 'Sirve para que la web se acuerde de algo la próxima vez que vuelvas. Por ejemplo, de que ya has iniciado sesión. También puede servir para saber por qué páginas te mueves, y eso a veces se usa para enseñarte anuncios.' },

      { h: '¿Esta web usa cookies?' },
      { p: '<strong>No. Esta web no pone ninguna cookie suya.</strong> No hay anuncios, y la web no cuenta tus visitas ni apunta lo que haces.' },
      { p: 'Las tipografías (los tipos de letra) que ves están guardadas en esta misma web, así que tampoco hace falta pedírselas a Google ni a nadie.' },

      { h: 'Lo único que se guarda: tus elecciones' },
      { p: 'Cuando eliges si los vídeos de YouTube pueden verse aquí (en el aviso de cookies o en un vídeo), tu navegador guarda <strong>una nota</strong> con lo que has elegido y el día en que lo hiciste. Así no te vuelvo a preguntar cada vez que entras.' },
      { ul: [
        'Se queda en tu aparato. No se envía a ningún sitio.',
        'Dura 180 días (unos seis meses). Después te lo vuelvo a preguntar.'
      ] },
      { p: 'Si pulsas el botón de color (el círculo de abajo a la derecha) para cambiar entre oscuro, claro y contraste alto, tu navegador guarda <strong>otra nota</strong> con el modo que has elegido, para ponértelo igual la próxima vez. Solo se guarda si lo pulsas. Se queda en tu aparato hasta que borres los datos de esta web.' },
      { p: 'Estas notas son parecidas a una cookie, pero no viajan por internet. La primera la necesita la propia web para acordarse de tu respuesta, y la segunda la has pedido tú al pulsar el botón. Por eso no te pido permiso para guardarlas.' },
      { table: { label: 'Lo que guarda esta web en tu navegador', head: ['Nombre', 'Quién la guarda', 'Para qué', 'Cuánto dura'], rows: [
        ['<code>luz-consent</code>', 'Esta web, en tu navegador', 'Recordar tu respuesta sobre YouTube', '180 días'],
        ['<code>luz-theme</code>', 'Esta web, en tu navegador', 'Recordar el modo de color que elijas', 'Hasta que borres los datos de la web. Solo existe si pulsas el botón de color']
      ] } },

      { h: 'Los vídeos de YouTube' },
      { p: 'Algunos artículos tienen vídeos de YouTube. YouTube es de Google, y Google sí puede guardar sus propias cookies cuando ves un vídeo.' },
      { p: 'Por eso, <strong>mientras no digas que sí, la web no le pide nada a YouTube</strong>: ni el vídeo, ni la foto pequeña que lo anuncia. En su lugar verás un aviso con dos botones:' },
      { ul: [
        '<strong>Aceptar y ver aquí</strong>: el vídeo se ve dentro del artículo. Uso el «modo de privacidad mejorada» de YouTube (youtube-nocookie.com), que guarda menos cosas.',
        '<strong>Ver en YouTube</strong>: el vídeo se abre en la página de YouTube, en otra pestaña. Allí mandan las normas de YouTube.'
      ] },
      { p: '<strong>Quién:</strong> YouTube es un servicio de Google. En Europa lo presta Google Ireland Limited (Irlanda); sus datos pueden pasar también a Google LLC, en Estados Unidos.' },
      { p: '<strong>Para qué:</strong> para que el vídeo se vea dentro del artículo.' },
      { p: '<strong>Qué recibe Google:</strong> en cuanto el vídeo se carga, tu dirección IP y datos de tu navegador. Además puede guardar cookies o notas en tu aparato mientras lo ves. No sé de antemano cuáles ni por cuánto tiempo, porque eso lo decide Google.' },
      { p: '<strong>Cuánto dura tu «sí»:</strong> 180 días, para <strong>todos</strong> los vídeos de esta web. Puedes quitarlo cuando quieras con el botón «Ajustes de cookies», abajo del todo, o con el de esta página. Las cookies que YouTube haya dejado ya las borras tú desde tu navegador.' },
      { p: 'Si dices que sí, la foto pequeña de cada vídeo también se pide a Google (a <code>i.ytimg.com</code>) al abrir la página, aunque no pulses para ver el vídeo.' },
      { p: 'Lo que hace Google con esos datos lo cuenta en su <a href="https://policies.google.com/privacy?hl=es">política de privacidad</a>.' },

      { h: 'Otras cosas de fuera' },
      { ul: [
        'Los tuits se enseñan como una tarjeta hecha aquí. No se carga nada de X (Twitter).',
        'Los enlaces a otras webs solo te llevan allí si pulsas. Cada web tiene sus propias normas.',
        'El servicio donde está esta web guarda un registro técnico de cada visita, con la dirección de tu conexión (la IP), para protegerse de ataques y de abusos. Ese registro lo guarda el servicio, no yo. No son cookies.'
      ] },

      { h: 'Cómo cambiar de opinión' },
      { p: 'Puedes cambiar tu respuesta cuando quieras con el botón <strong>Ajustes de cookies</strong>, que está abajo del todo, en <strong>Sobre esta web</strong>, en el pie de cada página. O con el botón de esta página.' },

      { h: 'Cómo borrar lo que se ha guardado' },
      { p: 'Tu navegador te deja borrar las cookies y las notas de cualquier web. Suele estar en <strong>Ajustes → Privacidad</strong>, en una opción que se llama algo como «Borrar datos de navegación».' },
      { p: 'Si navegas en modo privado (o «incógnito»), todo se borra solo al cerrar la ventana.' },

      { h: '¿Quién es el responsable?' },
      { p: 'Esta web es de Nando Muñoz, que la escribe y la mantiene. Para cualquier duda sobre cookies o datos, escríbeme a ⟦correo de contacto⟧. Aquí tienes también la <a href="{privacy}">política de privacidad</a>.' },
      { p: 'Si crees que no se respetan tus datos, también puedes acudir a la <a href="https://www.aepd.es/">Agencia Española de Protección de Datos</a>.' }
    ],
    now: {
      title: 'Tu elección ahora',
      none: 'Todavía no has elegido. Mientras tanto, los vídeos de YouTube no se cargan.',
      yes: 'Has aceptado los vídeos de YouTube.',
      no: 'Has rechazado los vídeos de YouTube. Se ven en la página de YouTube, no aquí.',
      since: 'Desde el',
      change: 'Cambiar mi elección'
    }
  },
  en: {
    title: 'Cookie policy',
    deck: 'What this site keeps on your computer or phone, explained with no small print.',
    read: 'A 3-minute read',
    updated: 'Updated on',
    blocks: [
      { glance: [
        ['Cookies from this site', 'None'],
        ['Advertising', 'None'],
        ['Counting visits or following you', 'No'],
        ['YouTube videos', 'Only if you say yes'],
        ['What is stored', 'Your answer about YouTube and, if you press it, the colour mode you pick']
      ] },
      { now: true },

      { h: 'What is a cookie?' },
      { p: 'A cookie is a little note that a website leaves in your browser, the program you use to see the internet (Chrome, Safari, Firefox…).' },
      { p: 'It lets the website remember something next time you come back. For example, that you are already signed in. It can also be used to know which pages you visit, and that is sometimes used to show you adverts.' },

      { h: 'Does this site use cookies?' },
      { p: '<strong>No. This site sets no cookies of its own.</strong> There are no adverts, and the site does not count your visits or write down what you do.' },
      { p: 'The typefaces (fonts) you see are kept on this same site, so there is no need to ask Google or anyone else for them either.' },

      { h: 'The only things kept: your choices' },
      { p: 'When you choose whether YouTube videos may play here (in the cookie notice or in a video), your browser keeps <strong>one note</strong> with what you chose and the day you did it. That way I do not ask you again every time you come in.' },
      { ul: [
        'It stays on your device. It is not sent anywhere.',
        'It lasts 180 days (about six months). After that I ask you again.'
      ] },
      { p: 'If you press the colour button (the circle at the bottom right) to switch between dark, light and high contrast, your browser keeps <strong>another note</strong> with the mode you picked, so it can show it the same way next time. It is only kept if you press it. It stays on your device until you delete this site’s data.' },
      { p: 'These notes are like a cookie, but they do not travel over the internet. The site itself needs the first one to remember your answer, and you asked for the second by pressing the button. That is why I do not ask your permission to keep them.' },
      { table: { label: 'What this site keeps in your browser', head: ['Name', 'Kept by', 'What for', 'How long'], rows: [
        ['<code>luz-consent</code>', 'This site, in your browser', 'To remember your answer about YouTube', '180 days'],
        ['<code>luz-theme</code>', 'This site, in your browser', 'To remember the colour mode you pick', 'Until you delete the site’s data. It only exists if you press the colour button']
      ] } },

      { h: 'YouTube videos' },
      { p: 'Some posts have YouTube videos. YouTube belongs to Google, and Google can keep its own cookies when you watch a video.' },
      { p: 'So, <strong>until you say yes, this site asks YouTube for nothing</strong>: not the video, not the small picture that shows it. Instead you will see a notice with two buttons:' },
      { ul: [
        '<strong>Accept and watch here</strong>: the video plays inside the post. I use YouTube’s “privacy-enhanced mode” (youtube-nocookie.com), which keeps less.',
        '<strong>Watch on YouTube</strong>: the video opens on YouTube’s own page, in another tab. There, YouTube’s rules apply.'
      ] },
      { p: '<strong>Who:</strong> YouTube is a Google service. In Europe it is run by Google Ireland Limited (Ireland); your data can also go to Google LLC, in the United States.' },
      { p: '<strong>What for:</strong> so the video plays inside the post.' },
      { p: '<strong>What Google gets:</strong> as soon as the video loads, your IP address and details of your browser. It can also keep cookies or notes on your device while you watch. I do not know in advance which or for how long, because Google decides that.' },
      { p: '<strong>How long your “yes” lasts:</strong> 180 days, for <strong>all</strong> the videos on this site. You can take it back any time with the “Cookie settings” button at the very bottom, or with the one on this page. The cookies YouTube has already left, you delete yourself from your browser.' },
      { p: 'If you say yes, the small picture of each video is also requested from Google (from <code>i.ytimg.com</code>) when the page opens, even if you do not press to watch the video.' },
      { p: 'What Google does with that data is explained in its <a href="https://policies.google.com/privacy?hl=en">privacy policy</a>.' },

      { h: 'Other things from outside' },
      { ul: [
        'Tweets are shown as a card made here. Nothing is loaded from X (Twitter).',
        'Links to other websites only take you there if you press them. Each website has its own rules.',
        'The service where this site is hosted keeps a technical record of every visit, including your connection’s address (the IP), to protect itself from attacks and abuse. The service keeps that record, not me. These are not cookies.'
      ] },

      { h: 'How to change your mind' },
      { p: 'You can change your answer whenever you like with the <strong>Cookie settings</strong> button, at the very bottom, under <strong>About this site</strong>, in the footer of every page. Or with the button on this page.' },

      { h: 'How to delete what was kept' },
      { p: 'Your browser lets you delete the cookies and notes of any website. It is usually under <strong>Settings → Privacy</strong>, in an option called something like “Clear browsing data”.' },
      { p: 'If you browse in private (or “incognito”) mode, everything is deleted by itself when you close the window.' },

      { h: 'Who is responsible?' },
      { p: 'This site belongs to Nando Muñoz, who writes and looks after it. For any question about cookies or data, write to ⟦contact email⟧. You can also read the <a href="{privacy}">privacy policy</a>.' },
      { p: 'If you think your data is not being respected, you can also go to the Spanish data protection authority, the <a href="https://www.aepd.es/en">AEPD</a>.' }
    ],
    now: {
      title: 'Your choice now',
      none: 'You have not chosen yet. Meanwhile, YouTube videos do not load.',
      yes: 'You have accepted YouTube videos.',
      no: 'You have rejected YouTube videos. They play on YouTube’s own page, not here.',
      since: 'Since',
      change: 'Change my choice'
    }
  },
  ar: {
    title: 'سياسة الكوكيز',
    deck: 'ما الذي يحفظه هذا الموقع على حاسوبك أو هاتفك، مشروحًا دون خط صغير.',
    read: 'قراءتها تستغرق 3 دقائق',
    updated: 'حُدِّثت في',
    blocks: [
      { glance: [
        ['كوكيز هذا الموقع', 'لا توجد'],
        ['الإعلانات', 'لا توجد'],
        ['عدّ الزيارات أو تتبّعك', 'لا'],
        ['فيديوهات YouTube', 'فقط إذا وافقت'],
        ['ما يُحفظ', 'اختيارك بخصوص YouTube، ووضع الألوان الذي تختاره إن ضغطت على زرّه']
      ] },
      { now: true },

      { h: 'ما هي الكوكيز؟' },
      { p: 'الكوكيز (ملفات تعريف الارتباط) ملاحظة صغيرة يتركها موقع إلكتروني في متصفحك. المتصفح هو البرنامج الذي تتصفح به الإنترنت (Chrome و Safari و Firefox…).' },
      { p: 'تساعد الموقع على تذكّر شيء ما عند عودتك في المرة القادمة، مثل أنك سجّلت الدخول من قبل. وقد تُستخدم أيضًا لمعرفة الصفحات التي تزورها، وهذا يُستخدم أحيانًا لعرض إعلانات عليك.' },

      { h: 'هل يستخدم هذا الموقع الكوكيز؟' },
      { p: '<strong>لا. هذا الموقع لا يضع أي كوكيز خاصة به.</strong> لا توجد إعلانات، والموقع لا يعدّ زياراتك ولا يسجّل ما تفعله.' },
      { p: 'الخطوط (أشكال الحروف) التي تراها محفوظة في هذا الموقع نفسه، فلا حاجة إلى طلبها من Google ولا من أي جهة أخرى.' },

      { h: 'الشيء الوحيد الذي يُحفظ: اختياراتك' },
      { p: 'عندما تختار هل يمكن تشغيل فيديوهات YouTube هنا (في إشعار الكوكيز أو عند أحد الفيديوهات)، يحفظ متصفحك <strong>ملاحظة واحدة</strong> فيها ما اخترته واليوم الذي اخترته فيه. بهذا لا أسألك من جديد في كل مرة تدخل فيها.' },
      { ul: [
        'تبقى على جهازك. ولا تُرسل إلى أي مكان.',
        'تستمر 180 يومًا (نحو ستة أشهر). بعد ذلك أسألك من جديد.'
      ] },
      { p: 'إذا ضغطت على زر الألوان (الدائرة أسفل اليمين) للتبديل بين الداكن والفاتح والتباين العالي، يحفظ متصفحك <strong>ملاحظة أخرى</strong> فيها الوضع الذي اخترته، ليعرضه بالطريقة نفسها في المرة القادمة. لا تُحفظ إلا إذا ضغطت على الزر. وتبقى على جهازك إلى أن تحذف بيانات هذا الموقع.' },
      { p: 'هذه الملاحظات تشبه الكوكيز، لكنها لا تنتقل عبر الإنترنت. الموقع نفسه يحتاج إلى الأولى ليتذكّر إجابتك، والثانية طلبتها أنت بالضغط على الزر. لهذا لا أطلب إذنك لحفظهما.' },
      { table: { label: 'ما يحفظه هذا الموقع في متصفحك', head: ['الاسم', 'من يحفظها', 'لماذا', 'كم تدوم'], rows: [
        ['<code>luz-consent</code>', 'هذا الموقع، في متصفحك', 'لتذكّر إجابتك بخصوص YouTube', '180 يومًا'],
        ['<code>luz-theme</code>', 'هذا الموقع، في متصفحك', 'لتذكّر وضع الألوان الذي تختاره', 'إلى أن تحذف بيانات الموقع. لا توجد إلا إذا ضغطت على زر الألوان']
      ] } },

      { h: 'فيديوهات YouTube' },
      { p: 'في بعض المقالات فيديوهات من YouTube. YouTube تابع لـ Google، وقد تحفظ Google كوكيز خاصة بها عندما تشاهد فيديو.' },
      { p: 'لذلك، <strong>ما لم توافق، لا يطلب هذا الموقع أي شيء من YouTube</strong>: لا الفيديو، ولا الصورة الصغيرة التي تعرضه. وبدلًا من ذلك سترى إشعارًا فيه زرّان:' },
      { ul: [
        '<strong>قبول والمشاهدة هنا</strong>: يُشغَّل الفيديو داخل المقال. أستخدم «وضع الخصوصية المحسّن» من YouTube (youtube-nocookie.com)، وهو يحفظ أقل.',
        '<strong>المشاهدة على YouTube</strong>: يُفتح الفيديو في صفحة YouTube نفسها، في تبويب آخر. وهناك تسري قواعد YouTube.'
      ] },
      { p: '<strong>من:</strong> YouTube خدمة من Google. في أوروبا تقدّمها Google Ireland Limited (أيرلندا)، وقد تنتقل بياناتك أيضًا إلى Google LLC في الولايات المتحدة.' },
      { p: '<strong>لماذا:</strong> ليُشغَّل الفيديو داخل المقال.' },
      { p: '<strong>ماذا تتلقى Google:</strong> بمجرد تحميل الفيديو، عنوان IP الخاص بك ومعلومات عن متصفحك. وقد تحفظ أيضًا كوكيز أو ملاحظات على جهازك أثناء المشاهدة. لا أعرف مسبقًا أيّها ولا كم تدوم، لأن Google هي التي تقرر ذلك.' },
      { p: '<strong>كم تدوم موافقتك:</strong> 180 يومًا، وتشمل <strong>كل</strong> الفيديوهات في هذا الموقع. يمكنك التراجع عنها في أي وقت بزر «إعدادات الكوكيز» في أسفل الصفحة تمامًا، أو بالزر الموجود في هذه الصفحة. أما الكوكيز التي تركتها YouTube بالفعل فتحذفها أنت من متصفحك.' },
      { p: 'إذا وافقت، تُطلب الصورة الصغيرة لكل فيديو من Google أيضًا (من <code>i.ytimg.com</code>) عند فتح الصفحة، حتى لو لم تضغط لمشاهدة الفيديو.' },
      { p: 'ما تفعله Google بهذه البيانات موضّح في <a href="https://policies.google.com/privacy?hl=ar">سياسة الخصوصية</a> الخاصة بها.' },

      { h: 'أشياء أخرى من الخارج' },
      { ul: [
        'التغريدات تُعرض على شكل بطاقة مصنوعة هنا. ولا يُحمَّل أي شيء من X (Twitter).',
        'الروابط إلى مواقع أخرى لا تنقلك إليها إلا إذا ضغطت عليها. ولكل موقع قواعده الخاصة.',
        'الخدمة التي يُستضاف عليها هذا الموقع تحتفظ بسجلّ تقني لكل زيارة، يتضمن عنوان اتصالك (IP)، لتحمي نفسها من الهجمات وسوء الاستخدام. هذا السجل تحتفظ به الخدمة، لا أنا. وهو ليس كوكيز.'
      ] },

      { h: 'كيف تغيّر رأيك' },
      { p: 'يمكنك تغيير إجابتك متى شئت بالزر <strong>إعدادات الكوكيز</strong>، في أسفل الصفحة تمامًا، تحت <strong>عن هذا الموقع</strong>، في تذييل كل صفحة. أو بالزر الموجود في هذه الصفحة.' },

      { h: 'كيف تحذف ما حُفظ' },
      { p: 'يتيح لك متصفحك حذف الكوكيز والملاحظات الخاصة بأي موقع. وغالبًا تجد ذلك في <strong>الإعدادات ← الخصوصية</strong>، في خيار اسمه نحو «مسح بيانات التصفح».' },
      { p: 'إذا تصفحت في الوضع الخاص (أو «التصفح المتخفّي»)، يُحذف كل شيء تلقائيًا عند إغلاق النافذة.' },

      { h: 'من المسؤول؟' },
      { p: 'هذا الموقع يخص Nando Muñoz، وهو من يكتبه ويعتني به. لأي سؤال عن الكوكيز أو البيانات، يمكنك مراسلتي على ⟦عنوان البريد للتواصل⟧. ويمكنك أيضًا قراءة <a href="{privacy}">سياسة الخصوصية</a>.' },
      { p: 'إذا رأيت أن بياناتك لا تُحترم، يمكنك أيضًا التوجه إلى هيئة حماية البيانات الإسبانية، <a href="https://www.aepd.es/en">AEPD</a>.' }
    ],
    now: {
      title: 'اختيارك الآن',
      none: 'لم تختر بعد. وإلى ذلك الحين لا تُحمَّل فيديوهات YouTube.',
      yes: 'لقد قبلت فيديوهات YouTube.',
      no: 'لقد رفضت فيديوهات YouTube. تُشغَّل في صفحة YouTube نفسها، لا هنا.',
      since: 'منذ',
      change: 'تغيير اختياري'
    }
  }
}[lang];
