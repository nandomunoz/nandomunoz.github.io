# Trama · decisiones de diseño

Trama es la versión del portfolio que se llevará a `main`. Hoy vive en la rama `proto/home` como maqueta (`maqueta/`). Se sirve con `python3 maqueta/serve.py` → http://localhost:8766/maqueta/.

Este documento recoge **qué se decidió y por qué**, para que cualquier pieza nueva hable el mismo idioma. Si algo de aquí cambia, se cambia aquí también.

---

## 1. La idea

**Todo es una trama de puntos.** La referencia es una hoja de patrones de puntos tramados (`maqueta/refs/puntos-tramados.png`): puntos blancos sobre carbón, densidades que cuentan algo.

- Una sola tinta (blanco roto) sobre un solo papel (carbón). Un único acento: **verde**, el de la lluvia de la portada (`--matrix`), que solo aparece donde el usuario toca o donde algo está activo. Fue granate (y azul en el modo claro) hasta que la portada pasó a ser un cartel sobre una lluvia al estilo Matrix; el verde la une con el resto de la web.
- **La portada es un cartel sobre la lluvia** (§5, §10): glifos de lluvia en verde sobre el carbón, con el nombre, los dos gatos del cartel y la foto de un escritorio recortados en ella, y encima el lema y los créditos escritos a máquina.
- La trama **significa**, no decora. La densidad, la altura o el patrón de un bloque siempre codifican un dato: el año, la longitud del texto o la categoría. Si un adorno no cuenta nada, sobra.
- Los puntos **se arman al entrar en pantalla** y **reaccionan al puntero**. La página parece hecha de partículas que se ordenan.
- Mucho aire: márgenes generosos, secciones muy separadas y profundidad (capas que se mueven a distinta velocidad).
- **Móvil primero.** En escritorio la composición se complica: rejilla de 12 columnas, bloques que se cruzan y textos que flotan sobre los bloques.

## 2. Color

El carbón, la tinta y el verde (los valores del modo oscuro; los otros dos modos, abajo):

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#292929` | Fondo de todo (carbón) |
| `--bg-2` | `#232323` | Superficies hundidas: panel, código, píldora del menú, compuerta del vídeo |
| `--ink` | `#f4f2ee` | Texto principal y puntos |
| `--mute` | `#b9b6b0` | Texto secundario, entradillas |
| `--faint` | `#6f6c68` | Puntos y líneas punteadas (2,8:1: no vale para texto) |
| `--faint-text` / `--gloss` | `#969189` | Texto gris que sí llega a AA (4,6:1 sobre el carbón): fechas, contadores, el pie, el pie de foto del kanji |
| `--matrix` | `#22c55e` | Único acento: estado activo, foco del puntero, hover, número de sección, el lema del cartel (6,4:1 sobre el carbón) |
| `--dot-mid` (canvas) | `#86bf98` | Punto a medio desplazar, entre tinta y verde |

- **Tres modos de color**, con el `<luz-theme-mode>` de LUZ como un botón redondo fijo abajo a la derecha (§8): **oscuro** (el de Trama y el de entrada), **claro** y **contraste alto**. No hay «Auto» para elegir. Al pulsar, rota claro → contraste alto → oscuro. El modo es `data-mode` en `<html>`, escrito antes del primer pintado por una línea en el `<head>` de cada página (sin parpadeo): lo guardado, o contraste alto si el sistema lo pide, o oscuro. La elección se guarda en `localStorage` (`luz-theme`) solo al pulsar, y la política de cookies lo dice.

| Token | Oscuro | Claro | Contraste alto |
|---|---|---|---|
| `--bg` / `--bg-2` | `#292929` / `#232323` | `#e9eff5` / `#d9e3ed` | `#000` / `#0d0d0d` |
| `--ink` | `#f4f2ee` | `#18222c` | `#fff` |
| `--mute` | `#b9b6b0` | `#434f5b` | `#f0f0f0` |
| `--faint` | `#6f6c68` | `#56626e` | `#c9c9c9` |
| `--faint-text` / `--gloss` | `#969189` | `--faint` | `--faint` |
| `--matrix` (acento: texto, UI, relleno) | `#22c55e` | `#0a6f35` (verde oscuro sobre el papel) | `#5dff8f` |
| `--on-matrix` (texto sobre relleno verde: selección, ▶ del vídeo) | `#1a1a1a` | `#e9eff5` | `#000` |
| `--matrix-on-ink` (verde sobre relleno de tinta: el número del chip actual) | `#0b6b34` | `#3dff7a` | `#0b6b34` |
| `--prose` (texto corrido de los artículos) | `#dedbd5` | `#27323d` | `#fff` |
| `--scrim` (velo tras el diálogo de cookies) | `#1a1a1a` al 80 % | `#e9eff5` al 82 % | `#000` al 88 % |
| `--dot-ink` / `--dot-mid` / `--dot-blaze` (canvas) | `#f4f2ee` / `#86bf98` / `#22c55e` | `#18222c` / `#86bf98` / `#22c55e` | `#fff` / `#c2ffd4` / `#5dff8f` |
| `--luz-code-*` (código de los artículos) | esquema oscuro de LUZ | esquema claro de LUZ (el comentario un peldaño más oscuro, porque `--bg-2` es más azul que la superficie de LUZ) | esquema oscuro de LUZ |

  Todo el CSS lee tokens (también los blancos translúcidos: `--edge`, `--edge-2`, `--rule`, `--glow`, y `--shade` para las sombras); en contraste alto las líneas se hacen visibles y `--glow` desaparece. **Nombres heredados**: `--blaze`, `--on-blaze`, `--blaze-on-ink` y `--dot-blaze` son alias de los de `--matrix` (la última línea de los tokens en `style.css`), y `--blaze-lift` vale `none`; el granate ya no existe, pero el nombre se conserva hasta que se unifique en un solo `--accent` al portarlo. Los contrastes de texto sobre fondo en claro y en contraste alto cumplen AA (claro: tinta 14:1, `--faint` 5,4:1 sobre el papel y 4,8:1 sobre `--bg-2`; el acento 5,4:1 y 4,8:1; contraste alto: ≥ 12:1). En el oscuro, `--faint` sigue en 2,8:1, así que **el texto gris usa `--faint-text`** y `--faint` queda para puntos y líneas. «Auto» está fijado a oscuro (`autoMode` en `shared/theme.js`): el esquema del sistema no mueve la página; solo «más contraste» lo hace, y entonces el radio `auto` se renombra para que el nombre del botón no se quede atrás. El título de la puerta del vídeo va sobre su propia placa oscura, para leerse sobre cualquier miniatura en cualquier modo.
