# Trama · decisiones de diseño

Trama es la versión del portfolio que se llevará a `main`. Hoy vive en la rama `proto/home` como maqueta (`maqueta/`). Se sirve con `python3 maqueta/serve.py` → http://localhost:8766/maqueta/.

Este documento recoge **qué se decidió y por qué**, para que cualquier pieza nueva hable el mismo idioma. Si algo de aquí cambia, se cambia aquí también.

---

## 1. La idea

**Todo es una trama de puntos.** La referencia es una hoja de patrones de puntos tramados (`maqueta/refs/puntos-tramados.png`): puntos blancos sobre carbón, densidades que cuentan algo.

- Una sola tinta (blanco roto) sobre un solo papel (carbón). Un único acento: **granate**, que solo aparece donde el usuario toca o donde algo está activo.
- La trama **significa**, no decora. La densidad, la altura o el patrón de un bloque siempre codifican un dato: el año, la longitud del texto o la categoría. Si un adorno no cuenta nada, sobra.
- Los puntos **se arman al entrar en pantalla** y **reaccionan al puntero**. La página parece hecha de partículas que se ordenan.
- Mucho aire: márgenes generosos, secciones muy separadas y profundidad (capas que se mueven a distinta velocidad).
- **Móvil primero.** En escritorio la composición se complica: rejilla de 12 columnas, bloques que se cruzan y textos que flotan sobre los bloques.

## 2. Color

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#292929` | Fondo de todo (carbón) |
| `--bg-2` | `#232323` | Superficies hundidas: panel, código, píldora del menú |
| `--ink` | `#f4f2ee` | Texto principal y puntos |
| `--mute` | `#b9b6b0` | Texto secundario, entradillas |
| `--faint` | `#6f6c68` | Metadatos, líneas punteadas, números apagados |
| `--blaze` | `#963641` | Único acento: estado activo, foco del puntero, hover |
| `MID` (JS) | `#c98a8f` | Punto a medio desplazar, entre tinta y granate; puntos caídos de la 404 |

- **Tres modos de color**, con el `<luz-theme-mode>` de LUZ como un botón redondo fijo abajo a la derecha (§8): **oscuro** (el de Trama y el de entrada), **claro** y **contraste alto**. No hay «Auto» para elegir. Al pulsar, rota claro → contraste alto → oscuro. El modo es `data-mode` en `<html>`, escrito antes del primer pintado por una línea en el `<head>` de cada página (sin parpadeo): lo guardado, o contraste alto si el sistema lo pide, o oscuro. La elección se guarda en `localStorage` (`luz-theme`) solo al pulsar, y la política de cookies lo dice.

| Token | Oscuro | Claro | Contraste alto |
|---|---|---|---|
| `--bg` / `--bg-2` | `#292929` / `#232323` | `#f4f2ee` / `#e8e5df` | `#000` / `#0d0d0d` |
| `--ink` | `#f4f2ee` | `#232323` | `#fff` |
| `--mute` | `#b9b6b0` | `#55524d` | `#f0f0f0` |
| `--faint` | `#6f6c68` | `#67635e` | `#c9c9c9` |
| `--blaze` (texto, UI) | `#963641` (+ `brightness(1.7)` si es texto pequeño) | `#963641` | `#ff7a8a` |
| `--dot-ink` / `--dot-mid` / `--dot-blaze` (canvas) | `#f4f2ee` / `#c98a8f` / `#963641` | `#232323` / `#8c4a54` / `#b3263a` | `#fff` / `#ffc2ca` / `#ff6479` |

  Todo el CSS lee tokens (también los blancos translúcidos: `--edge`, `--edge-2`, `--rule`, `--glow`, y `--shade` para las sombras); en contraste alto las líneas se hacen visibles. Los contrastes de texto sobre fondo en claro y en contraste alto cumplen AA (claro: tinta 14:1, apagado 5:1; contraste alto: ≥ 12:1). El apagado del oscuro sigue en 2,8:1 (hallazgo del informe de accesibilidad).
