# Informe de accesibilidad · maqueta Trama

> Auditoría de `maqueta/` (rama `proto/home`) frente a **WCAG 2.2 AA** y **EN 301 549 v3.2.1**, con el método del `accessibility-engineer` de LUZ.
> Fecha: 2026-11-15. Estado auditado: commit `238633d` (aviso de cookies en tarjeta, ajustes en `<dialog>`, `/maqueta/cookies/`). Las primeras pasadas se hicieron sobre `b36a383` con el aviso de cookies a medio escribir; la pasada final de axe (19:08–19:14) y las pruebas del aviso, del diálogo de ajustes y del foco tapado se repitieron sobre el código ya commiteado. Los hallazgos no cambian entre una y otra.
> Este informe **no declara conformidad**. Las herramientas automáticas encuentran en torno a un tercio de los problemas; lo que no se ha probado con lectores de pantalla reales está en «Pruebas manuales pendientes».

---

## 1. Resumen

**Veredicto.** La maqueta tiene buenos cimientos: enlace para saltar al contenido, canvas `aria-hidden` con el texto real en el DOM, `<dialog>` nativo bien cableado, foco punteado de 13:1, `prefers-reduced-motion` respetado de verdad y `lang="es"` con aviso en los artículos que solo existen en español. Aun así, hoy **no se puede publicar tal cual**. Sin JavaScript las páginas están vacías, el gris `--faint` no llega a 4,5:1 en ningún texto, el estado «actual» de los menús se marca solo con color y desaparece en alto contraste, la píldora del menú y el aviso de cookies tapan por completo el elemento con foco, y la 404 se corta por la derecha en móviles estrechos. Casi todo se arregla en piezas compartidas (tokens, chrome, fila de lista, motor de puntos), no página a página.

**Recuento:** 1 bloqueante · 7 serios (uno de ellos es WCAG 2.2) · 7 moderados (uno es WCAG 2.2) · 12 menores · 5 solo AAA.

**Lo cinco más importantes**

1. **Sin JavaScript no hay web** (bloqueante). Las páginas interiores solo dicen «Esta web necesita JavaScript» y la home es una carcasa sin bio, proyectos, artículos ni redes. Lo arregla el paso a HTML estático en Astro.
2. **El texto en `--faint` #6f6c68 tiene un contraste de 2,79:1** (1.4.3 AA): fechas, minutos de lectura, metadatos, año de cada grupo, pie «© …», placeholder del buscador, contadores e indicaciones. axe lo marca en las 72 combinaciones de página × idioma × anchura. Se arregla en un token.
3. **El foco queda tapado por completo** por la píldora del menú (móvil) y por la tarjeta de cookies (escritorio) (2.4.11 AA, WCAG 2.2). Se ha medido en blog, artículo y home.
4. **El estado «actual» se marca solo con color**: menú, índice del artículo, filtros y paginación (1.4.1 A). Tinta frente a gris da 1,81:1 y el número granate 2,0:1, y en `forced-colors` el estado desaparece del todo.
5. **La 404 se corta por la derecha entre 320 y 360 px** (1.4.10 AA): titular, buscador y enlaces quedan recortados por `overflow-x: clip`. La nube de etiquetas también fuerza scroll horizontal a 320 px.

---

## 2. Método

**Herramientas y versiones**

| Herramienta | Versión | Uso |
|---|---|---|
| Chrome for Testing (headless, `~/.cache/ms-playwright/chromium-1243`) | 153.0.8010.12 | Render, teclado, emulación de `prefers-reduced-motion` y `forced-colors: active` (Chromium aplica la paleta forzada de verdad: fondo `Canvas` blanco, `background-image` anulado) |
| puppeteer-core | 25.17.0 | Control del navegador, Tab y teclas reales, capturas |
| axe-core (cdnjs, fijado) | 4.10.3 | Etiquetas `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice` |
| Script propio de luminancia WCAG | — | Contraste de los tokens y de **píxeles renderizados**: cada texto se captura dos veces, con su color y con `color: transparent`, y se compara píxel a píxel. Así se mide el texto sobre canvas, el `filter: brightness()` y la fuente Doto |
| sharp | (la del caché npx) | Decodificar las capturas |
| `@luz-ds/check` | 0.3.2 | Sobre `maqueta/` y sobre un borrador del tema Trama con tokens `--luz-*` (en el scratchpad) |
| Firefox y WebKit de Playwright | — | **No se pudieron controlar**: el Firefox de Playwright (Juggler) no responde a WebDriver BiDi desde puppeteer (`browsingContext.create timed out`) y WebKit necesita el paquete Playwright, que no está instalado. No se ha probado nada en Gecko ni en WebKit |

**Páginas** (en español y con `?lang=en`, a 375 px y a 1280 px, después de que JS termine de construirlas y recorriendo el scroll entero): `/maqueta/`, `/maqueta/proyectos/`, `?tech=LUZ`, `/maqueta/proyectos/proyecto/?p=luz` y `?p=quien-canta-hoy`, `/maqueta/blog/` y `?p=2`, seis artículos (`analisis-del-popurri-de-la-ciudad-invisible` con YouTube, tuit y cita; `tu-navegador-sabe-sobre-ti-mas-de-lo-que-crees` con tablas e imagen; `introduccion-a-la-ia` con línea de tiempo; `margaret-hamilton` con imagen y vídeo; `aprendiendo-web-components` con código; `como-detectar-…` con gist), `/maqueta/blog/categoria/` y `?c=literatura-y-pensamiento`, `/maqueta/blog/etiqueta/` y `?t=privacidad`, la 404 (`/maqueta/blog/margaret`, que devuelve 404) y `/maqueta/cookies/`. Son 72 pasadas de axe en total.

**Estados probados**: diálogo de proyecto abierto (por teclado, a 375 y 1280); menú anclado (píldora a 375, raíl a 1280) tras hacer scroll; índice del artículo abierto en móvil; fachada de YouTube con y sin consentimiento; tarjeta de cookies visible y su diálogo de ajustes abierto; buscador de la 404 con foco y con texto; `prefers-reduced-motion: reduce` (todas las pasadas de axe, para medir colores en reposo) y sin reducir (teclado y movimiento); `forced-colors: active`; JS desactivado (las 15 páginas); 320 px (las 15); 360 y 414 px (404); espaciado de texto de 1.4.12 inyectado a 375 px (las 15); tamaño de objetivos (2.5.8, con la excepción de espaciado) con el menú anclado; foco tapado (porcentaje del rectángulo enfocado cubierto por elementos fijos) en 70 pulsaciones de Tab por página.

Scripts, capturas y resultados en bruto: `/tmp/claude-1000/-home-ares-Documents-repos-me/ec501b2d-cac8-4ee3-8064-974f1a53d49f/scratchpad/a11y/` (`scripts/`, `shots/`, `out/`).

**Lo que no se ha comprobado**: lectores de pantalla reales (NVDA, JAWS, VoiceOver, TalkBack, Orca), dispositivos reales, Safari y Firefox, zoom del 400 % en un navegador de escritorio de verdad (sí se ha probado la anchura equivalente de 320 px), control por voz y por conmutador, y el modo de alto contraste real de Windows (solo la emulación de Chromium).

---

## 3. Lo que está bien hecho (hay que conservarlo en Astro)