- **En claro, los puntos son oscuros sobre papel**, así que una foto se lee al revés que en oscuro (los puntos dibujan lo oscuro, como una impresión), salvo una imagen clara ya leída en negativo (una página sobre blanco), que dibuja su contenido en los dos modos. Una imagen hundida bajo sus puntos se aclara en lugar de oscurecerse (`--sink`).
- Al cambiar de modo se redibuja todo con los colores nuevos (`readPalette` en `dots.js`, `readP` en `rain.js`, y cada página recrea sus bloques).
- En los puntos, el color indica **cuánto se ha movido** cada uno: tinta en reposo, `--dot-mid` (un verde pálido) si está un poco desplazado y el verde del acento si está muy desplazado. El verde es literalmente «donde tocas». Los campos de puntos de los proyectos (tarjetas y panel) se vuelven verdes mientras el puntero está encima (`shared/green.js`, con una gemela de cada capa del canvas y un fundido de 260 ms).
- Las imágenes de los artículos van en escala de grises y recuperan el color con el puntero. Así no rompen la paleta.

## 3. Tipografía

Cuatro familias, todas servidas desde `/assets/fonts/`, más la monoespaciada del sistema para el código:

| Familia | Papel | Notas |
|---|---|---|
| **Archivo** (variable, eje `wdth` 62–125 %) | Texto y titulares | Texto corrido al 100 % de anchura (peso 380). Titulares de proyectos y nombres en **62 % + peso 800 + mayúsculas**. Entradillas grandes en peso 200–300 y anchura ~78 %. |
| **Doto** (400/700) | Fuente de puntos | Títulos de sección, números (01, 02…), años y titulares dentro de los artículos. Es la trama hecha tipografía. |
| **Chakra Petch** (500/600) | Etiquetas técnicas | Kickers, metadatos, botones y menús. Siempre en **mayúsculas con espaciado ancho** (`letter-spacing` .14–.22em) y tamaño pequeño (.62–.8rem). **No es monoespaciada**, aunque el token se llame `--mono`. |
| **Playfair Display** (variable, 400–900) | Máscara del nombre | Solo para recortar el nombre en la lluvia de la portada (`rain.js`, a peso 600): capitales anchas de serif, ensanchadas y separadas, cortadas en tiras. No se ve como texto en ninguna parte. |
| **Monoespaciada del sistema** (`--code`) | Bloques de código y `<code>` | `ui-monospace`, SF Mono, Cascadia, Menlo, Consolas… No se carga ninguna fuente: el código se lee en una cara realmente monoespaciada. |

Reglas:
- Los títulos de sección **no son texto plano**: se dibujan en puntos con el motor (§5), que «decodifican» desde ruido cuando entran en pantalla. El texto real queda en un `<span class="vh">` para lectores de pantalla.
- Tamaños fluidos con `clamp()`, pensados desde el móvil.
- `text-wrap: balance` en todos los titulares.
- Una sola fuente con eje de anchura sirve para titular estrecho y texto normal, sin cargar dos archivos.

## 4. Trazos y formas

- **Las líneas son punteadas**, nunca sólidas: separadores `1px dotted`, subrayados de enlaces `underline dotted`, y bajo los botones una fila de puntos dibujada con `radial-gradient` (6 px de paso). En hover esos puntos se vuelven verdes.
- **Las esquinas son rectas.** Solo es redonda la píldora del menú en móvil, porque es un objeto que flota bajo el pulgar.
- **Las viñetas son puntos** (6 px). Las citas llevan a la izquierda una columna de puntos verdes (el acento) en lugar de una barra.
- **El foco del teclado** es un contorno punteado: `3px dotted var(--ink)`, separado 5 px del elemento. Es la misma tinta y el mismo lenguaje que la trama.

## 5. El motor de puntos (`dots.js`) y la lluvia (`rain.js`)

Dos motores en canvas. `dots.js` dibuja casi toda la trama (bloques, títulos, miniaturas, campos de proyecto); `rain.js` dibuja la portada y la 404.

**`dots.js`**
- **Tramado ordenado de Bayer 8×8, mezclado con ruido**: `bayer × 0.62 + ruido × 0.38 < densidad`. Así se lee como textura y no como cuadrícula.
- **Patrones** (`kind`), sacados de la hoja de referencia: 0 se desvanece hacia la derecha, 1 hacia abajo, 2 racimos, 3 columnas, 4 núcleo, 5 hacia la izquierda y 6 plano.
- **Fuente de 3×5 píxeles** para los números (el de un proyecto sin kanji, la etiqueta de un bloque). En los bloques de proyecto el protagonista es el **kanji del repositorio** (`data/kanjis-repos.json`), dibujado con puntos de 0,46 de celda, con una celda vacía alrededor de cada trazo. No hay fuente CJK en la web: `maqueta/tools/kanji-cells.py` rasteriza una sola vez Noto Sans CJK JP Regular (OFL) a tres alturas (24, 32 y 40 puntos) en `shared/kanji-cells.js`, y la web elige la mayor que cabe.
- **Tamaño de celda** según la anchura: 7 px (móvil), 8 (tableta) y 9 (escritorio).
- Dibuja a un máximo de 2× de densidad de píxeles, para no castigar a los móviles.

