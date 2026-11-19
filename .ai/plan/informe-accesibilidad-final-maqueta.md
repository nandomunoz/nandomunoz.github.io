# Informe de accesibilidad final · maqueta Trama

> Pasada de cierre sobre `maqueta/` (rama `proto/home`) frente a **WCAG 2.2 AA** y **EN 301 549 v3.2.1**, con el método del `accessibility-engineer` de LUZ.
> Fecha: 2026-11-16. Árbol auditado: `6b526e1` más los cambios sin commitear de hoy (`git status`: `style.css`, `blog/blog.css`, `blog/blog.js`, `blog/parts.js`, `main.js`, `dots.js`, `rain.js`, `shared/consent.js`, `shared/cookies-policy.js`, `shared/credits.js`, `shared/blog.json`, `privacidad/`, `shared/privacy.js`). No se ha editado ni commiteado nada salvo este informe.
> Solo se ha vuelto a probar lo que cambió y los hallazgos abiertos de `informe-accesibilidad-maqueta.md`, `-cookies.md` y `-modos.md`.
> Este informe **no declara conformidad**. axe-core encuentra en torno a un tercio de los problemas. Lo que no se ha probado con lectores de pantalla reales está en el §8.

---

## 1. Resumen

**Veredicto.** Hay un salto grande respecto a las tres auditorías anteriores. Con el banner visible, en los tres modos de color, en 375 y 1280 px y en es y en, axe no encuentra ninguna violación `serious` o `critical` salvo una (el «← Más recientes» inactivo de la paginación), y ninguna con el diálogo de ajustes, el panel de proyecto, el diálogo de compartir, la puerta del vídeo o el índice abiertos. Desaparecen el contraste del gris, el reflow de la 404 y de la nube de etiquetas, el movimiento sin fin, el código sin foco, el «copiar» mudo, el texto en español sin `lang` en la interfaz inglesa y los vídeos sin título. Aun así, **no se puede declarar que cumpla AA**: sigue abierto el foco tapado (2.4.11), el estado «actual» solo por color, y hay dos defectos nuevos que sale de lo de hoy (la tarjeta de cookies pisada por la cabecera en ventanas bajas y el idioma actual que no llega a los lectores de pantalla).

**Recuento (solo lo que sigue fallando o es nuevo):** 1 bloqueante (sin JS: lo arregla Astro) · 4 serios (uno es WCAG 2.2) · 8 moderados (uno es WCAG 2.2) · 11 menores · 5 solo AAA. De los 32 hallazgos del informe general: 8 arreglados, 3 en parte, 20 abiertos y 1 sin re-testear. De los 9 de cookies: 4 arreglados, 1 en parte, 4 abiertos. De los 19 de modos: 4 arreglados, 1 en parte, 1 no reproducido, 3 sin re-testear, 9 abiertos y 1 sin cambio (decisión del dueño).

**Los cinco más importantes**

1. **El foco sigue quedando tapado por completo** (serio, 2.4.11 AA, WCAG 2.2). En 54 recorridos con Tab (3 anchos × con y sin banner × 9 páginas) hay **29 casos** de un elemento con foco 100 % bajo la píldora del menú (≤ 63,99 em) o bajo la tarjeta de cookies (≥ 48 em), y 127 más con más del 20 % tapado. Es el hallazgo 26/C1. **Un arreglo de 4 líneas de CSS probado en el navegador lo deja en 0 casos y 3 parciales** (§4, F1).
2. **La tarjeta de cookies y la cabecera se pisan en ventanas bajas** (serio, 1.4.10 AA · EN 9.1.4.10, nuevo). Con la altura de ventana ≤ 30 rem (zoom al 400 % en un portátil, móvil en horizontal) la tarjeta pasa a ir en el flujo, arriba, y la cabecera y el menú (`position: absolute`) se pintan **encima de su texto**. Medido en 320×256 y 667×375 (capturas).
3. **El estado «actual» sigue siendo solo color** (serio, 1.4.1 A y 1.4.11 AA): menú, chips, paginación, índice. En `forced-colors` el chip «LUZ 3» y la página «01» son idénticos a los demás (capturas). Hallazgo 3/M9, sin tocar.
4. **El idioma actual del conmutador ES · EN no llega a los lectores de pantalla** (moderado, 4.1.2 A · EN 9.4.1.2, nuevo). El `<span aria-current aria-label="Español">` no tiene rol: Chromium lo descarta y el árbol de accesibilidad solo contiene «English». Un solo hijo en `group "Idioma"`.
5. **Dos `nav` llamados «Secciones»** (moderado, axe `landmark-unique`, en las 204 pasadas): la píldora y el grupo del pie. Y los `<pre role=region>` del artículo de código se llaman igual dos a dos («HTML», «JavaScript»).

**Lo que el paso a Astro arregla por sí solo:** el hallazgo 1 (sin JS), el `noscript` en un solo idioma y, en parte, el 16 y el 20 (`aria-current` decidido en el build y el buscador como `<form method="get">`). **No arregla** nada de lo demás: se copian CSS y plantillas tal cual.

---

## 2. Método

| Herramienta | Versión | Uso |
|---|---|---|
| Chrome for Testing (headless, `~/.cache/ms-playwright/chromium-1243`) | 153.0.8010.12 | Render, Tab y teclas reales, `prefers-reduced-motion`, `forced-colors: active`, `prefers-contrast`, `prefers-color-scheme` por CDP, capturas |
| puppeteer-core | 25.17.0 | Control del navegador |
| axe-core (cdnjs, fijado) | **4.10.3** | Etiquetas `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`; **con `prefers-reduced-motion: reduce`** para medir los colores en reposo |
| Script propio de luminancia WCAG | — | Contraste de los tokens de los tres modos; contraste de píxeles renderizados (cada texto dos veces, con su color y con `color: transparent`, comparando píxel a píxel; se da el «núcleo» del trazo) |
| `luz-check` | **0.2.1 local** (`~/Documents/repos/luz/packages/check`); `npx -y @luz-ds/check` **no se pudo ejecutar** (el permiso de red/instalación se denegó en esta sesión), así que no es la 0.3.2 de las auditorías anteriores | Solo sobre `index.html`, `style.css` y `blog.css`. No comprueba nombres, etiquetas, encabezados ni idioma: una pasada limpia no sería un resultado de accesibilidad |

**Páginas** (17): home, `/proyectos/`, `/proyectos/proyecto/?p=luz`, `/blog/`, cinco artículos (`analisis-del-popurri-de-la-ciudad-invisible` con cuatro vídeos, `aprendiendo-web-components` con código, `tu-navegador-sabe-sobre-ti-mas-de-lo-que-crees` con tablas, `margaret-hamilton`, `introduccion-a-la-ia` con línea de tiempo), `/blog/categoria/` y `?c=literatura-y-pensamiento`, `/blog/etiqueta/` y `?t=privacidad`, la 404, `/privacidad/`, `/cookies/` y `/creditos/`.

**axe: 204 pasadas de página** (17 páginas × 375 y 1280 × es y en × oscuro, claro y contraste alto), con el **banner de cookies visible en las 204**, recorriendo todo el scroll antes de medir.
**axe en estados: 78 pasadas** (375 y 1280 × es y en × tres modos): diálogo de ajustes abierto, puerta del vídeo (rechazado), fachada del vídeo (aceptado), diálogo de compartir (sin `navigator.share`, que es lo que abre el diálogo), panel de proyecto abierto (`#proyecto=luz`), índice del artículo abierto (solo 375) y home con la píldora anclada y desplazada.
**Teclado**: Tab real, 110 paradas como máximo por página, en **375×667, 768×1024 y 1280×720**, **con y sin banner**, en home, blog, `introduccion-a-la-ia`, artículo con vídeos, cookies, privacidad, créditos, 404 y proyectos (54 recorridos, unas 2.400 paradas). Se mide el porcentaje del rectángulo enfocado (40 puntos) que queda bajo un elemento `position: fixed`.
**Diálogos**: ajustes (desde la tarjeta y desde el pie), compartir, panel de proyecto (con y sin movimiento, Esc, ←/→, Atrás, carga directa con `#proyecto=ikay`), «Cambiar mi elección» de la política y «Aceptar y ver aquí» de la puerta.
**Modos y preferencias**: `forced-colors: active` (capturas de home, pie, banner, diálogos, paginación, chips, 404, píldora, índice, puerta del vídeo, tabla de la política), `prefers-reduced-motion` (fotogramas idénticos a 0, 2,5 y 5 s en 5 páginas), `prefers-contrast: more` y `prefers-color-scheme` (en vivo y al arrancar, por CDP), JS desactivado (17 páginas × 2 idiomas).
**Reflow**: 320×568 (17 páginas × 2 idiomas) con y sin el espaciado de 1.4.12 inyectado; texto fuera del viewport y elementos con `overflow: hidden/clip` recortando; 320×256 (400 % de zoom), 480×256, 667×375 y 320×480 con la tarjeta.
**Movimiento (2.2.2)**: sin `prefers-reduced-motion`, canvas por `toDataURL()` (hero, 404) y capturas (títulos de sección, bucles de imagen) a 1–16 s, sin tocar el puntero y después de moverlo; `document.getAnimations()` a 9–14 s.
**Contraste**: los tokens de los tres modos, por script (§5). Píxeles reales sobre canvas en los tres modos (§5).

