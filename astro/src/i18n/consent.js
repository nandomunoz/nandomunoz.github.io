// The cookie card, its settings and the video gate, in the three languages (plan Phase 9). Ported from the maqueta's
// shared/consent.js. The site sets no cookies of its own and has no analytics: the one thing to ask about is YouTube, whose
// player (youtube-nocookie.com) and thumbnails (i.ytimg.com) only load when "youtube" is granted.
export const CT = {
  es: {
    title: 'Cookies',
    text: 'Sin cookies propias. Solo los vídeos de YouTube las usan, si los cargas.',
    policy: 'Política de cookies', policyMore: 'Leer la política de cookies',
    all: 'Aceptar', none: 'Rechazar', choose: 'Ajustes',
    dialog: 'Ajustes de cookies', dialogText: 'Esta web no usa cookies propias ni cuenta tus visitas. Elige si pueden cargarse vídeos de YouTube:',
    legend: 'Contenido externo',
    youtube: 'Vídeos de YouTube', youtubeHint: 'El reproductor (youtube-nocookie.com) y las fotos pequeñas de los vídeos (i.ytimg.com), de Google. YouTube puede guardar cookies al reproducir. Tu elección vale 180 días.',
    save: 'Guardar', cancel: 'Cancelar',
    done: 'Guardado. Cámbialo desde «Ajustes de cookies», en el pie.', close: 'Cerrar',
    saved: 'Ajustes de cookies guardados. Puedes cambiarlos desde «Ajustes de cookies», en el pie.',
    open: 'Ajustes de cookies',
    video: 'Vídeo de YouTube',
    gate: 'Este vídeo está en YouTube (Google). Para verlo aquí, tu navegador se conectará con Google, que verá tu dirección IP (la de tu conexión) y puede guardar cookies. Recordaré tu «sí» 180 días, para todos los vídeos.',
    gateOr: 'Si prefieres no hacerlo, ábrelo en YouTube: allí valen las normas de YouTube.',
    gateYes: 'Aceptar y ver aquí', gateNo: 'Ver en YouTube', newTab: '(se abre en otra pestaña)'
  },
  en: {
    title: 'Cookies',
    text: 'No cookies of our own. Only YouTube videos use them, if you load them.',
    policy: 'Cookie policy', policyMore: 'Read the cookie policy',
    all: 'Accept', none: 'Reject', choose: 'Settings',
    dialog: 'Cookie settings', dialogText: 'This site sets no cookies of its own and does not count your visits. Choose whether YouTube videos may load:',
    legend: 'Outside content',
    youtube: 'YouTube videos', youtubeHint: 'The player (youtube-nocookie.com) and the small pictures of the videos (i.ytimg.com), from Google. YouTube may keep cookies when a video plays. Your choice lasts 180 days.',
    save: 'Save', cancel: 'Cancel',
    done: 'Saved. Change it from “Cookie settings” in the footer.', close: 'Close',
    saved: 'Cookie settings saved. You can change them from “Cookie settings” in the footer.',
    open: 'Cookie settings',
    video: 'YouTube video',
    gate: 'This video is on YouTube (Google). To watch it here, your browser will connect to Google, which will see your IP address (your connection’s) and may keep cookies. I will remember your “yes” for 180 days, for all videos.',
    gateOr: 'If you would rather not, open it on YouTube: YouTube’s own rules apply there.',
    gateYes: 'Accept and watch here', gateNo: 'Watch on YouTube', newTab: '(opens in a new tab)'
  }
  ,ar: {
    title: 'الكوكيز',
    text: 'لا كوكيز خاصة بنا. فقط فيديوهات YouTube تستخدمها، إن حمّلتها.',
    policy: 'سياسة الكوكيز', policyMore: 'اقرأ سياسة الكوكيز',
    all: 'قبول', none: 'رفض', choose: 'الإعدادات',
    dialog: 'إعدادات الكوكيز', dialogText: 'لا يستخدم هذا الموقع كوكيز خاصة به ولا يعدّ زياراتك. اختر هل يجوز تحميل فيديوهات YouTube:',
    legend: 'محتوى خارجي',
    youtube: 'فيديوهات YouTube', youtubeHint: 'المشغّل (youtube-nocookie.com) والصور الصغيرة للفيديوهات (i.ytimg.com)، من Google. قد تحفظ YouTube كوكيز عند التشغيل. يسري اختيارك 180 يومًا.',
    save: 'حفظ', cancel: 'إلغاء',
    done: 'تم الحفظ. غيّره من «إعدادات الكوكيز» في أسفل الصفحة.', close: 'إغلاق',
    saved: 'تم حفظ إعدادات الكوكيز. يمكنك تغييرها من «إعدادات الكوكيز» في أسفل الصفحة.',
    open: 'إعدادات الكوكيز',
    video: 'فيديو YouTube',
    gate: 'هذا الفيديو على YouTube (Google). لمشاهدته هنا سيتصل متصفحك بـ Google، التي سترى عنوان IP الخاص بك (عنوان اتصالك) وقد تحفظ كوكيز. سأتذكّر موافقتك 180 يومًا لجميع الفيديوهات.',
    gateOr: 'إن كنت تفضّل ألا يحدث ذلك، فافتحه على YouTube: هناك تسري قواعد YouTube.',
    gateYes: 'قبول والمشاهدة هنا', gateNo: 'المشاهدة على YouTube', newTab: '(يُفتح في تبويب جديد)'
  }
};
