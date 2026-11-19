# Accesibilidad de lo último de cookies de la maqueta Trama

Alcance: los commits `a605cc6` y `238633d` (tarjeta de cookies, diálogo de ajustes, vídeo con consentimiento previo, página `/maqueta/cookies/`, píldora que se aparta). Medido sobre el árbol en `88e3783` (después de esos commits solo cambian el favicon y el enlace de idioma del pie; el código de cookies es el mismo). No se ha tocado ningún archivo salvo este informe.
El informe completo está en `.ai/plan/informe-accesibilidad-maqueta.md`. Aquí solo hay lo nuevo y el estado de los hallazgos 8, 12, 14 y 26 para estas piezas.

## 1. Veredicto

**Una falla de WCAG 2.2 AA confirmada, tres moderadas y cinco menores.** Las piezas nuevas están bien construidas: `<dialog>` nativo, `fieldset`/`legend`/`aria-describedby`, texto con contraste entre 6,4:1 y 14:1, objetivos de 44 px, `forced-colors` y reflujo sin recortes. Lo que falla es sobre todo lo que ya se había visto: **el foco queda tapado** por la tarjeta y la píldora (hallazgo 26, sigue abierto para estas piezas).

axe-core 4.10.3 no encuentra ninguna violación dentro de la tarjeta, el diálogo abierto, la puerta del vídeo ni la página de política. Esto no es un resultado: axe encuentra más o menos un tercio de los problemas, y todo lo que sigue sale de la parte manual. Las violaciones que axe sí marca en esas páginas son anteriores y ajenas a las cookies: `color-contrast` en `--faint` (hallazgo 2: `dt`, `.nav__n`, `.foot__by`, `.post__note`) y `landmark-complementary-is-top-level` (hallazgo 15).

Lo más importante, en orden:

1. **C1 · serio · 2.4.11** — con la tarjeta visible, «Ajustes de cookies» y «English» del pie quedan 100 % bajo la tarjeta en escritorio. En el móvil, «Aceptar y ver aquí» queda 100 % bajo la píldora.
2. **C2 · moderado · 3.1.2** — en la página en inglés, el texto de la puerta del vídeo va dentro del `lang="es"` del artículo y se lee con voz española.
3. **C3 · moderado · 2.4.3** — «Cambiar mi elección» (política): al elegir, el foco se va al botón del pie, no a donde estaba el usuario.
4. **C4 · moderado · 4.1.2** — un vídeo sin título deja una puerta sin nombre y sin título visible (hallazgo 12, abierto).
5. **C5 · menor** — un clic en el relleno del diálogo lo cierra y pierde la casilla sin guardar.

## 2. Método

- Chromium 1243 (puppeteer-core), contexto limpio por página para que el `localStorage` no se arrastre. axe-core **4.10.3**, etiquetas `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`, con `prefers-reduced-motion: reduce`.
- Anchos 375 y 1280 en es y en. Estados: tarjeta abierta (sin elección), diálogo abierto, rechazado (puerta del vídeo), aceptado (portada con miniatura). Páginas: `/maqueta/cookies/` y `/maqueta/blog/articulo/?a=analisis-del-popurri-de-la-ciudad-invisible`.
- Contraste: script propio con luminancia relativa de WCAG, sobre el color calculado de cada nodo de texto y su fondo real (incluido el punto `#ffffff10` de la puerta como peor caso). Más 3 anchos de tablet/escritorio para el foco tapado.
- Teclado: Tab real (60+ paradas por página en 375×667, 768×1024 y 1280×720), porcentaje del rectángulo enfocado bajo el elemento fijo, Esc, Shift+Tab, Enter/Espacio, clic en el fondo. Árbol de accesibilidad (`page.accessibility.snapshot`).
- Modos: `forced-colors: active` (capturas), `prefers-reduced-motion` (posición de la píldora cuadro a cuadro), JS desactivado, 320×568, 200 % de texto, 640×400 (200 % de zoom), 320×200 (400 %), 568×320 apaisado, espaciado de texto de 1.4.12.
- Lectura: índices de legibilidad calculados a mano (Szigriszt-Pazos y Fernández Huerta en español, Flesch y Flesch-Kincaid en inglés; el contador de sílabas es heurístico, así que las cifras son orientativas).
- Scripts y capturas: `/tmp/claude-1000/-home-ares-Documents-repos-me/ec501b2d-cac8-4ee3-8064-974f1a53d49f/scratchpad/ck/` (`axe.mjs`, `contrast.mjs`, `kb.mjs`, `dlg.mjs`, `cov.mjs`, `reflow.mjs`, `pol.mjs`, `shots/`).
- `luz-check`: el maqueta no usa clases de LUZ (solo el elemento `<luz-cookie-consent>`, vendido en `assets/vendor/luz/`), así que no se ha ejecutado. Aunque se ejecutara, `luz-check` comprueba el uso de LUZ y el contraste del tema, no nombres, etiquetas, encabezados ni idioma.