Scripts, capturas y salidas en bruto: `/tmp/claude-1000/-home-ares-Documents-repos-me/ec501b2d-cac8-4ee3-8064-974f1a53d49f/scratchpad/fin/` (`lib.mjs`, `axe-matrix.mjs`, `axe-states.mjs`, `focus.mjs`, `focus-fixed.mjs`, `motion*.mjs`, `dlg*.mjs`, `reflow*.mjs`, `forced.mjs`, `pix.mjs`, `pill.mjs`, `out/`, `shots/`).

**Lo que no se ha comprobado**: lectores de pantalla (NVDA, JAWS, VoiceOver, TalkBack, Orca), dispositivos reales, Firefox y Safari (siguen sin poder controlarse desde puppeteer), alto contraste real de Windows (solo la emulación de Chromium), la rama de error de `navigator.clipboard.writeText`, las miniaturas reales de YouTube (se aborta toda petición fuera de `localhost`), `?p=2` y `?p=3` del blog, el peor punto de la píldora sobre imágenes oscuras en claro (se muestreó cada 450 px, no el punto de 16120 px), los AAA (44 px, 2.4.13) y la política de privacidad como texto legal (no es una cuestión de accesibilidad).

---

## 3. Lo que está bien hecho (hay que conservarlo en Astro)

- **axe, en los 17 × 12 estados de página y los 78 de estados: 0 `critical`, 1 `serious`** (`.pager__dir.is-off`, F3). El resto son `moderate`: `landmark-unique`, `landmark-complementary-is-top-level`, `heading-order`. Con el diálogo de ajustes, el de compartir y el panel de proyecto abiertos: **0 violaciones**.
- **`--faint-text` y la pareja gris**: `#969189` sobre `#292929` 4,65:1 (5,02 sobre `#232323`), `#56626e` sobre `#e9eff5` 5,38:1 (4,80 sobre `#d9e3ed`), `#c9c9c9` sobre negro 12,68:1. El gris decorativo (`--faint` `#6f6c68`, puntos y líneas) queda aparte. Lo que era el hallazgo 2 desaparece de axe (de 1.156 nodos a 0).
- **El acento verde** como texto: `#22c55e` sobre `#292929` 6,38:1; `#0a6f35` sobre `#e9eff5` 5,43:1 (sobre `--bg-2` 4,84:1); `#5dff8f` sobre negro 16,17:1. Y los «textos sobre acento» (`--on-matrix`): 7,64 · 5,43 · 16,17:1. Contador del chip actual (`--matrix-on-ink`): 5,93 · 12,10 · 6,63:1. Sin `filter: brightness()`: axe mide lo que se ve.
- **La regla de los 5 s (2.2.2) funciona**. Hero y 404: el canvas queda **idéntico desde ≈ 5,5 s** sin tocar el puntero (hash estable de 5,5 a 16 s) y se despierta al mover el puntero; tras dejar de moverlo se detiene otra vez a los 6,5 s (hero, 1280 y 375). Los bucles de imagen hacen **un ciclo y quedan en reposo** (`.is-rest` a los 5–6 s; las filas fuera de pantalla no empiezan). Los títulos de sección son estables desde el 5.º segundo. El cursor del hero parpadea 4 veces y el punto del aviso de la 404 3 (`style.css:181`, `blog.css:484`). Con `prefers-reduced-motion: reduce`, 5 páginas dan el mismo fotograma a 0, 2,5 y 5 s y `getAnimations()` está en 0.
- **Reflow a 320 px**: 17 páginas × es y en, **0 desbordes y 0 textos recortados**, con y sin el espaciado de 1.4.12. La 404 y la nube de etiquetas, que fallaban, ya caben. Sin recortes con `overflow: hidden/clip`.
- **Pie en cuatro grupos**: `<h2>` por grupo, `nav` / `section` con nombre, orden lógico, enlaces de 31 px de alto (≥ 24: 2.5.8), «Ajustes de cookies» como `<button>` en la lista de «Sobre esta web» (invisible, con `visibility: hidden`, hasta que LUZ lo activa; sin JS no existe: no hay botón muerto), enlaces externos con «(se abre en otra pestaña)» y glifo `aria-hidden`.
- **Tarjeta de cookies**: texto en `<p>`, no en encabezado (arregla C8), `region` llamado «Cookies», es lo primero tras «Saltar al contenido» (Tab, Tab: política, Aceptar, Rechazar, Ajustes), no toma el foco, botones de 44 px. Diálogo de ajustes nativo: el foco entra en la casilla, Tab no sale, Esc devuelve el foco a «Ajustes». «Ajustes de cookies» del pie reabre la tarjeta (el foco va a ella) y **al elegir vuelve al botón del pie**.
- **«Cambiar mi elección» de la política** devuelve el foco al propio botón (arregla C3) y la tabla de datos de `/cookies/` es una región con nombre, `tabindex="0"` y `th scope` (`blog.js:692`).
- **Compartir artículo**: un botón con `aria-haspopup="dialog"`, diálogo nativo con el título como nombre, el foco entra en «Cerrar», Esc devuelve el foco al botón, «Copiar enlace» con `role="status"` («Enlace copiado») y alternativa de seleccionar el campo.
- **Puerta del vídeo**: el texto de la interfaz lleva el `lang` de la página (`blog.js:483`), el grupo se llama como el vídeo (los 10 tienen título ya, arregla C4 y el hallazgo 12; si falta, «Vídeo de YouTube»), «Aceptar y ver aquí» mueve el foco al `iframe` (con `title`), el título sobre la miniatura va sobre placa negra (`blog.css:263`) y los demás vídeos cambian a fachada al instante.
- **Código**: `<pre tabindex="0" role="region" aria-label>` con el lenguaje (arregla el hallazgo 5), botón «Copiar» de LUZ con nombre que contiene el texto visible.
- **Panel de proyecto con dirección** (`#proyecto=<id>`): Atrás lo cierra y devuelve el foco a «Abrir…», la carga directa con el hash abre el panel con el foco en el título.
- **Lang**: las filas, el destacado, el índice, «anterior/siguiente», los resultados de la 404, los créditos y el texto compartido llevan `lang="es"` en la interfaz inglesa (comprobado con una sonda sobre 10 páginas en `?lang=en`). El conmutador de idioma lleva `lang`, `hreflang` y nombre completo en el enlace.
- **Pie, tarjeta, diálogos y botón de color en `forced-colors`**: borde `CanvasText`, botones subrayados, foco del sistema visible (capturas).
- **Foco**: `3px dotted var(--ink)` con separación de 5 px, 13:1 sobre `#292929`, 14:1 sobre `#232323`.
- **Modo de color**: el nombre del botón sigue al modo (`Modo de color: Oscuro / Claro / Contraste alto`), el cambio del sistema a claro ya no mueve la página (`autoMode = () => 'dark'`, `theme.js:50`), `prefers-contrast: more` arranca en contraste alto.
- **Hero**: el texto escrito letra a letra va en `aria-hidden` y el texto real en una copia `.vh` (`poster.js`); el `<h1>` sigue llamándose «Nando Muñoz».

---

## 4. Hallazgos

### 4.1 Tabla (cada fila lleva su cubo del plan, su etiqueta y si lo arregla el HTML estático)

Etiquetas: `confirmado` (en el código con `ruta:línea` o medido en la página renderizada) o `necesita tecnología de apoyo` (hipótesis).
Cubos: **Cambiar** (falla un criterio AA o un defecto reproducible) · **Mejorar** (riesgo, buena práctica, AAA) · **Dejar** (ya está bien, en el §3).

