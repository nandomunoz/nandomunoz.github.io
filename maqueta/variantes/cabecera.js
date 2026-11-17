// Trama · the phone header in six takes (sandbox only). Static markup written by us (no content
// from JSON), so innerHTML is fine here. Each take is a frame of 375 px with the same header and
// the same start of the home under it, so what changes is only how the four links are laid out.
import { themeSwitch } from '../shared/theme.js';

const LINKS = [['01', 'Bio'], ['02', 'Proyectos'], ['03', 'Blog'], ['04', 'Escríbeme']];
const CUR = 1;
const CHEV = '<svg class="lang-dd__chev" viewBox="0 0 5 3" aria-hidden="true" focusable="false"><circle cx=".5" cy=".5" r=".5"/><circle cx="4.5" cy=".5" r=".5"/><circle cx="1.5" cy="1.5" r=".5"/><circle cx="3.5" cy="1.5" r=".5"/><circle cx="2.5" cy="2.5" r=".5"/></svg>';
const lang = '<button type="button" class="lang-dd__btn" aria-label="Idioma: Español"><span aria-hidden="true">Español</span>' + CHEV + '</button>';
const mark = '<a class="top__mark" href="#"><span aria-hidden="true">NM</span><span>Nando Muñoz</span></a>';
const head = (right = lang) => `<div class="ph__top">${mark}${right}</div>`;
const hero = '<div class="ph__hero"><p>Proyecto, el <em>motivo.</em></p><p>Humano, el <em>centro.</em></p></div>';
const link = ([n, t], i, extra = '') => `<a href="#" class="${extra}"${i === CUR ? ' aria-current="true"' : ''}><span class="nav__n" aria-hidden="true">${n}</span><span class="t">${t}</span></a>`;

const TAKES = [
  { tag: 'Teclas', idea: 'Los cuatro enlaces pasan a una rejilla 2×2 de teclas con borde de puntos: cada una es una zona táctil grande (52 px de alto), el número en Doto y un punto de estado a la derecha que se enciende en la sección actual. Ocupa dos filas, pero ordenadas, y el título queda separado por una línea.',
    html: () => `<div class="ph__frame v1">${head()}<nav aria-label="Secciones"><ul>${LINKS.map((l, i) => `<li>${link(l, i)}<i class="dot" aria-hidden="true"></i></li>`).join('')}</ul></nav>${hero}</div>` },
  { tag: 'Cinta', idea: 'Una sola línea de píldoras que se desliza en horizontal con imán (scroll-snap). Gasta la mínima altura y la última píldora asoma cortada con un degradado, que es la pista de que hay más. Coste: un enlace queda a medio ver; por eso la actual se centra sola.',
    html: () => `<div class="ph__frame v2">${head()}<nav aria-label="Secciones"><ul>${LINKS.map((l, i) => `<li>${link(l, i)}</li>`).join('')}</ul></nav>${hero}</div>` },
  { tag: 'Índice', idea: 'Como el índice de un libro: una fila por enlace, el número, el nombre, una línea de puntos guía y una flecha. Cuatro filas de 48 px, lectura de un vistazo y el pulgar acierta siempre porque la fila entera es el botón. Es la más alta, pero el rótulo grande lo compensa.',
    html: () => `<div class="ph__frame v3">${head()}<nav aria-label="Secciones"><ol>${LINKS.map((l, i) => `<li>${link(l, i)}</li>`).join('')}</ol></nav>${hero}</div>` },
  { tag: 'Cortina', idea: 'La cabecera se queda en una línea: el logo y un botón «Menú» con una matriz de 3×3 puntos que se convierte en una X. Al pulsar baja una cortina a pantalla completa con los cuatro enlaces enormes (la voz del titular), el idioma en tres enlaces y Esc para cerrar. Máximo aire en la portada; coste: un toque más para llegar.',
    html: () => `<div class="ph__frame v4">${head('<button type="button" class="menu" aria-expanded="false" aria-controls="sheet-1"><span class="menu__t">Menú</span><span class="menu__grid" aria-hidden="true">' + '<i></i>'.repeat(9) + '</span></button>')}${hero}
      <div class="sheet" id="sheet-1" hidden>
        <div class="ph__top">${mark}<button type="button" class="menu" aria-expanded="true" aria-controls="sheet-1"><span class="menu__t">Cerrar</span><span class="menu__grid is-x" aria-hidden="true">${'<i></i>'.repeat(9)}</span></button></div>
        <nav aria-label="Secciones"><ol>${LINKS.map((l, i) => `<li>${link(l, i)}</li>`).join('')}</ol></nav>
        <p class="sheet__lang"><span class="vh">Idioma</span><a href="#" aria-current="true" lang="es">Español</a><a href="#" lang="en">English</a><a href="#" lang="ar">العربية</a></p>
      </div></div>` },
  { tag: 'Pastilla', idea: 'La cabecera solo lleva logo e idioma, con todo el aire del mundo. Los enlaces viven desde el primer segundo en la pastilla de abajo, que ya existe en la web cuando bajas: queda en la zona del pulgar y no cambia de sitio al hacer scroll. Sin salto, sin segunda vía.',
    html: () => `<div class="ph__frame v5">${head()}${hero}<nav class="pill" aria-label="Secciones"><ul>${LINKS.map((l, i) => `<li>${link(l, i)}</li>`).join('')}</ul></nav></div>` },
  { tag: 'Ruta de puntos', idea: 'Los cuatro enlaces cuelgan de una línea de puntos, como las paradas de una ruta: arriba el número, en la línea el punto (verde en la sección actual) y debajo el nombre. Ocupa una sola franja ancha, reparte el espacio sola y se lee como un progreso. Cada parada mide 44 px de alto.',
    html: () => `<div class="ph__frame v6">${head()}<nav aria-label="Secciones"><ol>${LINKS.map((l, i) => `<li>${link(l, i)}</li>`).join('')}</ol></nav>${hero}</div>` },
];

const slots = document.getElementById('slots');
slots.innerHTML = TAKES.map((t, i) => `<section class="vx" id="c${i + 1}">
  <p class="vx__tag"><b>0${i + 1}</b> ${t.tag}</p>
  <p class="vx__idea">${t.idea}</p>
  <div class="ph">${t.html()}</div>
</section>`).join('');

// 04: the curtain
slots.addEventListener('click', (e) => {
  const b = e.target.closest('.menu');
  if (b) {
    const frame = b.closest('.ph__frame'), sheet = frame.querySelector('.sheet'), open = sheet.hidden;
    sheet.hidden = !open;
    frame.classList.toggle('is-open', open);
    frame.querySelector('.ph__top .menu').setAttribute('aria-expanded', open);
    (open ? sheet.querySelector('.menu') : frame.querySelector('.ph__top .menu')).focus();
    return;
  }
  if (e.target.closest('a[href="#"]')) e.preventDefault();
});
slots.addEventListener('keydown', (e) => {
  const sheet = e.target.closest?.('.ph__frame')?.querySelector('.sheet');
  if (e.key === 'Escape' && sheet && !sheet.hidden) sheet.querySelector('.menu').click();
});
themeSwitch();
