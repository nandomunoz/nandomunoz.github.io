# Auditoría SEO de la maqueta Trama (contenido, estructura y capa técnica para Astro)

> Alcance: `maqueta/` (rama `proto/home`) como futura **soynando.com**, más lo que hoy publica el WordPress (`.ai/soynando/soynando.json`, sitemap y cabeceras en vivo). Es la auditoría **A3** de [plan-maqueta.md](plan-maqueta.md). **No repite** [informe-seo-cookies.md](informe-seo-cookies.md) (política de cookies: slug, metadatos, N1–N5) ni la parte legal de M10 (solo la enlaza). Hecha por el agente `seo-specialist` el 2026-11-16. No edita nada: informa.
>
> **Cómo se ha medido.** Código de `maqueta/` leído entero (`blog/blog.js`, `blog/parts.js`, `main.js`, `shared/*.js`, los 9 shells HTML); datos de `blog.json` (11 artículos), `data/projects.json` (13) y `data/site.json`; `curl` al servidor local y a soynando.com (sitemaps, cabeceras, redirecciones, 12 URLs). **Límite:** `WebSearch` con `site:soynando.com` no devolvió nada de ese dominio (el operador no sirve aquí), así que **no he podido ver qué URLs tiene Google indexadas**; uso el sitemap en vivo de Yoast (29 URLs) como aproximación. Cada punto dice si es **documentado** (Google), **práctica establecida** o **criterio** mío.

## 1. Diagnóstico

**Lo que recibe hoy un rastreador de la maqueta.** Nada útil, y a propósito: los 9 shells llevan `<meta name="robots" content="noindex">` (`maqueta/index.html:6`, `404.html:6`…), un `<title>` fijo (`Artículo · Blog · Nando Muñoz` para todos los artículos), ni description, ni canonical, ni hreflang, ni OG, ni JSON-LD, y un `<body>` con solo `Esta web necesita JavaScript.` (0 `<h1>` en el HTML recibido, comprobado con `curl`). Todo se pinta con JS desde `?a=`, `?p=`, `?c=`, `?t=`, `?tech=`, `?lang=en`, y el título se pone en el cliente (`blog.js:322–732`, `main.js:79`). **Esto lo arregla Astro por completo** (HTML estático, rutas limpias, `<head>` por plantilla): no se «arregla» en la maqueta. Lo que sí importa aquí es **lo que se arrastra**: los textos, los datos, la estructura de encabezados y enlaces, y las decisiones de URL.

**Lo que está bien y se arrastra** (ver §5 «Dejar»): un `<h1>` por página con orden de encabezados limpio, `<picture>` con AVIF/WebP y `width`/`height`, `<time datetime>`, conmutador de idioma con `hreflang`, enlaces de fila con el título como ancla, 404 útil.

**Lo que hay que decidir o corregir antes de portar** (§2): un artículo duplicado, etiquetas que no corresponden al contenido, categorías con otro slug que en WordPress, fichas de proyecto sin enlace rastreable desde la home, títulos y descripciones sin escribir, y un **riesgo de bucle de redirecciones** en el cambio de dominio (C6).

**WordPress hoy** (para saber qué se pierde): 29 URLs en el sitemap (`/blog/`, 11 artículos, 3 páginas, 2 categorías, 9 etiquetas, 2 autores); `<title>` «… - Nando Muñoz», canonical propio, `index, follow, max-image-preview:large`; OG con imagen destacada en los artículos; JSON-LD de Yoast; RSS en `/feed/`; `/proyectos/` ya hace **301 a `nandovejer.github.io/#proyectos/`**; `/me/` hace 303 a github.io; `/en/` da 404; `/blog/page/2/` existe (2 páginas de 6).

## 2. CAMBIAR (arreglar o decidir antes de congelar)