| # | Sev. | Cubo | Hallazgo | Criterio · nivel · EN 301 549 | Etiqueta | ¿Maqueta o Astro? | Fase Astro | ¿Lo arregla el HTML estático? |
|---|---|---|---|---|---|---|---|---|
| 0 | Bloqueante | Cambiar | Sin JS todas las páginas interiores dicen «Esta web necesita JavaScript.» | método LUZ | confirmado | **Astro** (no se toca en la maqueta) | 1, 3–9 | **Sí** |
| F1 | Serio | Cambiar | Foco 100 % tapado por la píldora y por la tarjeta: 29 casos | 2.4.11 AA · *no exigido aún por EN 301 549 v3.2.1* | confirmado | **Maqueta** (CSS) y Astro (variable `--fixed-bottom`) | 4 | No |
| F2 | Serio | Cambiar | Tarjeta de cookies pisada por la cabecera y el menú con la ventana ≤ 30 rem de alto | 1.4.10 AA · EN 9.1.4.10; 1.4.4 AA · EN 9.1.4.4 | confirmado | **Maqueta** | 4 | No |
| F3 | Serio | Cambiar | «← Más recientes» / «Anteriores →» inactivos: 1,66 · 2,05 · 3,6:1 (axe `serious`, 12 de 12 pasadas del blog) | 1.4.3 AA · EN 9.1.4.3 (discutible: inactivo) | confirmado | **Maqueta** | 8 | No |
| F4 | Serio | Cambiar | Estado «actual» solo por color y fondo de puntos; en `forced-colors` desaparece | 1.4.1 A · EN 9.1.4.1; 1.4.11 AA · EN 9.1.4.11 | confirmado | **Maqueta** (token + `[aria-current]`) | 2, 4, 7, 8 | No |
| F5 | Moderado | Cambiar | El idioma actual del conmutador no llega a los lectores de pantalla | 4.1.2 A · EN 9.4.1.2 | confirmado (árbol de accesibilidad); texto de lector: necesita tecnología de apoyo | **Maqueta** | 4 | No |
| F6 | Moderado | Cambiar | Dos `nav` «Secciones»; dos `pre role=region` con el mismo nombre (axe `landmark-unique`) | 1.3.1 A / 2.4.6 AA (buena práctica) | confirmado | **Maqueta** | 4, 8 | No |
| F7 | Moderado | Cambiar | Panel de proyecto: Esc durante el vuelo borra la dirección y, con una flecha después, otro Esc saca de la página; el foco vuelve al último proyecto visto | 2.1.1 A · EN 9.2.1.1 / 3.2.1 A (riesgo); 2.4.3 A | confirmado | **Maqueta** | 6 | No |
| F8 | Moderado | Cambiar | Paginación: nombre «Página 1 de 3», etiqueta visible «01» | 2.5.3 A · EN 9.2.5.3 | confirmado | **Maqueta** | 8 | No |
| F9 | Moderado | Cambiar | Tablas con scroll de los artículos: región enfocable sin rol ni nombre | 4.1.2 A · EN 9.4.1.2; 1.3.1 A | confirmado | **Maqueta** | 8 | No |
| F10 | Moderado | Cambiar | Buscador de la 404 en `forced-colors`: sin borde, sin línea (`::after` a `none`), foco solo con el cursor; icono de borrar con `filter: invert(1)` fijo | 2.4.7 AA · EN 9.2.4.7; 1.4.11 AA · EN 9.1.4.11 | confirmado | **Maqueta** | 2, 9 | No |
| F11 | Moderado | Cambiar | Enlace de categoría de las filas: 119×16 px, solapado con el enlace estirado | 2.5.8 AA · *no exigido aún por EN 301 549 v3.2.1* | confirmado | **Maqueta** | 7, 8 | No |
| F12 | Moderado | Cambiar | Título del vídeo (en español) dentro de la puerta `lang="en"`: se lee con voz inglesa | 3.1.2 AA · EN 9.3.1.2 | confirmado (marcado); la voz: necesita tecnología de apoyo | **Maqueta** y Astro (`<YtGate>`) | 3, 8 | No |
| F13 | Menor | Cambiar | Encabezados: leyenda `<h3>` justo tras el `<h1>` (`/proyectos/`, `/blog/categoria/`, 24 pasadas); `<aside>` anidados (72) y `<aside>` vacío en la ficha | 1.3.1 A (buena práctica, axe `heading-order`, `landmark-complementary-is-top-level`) | confirmado | **Maqueta** | 6–8 | No |
| F14 | Menor | Cambiar | `aria-current="page"` en «Blog» dentro de un artículo; migas como `<p>` sin `nav` | 1.3.1 A / 2.4.8 AAA | confirmado | **Maqueta** (Astro lo decide en el build) | 4, 8 | En parte |
| F15 | Menor | Cambiar | Buscador de la 404 sin rellenar y Enter sin efecto | 3.3.2 / 3.2.2 (riesgo) | confirmado | **Maqueta** o Astro (`<form method="get">`) | 9 | En parte |
| F16 | Menor | Cambiar | Diálogo de ajustes: un clic en su relleno (8 px dentro del borde) lo cierra; dos anuncios corteses al elegir desde la política; el foco va a `<main>` sin anillo | buenas prácticas (2.5.2 riesgo); 4.1.3 AA (riesgo) | confirmado (cierre) · necesita tecnología de apoyo (doble anuncio) | **Maqueta** | 4, 7 | No |
| F17 | Menor | Cambiar | Píldora y botón de color translúcidos al 82 % en `forced-colors` (el texto de detrás se transparenta) | 1.4.11 / 1.4.3 (riesgo) | confirmado (capturas) | **Maqueta** | 4 | No |
| F18 | Menor | Cambiar | Canvas con la tinta del modo, no con la paleta del sistema: en `forced-colors` los títulos hechos de puntos casi no se ven (capturas de `/proyectos/`) | 1.4.11 (riesgo; el texto real está en `.vh`) | confirmado | **Maqueta** (motor) | 5 | No |
| F19 | Menor | Cambiar | El botón del modo de color: última parada de Tab, fuera de toda región, su nombre dice el estado, foco sobre fotos sin halo | 2.4.3 A (buena práctica); 4.1.2; 2.4.7 | confirmado (CSS sin cambios, `style.css:636`) · necesita tecnología de apoyo (anuncio) | **Maqueta** | 4 | No |
| F20 | Menor | Cambiar | `alt=""` en 6 imágenes de los artículos (5 con pie, 1 sin él: la de IKAY); dos artículos con el mismo título | 1.1.1 A · EN 9.1.1.1; 2.4.4 A (riesgo) | confirmado (vacío) · decide el dueño | **Maqueta** o Astro (esquema) | 3 | No |
| F21 | Menor | Mejorar | Texto de 9,6–11 px en `--faint-text`/`--gloss`: cumple en nominal (4,65:1) pero el núcleo renderizado queda en 3,1–3,8:1 (`.hero__pre`, `.gloss`, `.post__meta dt`, `.author__by`, `.post__credit`, `.feat__meta`, `.lost__hint`) | 1.4.3 AA (margen escaso) | confirmado | **Maqueta** (token) | 2 | No |
| F22 | Menor | Mejorar | La tarjeta de cookies cubre el crédito del hero (el `<h1>` y el rol) al 96–100 % en la primera vista de 1280×800 y de 375×812 | no es un criterio (el texto está en el DOM) | confirmado | **Maqueta** (diseño) | 4 | No |
| F23 | Menor | Mejorar | Glifos dentro de nombres («← Más reciente», «Más antiguo →», «Anteriores →»); enlaces externos de los cuerpos sin aviso; imágenes en gris hasta el ratón; juego de la 404 solo con puntero | 2.4.4 / 4.1.2 (riesgo); 3.2.5 AAA; 1.4.1 (riesgo); 2.1.1 (decorativo) | confirmado (marcado) · necesita tecnología de apoyo (lectura) | **Maqueta** o Astro | 4, 8, 9 | No |
| **Solo AAA** | | | | | | | | |
| A1 | AAA | Mejorar | 2.4.12: con la píldora y la tarjeta, 127 paradas con más del 20 % tapado (3 tras el arreglo de F1) | 2.4.12 AAA | confirmado | Maqueta | 4 | No |
| A2 | AAA | Mejorar | 2.5.5: objetivos de 44 px (enlaces de la píldora de 25 px de alto en escritorio, del pie 31 px) | 2.5.5 AAA | confirmado | Maqueta | 4 | No |
| A3 | AAA | Mejorar | 1.4.6: `--faint-text` 4,65:1 no llega a 7:1 (`--mute` 7,19:1 sí) | 1.4.6 AAA | confirmado | Maqueta | 2 | No |
| A4 | AAA | Mejorar | 3.2.5: enlaces de la prosa que abren pestaña nueva sin avisar | 3.2.5 AAA | confirmado | Maqueta o Astro | 3, 8 | No |
| A5 | AAA | Mejorar | 2.4.13: foco punteado (huecos); en contraste alto convendría continuo | 2.4.13 AAA | confirmado | Maqueta | 2 | No |

