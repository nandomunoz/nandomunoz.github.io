# Informe de diseño y coherencia visual · maqueta Trama

Fecha: 2026-11-16 · Rama `proto/home` · Revisor: design-reviewer · Estado auditado: el actual del árbol de trabajo (pie en cuatro grupos, sin banner de cookies, bucles de imagen de un solo ciclo, hero y 404 en reposo, tres modos de color). Los cambios de texto de `blog.json` que hacía otro agente a la vez se han ignorado.

## 1. Resumen

**Veredicto.** La maqueta está bien aplicada en lo que más se ve: una sola gramática de líneas punteadas, botones de «texto sobre fila de puntos», tipografía en tres familias, los tres modos con tokens, el pie nuevo y las páginas interiores comparten ritmo, y no hay desbordes horizontales reales salvo los dos que se listan (nube de etiquetas y rejilla de la 404 en móviles estrechos). El problema grande no está en el código sino en el **documento**: el acento es ahora el **verde de la lluvia** (`--matrix`), el hero es un cartel sobre una lluvia tipo Matrix, la 404 dibuja una foto de escritorio y no el «404», el artículo ya no hace bucle en la portada y el pie no está descrito; `DESIGN.md` sigue contando granate, `HeroField` y un bucle de 13 s. Debajo de eso hay una capa de tokens granate muerta, una escala de rótulos con 11 tamaños casi iguales y ocho copias del botón «sobre puntos».

**Los cinco hallazgos más importantes**
1. **C1** La rejilla «O empieza por aquí» de la 404 se sale de la pantalla en cualquier móvil de 374 px o menos (borde derecho a 374 px; «Proyectos» y «Escríbeme» recortados en 320 y 360). `overflow-x: clip` esconde el desborde, por eso ninguna prueba de scroll lo ve.
2. **C2** La nube de etiquetas desborda a 320 px (scrollWidth 358): «#Poesía contemporánea» mide 338 px y no parte línea.
3. **C3** `DESIGN.md` describe un sitio que ya no existe en siete apartados (§1, §2, §5, §6, §9, §10 y §11) y le falta el pie. Lista en el apartado 3.
4. **C4** El acento verde del modo claro (`#0b7a3b`) da 4,19:1 sobre `--bg-2` (`.code__lang`, 9,9 px): no llega a AA. Sobre `--bg` da 4,7:1, bien.
5. **C5** El botón «Ver en YouTube ↗» de la compuerta del vídeo hereda `.prose a` (subrayado punteado + color tinta): lleva doble subrayado (el suyo de puntos y el del texto) y no es «silencioso»; su vecino «Aceptar y ver aquí» es un `<button>` limpio. Dos botones hermanos que no se parecen.

**Cuentas.** Cambiar: 5 · Mejorar: 14 · Dejar como está: 12.

## 2. Método

- Leído entero: `maqueta/DESIGN.md`, `maqueta/style.css` (615 líneas), `maqueta/blog/blog.css` (557), el pie en `blog/parts.js`, lo que lee `readPalette` en `dots.js`, y los literales de color de `rain.js`, `theme.js`, `green.js`.
- Medido en Chromium headless (playwright-core): 408 cargas (17 páginas × 320, 375, 768, 1024, 1280, 1920 × oscuro, claro y contraste alto en español, más oscuro en inglés) comprobando `scrollWidth` frente a `clientWidth`, elementos fuera de la caja y errores de consola; los tamaños de letra, familias y objetivos pequeños reales de 12 páginas a 1280 y 375; y el contraste de los pares de tokens (cálculo WCAG).
- Capturas con la pantalla al uso (desplazando de verdad: las de página completa no sirven porque las entradas van atadas al scroll). 500 capturas de viewport en `/tmp/claude-1000/-home-ares-Documents-repos-me/ec501b2d-cac8-4ee3-8064-974f1a53d49f/scratchpad/dr/v/` (fuera del repo), con nombre `<página>-<ancho>-<modo>-<idioma>__NN.png` (NN = paso de scroll). Páginas: `home`, `proyectos`, `proyecto`, `blog`, `artia` (línea de tiempo horizontal y vertical), `artsum` (compuerta de vídeo y letras), `artcode`, `artsd` (tabla), `cats`, `cat`, `tags`, `tag`, `cookies`, `priv`, `credits`, `e404` (`/blog/margaret`), `e404b` (ruta sin sugerencia). Combinaciones: todas en 1280 y 375 oscuro/es; `home`, `blog`, `artsum`, `e404` también en 320, 768, 1024, 1920; claro y contraste alto en 1280 y 375 de `home`, `proyectos`, `blog`, `artia`, `artsum`, `cookies`, `e404`; inglés de `home`, `blog`, `artia`, `credits`, `priv`. Pies sueltos en `dr/f/foot-{320,375,768,1024,1280,1920}-{dark,light,hc}-{es,en}.png`; hero ya en reposo en `dr/hero-{1280,375}-{dark,light}.png`; compuerta en `dr/gate.png`.
- No pude: ver el foco del botón de copiar código (ningún artículo de los probados trae bloque de código; el hallazgo M7 es solo de CSS); probar Safari/Firefox; medir fotogramas (eso es de `perf-auditor`). Las capturas del bucle de las miniaturas dependen del instante.
- Ya auditado y no repetido: accesibilidad, cookies, modos, SEO-cookies y legal. Cambió desde entonces: el acento (ahora verde) y el pie, lo que obliga a revisar el contraste del verde (C4).