| # | Hallazgo | Evidencia | Qué hacer | ¿Maqueta o Astro? |
|---|---|---|---|---|
| **C1** | **Dos artículos con el mismo título y casi el mismo texto.** Ambos están indexables hoy en WordPress con canonical propio y compiten entre sí (canibalización). | `blog.json`: `introduccion-a-la-ia` (2026-10-02) e `introduccion-a-la-ia-2` (2026-10-15), título idéntico; en vivo ambos dan 200; similitud 84 % en los primeros 6.000 caracteres. El informe de ortografía (C15) ya señala la nota de borrador del antiguo y el de veracidad (C9) el duplicado. | **Dejar una sola versión.** Mi recomendación (criterio): la versión nueva en la URL limpia `/blog/introduccion-a-la-ia/` (conserva la URL más antigua, sin el «-2»), con `datePublished` 2026-10-02 y `dateModified` 2026-10-15, y **301 de `-2` a ella**. Si el dueño prefiere lo contrario, el redireccionado es el otro. Nunca dos páginas vivas con el mismo `<h1>`. | **Maqueta** (quitar uno de `blog.json`; los contadores de etiquetas cambian) + **Astro** (redirección) |
| **C2** | **Las etiquetas no corresponden a los artículos** (heredadas de WordPress). Las páginas de etiqueta mezclan temas y las «Sigue leyendo» (que puntúan por etiqueta) recomiendan sin criterio. | `blog.json`: `carnaval-de-cadiz` (6) y `web-components` (6) incluyen el artículo de diseño de sistemas, el de pseudoclases… y los cuatro popurrís llevan `web-components`; `Aprendiendo Web Components` lleva `carnaval-de-cadiz`, `poesia-contemporanea` y `privacidad`; `gestion-de-equipos` (5) incluye tres popurrís. El tag `historia-de-la-informatica` existe en WP con 0 artículos y es el natural de Hamilton. | Reetiquetar en `blog.json` (propuesta, la confirma el dueño): Hamilton → `historia-de-la-informatica`, `iahoraque`; IA (el que quede) → `inteligencia-artificial`, `iahoraque`, `privacidad`; Web Components → `web-components`, `javascript`, `css`; los 4 popurrís → `carnaval-de-cadiz`, `poesia-contemporanea`; sistema de diseño → `gestion-de-equipos` (+ nueva `sistemas-de-diseno`); pseudoclases → `css`, `javascript`; huella digital → `privacidad`, `javascript`. Resultado: `carnaval-de-cadiz` 4, `poesia-contemporanea` 4 y el resto 1–3 (ver M4). | **Maqueta** (datos) |
| **C3** | **Las categorías cambiaron de slug y de nombre respecto a WordPress**, y el plan (U3) dice «mismos slugs». | WP: `/category/hablo-de-codigo-y-gestion/`, `/category/hablo-de-literatura-y-pensamiento/` (en el sitemap, indexadas); maqueta: ids `codigo-y-gestion`, `literatura-y-pensamiento` (`blog.json`). Títulos de WP: «Hablo de código y gestión archivos - …». | Decidir: (a) adoptar los nombres nuevos (más cortos y mejores como `<h1>`) y **redirigir** las 2 URLs de categoría; o (b) volver al slug largo. Recomiendo (a) con redirección 1 a 1. Actualizar U3 del plan. | **Maqueta** (decidir) + **Astro** (mapa de redirecciones) |
| **C4** | **Las fichas de proyecto no tienen enlace rastreable desde la home.** Cada tarjeta es un `<button>` que abre el diálogo; el enlace a la ficha (`Ficha completa →`) se rellena por JS dentro del `<dialog>` al abrirlo. Además la home solo muestra 5 de los 13. | `main.js:305–310` (`#p-links` se llena en `fill()`), `main.js:35` (`FEATURED`). Sin JS, la home no enlaza a ninguna ficha; solo `/proyectos/` lo hace. | En Astro, cada tarjeta lleva `<a href="/proyectos/<id>/">` real (el nombre del proyecto como ancla) y el JS, al hacer clic, abre el panel y evita la navegación (mejora progresiva). Así 5 fichas reciben enlaces desde la home y las otras 8 desde `/proyectos/`. | **Astro** (Fase 6/7) |
| **C5** | **Títulos y descripciones sin redactar.** Hoy el `<title>` de un artículo es `título · Nando Muñoz` (hasta 104 caracteres: Hamilton 104, pseudoclases 101); la home es solo `Nando Muñoz`; una ficha es `LUZ · Proyectos · Nando Muñoz`; ninguna página tiene description. La descripción de un artículo saldría del extracto, que en 7 de 11 pasa de 160 caracteres (Google trunca hacia 155–160). | `blog.js:322,334,352,363,374,505,626,648,701,723,732`; `main.js:79`; longitudes de `blog.json` (extractos de 111 a 241). | Añadir a los datos un par `seo: { title, description }` por artículo (es) y `description` por proyecto (es/en, 26 textos); la plantilla de Astro los usa y, si faltan, cae a título y extracto. Textos propuestos en §3. | **Maqueta** (datos) + **Astro** (plantilla) |
| **C6** | **Riesgo de bucle de redirecciones en el cambio de dominio.** WordPress redirige `soynando.com/proyectos/` (301) a `nandovejer.github.io/#proyectos/`, y el plan (U5, D5) redirigirá github.io a soynando.com (`/proyectos/<id>/`). Mientras convivan las dos, `soynando.com/proyectos/` → github.io → `soynando.com/proyectos/`. | `soynando.json` → `site.redirects`; `curl -sI https://soynando.com/proyectos/` → 301 a `https://nandovejer.github.io/#proyectos/`; plan §5 y U5. `/me/` (303 a github.io) tiene el mismo problema con `/`. | **Orden en la Fase 11:** (1) desplegar el sitio nuevo en soynando.com (desaparece el 301 de WordPress); (2) comprobar que `/proyectos/` y `/` responden; (3) solo entonces activar las redirecciones de github.io. Apuntarlo en la checklist. | **Astro** (Fase 11) |
| **C7** | **GitHub Pages no puede hacer 301**, y aquí hay 11 artículos, 2 categorías, 9 etiquetas, `/feed/` y la paginación que cambian de URL. Un `meta refresh` instantáneo lo trata Google como redirección permanente (documentado, de memoria: verificar), pero es más lento, **no lo siguen lectores de feeds, `curl` ni muchos rastreadores** y no sirve para XML. | Plan §5 («`meta refresh` + `canonical`») y D2. `/feed/` de WordPress tiene suscriptores que no ejecutan HTML. | **Criterio:** Cloudflare Pages (`_redirects`, gratis; 301 reales, `_headers` para la CSP). Si se queda GitHub Pages, **no mover los artículos**: servir `/<slug>/` en la raíz como hoy (cero redirecciones para los 11) y asumir la redirección solo de `/feed/`, categorías y etiquetas. Es la respuesta a U1: con 301 real → `/blog/<slug>/`; sin él → `/<slug>/`. | **Astro** (D2, decisión del dueño) |
| **C8** | **El sitemap actual se llama `sitemap_index.xml`** (Yoast) y probablemente está enviado en Search Console; un XML no se puede redirigir en GitHub Pages. | `https://soynando.com/sitemap_index.xml` → 200; `robots.txt` lo declara. | Servir el nuevo índice **en la misma ruta** (`/sitemap_index.xml`, endpoint de Astro) y en `robots.txt`; si se usa la integración oficial, que su salida se copie o se sirva con ese nombre. | **Astro** (Fase 9) |
| **C9** | **Faltan datos que la capa técnica necesita.** (1) `dateModified`: `blog.json` solo tiene `date`; el de WordPress no vale tal cual (Hamilton: modificado 14-oct, publicado 19-oct; IA-2: modificado 12-oct, publicado 15-oct), así que usar `max(date, modified)`. (2) `alt` vacío en la imagen destacada de 3 artículos (IA ×2, sumisos) y en 6 imágenes del cuerpo (diseño de sistemas ×5, huella ×1): sin `alt` no hay `og:image:alt` ni valor en Imágenes de Google. (3) El `<title>` de los vídeos sí está. | `blog.json` (`cover.alt === ''`, `img.alt === ''`); `soynando.json` → `posts[].modified`. Complementa el hallazgo 13 de accesibilidad. | Añadir `modified` a cada artículo y escribir los 9 `alt` que faltan (los de la portada pueden describir la ilustración: «El Turco», autómata de ajedrez de 1789). | **Maqueta** (datos) |

## 3. Textos propuestos: `<title>` y descripción por tipo de página

Reglas: título ≤ 60 caracteres cuando se puede (Google lo trunca por píxeles, ~580 px: **criterio**), sufijo « · Nando Muñoz» solo si cabe; descripción 120–155 caracteres, sin `…`, con la idea y el motivo para hacer clic. Las longitudes son las medidas del texto final. Los artículos son solo en español: en `/en/` el título y la descripción siguen en español (con `lang="es"`).

### 3.1 Páginas fijas