### 4.2 Detalle

#### 0 · Sin JavaScript — bloqueante · confirmado · lo arregla Astro
17 páginas × 2 idiomas con JS desactivado. Home: menú, `<h1>`, 8 enlaces, sin bio, proyectos, artículos ni redes. Las 15 restantes (404 incluida): «Esta web necesita JavaScript.», 0 enlaces, 0 `<h1>`; `?lang=en` en la home sin JS sigue con `<html lang="es">`. Sin JS no hay tarjeta de cookies ni botón del pie: bien, pero hay que decirlo. Fase 1, 3–9: HTML completo desde el build, con `<html lang>` y `<noscript>` en el idioma de la página.

#### F1 · Foco tapado por la píldora y por la tarjeta — serio · confirmado · 2.4.11 AA (WCAG 2.2)
- **Evidencia.** Tab real, rectángulo enfocado muestreado en 40 puntos con `elementFromPoint`, solo los fijados. 54 recorridos (375×667, 768×1024, 1280×720 × tarjeta visible o no × 9 páginas). **29 paradas 100 % tapadas** (9 a 375 px, 15 a 768, 5 a 1280) y 127 con más del 20 %.
  - 375 px, todo por la píldora: «Claude Sonnet 5», «Escríbeme», «Código y gestión» (`introduccion-a-la-ia`), «LUZ» (`/proyectos/`), «Código y gestión» (`/blog/` y la 404), «GPT-6 Astra», «Unsplash» (`/creditos/`).
  - 768 px: pie de la home («GitHub», «LinkedIn», «X», «RSS») bajo la tarjeta, «Página 3 de 3» y «Anteriores →» bajo la tarjeta, «Política de cookies» de la puerta del vídeo, y «RSS» bajo la píldora.
  - 1280 px, con la tarjeta: «Código y gestión» (home, blog, 404), «English» (blog), un artículo de la 404.
- **Causa.** `style.css:573` descuenta la tarjeta solo por debajo de 48 em y `style.css:588` pone `scroll-padding-bottom: 0` por encima; **la píldora (`style.css:158`, fija, 46 px) no descuenta nada nunca**. El navegador pone el elemento justo al borde inferior, donde están ellas.
- **Qué vive el usuario.** Quien navega con teclado llega a «Ajustes de cookies», a una redes del pie o a un enlace del texto y **no ve dónde está**. Es el mismo hallazgo 26/C1 de las dos auditorías anteriores, **sin cambios**.
- **Arreglo probado** (inyectado, sin tocar el archivo; el mismo recorrido de 54 pasadas da **0 paradas tapadas del todo y 3 con más del 20 %**, frente a 29 y 127):

```css
@media (max-width: 63.99em) {
  :root.docked { scroll-padding-bottom: 6rem; }
  :root.docked:has(luz-cookie-consent > :not([hidden])) { scroll-padding-bottom: calc(var(--luz-consent-h, 0px) + 6rem); }
}
@media (min-width: 64em) {
  :root:has(luz-cookie-consent > :not([hidden])) { scroll-padding-bottom: calc(var(--luz-consent-h, 0px) + 1.5rem); }
}
```
- **En Astro + LUZ.** Una sola variable `--fixed-bottom` que publica el chrome (píldora anclada + tarjeta, medidas con el `ResizeObserver` que ya existe en `pillRoom`), usada por `scroll-padding-bottom` y `scroll-margin-bottom`. Incluir el recorrido de teclado a 375, 768 y 1280 en la Fase 10.
- **Fase.** 4.

#### F2 · La tarjeta de cookies y la cabecera se pisan en ventanas bajas — serio · confirmado · 1.4.10 AA · 1.4.4 AA
- **Evidencia.** A 320×256 (400 % de zoom en una ventana de 1280×1024), 480×256, 667×375 y 320×480, la tarjeta es `position: relative` (`style.css:569` solo la fija con `height > 30rem`) y va la **primera tras el enlace de saltar**, así que ocupa de 0 a 105–144 px. La cabecera (`.top`, `style.css:128`) y el menú (`.nav`, `style.css:~146`) son `position: absolute` con `z-index` 5 y 6: **se pintan encima del texto de la tarjeta**. A 667×375: el logo «NM Nando Muñoz» y «ES · EN» tapan «Sin cookies propias. Solo los vídeos…»; a 320×256 el menú entero cae sobre la tarjeta (16.800 px² de solape). Capturas: `shots/short-blog-667x375.png`, `short-blog-320x256.png`.
- **Qué vive el usuario.** Quien amplía al 400 % (el caso típico de baja visión en un portátil) o tiene el móvil en horizontal no puede leer el aviso hasta que lo elige, y no puede elegir bien porque el texto y los botones se pisan.
- **Residuo del hallazgo M3** (el botón de color): ya no sube sobre una tarjeta no fija, pero a 320×256 sigue solapando 10 px (440 px²) del pie de la tarjeta.
- **Arreglo en la maqueta.** Dentro de la misma consulta, `@media screen and (height <= 30rem) { .luz-cookie-consent { padding-top: calc(var(--luz-masthead-h, 6rem)); } }`: la tarjeta en flujo deja sitio a la cabecera y al menú. O que, en ese caso, la cabecera y el menú no sean `absolute` sino flujo normal. Probar en 320×256 que botón, cabecera y menú no solapen la tarjeta.
- **En Astro.** El layout reserva el alto de la cabecera encima de cualquier cosa en flujo; la tarjeta va después de la cabecera en el DOM si LUZ lo permite (hoy LUZ la quiere primera: preguntar).
- **Fase.** 4.

#### F3 · «← Más recientes» inactivo — serio (axe) · confirmado · 1.4.3 AA
- **Evidencia.** `/blog/` en las 12 combinaciones: axe `color-contrast` `serious` en `.pager__dir.is-off` (`blog.js:218, 220`; `blog.css:76`: `--faint` al 50 % de opacidad). Medido: 1,66:1 (oscuro), 2,05 (claro), 3,6 (contraste alto). Es el M18 de la auditoría de modos, que decía «inactivo, exento». axe no lo exime porque es un `<span>`, no un control deshabilitado.
- **Impacto.** Es texto que dice «aquí no hay más» y casi no se lee. Cuenta en el gate de axe de LUZ (`serious` bloquea).
- **Arreglo.** O no pintarlo cuando no hay página anterior/siguiente (la paginación `01 02 03` ya lo dice), o `aria-disabled="true"` en un `<a>` sin `href` y `color: var(--faint-text)` sin opacidad (4,65:1).
- **Fase.** 8.

#### F4 · «Actual» solo por color — serio · confirmado · 1.4.1 A · 1.4.11 AA
- **Evidencia.** `style.css:157` (menú: de `--mute` a `--ink` y número en el acento), `blog.css:27, 28` (chip: fondo tinta; en `forced-colors` el fondo se anula), `blog.css:80` (paginación: fila de puntos `radial-gradient`), `blog.css:157, 158` (índice: igual que el menú). Capturas en `forced-colors` (`shots/fc-projs-chips-1280.png`, `fc-blog-pager-1280.png`, `fc-post-pill-375.png`): el chip «LUZ 3» en `?tech=LUZ`, la página «01» y la sección actual de la píldora son **idénticos** a los demás. El `aria-current` sí llega a los lectores de pantalla.
- **Impacto.** Con alto contraste de Windows, con daltonismo o con baja visión no se sabe en qué sección, página o filtro se está. En el modo de contraste alto del sitio, tinta y apagado (`#fff` frente a `#f0f0f0`) dan 1,14:1 entre sí.
- **Arreglo en el tema (Astro + LUZ) y ya en la maqueta.** Una marca que no es color en una regla compartida: `[aria-current]:not(.pager__dir) { text-decoration: underline 2px; text-underline-offset: .3em; }` (el subrayado sólido sobrevive a `forced-colors`), el chip actual con `outline: 2px solid` además del fondo, y en `@media (forced-colors: active)` los mismos estados con `Highlight`. En contraste alto, `--mute` a `#d0d0d0` para dejar un paso real frente a la tinta.
- **Fase.** 2 (token y `[aria-current]`), 4, 7, 8.

