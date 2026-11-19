# Trama · decisiones de diseño

Trama es el diseño de nandomunoz.com. Vive en `astro/` (rama `feature/astro`), un sitio estático hecho con Astro y con [LUZ](https://luzds.com) como sistema de diseño (Trama es un tema de LUZ, §2). Se sirve con `npm run dev` → http://localhost:4321 y se construye con `npm run build` → `dist/`. La maqueta (`maqueta/`) fue la referencia visual y de comportamiento y ya no está en el repo (se retiró en `4b47d56`); su versión de este documento sigue en la historia de git (`git show 7e93b23:maqueta/DESIGN.md`).

Este documento recoge **qué se decidió y por qué**, para que cualquier pieza nueva hable el mismo idioma. Si algo de aquí cambia, se cambia aquí también.

---

## 1. La idea

**Todo es una trama de puntos.** La referencia es una hoja de patrones de puntos tramados (en la historia de git: `git show 7e93b23:maqueta/refs/puntos-tramados.png`): puntos blancos sobre carbón, densidades que cuentan algo.

- Una sola tinta (blanco roto) sobre un solo papel (carbón). Un único acento: **verde**, el de la lluvia de la portada (`--matrix`), que solo aparece donde el usuario toca o donde algo está activo.
- **La portada es un cartel sobre la lluvia** (§5, §9): glifos de lluvia, hechos de puntos, sobre el carbón, con el nombre, los dos gatos del cartel y la foto de un escritorio recortados en ella, y encima el lema y los créditos escritos a máquina.
- La trama **significa**, no decora. La densidad, la altura o el patrón de un bloque siempre codifican un dato: el año, la longitud del texto o la categoría. Si un adorno no cuenta nada, sobra.
- Los puntos **se arman al entrar en pantalla** y **reaccionan al puntero**. La página parece hecha de partículas que se ordenan.
- Mucho aire: márgenes generosos, secciones muy separadas y profundidad (capas que se mueven a distinta velocidad).
- **Móvil primero.** En escritorio la composición se complica: rejilla de 12 columnas, bloques que se cruzan y textos que flotan sobre los bloques.
- **Tres idiomas, una hoja de estilos**: español, inglés y árabe (de derecha a izquierda, §14), con propiedades lógicas para que `/ar/` no necesite una segunda hoja.

## 2. Color

El carbón, la tinta y el verde (los valores del modo oscuro; los otros dos modos, abajo). Los nombres cortos de la izquierda son alias de los tokens semánticos de LUZ (`src/styles/base.css`); los valores están en el tema, `src/styles/luz-theme-trama.css`.

| Token | Alias de | Valor | Uso |
|---|---|---|---|
| `--bg` | `--luz-surface-page` | `#292929` | Fondo de todo (carbón) |
| `--bg-2` | `--luz-surface-muted` | `#232323` | Superficies hundidas: panel, código, píldora del menú, compuerta del vídeo, tarjeta y diálogos |
| `--ink` | `--luz-text-primary` | `#f4f2ee` | Texto principal y puntos |
| `--mute` | `--luz-text-secondary` | `#b9b6b0` | Texto secundario, entradillas |
| `--faint` | (de Trama) | `#6f6c68` | Puntos y líneas punteadas (2,8:1: no vale para texto) |
| `--faint-text` | `--luz-text-muted` | `#a8a39b` | Texto gris que sí llega a AA (5,8:1 sobre el carbón): fechas, contadores, migas, el pie |
| `--gloss` | (de Trama) | `#969189` | El pie de foto del kanji (`.gloss`) y el «una web de» del cartel (4,65:1 sobre el carbón) |
| `--matrix` | `--luz-brand-primary` | `#22c55e` | Único acento en texto y UI: estado activo, hover, número de sección, el lema del cartel (6,4:1 sobre el carbón) |
| `--accent-fill` | (de Trama) | `#22c55e` | El mismo verde como relleno: filas de puntos en hover, el cursor del cartel, el ▶ del vídeo, la selección |
| `--dot-mid` (canvas) | (de Trama) | `#86bf98` | Punto a medio desplazar, entre tinta y verde |

- **Tres modos de color**, con el `<luz-theme-mode>` de LUZ como un botón redondo fijo abajo, en la esquina del final de la línea (§8): **oscuro** (el de Trama y el de entrada), **claro** y **contraste alto**. No hay «Auto» para elegir. Al pulsar, rota claro → contraste alto → oscuro. El modo es `data-mode` en `<html>` (junto a `data-theme="trama"`), escrito antes del primer pintado por una línea en el `<head>` de `src/layouts/Base.astro` (sin parpadeo): lo guardado, o contraste alto si el sistema lo pide (`prefers-contrast: more`), o oscuro. La elección se guarda en `localStorage` (`luz-theme`) solo al pulsar, y la política de cookies lo dice. Sin JavaScript no hay botón: la página es oscura, o de contraste alto si el sistema lo pide (el tema lo resuelve en CSS).

| Token | Oscuro | Claro | Contraste alto |
|---|---|---|---|
| `--bg` / `--bg-2` | `#292929` / `#232323` | `#e9eff5` / `#d9e3ed` | `#000` / `#0d0d0d` |
| `--ink` | `#f4f2ee` | `#18222c` | `#fff` |
| `--mute` | `#b9b6b0` | `#434f5b` | `#f0f0f0` |
| `--faint` | `#6f6c68` | `#56626e` | `#c9c9c9` |
| `--faint-text` | `#a8a39b` | `#4f5b67` | `#c9c9c9` |
| `--gloss` | `#969189` | `#4f5b67` | `#c9c9c9` |
| `--matrix` / `--accent-fill` (acento: texto, UI, relleno) | `#22c55e` | `#0a6f35` (verde oscuro sobre el papel) | `#5dff8f` |
| `--on-accent` (texto sobre relleno verde: selección, ▶ del vídeo) | `#1a1a1a` | `#e9eff5` | `#000` |
| `--matrix-on-ink` (verde sobre relleno de tinta: el número del chip actual) | `#0b6b34` | `#3dff7a` | `#0b6b34` |
| `--prose` (texto corrido de los artículos) | `#dedbd5` | `#27323d` | `#fff` |
| `--luz-scrim` (velo tras los diálogos) | `#1a1a1a` al 80 % | `#e9eff5` al 82 % | `#000` al 88 % |
| `--shade` (sombras) | `#000` | `#2f3d4b` | `#000` |
| `--dot-ink` / `--dot-mid` / `--dot-accent` (canvas) | `#f4f2ee` / `#86bf98` / `#22c55e` | `#18222c` / `#86bf98` / `#22c55e` | `#fff` / `#c2ffd4` / `#5dff8f` |
| `--sink` (cuánto se hunde una foto bajo sus puntos) | `brightness(.32) contrast(1.1)` | `brightness(1.8) contrast(.55)` | `brightness(.45) contrast(1.2)` |
| `--luz-code-*` (código de los artículos) | esquema oscuro | esquema claro | el mismo que el oscuro |

  Todo el CSS lee tokens, también las líneas y brillos translúcidos, que son la tinta mezclada con transparente (`color-mix`): `--edge` (8 %), `--edge-2` (12 %), `--rule` (18 %) y `--glow` (11 %) en oscuro; en claro, 10, 16, 30 y 8 %; en contraste alto las líneas se hacen visibles (55, 65 y 70 %) y `--glow` desaparece. Los contrastes de texto sobre fondo cumplen AA en los tres modos (claro: tinta 13,9:1, `--faint` 5,4:1 sobre el papel y 4,8:1 sobre `--bg-2`, el acento 5,4:1 y 4,8:1; contraste alto: ≥ 11,7:1). En el oscuro, `--faint` sigue en 2,8:1, así que **el texto gris usa `--faint-text`** (o `--gloss`) y `--faint` queda para puntos y líneas. «Auto» está fijado a oscuro (`autoMode` en `src/scripts/theme.js`): el esquema del sistema no mueve la página; solo «más contraste» lo hace. El título de la puerta del vídeo va sobre su propia placa oscura, para leerse sobre cualquier miniatura en cualquier modo.
- **En claro, los puntos son oscuros sobre papel**, así que una foto se lee al revés que en oscuro (los puntos dibujan lo oscuro, como una impresión), salvo una imagen clara ya leída en negativo (una página sobre blanco), que dibuja su contenido en los dos modos. Una imagen hundida bajo sus puntos se aclara en lugar de oscurecerse (`--sink`).
- Al cambiar de modo, `theme.js` lanza el evento `trama:mode` y todo se redibuja con los colores nuevos: `readPalette` en `dots.js` (los bloques, desde `blocks.js`), `readP` en `rain.js`, los títulos en puntos, el panel de proyecto y el ciclo de las portadas (`--sink-b`, `--sink-c`). También cambia el `<meta name="theme-color">`.
- En los puntos, el color indica **cuánto se ha movido** cada uno: tinta en reposo, `--dot-mid` (un verde pálido) si está un poco desplazado y `--dot-accent` si está muy desplazado. El verde es literalmente «donde tocas». Los campos de puntos de los proyectos (tarjetas y panel) se vuelven verdes mientras el ratón está encima (`src/scripts/green.js`, con una gemela de cada capa del canvas y un fundido de 260 ms).
- Las imágenes de los artículos van en escala de grises y recuperan el color con el puntero. Así no rompen la paleta.

### Trama como tema de LUZ

- El CSS va en tres capas de cascada, en este orden (`src/styles/layers.css`): `reset`, `luz` (los tokens de `@luz-ds/tokens`, el tema y el HTML sin clases de `@luz-ds/core/base.css`) y `trama` (todo lo propio). Lo de Trama gana siempre sin pelear por especificidad.
- `luz-theme-trama.css` define **cada token que lee LUZ en cada modo** (superficies, texto, líneas, marca, barra lateral, estados, gráficos, código), para que ningún valor del tema claro de LUZ se cuele en el oscuro, y añade los propios de Trama (`--faint`, `--gloss`, `--accent-fill`, `--on-accent`, `--matrix-on-ink`, `--prose`, `--shade`, `--edge*`, `--rule`, `--glow`, `--dot-*`, `--sink*`).
- Piezas de LUZ que usa Trama, con su comportamiento intacto y el aspecto de Trama: `<luz-theme-mode>` (botón de color), `<luz-cookie-consent>` (tarjeta de cookies), `<luz-timeline>` (líneas de tiempo de los artículos) y el resaltador de código (`@luz-ds/core/highlight`). Vienen de npm con versión exacta.
- **La guía de estilo**: `/estilo/` reúne todo lo que puede llevar un artículo con el aspecto de Trama, y `/estilo/puntos/` el motor de puntos y la lluvia, para revisarlos de un vistazo. No se indexan.

## 3. Tipografía

Cuatro familias, todas servidas desde `/fonts/` (`public/fonts/`, el subconjunto latino, con su licencia OFL al lado), más la monoespaciada del sistema para el código. Archivo y Doto 700 se precargan.

| Familia | Papel | Notas |
|---|---|---|
| **Archivo** (variable, ejes `wdth` 62–125 % y `wght` 100–900) | Texto y titulares | Texto corrido al 100 % de anchura (peso 380, 1.0625rem/1.65). Titulares, nombres de proyecto y el nombre del autor en **62 % + peso 800 + mayúsculas**. Las frases grandes y ligeras van en peso 200–300 y estrechas: el lema del cartel a 200 y 72 %, el titular de la 404 a 200 y 78 %, las citas y el buscador a 300 y 85 %. Títulos de fila y h3 de los artículos a 700 y 75 %. |
| **Doto** (400/700) | Fuente de puntos | Títulos de sección, números (01, 02…), años, el nombre del cartel, los h2 de los artículos y los títulos de los diálogos. Es la trama hecha tipografía. |
| **Chakra Petch** (500/600) | Etiquetas técnicas | Kickers, metadatos, botones y menús. Siempre en **mayúsculas con espaciado ancho** y tamaño pequeño: casi siempre entre .62 y .8rem y entre .12 y .22em (los extremos: el «una web de» del cartel, a .6rem y .3em). **No es monoespaciada**, aunque el token se llame `--mono`. |
| **Playfair Display** (variable, 400–900) | Máscara del nombre | Solo para recortar el nombre en la lluvia de la portada (`rain.js`, a peso 600): capitales anchas de serif, ensanchadas y separadas, cortadas en tiras. No se ve como texto en ninguna parte. |
| **Monoespaciada del sistema** (`--code`) | Bloques de código y `<code>` | `ui-monospace`, SF Mono, Cascadia, Menlo, Consolas… No se carga ninguna fuente: el código se lee en una cara realmente monoespaciada. |

Escala de titulares (`base.css`), pensada desde el móvil: h1 `clamp(2.6rem, 9vw, 6rem)`, h2 `clamp(1.9rem, 5.4vw, 3.4rem)`, h3 `clamp(1.4rem, 3.4vw, 2rem)`, h4 1.15rem, todos a interlineado 1.02. Los títulos de sección en Doto van a `clamp(3.25rem, 16vw, 5rem)` y, desde 64em, a `clamp(5rem, 9vw, 9rem)`.

Reglas:
- Los títulos de sección **no son texto plano**: se dibujan en puntos con el motor (§5), que «decodifican» desde ruido cuando entran en pantalla (`src/scripts/titles.js`, sobre todo `.decode`). El texto real queda en un `<span class="vh">` para lectores de pantalla. Son los de la home y el de la cabecera de las listas y las páginas interiores cuando cabe (24 caracteres como mucho); uno más largo se queda en Doto como texto.
- Tamaños fluidos con `clamp()`, pensados desde el móvil.
- `text-wrap: balance` en todos los titulares.
- Una sola fuente con eje de anchura sirve para titular estrecho y texto normal, sin cargar dos archivos.
- En árabe no hay fuente propia: el texto cae en la del sistema (`system-ui`), sin estrechar, sin mayúsculas y sin espaciado (§14).

## 4. Trazos y formas

- **Las líneas son punteadas**, nunca sólidas: separadores `1px dotted`, subrayados de enlaces `underline dotted`, y bajo los botones una fila de puntos dibujada con `radial-gradient` (6 px de paso). En hover esos puntos se vuelven verdes.
- **Las esquinas son rectas** (como mucho 2 px). Solo son redondos la píldora del menú y el botón de color, porque flotan bajo el pulgar, y el botón ▶ del vídeo.
- **Las viñetas son puntos** (6 px). Las citas llevan a un lado una columna de puntos verdes (el acento) en lugar de una barra.
- **El foco del teclado** es un contorno punteado: `3px dotted var(--ink)`, separado 5 px del elemento. Es la misma tinta y el mismo lenguaje que la trama. Con `forced-colors`, el contorno toma `Highlight`.

## 5. El motor de puntos (`dots.js`) y la lluvia (`rain.js`)

Dos motores en canvas, en `src/scripts/`. `dots.js` dibuja casi toda la trama (bloques, títulos, miniaturas, campos de proyecto); `rain.js` dibuja la portada y la 404. `blocks.js` monta los bloques: el HTML trae en `data-dots` las opciones de cada uno ya calculadas en el build (`src/lib/home.js`, `projects.js`, `blog.js`) y el navegador solo dibuja.

**`dots.js`**
- **Tramado ordenado de Bayer 8×8, mezclado con ruido**: `bayer × 0.62 + ruido × 0.38 < densidad`. Así se lee como textura y no como cuadrícula.
- **Patrones** (`kind`), sacados de la hoja de referencia: 0 se desvanece hacia la derecha, 1 hacia abajo, 2 racimos, 3 columnas, 4 núcleo, 5 hacia la izquierda y 6 plano.
- **Fuente de 3×5 píxeles** para los números (el de un proyecto sin kanji). En los bloques de proyecto el protagonista es el **kanji del repositorio** (el campo `kanji` de cada proyecto en `src/content/projects.json`, sacado de `data/kanjis-repos.json`), dibujado con puntos de 0,46 de celda, con una celda vacía alrededor de cada trazo. No hay fuente CJK en la web: `src/scripts/kanji-cells.js` guarda cada kanji ya rasterizado de Noto Sans CJK JP Regular (OFL) a tres alturas (24, 32 y 40 puntos), y la web elige la mayor que cabe. Ese archivo se generó una vez con `maqueta/tools/kanji-cells.py`, que se fue con la maqueta (sigue en la historia de git).
- **Tamaño de celda** según la anchura: 7 px (móvil), 8 (desde 768 px) y 9 (desde 1024 px).
- Dibuja a un máximo de 2× de densidad de píxeles, para no castigar a los móviles.
- **Sin JavaScript**, o hasta que se monta, cada canvas enseña un campo de puntos hecho con CSS (`blocks.css`), para que ningún bloque sea un hueco vacío.

Las piezas de `dots.js`:

| Pieza | Qué hace |
|---|---|
| `DotBlock` | Un rectángulo tramado. Se arma con el scroll: cada punto aparece en un momento distinto y sube 14 px hasta su sitio; se deshace al salir de pantalla y duerme mientras no se ve. El puntero lo empuja (radio 70 px). Con `tone` dibuja una foto en semitono; con `frame`, un marco de puntos y un punto tenue en cada celda; con `ghost`, deja el hueco del kanji sin encender (la capa trasera de la tarjeta); con `gloss`, deja libre la esquina del pie de foto. |
| `HeroField` | Texto convertido en partículas que caen desde el ruido hasta su sitio. **No dibuja la portada**: se usa en una línea (`plain`) para los **títulos de sección**, que «decodifican» al entrar en pantalla. Funciona con un muelle y amortiguación y solo dibuja mientras algo se mueve; el puntero empuja (70 px en móvil, 130 en escritorio). Conserva las opciones `poke` (una onda) y `lost` (puntos caídos al suelo), que hoy no usa ninguna página. |
| `fieldPoints` / `fly` | Los puntos de un bloque vuelan a pantalla completa al abrir un proyecto, y vuelven al cerrarlo; a medio vuelo se encienden en verde. |
| `loadTone` / `halftone` | Leen el gris de una foto y deciden qué celda se enciende y de qué tamaño (§6). |

**`RainField` (`rain.js`)**: la lluvia de la portada y de la 404.
- Es una **lluvia de glifos al estilo Matrix** sobre un canvas: una gota por columna escribe un glifo nuevo en su cabeza mientras los que deja atrás se apagan hacia una hoja de código que siempre está ahí; las columnas van en tiras, como en el cartel. La portada y la 404 la piden con la opción `dots`: en vez de glifos, **los puntos del sitio**, pequeños y en una rejilla fina (5 px en móvil, 6 y 7 en pantallas grandes).
- **La máscara** es una forma recortada de esa hoja, al píxel, de modo que toma un poco del color de la página (al 20–25 % de opacidad, sobre un velo tenue; la foto suelta de la 404, a toda su fuerza, o no se leería). Hay tres: **el nombre** (`Nando Muñoz` en Playfair Display, capitales anchas cortadas en tiras desplazadas con una raya fina que se sale en algunos cortes; en el móvil, NANDO sobre MUÑOZ), **los dos gatos del cartel** (`gatos.js`: siluetas trazadas, una saliendo por la izquierda y otra entrando por la derecha) y **una foto leída por su luz** (`src/assets/escritorio.jpg`: lo oscuro corta la lluvia, lo claro la deja; la foto no se enseña nunca, solo se leen sus píxeles).
- **La portada** usa la máscara `cycle`: reposa en el nombre y, cada vez que el puntero la despierta, pasa con un fundido a la siguiente (los gatos y la foto, por turnos), la sostiene y vuelve al nombre antes de quedarse quieta, todo dentro de sus 5 s. **La 404** usa la máscara `image`: la foto del escritorio.
- Bajo la línea del nombre (una fila de puntos), la lluvia se disuelve en la página. La lluvia que cae en verde escribiendo la hoja la primera vez existe como opción (`intro: true`), pero la portada no la usa: la hoja ya está escrita cuando se ve.
- **Un clic o un toque escanea en círculo**: un anillo de puntos verdes crece desde el punto, descodifica cada celda que cruza y el verde se apaga detrás de él (como el botón de color revela la página). En escritorio con ratón, el anillo lleva su lectura en Chakra («R 0240 PX»).
- Se mueve 5 s de tiempo en pantalla y se queda en una imagen fija (`settle()`, WCAG 2.2.2); el puntero la despierta otros 5 s. Con movimiento reducido no hay bucle: solo la imagen fija. Fuera de pantalla o con la pestaña oculta no dibuja.
- **Un regulador de calidad**: mide cuánto cuesta cada fotograma; si el dispositivo no llega, baja una vez a 30 fps y, si sigue sin llegar, a 1× de densidad de píxeles. Nunca vuelve a subir.

## 6. La trama como dato

| Dónde | Qué codifica |
|---|---|
| **Bloques de proyecto** | La **densidad** es el año (2023 → .36, 2024 → .52, 2025 → .68, 2026 → .86; `DENSITY` en `src/lib/home.js`). La **altura** es la longitud del texto. El **dibujo** es la captura del proyecto en semitono (ver abajo); si no carga, un patrón sacado del id. El **kanji** del proyecto ocupa casi todo el alto del bloque (32 o 40 puntos en escritorio, 24 o 32 por debajo de 1024 px, según la longitud del texto) y, alternando, a un lado u otro; el resto (captura, patrón) es fondo abstracto: puntos más pequeños, a media opacidad, con una celda en blanco alrededor de los trazos. La tarjeta de la home es un **rectángulo limpio**: un marco de puntos en el borde y un punto tenue en cada celda; la capa trasera (la mitad de densidad, al 28 %) queda dentro y solo se hunde en profundidad (sin desplazamiento ni sombra). En la esquina inferior derecha, un texto diminuto (`.gloss`, .6rem en Chakra, mayúsculas) con el primer sentido del significado del kanji en el idioma de la página, con esa esquina libre de puntos; usa `--gloss` y, en el panel, `--mute` porque la sombra de la hoja cae encima. |
| **Imagen del proyecto** | Cada proyecto tiene su captura (`src/assets/projects/<id>.jpg`, 1200 px, generada con `astro/tools/project-shots.cjs`; Astro hace las versiones AVIF y WebP). Nunca aparece como foto en la home: el motor lee su gris (`<id>.tone.webp`, 192 px) y la convierte en **semitono**. El gris decide el tamaño de cada punto y empuja un poco cuáles se encienden, pero la media sigue siendo la densidad del año, así que la leyenda sigue valiendo. Una imagen clara (media de gris > .55, como una página o una ilustración sobre blanco) se lee en negativo, para que los puntos dibujen el objeto y no el papel. Si un proyecto tiene una imagen propia mejor que la captura, va en `IMAGES` del script (hoy, Toolbar AEM). Al abrir el proyecto, el campo a pantalla completa la dibuja con más resolución (el kanji ocupa hasta el 80 % del alto del campo y la captura queda de fondo tenue), y en la hoja aparece la captura real en un `<picture>`, en gris, que recupera el color al pasar el ratón. La página de cada proyecto la muestra también, en color y bajo el texto, y arriba su pantalla de puntos con el kanji. Si el proyecto no tiene demo pública, `project-shots.cjs` captura la página de demo del propio repo (`index.html`, servida desde un clon superficial: `LOCAL`, con `ZOOM` si es diminuta) o, si no hay nada que abrir, el README tal como lo pinta GitHub. |
| **Leyenda** («Cómo leer los bloques») | Cuatro muestras, una por año (2023–2026). Aparece en la home y en /proyectos/. |
| **Artículos** | El **patrón** es la categoría (`kind` en `src/content/categories.json`: Código y gestión → columnas; Literatura y pensamiento → racimos). La **densidad** es la longitud del artículo. Todos tienen imagen destacada (`src/content/posts/<slug>/cover.jpg`, con su `cover.tone.webp`), que se usa de **tres maneras**. **Portada del artículo**: la foto real, en gris y algo oscurecida, bajo una **pantalla de puntos** del color de la página (`.cover-screen`, como la compuerta de un vídeo); bajo el puntero la pantalla se funde y la foto toma su color (y vuelve al irse el puntero). No hay trama dibujada ni bucle. **Destacado del blog** y **miniaturas de las filas de artículos** (blog, categorías, etiquetas, relacionados, la home y la 404): la trama dibuja la foto en semitono, igual que en los proyectos, con la foto real debajo, y hacen **un ciclo** al verse por primera vez (`src/scripts/cover-loop.js`, §9). El destacado hace puntos → blanco y negro → color → blanco y negro; **las miniaturas no llegan al color**: solo puntos ↔ blanco y negro, con su propia tabla más corta (`LOOP_BW`, menos de 2 s), y tampoco se colorean con el hover. En una lista, cada fila va 1,3 s detrás de la anterior para que no respiren a la vez. En las listas la foto lleva `alt=""`, porque el título de al lado ya dice qué es. |
| **Categorías** | Cada una con su muestra de trama (su patrón). |
| **404** | No codifica nada: es la lluvia con la foto de un escritorio recortada en ella (§5, §11). |

## 7. Composición y espacio

- **Márgenes laterales**: `--gut: clamp(1.25rem, 5.5vw, 7rem)`. En escritorio, el contenido de las páginas interiores deja al menos 6rem al principio de la línea para el raíl del menú.
- **Cortes de anchura**: `48em` (tableta), `64em` (escritorio) y `90em` (pantalla grande). Se diseña para el móvil y se añade complejidad hacia arriba. Hay cortes menores con motivo propio: `30em` (la píldora del menú en móvil quita los números para que quepan las cuatro secciones; por debajo, la rejilla «O empieza por aquí» de la 404 pasa a una columna), `34rem` de **contenedor** (la línea de tiempo cambia de composición según el ancho de su propia caja, no el de la pantalla) y `40em` (el paginador del blog, el aviso de traducción y los grupos del pie; es una rareza fuera del sistema, a llevar a 48em). Los `47.99em` y `63.99em` son el complemento de 48 y 64. La tarjeta de cookies tiene además un corte de **altura** (`30rem`): en una ventana más baja (un móvil tumbado, el zoom al 400 %) deja de ser fija y va en el flujo.
- **Rejilla de 12 columnas** a partir de 48em, con 1,5rem de separación.
- **Proyectos en la home**: el bloque y el texto se alternan en un ciclo de cuatro posiciones (con seis destacados, el quinto y el sexto repiten las dos primeras):
  - el primero: bloque a la izquierda;
  - el segundo: bloque a la derecha;
  - el tercero: bloque estrecho, con el texto en una tarjeta translúcida que flota sobre su esquina (desde 64em);
  - el cuarto: bloque a la derecha y texto arriba.
- **Secciones muy separadas**: de 6 a 18rem entre secciones y entre proyectos, según la anchura. El aire es parte del diseño.
- **Profundidad**: en escritorio, los bloques de proyecto y las columnas de la bio se desplazan a distinta velocidad con el scroll, y el título de «Escríbeme» entra deslizándose (parallax con `animation-timeline: view()`).
- **Encabezado de sección**: número verde en Chakra (01–04), título en puntos y contador en Chakra («14 proyectos · 2019–2026»).

## 8. Navegación

- **Secciones numeradas**: 01 Bio · 02 Proyectos · 03 Blog · 04 Escríbeme. Los números se repiten en el menú, en los encabezados y en el pie. 01 y 04 son anclas de la home; 02 y 03 llevan a /proyectos/ y /blog/. El menú es HTML (`src/components/Nav.astro`) y funciona sin JavaScript.
- **En el móvil (hasta 47.99em) el menú es la píldora desde el primer pintado** (solo CSS): flotante abajo, bajo el pulgar (con fondo desenfocado), y no cambia de sitio al hacer scroll. La tira de arriba queda solo con el logo y el idioma, con aire. Por debajo de 30em quita los números para que quepan las cuatro secciones.
- **Desde 48em**, sobre el cartel, el menú va en línea, centrado en la tira de arriba, a la altura del logo y el idioma. **Al hacer scroll se ancla** (cuando el texto del cartel se va) con una View Transition, que lo lleva volando de un sitio a otro: en la tableta, a la píldora; en el **escritorio**, a un raíl vertical en el borde del principio de la línea, con el texto girado (`src/scripts/chrome.js`).
- **La sección visible se marca** con `aria-current` y el número en verde, subrayado; en las páginas interiores, la sección a la que pertenecen.
- **Raíl de progreso** (escritorio): una columna de puntos en el borde del final de la línea que se rellena con el scroll.
- **Progreso de lectura** en los artículos: una fila de puntos verdes arriba que se rellena, sobre un degradado del color de la página para leerse encima del texto.
- **Las páginas interiores** (blog, proyectos, políticas, 404) llevan el menú anclado desde el principio (`class="docked"` en `<html>`).
- **Entre páginas** hay View Transitions de documento: la tira de arriba y el menú no parpadean al cambiar de página (sin movimiento reducido).
- **Modo de color**: botón redondo de 2,75rem fijo abajo, en la esquina del final de la línea (`src/scripts/theme.js`; estilos al final de `src/styles/chrome.css`), con un icono por modo (sol, círculo a medias, luna). En el móvil y la tableta se levanta por encima de la píldora del menú. El pie no lo repite: el botón redondo es el único control del modo. Redondo, como ella, porque flota bajo el pulgar. **El cambio es un círculo que crece desde el botón** con el modo nuevo, sobre la página como estaba: una View Transition sobre la raíz cuya instantánea nueva se recorta con `clip-path: circle()` en .65 s; el clic se captura antes del de LUZ para que el modo cambie una vez, dentro de la transición, y el radio llega justo a la esquina más lejana. La píldora del menú pierde su `view-transition-name` mientras dura (si no, se fundiría aparte), y las transiciones CSS se anulan para que nada se congele a medias. Sin View Transitions o con movimiento reducido, el cambio es directo.
- **Idioma**: cada idioma tiene sus rutas (español en la raíz, `/en/` y `/ar/`, con los segmentos traducidos: `/proyectos/`, `/en/projects/`), sus `hreflang` y su `x-default` (el español). El selector (`src/components/LangSwitch.astro`) va arriba al final de la línea: un botón con el nombre del idioma de la página y un chevrón de cinco puntos que abre un `popover` con los tres (funciona sin JavaScript; con él, se coloca bajo el botón y se recorre con las flechas). El idioma de la página es texto, con un punto verde y `aria-current`; los otros son enlaces a esta misma página en ese idioma, cada uno con su `lang`, y conservan el `#fragmento` de donde estás. No se guarda ninguna elección.
- **El pie** (todas las páginas) agrupa lo que no es navegación principal: ver «El pie de página», más abajo.

### El pie de página

Una pieza, `src/components/Footer.astro`, igual en la home y en todas las páginas interiores. Cuatro grupos con un rótulo cada uno (un `<h2>` pequeño, Chakra .62rem en `--mute`) y una línea final:

| Grupo | Qué lleva | Marcado |
|---|---|---|
| **Secciones** | Los mismos nombres y números que el menú: 01 Bio, 02 Proyectos, 03 Blog, 04 Escríbeme. | `<nav>` |
| **Sígueme** | GitHub, LinkedIn, X y RSS, en texto, con ↗ `aria-hidden` y el aviso «(se abre en otra pestaña)» solo para lectores de pantalla (la home tiene todas las redes en «04 Escríbeme»). | `<section>` |
| **Sobre esta web** | Privacidad, Cookies (la política), «Ajustes de cookies» (un botón, oculto hasta que corre el script de consentimiento), Créditos y licencia, y Accesibilidad. | `<nav>` |
| **Idioma** | Los tres idiomas: el de la página como texto con su punto verde y `aria-current`, los otros como enlaces a esta misma página. | `<section>` |
| **Línea final** | «Contenido © nombre, salvo lo que se acredite aparte en los créditos. Hecho con LUZ ↗ (licencia MIT). Cómo usa las cookies esta web, en la política de cookies; puedes cambiar tus ajustes de cookies cuando quieras.» Sin JavaScript, «ajustes de cookies» es un enlace a la política. | `<div>` bajo un separador punteado |

- **Disposición**: un grupo debajo de otro en el móvil, dos por dos desde 40em y los cuatro en fila desde 64em.
- **Nombres**: los del menú y la home, sin inventar otros. El 04 usa el título de la sección en el idioma de la página.
- **Sin nada encima**: deja `7rem` de margen inferior para que la píldora y el botón de color no lo cubran, y la tarjeta de cookies, mientras está visible, suma su altura (`--luz-consent-h`).
- Con `forced-colors`, los botones se subrayan.

## 9. Movimiento

- **Curva**: `--ease: cubic-bezier(.2, .8, .2, 1)`, rápida al salir y suave al llegar.
- **Entradas**: en la home, el texto sube 3rem con un desenfoque que se aclara (`rise`). Si el navegador lo soporta va atado al scroll (`animation-timeline: view()`); si no, un IntersectionObserver añade `.in`. Las animaciones de entrada solo existen con la clase `moving` en `<html>`, que pone el `<head>` cuando no se pide movimiento reducido.
- **El cartel de la portada**: a los 0,9 s empieza a **escribirse a máquina el lema** (una frase por línea, `src/scripts/poster.js`) bajo un cursor fino de terminal, una barra sin ancho para que la línea no se recoloque; cada letra aparece ya en su color, sin estela ni fundido; las palabras clave del lema van en verde (Proyecto, Humano, IA) y las demás (motivo, centro, medio) en cursiva. Al acabar el lema se enciende la línea de créditos, bajo un separador punteado: «una web de», el nombre en Doto y el rol espaciado, que se escriben después. El cursor parpadea cuatro veces y se queda encendido. Las letras salen en una línea de tiempo, no una espera tras otra, así que un hilo principal ocupado pierde fotogramas pero no estira la escritura. El texto está en el HTML desde el principio (se lee sin JavaScript) y en un `.vh` mientras se escribe; con movimiento reducido, el cartel sale ya escrito. En árabe se escribe palabra a palabra.
- **Abrir un proyecto**: los puntos del bloque vuelan a pantalla completa (1 s) y forman un campo con su kanji. La hoja de texto entra desde abajo en el móvil o desde el final de la línea en el escritorio. ← y → pasan de proyecto haciendo volar el campo (.75 s); Esc, el botón de cerrar o el fondo lo cierran, y los puntos vuelven a su bloque (.8 s).
- **Al pasar el ratón por un bloque**, se inclina en 3D hacia el cursor y su copia trasera se separa.
- **Nada se mueve más de 5 s sin que el visitante lo pida** (WCAG 2.2.2): la lluvia de la portada y de la 404 se mueve 5 s de tiempo en pantalla y se queda en una imagen fija (`RainField.settle()`); el puntero la despierta otros 5 s. Las imágenes destacadas con trama (el destacado del blog y las miniaturas de las filas) hacen **un ciclo** al verse por primera vez y quedan en blanco y negro; el ratón sobre la imagen o su título, o el foco del teclado en el título, repiten un ciclo (`coverLoop`, clase `is-rest`). El ciclo dura menos de 5 s (4,6 s con color, menos de 2 s sin él). La portada del artículo no se mueve: su pantalla de puntos solo se funde bajo el puntero. Los títulos en puntos solo dibujan mientras algo los mueve. El punto del aviso de la 404 parpadea tres veces.
- **Con `prefers-reduced-motion: reduce` todo queda quieto**: sin transiciones ni animaciones, sin ciclos ni vuelos, y los puntos aparecen ya en su sitio.

## 10. Páginas

Todas existen en los tres idiomas; la tabla da la ruta en español (en inglés y árabe, con su prefijo y su segmento: `/en/projects/`, `/ar/blog/category/`…).

| Página | URL | Claves |
|---|---|---|
| **Home** | `/` | Cartel de portada: la lluvia de puntos con el nombre, los gatos y el escritorio recortados en ella, el lema escrito a máquina arriba y los créditos abajo (§5, §9); el `<h1>` es el nombre. 01 Bio con tres columnas de trama. 02 Proyectos: solo **seis destacados** (LUZ, Luz AI, ¿Quién canta hoy?, Street Cai, IKAY, Toolbar AEM; `FEATURED` en `src/lib/home.js`), la leyenda y el enlace «Todos los proyectos». Cada tarjeta es un enlace a la página del proyecto; con JavaScript abre el panel (un `<dialog>`) y la dirección pasa a ser la del proyecto, así que se puede compartir y «Atrás» lo cierra. 03 Blog: los tres últimos artículos y «Todos los artículos». 04 Escríbeme: campo de puntos y redes con una línea de puntos que se mueve en hover. Cierra el pie (§8). |
| **Proyectos** | `/proyectos/` | Los 14 visibles, agrupados por año (el año en Doto, fijo al principio de la línea en escritorio), con filtros por tecnología (`?tech=`, solo con JavaScript; sin él se ve la lista entera) y la leyenda. |
| **Proyecto** | `/proyectos/<id>/` | Migas, nombre, entradilla, año, tecnologías (enlazan al filtro), demo y código, la pantalla de puntos con el kanji, el texto, la captura en color, anterior y siguiente, y «Más proyectos» que comparten tecnología. |
| **Blog** | `/blog/`, `/blog/2/`… | El último artículo destacado en grande. El resto agrupado por año, con el año en Doto fijo al principio de la línea en escritorio. Paginación de 5 en 5. Filtros por categoría (chips que se deslizan en el móvil). En inglés y árabe, una nota dice que los artículos están traducidos automáticamente. |
| **Artículo** | `/blog/<slug>/` | Migas, título en Archivo 62 % mayúsculas, entradilla, metadatos (fecha y lectura), portada, índice fijo a un lado (desplegable en móvil), «Compartir artículo» (un solo botón: la hoja nativa del sistema con `navigator.share` donde la hay; si no, o si falla por algo que no sea cancelar, un `<dialog>` con la tarjeta hundida del de cookies: el enlace con «Copiar enlace» y los sitios donde compartir como enlaces normales, que no cargan nada de fuera hasta que se pulsan), etiquetas, autor, anterior y siguiente, relacionados y progreso de lectura. **La portada** es la imagen destacada como `<picture>` real (con `alt` y tamaño, porque importa para el SEO: es la `og:image` y el `image` del JSON-LD) **bajo una pantalla de puntos** (`.cover-screen` en `src/styles/blog.css`: banda de 2,4:1, como mucho el 60 % de la pantalla). La foto va en gris y algo oscurecida, con una rejilla de puntos del color de la página encima, como la portada gris tramada de un vídeo; bajo el puntero la pantalla se funde y la foto toma su color (y se agranda un poco), y vuelve al irse. Sin puntero (táctil) se queda con la pantalla puesta. No hay bucle ni reloj: es un estado, no una animación. El crédito de la imagen va en su propia línea debajo. En inglés y árabe, bajo la entradilla, un aviso (`.post__banner`, con su punto verde) dice que la traducción es automática y enlaza al original en español. |
| **Categorías / categoría** | `/blog/categoria/[<id>/]` | Tarjetas con la muestra de trama de cada una y la leyenda, o la lista de una. |
| **Etiquetas / etiqueta** | `/blog/etiqueta/[<id>/]` | Nube: más grande cuanto más se usa. |
| **404** | cualquier ruta inexistente | Ver §11. |
| **Créditos** | `/creditos/` | «Créditos y licencia»: tipografías con sus autores y la OFL, las piezas de LUZ (MIT), el crédito de la imagen destacada de cada artículo, de dónde salen las imágenes de los proyectos, la licencia y cómo está hecha. Enlazada desde el pie. Textos en `src/i18n/legal/credits.js`. |
| **Cookies** | `/politica-de-cookies/` | La política en lenguaje llano: un resumen «de un vistazo», la elección actual del visitante (YouTube: sí / no / sin elegir, siempre al día, con el botón que abre los ajustes; solo con JavaScript) y secciones cortas, con la tabla de lo que se guarda. Textos en `src/i18n/legal/cookies.js`. |
| **Privacidad** | `/privacidad/` | Corta y en el mismo lenguaje llano. Texto en `src/i18n/legal/privacy.js`, con la fecha de actualización arriba. Enlazada desde el pie y desde la política de cookies. |
| **Accesibilidad** | `/accesibilidad/` | La declaración de accesibilidad, con la misma pieza que las otras páginas legales. Texto en `src/i18n/legal/accessibility.js`. Enlazada desde el pie. |
| **Guía de estilo** | `/estilo/`, `/estilo/puntos/` | Ver §2. Sin indexar. |

**Las páginas legales** (cookies, privacidad, créditos, accesibilidad) comparten pieza (`src/components/legal/LegalPage.astro`): la cabecera de las interiores (migas, título, entradilla y la fecha de actualización con el tiempo de lectura), una columna de lectura de 40rem (`.legal`) y los mismos bloques (`h`, `p`, `ul`, `glance`, `table`, `now`, `covers`). Sus textos viven en `src/i18n/legal/` y se escriben en los tres idiomas; son HTML estático e indexable. Una tabla ancha se desplaza dentro de su propia caja (una región con nombre que se alcanza con el teclado) y nunca ensancha la página.

**Una fila de lista** (artículos y proyectos) tiene siempre la misma forma: miniatura en trama, metadatos en Chakra, título y entradilla. Toda la fila es clicable con un enlace estirado; la categoría queda por encima como enlace propio.

**Las piezas de los artículos** (vienen de soynando.com):
- texto con enlaces punteados;
- titulares h2 en Doto (forman el índice, con un ancla que aparece al pasar) y h3 en Archivo;
- citas destacadas con las letras línea a línea en cursiva, junto a una columna de puntos verdes;
- bloques de código con una barra (el lenguaje en verde y «Copiar») y el resaltado de LUZ con sus tokens `--luz-code-*`: las palabras clave en tinta y negrita, color para lo que escribió el autor, comentarios en cursiva;
- vídeos de YouTube tras una compuerta (`src/scripts/video.js`): sin permiso, la compuerta pregunta (§12); con él, una portada gris tramada con un botón ▶ verde, que solo carga YouTube (sin cookies, `youtube-nocookie.com`) al pulsarlo. Sin JavaScript, un enlace al vídeo;
- tuits como tarjeta con borde;
- tablas que se desplazan de lado;
- líneas de tiempo con el `<luz-timeline>` de LUZ (cargado solo si el artículo tiene una) vestido de Trama, en sus dos versiones: **horizontal** por defecto (una tarjeta cada vez, tallo punteado hasta su fecha en una cinta de fechas, flechas a los lados, teclado y gesto de deslizar) y **vertical** con `layout="vertical"` (todos los pasos a lo largo de un raíl de puntos; el que cruza la mitad de la pantalla se rellena, crece y pone su fecha en verde; los anteriores pasan a tinta). Hoy: la historia de la IA en horizontal y la carrera de los modelos en vertical. La fecha es un `<time datetime>` cuando el texto da una fecha. Sin JavaScript o antes de cargar el script, es la lista ordenada;
- vídeos de Facebook y gists como tarjetas que enlazan fuera (↗), con el dominio como rótulo.

## 11. La 404

- **Arriba, la lluvia con la foto de un escritorio recortada en ella** (`RainField` con la máscara `image`, §5), a todo el ancho (52 % del alto de la pantalla, 62 % en escritorio) y con puntos del sitio en vez de glifos. La foto (`src/assets/escritorio.jpg`) solo se lee por su luz: no se enseña como imagen.
- **Un clic o un toque escanea en círculo** (un anillo de puntos verdes que descodifica lo que cruza). Un aviso en la esquina, con un punto verde que parpadea tres veces («Haz clic para escanear», o «Toca para escanear» en pantallas táctiles), desaparece tras el primer gesto. La lluvia se mueve 5 s y se queda quieta (WCAG 2.2.2); el puntero la despierta otros 5 s.
- Titular: «Esta página se ha deshecho en puntos.», con el kicker «Error 404 · Página no encontrada» en verde. Debajo va la dirección que ha fallado, en monoespaciada.
- **Buscador** sobre artículos y proyectos (`search.json` del idioma), que ya viene relleno con lo que traía la dirección: un campo grande y ligero con una fila de puntos debajo que se vuelve verde al enfocarlo. `/blog/margaret` ofrece «¿Buscabas esto?» con el artículo de Margaret Hamilton. Sin JavaScript no aparece.
- Debajo, «O empieza por aquí»: las cuatro secciones en una rejilla punteada de dos columnas (una por debajo de 30em), y «Lo último del blog» con tres filas. En escritorio, la copia y la rejilla ocupan las columnas 1–6 y el buscador y lo último del blog las 8–12.
- El sitio es estático: la 404 es `404.html` en la raíz, que el servidor devuelve para cualquier ruta inexistente. Si la ruta empieza por `/en/` o `/ar/`, esa página manda a `/en/404/` o `/ar/404/` con la dirección en `?from=`, para responder en su idioma.

## 12. Accesibilidad

- Enlace «Saltar al contenido», el primero al tabular.
- Todos los canvas llevan `aria-hidden`. Lo que dibujan existe también como texto real (títulos con `.vh`, el número y el año del proyecto en el texto; el lema, el nombre y el rol del cartel van como texto, con una copia `.vh` mientras se escriben).
- Foco visible y punteado (§4). En las filas de las listas, el foco se marca en la fila entera. **Excepciones de hoy** (a unificar con la regla): el bloque de código y su botón «Copiar» usan un contorno continuo de 2 px en verde, los idiomas del desplegable un recuadro interior de 2 px en tinta, y el campo de búsqueda de la 404 no lleva contorno: su aviso de foco es la fila de puntos verdes de debajo.
- El panel de proyecto es un `<dialog>` modal con foco en el título, Esc para cerrar y el foco de vuelta al botón que lo abrió.
- Los enlaces que se abren en otra pestaña lo dicen con un texto solo para lectores de pantalla.
- Cada fragmento en otro idioma lleva su `lang` (los nombres de los idiomas, el crédito de una portada, el enlace al original de un artículo traducido).
- Los blancos táctiles miden al menos 2,75rem (44 px): botones, enlaces del menú, paginador, flechas de la línea de tiempo.
- Movimiento reducido respetado en todo (§9). Colores forzados respetados: los canvas conservan sus colores (`forced-color-adjust: none`), la píldora, el botón de color, la tarjeta y los diálogos ganan un borde, y lo actual se subraya.
- **Sin JavaScript** todo se lee: el HTML es estático, el menú y el desplegable de idioma funcionan, los canvas enseñan su campo de puntos de CSS, el cartel está escrito y los vídeos son enlaces. Solo desaparecen lo que no tiene sentido sin script: la tarjeta de cookies, el buscador de la 404, el filtro por tecnología y el botón de compartir.
- **Aviso de cookies**: el `<luz-cookie-consent>` de LUZ (`src/scripts/consent.js`, estilos en `src/styles/consent.css`), con su comportamiento intacto: tarjeta fija abajo (pequeña, en la esquina del final de la línea desde 48em), que no roba el foco ni se anima; Aceptar y Rechazar con el mismo peso; «Ajustes» abre un `<dialog>` modal con la casilla de YouTube; al elegir se cierra al instante y un anuncio cortés lo dice; en el pie, «Ajustes de cookies» (en «Sobre esta web») vuelve a abrirla, y el botón «Cambiar mi elección» de la política hace lo mismo y recibe de vuelta el foco. La elección se guarda en `localStorage` (`luz-consent`) 180 días. Sin JavaScript no aparece. Solo pregunta por lo único que hay: los vídeos de YouTube. Cada vídeo, además, pregunta en su compuerta (que está en YouTube/Google, que su navegador se conectará con Google, que el «sí» vale 180 días para todos los vídeos, enlace a la política, «Aceptar y ver aquí» o «Ver en YouTube ↗»); sin permiso no se pide nada a YouTube, ni la miniatura; al quitar el «sí», el vídeo ya abierto vuelve a su compuerta. El aspecto es de Trama: carbón hundido, una fila de puntos como borde, Chakra sobre su fila de puntos. Mientras se ve, la píldora del menú se aparta (al principio de la línea, o sobre la tarjeta si no cabe), el botón de color sube sobre ella y, desde 48em, los créditos del cartel también.

## 13. Contenido

Todo vive en `src/content/` y se valida en el build (`src/content.config.ts`).

- **Proyectos**: solo repos reales de github.com/nandomunoz; los textos salen de sus README, en los tres idiomas (`src/content/projects.json`; los que no tienen texto árabe usan el español en `/ar/`). Hoy hay 16, de los que 14 se ven (los demás llevan `hidden`). No se inventan proyectos.
- **Blog**: los 11 artículos reales de soynando.com, en `src/content/posts/<slug>/` (`index.md` el original en español, `en.md` y `ar.md` las traducciones automáticas, que lo dicen, y su portada con el crédito). Las imágenes de dentro de los artículos están en `public/img/blog/posts/`. Las categorías y etiquetas (`categories.json`, `tags.json`) son las de allí. Nada depende del WordPress de hoy: `redirects/` lleva las redirecciones de las direcciones viejas.
- **Bio, kicker y redes**: `src/content/site.json`.

## 14. Árabe (`/ar/`) y derecha a izquierda

- `<html lang="ar-SY" dir="rtl">`. La misma hoja de estilos: las reglas usan propiedades lógicas (`inset-inline-start`, `margin-inline`, `padding-block`…), así que todo lo que va «a la izquierda» en español va a la derecha en árabe: el raíl del menú, el botón de color, la tarjeta de cookies, la columna de puntos de las citas de la base, el campo del panel (a la derecha, con la hoja a la izquierda).
- **Sin mayúsculas, sin espaciado y sin cursiva**: el árabe no tiene mayúsculas, el espaciado entre letras rompe su escritura ligada y la cursiva falsa la deforma. Los titulares van a anchura normal y con más interlineado (1.25). Las marcas latinas (el logo, los números de sección) conservan su aspecto.
- **Los nombres latinos conservan su dirección**: el nombre del cartel, los nombres de proyecto y lo que esté en español o inglés llevan `dir="ltr"` o se aíslan, y se colocan en el lado de la página.
- **Las flechas se invierten**: ← y → del panel, las flechas de las listas y de la 404, la de la línea de tiempo y el progreso de lectura, que se rellena desde la derecha.
- **El lema del cartel se escribe palabra a palabra** (las letras árabes se unen: cada una en su caja las dejaría sueltas) y en un cuerpo menor, porque sus líneas son más largas y no se parten entre letras.

## 15. Lo descartado (no volver a proponer)

- **Esténcil** y **Malla**: maquetas rechazadas por completo.
- **Diagonal** y **Digital**: vivieron como otras versiones en la rama `proto/versiones-visuales`, no en Trama.
- **El granate** (y el azul del modo claro) como acento: sustituido por el verde de la lluvia. No hay «rosa»: los puntos a medio desplazar son un verde pálido. Los alias `--blaze*` que conservaba la maqueta ya no existen.
- **El hero como nombre en partículas** (`HeroField` con «NANDO» cayendo desde el ruido) y la **404 con el «404» en puntos y puntos caídos**: sustituidos por el cartel sobre la lluvia y por la lluvia con la foto del escritorio.
- **El bucle de 13 s en la portada del artículo** (puntos → blanco y negro → color, mientras está en pantalla): sustituido por la pantalla de puntos que se funde bajo el puntero. Tampoco hay ciclo de color en la portada.
- **Un pie de una sola fila** con todo mezclado (secciones, políticas, idioma y ajustes): sustituido por los cuatro grupos.
- **El grupo «Preferencias» del pie** (filas «qué, cómo está, botón»): sustituido por el grupo «Idioma» y el botón «Ajustes de cookies» en «Sobre esta web».
- **El idioma por `?lang=`** y el selector ES · EN en línea: sustituidos por rutas propias por idioma y el desplegable.
- **El modo «Auto»** como opción a elegir.

## 16. Pendiente

- **Tokens que faltan**: el velo del diálogo de ajustes de cookies lee `--scrim`, que ya no existe (el de compartir usa `--luz-scrim`); la entrada de las páginas del blog y de los artículos usa la animación `rise-in`, que no está definida, así que no se anima.
- **Dos nombres para un verde**: `--matrix` y `--accent-fill` valen lo mismo en los tres modos. Unificarlos en un `--accent` (con `--on-accent` y `--accent-on-ink`).
- **Años sin densidad**: `DENSITY` solo tiene 2023–2026; los proyectos de 2019 y 2020 (Kong Sole, IKAY) caen en .6, entre 2024 y 2025, y la leyenda no los cuenta.
- **`blog.css` aún usa propiedades físicas** en varias reglas (`left`, `padding-left`, `text-align: left/right`: la columna de puntos de las citas de los artículos, las viñetas, la navegación anterior/siguiente, el reproductor de vídeo, la línea de tiempo); el resto de hojas ya son lógicas. Revisarlas en `/ar/`.
- **Del informe de diseño de la maqueta**, lo que el código sigue mostrando: el foco del código, de «Copiar» y del buscador de la 404 fuera de la regla del §4; la escala de rótulos en Chakra (muchos tamaños casi iguales) y de `letter-spacing` sin tokens; unas ocho copias del botón «texto sobre fila de puntos» (y `.consent__btn` definido dos veces en `consent.css`); el pie a 1024 px (cuatro columnas estrechas) y sus dos tonos de línea (`--glow` arriba, `--faint` en la línea final); el punto medio del modo claro (`--dot-mid`, 1,8:1 sobre el papel); y el corte de `40em`.
- **Medir la lluvia** (portada y 404) en móviles modestos y probarla en Safari: tiene un modo ligero para móvil y pantalla táctil y un regulador de calidad, pero no se ha medido en un teléfono real.
- **Los gatos del cartel** son un dibujo de terceros (siluetas trazadas de un cartel): hay que aclarar su uso antes de publicar.