- **«Saltar al contenido»** es lo primero al tabular, visible con el foco y apunta a `<main id="main">` (`index.html:17`, `blog.js:39`).
- **Canvas siempre `aria-hidden`, con el texto real en el DOM**: el `<h1>` del hero es texto («Nando Muñoz»), los títulos de sección «decodificados» guardan su texto en `<span class="vh">` dentro del `<h2>` (`main.js` → `.decode`), el número de cada proyecto está también en `.item__n` y el progreso de lectura y el raíl son `aria-hidden`.
- **Foco visible y coherente**: `3px dotted var(--ink)` con separación de 5 px (`style.css:37`), 13:1 sobre `#292929` y 14:1 sobre `#232323`. En las filas de lista el foco rodea la fila entera (`blog.css:63`). Se ha visto en las 60 pulsaciones de Tab de la home.
- **Diálogo de proyecto nativo**: `<dialog>` con `showModal()`, `aria-labelledby` al título, foco al título al abrir, Esc cierra (`cancel`), el fondo cierra, el foco vuelve a un botón «Abrir», ←/→ pasan de proyecto y llevan el foco al nuevo título. Los botones de abrir tienen `aria-haspopup="dialog"` y el nombre completo («Abrir LUZ»). axe no encuentra nada con el diálogo abierto.
- **`prefers-reduced-motion` respetado de verdad**: con `reduce` el hero queda quieto (dos capturas a 2 s de distancia son idénticas), no hay View Transition ni vuelo de puntos y todas las animaciones quedan a 0 (`style.css`, último bloque).
- **Idiomas**: el selector lleva `lang` y `hreflang` del otro idioma. Los artículos que solo existen en español llevan `lang="es"` en el título, la entradilla, el cuerpo y las filas, con el aviso visible «This post is only available in Spanish.».
- **Enlaces a otra pestaña avisados** con texto oculto en redes, en los enlaces de demo y código del diálogo y la ficha, y en «Ver en YouTube».
- **Buscador de la 404**: `<form role="search">`, `<label for>` visible y resultados anunciados por `role="status"` («6 resultados»).
- **Fachada de YouTube**: un `<button>` con nombre («Reproducir vídeo: …»). Sin consentimiento no se carga nada de YouTube y el aviso aparece en el sitio, dentro de un `role="group"` con el título como nombre. Al reproducir, el foco pasa al `<iframe>`, que tiene `title`.
- **Índice del artículo como `<details>`**: plegado en el móvil y abierto en el escritorio, con `aria-current` en la sección que se lee.
- **Estructura**: un `<h1>` por página, metadatos en `<dl>`, fechas en `<time datetime>`, tablas con `<th scope="col">`, paginación y filtros con `aria-current="page"`, `<title>` distinto en cada página.
- **Reflow y espaciado**: a 320 px no hay scroll horizontal en 13 de las 15 páginas, y con el espaciado de 1.4.12 no se recorta nada salvo en la 404.
- **Aviso de cookies (LUZ)**: no roba el foco, es lo primero tras «Saltar al contenido», sus botones miden 44 px de alto, el diálogo de ajustes es `<dialog>` nativo (foco a la primera casilla, Esc devuelve el foco a «Ajustes») y hay una región `aria-live` para confirmar. axe no encuentra nada en él, ni en `/maqueta/cookies/` salvo el pie en `--faint`.

---

## 4. Hallazgos

### 4.1 Tabla resumen (ordenada por severidad)

| # | Severidad | Hallazgo | Criterio · nivel · EN 301 549 | Etiqueta | Fase del plan | ¿Lo arregla el HTML estático? |
|---|---|---|---|---|---|---|
| 1 | Bloqueante | Sin JS las páginas están vacías | (método LUZ; afecta a 1.3.1/4.1.2 en la práctica) | confirmado | 1, 3, 4, 6–9 | **Sí** |
| 2 | Serio | Texto `--faint` a 2,79:1 | 1.4.3 AA · EN 9.1.4.3 | confirmado | 2 | No |
| 3 | Serio | Estado «actual» solo por color; desaparece en `forced-colors` | 1.4.1 A · EN 9.1.4.1; 1.4.11 AA · EN 9.1.4.11 | confirmado | 2, 4, 7, 8 | No |
| 4 | Serio | La 404 se recorta a 320–360 px; la nube de etiquetas fuerza scroll horizontal; espaciado de texto en la 404 | 1.4.10 AA · EN 9.1.4.10; 1.4.12 AA · EN 9.1.4.12 | confirmado | 5, 8, 9 | No |
| 5 | Serio | Bloques de código con scroll horizontal no alcanzables con teclado (móvil) | 2.1.1 A · EN 9.2.1.1 (axe `scrollable-region-focusable`) | confirmado | 2, 8 | No |
| 6 | Serio | Buscador de la 404 sin borde ni foco visible en `forced-colors` | 2.4.7 AA · EN 9.2.4.7; 1.4.11 AA · EN 9.1.4.11 | confirmado | 2, 9 | No |
| 7 | Serio | Movimiento automático sin forma de pararlo (polvo del hero, parpadeo de la 404) | 2.2.2 A · EN 9.2.2.2 | confirmado | 5, 6, 9 | No |
| 8 | Moderado | Texto en español sin `lang="es"` en la interfaz inglesa (índice, anterior/siguiente, destacado, resultados de la 404, títulos de vídeo) | 3.1.2 AA · EN 9.3.1.2 | confirmado | 3, 8, 9 | No (pero lo facilita) |
| 9 | Moderado | Tabla con scroll: región enfocable sin rol ni nombre; tabla sin `<caption>` | 4.1.2 A · EN 9.4.1.2; 1.3.1 A · EN 9.1.3.1 | confirmado | 8 | No |
| 10 | Moderado | Paginación: el nombre «Página 1 de 3» no contiene la etiqueta visible «01» | 2.5.3 A · EN 9.2.5.3 | confirmado | 8 | No |
| 11 | Moderado | «Copiar enlace»: la confirmación no se anuncia y dice «copiado» aunque falle | 4.1.3 AA · EN 9.4.1.3 | confirmado | 8 | No |
| 12 | Moderado | Vídeo sin título: botón «Reproducir vídeo: » y `iframe` sin `title` | 4.1.2 A · EN 9.4.1.2; 2.4.4 A · EN 9.2.4.4 | confirmado | 3, 8 | No |
| 13 | Moderado | Imágenes con `alt=""` que parecen informativas | 1.1.1 A · EN 9.1.1.1 | confirmado (vacío) · el dueño decide si informan | 3 | No |
| 14 | Menor | Encabezados: `h3` antes del primer `h2`; «Cookies» `h2` antes del `h1` | 1.3.1 A (buena práctica, axe `heading-order`) | confirmado | 4, 7, 8 | No |
| 15 | Menor | `<aside>` dentro de otras regiones; `<aside>` vacío en la ficha | buena práctica (axe `landmark-complementary-is-top-level`) | confirmado | 6, 7, 8 | No |
| 16 | Menor | `aria-current="page"` en «03 Blog» dentro de un artículo; migas como `<p>` | 1.3.1 A / 2.4.8 AAA | confirmado | 4, 8 | En parte |
| 17 | Menor | Diálogo: Esc ignorado durante el vuelo (~1 s); el foco vuelve al último proyecto visto, no al que lo abrió | 2.1.1 / 2.4.3 A (riesgo) | confirmado | 6 | No |
| 18 | Menor | Glifos dentro de nombres accesibles (← → ↗) | 2.4.4 / 4.1.2 (riesgo) | necesita tecnología de apoyo | 4, 6, 8 | No |
| 19 | Menor | Canvas pintados con tinta fija: casi invisibles en `forced-colors` (la leyenda pierde su sentido) | 1.4.11 (riesgo; son decorativos) | confirmado | 5 | No |
| 20 | Menor | Buscador de la 404: no viene relleno aunque dice «¿Buscabas esto?»; Enter no hace nada | 3.3.2 / 3.2.2 (riesgo) | confirmado | 9 | En parte (con `<form method="get">`) |
| 21 | Menor | Título del vídeo sobre la miniatura: el contraste depende de la imagen | 1.4.3 (riesgo) | necesita tecnología de apoyo (revisión por miniatura) | 8 | No |
| 22 | Menor | Imágenes en gris que recuperan el color solo con el ratón | 1.4.1 (riesgo) | confirmado | 8 | No |
| 23 | Menor | Recomponer la 404 solo con el puntero | 2.1.1 (riesgo; es decorativo) | confirmado | 9 | No |
| 24 | Menor | Dos artículos con el mismo título enlazado | 2.4.4 A (riesgo) | confirmado | 3 | No |
| 25 | Menor | Acento como texto con `filter: brightness(1.7)`: se ve a 4,86:1, pero axe lo mide a 2,0:1 (ruido en el gate) | herramienta · 1.4.3 | confirmado | 2, 10 | No |
| **WCAG 2.2 (aún no exigido por EN 301 549 v3.2.1)** | | | | | | |
| 26 | Serio | Foco tapado por la píldora del menú y por la tarjeta de cookies | 2.4.11 AA | confirmado | 4 | No |
| 27 | Moderado | Enlace de categoría de 16 px pegado al enlace estirado de la fila | 2.5.8 AA | confirmado | 7, 8 | No |
| **Solo AAA** | | | | | | |
| 28 | AAA | Enlaces de los artículos que abren otra pestaña sin avisar (DESIGN §12 dice que sí avisan) | 3.2.5 AAA | confirmado | 3, 8 | No |
| 29 | AAA | Objetivos menores de 44 px: píldora (23 px de alto), raíl (13 px de ancho), chips (~31 px) | 2.5.5 AAA | confirmado | 4, 7, 8 | No |
| 30 | AAA | Foco parcialmente tapado o con poco contraste de cambio (borde inferior en el móvil) | 2.4.12 / 2.4.13 AAA | confirmado | 4 | No |
| 31 | AAA | `--mute` 7,19:1 cumple 1.4.6; `--faint` no llega ni a AA | 1.4.6 AAA | confirmado | 2 | No |
| 32 | AAA | Migas sin `<nav>` ni posición actual | 2.4.8 AAA | confirmado | 8 | No |