## 3. Hallazgos

### 3.1 Cambiar (antes de publicar)

| id | Qué | Evidencia | Arreglo | ¿Maqueta o Astro? | Decide |
|---|---|---|---|---|---|
| C1 | Rejilla «O empieza por aquí» de la 404 sobrepasa la pantalla en móviles de ≤ 374 px | `.lost__ways ul` con dos columnas `1fr 1fr` y celdas `grid-template-columns: auto 1fr auto` con «Proyectos» en 1,6 rem/800/62 %: las celdas miden 145 y 206 px, borde derecho 374 px a 320 y a 360 de ancho. `blog.css:476-479`, `.is-lost .blog { overflow-x: clip }` lo disimula. Capturas `e404-320-dark-es__01`, `e404b-375-dark-es__01` | Una columna por debajo de ~26em, o `min-width: 0` + `overflow-wrap` + tamaño menor (`clamp`) en `.lost__ways a`; quitar el `clip` solo cuando ya no haga falta | Maqueta | Equipo |
| C2 | La nube de etiquetas desborda a 320 px | `.tags--cloud a` es `inline-flex` sin partir: «#Web Components» 335 px y «#Poesía contemporánea» 338 px (`scrollWidth` 358 > 320) en `blog/etiqueta/` en los tres modos. `blog.css:107-110`. Captura `tags-375-dark-es__00` (a 375 cabe por poco) | `max-width: 100%` y `overflow-wrap: anywhere` en el enlace, o `flex-wrap` dentro del `a`, o bajar el cuerpo mínimo (hoy `1.4rem + w*2.6rem`) en < 24em | Maqueta | Equipo |
| C3 | `DESIGN.md` ya no describe lo que hay | Ver «DESIGN.md: qué actualizar» (apartado 3.4). Son hechos de identidad (el color del acento, el hero, la 404) | Reescribir §1, §2, §5, §6, §9, §10 y §11 y añadir el pie; el plan lo exige («`DESIGN.md` describe lo que hay») | Maqueta | Dueño confirma que el verde es definitivo |
| C4 | Verde de acento en claro bajo AA sobre `--bg-2` | `--matrix: #0b7a3b` sobre `--bg-2 #d9e3ed` = 4,19:1 (sobre `--bg` 4,7:1; `--on-matrix` sobre el verde 4,7:1). Texto en acento sobre `--bg-2`: `.code__lang` (9,9 px, `blog.css:192`) y `.code__copy.is-copied`; en HC el verde `#5dff8f` pasa de sobra | Oscurecer `--matrix` claro a ≈ `#09703a` o sacar `.code__lang` del acento y dejarlo en `--mute`. Calculado, no medido con axe | Maqueta | Equipo (la accesibilidad lo vuelve a pasar) |
| C5 | El enlace «Ver en YouTube ↗» de la compuerta hereda `.prose a` | Color calculado tinta (no `--mute`) y `text-decoration: underline dotted` más la fila de puntos; el «Aceptar y ver aquí» es `<button>` sin subrayado. `style.css:511,533` frente a `blog.css:215`. Captura `dr/gate.png`, `artsum-1280-dark-es__01` | `.prose a.consent__btn { text-decoration: none; color: inherit }` (o excluir `.consent__btn` del selector `.prose a`) | Maqueta | Equipo |