| Página | Idioma | `<title>` | Descripción | Largo (t / d) |
|---|---|---|---|---|
| Home | es | Nando Muñoz · Tech lead de frontend, código y palabra | Soy Nando Muñoz, tech lead de frontend en Cádiz y Madrid. Proyectos web con estándares y accesibilidad, y artículos de código, IA y Carnaval de Cádiz. | 53 / 150 |
| Home | en | Nando Muñoz · Frontend tech lead, code and words | I'm Nando Muñoz, frontend tech lead in Cádiz and Madrid. Web projects built on standards and accessibility; articles on code, AI and the Cádiz Carnival. | 48 / 152 |
| Proyectos | es | Proyectos de Nando Muñoz: diseño, herramientas e IA | Una selección de lo que he publicado en GitHub: sistemas de diseño, herramientas, experimentos con IA y el Carnaval de Cádiz. | 51 / 125 |
| Projects | en | Web projects by Nando Muñoz: design systems, tools and AI | A selection of what I've published on GitHub: design systems, tools, AI experiments and the Cádiz Carnival. | 57 / 107 |
| Blog (índice) | es | Blog de Nando Muñoz: código, IA y Carnaval de Cádiz | Artículos sobre frontend, sistemas de diseño, inteligencia artificial y gestión de equipos, y análisis largos de popurrís del Carnaval de Cádiz. | 51 / 144 |
| Blog (índice) | en | Blog by Nando Muñoz: code, AI and the Cádiz Carnival | Articles on frontend, design systems, AI and team management, plus long readings of Cádiz Carnival popurrís. The articles are in Spanish. | 52 / 137 |
| Blog, página N | es / en | `Blog · Página N de M · Nando Muñoz` / `Blog · Page N of M · Nando Muñoz` | La misma que el índice, o una frase propia por página (criterio: la misma basta; Google puede ignorarla) | — |
| Categoría | es | Código y gestión: artículos de frontend e IA · Nando Muñoz | Frontend, inteligencia artificial, historia de la informática y cómo se lidera un equipo. 7 artículos. | 58 / 102 |
| Categoría | es | Literatura y pensamiento: popurrís del Carnaval · Nando Muñoz | Análisis literarios y filosóficos de los popurrís del Carnaval de Cádiz. 4 artículos. | 61 / 85 |
| Category | en | Code and management: frontend and AI posts · Nando Muñoz | Frontend, artificial intelligence, computing history and how a team is led. 7 posts, in Spanish. | 56 / 96 |
| Category | en | Literature and thought: Carnival popurrís · Nando Muñoz | Literary and philosophical readings of the Cádiz Carnival popurrís. 4 posts, in Spanish. | 55 / 88 |
| Etiqueta | es | `{Etiqueta}: artículos etiquetados · Nando Muñoz` | `{n} artículos sobre {etiqueta}: {título 1} y {título 2}.` (generada) | — |
| Tag | en | `{Tag}: tagged posts · Nando Muñoz` | `{n} posts on {tag}, in Spanish: {title 1} and {title 2}.` | — |
| Índice de etiquetas | es | Etiquetas del blog · Nando Muñoz | Los temas de los artículos: Carnaval de Cádiz, Web Components, gestión de equipos, poesía contemporánea, IA, privacidad, JavaScript y CSS. | 32 / 138 |
| Privacidad | es | Política de privacidad · Nando Muñoz | Qué datos tuyos pasan por esta web, quién los ve y cómo pedir que se borren. | 36 / 76 |
| Privacy | en | Privacy policy · Nando Muñoz | What data of yours passes through this site, who sees it and how to ask for it to be deleted. | 28 / 93 |
| Cookies | es | Política de cookies · Nando Muñoz | Esta web no usa cookies propias ni analítica. Solo carga vídeos de YouTube si tú lo aceptas. Qué se guarda y cómo cambiarlo. | 33 / 124 |
| Cookies | en | Cookie policy · Nando Muñoz | This site sets no cookies of its own and has no analytics. It loads YouTube videos only if you accept. What is stored and how to change it. | 27 / 139 |
| Créditos | es | Créditos y licencia · Nando Muñoz | De quién son las tipografías, las imágenes y el código que hay detrás de esta web, y qué puedes hacer con lo que es mío. | 33 / 120 |
| Credits | en | Credits and licence · Nando Muñoz | Whose typefaces, images and code are behind this site, and what you may do with what is mine. | 33 / 93 |
| 404 | es / en | Página no encontrada · Nando Muñoz / Page not found · Nando Muñoz | Esta página no existe o ha cambiado de sitio. Busca en el blog y en los proyectos. / This page doesn't exist or has moved. Search the blog and the projects. | 34 / 82, 28 / 71 |

Notas: (1) «Privacidad» en el `<h1>` y «Política de privacidad» en el `<title>` mantiene el título que la página ya tiene indexado en WordPress; el `<h1>` puede quedarse corto. (2) La descripción de las páginas legales y la de la política de cookies completa lo ya propuesto en `informe-seo-cookies.md` M3 (aquí solo se ajusta el tono). (3) Los textos de la home deben pasar por el editor de tono: usan la bio y el kicker tal cual, sin inventar nada (Cádiz, Madrid, AEM/SFCC, accesibilidad, Carnaval salen de `site.json` y `projects.json`).

### 3.2 Artículos (11 → 10 si se resuelve C1). Solo español.

| Artículo (slug) | `<title>` | Descripción | t / d |
|---|---|---|---|
| `margaret-hamilton` | Margaret Hamilton y el software del Apolo 11 · Nando Muñoz | Margaret Hamilton dirigió el software del Apolo y programó esperando el error. La historia de la alarma 1202 y de la programación defensiva. | 58 / 140 |
| `introduccion-a-la-ia` (C1) | Introducción a la IA: ¿hay alguien dentro? · Nando Muñoz | En 1770 una máquina ganaba al ajedrez con un hombre dentro. De dónde viene la IA, por qué se equivoca y qué hace con lo que le cuentas. | 56 / 135 |
| `aprendiendo-web-components` | Aprendiendo Web Components sin frameworks · Nando Muñoz | Qué son los Web Components y cómo crear uno con JavaScript vanilla: módulos, estructura básica, Shadow DOM y LitElement. | 55 / 120 |
| `analisis-del-popurri-de-la-oveja-negra` | Análisis del popurrí de «La oveja negra» · Nando Muñoz | Análisis literario y filosófico del popurrí de «La oveja negra», la comparsa de Martínez Ares, en seis partes y verso a verso. | 54 / 125 |
| `analisis-del-popurri-de-la-ciudad-invisible` | Análisis del popurrí de «La ciudad invisible» · Nando Muñoz | Análisis del popurrí de Antonio Martínez Ares con «La ciudad invisible» (2023): interpretación, letra y detalles, cuarteta a cuarteta. | 59 / 134 |
| `tu-empresa-necesita-un-sistema-de-diseno-y-no-lo-sabes` | Tu empresa necesita un sistema de diseño y no lo sabes | Guía rápida para crear un sistema de diseño (Design System) desde cero: concepto, diseño UX y desarrollo web. | 54 / 109 |
| `carnaval-analisis-del-popurri-de-los-sumisos` | Análisis del popurrí de «Los Sumisos» (2022) · Nando Muñoz | Análisis del popurrí de Los Sumisos, de Antonio Martínez Ares, cuarteta a cuarteta: Mayo, las máscaras, el carnaval de ahora y el de antes. | 58 / 139 |
| `carnaval-de-cadiz-analisis-del-popuri-de-los-renacidos` | Análisis del popurrí de «Los Renacidos» (2022) · Nando Muñoz | Análisis del popurrí de Los Renacidos, cuarteta a cuarteta: la vida como ciclo, Cádiz como fuego y como fénix, crítica social. | 60 / 126 |
| `como-detectar-el-soporte-de-las-pseudo-classes-css-…` | Detectar el soporte de una pseudoclase CSS con JavaScript | Cómo saber con JavaScript vanilla si el navegador soporta una pseudoclase CSS, como :autofill frente a :-webkit-autofill, con un módulo reutilizable. | 57 / 149 |
| `tu-navegador-sabe-sobre-ti-mas-de-lo-que-crees` | Huella digital: los datos que regalas cada día · Nando Muñoz | Qué es la huella digital, qué datos entrega tu navegador sin pedir permiso y qué puedes hacer para proteger tu privacidad. Con el proyecto IKAY. | 60 / 144 |