#### F5 · El idioma actual no llega a los lectores de pantalla — moderado · confirmado
- **Evidencia.** `blog/parts.js:106`: `el('span', { class: 'langs__cur', lang: l, 'aria-current': 'true', 'aria-label': name, text: code })`. `aria-label` está prohibido en un `span` sin rol y Chromium lo ignora: el árbol de accesibilidad (`Accessibility.getFullAXTree`, home 1280) dice `group "Idioma"` con un solo hijo, `link "English"`. Lo mismo en el pie. Quien usa lector oye «Idioma, grupo, English, enlace» y no sabe que está en español.
- **Arreglo.** Texto oculto en el propio elemento: `<span class="langs__cur" lang="es" aria-current="true">ES<span class="vh"> · Español, idioma actual</span></span>`. O la opción actual como `<a href="…mismo enlace…" aria-current="true" lang="es" aria-label="Español">ES</a>` (patrón habitual). El que tenga más peso para los lectores se prueba en el §8.
- **Fase.** 4.

#### F6 · Regiones con el mismo nombre — moderado · confirmado
- **Evidencia.** axe `landmark-unique` en las 204 pasadas: `#nav` (la píldora, `aria-label="Secciones"`) y el `nav` del pie (`aria-labelledby` al `<h2>` «Secciones»). En `aprendiendo-web-components` además `pre[aria-label="HTML"]` ×2 y `pre[aria-label="JavaScript"]` ×2 (`blog/code.js`).
- **Arreglo.** Píldora: `aria-label="Principal"` / «Main»; pie: «Secciones» queda. Código: `aria-label` con orden: «Código HTML, ejemplo 1 de 2». Con un solo bloque, el nombre actual vale.
- **Fase.** 4, 8.

#### F7 · Panel de proyecto: Esc temprano y retorno del foco — moderado · confirmado
- **Evidencia.** Con movimiento, Esc a los 250 ms del Enter: el panel **sigue abierto** (`busy`, `main.js:324-342`), pero `close()` ya llamó a `history.back()` (`main.js:340`): la URL pierde `#proyecto=luz` (`state: null`) y el panel queda abierto sin dirección. Si después se pasa de proyecto (←/→), `replaceState` escribe el hash sobre la entrada anterior (`main.js:366`) y **el siguiente Esc hace `history.back()` y saca de la página** (en una pasada de prueba la página dejó de ser la home: la sonda ya no encontró `#panel`). Sin pulsar Esc pronto, el ciclo completo funciona: Esc cierra, Atrás cierra, la carga directa con hash abre.
- **Retorno del foco** (hallazgo 17): sigue yendo al «Abrir…» del último proyecto visto, no al que abrió el diálogo (`main.js:356`).
- **Arreglo.** Que `close()` no llame a `history.back()` mientras `busy` (o que lo encole), y que Esc cancele el vuelo y cierre. Decidir y documentar el retorno del foco (al último visto es defendible porque la página se desplaza hasta él).
- **Fase.** 6.

#### F8 · Paginación: nombre sin la etiqueta visible — moderado · confirmado · 2.5.3 A
`blog.js:216`: `aria-label: 'Página 1 de 3'` con texto visible «01». Control por voz: «pulsa 01» no encuentra el enlace. **Arreglo**: contenido `<span class="vh">Página </span>01<span class="vh"> de 03</span>`, o `aria-label="01, página 1 de 3"` (empieza por lo visible). Fase 8.

#### F9 · Tablas con scroll sin nombre — moderado · confirmado
`blog.js:434`: `<div class="prose__scroll" tabindex="0">` sin `role` ni `aria-label`; el pie va en un `<figcaption>` aparte. (La política sí lo hace bien, `blog.js:692`.) **Arreglo**: `role="region" aria-labelledby` al `<caption>` y la tabla con `<caption>`; en Astro, un plugin de rehype que envuelva cada `<table>`. Fase 8.

#### F10 · Buscador de la 404 en `forced-colors` — moderado · confirmado
`blog.css:496-506`: el `<input>` lleva `border: 0; outline: none`, la línea de puntos es un `::after` con `radial-gradient` (`getComputedStyle(…,'::after').backgroundImage === 'none'` en `forced-colors`) y el foco solo cambia el tono de esa línea con `filter: brightness(1.5)`. Se ve el texto de ejemplo y el cursor, pero no el campo ni el foco (`shots/fc-404-search-focus-1280.png`). El icono nativo de borrar usa `filter: invert(1) grayscale(1)` fijo (M14). **Arreglo**: borde inferior real `1px solid var(--faint-text)` (≥ 3:1), `:focus-within` con el anillo global, `@media (forced-colors: active) { input { border: 1px solid CanvasText } }`, y quitar el `filter` del icono. Fase 2, 9.

#### F11 · Enlace de categoría de 16 px — moderado · confirmado · 2.5.8 AA (WCAG 2.2)
`.brow__cat` 119×16 px (`blog.css:57`, medido), encima del enlace estirado de la fila (`blog.css:60`). **Arreglo**: `padding-block: .45rem; margin-block: -.45rem`. Fase 7, 8.

#### F12 · Título de vídeo en español dentro de `lang="en"` — moderado · confirmado (marcado)
`/blog/articulo/?a=analisis-del-popurri-de-la-ciudad-invisible&lang=en`: `.video__gate` lleva `lang="en"` (`blog.js:483`, arregla C2 para el texto de interfaz) pero el título del vídeo (visible, `.video__gate-title`, y `aria-label` del grupo) está en español y hereda `en`. **Arreglo**: `el('span', { lang: video.lang ?? postLang, text: name })` para el título visible; el `aria-label` no puede llevar `lang`, así que mejor `aria-labelledby` apuntando al `<p class="video__gate-title">`. Astro: `<YtGate>` con `lang={uiLang}` en sus textos y `lang={video.lang ?? post.lang}` en el título. Fase 3, 8.

