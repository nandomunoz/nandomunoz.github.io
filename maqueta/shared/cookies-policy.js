// Trama · the cookie policy (/maqueta/cookies/), in Spanish and English.
// Written so that a twelve-year-old and a seventy-year-old both follow it:
// short sentences, one idea each, no legal or technical words without
// saying what they mean. It tells only what the site really does (see
// shared/consent.js): no cookies of its own, one note in the browser with
// the choice, YouTube only when allowed. When the site changes, change this
// and the date, and bump VERSION in shared/consent.js so the card asks again.
//
// Blocks: { h } a heading · { p } a paragraph (inline HTML: links, strong)
//         · { ul: [] } a list (inline HTML) · { glance: [[label, value]] }
//         · { now: true } the visitor's current choice and the button to change it
import { lang } from './content.js';

export const UPDATED = '2026-11-15';

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
        ['Lo que se guarda', 'Tu respuesta a este aviso, y nada más']
      ] },
      { now: true },

      { h: '¿Qué es una cookie?' },
      { p: 'Una cookie es una notita que una página web deja guardada en tu navegador, el programa con el que ves internet (Chrome, Safari, Firefox…).' },
      { p: 'Sirve para que la web se acuerde de algo la próxima vez que vuelvas. Por ejemplo, de que ya has iniciado sesión. También puede servir para saber por qué páginas te mueves, y eso a veces se usa para enseñarte anuncios.' },

      { h: '¿Esta web usa cookies?' },
      { p: '<strong>No. Esta web no pone ninguna cookie suya.</strong> No hay anuncios, no cuenta tus visitas y no apunta lo que haces.' },
      { p: 'Las letras que ves están guardadas en esta misma web, así que tampoco hace falta pedírselas a Google ni a nadie.' },

      { h: 'Lo único que se guarda: tu respuesta' },
      { p: 'Cuando eliges en el aviso de cookies, tu navegador guarda <strong>una sola nota</strong> con lo que has elegido y el día en que lo hiciste. Así no te volvemos a preguntar cada vez que entras.' },
      { ul: [
        'Se queda en tu aparato. No se envía a ningún sitio.',
        'Dura 6 meses. Después te lo volvemos a preguntar.',
        'Si cambiamos estas normas, también te lo volvemos a preguntar.'
      ] },
      { p: 'Esta nota es parecida a una cookie, pero no viaja por internet. La necesita el propio aviso para funcionar, por eso no te pedimos permiso para guardarla.' },

      { h: 'Los vídeos de YouTube' },
      { p: 'Algunos artículos tienen vídeos de YouTube. YouTube es de Google, y Google sí puede guardar sus propias cookies cuando ves un vídeo.' },
      { p: 'Por eso, <strong>mientras no digas que sí, la web no le pide nada a YouTube</strong>: ni el vídeo, ni la foto pequeña que lo anuncia. En su lugar verás un aviso con dos botones:' },
      { ul: [
        '<strong>Aceptar y ver aquí</strong>: el vídeo se ve dentro del artículo. Usamos el «modo de privacidad mejorada» de YouTube (youtube-nocookie.com), que guarda menos cosas.',
        '<strong>Ver en YouTube</strong>: el vídeo se abre en la página de YouTube, en otra pestaña. Allí mandan las normas de YouTube.'
      ] },
      { p: 'Lo que hace Google con esos datos lo cuenta en su <a href="https://policies.google.com/privacy?hl=es">política de privacidad</a>.' },

      { h: 'Otras cosas de fuera' },
      { ul: [
        'Los tuits se enseñan como una tarjeta hecha aquí. No se carga nada de X (Twitter).',
        'Los enlaces a otras webs solo te llevan allí si pulsas. Cada web tiene sus propias normas.',
        'El servicio que guarda esta web en internet puede apuntar datos técnicos de cada visita, como la dirección de tu conexión (la IP), para protegerse de ataques. No son cookies y no se usan para saber quién eres.'
      ] },

      { h: 'Cómo cambiar de opinión' },
      { p: 'Puedes cambiar tu respuesta cuando quieras con el botón <strong>Ajustes de cookies</strong>, que está abajo del todo, en el pie de cada página. O con el botón de esta página.' },

      { h: 'Cómo borrar lo que se ha guardado' },
      { p: 'Tu navegador te deja borrar las cookies y las notas de cualquier web. Suele estar en <strong>Ajustes → Privacidad</strong>, en una opción que se llama algo como «Borrar datos de navegación».' },
      { p: 'Si navegas en modo privado (o «incógnito»), todo se borra solo al cerrar la ventana.' },

      { h: '¿Quién es el responsable?' },
      { p: 'Esta web es de Nando Muñoz, que la escribe y la mantiene. Si tienes cualquier duda, escríbeme por las redes que aparecen en <a href="{contact}">Escríbeme</a>.' },
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
        ['What is stored', 'Your answer to this notice, and nothing else']
      ] },
      { now: true },

      { h: 'What is a cookie?' },
      { p: 'A cookie is a little note that a website leaves in your browser, the program you use to see the internet (Chrome, Safari, Firefox…).' },
      { p: 'It lets the website remember something next time you come back. For example, that you are already signed in. It can also be used to know which pages you visit, and that is sometimes used to show you adverts.' },

      { h: 'Does this site use cookies?' },
      { p: '<strong>No. This site sets no cookies of its own.</strong> There are no adverts, it does not count your visits and it does not write down what you do.' },
      { p: 'The letters you see are kept on this same site, so there is no need to ask Google or anyone else for them either.' },

      { h: 'The only thing kept: your answer' },
      { p: 'When you choose in the cookie notice, your browser keeps <strong>one single note</strong> with what you chose and the day you did it. That way we do not ask you again every time you come in.' },
      { ul: [
        'It stays on your device. It is not sent anywhere.',
        'It lasts 6 months. After that we ask you again.',
        'If we change these rules, we ask you again too.'
      ] },
      { p: 'This note is like a cookie, but it does not travel over the internet. The notice itself needs it to work, which is why we do not ask your permission to keep it.' },

      { h: 'YouTube videos' },
      { p: 'Some posts have YouTube videos. YouTube belongs to Google, and Google can keep its own cookies when you watch a video.' },
      { p: 'So, <strong>until you say yes, this site asks YouTube for nothing</strong>: not the video, not the small picture that shows it. Instead you will see a notice with two buttons:' },
      { ul: [
        '<strong>Accept and watch here</strong>: the video plays inside the post. We use YouTube’s “privacy-enhanced mode” (youtube-nocookie.com), which keeps less.',
        '<strong>Watch on YouTube</strong>: the video opens on YouTube’s own page, in another tab. There, YouTube’s rules apply.'
      ] },
      { p: 'What Google does with that data is explained in its <a href="https://policies.google.com/privacy?hl=en">privacy policy</a>.' },

      { h: 'Other things from outside' },
      { ul: [
        'Tweets are shown as a card made here. Nothing is loaded from X (Twitter).',
        'Links to other websites only take you there if you press them. Each website has its own rules.',
        'The service that keeps this site on the internet may note technical details of each visit, such as your connection’s address (the IP), to protect itself from attacks. These are not cookies and are not used to know who you are.'
      ] },

      { h: 'How to change your mind' },
      { p: 'You can change your answer whenever you like with the <strong>Cookie settings</strong> button, at the very bottom of every page, in the footer. Or with the button on this page.' },

      { h: 'How to delete what was kept' },
      { p: 'Your browser lets you delete the cookies and notes of any website. It is usually under <strong>Settings → Privacy</strong>, in an option called something like “Clear browsing data”.' },
      { p: 'If you browse in private (or “incognito”) mode, everything is deleted by itself when you close the window.' },

      { h: 'Who is responsible?' },
      { p: 'This site belongs to Nando Muñoz, who writes and looks after it. If you have any question, write to me through the networks listed under <a href="{contact}">Write to me</a>.' },
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
  }
}[lang];