- **En claro, los puntos son oscuros sobre papel**, así que una foto se lee al revés que en oscuro (los puntos dibujan lo oscuro, como una impresión), salvo una imagen clara ya leída en negativo (una página sobre blanco), que dibuja su contenido en los dos modos. Una imagen hundida bajo sus puntos se aclara en lugar de oscurecerse (`--sink`).
- Al cambiar de modo se redibuja todo con los colores nuevos (`readPalette` en `dots.js`, y cada página recrea sus bloques).
- El granate sobre carbón es oscuro. Cuando va como texto pequeño (números de sección, kickers) se aclara con `filter: brightness(1.7)`.
- En los puntos, el color indica **cuánto se ha movido** cada uno: tinta en reposo, `MID` si está un poco desplazado y granate si está muy desplazado. El granate es literalmente «donde tocas».
- Las imágenes de los artículos van en escala de grises y recuperan el color al pasar el ratón. Así no rompen la paleta.

## 3. Tipografía

Tres familias, todas servidas desde `/assets/fonts/`:

| Familia | Papel | Notas |
|---|---|---|
| **Archivo** (variable, eje `wdth` 62–125 %) | Texto y titulares | Texto corrido al 100 % de anchura (peso 380). Titulares de proyectos y nombres en **62 % + peso 800 + mayúsculas**. Entradillas grandes en peso 200–300 y anchura ~78 %. |
| **Doto** (400/700) | Fuente de puntos | Títulos de sección, números (01, 02…), años y titulares dentro de los artículos. Es la trama hecha tipografía. |
| **Chakra Petch** (500/600) | Etiquetas técnicas | Kickers, metadatos, botones y menús. Siempre en **mayúsculas con espaciado ancho** (`letter-spacing` .14–.22em) y tamaño pequeño (.62–.8rem). |

Reglas:
- Los títulos de sección **no son texto plano**: se dibujan en puntos con el motor (§5), que «decodifican» desde ruido cuando entran en pantalla. El texto real queda en un `<span class="vh">` para lectores de pantalla.
- Tamaños fluidos con `clamp()`, pensados desde el móvil.
- `text-wrap: balance` en todos los titulares.
- Una sola fuente con eje de anchura sirve para titular estrecho y texto normal, sin cargar dos archivos.

## 4. Trazos y formas

- **Las líneas son punteadas**, nunca sólidas: separadores `1px dotted`, subrayados de enlaces `underline dotted`, y bajo los botones una fila de puntos dibujada con `radial-gradient` (6 px de paso). En hover esos puntos se vuelven granates.
- **Las esquinas son rectas.** Solo es redonda la píldora del menú en móvil, porque es un objeto que flota bajo el pulgar.
- **Las viñetas son puntos** (6 px). Las citas llevan a la izquierda una columna de puntos granates en lugar de una barra.
- **El foco del teclado** es un contorno punteado: `3px dotted var(--ink)`, separado 5 px del elemento. Es la misma tinta y el mismo lenguaje que la trama.

## 5. El motor de puntos (`dots.js`)

Toda la imaginería sale de un único motor en canvas:

- **Tramado ordenado de Bayer 8×8, mezclado con ruido**: `bayer × 0.62 + ruido × 0.38 < densidad`. Así se lee como textura y no como cuadrícula.
- **Patrones** (`kind`), sacados de la hoja de referencia: 0 se desvanece hacia la derecha, 1 hacia abajo, 2 racimos, 3 columnas, 4 núcleo, 5 hacia la izquierda y 6 plano.
- **Fuente de 3×5 píxeles** para calar números en los bloques (01, 02…), con un margen vacío alrededor.
- **Tamaño de celda** según la anchura: 7 px (móvil), 8 (tableta) y 9 (escritorio). En el hero: 7,5, 9,5, 11 y 13.
- Dibuja a un máximo de 2× de densidad de píxeles, para no castigar a los móviles.

Las cuatro piezas del motor:

| Pieza | Qué hace |
|---|---|
| `DotBlock` | Un rectángulo tramado. Se arma con el scroll: cada punto aparece en un momento distinto y sube 14 px hasta su sitio. El puntero lo empuja (radio 70 px). |
| `HeroField` | Texto convertido en partículas que caen desde el ruido hasta su sitio, con manchas flotantes y polvo alrededor. Funciona con un muelle y amortiguación; el puntero empuja (70 px en móvil, 130 en escritorio) y un toque lanza una onda. La opción `lost` deja puntos caídos en el suelo (404). |
| `fieldPoints` / `fly` | Los puntos de un bloque vuelan a pantalla completa al abrir un proyecto, y vuelven al cerrarlo. |
| Títulos (`plain`) | El mismo `HeroField` en una línea, para los títulos de sección. |