Los años y nombres salen de los títulos de los vídeos incrustados y de los extractos; el verificador de hechos debe confirmar «Apolo 11» y «La oveja negra, comparsa de Martínez Ares» antes de publicar. El `<h1>` y el título visible no cambian (el título SEO es otro campo).

### 3.3 Fichas de proyecto (13, es y en)

- **Fórmula del `<title>`:** `{nombre}: {kicker} · Nando Muñoz` (es) y `{name}: {kicker} · Nando Muñoz` (en). Con las 13 fichas queda entre 36 y 54 caracteres; quitar « · Proyectos» evita pasar de 60 en 4 fichas (String Transformer 66, Gestor de comparsas 67…). Ejemplos: `LUZ: sistema de diseño · Nando Muñoz` (36), `IKAY: huella digital del navegador · Nando Muñoz` (48), `¿Quién canta hoy?: Carnaval de Cádiz · Nando Muñoz` (50). Dos fichas piden título a mano (el kicker solo no dice qué es): `accesibilidad` («Acme Studio: web rota a propósito para auditorías de accesibilidad») y `coac-analisis` («Gestor de comparsas: dashboard de datos del COAC»).
- **Descripción:** hoy el primer párrafo mide 124–336 caracteres y solo 4 de 13 caben en 155 (IKAY 148, Acme 132, illo-loader 138, js-subtype 167 no). Hay que **escribir 9–10 descripciones por idioma** (20 textos). Ejemplos ya medidos:

| Proyecto | es | en |
|---|---|---|
| `luz` | LUZ es un sistema de diseño en HTML, CSS y módulos ES, sin dependencias en ejecución y con WCAG 2.2 AA como objetivo en sus tres modos de color. (144) | LUZ is a design system in HTML, CSS and ES modules with no runtime dependencies, aiming at WCAG 2.2 AA in all three colour modes. (129) |
| `ikay` | IKAY lee 33 datos que cualquier web obtiene de tu navegador sin pedirte un solo permiso y te los enseña como el expediente que una web guarda de ti. (148) | IKAY reads 33 pieces of data any website gets from your browser without asking permission, and shows them as the file a site keeps on you. (~140) |
| `quien-canta-hoy` | Qué agrupación sale ahora en el COAC y cuándo toca verla: una app para seguir el concurso del Carnaval de Cádiz sesión a sesión. (128) | Which group is on stage at the COAC right now and when yours will be on: an app to follow the Cádiz Carnival contest session by session. (136) |

- `og:image` de ficha: recorte 1200×630 de la captura (1200×750, `maqueta/img/proyectos/<id>.jpg`; se pierde un 16 % de alto) o tarjeta Trama con el kanji (D7). Criterio: la tarjeta con el kanji, porque es lo que distingue al sitio y las capturas de pantalla recortadas rinden mal en miniatura.

## 4. MEJORAR