### 3.2 Mejorar

| id | Qué | Evidencia | Arreglo | ¿Maqueta o Astro? | Decide |
|---|---|---|---|---|---|
| M1 | Capa de tokens granate muerta | `style.css:105` reasigna `--blaze`, `--blaze-lift`, `--on-blaze`, `--blaze-on-ink` a las del verde en todos los modos: los valores por modo de esas cuatro (líneas 30-33, 58-61, 86-89) no se usan. 11 `filter: var(--blaze-lift)` valen `none` (`style.css` 2, `blog.css` 9) | Dejar `--accent` único + `--on-accent` + `--accent-on-ink` por modo; borrar `--blaze-lift` y sus filtros. Un solo nombre que diga lo que es | Las dos | Equipo |
| M2 | Escala de rótulos en mono: 11 tamaños casi iguales | Medidos en 12 páginas: 9,6 · 9,92 · 10,24 · 10,56 · 10,88 · 11,2 · 11,52 · 12 · 12,16 · 12,48 · 12,8 px, todos Chakra Petch en mayúsculas (`.6/.62/.64/.66/.68/.7/.72/.75/.76/.78/.8rem`). 48 tamaños de `rem` distintos entre las dos hojas, 63 pares tamaño/familia en pantalla | Cuatro peldaños: `--t-micro .62`, `--t-label .72`, `--t-ui .8`, y los grandes ya fluidos. Es lo que más ayudará a Astro (un token por rol) | Las dos | Equipo |
| M3 | Espaciado de rótulos (`letter-spacing`): 17 valores | `.08 .1 .12 .14 .16 .18 .2 .22 .26 .3em` más 0 y los negativos de titulares. Los más usados: .18 (19 veces), .16 (14), .2 (9), .14 (9), .12 (9) | Tres: `.12`, `.16`, `.2` | Las dos | Equipo |
| M4 | Ocho copias del botón «texto sobre fila de puntos» | `radial-gradient(circle, var(--ink) 1px, transparent 1.6px) … / 6px 6px` aparece 8 veces (`.item__open`, `.panel__links a`, `.share__btn`, `.author__links a`, `.blogsec__all`, `.consent__btn`, `.foot__btn`, `a.pager__dir`) con la fila a `100%`, `calc(100% - .2rem)` o `calc(100% - .35rem)`, y 9 hovers granates idénticos. Cuerpo .68-.8rem, espaciado .16-.2em | Un `.btn` (o `--dots-btn`) con variantes `--quiet` y tamaño. En Astro es un componente | Astro (componente) | Equipo |
| M5 | Foco del código y de «Copiar» no sigue la regla del §4 | `.code__copy:focus-visible` y `.luz-code-block:focus-visible` = `2px solid var(--blaze)` (`blog.css:194,198`); la regla es `3px dotted var(--ink)`, que cumplen los demás (global, tabla legal, tema, timeline). `.lost__search input` quita el contorno y avisa solo con la fila de puntos verdes | Usar el contorno global (con `outline-offset` negativo dentro del bloque). El campo de búsqueda puede quedarse (la fila de puntos es el foco), pero con un contorno punteado ink además | Maqueta | Equipo |
| M6 | Pie a 1024 px: la fila «Cookies» se rompe | `foot-1024-dark-es.png`: «YouTube: sin elegir» y «Cambiar» en dos líneas, mientras «Color» va en una. Cuatro columnas desde 64em dejan 12,4 rem por columna | Tres columnas hasta 90em, o `.foot__btn` en su propia línea siempre (como en el pie móvil). Que las tres filas se vean igual | Maqueta | Equipo |
| M7 | El pie usa tres tonos de línea distintos | `.foot` borde superior `--glow` (11 %); `.foot__pref` y `.foot__end` `--faint`; el resto del sitio `--rule` o `--faint` sin criterio claro (`.legend`, `.toc`, `.post__nav`: `--faint`; `.brow`: `--rule`) | Dos tonos con un papel: `--rule` para separar filas, `--faint` para recuadros. En HC `--glow` es transparente: el borde superior del pie desaparece | Maqueta | Equipo |
| M8 | Títulos de artículo en móvil con guionado feo | `introduccion-a-la-ia` a 375: «DEN-TRO», «INTRODUC-CIÓN», «INTELI-GENCIA» (`hyphens: auto` en `.post__title`, 12,5vw). Captura `artia-375-hc-es__00` | `hyphens: manual` en `.post__title` y `.feat__title` con `clamp` más bajo en < 30em, o `text-wrap: balance` sin guionado | Maqueta | Equipo |
| M9 | El botón de modo de color y la píldora tapan texto en móvil | A 375 el círculo (2,75 rem) y la píldora ocupan ~96 px de abajo y el círculo se pone sobre el texto de lectura (`artia-375-dark-es__02`, `home-375-dark-es__01`) | Es decisión de la UX; en diseño: reservar `padding-bottom` en `.post__main`, o ocultar el círculo mientras se lee un artículo | Maqueta | Dueño / UX |
| M10 | Una pantalla de 1920 px se queda corta de escala | Textos de 11-15 px (pie, filas, ruta) sin peldaño por encima de 90em; en 1920 la home deja ~35 % de aire a los lados y el blog ~40 % (`home-1920-dark-es__03`, `blog-1920-dark-es__00`) | Un peldaño `@media (min-width: 120em)` que suba la base (`html { font-size: 112.5% }`) | Maqueta | Equipo |
| M11 | Puntos medios en claro casi invisibles | `--dot-mid: #86bf98` sobre `#e9eff5` ≈ 2:1 en los grupos de puntos de Bio, Proyectos, Blog y Escríbeme (`home-1280-light-es__01-03`). En oscuro el contraste es de 7:1 | En claro `--dot-mid` más oscuro (`#3f9a62`); los puntos son decoración pero la «trama como dato» pierde la capa intermedia | Maqueta | Equipo |
| M12 | Páginas legales sin composición | `/cookies/`, `/privacidad/`, `/creditos/` a 1280: una columna de 40 rem pegada a la izquierda y la mitad derecha vacía (`cookies-1280-dark-es__00-02`); el resto del sitio usa la rejilla de 12 columnas | Poner el cuerpo en las columnas 5-12 como el artículo y el resumen («de un vistazo») al lado, o centrarlo. Mantener la lectura de una columna | Maqueta | Equipo |
| M13 | Punto de ruptura fuera del sistema 48/64/90em | `max-width: 40em` (paginador, `blog.css:69`), `max-width: 30em` (píldora, `blog.css:409`), `min-width: 34rem` (contenedor de la línea de tiempo) y `47.99em`/`63.99em` (válidos como complemento) | Pasar 40em a 48em y 30em a 30em solo si hace falta; documentar `30em` y `34rem` en §7. La píldora a 30em sí tiene motivo | Maqueta | Equipo |
| M14 | El nav del hero en móvil parte en dos líneas y queda pegado al lema | `home-375-dark-es__00`: «04 Escríbeme» sola en una tercera línea, a ~12 px del titular. Es lo que dice §8, pero se ve sin acabar | Subir el titular 1 rem en < 30em o repartir el nav en una sola línea con los números fuera (como la píldora) | Maqueta | Equipo |