Las piezas de `dots.js`:

| Pieza | Qué hace |
|---|---|
| `DotBlock` | Un rectángulo tramado. Se arma con el scroll: cada punto aparece en un momento distinto y sube 14 px hasta su sitio. El puntero lo empuja (radio 70 px). |
| `HeroField` | Texto convertido en partículas que caen desde el ruido hasta su sitio. Ya **no dibuja la portada**: se usa en una línea (`plain`) para los **títulos de sección** (los de la home y el de la cabecera de las páginas interiores: listas, proyectos, políticas; el título de un artículo es texto en Archivo), que «decodifican» al entrar en pantalla. Funciona con un muelle y amortiguación; el puntero empuja (70 px en móvil, 130 en escritorio) y un toque lanza una onda. Conserva la opción `lost` (puntos caídos al suelo), que hoy no usa ninguna página. |
| `fieldPoints` / `fly` | Los puntos de un bloque vuelan a pantalla completa al abrir un proyecto, y vuelven al cerrarlo. |

**`RainField` (`rain.js`)**: la lluvia de la portada y de la 404.
- Es una **lluvia de glifos al estilo Matrix** sobre un canvas: una gota por columna escribe un glifo nuevo en su cabeza (en tinta) mientras las que deja atrás se apagan hacia una hoja de código que siempre está ahí; las columnas van en tiras, como en el cartel. En la portada y la 404 se pide con la opción `dots`: en vez de glifos, **los puntos del sitio**, pequeños y en una rejilla fina (5 px en móvil, 6 y 7 en pantallas grandes), con el tamaño del punto como el glifo.
- **La máscara** es una forma recortada de esa hoja, al píxel, de modo que toma un poco del color de la página (al 20–25 % de opacidad, sobre un velo tenue; la foto suelta de la 404, a toda su fuerza, o no se leería). Hay tres: **el nombre** (`Nando Muñoz` en Playfair Display, capitales anchas cortadas en tiras desplazadas con una raya fina que se sale en algunos cortes; en el móvil, NANDO sobre MUÑOZ), **los dos gatos del cartel** (`gatos.js`: siluetas trazadas, una saliendo por la izquierda y otra entrando por la derecha) y **una foto leída por su luz** (`img/escritorio.jpg`: lo oscuro corta la lluvia, lo claro la deja; la foto no se enseña nunca, solo se leen sus píxeles).
- **La portada** usa la máscara `cycle`: reposa en el nombre y, cada vez que el puntero, al moverse, la despierta, pasa a los gatos y luego a la foto, por turnos, con fundido. **La 404** usa la máscara `image`: la foto del escritorio.
- **La primera vez** que carga, la lluvia empieza vacía y cada columna cae en verde escribiendo la hoja antes de que entre la máscara. Bajo la línea del nombre, la lluvia se disuelve en la página.
- **Un clic o un toque escanea en círculo**: un anillo de puntos verdes crece desde el punto, descodifica cada celda que cruza y el verde se apaga detrás de él (como el botón de color revela la página). En escritorio, el anillo lleva su lectura en Chakra («R 0240 PX»).
- Se mueve 5 s y se queda en una imagen fija (`settle()`, WCAG 2.2.2); el puntero la despierta otros 5 s. Con movimiento reducido no hay bucle: solo la imagen fija.
- `maqueta/variantes/` guarda las pruebas de portada con la misma pieza.

## 6. La trama como dato