## 6. La trama como dato

| Dónde | Qué codifica |
|---|---|
| **Bloques de proyecto** | La **densidad** es el año (2023 → .36, 2024 → .52, 2025 → .68, 2026 → .86). La **altura** es la longitud del texto. El **dibujo** es la captura del proyecto en semitono (ver abajo); si no carga, un patrón sacado del id. El **número** va calado en la trama. Detrás, una copia más tenue (siempre con patrón) da profundidad 3D. |
| **Imagen del proyecto** | Cada proyecto tiene su captura (`maqueta/img/proyectos/`, generada con `maqueta/tools/project-shots.cjs`). Nunca aparece como foto en la home: el motor lee su gris (`<id>.tone.webp`, 192 px) y la convierte en **semitono**. El gris decide el tamaño de cada punto y empuja un poco cuáles se encienden, pero la media sigue siendo la densidad del año, así que la leyenda sigue valiendo. Una imagen clara (media de gris > .55, como una página o una ilustración sobre blanco) se lee en negativo, para que los puntos dibujen el objeto y no el papel. Si un proyecto tiene una imagen propia mejor que la captura, va en `IMAGES` del script (hoy, Toolbar AEM). Al abrir el proyecto, el campo a pantalla completa la dibuja con más resolución (el número baja a un cuarto de la altura para dejarle sitio), y en la hoja aparece la captura real en un `<picture>`, en gris, que recupera el color al pasar el ratón. |
| **Leyenda** («Cómo leer los bloques») | Cuatro muestras, una por año. Aparece en la home y en /proyectos/. |
| **Artículos** | El **patrón** es la categoría (Código y gestión → columnas; Literatura y pensamiento → racimos). La **densidad** es la longitud del artículo. Si el post tiene imagen destacada (todos la tienen; `maqueta/img/blog/`, traída con `maqueta/tools/soynando-covers.cjs`), la trama la dibuja en semitono, igual que en los proyectos, con la foto real debajo, y **todas hacen el mismo bucle** (puntos → blanco y negro → color → blanco y negro → puntos; ver la página del artículo en §10): la portada, el destacado del blog y las miniaturas de todas las listas (blog, categorías, etiquetas, relacionados, la home y la 404). En una lista, cada fila va 1,3 s detrás de la anterior para que no respiren a la vez. **Las miniaturas de las filas no llegan al color**: solo puntos ↔ blanco y negro, con su propia tabla más corta (`LOOP_BW`, unos 7,6 s), y tampoco se colorean con el hover; el color queda para la portada y el destacado. En las listas la foto lleva `alt=""`, porque el título de al lado ya dice qué es. |
| **Categorías** | Cada una con su muestra de trama. |
| **404** | El «404» en puntos, con puntos caídos (más del último 4). |

## 7. Composición y espacio

- **Márgenes laterales**: `--gut: clamp(1.25rem, 5.5vw, 7rem)`. En escritorio, el contenido de las páginas interiores deja al menos 6rem a la izquierda para el raíl del menú.
- **Cortes de anchura**: `48em` (tableta), `64em` (escritorio) y `90em` (pantalla grande). Se diseña para el móvil y se añade complejidad hacia arriba.
- **Rejilla de 12 columnas** a partir de 48em, con 1,5rem de separación.
- **Proyectos en la home**: el bloque y el texto se alternan en un ciclo de cuatro posiciones, sin repetirse:
  - el primero: bloque a la izquierda;
  - el segundo: bloque a la derecha;
  - el tercero: bloque estrecho, con el texto en una tarjeta translúcida que flota sobre su esquina;
  - el cuarto: bloque a la derecha y texto arriba.
- **Secciones muy separadas**: de 6 a 18rem entre secciones y entre proyectos, según la anchura. El aire es parte del diseño.
- **Profundidad**: en escritorio, los bloques y las columnas de la bio se desplazan a distinta velocidad con el scroll (parallax con `animation-timeline: view()`).
- **Encabezado de sección**: número granate en Chakra (01–04), título en puntos y contador en mono («13 proyectos · 2023–2026»).

## 8. Navegación