### 3.3 Dejar como está

| id | Qué | Por qué se queda |
|---|---|---|
| D1 | Foco por defecto `3px dotted var(--ink)` a 5 px | Lo cumplen `:focus-visible` global, tabla legal, botón de modo, línea de tiempo y filas (`.brow:has(:focus-visible)`). Visible en los tres modos (tinta cambia por modo). |
| D2 | Pie en cuatro grupos | Bien jerarquizado en 320, 375, 768, 1280 y 1920: títulos `.62rem` en `--mute`, enlaces con 44 px de alto útil, filas de preferencias con «qué, cómo está, botón». Pasa los tres modos y el inglés (`foot-1280-dark-en.png`). Solo M6 y M7. |
| D3 | Tres modos con tokens | Todo el CSS lee tokens; solo hay un literal de color suelto: `.video__title` (`#fff` sobre `rgb(0 0 0/.74)`), justificado en el CSS (placa oscura en cualquier modo). Los literales de `dots.js`/`rain.js` son reserva y máscara. `readPalette` y `--matrix` coinciden con CSS en los tres modos. |
| D4 | Contrastes de texto de apoyo | `--faint-text` 5,02:1 sobre `--bg-2` en oscuro; `--gloss` ≥ 4,6:1; claro: tinta 14:1, `--faint` 4,8:1 sobre `--bg-2`. |
| D5 | Líneas punteadas y esquinas rectas | Ninguna línea continua salvo la cabecera de tabla (`.prose th`, `1px solid --faint`, deliberada). Radios solo en píldora, botón de modo, vídeo y viñetas (círculos), `2px` en chips y foco. |
| D6 | Hero en reposo y 404 en reposo | El cartel (lema en verde y tinta, nombre en Doto, rol espaciado) se ve igual en 1280 y 375, claro y oscuro (`dr/hero-*.png`); la 404 queda en la foto tramada sin parpadeos y sin «Toca para escanear» sobre el texto. |
| D7 | Bucles de una sola vez | Las miniaturas acaban en blanco y negro; portada y destacado en blanco y negro; hover repite (`is-rest`). Portada del artículo como pantalla de puntos (`.cover-screen`) coherente con la compuerta del vídeo. |
| D8 | Filas de lista | Misma forma en blog, categorías, etiquetas, relacionados, 404 y home (`.brow`), con el hover igual y el foco en toda la fila. |
| D9 | Sistema de rejilla y gutter | `--gut` y la rejilla de 12 columnas se aplican igual en home, proyecto, blog, artículo y 404 a 1024-1920; sin desbordes en 408 cargas (salvo C1, C2). |
| D10 | Componentes de artículo | Citas con letras, tabla con scroll, línea de tiempo horizontal y vertical, vídeo, tuit, tarjetas de salida: bien resueltos y homogéneos en los tres modos (`artia-*`, `artsum-*`, `artsd-*`). |
| D11 | Glifos | `←→↗▶` con `aria-hidden` y tamaño propio; flechas de la línea de tiempo dibujadas con bordes (mismo grosor). |
| D12 | Selectores «muertos» | Los 18 nombres que no aparecen en ningún JS/HTML son de los componentes de LUZ (línea de tiempo, código, botón de modo) que construye el script del proveedor: no sobran. El resto de las clases tiene uso. Solo 4 `!important`, todos justificados (`.card`, anulación de movimiento, View Transition). |