| # | Hallazgo | Evidencia | Propuesta | ¿Maqueta o Astro? |
|---|---|---|---|---|
| **M1** | **La home: el título actual de WordPress es un juego de palabras** («Código y palabra solamente con IA, chirrÍA») sin intención de búsqueda; y el `<h1>` de la maqueta es solo el nombre. | `soynando.json` → `home.title`; `index.html` (`h1.hero__name` = nombre; el lema va en `p.hero__deck`). | Título y descripción de §3.1. Mantener el `<h1>` como el nombre (la entidad; las búsquedas de marca son lo que va a hacer la home) y dejar el lema como `deck`. `og:title` = título; `og:image` = tarjeta Trama (la actual `share-card.png` de WordPress no existe en la maqueta). | **Astro** (textos ya redactados) |
| **M2** | **`og:image` por artículo: las portadas no recortan igual a 1200×630** (la proporción 1,91:1). | Tamaños de `blog.json`: `tu-empresa…` 1600×2000 (retrato: un recorte conserva el 31 % del alto), `…renacidos` 1500×500 (3:1, pierde el 36 % de los lados del cartel), `…oveja-negra` 1000×750 y `…sumisos` 1000×668 (menos de 1200 de ancho), `margaret-hamilton` 1600×1067 y los demás entre 1,5 y 1,78. | Recorte por artículo con punto focal (`cover.focus: {x,y}` en `blog.json`), **sin escalar hacia arriba** (para los dos de 1000 px, 1000×524: vale para Facebook/X, que piden ≥ 600×315) y, para el retrato y el cartel de 3:1, la tarjeta Trama en vez de un recorte malo. `og:image:alt` = `cover.alt`. Para los artículos sin portada (ninguno hoy, los 11 tienen), tarjeta Trama. | **Maqueta** (punto focal en datos) + **Astro** (generación, Fase 9/D7) |
| **M3** | **Paginación: 5 por página con 11 artículos = 3 páginas de lista**, la última con 1. WordPress usa 6 por página (2 páginas). | `blog.js:18` (`PER_PAGE = 5`), `blog.js:316–326`. Plan U8 (`/blog/2/`). | Subir `PER_PAGE` a 12 (un solo listado mientras no haya más de 12 artículos): menos URLs finas, ningún artículo a 3 clics y sin `/blog/2/` que redirigir desde `/blog/page/2/`. Si se mantiene la paginación: `/blog/page/2/` → `/blog/2/` (redirección) y cada página con `canonical` propio, **no** a la 1 (documentado). | **Maqueta** (constante) o **Astro** |
| **M4** | **Páginas de etiqueta finas** y dos índices sin valor propio. | Tras C2, 1 artículo en `web-components` y `historia-de-la-informatica`, 2 en `css` y `privacidad`; hoy `tagPage()` pinta cualquier etiqueta con ≥1; `/blog/categoria/` y `/blog/etiqueta/` son índices de 2 y 9 enlaces. | Etiquetas con **menos de 3 artículos: `noindex, follow` y fuera del sitemap** (criterio; el plan U9 dice «< 2», con 1 artículo no hay página que valga la pena y con 2 casi tampoco). Los dos índices (`/blog/categoria/`, `/blog/etiqueta/`): `noindex, follow` y fuera del sitemap; siguen enlazados para la navegación. Las 2 categorías **sí** se indexan. | **Astro** (Fase 8/9) |
| **M5** | **Artículos en español dentro de la interfaz inglesa.** El plan genera `/en/blog/<slug>/` con `lang="es"` y canonical al español: 10 páginas duplicadas que Google tiene que consolidar. | Plan §5, fila «Artículo»; `blog.js:559` (`lang` del título), traducción M3. | Mejor (criterio): **no generar** `/en/blog/<slug>/`; el listado inglés enlaza al artículo español (`/blog/<slug>/`, con `lang="es"` y `hreflang="es"` en el enlace) y lo dice con el aviso que ya existe en filas y destacados. Se pierde el marco inglés alrededor de un texto español; se gana limpieza (sin duplicados, sin canonical entre idiomas, sitemap más corto). Si el dueño prefiere mantener el marco: canonical al español, **sin** `hreflang` entre ellas, fuera del sitemap. | **Astro** (Fase 8, decisión del dueño) |
| **M6** | **Enlazado interno casi inexistente dentro del texto.** Los 11 artículos tienen **0 enlaces internos** (solo externos: 3–14 por artículo) y ni un enlace a un proyecto; el único proyecto citado, IKAY, apunta a `nandomunoz.github.io/ikay` (el repo vigente es `ikay-vanilla`, veracidad D4). Los proyectos relacionados se puntúan por tecnología (JS/HTML/CSS casi siempre coinciden: LUZ se relaciona con casi todo). | Recuento de `href` en `blog.json`; `blog.js:629–634` (`shared()` por `tech`); un enlace `nandomunoz.github.io/ikay` en `tu-navegador-sabe…`. | (1) En el artículo de huella digital, enlazar a `/proyectos/ikay/`. (2) Bloque «Proyectos relacionados» en los artículos del Carnaval (→ `quien-canta-hoy`, `ares-api`, `coac-analisis`, `streetcai`), del sistema de diseño y Web Components (→ `luz`, `illo-loader`). (3) En la ficha, «Artículos relacionados» (misma relación al revés). (4) Relacionar proyectos por **grupo** y no por tecnología: Carnaval (4), accesibilidad y diseño (`luz`, `accesibilidad`, `ikay`), herramientas (`string-transformer`, `js-subtype`, `toolbar-aem`, `illo-loader`), IA (`chrome-local-ai`). El texto de enlace es el nombre del proyecto o el título del artículo. | **Maqueta** (campo `related` en datos y el bloque) → **Astro** |
| **M7** | **Textos de enlace genéricos o poco descriptivos.** «Ficha completa →», «Ver demo», «Ver código» se repiten sin decir de qué proyecto; los `<h2>` de año de las listas son solo `2026`, `2025`… | `parts.js` (`projPage`, `demo`, `repo`); `blog.js:202,607` (`h2.byear__n`). | «Ficha completa» con el nombre en texto oculto (como ya se hace en el botón «Abrir»: `main.js:~125`); «Ver código de LUZ»; los `<h2>` de año como «Artículos de 2026» / «Proyectos de 2026» (el número visible y el resto con `.vh`). | **Maqueta** (marcado barato) |
| **M8** | **Migas como texto, no como navegación.** | `blog.js:177,558,666` (`<p class="crumbs">`), accesibilidad 16/32. | `<nav aria-label="Migas de pan"><ol>` con la página actual sin enlace y **`BreadcrumbList` en JSON-LD con las mismas tres o cuatro entradas** (§6). | **Maqueta** (marcado) + **Astro** (JSON-LD) |
| **M9** | **Cobertura de datos estructurados.** WordPress tiene Person+Organization híbrido, `Article`, una `BreadcrumbList` de la home con un único elemento «Portada» sin `item`, y un `SearchAction` apuntando a `/?s=` (sin buscador de ese tipo en el sitio nuevo). | `curl https://soynando.com/` → `application/ld+json`. | Valores exactos en §6. Quitar `SearchAction` (Google retiró el cuadro de búsqueda de los sitelinks a finales de 2024; de memoria, verificar). | **Astro** (Fase 9) |
| **M10** | **El RSS cambia de URL y de `guid`.** Los lectores de feeds no siguen `meta refresh`; si el `guid` cambia, los 10–11 artículos aparecen como nuevos. | `soynando.json` → `feed.items[].guid` = el permalink antiguo; `site.json` → `extraSocials.rss` = `https://soynando.com/feed/`. | `/rss.xml` y **la misma salida en `/feed/`** (301 con Cloudflare; sin él, un segundo endpoint que escriba el XML en `feed/index.xml`); `guid` = el permalink antiguo con `isPermaLink="false"`; `<link rel="alternate" type="application/rss+xml">` en todas las páginas; el icono RSS del pie ya apunta a `/feed/` (queda bien). | **Astro** (Fase 9) |
| **M11** | **Identidad inconsistente en WordPress y un enlace a sí mismo.** Yoast firma una publicación como «Nando Munoz» (sin eñe) y otras como «Nando Muñoz»; `site.json` lista como red social «Blog → soynando.com», que será un enlace al propio sitio. | `soynando.json` → `posts[].seo.schema` (autor `Nando Munoz`); `data/site.json` → `socials[id=blog]`; el pie muestra solo 4 redes, pero «04 Escríbeme» de la home las lista todas. | Un único `Person` con `@id` estable y el nombre con eñe en todas partes; `sameAs` = GitHub, LinkedIn, X, Facebook (sin el blog, sin RSS); sacar «Blog» de la lista de contacto cuando el sitio sea el blog. | **Maqueta** (`site.json`) + **Astro** |
| **M12** | **Imágenes del cuerpo del artículo en `<img>` suelto y solo JPEG**, aunque existen AVIF y WebP (`img/blog/posts/*.avif`). | `blog.js:419–420` y `472` (miniatura de YouTube); regla de CLAUDE.md («siempre `<picture>`»). La portada y las miniaturas de fila ya van en `<picture>`. | `<picture>` con `<source>` AVIF/WebP y `<img>` de respaldo, igual que `coverPicture()`; la miniatura de YouTube queda fuera de la regla solo si es un `<img>` para leer píxeles (aquí no lo es: es contenido). | **Maqueta** (se copia tal cual a Astro) |
| **M13** | **Slugs de WordPress con defectos** que, si hay 301 de todos modos, se pueden arreglar sin coste extra de redirección. | `…-analisis-del-popuri-de-los-renacidos` (typo «popuri»; el título correcto es «popurrí»), `como-detectar-…-en-tu-navegador` (90 caracteres), `tu-navegador-sabe-sobre-ti-mas-de-lo-que-crees` (el título es «Huella digital…»), `introduccion-a-la-ia-2` (C1). | Con Cloudflare (C7): `…-popurri-de-los-renacidos`, `detectar-soporte-pseudoclases-css-javascript` y `huella-digital-datos-que-regalas`, **una sola redirección** de cada URL antigua. Con GitHub Pages: dejar todos (cada redirección extra es un riesgo). Criterio: el efecto en posiciones es pequeño; importa más no equivocarse en el mapa. | **Astro** (decisión de C7) |
| **M14** | **Peso de datos que se arrastra.** Cada página interior descarga `blog.json` (239 KB) y `projects.json`/`site.json` (41 KB) por JS aunque solo necesite un artículo; la política y los créditos también. | `blog.js:15` (`Promise.all([content(), blog()])`), `ls -la maqueta/shared/blog.json`. | Lo elimina Astro (HTML estático); el único JSON del cliente será el índice de búsqueda de la 404 (~10 KB, Fase 9). Anotado para medir LCP/INP allí. | **Astro** |