| Dónde | Qué codifica |
|---|---|
| **Bloques de proyecto** | La **densidad** es el año (2023 → .36, 2024 → .52, 2025 → .68, 2026 → .86). La **altura** es la longitud del texto. El **dibujo** es la captura del proyecto en semitono (ver abajo); si no carga, un patrón sacado del id. El **kanji** del proyecto ocupa casi todo el alto del bloque (32 o 40 puntos en escritorio, 24 o 32 en móvil, según la longitud del texto) y, alternando, a un lado u otro; el resto (captura, patrón) es fondo abstracto: puntos más pequeños, a media opacidad, con una celda en blanco alrededor de los trazos. La tarjeta de la home es un **rectángulo limpio**: un marco de puntos en el borde y un punto tenue en cada celda; la capa trasera queda dentro y solo se hunde en profundidad (sin desplazamiento ni sombra). En la esquina inferior derecha, un texto diminuto (`.gloss`, .6rem mono, mayúsculas) con el primer sentido del significado del kanji (`meaning` / `meaning_en`), con esa esquina libre de puntos; usa `--gloss` (4,6:1 sobre el carbón; `--faint` solo da 2,8:1) y, en el panel, `--mute` porque la sombra de la hoja cae encima. |
| **Imagen del proyecto** | Cada proyecto tiene su captura (`maqueta/img/proyectos/`, generada con `maqueta/tools/project-shots.cjs`). Nunca aparece como foto en la home: el motor lee su gris (`<id>.tone.webp`, 192 px) y la convierte en **semitono**. El gris decide el tamaño de cada punto y empuja un poco cuáles se encienden, pero la media sigue siendo la densidad del año, así que la leyenda sigue valiendo. Una imagen clara (media de gris > .55, como una página o una ilustración sobre blanco) se lee en negativo, para que los puntos dibujen el objeto y no el papel. Si un proyecto tiene una imagen propia mejor que la captura, va en `IMAGES` del script (hoy, Toolbar AEM). Al abrir el proyecto, el campo a pantalla completa la dibuja con más resolución (el kanji ocupa hasta el 80 % del alto del campo y la captura queda de fondo tenue), y en la hoja aparece la captura real en un `<picture>`, en gris, que recupera el color al pasar el ratón. La página de cada proyecto la muestra también, en color y bajo el texto. Si el proyecto no tiene demo pública, `project-shots.cjs` captura la página de demo del propio repo (`index.html`, servida desde un clon superficial: `LOCAL`, con `ZOOM` si es diminuta) o, si no hay nada que abrir, el README tal como lo pinta GitHub (`README`). |
| **Leyenda** («Cómo leer los bloques») | Cuatro muestras, una por año. Aparece en la home y en /proyectos/. |
| **Artículos** | El **patrón** es la categoría (Código y gestión → columnas; Literatura y pensamiento → racimos). La **densidad** es la longitud del artículo. Si el post tiene imagen destacada (todos la tienen; `maqueta/img/blog/`, traída con `maqueta/tools/soynando-covers.cjs`), se usa de **tres maneras**. **Portada del artículo**: la foto real, en gris y algo oscurecida, bajo una **pantalla de puntos** del color de la página (`.cover-screen`, como la compuerta de un vídeo); bajo el puntero la pantalla se funde y la foto toma su color (y vuelve al irse el puntero). No hay trama dibujada ni bucle (ver §10). **Destacado del blog** y **miniaturas de las filas** (blog, categorías, etiquetas, relacionados, la home y la 404): la trama dibuja la foto en semitono, igual que en los proyectos, con la foto real debajo, y hacen **un ciclo** al verse por primera vez (`coverLoop`, §9). El destacado hace puntos → blanco y negro → color → blanco y negro; **las miniaturas no llegan al color**: solo puntos ↔ blanco y negro, con su propia tabla más corta (`LOOP_BW`, menos de 2 s), y tampoco se colorean con el hover. En una lista, cada fila va 1,3 s detrás de la anterior para que no respiren a la vez. En las listas la foto lleva `alt=""`, porque el título de al lado ya dice qué es. Un post sin imagen destacada conserva la trama de su categoría, también en su portada. |
| **Categorías** | Cada una con su muestra de trama. |
| **404** | No codifica nada: es la lluvia con la foto de un escritorio recortada en ella (§5, §11). |

## 7. Composición y espacio

- **Márgenes laterales**: `--gut: clamp(1.25rem, 5.5vw, 7rem)`. En escritorio, el contenido de las páginas interiores deja al menos 6rem a la izquierda para el raíl del menú.
- **Cortes de anchura**: `48em` (tableta), `64em` (escritorio) y `90em` (pantalla grande). Se diseña para el móvil y se añade complejidad hacia arriba. Hay tres cortes menores con motivo propio: `30em` (la píldora del menú en móvil quita los números para que quepan las cuatro secciones, y la rejilla «O empieza por aquí» de la 404 pasa a una columna), `34rem` de **contenedor** (la línea de tiempo cambia de composición según el ancho de su propia caja, no el de la pantalla) y `40em` (el paginador del blog y los grupos del pie pasan a dos columnas; es una rareza fuera del sistema, a llevar a 48em). Los `47.99em` y `63.99em` son el complemento de 48 y 64.
- **Rejilla de 12 columnas** a partir de 48em, con 1,5rem de separación.
- **Proyectos en la home**: el bloque y el texto se alternan en un ciclo de cuatro posiciones, sin repetirse:
  - el primero: bloque a la izquierda;
  - el segundo: bloque a la derecha;
  - el tercero: bloque estrecho, con el texto en una tarjeta translúcida que flota sobre su esquina;
  - el cuarto: bloque a la derecha y texto arriba.
- **Secciones muy separadas**: de 6 a 18rem entre secciones y entre proyectos, según la anchura. El aire es parte del diseño.
- **Profundidad**: en escritorio, los bloques y las columnas de la bio se desplazan a distinta velocidad con el scroll (parallax con `animation-timeline: view()`).
- **Encabezado de sección**: número verde en Chakra (01–04), título en puntos y contador en mono («13 proyectos · 2023–2026»).

## 8. Navegación

- **Secciones numeradas**: 01 Bio · 02 Proyectos · 03 Blog · 04 Escríbeme. Los números se repiten en el menú, en los encabezados y en las páginas interiores.
- **En el móvil (hasta 47.99em) el menú es la píldora desde el primer pintado**: flotante abajo, bajo el pulgar (con fondo desenfocado), y no cambia de sitio al hacer scroll. La tira de arriba queda solo con el logo y el idioma, con aire (se probaron seis maneras en `variantes/cabecera.html`; las filas de enlaces apiladas quedaban pegadas al titular). Por debajo de 30em quita los números para que quepan las cuatro secciones.
- **Desde 48em**, sobre el hero, va el menú en línea. **Al hacer scroll se ancla** con una View Transition, que lo lleva volando de un sitio a otro: en la tableta, a la píldora; en el **escritorio**, a un raíl vertical en el borde izquierdo, con el texto girado.
- **La sección visible se marca** con `aria-current` y el número en verde.
- **Raíl de progreso** (escritorio): una columna de puntos a la derecha que se rellena con el scroll.
- **Progreso de lectura** en los artículos: una fila de puntos verdes arriba que se rellena.
- **Las páginas interiores** (blog, proyectos, 404) llevan el menú anclado desde el principio.
- **Modo de color**: botón redondo fijo abajo a la derecha (`shared/theme.js`; estilos al final de `style.css`). En el móvil se levanta por encima de la píldora del menú. El pie no lo repite: el botón redondo es el único control del modo. Redondo, como ella, porque flota bajo el pulgar. **El cambio es un círculo que crece desde el botón** con el modo nuevo, sobre la página como estaba (idea de coac.com.es): una View Transition sobre la raíz cuya instantánea nueva se recorta con `clip-path: circle()` en .65 s; el clic se captura antes del de LUZ para que el modo cambie una vez, dentro de la transición, y el radio llega justo a la esquina más lejana. La píldora del menú pierde su `view-transition-name` mientras dura (si no, se fundiría aparte), y las transiciones CSS se anulan para que nada se congele a medias. Sin View Transitions o con movimiento reducido, el cambio es directo.
- **Idioma**: `?lang=en`. Todos los enlaces internos lo conservan, y no se guarda ninguna elección: el `?lang` de cada enlace la lleva. El selector **ES · EN** (`langSwitch`, `blog/parts.js`) va arriba a la derecha y repetido en el pie: el idioma de la página es texto (en tinta, con subrayado punteado verde y `aria-current`), el otro es un enlace a esta misma página en ese idioma; cada uno lleva su `lang` y su nombre completo («Español», «English») para el lector de pantalla.
- **El pie** (todas las páginas) agrupa lo que no es navegación principal: ver «El pie de página», más abajo.