### 3.4 DESIGN.md: qué actualizar

1. **§1 «La idea»** y **§2 tabla de color**: el acento ya no es granate `#963641`. Es el verde de la lluvia: `--matrix` `#22c55e` (oscuro), `#0b7a3b` (claro), `#5dff8f` (contraste alto); `--on-matrix`, `--matrix-on-ink`, `--trace` (estela de la escritura). `--blaze` es un alias de `--matrix` (línea 105). Quitar el azul del claro y el granate de contraste alto, y el `brightness(1.7)` (hoy `--blaze-lift: none`).
2. **Tabla de modos (§2)**: reescribir con los valores reales, incluidos `--faint-text` y `--gloss` (texto gris que sí llega a 4,6:1), `--prose`, `--scrim`, `--code` y `--luz-code-*`. `--dot-mid` es verde claro (`#86bf98`, `#c2ffd4` en HC), no el rosa `MID #c98a8f`; los puntos caídos de la 404 ya no son rosa.
3. **§2, párrafo final y §5**: quitar «el granate es literalmente donde tocas»; ahora lo que se desplaza se vuelve verde.
4. **§3 tipografías**: añadir **Playfair Display** (máscara del nombre en la lluvia, `rain.js`) y la fuente monoespaciada del sistema `--code` para el código; el Chakra no es monoespaciada.
5. **§5 motor de puntos**: la pieza `HeroField` ya no dibuja el hero. Ahora lo dibuja `RainField` (`rain.js`): lluvia de glifos en verde con una imagen dentro (en el hero el nombre/lema, en la 404 la foto `img/escritorio.jpg`), `settle()` a los 5 s, un clic escanea en círculo. `HeroField` sigue en los títulos de sección (`plain`). Corregir también la tabla «Las cuatro piezas».
6. **§6, fila «Artículos»** y **§10, fila «Artículo»**: la portada del artículo **no** hace bucle de 13 s. Es una pantalla de puntos (`.cover-screen`, `blog.css`) sobre la foto en gris que recupera el color con el puntero; el bucle (`coverLoop`, un ciclo de 4,6 s con color o 2 s sin él) solo vale para el destacado del blog y las miniaturas. Quitar «todas hacen el mismo bucle… la portada», `LOOP` y «se para fuera de pantalla».
7. **§6, fila «404»** y **§11**: ya no hay «404» en partículas ni puntos caídos rosas ni «Toca la trama para recomponerla». Es la lluvia con la foto del escritorio, el aviso «Haz clic para escanear» y, debajo, buscador y rejilla «O empieza por aquí». Reescribir el apartado entero.
8. **§8 navegación**: falta el **pie** (cuatro grupos: Secciones, Sígueme, Sobre esta web, Preferencias; fila de idioma, color y cookies con «Cambiar»; línea de derechos y lema). Hoy solo se menciona «el pie lo repite en Preferencias».
9. **§9 movimiento**: la frase del hero («las partículas del nombre caen 1,3 s…») ya no es verdad; el lema se escribe a mano bajo un haz verde (`shared/poster.js`) y el nombre en Doto aparece al final. Mantener la regla de los 5 s.
10. **§10 Home**: Bio, Proyectos, Blog y Escríbeme siguen igual; añadir el cartel del hero y el pie. **Créditos y Privacidad** (`/privacidad/`) faltan en la tabla de páginas (Créditos está; Privacidad solo en §15).
11. **§12 accesibilidad**: añadir las excepciones reales del foco (código y búsqueda de la 404) cuando se resuelva M5.
12. **§7** documentar los cortes `30em` (píldora) y `34rem` (contenedor de la línea de tiempo), o quitarlos (M13).
13. **§4**: «Las viñetas son puntos… columna de puntos granates» → verdes.