## 5. DEJAR COMO ESTÁ

| # | Qué | Evidencia | Por qué |
|---|---|---|---|
| **D1** | **Conmutador de idioma** con `hreflang` y `lang` en el enlace y la lengua actual como texto (`aria-current`). | `parts.js:~111`. | Es el patrón correcto; en Astro cada enlace apunta a la **misma página** en el otro idioma. |
| **D2** | **Un solo `<h1>` por página y orden de encabezados sin saltos** (artículo: h1 → h2 → h3; lista: h1 → h2 de año → h3 de fila; ficha: h1 → h2 «Más proyectos»; la home: h1 nombre → 4 h2). | `blog.js` (`h1.post__title`, `head()`), `index.html`. | Los `<h2>` del pie («Secciones», «Sígueme»…) y el del diálogo de compartir no molestan. Salvedad menor: los `<h2>` del artículo de la oveja negra están **en mayúsculas en los datos** (`EL NACIMIENTO DE LA OVEJA NEGRA`); es de tono/ortografía. |
| **D3** | **Imágenes**: `<picture>` AVIF/WebP/JPEG con `width` y `height`; portada con `fetchpriority="high"`; las miniaturas de fila con `alt=""` porque el título está al lado; capturas de proyecto con `alt` «Captura de …». | `parts.js:~185–200`, `main.js:116`. | Cumple CLAUDE.md y evita CLS; no tocar. (Solo faltan los `alt` de C9.) |
| **D4** | **`<time datetime>`** en filas y artículo; `rel="prev"/"next"` en navegación de artículo y paginación; `rel="noopener"` y sin `nofollow` en los enlaces externos; `rel="me"` en las redes de la home. | `blog.js:~512`, `parts.js`, `main.js:193`. | Alimenta fechas en `BlogPosting` y la señal de identidad (`sameAs`). Google ya no usa `rel=prev/next`, pero no daña. |
| **D5** | **Ids de proyecto ASCII y estables** (`luz`, `quien-canta-hoy`, `streetcai`…) como slugs `/proyectos/<id>/`. | `data/projects.json`. | Plan U4: ya son URLs sin tildes ni ñ. |
| **D6** | **Fecha de lectura, categoría y etiquetas visibles** en el artículo, autor con enlace a la bio. | `blog.js:555–590`. | Señales útiles para usuarios y para la entidad (el trabajo de autoría lo cubre la auditoría GEO). |
| **D7** | **404 con búsqueda, sugerencia y últimos artículos.** | `blog.js:245–320`. | Útil. En Astro devuelve **código 404 real** (hoy `?a=zzz` pinta la 404 con HTTP 200, un *soft 404*) y lleva `noindex`. |
| **D8** | **Títulos de las filas como ancla** (el título del artículo, no «Leer más»); los vídeos incrustados con título; sin `VideoObject`. | `parts.js:~300`; `informe-seo-cookies.md` N3. | Texto de enlace descriptivo; el vídeo no es el objeto de la página. |
| **D9** | **Páginas legales** indexables con metadatos propios. | `informe-seo-cookies.md` M2–M4. | Ya cubierto allí; no repetido. |

## 6. Capa técnica para Astro (valores exactos)

**Configuración.** `site: 'https://soynando.com'`, `trailingSlash: 'always'`, `build.format: 'directory'` (igual que WordPress: `/<slug>/` con barra, sin redirecciones por la barra). Una sola URL canónica por página, absoluta, con barra final. Quitar `noindex` en la compilación de producción (una variable de entorno; hoy lo llevan los 9 shells).

**Plantilla `<head>` común.** `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">` (lo que ya manda WordPress; `max-image-preview:large` es lo que permite miniaturas grandes en Discover: documentado), `<link rel="alternate" hreflang="es|en|x-default">` solo donde hay par, `<link rel="alternate" type="application/rss+xml" href="/rss.xml">`, `og:type|title|description|url|site_name=Nando Muñoz|locale|image|image:width|image:height|image:alt`, `og:locale:alternate`, `twitter:card=summary_large_image`, `twitter:site=@nandovejer` (WordPress ya lo declara; no `twitter:creator` con URL, que Yoast pone mal), `theme-color`, iconos (ya están en `maqueta/`).

| Tipo de página | canonical | hreflang | `og:type` | JSON-LD (`@graph`) | Sitemap |
|---|---|---|---|---|---|
| Home `/`, `/en/` | propia | es ↔ en + `x-default` → `/` | `website` | `WebSite`, `ProfilePage` (`mainEntity` → `#person`), `Person` | sí |
| Proyectos `/proyectos/`, `/en/projects/` | propia (sin `?tech=`) | es ↔ en + x-default | `website` | `CollectionPage`, `BreadcrumbList` | sí |
| Ficha `/proyectos/<id>/` | propia | es ↔ en + x-default | `website` | `SoftwareSourceCode`, `BreadcrumbList` | sí |
| Blog `/blog/`, `/en/blog/` | propia (página N: propia, no la 1) | es ↔ en + x-default | `website` | `Blog`, `BreadcrumbList` | sí (solo la 1 si M3 la deja en una) |
| Artículo `/blog/<slug>/` | propia | **ninguno** (un solo idioma) | `article` (+ `article:published_time`, `modified_time`, `section`, `tag`) | `BlogPosting`, `BreadcrumbList` | sí, con `lastmod` |
| Artículo en `/en/` (si se generan, M5) | **la URL española** | ninguno | — | ninguno | no |
| Categoría | propia | es ↔ en + x-default | `website` | `CollectionPage`, `BreadcrumbList` | sí |
| Etiqueta (≥ 3 artículos) | propia | es ↔ en + x-default | `website` | `CollectionPage`, `BreadcrumbList` | sí; con < 3: `noindex, follow`, no |
| Índices `/blog/categoria/`, `/blog/etiqueta/` | propia | es ↔ en | `website` | — | no (`noindex, follow`) |
| Privacidad, cookies, créditos | propia | es ↔ en + x-default | `website` | `WebPage` + `BreadcrumbList` (ver `informe-seo-cookies.md` M3) | sí, `lastmod` = `UPDATED` |
| 404 | ninguno | ninguno | — | ninguno | no (`noindex`) |

**JSON-LD de la home** (valores reales; ids estables, reutilizados por todas las páginas):