## 3. Hallazgos (por gravedad)

| # | Gravedad | Hallazgo | Criterio · nivel · EN 301 549 | Etiqueta |
|---|---|---|---|---|
| **WCAG 2.2 (aún no exigido por EN 301 549 v3.2.1)** | | | | |
| C1 | Serio | Foco tapado por la tarjeta (escritorio) y por la píldora (móvil, botón de la puerta del vídeo) | 2.4.11 AA | confirmado |
| **WCAG 2.1 / 2.0 AA** | | | | |
| C2 | Moderado | Texto en inglés de la puerta dentro de `lang="es"` | 3.1.2 AA · EN 9.3.1.2 | confirmado (la voz, necesita tecnología de apoyo) |
| C3 | Moderado | «Cambiar mi elección»: el foco vuelve al pie, no al botón | 2.4.3 A · EN 9.2.4.3 | confirmado |
| C4 | Moderado | Vídeo sin título: puerta sin nombre y sin título visible | 4.1.2 A · EN 9.4.1.2; 2.4.6 AA · EN 9.2.4.6 | confirmado |
| C5 | Menor | Clic en el relleno del diálogo lo cierra | buenas prácticas (riesgo en 2.5.2 A · EN 9.2.5.2) | confirmado |
| C6 | Menor | Casilla marcada: relleno `--blaze` a 2,17:1 contra la tarjeta | 1.4.11 AA · EN 9.1.4.11 (riesgo) | confirmado (cifra); necesita ojos |
| C7 | Menor | Doble anuncio al elegir en la política; foco a `<main>` sin anillo | 4.1.3 AA · EN 9.4.1.3 (riesgo) | necesita tecnología de apoyo |
| C8 | Menor | `h2` «Cookies» de la tarjeta antes del `h1` (hallazgo 14) | 1.3.1 A · buena práctica (`heading-order`) | confirmado |
| C9 | Menor | Texto de 10–11 px en botones y títulos; «Aceptar/Rechazar» sin objeto; jerga residual | 3.1.5 AAA, 1.4.8 AAA (no obligatorio) | confirmado (tamaños y texto) |
| **Heredados, aún abiertos para estas piezas** | | | | |
| — | — | Sin JS la política queda vacía y el `noscript` es solo español (hallazgo 1) | método LUZ | confirmado; **lo arregla el HTML estático** |

Recuento: **1 serio, 3 moderados, 5 menores** (más 1 heredado). Los AAA solo se citan en C9.

### C1 · Foco tapado por la tarjeta y la píldora — serio · confirmado · 2.4.11 AA

- **Evidencia.**
  - `/maqueta/cookies/` con la tarjeta visible. Cuando el navegador pone en vista el pie al tabular desde arriba, «Ajustes de cookies» y «English» quedan **100 % bajo la tarjeta**, y «Política de cookies» del pie al 72 %.
  - Medido en 1280×800 (scroll 3159 de 3300), 1440×900 y 1024×768.
  - Causa: en `≥48em`, `style.css:457` pone `scroll-padding-bottom: 0`. El `.foot` tiene relleno (`style.css:456`), pero solo ayuda cuando el scroll ya está al final.
  - Artículo, 375×667: «Aceptar y ver aquí» queda 100 % y «Ver en YouTube ↗» 75 % bajo la píldora; «En este artículo» 63 %, «Más sobre mí» 71 %, «Escríbeme» 75 %.
  - 768×1024: «Siguiente →» 67 % (tarjeta y píldora), «Carnaval: Análisis del popurri…» 67 % (tarjeta).