## 4. Preguntas para el dueño

1. ¿El verde de la lluvia es ya el acento definitivo en los tres modos (incluido el claro, que antes era azul)? Si sí, se reescribe la paleta y se borra el granate. Si no, hay que decidir antes de portar.
2. ¿Se mantiene la foto del escritorio en la 404 (y el aviso «Haz clic para escanear»)? El §11 hablaba del «404» en puntos.
3. ¿La portada del artículo queda como pantalla de puntos fija (sin ciclo) o se vuelve a un bucle de un ciclo como las miniaturas?
4. ¿El círculo del modo de color debe seguir visible mientras se lee un artículo en móvil (M9)?
5. ¿Una base de texto más grande en pantallas de 1920 (M10) es deseable o prefieres la escala actual?

## 5. Lista para pegar en la Fase 10 del plan de Astro

- [ ] La 404 no desborda a 320, 360 y 374 px (rejilla de secciones en una columna o con `min-width: 0`) y se prueba sin `overflow-x: clip`.
- [ ] La nube de etiquetas no desborda a 320 px (`scrollWidth` = `clientWidth` en `/blog/etiqueta/`).
- [ ] `DESIGN.md` describe el acento verde, el hero con `RainField`, la 404 con la foto, la portada del artículo como pantalla de puntos, el pie en cuatro grupos y las páginas de privacidad y créditos.
- [ ] Contraste del acento en claro ≥ 4,5:1 sobre `--bg` y sobre `--bg-2` (medido con axe en `/blog/articulo/` con código).
- [ ] La compuerta del vídeo: los dos botones («Aceptar y ver aquí», «Ver en YouTube ↗») se ven y se comportan igual en los tres modos (sin `.prose a` heredado).
- [ ] Un solo token de acento (`--accent`) y ningún `filter: var(--blaze-lift)` ni `--blaze-*` por modo sin uso.
- [ ] Escala de rótulos reducida a ≤ 4 tamaños y `letter-spacing` a ≤ 3 valores, como tokens en la capa de diseño de LUZ/Astro.
- [ ] El botón «texto sobre fila de puntos» es un único componente con variantes (principal, silencioso, pie).
- [ ] El foco es `3px dotted var(--ink)` en todas las superficies (código y copiar incluidos), probado en los tres modos.
- [ ] El pie a 1024 px no parte la fila «Cookies»; los bordes del pie tienen el mismo papel que el resto del sitio.
- [ ] Comparación de capturas (320, 375, 768, 1024, 1280, 1920 × claro, oscuro y contraste alto × es/en) de las 17 páginas sin diferencias frente a la maqueta: se repite el juego de capturas del apartado 2.
- [ ] `@layer` (reset, tokens, base, componentes, utilidades) aplicado al CSS al portar; los 4 `!important` desaparecen o se justifican.