```json
{"@context":"https://schema.org","@graph":[
 {"@type":"WebSite","@id":"https://soynando.com/#website","url":"https://soynando.com/","name":"Nando Muñoz","inLanguage":["es","en"],"publisher":{"@id":"https://soynando.com/#person"}},
 {"@type":"ProfilePage","@id":"https://soynando.com/#profilepage","url":"https://soynando.com/","isPartOf":{"@id":"https://soynando.com/#website"},"mainEntity":{"@id":"https://soynando.com/#person"},"dateModified":"<fecha real del último cambio>"},
 {"@type":"Person","@id":"https://soynando.com/#person","name":"Nando Muñoz","alternateName":"Nando","url":"https://soynando.com/","jobTitle":"Tech lead de frontend",
  "sameAs":["https://github.com/nandomunoz","https://www.linkedin.com/in/nandovejer","https://x.com/nandovejer","https://www.facebook.com/nandovejer"],
  "knowsAbout":["Desarrollo frontend","Adobe Experience Manager","Salesforce Commerce Cloud","Sistemas de diseño","Accesibilidad web","Carnaval de Cádiz"]}]}
```

(Sin `image` del `Person` mientras no haya retrato: no inventar. Sin `SearchAction`. Sin `Organization` híbrida: el titular es una persona.)

**`BlogPosting`** (ejemplo con el artículo de Hamilton; `headline` ≤ 110 caracteres: el más largo mide 90):

```json
{"@type":"BlogPosting","@id":"https://soynando.com/blog/margaret-hamilton/#article","headline":"Margaret Hamilton, la persona que creó nuestro oficio e hizo posible mirar a las estrellas",
 "description":"<descripción de §3.2>","inLanguage":"es","url":"https://soynando.com/blog/margaret-hamilton/","mainEntityOfPage":{"@id":"https://soynando.com/blog/margaret-hamilton/"},
 "image":[{"@type":"ImageObject","url":"https://soynando.com/img/og/margaret-hamilton.jpg","width":1200,"height":630}],
 "datePublished":"2026-10-19T09:00:00+02:00","dateModified":"2026-10-19T09:00:00+02:00",
 "author":{"@id":"https://soynando.com/#person"},"publisher":{"@id":"https://soynando.com/#person"},
 "articleSection":"Código y gestión","keywords":["historia de la informática","iahoraque"],"isPartOf":{"@id":"https://soynando.com/blog/#blog"}}
```

Reglas: `dateModified ≥ datePublished` siempre (C9); fechas con zona horaria; `image` = el mismo recorte que `og:image` (M2); el JSON-LD se valida con el «Rich Results Test» y el validador de schema.org: **no esperar rich results** (Google ya no los da a artículos de blog personales salvo para señales de entidad; **criterio**).

**`SoftwareSourceCode`** (ficha): `name`, `description`, `url` (la ficha), `codeRepository` (el repo de `nandovejer`), `programmingLanguage` (de `tech`, solo los lenguajes: JavaScript, TypeScript, HTML, CSS), `author` → `#person`, `dateCreated` = año de `projects.json` (coincide con `createdAt` del repo, veracidad D1), `inLanguage`; sin `license` hasta confirmar cada una. Sin resultado enriquecido en Google (**documentado**: no hay una para código); sirve para la entidad. Ni `ItemList` en los listados ni `VideoObject` en los artículos.

**`BreadcrumbList`**: Inicio › Blog › {título del artículo}; Inicio › Proyectos › {nombre}; Inicio › Blog › {categoría}. La **categoría no entra** en la miga de un artículo (la página canónica del artículo no depende de ella). Mismos nombres que el `<nav>` visible (M8).

**Sitemap.** Archivo en `/sitemap_index.xml` (C8) con `xhtml:link` es/en y `lastmod` real: artículos = `max(date, modified)`, páginas legales = `UPDATED`, categorías y listado de blog = fecha del artículo más reciente que contienen, proyectos **sin** `lastmod` hasta tener la fecha de cambio verificada (un `lastmod` inventado o igual al del build resta credibilidad: documentado por Google). Sin `priority` ni `changefreq` (Google los ignora). Excluye lo `noindex`, la 404 y los duplicados `/en/blog/<slug>/`.

**`robots.txt`.** Conservar el de WordPress sin lo propio de WordPress (`/wp-admin/`, `/imunify-bot-check`) y con `Sitemap: https://soynando.com/sitemap_index.xml`; la política de IA (`Content-Signal`, `License`, rastreadores de entrenamiento bloqueados y de búsqueda permitidos) la fija la auditoría GEO y el informe legal M10 (`license.xml`, `<link rel="license">`). No bloquear `/assets/` ni los módulos JS (Googlebot renderiza la tarjeta y el panel).

**RSS.** `/rss.xml` (RSS 2.0), 11 o 10 elementos, `guid` antiguo (M10), `<description>` con el extracto y enlace (criterio: resumen y enlace, no el texto íntegro: el feed completo facilita el rascado y los artículos ya reservan el entrenamiento de IA), `atom:link rel=self`. Opción: `/en/rss.xml` solo si hay contenido inglés (hoy no: 0 artículos). **Mejor no publicarlo vacío.**

**Core Web Vitals que se arrastran** (los presupuestos se miden en Astro, con `perf-auditor`): la portada del artículo ya es candidata a LCP con `fetchpriority="high"` y dimensiones (D3); las fuentes Archivo y Doto se precargan en todas las páginas (comprobar que Doto sirve sobre el pliegue en cada plantilla); el motor de puntos y los bucles son trabajo de INP, no de SEO; cada canvas sigue `aria-hidden` y no entra en el texto indexable.

## 7. Mapa de redirecciones WordPress → Astro (29 URLs del sitemap + las que hoy responden)

| URL antigua | Hoy | Nueva | Notas |
|---|---|---|---|
| `/<slug>/` (11 artículos) | 200, indexada | `/blog/<slug>/` (301 con Cloudflare) o **la misma URL** (GitHub Pages, C7) | `introduccion-a-la-ia-2/` → la elegida (C1); slugs renombrados (M13) |
| `/blog/` | 200 | `/blog/` | sin cambio |
| `/blog/page/2/` | 200, canonical propio | `/blog/` (si M3 a 12) o `/blog/2/` | |
| `/category/hablo-de-codigo-y-gestion/`, `/category/hablo-de-literatura-y-pensamiento/` | 200, indexadas | `/blog/categoria/codigo-y-gestion/`, `/blog/categoria/literatura-y-pensamiento/` (C3) | `/category/frontend/` y `/category/uncategorized/` (vacías, 200, fuera del sitemap) → `/blog/` |
| `/tag/<slug>/` (9) | 200, indexadas | `/blog/etiqueta/<slug>/` (mismos slugs) | las de < 3 artículos: `noindex` (M4); `/tag/historia-de-la-informatica/` (0 artículos) → `/blog/etiqueta/` |
| `/author/nando-munoz/`, `/author/admin/` | 301 a `/` | `/` | mantener |
| `/feed/`, `/feed`, feeds por categoría y `/comments/feed/` | 200 / 301 | `/rss.xml` y misma salida en `/feed/` (M10) | los de categoría → `/rss.xml` |
| `/privacidad/`, `/politica-de-cookies/` | 200, indexadas | **sin cambio** (mantener) | `informe-seo-cookies.md` M2 |
| `/proyectos/` | **301 a github.io** | página real `/proyectos/` | **C6: orden de despliegue** |
| `/me/` | 303 a github.io | `/` | igual |
| `/sitemap_index.xml` y los 5 sitemaps hijos | 200 | `/sitemap_index.xml` (C8); los hijos desaparecen (404) | enviar el nuevo en Search Console |
| `/robots.txt`, `/llms.txt`, `/license.xml` | 200 | mantener rutas | GEO y legal M10 |
| `/wp-content/uploads/…` | 200 | solo se mantienen las 11 portadas si Cloudflare lo permite; el resto, 404 | las imágenes tienen poco tráfico de Imágenes: **criterio**, no vale el esfuerzo |
| `/?s=`, `/wp-json/…`, `/xmlrpc.php` | WordPress | 404 | no mapear |
| `/en/` | 404 | página nueva | |