- **Qué vive el usuario.** Quien navega con teclado llega a «Ajustes de cookies», pulsa Intro y no ve dónde está. El botón principal de la puerta del vídeo queda tapado por la píldora.
- **Estado.** Sigue abierto el hallazgo 26 para estas piezas. `style.css:442` descuenta la tarjeta, pero nunca la píldora.
- **Arreglo ahora (maqueta).**
  - `style.css:457`: `scroll-padding-bottom: calc(var(--luz-consent-h) + 2.5rem)` en lugar de `0`.
  - Con la píldora anclada (`:root.docked`, `≤63.99em`): `scroll-padding-bottom: calc(var(--pill-h, 3.5rem) + 1.5rem + var(--luz-consent-h, 0px))` cuando la tarjeta esté visible y `calc(var(--pill-h, 3.5rem) + 1.5rem)` cuando no.
  - Mejor: que `shared/consent.js` publique `--fixed-bottom` midiendo tarjeta y píldora con el `ResizeObserver` que ya existe en `pillRoom`, y que todo el CSS use esa variable.
- **Astro + LUZ.** Una sola variable `--fixed-bottom` publicada por el chrome (menú anclado + tarjeta), usada por `scroll-padding-bottom` y `scroll-margin-bottom` de los botones de la puerta. Tarjeta y píldora son un único componente de «cosas fijas abajo». Incluir en la prueba de Fase 10: tabular por toda la página con la tarjeta abierta y comprobar que el foco nunca queda tapado al 100 %.
- **Fase.** 4 (chrome), con 7/8 para la puerta del vídeo.

### C2 · Texto inglés de la puerta dentro de `lang="es"` — moderado · confirmado · 3.1.2 AA

- **Evidencia.** `/maqueta/blog/articulo/?a=analisis-del-popurri-de-la-ciudad-invisible&lang=en`. La puerta (`.video__gate`) está dentro de `.prose lang="es"`: `closest('[lang]').lang` es `es`. Su texto («This video is on YouTube… Accept and watch here · Watch on YouTube ↗ (opens in a new tab)») no lleva `lang`. `blog.js:367-375` y `CT.gate*` en `consent.js:41-42, 56-57`.
- **Impacto.** VoiceOver, NVDA y JAWS con una voz española leen esa frase en inglés con fonética española. Es un caso nuevo del hallazgo 8. El título del vídeo sí está en el idioma correcto (español).
- **Arreglo ahora.** En `blog.js`, a los dos `<p>` de la puerta y al contenedor de botones (no al título) añadirles `lang: lang` (el idioma de la interfaz, el de `content.js`). El grupo conserva el `aria-label` en el idioma del vídeo.
- **Astro + LUZ.** El componente `<YtGate>` pone `lang={uiLang}` en sus textos y `lang={video.lang ?? post.lang}` en el título. Es la misma regla que `<PostTitle>` del hallazgo 8: el idioma del texto es el de la cadena, no el del contenedor.
- **Fase.** 3 y 8.

### C3 · «Cambiar mi elección» devuelve el foco al pie — moderado · confirmado · 2.4.3 A

- **Evidencia.** `/maqueta/cookies/` (es y en). Con Intro en «Cambiar mi elección», el foco va a la tarjeta (bien). Al pulsar «Rechazar», el foco acaba en `button.foot__consent` («Ajustes de cookies») y la página **no se mueve** (scrollY 490 antes y después, `preventScroll`). El foco queda en el pie, fuera de la vista y a miles de píxeles de donde estaba el usuario.
- **Causa.** `blog.js:568` hace `document.querySelector('.foot__consent')?.click()`, así que `opener` (`consent.js:137`) es el botón del pie y no el de la página.
- **Impacto.** Quien usa lector de pantalla oye «Ajustes de cookies, botón» y piensa que lo ha cambiado todo; quien ve y usa teclado pierde el sitio.
- **Arreglo ahora.** Que `consent.js` exporte `reopen(from)`: guarda `opener = from` y hace `click()` en el botón del pie. En `blog.js`, `change.addEventListener('click', () => reopen(change))`.
- **Astro + LUZ.** El botón de la política lleva `data-luz-consent-open` (LUZ cablea todos los botones de apertura) y el módulo de «volver al que abrió» escucha `[data-luz-consent-open]` en el documento (delegación), sin depender de qué botón es.
- **Fase.** 4 y 7.