- **Secciones numeradas**: 01 Bio · 02 Proyectos · 03 Blog · 04 Escríbeme. Los números se repiten en el menú, en los encabezados y en las páginas interiores.
- **Arriba**, sobre el hero, va el menú en línea. En el móvil salta a dos líneas si no cabe.
- **Al hacer scroll, el menú se ancla** con una View Transition, que lo lleva volando de un sitio a otro:
  - en el **móvil**, a una píldora flotante abajo, bajo el pulgar (con fondo desenfocado); por debajo de 30em quita los números para que quepan las cuatro secciones;
  - en el **escritorio**, a un raíl vertical en el borde izquierdo, con el texto girado.
- **La sección visible se marca** con `aria-current` y el número en granate.
- **Raíl de progreso** (escritorio): una columna de puntos a la derecha que se rellena con el scroll.
- **Progreso de lectura** en los artículos: una fila de puntos granates arriba que se rellena.
- **Las páginas interiores** (blog, proyectos, 404) llevan el menú anclado desde el principio.
- **Modo de color**: botón redondo fijo abajo a la derecha (`shared/theme.js`; estilos al final de `style.css`). Se levanta por encima del aviso de cookies (`--luz-consent-h`) y, en el móvil, de la píldora del menú. Redondo, como ella, porque flota bajo el pulgar. **El cambio es un círculo que crece desde el botón** con el modo nuevo, sobre la página como estaba (idea de coac.com.es): una View Transition sobre la raíz cuya instantánea nueva se recorta con `clip-path: circle()` en .65 s; el clic se captura antes del de LUZ para que el modo cambie una vez, dentro de la transición, y el radio llega justo a la esquina más lejana. La píldora del menú pierde su `view-transition-name` mientras dura (si no, se fundiría aparte), y las transiciones CSS se anulan para que nada se congele a medias. Sin View Transitions o con movimiento reducido, el cambio es directo.
- **Idioma**: `?lang=en`. Todos los enlaces internos lo conservan. El selector de idioma va arriba a la derecha.

## 9. Movimiento

- **Curva**: `--ease: cubic-bezier(.2, .8, .2, 1)`, rápida al salir y suave al llegar.
- **Entradas**: el texto sube 1,4–3rem con un desenfoque que se aclara (`rise-in`, `rise`). Si el navegador lo soporta va atado al scroll (`animation-timeline: view()`); si no, un IntersectionObserver añade `.in`.
- **El hero**: las partículas del nombre caen durante unos 1,3 s, en ola de izquierda a derecha. Después aparecen el nombre, el kicker y la frase, escalonados.
- **Abrir un proyecto**: los puntos del bloque vuelan a pantalla completa (1 s) y forman un campo con su número. La hoja de texto entra desde abajo en el móvil o desde la derecha en el escritorio. ← y → pasan de proyecto haciendo volar el campo; Esc o el fondo lo cierran, y los puntos vuelven a su bloque.
- **Al pasar el ratón por un bloque**, se inclina en 3D hacia el cursor y su copia trasera se separa.
- **Con `prefers-reduced-motion: reduce` todo queda quieto**: sin transiciones ni animaciones, y los puntos aparecen ya en su sitio.

## 10. Páginas