Riesgo de pérdida de posiciones: **bajo si se hace con 301 reales y un mapa 1 a 1** (11 artículos, mismo dominio, mismo texto; el cambio es de ruta, no de contenido) y **medio si solo hay `meta refresh`** en GitHub Pages (más lento, y no todos los rastreadores lo siguen). Lo que mide el riesgo real es Search Console de **soynando.com** (no de github.io): top URLs y clics de los últimos 16 meses; no he podido verlo. Cambio de dominio: no hay (misma `soynando.com`); la herramienta «Cambio de dirección» no aplica. Lo que sí hay que hacer: comprobar que la propiedad sigue verificada tras el cambio de hosting (la verificación en la home de WordPress no aparece como `<meta>`: puede ser DNS, que sobrevive, o un archivo/otra vía, que no).

## 8. Preguntas para el dueño

1. **C1.** ¿Qué versión de «¿Hay alguien dentro?» se queda (recomiendo la nueva, en `/blog/introduccion-a-la-ia/`) y cuál se redirige?
2. **C7 / D2.** ¿Cloudflare Pages (301 reales, `_headers`, feed, recomendado) o GitHub Pages? Si GitHub Pages, ¿los artículos se quedan en `/<slug>/` (C7) o se acepta el `meta refresh` para moverlos a `/blog/<slug>/` (U1)?
3. **C3.** ¿Nombres y slugs de categoría nuevos (`codigo-y-gestion`…) con redirección desde los de WordPress, o los de WordPress?
4. **C2.** ¿Se acepta la propuesta de reetiquetado (y la etiqueta nueva `sistemas-de-diseno`)?
5. **M5.** Artículos en español bajo `/en/`: ¿enlazar directamente al español (propuesta) o mantener el marco inglés con canonical al español?
6. **M3.** ¿12 artículos por página (un solo listado hoy) o 6 como en WordPress?
7. **M2.** ¿Las tres portadas de Carnaval (con el riesgo que asumió el dueño, legal C4) se difunden también como `og:image`, o esos artículos usan la tarjeta Trama?
8. **M13.** ¿Renombrar los 3 slugs defectuosos si hay 301 real?
9. **U6.** ¿Search Console y Bing Webmaster de **soynando.com** están verificados y por qué método? ¿Se puede exportar el informe de rendimiento (16 meses) antes de migrar?
10. **U7 / M1.** ¿Se aprueba el título de la home («Nando Muñoz · Tech lead de frontend, código y palabra») y el `<h1>` solo con el nombre?
11. **C5.** ¿Quién redacta las 20 descripciones de proyecto que faltan (es/en), con el criterio de §3.3?

## 9. Checklist de la Fase 10 (para el plan de Astro)

- [ ] `grep -r "noindex" dist/` solo da la 404, los índices de §6 y las etiquetas finas; `grep -rc 'name="description"'` = una por página; títulos únicos (script que lista duplicados) y ≤ 60–65 caracteres.
- [ ] Un `<h1>` por página en `dist/` (sin JS); la home y las fichas con enlaces `<a href>` a las fichas (C4); ningún texto «Esta web necesita JavaScript» como único contenido.
- [ ] Canonical absoluto y con barra; hreflang recíproco (es ↔ en + x-default) y solo donde hay par; los artículos sin `hreflang`.
- [ ] `sitemap_index.xml`: URLs 200, sin `noindex`, con `lastmod` real y alternates; `robots.txt` con `Sitemap:`.
- [ ] Validador de datos estructurados sin errores en 1 URL de cada tipo; `dateModified ≥ datePublished` en todos los artículos.
- [ ] `og:image` 1200×630 (o 1000×524, M2) en cada página, `og:image:alt`, y vista previa revisada con el depurador de Facebook y LinkedIn; `twitter:card` ok.
- [ ] Las 29 URLs del sitemap de WordPress dan 200 o redirección a su nueva URL en **un solo salto** (script con `curl -sIL`); `/feed/` devuelve XML válido con los `guid` antiguos.
- [ ] Orden de la Fase 11 (C6): soynando.com publicado, `/proyectos/` y `/` respondiendo, **después** las redirecciones de github.io; ninguna cadena ni bucle.
- [ ] Search Console: propiedad verificada, sitemap enviado, «Inspección de URL» de la home, un artículo y una ficha; vigilar «Páginas» (no indexadas) y «Rendimiento» las 4 semanas siguientes.
- [ ] La 404 devuelve código 404 y `noindex`; `?a=zzz` ya no existe como ruta.
- [ ] Alt revisados (C9) y `<picture>` en el cuerpo (M12): ninguna `<img>` de contenido suelta.

## 10. Recuento

**Cambiar: 9** (C1–C9) · **Mejorar: 14** (M1–M14) · **Dejar como está: 9** (D1–D9). Maqueta pura: C1, C2, C9, M6, M7, M12 (y datos de C3, C5, M2, M3, M8, M11); resto, Astro.

## 11. Qué haría primero

En la maqueta, tres cosas de datos que Astro ya no podrá corregir sin tocar contenido: **resolver el artículo duplicado (C1)**, **reetiquetar los 11 artículos (C2)** y **añadir `modified`, los 9 `alt` que faltan y los campos `seo` (C5, C9)**; con ellas el contenido que se porta queda limpio y los textos de §3 listos. En paralelo, que el dueño decida **Cloudflare o GitHub Pages (C7)**, porque de eso dependen la URL de los artículos, el feed y toda la lista de redirecciones; y que apunte el **orden de despliegue de la Fase 11 (C6)** para no crear un bucle con `nandovejer.github.io`. Después, en Astro, los enlaces `<a href>` reales en las tarjetas de proyecto (C4), el `<head>` por plantilla con los valores de §6 y la checklist de §9.