### C4 · Puerta de vídeo sin nombre cuando el título está vacío — moderado · confirmado · 4.1.2 A

- **Evidencia.** Artículo `analisis-del-popurri-de-la-ciudad-invisible`, rechazado: el quinto vídeo tiene `aria-label=""` y un título visible vacío (solo la ▶ `aria-hidden`). `blog.js:370`. Los otros cuatro tienen nombre (`role=group`, `aria-label=<título>`).
- **Impacto.** Quien usa lector de pantalla oye «grupo», «Aceptar y ver aquí», «Ver en YouTube» sin saber de qué vídeo. Quien ve, un bloque con una ▶ sin texto.
- **Estado.** Hallazgo 12, sigue abierto; la puerta es donde más se nota.
- **Arreglo ahora.** Rellenar el título en `maqueta/shared/blog.json`. Mejora menor: `aria-labelledby` apuntando al `<p class="video__gate-title">` en vez de `aria-label` (así no hay dos fuentes del nombre) y un título por defecto («Vídeo de YouTube») si llega vacío.
- **Astro + LUZ.** `title` obligatorio en el esquema del bloque (`astro check` falla si falta).
- **Fase.** 3 y 8.

### C5 · Un clic en el relleno del diálogo lo cierra — menor · confirmado

- **Evidencia.** `consent.js:96`: `dialog.addEventListener('click', (e) => e.target === dialog && dialog.close())`. Con el diálogo abierto en 1280×800, un clic a 8 px del borde izquierdo (relleno del propio `<dialog>`) lo cierra: `dialog.open === false`.
- **Impacto.** Una pulsación imprecisa, un temblor o soltar una selección de texto sobre el relleno cierra el diálogo y pierde la casilla sin guardar. El teclado no se ve afectado.
- **Arreglo ahora.** Cerrar solo si el clic cae fuera del rectángulo del diálogo (`e.clientX/Y` contra `dialog.getBoundingClientRect()`), o meter el contenido en un `<div>` con el relleno y comparar con `e.target === dialog` (el relleno pasa a ser del `div`).
- **Astro + LUZ.** Mismo patrón en el componente del diálogo.

### C6 · Casilla marcada con relleno de 2,17:1 — menor · confirmado (cifra) · 1.4.11 AA

- **Evidencia.** `style.css:421`: `accent-color: var(--blaze)`. `#963641` sobre `#232323` = **2,17:1**; la marca blanca sobre el relleno, 6,47:1. La casilla sin marcar usa el borde por defecto del navegador oscuro (~`#858585`, 4,26:1).
- **Impacto.** La marca es legible, pero el contorno de la casilla marcada baja de 3:1. Es un riesgo, no una falla clara: la marca es lo que indica el estado.
- **Arreglo ahora.** `accent-color: var(--ink)` (marca oscura sobre relleno claro, más de 13:1) o un acento más claro. Es una decisión de diseño: el acento oscuro es la identidad; si se conserva, añadir `outline: 1px solid var(--mute)` a la casilla.
- **Astro + LUZ.** Arreglar el token del acento de controles, no el override.

### C7 · Doble anuncio y foco a `<main>` — menor · necesita tecnología de apoyo · 4.1.3 AA