| Página | URL (maqueta) | Claves |
|---|---|---|
| **Home** | `/maqueta/` | Hero «NANDO» en partículas. 01 Bio con tres columnas de trama. 02 Proyectos: solo **cinco destacados** (LUZ, ¿Quién canta hoy?, Street Cai, IKAY, Toolbar AEM) y el enlace «Todos los proyectos». 03 Blog: los tres últimos artículos y «Todos los artículos». 04 Escríbeme: campo de puntos y redes con una línea de puntos que se mueve en hover. |
| **Proyectos** | `/proyectos/` | Los 13, agrupados por año, con filtros por tecnología (`?tech=`) y la leyenda. |
| **Proyecto** | `/proyectos/proyecto/?p=id` | Nº, año, tecnologías (enlazan al filtro), demo y código, el bloque grande, el texto, anterior y siguiente, y «Más proyectos» que comparten tecnología. |
| **Blog** | `/blog/` | El último artículo destacado en grande. El resto agrupado por año, con el año en Doto fijo a la izquierda en escritorio. Paginación de 5 en 5. Filtros por categoría. |
| **Artículo** | `/blog/articulo/?a=id` | Migas, título en Archivo 62 % mayúsculas, entradilla, metadatos (fecha, lectura, nº; sin enlace al original: el sitio será soynando.com), portada: la imagen destacada como `<picture>` real (con `alt` y tamaño, porque importa para el SEO: será la `og:image` y el `image` del JSON-LD), con su semitono en trama encima. **En bucle mientras está en pantalla** (unos 13 s por ciclo, un único reloj por imagen: `coverLoop` y la tabla `LOOP` en `blog/parts.js`): puntos → se deshacen mientras la foto sube en blanco y negro → color → blanco y negro → la foto se hunde y los puntos se juntan, y otra vez. Cada paso entra en el siguiente sin corte, también al repetirse. Se para fuera de pantalla. Con movimiento reducido no hay bucle: queda en blanco y negro y el hover le da el color. Índice fijo a la izquierda (desplegable en móvil), «Compartir artículo» (un solo botón: la hoja nativa del sistema con `navigator.share` donde la hay; si no, o si falla por algo que no sea cancelar, un `<dialog>` con la tarjeta hundida del de cookies: el enlace con «Copiar enlace» y WhatsApp, X, Telegram, LinkedIn, Facebook, Bluesky y correo como enlaces normales, que no cargan nada de fuera hasta que se pulsan), etiquetas, autor, anterior y siguiente, relacionados y progreso de lectura. |
| **Categorías / categoría** | `/blog/categoria/[?c=]` | Tarjetas con la muestra de trama de cada una, o la lista de una. |
| **Etiquetas / etiqueta** | `/blog/etiqueta/[?t=]` | Nube: más grande cuanto más se usa. |
| **404** | cualquier ruta inexistente | Ver §11. |
| **Créditos** | `/creditos/` | Tipografías (OFL), código de LUZ (MIT), una línea por artículo con el crédito de su imagen destacada (sale de `blog.json`) y de dónde salen las imágenes de los proyectos. Enlazada desde el pie. No dice licencia del texto ni del código propios: sigue sin decidirse (plan, L4–L6). Textos en `maqueta/shared/credits.js`. |

**Una fila de lista** (artículos y proyectos) tiene siempre la misma forma: miniatura en trama, metadatos en mono, título y entradilla. Toda la fila es clicable con un enlace estirado; la categoría queda por encima como enlace propio.

**Las piezas de los artículos** (vienen de soynando.com):
- texto con enlaces punteados;
- titulares h2 en Doto (forman el índice) y h3 en Archivo;
- citas destacadas con las letras línea a línea en cursiva, junto a una columna granate;
- vídeos de YouTube tras una portada gris tramada con un botón ▶ granate, que solo cargan YouTube (sin cookies) al pulsarlo;
- tuits como tarjeta con borde;
- tablas que se desplazan de lado;
- líneas de tiempo con el `<luz-timeline>` de LUZ (`assets/vendor/luz/timeline.min.js`, copiado por `tools/luz-sync.mjs`) vestido de Trama, en sus dos versiones: **horizontal** por defecto (una tarjeta cada vez, tallo punteado hasta su fecha en una cinta de fechas, flechas a los lados, teclado Inicio/Fin/flechas y gesto de deslizar) y **vertical** con `"layout": "vertical"` en el bloque de `blog.json` (todos los pasos a lo largo de un raíl de puntos; el que cruza la mitad de la pantalla se rellena, crece y pone su fecha en granate; los anteriores pasan a tinta). Hoy: la historia de la IA en horizontal y la carrera de los modelos en vertical. El bloque lleva `label` (nombre accesible) y cada paso `when`, `title`, `text` y, opcional, `by`; la fecha es un `<time datetime>` cuando el texto da una fecha. Sin JS o antes de cargar el script, es la lista ordenada;
- vídeos de Facebook y gists como tarjetas que enlazan fuera (↗).

## 11. La 404

- El número **404 en partículas**, a lo ancho, con un 16 % de los puntos de las cifras **caídos al suelo** (más en el último 4). Están en rosa (`MID`) y rebotan con gravedad.
- Al tocar o hacer clic, los puntos caídos **vuelven a su sitio unos 2,6 s** y salta una onda granate. Después caen otra vez. Un aviso con un punto que parpadea («Toca la trama para recomponerla») desaparece tras el primer toque.
- Titular: «Esta página se ha deshecho en puntos.». Debajo va la dirección que ha fallado, en mono.
- **Buscador** sobre artículos y proyectos, que ya viene relleno con lo que traía la dirección. `/blog/margaret` ofrece «¿Buscabas esto?» con el artículo de Margaret Hamilton.
- Debajo, las cuatro secciones en una rejilla punteada y lo último del blog.
- El servidor de la maqueta devuelve el **código 404** con esta página para cualquier ruta bajo `/maqueta/`.