### El pie de página

Una pieza, `footer()` en `blog/parts.js`, que pintan igual la home y todas las páginas interiores (la reorganización parte del plan de la maqueta, §5). Cuatro grupos con un rótulo cada uno (un `<h2>` pequeño, Chakra .62rem en `--mute`) y una línea final:

| Grupo | Qué lleva | Marcado |
|---|---|---|
| **Secciones** | Los mismos nombres y números que la píldora y la home: 01 Bio, 02 Proyectos, 03 Blog, 04 Escríbeme. | `<nav>` |
| **Sígueme** | GitHub, LinkedIn, X y RSS, en texto, con ↗ `aria-hidden` y el aviso «(se abre en otra pestaña)» solo para lectores de pantalla (la home tiene todas las redes en «04 Escríbeme»). | `<section>` |
| **Sobre esta web** | Lo informativo y legal, que son páginas y se ven como enlaces: Privacidad, Cookies (la política) y Créditos y licencia. | `<nav>` |
| **Preferencias** | Lo que cambia algo aquí, con aspecto de control y no de enlace: dos filas con «qué, cómo está, botón». **Idioma** (el mismo ES · EN); **Cookies** («YouTube: sí / no / sin elegir» y «Cambiar», que abre el diálogo de ajustes). | `<section>` |
| **Línea final** | «© nombre · año · Todos los derechos reservados, salvo lo que se acredite aparte. Hecho con LUZ ↗» y, debajo, el lema, el mismo que escribe el cartel de la portada. | `<div>` bajo un separador punteado |

- **Disposición**: un grupo debajo de otro en el móvil, dos por dos desde 40em y los cuatro en fila desde 64em. Las filas de Preferencias llevan el rótulo en su propia línea, el estado en tinta y el botón a la derecha (`.foot__btn`: texto sobre la fila de puntos de siempre, que se vuelve verde en hover), separadas por una línea punteada.
- **Nombres**: los de la píldora y la home, sin inventar otros. El 04 usa el título de la sección en el idioma de la página.
- **Sin nada encima**: el pie no lo tapa la tarjeta de cookies (suma su altura mientras se ve). Deja `7rem` de margen inferior para que la píldora y el botón de color no lo cubran, y la tarjeta de cookies, mientras está visible, suma su altura (`--luz-consent-h`).
- Con `forced-colors`, los botones se subrayan (pierden la fila de puntos).

## 9. Movimiento

- **Curva**: `--ease: cubic-bezier(.2, .8, .2, 1)`, rápida al salir y suave al llegar.
- **Entradas**: el texto sube 1,4–3rem con un desenfoque que se aclara (`rise-in`, `rise`). Si el navegador lo soporta va atado al scroll (`animation-timeline: view()`); si no, un IntersectionObserver añade `.in`.
- **El cartel de la portada**: la lluvia cae la primera vez columna a columna, en verde, y la máscara del nombre entra cuando ha llenado la hoja (~1,5 s). A los 0,9 s empieza a **escribirse a máquina el lema** (una frase por línea, `shared/poster.js`) bajo un cursor fino de terminal, una barra sin ancho para que la línea no se recoloque; cada letra aparece ya en su color, sin estela ni fundido; las palabras clave del lema van en verde (Proyecto, Humano, IA) y las demás en cursiva. Al acabar el lema se enciende la línea de créditos, bajo un separador punteado: «una web de», el nombre en Doto y el rol espaciado, que se escriben después. El texto real está en un `.vh` para lectores de pantalla; con movimiento reducido, el cartel sale ya escrito.
- **Abrir un proyecto**: los puntos del bloque vuelan a pantalla completa (1 s) y forman un campo con su kanji. La hoja de texto entra desde abajo en el móvil o desde la derecha en el escritorio. ← y → pasan de proyecto haciendo volar el campo; Esc o el fondo lo cierran, y los puntos vuelven a su bloque.
- **Al pasar el ratón por un bloque**, se inclina en 3D hacia el cursor y su copia trasera se separa.
- **Nada se mueve más de 5 s sin que el visitante lo pida** (WCAG 2.2.2): la lluvia del hero y de la 404 se mueve 5 s de tiempo en pantalla y se queda en una imagen fija (`RainField.settle()`); el puntero la despierta otros 5 s. Las imágenes destacadas con trama (el destacado del blog y las miniaturas de las filas) hacen **un ciclo** — puntos → blanco y negro → color → blanco y negro — al verse por primera vez y quedan en blanco y negro; el ratón o el foco del teclado sobre ellas repiten un ciclo (`coverLoop`, clase `is-rest`). El ciclo dura menos de 5 s (4,6 s con color, menos de 2 s sin él). La portada del artículo no se mueve: su pantalla de puntos solo se funde bajo el puntero.
- **Con `prefers-reduced-motion: reduce` todo queda quieto**: sin transiciones ni animaciones, y los puntos aparecen ya en su sitio.