El recuento del resumen (1 · 7 · 7 · 12 · 5) agrupa así: los serios son 2–7 más el 26; los moderados son 8–13 más el 27; los menores, 14–25; los AAA, 28–32.

### 4.2 Detalle de cada hallazgo

#### 1 · Sin JavaScript las páginas están vacías — bloqueante · confirmado
- **Páginas**: todas. Con JS desactivado, `/proyectos/`, `/proyectos/proyecto/`, `/blog/` (y `?p=2`), los artículos, categorías, etiquetas, `/cookies/` y la 404 solo muestran «Esta web necesita JavaScript.»: 0 enlaces y ningún `<h1>`. La home enseña el menú, el `<h1>`, los títulos de sección, la leyenda y «Todos los proyectos», pero no la bio, los proyectos, los artículos ni las redes (`#bio-text`, `#works`, `#blog-rows` y `#socials` se rellenan en `main.js`).
- **Evidencia**: `maqueta/404.html:12`, `maqueta/blog/articulo/index.html:12` (solo `<noscript>`); captura en `shots/nojs-home.png`.
- **A quién afecta**: a quien navega con JS bloqueado o con un JS que falla (redes lentas, extensiones, navegadores antiguos), a los lectores de pantalla si el JS tarda y a los buscadores.
- **Arreglo en Astro + LUZ**: todo el contenido en HTML generado en el build (plan §1). Los canvas son una mejora encima. El diálogo de proyecto parte de un enlace a `/proyectos/<id>/` que funciona sin JS (plan Fase 6). Los filtros son enlaces (Fase 7, decisión D6: páginas estáticas `/proyectos/tech/<tech>/` si se quieren sin JS). El buscador de la 404 es un `<form method="get">` con resultado útil sin JS (hallazgo 20). Sin JS, el aviso de cookies no aparece y no se carga nada de terceros: está bien así, pero hay que decirlo en la declaración.
- **Fase**: 1 (andamiaje), 3 (colecciones), 4 (chrome), 6–9 (páginas). **El paso a HTML estático lo resuelve por sí solo.**

#### 2 · Texto en `--faint` #6f6c68 a 2,79:1 — serio · confirmado
- **Páginas**: todas. axe `color-contrast` (serious) en las 72 pasadas: 1.156 nodos, de los cuales una parte son falsos positivos del hallazgo 25. Medido en píxeles: 2,79:1 sobre `#292929` y 3,01:1 sobre `#232323`. Con la fuente Doto la medida baja aún más (contadores de los chips 2,37:1, números del índice 2,59:1, números de la 404 2,49:1).
- **Dónde está** (texto real, no líneas decorativas): `style.css:62` `.nav__n`, `:93` `.hero__hint`, `:175` `.foot` (© nombre · año, «Artículos de soynando.com»); `blog.css:12` `.crumbs` (separadores), `:25` `.chips sup`, `:43` `.feat__meta`, `:47` `.byear__n` (año de cada grupo: 2,4 rem en negrita es texto grande, pero tampoco llega a 3:1), `:56` `.brow__meta` (**fecha y minutos de cada fila**), `:92` `.cat__count`, `:100` `.tags--cloud sup`, `:108` `.post__meta dt` («Publicado», «Lectura»…), `:122` `.toc__n`, `:127` `.share__label`, `:221` `.author__by`, `:340` `.lost__hint`, `:361` placeholder del buscador (2,79:1), `:368` `.lost__kind`, `:378` `.lost__n`.
- **A quién afecta**: a personas con baja visión, a mayores y a cualquiera con el móvil al sol. Se pierden la fecha de cada artículo, el tiempo de lectura y las etiquetas de los metadatos.
- **Arreglo**: en el token, no en cada regla. En el tema LUZ (Fase 2), `--luz-text-muted` debe ser al menos **#939089** (4,57:1 sobre `#292929`, 4,93:1 sobre `#232323`). Con #96928c hay margen (4,70 / 5,08). `#6f6c68` se queda solo para lo decorativo (líneas punteadas, puntos de viñeta, raíl, el `MID` de los puntos), con otro nombre (`--trama-rule`) para que nadie lo use como texto. El placeholder pasa a `--luz-text-secondary` o deja de existir (mejor: un ejemplo en el texto de ayuda).
- **Qué diría `luz-check`**: con el borrador del tema (`--luz-text-muted: #6f6c68`) bloquea con «`--luz-text-muted` on surface-page is 2.7:1, needs 4.5:1 (text)» en los modos light, dark y high-contrast. Con #8f8b85 sigue bloqueando (4,2:1).
- **Fase**: 2.