- **Evidencia.** `/maqueta/cookies/` tras elegir: hay **dos** regiones corteses con texto nuevo, la de «Tu elección ahora» (`blog.js:571`, `aria-live="polite"`) y `<p role=status>` del cuerpo (`consent.js:134-143`: «Preferencias de cookies guardadas…»). Además, en el flujo de la tarjeta el foco va a `<main>` (`consent.js:145-147`, sin anillo: `outline: none` aunque `:focus-visible` coincide).
- **Impacto probable.** Dos anuncios seguidos y, a quien ve con teclado, ningún indicio de dónde está el foco hasta el siguiente Tab, que entra en el contenido y se salta la cabecera. A comprobar con lector real.
- **Arreglo ahora.** En la política, quitar `aria-live` del bloque «Tu elección ahora» (ya anuncia el `role=status` global) o dejarlo solo y no escribir el global en esa página.
- **Decisión de diseño:** mandar el foco a `<main>` es una elección razonable. La alternativa es no mover el foco (el navegador lo recoloca al cerrar) o llevarlo al `<h1>`.

### C8 · `h2` «Cookies» antes del `h1` — menor · confirmado · 1.3.1 A (buena práctica)

- **Evidencia.** `consent.js:100` pone `h2` en la tarjeta, que va tras el enlace de saltar y antes de la cabecera. Es una región con nombre («Cookies») que ya se anuncia sola, así que el `h2` sobra.
- **Arreglo ahora.** `<p class="luz-cookie-consent__title" id="consent-title">`. El `h2` de dentro del diálogo es correcto.
- **Estado.** Hallazgo 14, sigue abierto.

### C9 · Tamaño de letra, objeto de los botones y jerga — menor · confirmado · AAA / buena práctica

- **Tamaños.** Título de la tarjeta 9,9 px, botones 10,9 px en mayúsculas con espaciado, texto de la tarjeta 13,6 px, `dt` de la política 11,2 px, pista del diálogo 13,1 px. Para el público que pidió el dueño (70 años) es pequeño. No viola 1.4.4 (el zoom funciona), pero conviene subir botones y título a ≥ 0,8rem (12,8 px) y el texto de la tarjeta a 15–16 px. Es una decisión de diseño.
- **«Aceptar / Rechazar» sin objeto.** La frase de la tarjeta («Sin cookies propias. Solo los vídeos de YouTube las usan, si los cargas.») no dice qué se acepta. Propuesta:
  - es: «Esta web no usa cookies. Los vídeos de YouTube sí. ¿Dejas que YouTube guarde las suyas?» con «Sí, aceptar» / «No, rechazar».
  - en: «This site uses no cookies. YouTube videos do. May YouTube keep its own?»
- **Jerga residual.** «analítica» / «analytics» en el diálogo (`consent.js:34, 49`): «no cuenta tus visitas». «IP» y «navegador» ya están explicados en la política. «youtube-nocookie.com» entre paréntesis: mantener, pero sin nombre de dominio en la frase principal.
- **Voz.** La política mezcla «nosotros» («te volvemos a preguntar») con «yo» («escríbeme»). Elegir una.
- **Enlace «política de privacidad»** (de Google) y el propio «Política de cookies» se parecen fuera de contexto: «política de privacidad de Google».
- **Nivel de lectura (3.1.5 AAA), orientativo.**

  | Texto | Idioma | Palabras | Palabras por frase | Índice |
  |---|---|---|---|---|
  | Política | es | 515 | 12,6 (máx. 27) | Szigriszt-Pazos 79 («bastante fácil»), Fernández Huerta 83 |
  | Política | en | 520 | 12,7 (máx. 28) | Flesch 80, grado ≈ 5 |
  | Tarjeta + diálogo | es | 42 | 6 | Szigriszt 61 (normal) |
  | Tarjeta + diálogo | en | 46 | 6,6 | Flesch 71 |

  Cumple 3.1.5 (educación secundaria inferior) con holgura. Las frases más largas (27–28 palabras: el servicio de alojamiento y la nota guardada) conviene partirlas en dos.
- **Maquetación de la política.** Medida ≤ 40 rem, interlineado amplio, letra de 18 px, contraste 10,5:1 en el cuerpo, preguntas como encabezados, `dl` para el resumen, «Se lee en 3 minutos» (515 palabras ≈ 2,6 min): bien.

## 4. Estado de los hallazgos anteriores para estas piezas