## 10. Páginas

| Página | URL (maqueta) | Claves |
|---|---|---|
| **Home** | `/maqueta/` | Cartel de portada: la lluvia verde con el nombre, los gatos y el escritorio recortados en ella, el lema escrito a máquina arriba y los créditos abajo (§5, §9). 01 Bio con tres columnas de trama. 02 Proyectos: solo **cinco destacados** (LUZ, ¿Quién canta hoy?, Street Cai, IKAY, Toolbar AEM) y el enlace «Todos los proyectos». 03 Blog: los tres últimos artículos y «Todos los artículos». 04 Escríbeme: campo de puntos y redes con una línea de puntos que se mueve en hover. Cierra el pie (§8). |
| **Proyectos** | `/proyectos/` | Los 13, agrupados por año, con filtros por tecnología (`?tech=`) y la leyenda. |
| **Proyecto** | `/proyectos/proyecto/?p=id` | Nº, año, tecnologías (enlazan al filtro), demo y código, el bloque grande, el texto, anterior y siguiente, y «Más proyectos» que comparten tecnología. |
| **Blog** | `/blog/` | El último artículo destacado en grande. El resto agrupado por año, con el año en Doto fijo a la izquierda en escritorio. Paginación de 5 en 5. Filtros por categoría. |
| **Artículo** | `/blog/articulo/?a=id` | Migas, título en Archivo 62 % mayúsculas, entradilla, metadatos (fecha y lectura; sin enlace al original: el sitio será soynando.com), portada, índice fijo a la izquierda (desplegable en móvil), «Compartir artículo» (un solo botón: la hoja nativa del sistema con `navigator.share` donde la hay; si no, o si falla por algo que no sea cancelar, un `<dialog>` con la tarjeta hundida del de cookies: el enlace con «Copiar enlace» y WhatsApp, X, Telegram, LinkedIn, Facebook, Bluesky y correo como enlaces normales, que no cargan nada de fuera hasta que se pulsan), etiquetas, autor, anterior y siguiente, relacionados y progreso de lectura. **La portada** es la imagen destacada como `<picture>` real (con `alt` y tamaño, porque importa para el SEO: será la `og:image` y el `image` del JSON-LD) **bajo una pantalla de puntos** (`.cover-screen` en `blog.css`: banda de ~2,4:1, como mucho el 60 % de la pantalla). La foto va en gris y algo oscurecida, con una rejilla de puntos del color de la página encima, como la portada gris tramada de un vídeo; bajo el puntero la pantalla se funde y la foto toma su color (y se agranda un poco), y vuelve al irse. Sin puntero (táctil) se queda con la pantalla puesta. No hay bucle ni reloj: es un estado, no una animación. El crédito de la imagen va en su propia línea debajo. Un artículo sin imagen destacada lleva la trama de su categoría en su lugar. |
| **Categorías / categoría** | `/blog/categoria/[?c=]` | Tarjetas con la muestra de trama de cada una, o la lista de una. |
| **Etiquetas / etiqueta** | `/blog/etiqueta/[?t=]` | Nube: más grande cuanto más se usa. |
| **404** | cualquier ruta inexistente | Ver §11. |
| **Créditos** | `/creditos/` | Se llama «Créditos y licencia»: tipografías con sus autores y el texto OFL (`assets/fonts/OFL.txt`), las piezas de LUZ (MIT), una línea por artículo con el crédito de su imagen destacada (sale de `blog.json`), de dónde salen las imágenes de los proyectos, las letras citadas, la licencia (código MIT, `LICENSE`; textos e imágenes propias con todos los derechos reservados, salvo lo acreditado) y cómo está hecha («Escrito por un humano. Programado por un humano más la IA…»). Enlazada desde el pie. Textos en `maqueta/shared/credits.js`. |
| **Cookies** | `/cookies/` | La política en lenguaje llano: un resumen «de un vistazo», la elección actual del visitante (YouTube: sí / no / sin elegir, siempre al día, con el botón que abre el diálogo de ajustes) y secciones cortas, con la tabla de lo que se guarda. Textos en `shared/cookies-policy.js`. |
| **Privacidad** | `/privacidad/` | Corta y en el mismo lenguaje llano: quién soy, lo que **no** se pide (ni registro, ni formularios, ni comentarios, ni boletín, ni publicidad, ni estadísticas), lo que pasa al entrar (el servicio de alojamiento ve la IP como cualquier servidor), los vídeos de YouTube (solo tras el «sí»), si sales en una foto o un tuit, si me escribes, con quién se comparte, tus derechos (con la AEPD) y los cambios. Texto en `shared/privacy.js`, con la fecha de actualización arriba. Enlazada desde el pie y desde la política de cookies. Lleva un hueco señalado, `⟦correo de contacto⟧`, que solo el dueño puede rellenar. |

**Las páginas legales** (cookies, privacidad, créditos) comparten pieza: la cabecera de las interiores (migas, título en puntos, entradilla y la fecha de actualización, con el tiempo de lectura en las dos políticas), una columna de lectura de 40 rem (`.legal`) y los mismos bloques (`h`, `p`, `ul`, `glance`, `now`, `table`) pintados por el mismo código (`legalBlock` en `blog/blog.js`). Sus textos viven en `shared/` y se leen en el idioma de la página.