#### F13 – F23 · Resto de menores
- **F13** (`blog.js:345, 640`): la leyenda es un `<h3>` justo tras el `<h1>` (axe `heading-order`, 24 pasadas) y un `<aside>` dentro de `<section>`/`<article>` (72 pasadas); la ficha de proyecto genera un `<aside class="post__side">` vacío (`blog.js:675`). Arreglo: leyenda como `<div role="group" aria-labelledby>` o `<h2>`, lateral del artículo como `<nav aria-label="En este artículo">`, sin `<aside>` vacío.
- **F14**: `blog.js:48` pone `aria-current="page"` en «03 Blog» en artículos, categorías y etiquetas; debe ser `true` (sección) salvo en `/blog/`. Las migas siguen siendo `<p class="crumbs">` (`blog.js:178, 559`): `<nav aria-label="Migas"><ol>`.
- **F15**: `blog.js:279, 296`: el campo no se rellena con la conjetura y Enter no hace nada (`blog.js:254`). Astro: `<form role="search" action="/buscar/" method="get">`.
- **F16**: `consent.js:96-97`: `pointerdown` y `click` solo comprueban `e.target === dialog`, y el relleno del `<dialog>` es el propio `<dialog>`: un clic a 8 px del borde lo cierra (medido: `open === false`). En la política hay dos regiones corteses (`blog.js:715` y `consent.js:status`) con texto nuevo al elegir. El foco a `<main>` sigue sin anillo (`style.css:[tabindex="-1"]:focus`).
- **F17**: `style.css:158-165` y `:621-625`: fondo `color-mix(… 82 %, transparent)` con `backdrop-filter`; en `forced-colors` queda `rgba(255,255,255,.82)` (medido). Añadir `@media (forced-colors: active) { .docked .nav, .luz-theme-mode__button { background: Canvas; backdrop-filter: none; border: 1px solid CanvasText } }`.
- **F18**: `dots.js` `readPalette()` no lee `CanvasText`: en `forced-colors` con modo oscuro, los títulos hechos de puntos («Proyectos») se ven casi blancos sobre blanco (`shots/fc-projs-chips-1280.png`). El texto real está en `.vh` y los canvas son decorativos.
- **F19**: `theme.js` inserta el botón al final del `<body>`: 46.ª parada de Tab de 46 en la home, fuera de `header`, `main` y `footer`. Foco `3px dotted var(--ink)` sin halo (`style.css:636`): sobre fotos, en móvil, el anillo se pierde (medido en la auditoría de modos: 1,2–2,3:1). El nombre dice el estado. Arreglo en Astro: ponerlo en el `<header>` tras el conmutador de idioma o dentro del grupo «Preferencias» del pie (el plan §14 ya lo dice).
- **F20**: seis `alt: ""` en `shared/blog.json` (cinco con pie en `tu-empresa-necesita-un-sistema-de-diseno-y-no-lo-sabes`, una sin él en `tu-navegador-sabe-sobre-ti-mas-de-lo-que-crees`); `introduccion-a-la-ia` e `introduccion-a-la-ia-2` comparten título. Decide el dueño.
- **F21**: medido con píxeles reales: `.hero__pre` 3,1:1 (nominal 4,65), `.gloss` 3,2, `.post__meta dt` 3,6, `.post__credit` 3,65, `.author__by` 3,7, `.feat__meta` 3,75, `.lost__hint` 3,7. Cumple por el método (axe y el cálculo con los valores reales), pero el margen es de 0,15 y la tipografía es de 9,6–11,2 px en mayúsculas. Subir `--faint-text` oscuro a `#a8a39b` (≈ 5,6:1) o aumentar el cuerpo a 12 px. Decisión de diseño.
- **F22**: la tarjeta cubre el crédito del hero (96 % del `<h1>` y 79 % del rol a 1280×800; 100 % a 375×812; `shots/fc-home-top-1280.png`). No es un criterio (el texto está en el DOM y se descubre al elegir o desplazar), pero es lo primero que quien llega debería leer. Opciones: la tarjeta a la esquina izquierda, o el crédito con `max-width` que la evite.
- **F23**: `blog.js:218-220`, `blog.js:550-551`: las flechas van dentro del texto del enlace sin `aria-hidden`; `blog.js:513` abre los enlaces externos del cuerpo con `target="_blank"` sin aviso; `blog.css:179` las imágenes de la prosa en gris hasta el ratón; `blog.js:263` el juego de la 404 solo con puntero.

#### Solo AAA
- **A1 · 2.4.12**: 127 paradas con más del 20 % tapado; el arreglo de F1 las deja en 3.
- **A2 · 2.5.5**: enlaces de la píldora de 25 px de alto en escritorio, del pie 31 px.
- **A3 · 1.4.6**: `--faint-text` a 4,65:1; `--mute` 7,19:1 y `--ink` 13:1 sí llegan.
- **A4 · 3.2.5** y **A5 · 2.4.13**: igual que en los informes anteriores.

---

## 5. Contraste de los tokens nuevos (por script, valores reales)

Texto 4,5:1 (3:1 si es grande). No texto 3:1. Sobre `--bg` / `--bg-2`.

| Par | Oscuro | Claro | Contraste alto |
|---|---|---|---|
| `--ink` / `--bg` · `--bg-2` | 13,01 · 14,06 | 13,90 · 12,39 | 21,00 · 19,44 |
| `--mute` | 7,19 · 7,77 | 7,23 · 6,44 | 18,43 · 17,05 |
| `--prose` | 10,53 | 11,26 | 21,00 |
| **`--faint-text` y `--gloss`** | **4,65 · 5,02** | **5,38 · 4,80** | **12,68 · 11,74** |
| `--faint` (puntos y líneas; no es texto) | 2,79 | 5,38 | 12,68 |
| **Acento `--matrix`** como texto | **6,38 · 6,90** | **5,43 · 4,84** | **16,17 · 14,96** |
| `--on-matrix` sobre `--matrix` (▶ del vídeo, `::selection`) | 7,64 | 5,43 | 16,17 |
| `--matrix-on-ink` sobre `--ink` (contador del chip actual) | 5,93 | 12,10 | 6,63 |
| `--bg` sobre `--ink` (chip actual) | 13,01 | 13,90 | 21,00 |
| `--trace` (la estela de la escritura, 0,9 s, transitoria) | 2,36 | 11,69 | 5,87 |
| Foco `3px dotted --ink` | 13,01 · 14,06 | 13,90 · 12,39 | 21,00 · 19,44 |
| Líneas `--edge` 8 % · 12 % · 18 % / `--bg` (no son lo único que dibuja un componente) | 1,26 · 1,43 · 1,72 | 1,16 · 1,26 · 1,43 | 1,14 · 1,27 · 1,55 |

Todos los pares de texto cumplen 4,5:1 en nominal. `--trace` en oscuro (2,36:1) solo vive 900 ms mientras la letra se «posa»; no es texto en reposo. **Texto sobre canvas medido en píxeles** (núcleo del trazo, sin puntero, con movimiento reducido): `h1` del hero 8,7 · 10,0 · 13,8:1; kicker del hero 5,2 · 4,9 · 12,1; `.top__mark` 9,4 · 9,3 · 14,1; nombre de proyecto 13,0 · 13,9 · 21; leyenda 5,4 · 4,8 · 12,0. El cálculo del píxel queda por debajo del nominal en el texto fino (F21).
**Píldora sobre un artículo con muchas fotos** (50 posiciones de scroll a 375 px): texto de los enlaces, núcleo mínimo **9,1 · 6,6 · 12,8:1** (oscuro, claro, contraste alto). El M6 de la auditoría de modos (4,10:1 sobre una imagen oscura en claro) **no se reprodujo** en este muestreo; no se midió el punto exacto que se citó (scroll 16120).
**`luz-check` 0.2.1** (local) sobre `index.html`, `style.css` y `blog.css`: 26 bloqueos (25 `theme/contrast` y 1 `theme/unreadable`) y 385 avisos. Los bloqueos son los `--luz-code-*` del tema de código contra las superficies por defecto de LUZ (por ejemplo `--luz-code-name` en claro sobre `surface-muted` 1,3:1): el tema Trama no redefine los tokens `--luz-surface-*`, así que `luz-check` los compara con los claros de LUZ. Es lo mismo que decía la auditoría de modos: **en Astro el tema tiene que definir todos los tokens semánticos de LUZ en los tres modos**. 341 de los avisos son `css/literal-size` (rem sueltos en vez de `--luz-space-*`). Esto no es un resultado de accesibilidad.

---

## 6. Estado de los hallazgos anteriores

Leyenda: **Arreglado** (comprobado hoy) · **Parcial** · **Abierto** (comprobado hoy) · **No re-testeado**.

### 6.1 Informe general (`informe-accesibilidad-maqueta.md`)