- **8 (`lang`):** sigue abierto; hay un caso nuevo en la puerta (C2).
- **12 (vídeo sin título):** sigue abierto; la puerta lo hace más visible (C4).
- **14 (`h2` antes del `h1`):** sigue abierto (C8).
- **26 (foco tapado):** **sigue abierto** para tarjeta y píldora (C1). No se ha tocado `scroll-padding` por la píldora.
- **1 (sin JS):** sin JS no existen ni la tarjeta ni el botón del pie (correcto: no hay botones muertos), pero la política queda vacía con el texto «Esta web necesita JavaScript.» solo en español, también en `?lang=en`. **Lo arregla la migración a HTML estático**; la política debe estar en el HTML, con su `lang`.
- **La anchura de 320 px a 200 % de texto** se desborda por la píldora y la cabecera (hallazgo 4/29), no por las piezas de cookies: tarjeta, diálogo, puerta y política no desbordan.

## 5. Lo que está bien hecho (conservarlo en Astro)

- **LUZ sin tocar:** la tarjeta no toma el foco, va justo tras el enlace de saltar (Tab, Tab: «Política de cookies», «Aceptar», «Rechazar», «Ajustes»), `region` con nombre, Aceptar y Rechazar con el mismo peso, sin movimiento, la elección en `luz-consent` 180 días, botón de reabrir en el pie.
- **Diálogo nativo:** el foco entra en la casilla, Tab y Mayús+Tab se quedan dentro, Esc cierra, el clic en el fondo cierra, y en los tres casos el foco vuelve a «Ajustes». Nombre «Ajustes de cookies». `fieldset` + `legend` (grupo «Contenido externo») + casilla con nombre propio y descripción por `aria-describedby`.
- **Anuncio al elegir:** `role="status"` con vaciado y texto 50 ms después; el foco vuelve al botón del pie si fue quien abrió, y a `<main>` sin desplazar si no. Elegir con «Aceptar y ver aquí» mueve el foco al `iframe` (que sí tiene `title`).
- **Puerta del vídeo:** el texto va antes de los botones, el grupo se llama como el vídeo, el enlace a YouTube avisa «(se abre en otra pestaña)» con `rel=noopener`, sin miniatura ni petición a YouTube sin consentimiento, y el cambio de elección intercambia puerta y portada sin recargar.
- **Contraste medido** (todas las parejas de la tarjeta, el diálogo, la puerta —peor caso sobre un punto— y la política): el mínimo es **6,43:1** (mute sobre punto de la puerta); el texto del cuerpo, 10,5:1; botones, 14:1. Foco: anillo punteado de 3 px en `--ink`, 14:1.
- **Objetivos (2.5.8):** botones 44 px de alto, enlaces del pie 29 px, ninguno por debajo de 24 px; los enlaces dentro de frases (15 px) usan la excepción de enlace en línea.
- **`forced-colors`:** la tarjeta y el diálogo tienen borde `CanvasText`, los botones se subrayan, la casilla y el anillo de foco se ven (comprobado en capturas).
- **`prefers-reduced-motion`:** la regla global de `style.css:364-366` deja la transición de la píldora a 0 s (medido: el `left` salta de golpe).
- **Reflujo:** 320×568, 200 % de texto, 640×400, 320×200 y apaisado 568×320: sin recortes ni desbordes. En ventanas bajas (< 30 rem de alto) la tarjeta deja de ser fija. Con el espaciado de 1.4.12 el diálogo se desplaza con scroll y nada queda cortado.
- **Idioma y título:** `/maqueta/cookies/` ajusta `<html lang>` y `<title>` en es/en; un `h1`, `h2` en orden y `noindex`.

## 6. Notas fuera del alcance de accesibilidad

- **La transición de la píldora no llega a ejecutarse al cerrar la tarjeta.** `consent.js:171-175` pone `data-glide` en un `MutationObserver`, pero `to.focus()` o la lectura de altura de LUZ fuerzan antes un recálculo de estilos sin `data-glide`, y la píldora salta. Medido en 375×812 sin reducción de movimiento. No afecta a la accesibilidad (al contrario), pero el commit dice que se desliza. Arreglo: poner `data-glide` antes de ocultar la tarjeta.
- En `consent.js` los textos `done` y `close` de LUZ siguen en el DOM, ocultos, y no se usan.
- Cada puerta de vídeo registra un listener de `luz:consent` en `document` que nunca se quita (fuga leve; no afecta a la accesibilidad).