**Una fila de lista** (artículos y proyectos) tiene siempre la misma forma: miniatura en trama, metadatos en mono, título y entradilla. Toda la fila es clicable con un enlace estirado; la categoría queda por encima como enlace propio.

**Las piezas de los artículos** (vienen de soynando.com):
- texto con enlaces punteados;
- titulares h2 en Doto (forman el índice) y h3 en Archivo;
- citas destacadas con las letras línea a línea en cursiva, junto a una columna de puntos verdes;
- vídeos de YouTube tras una portada gris tramada con un botón ▶ verde, que solo cargan YouTube (sin cookies) al pulsarlo;
- tuits como tarjeta con borde;
- tablas que se desplazan de lado;
- líneas de tiempo con el `<luz-timeline>` de LUZ (`assets/vendor/luz/timeline.min.js`, copiado por `tools/luz-sync.mjs`) vestido de Trama, en sus dos versiones: **horizontal** por defecto (una tarjeta cada vez, tallo punteado hasta su fecha en una cinta de fechas, flechas a los lados, teclado Inicio/Fin/flechas y gesto de deslizar) y **vertical** con `"layout": "vertical"` en el bloque de `blog.json` (todos los pasos a lo largo de un raíl de puntos; el que cruza la mitad de la pantalla se rellena, crece y pone su fecha en verde; los anteriores pasan a tinta). Hoy: la historia de la IA en horizontal y la carrera de los modelos en vertical. El bloque lleva `label` (nombre accesible) y cada paso `when`, `title`, `text` y, opcional, `by`; la fecha es un `<time datetime>` cuando el texto da una fecha. Sin JS o antes de cargar el script, es la lista ordenada;
- vídeos de Facebook y gists como tarjetas que enlazan fuera (↗).

## 11. La 404

- **Arriba, la lluvia con la foto de un escritorio recortada en ella** (`RainField` con la máscara `image`, §5), a todo el ancho (52 % del alto de la pantalla, 62 % en escritorio) y con puntos del sitio en vez de glifos. La foto (`maqueta/img/escritorio.jpg`) solo se lee por su luz: no se enseña como imagen.
- **Un clic o un toque escanea en círculo** (un anillo de puntos verdes que descodifica lo que cruza). Un aviso en la esquina, con un punto verde que parpadea («Haz clic para escanear», o «Toca para escanear» en pantallas táctiles), desaparece tras el primer gesto. La lluvia se mueve 5 s y se queda quieta (WCAG 2.2.2); el puntero la despierta otros 5 s.
- Titular: «Esta página se ha deshecho en puntos.», con el kicker «Error 404 · Página no encontrada» en verde. Debajo va la dirección que ha fallado, en monoespaciada.
- **Buscador** sobre artículos y proyectos, que ya viene relleno con lo que traía la dirección: un campo grande y ligero con una fila de puntos debajo que se vuelve verde al enfocarlo. `/blog/margaret` ofrece «¿Buscabas esto?» con el artículo de Margaret Hamilton.
- Debajo, «O empieza por aquí»: las cuatro secciones en una rejilla punteada de dos columnas (una por debajo de 30em), y «Lo último del blog» con tres filas. En escritorio, la copia y la rejilla ocupan las columnas 1–6 y el buscador y lo último del blog las 8–12.
- El servidor de la maqueta devuelve el **código 404** con esta página para cualquier ruta bajo `/maqueta/`.

## 12. Accesibilidad

- Enlace «Saltar al contenido», el primero al tabular.
- Todos los canvas llevan `aria-hidden`. Lo que dibujan existe también como texto real (títulos con `.vh`, número del proyecto en el texto; el lema, el nombre y el rol del cartel van como texto, con una copia `.vh` mientras se escriben).
- Foco visible y punteado (§4). En las filas de las listas, el foco se marca en la fila entera. **Excepciones de hoy** (a unificar con la regla): el bloque de código y su botón «Copiar» usan un contorno continuo de 2 px en verde, y el campo de búsqueda de la 404 no lleva contorno: su aviso de foco es la fila de puntos verdes de debajo.
- El panel de proyecto es un `<dialog>` modal con foco en el título, Esc para cerrar y el foco de vuelta al botón que lo abrió.
- Los enlaces que se abren en otra pestaña lo dicen con un texto solo para lectores de pantalla.
- Los artículos que solo existen en español llevan `lang="es"` aunque la interfaz esté en inglés, con un aviso visible.
- Movimiento reducido respetado en todo (§9).
- **Aviso de cookies**: el `<luz-cookie-consent>` de LUZ (`@luz-ds/catalog`, copiado en `assets/vendor/luz/` por `tools/luz-sync.mjs`), con su comportamiento intacto: tarjeta fija abajo (en la esquina derecha desde 48em), que no roba el foco ni se anima; Aceptar y Rechazar con el mismo peso; «Ajustes» abre un `<dialog>` modal con la casilla de YouTube; al elegir se cierra al instante y un anuncio cortés lo dice; en el pie, «Ajustes de cookies» (en «Sobre esta web») vuelve a abrirla, y el botón «Cambiar mi elección» de la política hace lo mismo y recibe de vuelta el foco. Sin JS no aparece. Solo pregunta por lo único que hay: los vídeos de YouTube. Cada vídeo, además, pregunta en su compuerta (que está en YouTube/Google, que su navegador se conectará con Google, que el «sí» vale 180 días para todos los vídeos, enlace a la política, «Aceptar y ver aquí» o «Ver en YouTube ↗»); sin permiso no se pide nada a YouTube, ni la miniatura; al quitar el «sí», el vídeo ya abierto vuelve a su compuerta. El aspecto es de Trama: carbón hundido, una fila de puntos como borde, Chakra sobre su fila de puntos. La píldora del menú se aparta (a la izquierda, o sobre la tarjeta si no cabe) y el botón de color sube sobre ella. Código en `maqueta/shared/consent.js`; textos en `maqueta/shared/cookies-policy.js` y `privacy.js`; estilos en `style.css` (apartado «cookies»).