| # | Hallazgo | Estado | Evidencia de hoy |
|---|---|---|---|
| 1 | Sin JS las páginas están vacías | **Abierto** (lo arregla Astro) | 15 de 17 páginas vacías; home sin contenido |
| 2 | Texto `--faint` a 2,79:1 | **Arreglado** | `--faint-text` 4,65 · 5,38 · 12,68:1; axe: 0 `color-contrast` salvo F3 (antes 1.156 nodos) |
| 3 | «Actual» solo por color; desaparece en `forced-colors` | **Abierto** | capturas `fc-*`; F4 |
| 4 | Reflow: 404 recortada, nube de etiquetas | **Arreglado** | 17 páginas × 2 idiomas a 320 px: 0 desbordes y 0 recortes, con 1.4.12 |
| 5 | Código con scroll sin teclado | **Arreglado** | `code.js`: `tabindex="0" role="region" aria-label`; axe 0 `scrollable-region-focusable` (queda F6, nombre repetido) |
| 6 | Buscador de la 404 sin borde ni foco en `forced-colors` | **Abierto** | F10 |
| 7 | Movimiento sin forma de pararlo | **Arreglado** (al límite) | hero y 404 en reposo a ≈ 5,5 s; bucles de imagen 1 ciclo; título de sección en reposo; cursor 4 y punto 3 parpadeos. Conviene bajar a 4,5 s para margen |
| 8 | Español sin `lang` en la interfaz inglesa | **Parcial** | arreglado en filas, destacado, índice, anterior/siguiente, resultados, créditos y puerta; falta el título del vídeo (F12) y el `<title>` (inevitable) |
| 9 | Tabla con scroll: región sin nombre | **Abierto** en artículos (arreglado en `/cookies/`) | F9 |
| 10 | Paginación: nombre sin la etiqueta visible | **Abierto** | F8 |
| 11 | «Copiar enlace» mudo | **Arreglado** | diálogo de compartir con `role="status"`, campo seleccionable; la rama de error de `clipboard` no se simuló |
| 12 | Vídeo sin título | **Arreglado** | los 10 vídeos tienen título; nombre por defecto |
| 13 | `alt=""` informativos | **Abierto** | F20: 6 imágenes |
| 14 | Orden de encabezados | **Parcial** | el `<h2>` de la tarjeta ya es `<p>`; sigue la leyenda `<h3>` (24 pasadas) |
| 15 | `<aside>` anidados y vacío | **Abierto** | 72 pasadas |
| 16 | `aria-current` y migas | **Abierto** | F14 |
| 17 | Diálogo: Esc tardío y retorno del foco | **Abierto** y peor | F7 |
| 18 | Glifos en nombres | **Abierto** (no re-testeado con tecnología de apoyo) | F23 |
| 19 | Canvas con tinta fija en `forced-colors` | **Abierto** | F18 |
| 20 | Buscador de la 404 sin relleno ni Enter | **Abierto** | F15 |
| 21 | Título del vídeo sobre la miniatura | **Arreglado** | placa negra al 74 % y `#fff` (`blog.css:263`) |
| 22 | Imágenes en gris hasta el ratón | **Abierto** | F23; la portada del artículo ahora tiene la pantalla de puntos que se aparta con el ratón |
| 23 | Recomponer la 404 solo con puntero | **Abierto** (decorativo) | F23 |
| 24 | Títulos de artículo repetidos | **Abierto** | F20 |
| 25 | Acento con `filter: brightness()` | **Arreglado** | `--blaze-lift: none` en los tres modos; acento verde |
| 26 | Foco tapado por la píldora y la tarjeta | **Abierto** | F1: 29 casos |
| 27 | Objetivo de 16 px junto al enlace estirado | **Abierto** | F11 |
| 28 | AAA: enlaces del cuerpo sin aviso de pestaña | **Abierto** | A4 |
| 29 | AAA: objetivos de 44 px | **No re-testeado** (los enlaces de la píldora miden 25 px de alto en escritorio) | A2 |
| 30 | AAA: foco parcialmente tapado | **Abierto** | A1 |
| 31 | AAA: `--faint` | **Parcial** | `--mute` 7,19:1; `--faint-text` 4,65:1 (AA, no AAA) |
| 32 | AAA: migas sin `<nav>` | **Abierto** | F14 |

### 6.2 Informe de cookies (`informe-accesibilidad-cookies.md`)

| # | Hallazgo | Estado | Evidencia de hoy |
|---|---|---|---|
| C1 | Foco tapado por la tarjeta y la píldora | **Abierto** | F1 |
| C2 | Texto inglés de la puerta dentro de `lang="es"` | **Parcial** | texto de interfaz con `lang="en"` (`blog.js:483`); el título del vídeo, no (F12) |
| C3 | «Cambiar mi elección» devuelve el foco al pie | **Arreglado** | el foco vuelve a «Cambiar mi elección» |
| C4 | Puerta sin nombre con el título vacío | **Arreglado** | todos los vídeos con título; nombre por defecto |
| C5 | Un clic en el relleno cierra el diálogo | **Abierto** | clic a 8 px del borde: cierra (F16); el código solo evita el arrastre de selección |
| C6 | Casilla marcada a 2,17:1 | **Arreglado** (por el token) | relleno verde `#22c55e` 6,9:1 · `#0a6f35` 4,8:1 · `#5dff8f` 15:1 sobre el fondo del diálogo; el borde sin marcar no se volvió a medir |
| C7 | Doble anuncio y foco a `<main>` sin anillo | **Abierto** (necesita tecnología de apoyo) | dos textos corteses en `/cookies/` |
| C8 | `h2` «Cookies» antes del `h1` | **Arreglado** | `<p class="luz-cookie-consent__title">` (`consent.js`) |
| C9 | Tamaños de 10–11 px, «Aceptar/Rechazar» sin objeto | **Abierto** (AAA / buena práctica) | sin cambios en `style.css` |

### 6.3 Informe de modos (`informe-accesibilidad-modos.md`)

| # | Hallazgo | Estado | Evidencia de hoy |
|---|---|---|---|
| M1 | Contador del chip actual y «texto sobre acento» | **Arreglado** | §5: 5,93 · 12,10 · 6,63:1 y 7,64 · 5,43 · 16,17:1 |
| M2 | Puerta del vídeo en claro | **Arreglado** | placa negra (mismo cambio que el 21) |
| M3 | El botón sube por una tarjeta que no está fija | **Arreglado** en lo suyo; **residuo** de 440 px² a 320×256 | y el defecto nuevo F2 |
| M4 | Bucles de imagen sin pausa | **Arreglado** | ver 7 |
| M5 | «Auto» se escapa | **Parcial** | el sistema en claro ya no mueve la página y el nombre sigue al modo; con `prefers-contrast: more` del sistema, la primera pulsación sale de contraste alto a claro |
| M6 | Píldora translúcida en claro | **No reproducido** | mínimo 6,6:1 en 50 posiciones de un artículo con fotos |
| M7 | Foco del botón sobre fotos | **No re-testeado** (CSS sin cambios, `style.css:636`) | F19 |
| M8 | Foco del buscador de la 404 en claro | **Abierto** | `blog.css:506` conserva `brightness(1.5)`; F10 |
| M9 | Contraste alto: «actual» y enlaces casi indistinguibles | **Abierto** | F4 |
| M10 | `forced-colors`: puntos según el modo | **Abierto** | F18 |
| M11 | Sin JS el modo no se aplica | **Abierto** | Astro lo mejora en parte |
| M12 | El botón es la última parada de Tab | **Abierto** | F19 |
| M13 | Botón solo con icono; nombre = estado | **Abierto** (necesita tecnología de apoyo) | F19 |
| M14 | Control nativo de borrar del buscador | **Abierto** | `blog.css:505` |
| M15 | Política: duración de la nota del color | **No re-testeado** (texto legal) | |
| M16 | Orden de la rotación oscuro → claro → contraste alto | **Abierto** (decisión del dueño) | |
| M17 | El modo no sigue `prefers-color-scheme` | **Sin cambio** (decisión): ahora es coherente | declararlo |
| M18 | `.pager__dir.is-off` | **Abierto** y en el gate de axe | F3 |
| M19 | Destello del lienzo antes de la hoja de estilos | **No re-testeado** | |

---

## 7. Por fases del plan

| Fase | Hallazgos |
|---|---|
| 1 · Andamiaje | 0 (HTML completo, `<html lang>` y `noscript` por idioma), M11 |
| 2 · Tema LUZ | F4, F10, F21, A3, A5; el tema define **todos** los tokens semánticos en los tres modos (`luz-check`); `--faint-text` ≥ `#969189` (mejor `#a8a39b`); estilo `[aria-current]` y bloque `forced-colors` |
| 3 · Colecciones | 0, F12, F20, A4 (`lang` y `title` del vídeo obligatorios; `alt` revisados; títulos distintos) |
| 4 · Chrome | **F1, F2**, F5, F6, F14, F16, F17, F19, F22, A1, A2 (`--fixed-bottom`, la tarjeta en ventanas bajas, conmutador de idioma, nombres de región, botón de color en el `<header>`, `forced-colors` de la píldora) |
| 5 · Motor de puntos | F18 (leer `CanvasText` en `forced-colors`); bajar el reposo a 4,5 s |
| 6 · Home | F7 (panel: `busy`, `history`, retorno del foco), F13 |
| 7 · Proyectos | F4, F11, F13 |
| 8 · Blog | F3, F4, F6, F8, F9, F11, F12, F13, F14, F20, F23 |
| 9 · 404 y búsqueda | F10, F15, F23 |
| 10 · Calidad | la lista del §9 |

**Lo que el paso a HTML estático arregla por sí solo:** el 0 entero. En parte: F14 (el `aria-current` se decide en el build) y F15 (`<form method="get">`). Lo **facilita** pero no lo arregla: F12 y F20 (el esquema de contenido exige `lang`, `title` y `alt`). **Nada más**: el foco tapado, los estados, la tarjeta, el conmutador de idioma y los nombres se arrastran tal cual si se copian el CSS y las plantillas.

---

## 8. Pruebas manuales pendientes (con tecnología de apoyo real)