#### 3 · El estado «actual» solo se distingue por color, y en `forced-colors` desaparece — serio · confirmado
- **Páginas**: menú (home anclado y todas las interiores), índice del artículo, filtros de tecnología y categoría, paginación.
- **Evidencia**:
  - Menú: `style.css:63-64`. El enlace actual pasa de `--mute` a `--ink` (1,81:1 entre sí) y su número a `--blaze` sin aclarar (medido 1,84:1 sobre el fondo, `.nav__n`). Por debajo de 30 em los números se esconden (`blog.css:268`) y solo queda la diferencia de 1,81:1 (`shots/home-docked-375-reduce.png`: «BIO» frente a «PROYECTOS»).
  - Índice: `blog.css:123-124`, el mismo patrón.
  - Paginación: `blog.css:80`, tinta más una fila de puntos granates hecha con `radial-gradient`.
  - Chips: `blog.css:27`, fondo tinta.
  - En `forced-colors: active` el navegador anula `background-image`, `background-color` y `box-shadow` y fuerza todos los enlaces a `LinkText`: el chip actual («LUZ 3» en `?tech=LUZ`), la página actual («01») y la sección actual del menú y del índice quedan **idénticos** a los demás (`shots/fc-projs-chips.png`, `shots/fc-blog-pager.png`, `shots/fc-home-pill-375.png`, `shots/fc-post-toc.png`).
- **A quién afecta**: a personas con daltonismo o baja visión y a quien usa alto contraste. No saben en qué sección, página o filtro están. El `aria-current` sí llega a los lectores de pantalla.
- **Arreglo**: una marca que no sea color, en una pieza compartida (Fase 2, estilos de `[aria-current]`). Por ejemplo, subrayado sólido (no punteado) de 2 px con `text-decoration`, que sobrevive a `forced-colors`, o un punto/raya delante con `::before` de contenido textual («●»). El chip actual con `outline: 2px solid` además del fondo. Y en el tema: `@media (forced-colors: active) { [aria-current] { text-decoration: underline 2px; outline: 2px solid Highlight; } }` y `forced-color-adjust: none` solo si se pinta con colores del sistema. El número granate del menú pasa al token de acento como texto (hallazgo 25).
- **Fase**: 2 (estilo de `[aria-current]` y bloque `forced-colors` del tema), 4 (menú), 7 (filtros de tecnología), 8 (índice, chips, paginación).

#### 4 · Reflow: la 404 se recorta y la nube de etiquetas desborda — serio · confirmado
- **404** (`/maqueta/blog/margaret`): a 320 y 360 px la columna de la rejilla `.lost` mide 352 px (`grid-template-columns: 351.969px` calculado). El canvas `.lost__field` tiene atributo `width=392` y su tamaño intrínseco ensancha la pista, y `.is-lost .blog { overflow-x: clip }` (`blog.css:402`) recorta en vez de dejar hacer scroll. El titular «Esta página se ha deshecho en puntos.», el párrafo («…o que la pá») y el buscador quedan **cortados sin forma de verlos** (`shots/w320-nf-copy.png`). A 375 px cabe justo (borde derecho a 373). Con el espaciado de texto de 1.4.12 a 375 px, `main.blog` mide 445/375 y también se recorta.
- **Nube de etiquetas** (`/maqueta/blog/etiqueta/`): a 320 px el documento mide 359 px de ancho: «#POESÍA CONTEMPORÁNEA» y «#WEB COMPONENTS» no parten (`blog.css:98`, `inline-flex` sin `overflow-wrap`).
- **A quién afecta**: a quien amplía al 400 % en escritorio (equivale a 320 px), a móviles pequeños y a quien usa fuentes grandes o espaciado propio.
- **Arreglo**: en la rejilla, `grid-template-columns: minmax(0, 1fr)` (o `min-width: 0` en los hijos) y el canvas con `width: 100%; min-width: 0` sin que su atributo dicte el tamaño. Quitar el `overflow-x: clip` de la página: el sangrado del canvas se resuelve con `margin-inline: calc(-1 * var(--gut))` dentro de un contenedor que no recorte texto. En la nube, `overflow-wrap: anywhere` en `.tags--cloud span` y `max-width: 100%` en el enlace. Añadir a la Fase 10 una prueba Playwright que falle si `scrollWidth > 320` o si hay texto fuera del viewport.
- **Fase**: 5 (tamaño del canvas en el patrón de montaje), 8 (nube), 9 (404).

#### 5 · Código con scroll horizontal no alcanzable con teclado — serio · confirmado
- **Página**: `/maqueta/blog/articulo/?a=aprendiendo-web-components`, a 375 px (es y en). axe `scrollable-region-focusable` (serious), 3 `<pre class="prose__code">`.
- **Evidencia**: `blog.css:138` `overflow-x: auto` sin `tabindex`. La tabla sí lo tiene (`blog.js:334`), el código no (`renderBlock`, rama `x.code`).
- **A quién afecta**: a quien navega con teclado o con conmutador: no puede leer el final de las líneas largas de código en el móvil.
- **Arreglo** (el bloque de código lo generará el Markdown de Astro): un plugin de rehype propio de pocas líneas, o el `<pre>` de LUZ si lo tiene, que añada `tabindex="0"`, `role="region"` y `aria-label` («Código: JavaScript»), solo si hay overflow o siempre. Alternativa: `white-space: pre-wrap` en móvil (el código se parte y deja de hacer falta el scroll). Comprobar que el foco se ve (el `:focus-visible` global ya vale).
- **Fase**: 2 (estilo base de `pre`), 8 (piezas del artículo).