## 7. Pruebas manuales pendientes (con tecnología de apoyo real)

1. **NVDA + Firefox y JAWS + Chrome (Windows):** al cargar la página, ¿se encuentra la región «Cookies» en el orden de lectura (justo tras el enlace de saltar)? Al pulsar «Ajustes», ¿se anuncia «Ajustes de cookies, cuadro de diálogo» y la casilla con su descripción? Al guardar, ¿se oye una sola vez «Preferencias de cookies guardadas»? (C7)
2. **VoiceOver iOS (Safari):** la tarjeta (50 % del alto con texto grande), el diálogo, la puerta del vídeo en cada vídeo; el rotor de botones lista «Aceptar y ver aquí» cinco veces, con el grupo como contexto.
3. **VoiceOver macOS y Orca:** lo mismo, más el foco que vuelve al botón del pie.
4. **Voz de la puerta en inglés (C2):** con un lector en inglés, ¿lee «This video is on YouTube…» con voz inglesa tras el arreglo, y el título español con voz española?
5. **Android TalkBack:** objetivos y píldora sobre la puerta (C1).
6. **Zoom y magnificación:** ZoomText o la lupa del sistema con la tarjeta abierta (C1).
7. **Teclado en el móvil con la píldora:** tabular con teclado bluetooth y comprobar que el foco no desaparece bajo la píldora ni la tarjeta.
8. **Alto contraste de Windows** (no solo la emulación) con tarjeta, diálogo y puerta.
9. **Saltar al contenido:** al usarlo, la tarjeta queda atrás y cubriendo parte de la pantalla; comprobar si quien salta sabe que existe. Alternativa: que el enlace de saltar apunte a la tarjeta cuando está visible.
10. **Comprensión real:** prueba con una persona de 12 años y otra de 70 leyendo la política y la tarjeta (el índice de legibilidad no sustituye esto).

## 8. Lista para pegar en la Fase 10 del plan

- [ ] Con la tarjeta visible, tabular toda la página en 375, 768 y 1280 de ancho: ningún elemento enfocado queda 100 % tapado por la tarjeta ni por la píldora (`--fixed-bottom`, C1).
- [ ] La puerta del vídeo: texto antes de los botones, grupo con nombre (`title` obligatorio), `lang` de la interfaz en sus textos y del vídeo en el título (C2, C4).
- [ ] Al elegir desde la política («Cambiar mi elección»), el foco vuelve a ese botón; desde el pie, al pie; desde la tarjeta, a un sitio con anillo o a `<main>` (C3, C7).
- [ ] Un solo anuncio cortés por elección (C7).
- [ ] El diálogo no se cierra al clicar su relleno (C5).
- [ ] Casilla con ≥ 3:1 en el contorno de su estado marcado (C6).
- [ ] La tarjeta sin `h2` antes del `h1` (C8).
- [ ] Botones y título de la tarjeta ≥ 12,8 px; frase que diga qué se acepta; sin «analítica» (C9).
- [ ] La política completa en el HTML (sin JS), con `lang`, y `noscript` en el idioma de la página.
- [ ] `forced-colors`: tarjeta, diálogo y puerta con borde y foco visibles; `prefers-reduced-motion`: sin transición en la píldora.
- [ ] axe 4.x (tarjeta abierta, diálogo abierto, puerta, política; es/en; 375/1280): sin violaciones graves ni críticas.

## 9. Texto propuesto para la declaración de accesibilidad (apartado de cookies)

> El aviso de cookies y sus ajustes se pueden usar solo con teclado y con lector de pantalla; el aviso no toma el foco al aparecer. Mientras el aviso está abierto, en algunas ventanas puede tapar parcialmente el foco de los enlaces del pie de página y, en el móvil, el menú flotante puede tapar un botón de la pregunta de los vídeos. Los vídeos de YouTube preguntan antes de cargarse. Todo ello se está corrigiendo. La política de cookies está escrita en lenguaje sencillo. No se ha probado con lectores de pantalla en dispositivos reales.