## 13. Contenido

- **Proyectos**: solo repos reales de github.com/nandovejer; los textos salen de sus README (`data/projects.json`). No se inventan proyectos.
- **Blog**: los artículos reales de soynando.com, sacados de su API de WordPress con `maqueta/tools/soynando-to-blog.cjs` y guardados en `maqueta/shared/blog.json`. Las categorías y etiquetas son las de allí. Solo hay español.
- **Bio, kicker y redes**: `data/site.json`, compartido con el resto de versiones.

## 14. Lo descartado (no volver a proponer)

- **Esténcil** y **Malla**: maquetas rechazadas por completo.
- **Diagonal** y **Digital**: viven como otras versiones en la rama `proto/versiones-visuales`, no en Trama.
- **El granate** (y el azul del modo claro) como acento: sustituido por el verde de la lluvia. No hay «rosa»: los puntos a medio desplazar son un verde pálido.
- **El hero como nombre en partículas** (`HeroField` con «NANDO» cayendo desde el ruido) y la **404 con el «404» en puntos y puntos caídos**: sustituidos por el cartel sobre la lluvia y por la lluvia con la foto del escritorio.
- **El bucle de 13 s en la portada del artículo** (puntos → blanco y negro → color, mientras está en pantalla): sustituido por la pantalla de puntos que se funde bajo el puntero. Tampoco hay ciclo de color en la portada.
- **Banner o tarjeta de cookies** al entrar: la pregunta se hace en la compuerta de cada vídeo y la elección se cambia desde el pie.
- **Un pie de una sola fila** con todo mezclado (secciones, políticas, idioma y ajustes): sustituido por los cuatro grupos.
- **El modo «Auto»** como opción a elegir.

## 15. Pendiente antes de llevarlo a `main`

- Hoy la maqueta **sin JavaScript queda vacía** (y el pie, la compuerta del vídeo y los ajustes de cookies también lo necesitan). Eso lo resuelve el sitio de Astro (`.claude/plan-soynando-astro.md`, que empieza cuando la maqueta se congela): HTML estático, páginas por proyecto, artículo, categoría y etiqueta en rutas limpias (no `?a=`), SEO, RSS y un `404.html` en la raíz. Esta maqueta es la referencia visual y de comportamiento que hay que reproducir; el plan de ella es `.claude/plan-maqueta.md`.
- **Esto será soynando.com**, así que nada puede depender del WordPress de hoy. Hecho: las imágenes destacadas (`maqueta/img/blog/`) y las de dentro de los artículos (`maqueta/img/blog/posts/`, con `maqueta/tools/soynando-images.cjs`) están en el repo y salen en `<picture>`; se quitaron el «Artículos de soynando.com» del pie, el enlace «Original» de los artículos y el «Blog» de las redes (`data/site.json` lo conserva para las otras versiones). Pendiente: el campo `url` de cada artículo en `blog.json` es la dirección del WordPress y se guarda solo para generar las redirecciones `/<slug>/` → `/blog/<slug>/`; `baseUrl` y el canonical de `data/site.json` siguen siendo los de nandovejer.github.io y habrá que cambiarlos al hacer el cambio de dominio.
- **Licencias y créditos**: la maqueta enseña el crédito de cada portada bajo la imagen (`cover.credit` en `blog.json`, que `soynando-covers.cjs` respeta al volver a ejecutarse; el `alt` solo describe), la línea «Letra: autor, agrupación, año» en la primera cita de cada sección de los análisis, y tiene `/creditos/` (con la licencia) y `/privacidad/`. Decidido: código MIT, textos e imágenes propias con todos los derechos reservados; las portadas del Carnaval se publican con su fuente (decisión del dueño, riesgo en el informe legal C4). Pendiente en el plan: la portada con IA (L7), el correo de contacto (K4, `⟦correo de contacto⟧` en las dos páginas) y el aviso legal solo si hay actividad económica.
- Medir la lluvia (portada y 404) en móviles modestos y probarla en Safari: tiene un modo ligero para móvil y pantalla táctil, pero no se ha medido en un teléfono real.
- **El verde como acento definitivo**: el dueño debe confirmar que lo es en los tres modos (incluido el claro, que era azul). Si se confirma, se unifica el nombre (`--blaze*` → `--accent`, `--on-accent`, `--accent-on-ink`) y se borra `--blaze-lift`.
- **Del informe de diseño** (`.claude/informe-diseno-maqueta.md`), lo que el código sigue mostrando: el foco del código y de «Copiar» y del buscador de la 404 fuera de la regla del §4; la escala de rótulos en mono (11 tamaños casi iguales) y de `letter-spacing` sin tokens; ocho copias del botón «texto sobre fila de puntos»; el pie a 1024 px (cuatro columnas estrechas) y sus tres tonos de línea (`--glow`, `--faint`); el punto medio del modo claro (`--dot-mid`, ~2:1 sobre el papel); y el corte de `40em` del paginador.
- **Parpadeos que duran más de 5 s** (WCAG 2.2.2), a comprobar en el navegador: el cursor del cartel (`.caret.blink` no se quita al acabar de escribir) y el punto del aviso de la 404 (`blink` infinito hasta el primer gesto).
- **Pie**: falta «Accesibilidad» en «Sobre esta web» (declaración de accesibilidad, decisión L2 del plan) y la prueba de los cinco segundos con 3–5 personas del plan (§5 de `plan-maqueta.md`).