#### 6 · Buscador de la 404 sin borde ni foco en alto contraste — serio · confirmado
- **Página**: 404, `forced-colors: active`.
- **Evidencia**: `blog.css:356-363`. El `<input>` tiene `border: 0; outline: none` y su única forma visible es una fila de puntos `::after` con `radial-gradient`, que se vuelve granate con `:focus-within`. En alto contraste el gradiente se anula: el campo no tiene contorno y al enfocarlo solo aparece el cursor de texto (`shots/fc-nf-search-focused.png`). En modo normal sí cumple (los puntos de foco miden ~3,85:1).
- **A quién afecta**: a quien usa alto contraste de Windows: no ve dónde está el campo ni si tiene el foco.
- **Arreglo**: quitar `outline: none` y dejar el `:focus-visible` global. Dar al campo un borde inferior real (`border-bottom: 1px dotted var(--luz-input-border)`, con `--luz-input-border` de al menos 3:1, p. ej. #8f8b85 → 3,36:1) y dibujar la fila de puntos como adorno extra. En el tema, `@media (forced-colors: active) { input { border: 1px solid CanvasText; } }`. Mejor aún, el `<input>` de LUZ con el tema Trama.
- **Fase**: 2 (estilo de formularios en el tema), 9 (404).

#### 7 · Movimiento que empieza solo y no se puede parar — serio · confirmado
- **Páginas**: home (hero) y 404, sin `prefers-reduced-motion`.
- **Evidencia**: el polvo del hero late sin fin, `r *= 0.6 + 0.4 * Math.sin(now / 900 …)` (`dots.js:346`), y el bucle sigue mientras el hero esté a la vista: capturas a 6, 8 y 10 s todas distintas. En la 404, el punto del aviso parpadea con `animation: blink 1.6s steps(2) infinite` (`blog.css:341`) hasta el primer toque, y los puntos caídos siguen moviéndose (capturas a 6 y 9 s distintas). No hay botón de pausa. Solo se paran con la preferencia del sistema.
- **A quién afecta**: a personas con TDAH, autismo o trastornos vestibulares y a quien lee el kicker o la frase junto a algo que se mueve. 2.2.2 pide un mecanismo para parar el movimiento que dura más de 5 s; la preferencia del sistema ayuda, pero no es ese mecanismo.
- **Arreglo**: en el motor (Fase 5), que el bucle **se detenga solo** cuando acaba la entrada (≈1,3 s) y el polvo quede quieto. Que solo se reactive con el puntero encima o tras un toque, y que se pare otra vez a los 5 s sin interacción. El parpadeo de la 404, como mucho 3 ciclos (`animation-iteration-count: 3`). Si se quiere el movimiento continuo, un `<button aria-pressed>` «Pausar animación» en el hero y la 404. Además, pausar con `visibilitychange` (ya está en el plan).
- **Fase**: 5 (motor), 6 (hero), 9 (404).

#### 8 · Texto en español sin `lang="es"` en la interfaz inglesa — moderado · confirmado
- **Páginas** (`?lang=en`):
  - `/blog/`: el destacado, `featured()` (`blog.js:153`), no pone `lang` en el título ni en la entradilla.
  - Artículo: los títulos del índice (`blog.js:415`), «anterior/siguiente» (`.post__to`, `blog.js:425`) y los títulos de vídeo en inglés dentro de artículos en español (p. ej. «Margaret Hamilton on Software Engineering», sin `lang="en"` en un `.prose` con `lang="es"`).
  - 404: los títulos de los resultados (`blog.js:213`).
  - `<title>` del documento en español con `<html lang="en">` (inevitable en el `<title>`, pero conviene saberlo).
- **A quién afecta**: a quien usa lector de pantalla en inglés: los títulos españoles se leen con fonética inglesa y son ininteligibles.
- **Arreglo**: en Astro, cada artículo trae `lang` en el frontmatter (Fase 3) y **un componente `<PostTitle>` / `<PostLink>`** pone `lang` siempre que el idioma del artículo no sea el de la página: en filas, destacado, índice, anterior/siguiente, relacionados, buscador y RSS. El índice de búsqueda (`search.json`, Fase 9) lleva el `lang` de cada entrada. Los bloques de vídeo heredan un `lang` propio si el título está en otro idioma (campo opcional en el bloque).
- **Fase**: 3, 8, 9.

#### 9 · Tabla con scroll: región sin nombre y tabla sin `<caption>` — moderado · confirmado
- **Página**: `/blog/articulo/?a=tu-navegador-sabe-sobre-ti-mas-de-lo-que-crees`.
- **Evidencia**: `blog.js:333-336`. `<div class="prose__scroll" tabindex="0">` sin `role` ni `aria-label`. El texto de la tabla («Seguro que me olvido de alguno más») va en un `<figcaption>` fuera del `<div>` y no está asociado a la tabla. El desplazamiento con flechas sí funciona (`scrollLeft` 0 → 80 con dos →).
- **A quién afecta**: a quien usa lector de pantalla: al tabular cae en un elemento enfocable sin nombre ni rol (según el lector, «grupo» o nada).
- **Arreglo**: `<figure>` → `<div role="region" aria-labelledby="cap-N" tabindex="0">` con la tabla dentro, y `<table>` con `<caption id="cap-N">` (en vez del `figcaption`). En Astro, un plugin de rehype que envuelva cada `<table>` del Markdown. Si la tabla no desborda, sin `tabindex`.
- **Fase**: 8.

#### 10 · Paginación: el nombre accesible no contiene lo que se ve — moderado · confirmado
- **Páginas**: `/blog/`, `?p=2`, categorías.
- **Evidencia**: `blog.js:146`, `aria-label: B.page(i + 1, total)` → «Página 1 de 3», con texto visible «01».
- **A quién afecta**: a quien usa control por voz: «pulsa 01» no encuentra el enlace.
- **Arreglo**: sin `aria-label`. El contenido: `<span class="vh">Página </span>01<span class="vh"> de 03</span>`. O `<a aria-label="01, página 1 de 3">`, que empieza por lo visible.
- **Fase**: 8.

#### 11 · «Copiar enlace»: confirmación muda y que puede mentir — moderado · confirmado
- **Página**: todos los artículos.
- **Evidencia**: `blog.js:400-403`. Cambia el texto del botón a «Enlace copiado» sin región viva (`.share` no tiene `aria-live` ni `role="status"`), y el `catch` vacío deja que diga «copiado» aunque `navigator.clipboard.writeText` falle.
- **A quién afecta**: a quien usa lector de pantalla, que no se entera (muchos lectores no anuncian el cambio de nombre del botón con foco), y a todos cuando la copia falla.
- **Arreglo**: un `<p role="status" class="vh">` junto a los botones donde se escribe «Enlace copiado» o «No se pudo copiar: …». En el `catch`, texto de error y seleccionar la URL en un `<input readonly>` visible como alternativa.
- **Fase**: 8.

#### 12 · Vídeo de YouTube sin título — moderado · confirmado
- **Página**: `analisis-del-popurri-de-la-ciudad-invisible` (el último vídeo tiene `title: ""` en `maqueta/shared/blog.json`).
- **Evidencia**: con consentimiento, el botón se llama «Reproducir vídeo: », y el `<iframe>` y la etiqueta del grupo quedan vacíos (`blog.js:356, 360, 369`). Sin consentimiento, el grupo no tiene nombre y sus botones «Aceptar y ver aquí» y «Ver en YouTube» quedan sin contexto.
- **A quién afecta**: a quien usa lector de pantalla: un botón que no dice qué reproduce y, sin consentimiento, un grupo sin nombre.
- **Arreglo**: en la migración (Fase 3) hacer `title` obligatorio en el esquema del bloque `yt-facade`: `astro check` falla si falta. Rellenarlo a mano (consultar el vídeo). El componente pone un título por defecto («Vídeo de YouTube») si aun así llega vacío.
- **Fase**: 3, 8.

#### 13 · Imágenes con `alt=""` que parecen informativas — moderado · confirmado (el vacío) · decide el dueño
- **Páginas**: `tu-empresa-necesita-un-sistema-de-diseno-y-no-lo-sabes` (5 imágenes, una es la captura de *design tokens* en Figma de headway.io) y `tu-navegador-sabe-sobre-ti-mas-de-lo-que-crees` (la imagen de IKAY, sin pie).
- **Evidencia**: `maqueta/shared/blog.json` (`alt: ""`). El conversor (`soynando-to-blog.cjs`) conserva el `alt` de WordPress y allí estaba vacío.
- **A quién afecta**: a quien usa lector de pantalla, si la imagen aporta información (la captura de Figma sí la aporta).
- **Arreglo**: en la migración a Markdown (Fase 3), revisar imagen a imagen. Las fotos de Unsplash puramente decorativas pueden quedarse con `alt=""`. Las capturas necesitan descripción. El esquema de contenido puede exigir que `alt` exista (vacío explícito permitido) para que no se olvide.
- **Fase**: 3.

#### 14 · Orden de encabezados — menor · confirmado
- `/proyectos/` y `/blog/categoria/`: la leyenda «Cómo leer los bloques/tramas» es un `<h3>` justo tras el `<h1>` (axe `heading-order`, `blog.js` en `projectsPage` y `categoryPage`).
- Con la tarjeta de cookies visible, su `<h2>Cookies</h2>` (y el `<h2>` del diálogo de ajustes) van antes del `<h1>` en el DOM (`shared/consent.js`).
- `/maqueta/cookies/`: los títulos de los dos diálogos de cookies preceden al `<h1>`.
- **Arreglo**: la leyenda como `<h2>` (o `<p>` en negrita dentro de un `<aside aria-label>`). El título de la tarjeta de cookies como `<p>` con `aria-labelledby` en la sección (no hace falta que sea encabezado), o mover la tarjeta al final del `<body>`. Esto último, comprobando que LUZ la sigue queriendo la primera en el orden de tabulación.
- **Fase**: 4 (cookies en el chrome), 7, 8.

#### 15 · `<aside>` anidados y `<aside>` vacío — menor · confirmado
- axe `landmark-complementary-is-top-level` (moderate, buena práctica) en la home (leyenda dentro de `section#trabajo`) y en todos los artículos (`.post__side` dentro de `<article>`). En la ficha de proyecto hay un `<aside class="post__side">` vacío (`blog.js`, `projectPage`), oculto con CSS.
- **Arreglo**: la leyenda como `<div>` o `<figure>`. El lateral del artículo como `<nav aria-label="En este artículo">` (el índice) más un `<div>` para compartir. No generar el `<aside>` vacío.
- **Fase**: 6, 7, 8.

#### 16 · `aria-current` y migas — menor · confirmado
- `aria-current="page"` en «03 Blog» cuando la página es un artículo, una categoría o una etiqueta (`blog.js:34`, `navItem`): esa no es la página actual. Debe ser `aria-current="true"` (sección actual), como ya hace la home. En la 404 no se marca nada, que es lo correcto.
- Las migas son un `<p class="crumbs">` (`blog.js:109, 434, 539`) sin `<nav aria-label="Migas">`, sin lista y sin el elemento actual.
- **Arreglo**: `aria-current="true"` para la sección y `"page"` solo para la página exacta. Migas como `<nav aria-label="Migas"><ol>…<li><a aria-current="page">…` (patrón de LUZ si existe).
- **Fase**: 4, 8.

#### 17 · Diálogo de proyecto: Esc tardío y retorno del foco — menor · confirmado
- **Evidencia**: Esc pulsado a los 200 ms de abrir no cierra (`busy` durante el vuelo de ~1 s, `main.js:286-298, 339`). Tras ←/→, al cerrar, el foco va al «Abrir» del **último proyecto visto**, no al que abrió el diálogo (`main.js:316`). Es defendible porque la página se desplaza hasta ese bloque, pero hay que decidirlo. Las flechas no se anuncian en ningún sitio. Al tabular desde el último botón el foco sale a la interfaz del navegador y vuelve a «Cerrar», que es lo normal en un modal nativo.
- **Arreglo**: que Esc cancele el vuelo y cierre en el acto. Guardar el botón que abrió el diálogo y devolver ahí el foco, o documentar la decisión de volver al proyecto actual. Si se quiere que las flechas se descubran, un texto «← → para pasar de proyecto» `aria-hidden` visible solo con puntero fino, más los botones, que ya existen.
- **Fase**: 6.

#### 18 · Glifos dentro de nombres accesibles — menor · necesita tecnología de apoyo
- «← Anterior …» / «Siguiente → …» (`main.js` `fill`, `blog.js:425`), «soynando.com ↗» (enlace al original del artículo), «Compartir ↗», «← Más recientes» / «Anteriores →» (paginación). Según el lector, se leen «flecha izquierda», «flecha arriba derecha»…
- **Arreglo**: cada glifo en `<span aria-hidden="true">` (ya se hace en otras partes). En «soynando.com ↗», además, el texto oculto «(se abre en otra pestaña)».
- **Fase**: 4, 6, 8.

#### 19 · Canvas con tinta fija en alto contraste — menor · confirmado
- En `forced-colors`, los puntos (`INK #f4f2ee`) quedan sobre el `Canvas` blanco del sistema: el «NANDO» del hero, el «404», los bloques de proyecto, las portadas y **la leyenda «Cómo leer los bloques»** apenas se ven (`shots/fc-home-top.png`, `shots/fc-projs-chips.png`). Son decorativos y su información está en el texto, pero la leyenda explica un código visual que ya no se ve.
- **Arreglo**: en el motor (Fase 5), leer `matchMedia('(forced-colors: active)')` y pintar con `CanvasText`, que se obtiene con `getComputedStyle` de un elemento con `color: CanvasText`. O no dibujar y esconder la leyenda en ese modo.
- **Fase**: 5.

#### 20 · Buscador de la 404: ni relleno ni Enter — menor · confirmado
- `/maqueta/blog/margaret`: el campo está **vacío** pero debajo dice «¿Buscabas esto?» con el artículo de Margaret Hamilton (DESIGN §11 dice que viene relleno). Enter no hace nada (`onsubmit: 'return false'`, `blog.js:230`).
- **Arreglo**: rellenar `value` con la conjetura y dar al estado un texto que la nombre («¿Buscabas «margaret»? 1 resultado»). En Astro, `<form role="search" action="/buscar/" method="get">` con `name="q"`: sin JS lleva a una página de búsqueda o a un listado, y con JS filtra en el sitio. Al pulsar Enter, mover el foco al primer resultado o anunciar el número.
- **Fase**: 9.

#### 21 · Título del vídeo sobre la miniatura — menor · necesita revisión por miniatura
- Con consentimiento, `.video__title` (texto de 0,72 rem en tinta) va sobre la miniatura en gris con `brightness(.55)` y una trama encima (`blog.css:192-197`). En las cinco miniaturas probadas se lee (`shots/yt-thumb-1.png`), pero el fondo puede llegar a ~#8c8c8c (≈3,2:1) en una miniatura clara.
- **Arreglo**: un degradado oscuro bajo el título (`linear-gradient(transparent, #000c)`) o el título fuera de la imagen, en el `figcaption`.
- **Fase**: 8.

#### 22 · Imágenes en gris; el color vuelve solo con el ratón — menor · confirmado
- `blog.css:165-166`: `filter: grayscale(1)` y `:hover` lo quita. No hay equivalente con foco ni con toque. Si una imagen transmite algo por color (un gráfico, una captura con estados), se pierde.
- **Arreglo**: ninguna imagen informativa en gris (atributo o clase `data-color` en el Markdown), o color también en `:focus-within` y con `prefers-contrast: more`.
- **Fase**: 8.

#### 23 · Recomponer la 404 solo con el puntero — menor · confirmado
- `blog.js:187`: `pointerdown` sobre un canvas `aria-hidden`. Es un juego decorativo, así que 2.1.1 no obliga si se declara decorativo. El aviso «Toca la trama…» es `aria-hidden` y se ve.
- **Arreglo**: o se acepta como decorativo (y se dice en la declaración), o un `<button>` «Recomponer» que llame a `mend()`.
- **Fase**: 9.

#### 24 · Títulos de artículo repetidos — menor · confirmado
- Dos artículos con el título «¿Hay alguien dentro? Introducción a la inteligencia…» (`introduccion-a-la-ia` y `introduccion-a-la-ia-2`) aparecen uno junto a otro en la home, el blog y las etiquetas: dos enlaces con el mismo texto y destinos distintos.
- **Arreglo**: decidir en la migración (Fase 3, ¿es un duplicado de WordPress?) o diferenciarlos («… (parte 2)»).
- **Fase**: 3.

#### 25 · Acento como texto mediante `filter` — menor · confirmado (herramienta)
- `#963641` sobre `#292929` = 2,01:1. Con `filter: brightness(1.7)` se renderiza **#ff5c6f = 4,86:1** (medido en píxeles), y cumple. Pero axe no aplica filtros y lo da por 2,0:1 en `.sec-head__n`, `.feat__kicker`, `.lost__kicker`, `.post__note`, `.tline__when` y `.prose__code::before`. Eso llena el gate de falsos positivos y esconde los reales.
- **Arreglo**: un token de acento como texto, `--trama-blaze-text: #ff5c6f` (o `--luz-brand-primary`, que es lo que LUZ comprueba como texto), y fuera los `filter: brightness()`. `luz-check` con el borrador actual (`--luz-brand-primary: #963641`) bloquea con 2,0:1, y con #ff6b7c pasa. `--luz-brand-fill: #963641` se queda para fondos (texto tinta encima: 6,47:1, el botón ▶).
- **Fase**: 2 (token), 10 (gate limpio).

#### 26 · Foco tapado por la píldora y por la tarjeta de cookies — serio · confirmado · WCAG 2.2
- **Evidencia** (Tab real, porcentaje del rectángulo enfocado bajo elementos fijos):
  - `/blog/` a 375×667: el enlace de categoría «Código y gestión» queda **100 % bajo la píldora** cuatro veces. Hay 14 casos más con más del 20 % tapado.
  - Artículo `introduccion-a-la-ia` a 375×667: enlaces del texto («GPT-2», «LLaMA») 100 % tapados. Con la tarjeta de cookies visible, «o1», «Grok 4», «Claude Opus 5.5», «Más sobre mí» y «Escríbeme» quedan 100 % bajo la píldora, que sube a montar sobre la tarjeta.
  - Home a 1280×720 con la tarjeta visible: «Código y gestión» queda 100 % bajo la tarjeta de cookies.
  - La causa: el navegador desplaza el elemento justo al borde inferior, y ahí están la píldora (`.docked .nav`, `style.css:67`) y la tarjeta. `scroll-padding-bottom` solo descuenta la tarjeta y solo en algunos casos (`style.css:442`), nunca la píldora.
- **A quién afecta**: a quien navega con teclado en el móvil o en el escritorio con el aviso abierto: el foco «desaparece».
- **Arreglo**: `html { scroll-padding-bottom: calc(var(--pill-h) + 1rem + env(safe-area-inset-bottom)) }` siempre que el menú esté anclado en el móvil, y la suma de la píldora más la tarjeta cuando estén las dos. Mejor: medir con `ResizeObserver` y publicar `--fixed-bottom`. Y `scroll-padding-top` para la barra de progreso. Opcional: ocultar la píldora mientras se tabula dentro de su zona.
- **Fase**: 4 (chrome: menú anclado y aviso de cookies).

#### 27 · Objetivo pequeño pegado al enlace estirado — moderado · confirmado · WCAG 2.2
- `.brow__cat` (enlace de categoría dentro de cada fila) mide 119×16 px y está **encima** del enlace estirado de la fila (`blog.css:57-60`): su círculo de 24 px se solapa con otro objetivo, así que no se acoge a la excepción de espaciado (medido en `/blog/etiqueta/?t=privacidad`). Un dedo que falla por 4 px abre el artículo en vez de la categoría.
- Los enlaces de la píldora miden 22–76×23 px y los del raíl 13×53–107 px: cumplen **por la excepción de espaciado**, no por tamaño.
- **Arreglo**: `.brow__cat { padding-block: .45rem; margin-block: -.45rem }` para llegar a 24 px sin mover el diseño, o sacar la categoría del área estirada. En la píldora, `padding-block: .5rem` (≈ 30 px) y en el raíl `padding-inline: .5rem`.
- **Fase**: 7, 8 (componente de fila).

#### 28–32 · Solo AAA (no obligatorios; anotar si cuesta poco)
- **28 · 3.2.5**: los enlaces externos del cuerpo de los artículos, de los tuits, de las tarjetas de gist o Facebook y el «soynando.com ↗» del original se abren con `target="_blank"` (`blog.js`, `postPage`: `a[href^="http"]`) **sin** el texto «(se abre en otra pestaña)», cuando DESIGN §12 dice que sí lo llevan. Arreglo: el mismo plugin de rehype que añada el `.vh`, o abrir esos enlaces en la misma pestaña (es la opción más accesible).
- **29 · 2.5.5**: objetivos de 44 px. La píldora tiene 23 px de alto, el raíl 13 px de ancho, los chips ~31 px y los enlaces del pie ~29 px.
- **30 · 2.4.12 / 2.4.13**: en el móvil, varios elementos quedan parcialmente bajo la píldora (8–14 por página). El foco del campo de la 404 es un cambio de puntos de 2,79 a 3,85:1.
- **31 · 1.4.6**: `--mute` (7,19:1) e `--ink` (13:1) cumplen. `--faint` no llega ni a AA (hallazgo 2).
- **32 · 2.4.8**: migas sin `<nav>` ni `aria-current` (hallazgo 16).

---

## 5. Por fases del plan

| Fase | Hallazgos |
|---|---|
| 1 · Andamiaje | 1 (HTML completo desde el build, `Base.astro` con «Saltar al contenido»: ya contemplado) |
| 2 · Tema LUZ | 2, 3, 5, 6, 25, 31 (tokens `--luz-text-muted` ≥ #939089, acento como texto #ff5c6f, `--luz-input-border` ≥ 3:1, estilo de `[aria-current]`, bloque `forced-colors`, `pre` y formularios). **El tema tiene que definir todos los tokens semánticos que usa LUZ** (`surface-hover`, `surface-strong`, `surface-pressed`, `input-bg`, `color-code`…): con el borrador mínimo, `luz-check` bloquea 200 pares porque esos tokens se quedan con los valores claros por defecto, y el aviso de cookies de LUZ los usa. |
| 3 · Colecciones | 1, 8, 12, 13, 24, 28 (`lang` y `title` de vídeo obligatorios, `alt` revisados, enlaces externos) |
| 4 · Chrome | 1, 3, 14, 16, 18, 26, 29, 30 (menú anclado con `scroll-padding`, `aria-current` correcto, aviso de cookies) |
| 5 · Motor de puntos | 4, 7, 19 (canvas que no ensanchan la rejilla, bucle que se para, colores del sistema) |
| 6 · Home | 1, 7, 15, 17, 18 |
| 7 · Proyectos | 3, 14, 15, 27 |
| 8 · Blog | 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 18, 21, 22, 27, 28, 32 |
| 9 · 404 y búsqueda | 1, 4, 6, 7, 8, 20, 23 |
| 10 · Calidad | 25 y la lista de comprobación del §8 |

**Lo que arregla por sí solo el paso a HTML estático**: el 1 entero. El 16 en parte (con el HTML generado, `aria-current` se decide en el build) y el 20 en parte (si el buscador pasa a `<form method="get">`). Nada más: el contraste, los estados, el foco tapado, el reflow de la 404, el movimiento y los `lang` de fragmentos se arrastran tal cual si se copian el CSS y las plantillas. El HTML estático sí hace **más fácil** el 8 (el `lang` se decide en el build, con el frontmatter) y el 12/13 (el esquema de contenido puede exigir `title` y `alt`).

---

## 6. Pruebas manuales pendientes (con tecnología de apoyo real)

| Prueba | Con qué | Qué mirar |
|---|---|---|
| Home completa | NVDA + Firefox, JAWS + Chrome (Windows); VoiceOver + Safari (macOS) | Que los `<h2>` decodificados (`.vh` + canvas) se lean una sola vez; que el anclaje del menú con View Transition no mueva el cursor virtual; qué se anuncia (o no) al cambiar `aria-current="true"` con el scroll |
| Diálogo de proyecto | Los tres anteriores + VoiceOver iOS | Anuncio al abrir (rol, nombre, título enfocado), ←/→ en modo exploración frente a modo foco, retorno del foco, que el contenido de detrás quede inerte (rotor de VoiceOver) |
| Artículo en `?lang=en` (Margaret Hamilton) | NVDA y VoiceOver con voz inglesa y española instaladas | Cambio de voz en `lang="es"`; índice y anterior/siguiente (hallazgo 8); aviso «only in Spanish» |
| Fachada de YouTube, con y sin consentimiento | NVDA, VoiceOver iOS, TalkBack | Nombre del grupo, que el texto del aviso se lea antes de «Aceptar y ver aquí», foco al `<iframe>` y control del reproductor |
| Tabla y código con scroll | NVDA, VoiceOver | Qué anuncia el contenedor enfocable; navegación de tabla (Ctrl+Alt+flechas) |
| Copiar enlace | NVDA, VoiceOver | Si se anuncia «Enlace copiado» (se espera que no) |
| Buscador 404 | NVDA, JAWS, VoiceOver | Anuncio de `role="status"` al escribir; «¿Buscabas esto?» al cargar |
| Aviso de cookies y su diálogo | NVDA, VoiceOver iOS, TalkBack | Orden (tras «Saltar al contenido»), anuncio de la región viva al elegir, retorno del foco, la tarjeta con zoom al 200 % |
| Menú en píldora | VoiceOver iOS y TalkBack | Gesto de exploración sobre la píldora fija, que no tape lo que se está leyendo |
| Alto contraste real | Windows 11, temas «Desierto» y «Acuático» | Lo de los hallazgos 3, 6 y 19 con la paleta de verdad |
| Zoom y texto | Chrome, Firefox y Safari de escritorio a 200 % y 400 %; iOS con texto grande; Android con fuente al 200 % | Reflow (hallazgo 4), píldora y tarjeta tapando contenido |
| Control por voz | Voice Control (macOS/iOS), Dragon | «Pulsa 01» en la paginación, «Abrir LUZ», «English» |
| Safari y Firefox | — | View Transition del menú, `animation-timeline` (Firefox no lo soporta: revelados y progreso con el respaldo de `IntersectionObserver`), `<dialog>` |

---

## 7. Propuesta de texto para la declaración de accesibilidad

> **Accesibilidad**
>
> Quiero que esta web la pueda usar cualquiera: con teclado, con lector de pantalla, con la pantalla ampliada o con alto contraste. El objetivo es el nivel AA de las WCAG 2.2, la norma que recoge también la europea EN 301 549. Está construida sobre LUZ, un sistema de diseño que se pone a sí mismo ese mismo listón.
>
> **Cómo está hecha.** Cada página es HTML completo: se lee y se navega sin JavaScript. Los puntos que se mueven son decoración; todo lo que dibujan está también escrito. Si tienes activada la preferencia de reducir movimiento, la web se queda quieta. Se puede recorrer entera con el teclado y el foco se ve siempre.
>
> **Sin JavaScript.** Todo el contenido está disponible. No funcionan: la animación de los puntos, el panel de proyecto (sus enlaces llevan a la página del proyecto), el filtrado instantáneo y el buscador de la página de error, que entonces [lleva a una página de resultados / muestra el listado completo]. Tampoco aparece el aviso de cookies, porque sin JavaScript no se carga nada de fuera.
>
> **Lo que sé que aún falla** *(actualizar al publicar)*:
> - Los artículos solo existen en español. En la versión inglesa se marcan como español para que los lectores de pantalla cambien de voz, y se avisa arriba.
> - Los vídeos son de YouTube. No se cargan hasta que los aceptas, y el reproductor es de YouTube, no mío.
> - Algunas imágenes antiguas del blog, migradas desde WordPress, pueden tener descripciones mejorables.
> - [Cualquier hallazgo de este informe que siga abierto el día de la publicación.]
>
> **Cómo se ha comprobado.** Pruebas automáticas (axe-core) en cada cambio, revisión de contraste con un script sobre los colores reales, navegación con teclado, prueba sin JavaScript, alto contraste emulado y ampliación hasta 320 px de ancho. [Revisión con NVDA, VoiceOver y TalkBack el DD/MM/AAAA.] Que las pruebas automáticas salgan limpias no significa que la web sea accesible: solo detectan una parte de los problemas.
>
> **Si algo no te funciona**, escríbeme a [correo] o por [red]. Dime en qué página y con qué navegador o lector. Respondo en [plazo].
>
> Última revisión: [fecha].

---

## 8. Lista para pegar en la Fase 10 del plan

```markdown
#### Accesibilidad (WCAG 2.2 AA · EN 301 549 v3.2.1) — ver .ai/plan/informe-accesibilidad-maqueta.md
- [ ] Sin JS: todas las páginas (es/en) tienen su contenido, `<h1>` y enlaces; Playwright con `javaScriptEnabled: false` en home, proyecto, artículo, categoría, etiqueta y 404
- [ ] axe-core 4.10.x (`wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`) a 375 y 1280 px, es y en, con `reducedMotion: 'reduce'`: 0 `serious`/`critical`; también con el diálogo de proyecto, el índice, el diálogo de cookies y la tarjeta de cookies abiertos
- [ ] Sin `filter: brightness()` en texto: el acento como texto es un token (≥ 4,5:1) para que axe mida lo que se ve
- [ ] `luz-check --theme src/styles/luz-theme-trama.css` sin bloqueos (el tema define todos los tokens semánticos de LUZ, no solo los de DESIGN §2)
- [ ] Contraste por script: todo texto ≥ 4,5:1 (grande ≥ 3:1), incluido `--luz-text-muted` (≥ #939089 sobre #292929), el placeholder y el texto sobre las miniaturas de vídeo; bordes de controles y foco ≥ 3:1
- [ ] Estado actual (`aria-current`) visible sin color: menú, índice, chips y paginación; comprobado con `forced-colors: active`
- [ ] `forced-colors: active`: campo de búsqueda con borde y foco visibles; canvas en colores del sistema o escondidos
- [ ] Foco nunca tapado del todo (2.4.11): recorrido con Tab a 375×667 con el menú anclado y con la tarjeta de cookies, comprobando que ningún elemento enfocado queda cubierto al 100 % por la píldora, la tarjeta o la barra de progreso (`scroll-padding`)
- [ ] Reflow a 320 px sin scroll horizontal ni texto recortado en las 15 plantillas (incluidas 404 y nube de etiquetas); espaciado de texto 1.4.12 inyectado sin recortes
- [ ] Objetivos ≥ 24×24 px o con espacio (2.5.8): enlace de categoría en las filas, píldora y raíl
- [ ] Movimiento: el bucle del hero y de la 404 se para solo (≤ 5 s) o hay botón de pausa; parpadeo ≤ 3 ciclos; `prefers-reduced-motion` deja todo quieto
- [ ] Teclado: `<pre>` y tablas con scroll enfocables, con `role="region"` y nombre; diálogo de proyecto (abrir, Esc inmediato, ←/→, foco de vuelta al que lo abrió)
- [ ] `lang`: cada título, entradilla y fila de un artículo en otro idioma lleva `lang` (filas, destacado, índice, anterior/siguiente, relacionados, buscador, RSS)
- [ ] Nombres: paginación con la etiqueta visible dentro del nombre; vídeos con título obligatorio; glifos `aria-hidden`; enlaces a otra pestaña avisados (o en la misma pestaña)
- [ ] Imágenes: `alt` revisado una a una en la migración; sin imágenes informativas en gris
- [ ] «Copiar enlace» con `role="status"` y mensaje de error real
- [ ] Encabezados sin saltos (leyendas, tarjeta de cookies); `aria-current="page"` solo en la página exacta; migas en `<nav>`
- [ ] Revisión manual con NVDA + Firefox, VoiceOver + Safari (macOS e iOS) y TalkBack en home, diálogo de proyecto, artículo en `?lang=en`, vídeo y 404 (lista en el §6 del informe)
- [ ] Safari y Firefox: View Transition del menú, respaldo de `animation-timeline`, `<dialog>`
- [ ] Declaración de accesibilidad publicada (borrador en el §7 del informe) con lo probado, lo pendiente y el contacto
```