## 12. Accesibilidad

- Enlace «Saltar al contenido», el primero al tabular.
- Todos los canvas llevan `aria-hidden`. Lo que dibujan existe también como texto real (títulos con `.vh`, número del proyecto en el texto).
- Foco visible y punteado (§4). En las filas de las listas, el foco se marca en la fila entera.
- El panel de proyecto es un `<dialog>` modal con foco en el título, Esc para cerrar y el foco de vuelta al botón que lo abrió.
- Los enlaces que se abren en otra pestaña lo dicen con un texto solo para lectores de pantalla.
- Los artículos que solo existen en español llevan `lang="es"` aunque la interfaz esté en inglés, con un aviso visible.
- Movimiento reducido respetado en todo (§9).
- **Aviso de cookies**: el `<luz-cookie-consent>` de LUZ (`@luz-ds/catalog`, copiado en `assets/vendor/luz/` por `tools/luz-sync.mjs`) con el comportamiento de LUZ intacto: banda fija abajo, que no roba el foco ni se anima; Aceptar y Rechazar con el mismo peso; «Elegir» en un `<details>`; la confirmación sí toma el foco; y un botón «Cookies» en el pie para volver a abrirlo. Sin JS no aparece. Solo pregunta por lo único que hay: los vídeos de YouTube. Sin permiso, un artículo no pide nada a YouTube, ni siquiera la miniatura: al darle a ▶ pregunta allí mismo si verlo aquí (cuenta como permiso) o abrirlo en youtube.com. El aspecto es de Trama: carbón hundido, una fila de puntos como borde, el título en Doto y los botones en Chakra sobre su fila de puntos. En el móvil, la píldora del menú se apoya sobre la banda. Código en `maqueta/shared/consent.js` y estilos al final de `style.css`.

## 13. Contenido

- **Proyectos**: solo repos reales de github.com/nandovejer; los textos salen de sus README (`data/projects.json`). No se inventan proyectos.
- **Blog**: los artículos reales de soynando.com, sacados de su API de WordPress con `maqueta/tools/soynando-to-blog.cjs` y guardados en `maqueta/shared/blog.json`. Las categorías y etiquetas son las de allí. Solo hay español.
- **Bio, kicker y redes**: `data/site.json`, compartido con el resto de versiones.

## 14. Lo descartado (no volver a proponer)

- **Esténcil** y **Malla**: maquetas rechazadas por completo.
- **Diagonal** y **Digital**: viven como otras versiones en la rama `proto/versiones-visuales`, no en Trama.

## 15. Pendiente antes de llevarlo a `main`

- Hoy la maqueta **sin JavaScript queda vacía**. Hay que generar el HTML estático con `build.mjs`, con páginas por proyecto, artículo, categoría y etiqueta en rutas limpias (no `?a=`), y añadir SEO, RSS y un `404.html` en la raíz.
- **Esto será soynando.com**, así que nada puede depender del WordPress de hoy. Hecho: las imágenes destacadas (`maqueta/img/blog/`) y las de dentro de los artículos (`maqueta/img/blog/posts/`, con `maqueta/tools/soynando-images.cjs`) están en el repo y salen en `<picture>`; se quitaron el «Artículos de soynando.com» del pie, el enlace «Original» de los artículos y el «Blog» de las redes (`data/site.json` lo conserva para las otras versiones). Pendiente: el campo `url` de cada artículo en `blog.json` es la dirección del WordPress y se guarda solo para generar las redirecciones `/<slug>/` → `/blog/<slug>/`; `baseUrl` y el canonical de `data/site.json` siguen siendo los de nandovejer.github.io y habrá que cambiarlos al hacer el cambio de dominio.
- **Licencias y créditos**: la maqueta ya enseña el crédito de cada portada bajo la imagen (`cover.credit` en `blog.json`, que `soynando-covers.cjs` respeta al volver a ejecutarse; el `alt` solo describe) y tiene `/creditos/`. Lo demás está en el plan, L5–L9: permiso de las fotos del Carnaval, licencia del texto y del código, la portada con IA, las licencias de fuentes y voces, y el aviso legal.
- Medir el hero en móviles modestos (redibuja 3–6 mil puntos por fotograma) y probarlo en Safari.