| Prueba | Con qué | Qué mirar |
|---|---|---|
| Conmutador ES · EN | NVDA + Firefox, VoiceOver + Safari | Qué dice del idioma actual (F5); si «English, enlace» sin más basta |
| Foco tapado, con teclado en el móvil | Teclado Bluetooth + iOS y Android | Que el arreglo de F1 funciona con la barra del navegador que se esconde (`dvh`, `env(safe-area-inset-bottom)`) |
| Tarjeta en horizontal y al 400 % | Móvil en apaisado; portátil con zoom del 400 % | F2 |
| Aviso de cookies y su diálogo | NVDA, VoiceOver iOS, TalkBack | Orden, anuncio al elegir (doble anuncio, F16), retorno del foco |
| Puerta del vídeo en `?lang=en` | NVDA y VoiceOver con voces inglesa y española | Texto en inglés con voz inglesa, título en español con voz española (F12) |
| Diálogo de compartir | NVDA, VoiceOver | Anuncio de «Enlace copiado»; el enfoque dentro del diálogo; con `navigator.share` real en iOS/Android |
| Panel de proyecto con dirección | NVDA, VoiceOver iOS | Anuncio al abrir, Atrás, retorno del foco (F7) |
| Estado «actual» | Windows 11 con temas «Desierto» y «Acuático» | F4 con la paleta real |
| Buscador de la 404 | NVDA, JAWS, VoiceOver | `role="status"`; foco en alto contraste (F10) |
| Tabla de datos de la política | NVDA, VoiceOver | Región enfocable, navegación de tabla (Ctrl+Alt+flechas) |
| Pie en cuatro grupos | NVDA, VoiceOver | Lista de regiones y de encabezados: ¿se entiende «Sígueme», «Preferencias»? |
| Zoom y texto | Chrome, Firefox y Safari a 200 % y 400 %; iOS con texto grande | Reflow, F2, F22 |
| Control por voz | Voice Control, Dragon | «Pulsa 01» (F8), «Abrir LUZ», «English» |
| Safari y Firefox | — | `<dialog>`, `animation-timeline`, View Transition del menú y del modo |

---

## 9. Lista para pegar en la Fase 10 del plan

```markdown
#### Accesibilidad (WCAG 2.2 AA · EN 301 549 v3.2.1) — ver .ai/plan/informe-accesibilidad-final-maqueta.md
- [ ] Sin JS: todas las páginas (es/en) con contenido, `<h1>` y enlaces; Playwright con `javaScriptEnabled: false`
- [ ] axe-core 4.10.x (`wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`) a 375 y 1280, es y en, los tres modos, con `reducedMotion: 'reduce'` y **la tarjeta de cookies visible**: 0 `serious`/`critical`; y otra vez con el diálogo de ajustes, el de compartir, el panel de proyecto, la puerta del vídeo y el índice abiertos
- [ ] Teclado: recorrido con Tab a 375×667, 768×1024 y 1280×720, con y sin tarjeta: ningún elemento enfocado queda 100 % bajo la píldora ni la tarjeta (`--fixed-bottom`); anotar los que quedan por encima del 20 %
- [ ] Ventana baja: a 320×256, 480×256 y 667×375 con la tarjeta, la cabecera, el menú y el botón de color no solapan su texto
- [ ] Reflow a 320 px sin scroll horizontal ni texto recortado en las 17 plantillas; espaciado de 1.4.12 inyectado
- [ ] Contraste por script: todo texto ≥ 4,5:1 con los tokens de los tres modos; `--faint-text` ≥ 4,5:1 y, para texto de menos de 12 px, ≥ 5,5:1; «inactivo» no pintado con `--faint` al 50 %
- [ ] `luz-check --theme` sin bloqueos (el tema define todos los tokens semánticos de LUZ en los tres modos)
- [ ] Estado actual visible sin color (menú, índice, chips, paginación) y con `forced-colors: active`; foco y borde del buscador visibles en `forced-colors`
- [ ] `forced-colors: active`: píldora y botón de color opacos con borde; canvas en `CanvasText` o escondidos
- [ ] Movimiento: hero, 404 y bucles en reposo antes de 5 s (medido sobre el canvas, margen de 0,5 s); parpadeos ≤ 3 ciclos; `prefers-reduced-motion` deja todo quieto
- [ ] Nombres y regiones únicos: dos `nav` distintos, bloques de código con nombre que los distingue, idioma actual con texto accesible, paginación con la etiqueta visible dentro del nombre
- [ ] `lang`: títulos, entradillas y filas en otro idioma, y también el título del vídeo dentro de la puerta
- [ ] Panel de proyecto: Esc inmediato cierra sin dejar la historia rota; Atrás cierra; el foco vuelve al botón que lo abrió (o se documenta que vuelve al último visto)
- [ ] Diálogo de ajustes: no se cierra al hacer clic en su relleno; un solo anuncio al elegir; el foco vuelve a un sitio con anillo
- [ ] Tablas y código con scroll: `role="region"` con nombre
- [ ] Encabezados sin saltos; `aria-current="page"` solo en la página exacta; migas en `<nav>`
- [ ] Imágenes: `alt` revisado una a una; sin imágenes informativas en gris
- [ ] Revisión manual con NVDA + Firefox, VoiceOver + Safari (macOS e iOS) y TalkBack (lista en el §8)
- [ ] Declaración de accesibilidad publicada (texto en el §10) con lo probado, lo pendiente y el contacto
```

---

## 10. Propuesta de texto para la declaración de accesibilidad

> **Accesibilidad**
>
> Quiero que esta web la pueda usar cualquiera: con teclado, con lector de pantalla, con la pantalla ampliada o con alto contraste. El objetivo es el nivel AA de las WCAG 2.2, la norma que recoge también la europea EN 301 549. Está construida sobre LUZ, un sistema de diseño que se pone a sí mismo ese mismo listón.
>
> **Cómo está hecha.** Cada página es HTML completo: se lee y se navega sin JavaScript. Los puntos que se mueven son decoración; todo lo que dibujan está también escrito. Los movimientos se detienen solos a los pocos segundos y, si tienes activada la preferencia de reducir movimiento, la web se queda quieta. Se puede recorrer entera con el teclado y el foco se ve. Hay tres modos de color (oscuro, claro y contraste alto) y el botón redondo de abajo a la derecha cambia entre ellos; solo se guarda tu elección si lo pulsas.
>
> **Sin JavaScript.** Todo el contenido está disponible. No funcionan: la animación de los puntos, el panel de proyecto (sus enlaces llevan a la página del proyecto), el cambio de modo, el aviso de cookies (sin JavaScript no se carga nada de fuera) y el buscador de la página de error.
>
> **Lo que sé que aún falla** *(actualizar al publicar)*:
> - En algunos tamaños de ventana, el aviso de cookies o el menú flotante pueden tapar por completo el elemento que tiene el foco al tabular. [Si F1 sigue abierto.]
> - En ventanas muy bajas (móvil en horizontal o zoom del 400 %), el aviso de cookies puede solaparse con la cabecera. [Si F2 sigue abierto.]
> - En el modo de alto contraste de Windows, el menú, los filtros y la paginación no marcan con claridad cuál es la página actual. [Si F4 sigue abierto.]
> - Los artículos solo existen en español. En la versión inglesa se marcan como español para que los lectores de pantalla cambien de voz, y se avisa arriba.
> - Los vídeos son de YouTube. No se cargan hasta que los aceptas, y el reproductor es de YouTube, no mío.
> - Algunas imágenes antiguas del blog, migradas desde WordPress, pueden tener descripciones mejorables.
>
> **Cómo se ha comprobado.** Pruebas automáticas (axe-core) en tres modos de color, en 375 y 1280 píxeles de ancho, en español y en inglés, también con los diálogos abiertos; revisión de contraste con un script sobre los colores reales; navegación con teclado a tres anchos; prueba sin JavaScript; alto contraste emulado; ampliación hasta 320 píxeles de ancho. [Revisión con NVDA, VoiceOver y TalkBack el DD/MM/AAAA.] Que las pruebas automáticas salgan limpias no significa que la web sea accesible: solo detectan una parte de los problemas. No se ha probado con lectores de pantalla reales ni en Safari ni en Firefox.
>
> **Si algo no te funciona**, escríbeme a [correo] o por [red]. Dime en qué página y con qué navegador o lector. Respondo en [plazo].
>
> Última revisión: [fecha].
