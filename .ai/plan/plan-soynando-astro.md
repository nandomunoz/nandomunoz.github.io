# Plan · nandomunoz.com en Astro + LUZ + vanilla

> Objetivo: que la maqueta **Trama** de la rama `proto/home` (`maqueta/`) pase a ser **nandomunoz.com**: home, proyectos, blog con todas sus páginas, políticas, créditos y 404, en **español, inglés y árabe**, hecho con **Astro** (salida estática), **LUZ** (luzds.com) como base de tokens y HTML sin clases, y **vanilla JS** solo donde aporta. Lo máximo posible con APIs estándar del navegador y lo mínimo de dependencias. El WordPress de hoy (**soynando.com**) se apaga y sus URLs redirigen a nandomunoz.com.
>
> **Este plan es el del sitio en Astro.** Lo que se trabaja antes sobre la maqueta (auditorías con agentes, decisiones de diseño y contenido, arreglos que se arrastrarían al portar) está en [plan-maqueta.md](plan-maqueta.md); este plan empieza cuando la maqueta queda congelada. (El nombre del archivo se conserva para no romper los enlaces de DESIGN.md, plan-maqueta.md y los agentes.)
>
> Fecha: 2026-11-15 (revisado el 2026-11-16 y el **2026-11-17**) · Rama de origen: `proto/home` (Trama, en `f65064e`) · Diseño de referencia: `maqueta/DESIGN.md`
>
> **Rama de trabajo: `feature/astro`.** Todo lo de este plan (Fases 1 a 11) se aplica en la rama `feature/astro`, creada desde `proto/home` en el tag `checkpoint-trama-maqueta`. Ni `proto/home` (la maqueta, que queda como referencia) ni `main` reciben commits del sitio de Astro hasta que se acuerde fusionar.

### Qué cambió en la revisión del 2026-11-17

Los 17 commits de la maqueta desde `85187dd` cambian el punto de partida. Lo que afecta a este plan:

| Cambio en la maqueta | Commit | Dónde toca al plan |
|---|---|---|
| **El sitio será nandomunoz.com**, no soynando.com (DESIGN.md §15). soynando.com pasa a ser solo el dominio antiguo que redirige. | `b9b1872` | Todo: `site`, canonical, JSON-LD, redirecciones **entre dominios** (§5, D2, D11, Fase 11) |
| **GitHub es ahora `nandomunoz`**: repos, demos, gists y `baseUrl` (`https://nandomunoz.github.io`). El repo sigue llamándose `nandovejer.github.io`. X, LinkedIn y Facebook siguen como `nandovejer`. | `f65064e` | `sameAs`, enlaces de proyectos, D5, pregunta R8 |
| **Árabe de Siria** (`?lang=ar`, `lang="ar-SY"`, `dir="rtl"`): interfaz, home, proyectos, categorías y etiquetas (en `shared/content-ar.json`), políticas y créditos; plurales árabes, flechas giradas, cifras latinas; lo fijo a un borde se va al otro con `dir=rtl`. | `224fa3b`, `3bfd586` | §6 (tres idiomas), §4, Fases 2, 4, 10 |
| **Los 11 artículos traducidos a inglés y árabe** (traducción automática revisada bloque a bloque; las letras de Carnaval y los tuits se quedan en español con `lang="es"`). Un artículo traducido lleva un **aviso** («escrito en español, traducción automática…», con enlace al original) y `alt` de portada por idioma (`cover.alt_en`, `cover.alt_ar`). | `0b4f3e5`, `d258d6b`, `a894689`, `3b39807` | I1–I3 resueltas; §5 y §6; Fase 3 (colección por idioma), Fase 8, SEO (canonical propio) |
| **Selector de idioma desplegable** con los nombres completos (botón + `popover` en la capa superior, Esc y clic fuera cierran, flechas, se abre hacia arriba si no cabe; disclosure, no menú ARIA). En el pie, los idiomas como enlaces en la columna «Idioma». | `e12a4dd`, `c6473c5` | Fase 4 |
| **Móvil (< 48em): la píldora del menú desde el primer pintado**; arriba solo logo e idioma. Desde 48em, menú en línea que se ancla al hacer scroll. | `597155b` | Fase 4 (más simple: en móvil no hay View Transition del menú) |
| **Pie**: la línea final vuelve a ser la letra pequeña (© salvo lo acreditado, hecho con LUZ (MIT), política de cookies, botón de ajustes); **el lema sale del pie** (se queda en el cartel de la portada); grupos de dos en dos desde 40em. | `c6473c5`, `62a40b7` | Fase 4, D-13 |
| **Proyectos**: 15 en `data/projects.json`, **13 visibles** en Trama (se ocultan `coac-analisis` e `illo-loader` con `HIDDEN` en `shared/content.js`). Nuevos: kong.sole (2019) y React para torpes (2023); IKAY pasa a 2020. Cada uno con su **kanji** (`data/kanjis-repos.json`) y su **captura en semitono**. | `882f6e5`, `aee8f2c`, `9cd7584`, `61167a0` | Fase 3 (campo `hidden`/`visible`), Fase 7, densidad por año (F5: ya hay 2019 y 2020) |
| **`variantes/`** guarda pruebas de cabecera, idioma, interruptores, etc. | `086deb0`, `e12a4dd` | **No se porta** |

Además, cosas que ya estaban en la maqueta y el plan no recogía (corregidas abajo): el acento es **verde** (`--matrix` #22c55e), no granate; la portada es **la lluvia** (`rain.js`, `RainField`) con un **cartel** (nombre, gatos, foto) y el lema escrito a máquina (`shared/poster.js`), no «NANDO» en partículas; la 404 es la lluvia con la foto de un escritorio; la portada de un artículo es una **pantalla de puntos** que se funde bajo el puntero (sin bucle); hay páginas de **privacidad, cookies y créditos**; la **tarjeta de cookies** volvió a todas las páginas (decisión del dueño del 2026-11-16, plan-maqueta §3 K1).

---

## 0. Punto de partida (lo que ya existe)

| Pieza | Dónde está hoy | Qué se aprovecha |
|---|---|---|
| Diseño completo y razonado | `maqueta/DESIGN.md` | Es la especificación. Todo lo que no cambie este plan, se respeta tal cual. |
| Home (cartel sobre la lluvia, 01 Bio, 02 Proyectos con 5 destacados, 03 Blog, 04 Escríbeme) | `maqueta/index.html` + `main.js` (475 líneas) + `style.css` | Marcado, CSS y comportamiento. Destacados: `FEATURED` en `main.js` (LUZ, ¿Quién canta hoy?, Street Cai, IKAY, Toolbar AEM). |
| Motor de puntos (`DotBlock`, `HeroField` en una línea para los títulos de sección, `fieldPoints`/`fly`, fuente 3×5, kanjis en puntos) | `maqueta/dots.js` (589 líneas) + `shared/kanji-cells.js` (kanjis rasterizados con `tools/kanji-cells.py`) + `shared/green.js` (verde bajo el puntero) | Se porta casi intacto como módulo ES. |
| Lluvia (`RainField`: portada y 404, máscaras nombre / gatos / foto, escaneo circular, `settle()` a los 5 s) y cartel (lema escrito a máquina) | `maqueta/rain.js` (391 líneas), `gatos.js`, `shared/poster.js` | Igual que el motor de puntos: módulos ES, solo en home y 404. |
| Proyectos: índice por año + filtro por tecnología + página por proyecto | `maqueta/proyectos/…` + `blog/blog.js` + `blog/parts.js` | Lógica de agrupado, filtros, anterior/siguiente, «más proyectos». Capturas en `maqueta/img/proyectos/` (`tools/project-shots.cjs`, con su `.tone.webp` para el semitono). |
| Blog: lista paginada, artículo, categorías, etiquetas | `maqueta/blog/…` | Plantillas y piezas (citas, YouTube con compuerta, tuits, tablas, líneas de tiempo, código resaltado), aviso de traducción, «Compartir artículo». |
| Privacidad, cookies, créditos | `maqueta/privacidad/`, `maqueta/cookies/`, `maqueta/creditos/` + `shared/privacy.js`, `cookies-policy.js`, `credits.js` (es/en/ar) | Textos auditados (legal ×2, tono, ortografía); pasan a HTML estático. |
| 404 con la lluvia, la foto del escritorio y buscador | `maqueta/404.html` | Tal cual, pero con índice de búsqueda generado en el build. |
| Contenido | `data/site.json`, `data/projects.json` (15 proyectos, es/en; 13 visibles en Trama), `maqueta/shared/content-ar.json` (árabe de la home, proyectos, categorías y etiquetas), `maqueta/shared/blog.json` (11 artículos de soynando.com en es, en y ar; imágenes en `maqueta/img/blog/`), `data/kanjis-repos.json` | Fuente de las colecciones de contenido de Astro. `data/site.json` y `data/projects.json` los comparte el Cassette: en Astro se copian y se separan (ver Fase 3). |
| Conversor WordPress → bloques | `maqueta/tools/soynando-to-blog.cjs`, `soynando-covers.cjs`, `soynando-images.cjs` | Base para la migración definitiva de artículos (ya con las imágenes en el repo). |
| LUZ | `assets/vendor/luz/` (0.4.1: `tokens`; `theme-mode`, `theme-boot`, `i18n`, `utils`, `clipboard`, `highlight` de `core`; `cookie-consent` y `timeline` de `catalog`), `tools/luz-sync.mjs` | Ya se usa en el site actual (tokens `--luz-*`, un tema por versión) y en la maqueta (modos de color, aviso de cookies, líneas de tiempo, copiar, resaltado de código). Trama será un tema LUZ más. |
| Fuentes | `assets/fonts/` (Archivo variable, Doto, Chakra Petch; Playfair Display para la máscara del nombre) | Autoalojadas, se copian con sus licencias OFL. **Falta fuente árabe** (pregunta I6). |
| SEO hecho en `build.mjs` | JSON-LD, hreflang, sitemap, robots, OG | Se reescribe en Astro con la misma lógica. |
| Informes de la ronda de auditorías | `.ai/plan/informe-*-maqueta.md` (13 temas) | Lo que dejan para Astro, en el §15. |

**Problema principal de la maqueta hoy** (DESIGN.md §15): sin JavaScript queda vacía, usa `?a=`/`?p=`/`?lang=` en lugar de rutas limpias y no tiene SEO. Astro resuelve exactamente eso: todo el HTML se genera en el build y el JS queda como mejora progresiva.

---

## 1. Principios de arquitectura

1. **HTML primero.** Cada página es HTML estático completo y legible sin JS. Los canvas de puntos son decoración (`aria-hidden`) que se monta encima.
2. **Cero JS por defecto.** Astro no envía JS salvo los `<script>` que pongamos. **No se usa ningún framework de componentes** (ni React, ni Preact, ni Svelte): solo componentes `.astro` y módulos ES vanilla.
3. **La plataforma antes que una librería.** Si el navegador lo hace, no se instala nada (tabla en §3).
4. **LUZ como base.** HTML sin clases estilado por LUZ; clases solo para lo que el HTML no puede decir. Los colores de Trama se escriben como **tema LUZ** (tokens semánticos `--luz-*`), igual que se hizo con Cassette/Disquetes/VHS (commit `a8092e5`).
5. **Contenido como datos.** Proyectos, artículos, categorías y etiquetas en colecciones de contenido tipadas; ninguna página tiene texto de contenido incrustado.
6. **Rutas limpias y estables.** Nada de `?a=` ni `?p=`; los parámetros quedan solo para estado de UI (filtros, paginación opcional).
7. **Vite solo a través de Astro.** Astro ya usa Vite por debajo (bundling, dev server, HMR). No se configura Vite aparte salvo un `vite: {}` puntual en `astro.config.mjs` si hiciera falta.

---

## 2. Dependencias (presupuesto)

| Paquete | Tipo | Por qué | Alternativa descartada |
|---|---|---|---|
| `astro` | dep | Generador estático, rutas, colecciones, i18n, imágenes, Vite incluido | — |
| `@luz-ds/tokens`, `@luz-ds/core` | dep | Tokens, HTML sin clases, `<luz-theme-mode>` y su script de arranque (los tres modos de color), `i18n`, `clipboard` («Copiar enlace», copiar código) y `highlight` (código de los artículos; mejor resaltarlo en el build y no cargarlo en cliente) | Vendorizar con `luz-sync.mjs` (válido también; ver decisión D3) |
| `@luz-ds/catalog` | dep | `<luz-cookie-consent>` (aviso de cookies y su registro) y `<luz-timeline>` (líneas de tiempo de los artículos), ya usados en la maqueta; cada uno se carga solo en las páginas que lo necesitan | Escribirlos a mano: duplicaría lo que LUZ ya mantiene y prueba |
| `sharp` | viene con Astro | Optimización de imágenes de `astro:assets` | — |

**Fuera** (se hace a mano con poco código): `@astrojs/sitemap` → endpoint `sitemap.xml.ts`; `@astrojs/rss` → endpoint `rss.xml.ts`; `@astrojs/mdx` → Markdown + HTML en línea; Tailwind/Sass → CSS nativo (anidamiento, `@layer`, `clamp()`, container queries); Pagefind/Fuse → índice JSON propio + búsqueda vanilla; GSAP/Lenis → CSS scroll-driven animations + View Transitions; Astro `<ClientRouter />` → View Transitions **entre documentos** nativas.

**Dev-only, opcional:** Playwright (ya está en caché en la máquina para las capturas de comparación). Para tests unitarios, `node:test` (incluido en Node).

Regla: **cualquier dependencia nueva requiere una línea en este documento diciendo qué API del navegador no basta.**

---

## 3. APIs del navegador que sustituyen librerías

| Necesidad | API estándar | Fallback |
|---|---|---|
| Transición de menú (en línea → píldora / raíl) | `document.startViewTransition()` (misma página) | Cambio instantáneo |
| Navegación entre páginas animada | `@view-transition { navigation: auto }` + `view-transition-name` | Navegación normal |
| Entradas al hacer scroll, parallax, barra de lectura | `animation-timeline: view()` / `scroll()` | `IntersectionObserver` añade `.in`; sin parallax |
| Panel de proyecto modal | `<dialog>` + `showModal()` (foco, Esc, `::backdrop`) | Enlace a la página del proyecto (sin JS ya funciona) |
| Selector de idioma (desplegable) | `popover` + `popovertarget` (disclosure con enlaces, no menú ARIA) | Sin JS, la lista de idiomas como enlaces (como en el pie) |
| Derecha a izquierda (árabe) | `dir="rtl"` en `<html>` desde el build, propiedades lógicas (`inset-inline-start`, `margin-inline`, `padding-inline`), `:dir(rtl)` para flechas y lo que gira | — |
| Índice de artículo plegable en móvil | `<details>`/`<summary>` | — |
| Compartir artículo | `navigator.share()` | `navigator.clipboard.writeText()` + enlaces directos |
| Precarga de la siguiente página | Speculation Rules (`<script type="speculationrules">`) | Nada |
| Lazy de imágenes/iframes | `loading="lazy"`, `decoding="async"`, `fetchpriority` | — |
| Vídeos YouTube con fachada | `<button>` que inserta `iframe` de `youtube-nocookie.com` | Enlace a YouTube |
| Rendimiento de listas largas | `content-visibility: auto` | — |
| Modos de color (oscuro, claro, contraste alto) | `<luz-theme-mode>` de LUZ, `data-mode` escrito antes de pintar por una línea en el `<head>`, `color-scheme` por modo, `prefers-contrast: more`, View Transition circular al cambiar | Sin JS: oscuro, o contraste alto por CSS si el sistema lo pide |
| Movimiento reducido | `prefers-reduced-motion` (CSS y `matchMedia`) | — |
| Fechas y números por idioma | `Intl.DateTimeFormat` (`es`, `en-GB`, `ar-SY` con `numberingSystem: 'latn'`), `Intl.RelativeTimeFormat`, `Intl.PluralRules` (el árabe tiene seis formas) — en el build siempre que se pueda | — |
| Componentes reutilizables en cliente (fachada YouTube, buscador) | Custom Elements (`customElements.define`) | El HTML de dentro ya es útil |
| Partículas | `<canvas>` 2D + `requestAnimationFrame`, `ResizeObserver`, `IntersectionObserver` para pausar fuera de pantalla | El texto real ya está en el HTML |

---

## 4. Estructura del proyecto

```
soynando/                         (raíz del repo, ver decisión D1)
├─ astro.config.mjs               site: 'https://nandomunoz.com', i18n (es, en, ar), redirects
├─ package.json                   astro (+ @luz-ds/* si D3 = npm)
├─ public/
│  ├─ fonts/                      Archivo, Doto, Chakra Petch, Playfair Display (+ árabe, I6) (woff2 + LICENSE OFL)
│  ├─ img/proyectos/              capturas y sus .tone.webp (o en src/assets con astro:assets)
│  ├─ favicon.svg, robots.txt (o endpoint), CNAME
├─ src/
│  ├─ content.config.ts           colecciones: projects, posts, categories, tags (+ schema Zod de astro:content)
│  ├─ content/
│  │  ├─ posts/<slug>/index.md    frontmatter + Markdown con HTML en línea (español, original); imágenes al lado
│  │  ├─ posts/<slug>/en.md, ar.md   traducciones (frontmatter propio: title, excerpt, cover_alt, translated: true)
│  │  ├─ projects.json            copia de data/projects.json + árabe de content-ar.json + kanji, hidden
│  │  ├─ categories.json, tags.json
│  ├─ data/site.json              nombre, kicker, deck, bio, redes (es/en/ar), lema
│  ├─ i18n/ui.ts                  textos de interfaz es/en/ar + helpers de URL, `dir` y plurales por idioma
│  ├─ styles/
│  │  ├─ luz-theme-trama.css      tokens semánticos LUZ con la paleta de Trama
│  │  ├─ base.css                 @layer reset, base (sobre LUZ), tipografía
│  │  ├─ layout.css               rejilla 12 col, gutters, secciones
│  │  └─ components/*.css         o <style> dentro de cada .astro
│  ├─ scripts/                    módulos vanilla (los empaqueta Vite)
│  │  ├─ dots.js                  motor (portado de maqueta/dots.js) + kanji-cells.js, green.js
│  │  ├─ rain.js, gatos.js, poster.js   lluvia y cartel (home y 404)
│  │  ├─ blocks.js, fly.js, nav.js, lang.js, progress.js, search.js, share.js, yt-facade.js, consent.js, theme.js
│  ├─ components/                 .astro: Head, Masthead, Nav, Footer, SecHead, ProjectBlock,
│  │                              ProjectRow, PostRow, Legend, Pager, Toc, PostBody, Share, …
│  ├─ layouts/Base.astro, Page.astro, Post.astro
│  └─ pages/
│     ├─ index.astro                         home (es)
│     ├─ proyectos/index.astro               todos, por año, filtros
│     ├─ proyectos/[id].astro                un proyecto
│     ├─ blog/index.astro, blog/[page].astro lista paginada (paginate())
│     ├─ blog/[slug].astro                   artículo
│     ├─ blog/categoria/index.astro, [cat]/[...page].astro
│     ├─ blog/etiqueta/index.astro,  [tag]/[...page].astro
│     ├─ 404.astro
│     ├─ rss.xml.ts, sitemap.xml.ts, search.json.ts, robots.txt.ts
│     ├─ privacidad/, politica-de-cookies/, creditos/
│     ├─ en/…                                mismas rutas en inglés (ver §6)
│     └─ ar/…                                mismas rutas en árabe, `dir="rtl"`
└─ tools/                         wp-import.mjs, luz-sync.mjs (si D3 = vendor), check-links.mjs
```

---

## 5. Mapa de URLs

| Página | es | en | ar |
|---|---|---|---|
| Home | `/` | `/en/` | `/ar/` |
| Proyectos | `/proyectos/` (`?tech=` filtra en cliente; sin JS se ven todos) | `/en/projects/` | `/ar/projects/` (U2) |
| Proyecto | `/proyectos/<id>/` | `/en/projects/<id>/` | `/ar/projects/<id>/` |
| Blog | `/blog/`, `/blog/2/`… | `/en/blog/`… | `/ar/blog/`… |
| Artículo | `/blog/<slug>/` | `/en/blog/<slug>/` (traducción automática con aviso, `canonical` propio) | `/ar/blog/<slug>/` (ídem) |
| Categorías / una | `/blog/categoria/`, `/blog/categoria/<id>/` | `/en/blog/category/…` | `/ar/blog/category/…` |
| Etiquetas / una | `/blog/etiqueta/`, `/blog/etiqueta/<id>/` | `/en/blog/tag/…` | `/ar/blog/tag/…` |
| Privacidad, cookies, créditos | `/privacidad/`, `/politica-de-cookies/`, `/creditos/` | `/en/privacy/`, `/en/cookie-policy/`, `/en/credits/` | `/ar/privacy/`… |
| RSS | `/rss.xml` | `/en/rss.xml` | `/ar/rss.xml` |
| 404 | `/404.html` | idioma detectado por la ruta en cliente | ídem, con `dir` |

Los slugs (ids de proyecto, slugs de artículo, categorías, etiquetas) son los mismos en los tres idiomas y en caracteres latinos.

**Redirecciones: ahora son entre dominios.** El sitio vive en `nandomunoz.com` y las URLs antiguas están en otro dominio:

| Origen | Destino |
|---|---|
| `soynando.com/<slug>/` (artículos de WordPress) | `nandomunoz.com/blog/<slug>/` |
| `soynando.com/category/<x>/`, `/tag/<x>/` | `nandomunoz.com/blog/categoria/<x>/`, `/blog/etiqueta/<x>/` (con el mapa de slugs que cambiaron, informe de veracidad) |
| `soynando.com/feed/` | `nandomunoz.com/rss.xml` |
| `soynando.com/politica-de-cookies/`, `/privacidad/` | `nandomunoz.com/politica-de-cookies/`, `/privacidad/` |
| `soynando.com/wp-content/uploads/…` | la imagen equivalente o el artículo |
| `soynando.com/` y cualquier otra ruta | `nandomunoz.com/` (o la ruta equivalente) |
| `nandomunoz.github.io/…` (Cassette, proyectos, `nandovejer.github.io` antiguo) | ver D5 y U5 |

Como el origen es **otro dominio**, `redirects` de `astro.config.mjs` no sirve para soynando.com (solo genera páginas dentro de nandomunoz.com). Las redirecciones de soynando.com las da quien sirva ese dominio: reglas de redirección de Cloudflare (301 reales, gratis, sin código), o el `.htaccess` del hosting de WordPress mientras siga contratado, o un pequeño sitio estático en soynando.com con páginas `meta refresh` + `canonical` generadas desde `blog.json` (lo peor para SEO). Ver D2 y D11. El campo `url` de cada artículo en `blog.json` (la dirección de WordPress) se conserva para generar esta tabla y el `guid` del RSS.

---

## 6. Idiomas

- i18n nativo de Astro: `defaultLocale: 'es'`, `locales: ['es', 'en', 'ar']`, `prefixDefaultLocale: false`. En el HTML: `lang="es"`, `lang="en"` y `lang="ar-SY"` + `dir="rtl"` (como `shared/content.js` hoy).
- Desaparece `?lang=`: cada idioma tiene su URL (mejor para SEO y sin JS). El selector de idioma enlaza a **la misma página** en cada idioma (conservando el `#fragmento`, informe de traducción).
- Textos de UI en `src/i18n/ui.ts` (los objetos `H` y `B` de `main.js` y `blog/blog.js`, los de `shared/*.js` y `shared/content-ar.json` salen de aquí). Plurales con `Intl.PluralRules` (el árabe distingue uno, dos, pocos, muchos).
- `hreflang` (`es`, `en`, `ar`) + `x-default` en cada página; las tres versiones de cada página se enlazan entre sí.
- **Artículos**: el original es español; las traducciones a inglés y árabe son automáticas y revisadas por bloques. Cada traducción es una página propia con `canonical` a sí misma, `hreflang` a las otras dos y el **aviso de traducción** bajo la entradilla (con enlace al original). Las letras de Carnaval, los tuits y las citas que se quedan en español llevan `lang="es"` (y `dir="ltr"` dentro del árabe). El `alt` de la portada va por idioma.
- **Derecha a izquierda**: todo el CSS con propiedades lógicas; lo fijo a un borde (botón de color, tarjeta de cookies, raíl de secciones, raíl de progreso) cambia de lado con `dir=rtl`; la barra de lectura se llena desde la derecha; las flechas giran; sin `letter-spacing`, mayúsculas ni cursiva en árabe; el nombre latino del cartel se queda de izquierda a derecha; cifras latinas en las fechas.
- Las rutas de cada idioma se generan desde las mismas plantillas con `getStaticPaths` por idioma (sin duplicar archivos `.astro`: un `[...lang]` opcional o un helper que envuelve cada página).
- **El Cassette** (`data/site.json`, `data/projects.json`) solo tiene es/en y su voz: en Astro el contenido se copia a sus propias colecciones para que los cambios del árabe o de Trama no obliguen a regenerar audios (regla de CLAUDE.md).

---

## 7. Fases

Cada fase termina con algo **que se puede abrir en el navegador y commitear**. Los criterios de «hecho» son comprobables.

### Fase 0 · Decisiones e inventario (½ día)
- Cerrar las decisiones D1–D11 (§8) con recomendación por defecto si no hay respuesta.
- Inventario completo de soynando.com vía su API REST: posts, **pages**, categorías, etiquetas, medios, comentarios (si los hay) y la estructura de URLs actual → `tools/wp-inventory.json`.
- Requisito: [plan-maqueta.md](plan-maqueta.md) terminado (su §7). Congelar Trama: tag `checkpoint-trama-maqueta` en `proto/home` como referencia visual.
- Crear la rama de trabajo: `git switch -c feature/astro checkpoint-trama-maqueta`. Desde aquí, todo commit del plan va a `feature/astro`.
- Capturas de referencia de la maqueta (Playwright, 3 anchuras × páginas clave × 3 modos × 3 idiomas; el árabe en RTL) para comparar después.
- Comprobar quién gestiona el DNS de **nandomunoz.com** y de **soynando.com** (H1) y si nandomunoz.com ya está registrado.

**Hecho:** lista de URLs antiguas con su destino nuevo; decisiones anotadas en este documento.

### Fase 1 · Andamiaje (½ día)
> **Estado (2026-11-17): hecha.** Decidido con el dueño: el proyecto vive en la subcarpeta `astro/` de `feature/astro` (no en la raíz: así no choca con `src/`, `build.mjs` ni el workflow del Cassette); la estructura del §4 cuelga de `astro/`. Astro fijado en **7.4.1**, la última que acepta el Node 22.22.1 de esta máquina (7.4.2+ pide ≥ 22.23.4). Workflow `.github/workflows/astro-build.yml` (solo build, sin desplegar). El tag `checkpoint-trama-maqueta` **no** existe: la rama salió de `f65064e`.

- En la rama `feature/astro`: proyecto Astro mínimo (`npm create astro@latest -- --template minimal`), TypeScript en modo `strict` solo para tipos (sin compilación extra).
- `astro.config.mjs`: `site: 'https://nandomunoz.com'`, `output: 'static'`, `trailingSlash: 'always'`, i18n (es, en, ar), `build.format: 'directory'`, `prefetch: false` (usaremos Speculation Rules).
- Fuentes a `public/fonts/` con `@font-face` + `<link rel="preload">` de Archivo y Doto (Playfair Display solo en la home; la árabe solo en `/ar/`).
- LUZ cargado (tokens + core) y `luz-theme-trama.css` vacío.
- `Base.astro` con `<html lang dir>` por idioma y `<head>` completo (charset, viewport, `color-scheme` y `theme-color` según el modo, la línea en línea que pone `data-mode` antes de pintar: oscuro salvo elección guardada, contraste alto si el sistema lo pide), enlace «Saltar al contenido».
- GitHub Action de build (sin desplegar aún).

- **Accesibilidad** (informe, §12): hallazgos 1 (HTML completo desde el build, `Base.astro` con «Saltar al contenido»: ya contemplado)

**Hecho:** `npm run build` genera `dist/` con una página vacía en `/`, `/en/` y `/ar/` (esta con `dir="rtl"`), 0 KB de JS.

### Fase 2 · Sistema visual: Trama como tema LUZ (1–2 días)
> **Estado (2026-11-17): hecha en lo esencial.** `astro/src/styles/luz-theme-trama.css` define el tema `trama` (`data-theme` + `data-mode`) con **todos** los tokens semánticos de LUZ en los tres modos, la ruta sin JS (`:has` del radio marcado y `prefers-contrast: more`) y los tokens propios de Trama (`--faint`, `--gloss`, `--prose`, `--edge*`, `--rule`, `--dot-*`, `--sink-*`, `--accent-fill`/`--on-accent`). `luz-tokens check-contrast` pasa: **1.425 pares en 7 modos**. Hallazgo: `--luz-text-on-fill` de LUZ es un solo color para el relleno de marca, el de peligro y las miniaturas de vídeo, así que el relleno de marca es un verde oscuro con texto blanco (`--luz-brand-fill` #16853f) y el verde brillante de la maqueta pasa a `--accent-fill` con `--on-accent`. Alias cortos (`--bg`, `--ink`, `--mute`, `--matrix`…) en `astro/src/styles/base.css`; capas `reset, luz, trama`; CSS de `@luz-ds/core/base.css` (17 KB); tipografía, trazos punteados, viñetas de punto, citas con columna de puntos, tablas, código y foco, con propiedades lógicas. Página de revisión en `/estilo/` (la carpeta `_estilo` no sirve: Astro ignora lo que empieza por `_`), en es, en y ar, con `?mode=light|high-contrast|dark`. **Pendiente de la fase:** estado `aria-current` visible sin color (se hace con el menú, Fase 4), prueba con `forced-colors` real y axe (Fase 10), y `luz-check` sobre el HTML.

- Traducir la tabla de color de DESIGN.md §2 (los tres modos) a tokens semánticos LUZ (`--luz-surface-page: #292929`, `--luz-text-primary: #f4f2ee`, `--luz-brand-fill: #22c55e`…) y alias cortos (`--bg`, `--ink`, `--mute`, `--faint-text`, `--matrix`, `--on-matrix`, `--matrix-on-ink`, `--prose`, `--dot-*`) para que el CSS de la maqueta funcione sin reescribirlo. **El acento es el verde** (`--matrix`); los nombres heredados `--blaze*` y `--blaze-lift` **no se portan** (se renombran a `--accent*` si el dueño confirma el verde, DESIGN.md §15).
- Tipografía (§3): escala fluida con `clamp()`, Archivo con eje `wdth`, Doto, Chakra Petch; `text-wrap: balance`. Con `:lang(ar)`: fuente árabe, sin `letter-spacing`, mayúsculas ni cursiva.
- Trazos (§4): separadores y subrayados punteados, viñetas de punto, foco `3px dotted`.
- **Modos de color**: la maqueta ya tiene oscuro, claro y contraste alto con el `<luz-theme-mode>` de LUZ (botón fijo abajo a la derecha, sin «Auto»; DESIGN.md §2 y `shared/theme.js`). En Astro, que el tema LUZ de Trama defina los tres modos con los tokens semánticos (`data-mode` de LUZ), reutilice el script de arranque de una línea (oscuro por defecto, contraste alto si el sistema lo pide) y revise con `luz-check` los pares de color de claro y contraste alto además de los del oscuro. La elección se guarda en `localStorage` (`luz-theme`) solo al pulsar, y la política de cookies lo dice.
- Composición (§7): `--gut`, cortes 48/64/90em (y los menores 30em, 40em y el contenedor de 34rem), rejilla de 12 columnas, `@layer` (luz, base, layout, components, utilities). **Todo con propiedades lógicas** para que el árabe salga sin una hoja aparte.
- Comprobar que el HTML sin clases (p, listas, tablas, citas, código, figure) ya sale con el aspecto de Trama: eso es lo que verán los artículos.
- Página `/estilo/` (no indexada, fuera del sitemap; Astro ignora las carpetas con `_`) con todos los elementos para revisar de un vistazo.

- **Accesibilidad** (informe, §12): hallazgos 2, 3, 5, 6, 25, 31 (tokens `--luz-text-muted` ≥ #939089, acento como texto #ff5c6f, `--luz-input-border` ≥ 3:1, estilo de `[aria-current]`, bloque `forced-colors`, `pre` y formularios). **El tema tiene que definir todos los tokens semánticos que usa LUZ** (`surface-hover`, `surface-strong`, `surface-pressed`, `input-bg`, `color-code`…): con el borrador mínimo, `luz-check` bloquea 200 pares porque esos tokens se quedan con los valores claros por defecto, y el aviso de cookies de LUZ los usa.

**Hecho:** la página de estilo se parece a un artículo de la maqueta sin una línea de JS, en los tres modos y en `/ar/_estilo/` (RTL).

> **Cierre de la fase (2026-11-18):** los tres pendientes del estado de arriba están hechos: `aria-current` sin color (Fase 4), `forced-colors` real y axe (Fase 10) y `luz-check` (`@luz-ds/check` 0.3.2, `luz-check src --ext .astro --theme src/styles/luz-theme-trama.css`): **0 bloqueos** y 442 avisos, casi todos medidas y colores literales (Trama tiene su propia escala de espaciado, a propósito); los de «token desconocido» son `--luz-consent-h`, que fija el propio aviso de cookies de LUZ, y `--luz-masthead-h`, que lleva valor de respaldo.

### Fase 3 · Colecciones de contenido (1 día)
> **Estado (2026-11-17): hecha.** `astro/tools/migrate-content.mjs` (re-ejecutable) lee `data/` y `maqueta/shared/` y escribe las colecciones en `astro/src/content/`: `site`, `projects` (15, 13 visibles, con `order`, `hidden`, `featured`, kanji con su significado en es/en/ar, captura y tono en `src/assets/projects/`), `categories`, `tags` y `posts` (11 × 3 idiomas: `index.md` es el original, `en.md` y `ar.md` las traducciones, con la portada y su `cover.tone.webp` al lado). Esquema Zod en `src/content.config.ts` (`alt` de portada obligatorio, `translated`, `original`). `tools/verify-content.mjs` comprueba que los 33 archivos se renderizan con el mismo texto, enlaces, énfasis, saltos, encabezados e imágenes que los bloques de origen (`npm run verify:content`). `src/lib/reading.js` calcula palabras y minutos (con `node:test`).
> Decisiones y hallazgos de la migración:
> - **GFM y puntuación inteligente, desactivados** en `astro.config.mjs` (Astro 7 usa el procesador Sätteri): GFM convertía en enlace el texto que ya era una URL y dejaba un `<a>` dentro de otro; la puntuación inteligente cambiaría las comillas y los guiones. Los acentos graves sueltos del texto se escapan (abrían un trozo de código).
> - **Bloques especiales como HTML en línea**, sin MDX: `figure.pull`, `figure.video` con `<yt-facade>`, `figure.tweet`, `figure.embed`, `figure.table` (con `role="region"` y nombre), `<luz-timeline>` y `figure.fig` con `<picture>`.
> - **Imágenes de dentro de los artículos**: el HTML en Markdown no pasa por `astro:assets`, así que se quedan como `<picture>` con sus `avif`/`webp` ya hechos (`maqueta/tools/soynando-images.cjs`) en `public/img/blog/posts/`. Las **portadas** sí van por `image()` del esquema (el `jpg` original; Astro genera el resto en la Fase 8).
> - **`alt` de tres portadas** que llegaban vacías (las dos de «Introducción a la IA», que son el grabado del Turco mecánico, y Los Sumisos): redactados en es, en y ar en el script. Siguen abiertos los seis `alt=""` de imágenes dentro de artículos (F20) y el de la portada de Margaret Hamilton, que es un crédito.
> - **Sin arreglar a propósito** (son contenido, decide el dueño): las etiquetas erróneas de 6 de 11 artículos, los dos artículos duplicados de «Introducción a la IA» y el campo `original` (la dirección de WordPress), que solo sirve para las redirecciones.
> - **Pendiente** de la fase: la versión `site` con el lema en árabe y el aviso de traducción son textos de interfaz (van a `src/i18n/ui.ts` con la Fase 4); resaltado de código de los artículos (Shiki en el build o el de LUZ: se decide en la Fase 8).

- `projects`: copia propia de `data/projects.json` (el original lo sigue leyendo el Cassette) con el árabe de `shared/content-ar.json` y el kanji de `data/kanjis-repos.json` (carácter, significado, jukugo); esquema con `id`, `name`, `year`, `tech[]`, `demo`, `repo`, `es`/`en`/`ar` {kicker, body[], quote, caption}, `kanji`, `shot` (captura y `tone`), orden fijo, `featured` (LUZ, ¿Quién canta hoy?, Street Cai, IKAY, Toolbar AEM) y `hidden` (hoy `coac-analisis` e `illo-loader`, que Trama no muestra). 13 visibles, de 2019 a 2026. Enlaces a `github.com/nandomunoz`.
- `posts`: **migración definitiva** de los artículos a Markdown con `tools/wp-import.mjs`, **un archivo por idioma** (`index.md` es el original; `en.md` y `ar.md`, las traducciones de `blog.json`, con `translated: true`). Hay dos caminos: volver a convertir desde WordPress (Node no trae `DOMParser`, así que haría falta Chromium headless como hoy) o convertir desde `blog.json`, que ya está limpio. **Recomendado: desde `blog.json`**, sin dependencias y una sola vez.
  - Frontmatter: `title`, `excerpt`, `date`, `category`, `tags`, `lang`, `translated`, `original` (URL de WP, solo para redirecciones y `guid`), `cover` (con `alt` por idioma y `credit`).
  - **`cover` es la imagen destacada de WordPress**, ya descargada en la maqueta (`maqueta/img/blog/`, `cover: { w, h, alt, src }` en `blog.json`, hecho por `maqueta/tools/soynando-covers.cjs`). Se pasa a `image()` del esquema con su `alt` obligatorio. Revisar los tres posts que llegan sin `alt` (las dos de IA y Los Sumisos) y el de Margaret Hamilton, cuyo `alt` es un crédito.
  - Bloques especiales como HTML en línea dentro del Markdown: `<figure class="pull">`, `<yt-facade video="…">`, `<blockquote class="tweet">`, `<ol class="timeline">`, `<figure class="embed">`. Sin MDX.
  - Imágenes descargadas de `wp-content/uploads` junto al post y servidas con `astro:assets` (WebP/AVIF, `srcset`, tamaños).
- `categories`, `tags`: JSON con nombre/desc es/en/ar y `kind` (patrón de trama).
- `site`: bio, kicker, deck, redes, lema (de `data/site.json` + árabe; RSS apunta al nuevo feed, y el texto del dominio es `nandomunoz.com`, como ya hace `shared/content.js`). `baseUrl` y canonical pasan de `nandomunoz.github.io` a `nandomunoz.com`.
- Tiempo de lectura y nº de palabras calculados en build (remark plugin propio de 10 líneas o en la plantilla), por idioma.
- Densidad de los bloques por año calculada por rango en build (ya hay 2019 y 2020, fuera de la escala 2023–2026 de DESIGN.md §6; F5).

- **Accesibilidad** (informe, §12): hallazgos 1, 8, 12, 13, 24, 28 (`lang` y `title` de vídeo obligatorios, `alt` revisados, enlaces externos)

**Hecho:** `astro check` sin errores; un post con todos los tipos de bloque se renderiza sin estilos rotos en es, en y ar.

### Fase 4 · Chrome compartido (1 día)
> **Estado (2026-11-17): hecha, salvo la tarjeta de cookies.** `Base.astro` monta `Masthead`, `Nav`, `Footer`, el raíl de progreso y dos scripts (`chrome.js`, `theme.js`: 7 KB en total, con el `<luz-theme-mode>` de LUZ). Rutas por idioma y direcciones de cada página en `src/i18n/ui.ts` (`pathFor`); el selector de idioma y el pie enlazan a **la misma página** en los otros dos idiomas, y con JS conservan el `#fragmento`. Selector de idioma = botón + `popover` (se abre sin JS; el script lo coloca y añade flechas). **En móvil el menú es la píldora desde el primer pintado, solo con CSS**; desde 48em va en línea y se ancla con una View Transition (píldora en tableta, raíl vertical en escritorio, al otro lado en RTL); `aria-current` por sección con `IntersectionObserver`; en páginas interiores, anclado desde el principio (`class="docked"` en `<html>`). Raíl de progreso con `animation-timeline: scroll()`. Botón de color redondo con la revelación circular; `@view-transition` entre documentos. Probado en Chromium: 15 comprobaciones (píldora fija, sin desbordes, ciclo de modos, `localStorage` solo tras el primer clic, anclado y raíl, sección actual, selector, `#fragmento`, árabe en RTL, sin JS) y **axe-core 4.10.3 sin fallos graves ni críticos** (4 páginas × 375/1280 × 3 modos).
> Hallazgos: `li + li` de LUZ (margen) empujaba 8 px las entradas del menú en la píldora (anulado); el axe 3.5 que hay en la máquina no entiende `color-mix()` y da falsos positivos de contraste, hay que usar el 4.10. **Pendiente de la fase:** la tarjeta de cookies de LUZ (`consent.js`) y la compuerta del vídeo, que van con las políticas y el blog (Fases 8 y 9); mientras tanto los botones «Ajustes de cookies» del pie están `hidden` y la frase de la línea final queda cortada sin JS (hay que reescribirla para que se lea sin el botón); Speculation Rules; `scroll-padding` con `ResizeObserver` cuando exista la tarjeta; `<pre>` y tablas con scroll enfocables y con nombre en los artículos (hallazgo 5, Fase 8).

- `Masthead.astro`: marca (monograma + nombre), selector de idioma desplegable (botón con el idioma de la página y un chevrón de cinco puntos; `popover` en la capa superior con los tres idiomas por su nombre, cada uno con su `lang`; Esc y clic fuera cierran, flechas para moverse, se abre hacia arriba si no cabe). Sin JS, el `popover` declarativo funciona igual.
- `Nav.astro`: secciones numeradas 01–04 en HTML. **En móvil (< 48em) es la píldora inferior desde el primer pintado** (solo CSS; arriba quedan logo e idioma). Desde 48em, en línea sobre la portada; `nav.js` la ancla al hacer scroll con `startViewTransition` (píldora en tableta, raíl vertical en escritorio, al lado contrario en RTL), `aria-current` por sección con `IntersectionObserver`. En páginas interiores, anclado desde el principio (solo CSS).
- `Footer.astro`: el pie de la maqueta en HTML estático: grupos de secciones, redes (GitHub, LinkedIn, X, RSS), «Sobre esta web» e «Idioma» (los tres idiomas como enlaces), de dos en dos desde 40em y en fila desde 64em; la línea final es la letra pequeña: © salvo lo acreditado, hecho con LUZ (MIT), política de cookies y el botón «Ajustes de cookies» (`hidden` hasta que corra su script). **El lema ya no va en el pie** (solo en el cartel).
- Raíl de progreso (escritorio) con `animation-timeline: scroll()`.
- Botón de modo de color redondo y flotante (`<luz-theme-mode>`), único control del modo, sobre la píldora en móvil y al otro lado en RTL.
- Tarjeta de cookies de LUZ en todas las páginas (decisión K1 del dueño) + compuerta en cada vídeo.
- View Transitions entre documentos (`@view-transition`) para que masthead y nav no «parpadeen» al navegar.

- **Accesibilidad** (informe, §12): hallazgos 1, 3, 14, 16, 18, 26, 29, 30 (menú anclado con `scroll-padding`, `aria-current` correcto, aviso de cookies)

**Hecho:** navegar entre dos páginas vacías con teclado, sin JS y con JS; el menú hace lo mismo que en la maqueta.

### Fase 5 · Motor de puntos como mejora progresiva (1–2 días)
> **Estado (2026-11-17): hecha, a falta de medir en un móvil real y en Safari.** Portados a `astro/src/scripts/` sin cambios de comportamiento: `dots.js` (motor), `kanji-cells.js` (kanjis rasterizados), `green.js`, `rain.js` + `gatos.js` (lluvia: el escritorio entra por `?url` de Vite, `src/assets/escritorio.jpg`) y `poster.js` (se monta con la portada en la Fase 6). Cambios: los tokens `--dot-blaze` → `--dot-accent` (y `PAL.blaze` → `PAL.accent`), colores de respaldo verdes, Playfair Display con su `@font-face`. **Montaje** en `blocks.js`: `<canvas data-dots='{"kind":2,"density":.52,"rows":14,"seed":7,"label":"光","tone":"….webp"}' aria-hidden="true">` con los datos ya calculados; el script elige la celda (7, 8 o 9 px), ensambla el bloque con el scroll y lo disuelve al salir, duerme fuera de pantalla (`IntersectionObserver`), empuja con el puntero, redibuja al cambiar de modo (`trama:mode`, de `theme.js`) y con movimiento reducido solo dibuja. **Sin JS o sin canvas**, el bloque enseña un campo de puntos de CSS (`blocks.css`). Página de revisión `/estilo/puntos/` (patrones, kanji con captura, bloque enmarcado y lluvia). El raíl de progreso tiene respaldo con `--p` donde no hay `animation-timeline` (Firefox).
> **Perfil de la lluvia (2026-11-18):** con la CPU a 4× en Chromium *headless* (render por software), `RainField.frame` concentra ~65 % del tiempo del hilo y hay parones de ~1 s hacia los 2 y 3 s; lo caro es la composición del campo entero (limpiar, velo, hoja de lluvia, máscara) en cada fotograma, que una GPU hace casi gratis, así que **la cifra no vale para un móvil real**. Mejora segura aplicada: sin fundido de máscaras (el caso normal) ya no se rehace el lienzo de mezcla (3 pintados a tamaño completo menos por fotograma, mismo resultado). Sigue pendiente medir en un teléfono modesto y en Safari; el modo ligero táctil (`f.lite`) ya existe y el siguiente paso, si hiciera falta, es una rejilla más gruesa o `OffscreenCanvas`.
> Medido en Chromium: 9 de 9 bloques montados y pintados; la lluvia se mueve ~5 s y se queda en una imagen que no cambia, y el puntero la despierta; sin errores en consola. **Coste de `RainField.draw` con la CPU a 4×**: escritorio, mediana 5,1 ms y p95 24 ms; móvil con puntero táctil (DPR 3), mediana 4,6 ms y p95 11,6 ms; el presupuesto era 8 ms por fotograma. La mediana cumple y los picos (¿el cambio de máscara o el escaneo?) están por investigar; sigue pendiente un teléfono real y Safari. **Pendiente de la fase:** el bucle de miniaturas (`coverLoop`, de `blog/parts.js`) va con el blog (Fase 8), y la pausa por `visibilitychange` de la lluvia al montarla en la home (Fase 6).

- Portar `maqueta/dots.js` (con `kanji-cells.js` y `green.js`) y `maqueta/rain.js` (con `gatos.js` y `poster.js`) a `src/scripts/` sin cambios de comportamiento; separar en módulos solo si reduce lo que carga cada página (la lluvia y el cartel solo en home y 404; los kanjis solo donde hay proyectos).
- Patrón de montaje: el HTML lleva `<canvas data-dots='{"kind":2,"density":.52,"n":3}' aria-hidden="true">` con **los datos ya calculados en build** (densidad por año, altura por longitud, patrón por id/categoría). El JS solo lee y dibuja.
- Pausar animaciones fuera de pantalla (`IntersectionObserver`) y con la pestaña oculta (`visibilitychange`); conservar la regla de los 5 s (`settle()`, bucles de un ciclo) que ya cumple la maqueta.
- `prefers-reduced-motion`: puntos ya colocados, sin bucle.
- Sin JS o si falla el canvas: los bloques muestran un fondo de puntos en CSS (`radial-gradient`) para no dejar huecos.
- Medir la lluvia de la portada y la 404 en un móvil modesto y en Safari (pendiente de DESIGN.md §15; tiene modo ligero para táctil, sin medir en un teléfono real): objetivo < 8 ms por fotograma; si no llega, rejilla más gruesa o `OffscreenCanvas` en un worker (API estándar, sin dependencias).

- **Accesibilidad** (informe, §12): hallazgos 4, 7, 19 (canvas que no ensanchan la rejilla, bucle que se para, colores del sistema)

**Hecho:** Lighthouse móvil de la home ≥ 90 en rendimiento con el hero activo; sin JS la home es legible y completa.

> **Fase 5 cerrada por el dueño (2026-11-18):** se omite la medición en un móvil real y en Safari. Queda sin medir; si algún día va justa en un teléfono modesto, el regulador de calidad ya baja a 30 fps y a 1× por sí solo.

### Fase 6 · Home (1–2 días)
> **Estado (2026-11-18): hecha (el panel que vuela los puntos, al final).** `/`, `/en/` y `/ar/` con la portada (`<h1>` con el nombre, el lema ya en el HTML y tecleado por `poster.js` sobre la lluvia, `RainField` con máscara `cycle`, pausa con `visibilitychange` y fuera de pantalla), 01 Bio (tres columnas de puntos, «mis artículos» y «mis proyectos» como enlaces), 02 Proyectos (los 5 destacados con kanji y semitono, leyenda por año, **tarjetas que son enlaces** a `/proyectos/<id>/`; la inclinación con el puntero y el verde al pasar), 03 Blog (las tres últimas filas), 04 Escríbeme (campo de puntos y redes). Todo en `src/components/home/` + `src/lib/home.js` (datos calculados en build: densidad por año, altura por longitud) + `src/scripts/home.js` + `src/styles/home.css`; `blocks.js` entiende `narrow` (opciones distintas bajo 64em). Los títulos de sección se resuelven de ruido a puntos con el texto para lectores. Sin JS la portada es legible y los bloques enseñan el campo de puntos de CSS. Comprobado: axe-core 4.10.3 en `/`, `/en/`, `/ar/` × 375/1280 × 3 modos, 0 graves ni críticos, sin desbordes; 18 bloques montados; sin errores en consola. **Pendiente:** panel con `<dialog>` y `fly()` (Fase 7), capturas de comparación con la maqueta (Fase 10), Lighthouse móvil.
- Portada: `<h1>` real con el nombre + el cartel sobre la lluvia (`RainField` con la máscara `cycle`: nombre en Playfair Display → gatos → foto; escaneo circular al clic); el lema escrito a máquina (`poster.js`) con el texto ya en el HTML; kicker y deck escalonados (CSS). En árabe, el lema palabra a palabra y el nombre latino LTR.
- 01 Bio: tres columnas de trama + texto (de `site.json`) con enlaces a artículos y proyectos.
- 02 Proyectos: los 5 destacados con el ciclo de 4 posiciones, cada bloque con su captura en semitono y su kanji en puntos (verde bajo el puntero), leyenda «Cómo leer los bloques», «Todos los proyectos». **Las tarjetas son enlaces** a `/proyectos/<id>/` (informe UX).
- Abrir proyecto: el enlace va a `/proyectos/<id>/` (funciona sin JS); con JS, `fly.js` intercepta, vuela los puntos y abre un `<dialog>` con el contenido **ya presente en el HTML** (`<template>` por proyecto) o pedido con `fetch` a la página del proyecto. ←/→ pasan de proyecto, Esc cierra, foco de vuelta. Actualiza la URL con `history.pushState` para que sea compartible.
- 03 Blog: tres últimos artículos.
- 04 Escríbeme: campo de puntos + redes.

- **Accesibilidad** (informe, §12): hallazgos 1, 7, 15, 17, 18

**Hecho:** comparación visual con las capturas de la Fase 0 sin diferencias de diseño relevantes (3 anchuras).

### Fase 7 · Proyectos (1 día)
> **Estado (2026-11-18): hecha.** 42 páginas nuevas (133 en total): `/proyectos/`, `/en/projects/`, `/ar/projects/` y la ficha de cada uno de los 13 visibles en los tres idiomas. **Índice:** los 13 por año (el año en Doto), cada fila con su pantalla de puntos (semitono de la captura), año y tecnologías, nombre y entradilla; leyenda de lectura; **filtro por tecnología (decisión D6: `?tech=<slug>`, solo con JS)**: los chips son enlaces que con JS filtran en sitio (`hidden`, años vacíos fuera, recuento, `pushState`, Atrás y enlace directo funcionan) y sin JS no se muestran y se ve la lista entera. **Ficha:** como un artículo (migas, nombre, entradilla, año y tecnologías que enlazan al filtro, demo y código, la pantalla de puntos con su kanji, texto, captura en `<Picture>`, anterior/siguiente, «Más proyectos» por tecnologías compartidas) y JSON-LD `SoftwareSourceCode`. Código en `src/components/projects/`, `src/lib/projects.js`, `src/scripts/projects.js`, `src/styles/projects.css`; la leyenda pasó a `blocks.css` (la usan la home y el índice). Los nombres de proyecto llevan `dir="ltr"` (son texto latino en la página árabe). Comprobado: axe-core 4.10.3 en 6 páginas × 375/1280 × claro/oscuro, 0 graves ni críticos y sin desbordes; el comprobador de enlaces solo encuentra rotos los de privacidad, cookies y créditos (Fase 9) y `/en|ar/estilo/puntos/`. **Pendiente:** el `<dialog>` con `fly()` que abre la ficha desde la home sin salir de ella (mejora; hoy las tarjetas navegan a la ficha), páginas por tecnología si se quisiera filtro sin JS.

> **Panel (2026-11-18):** en la home, un clic en una tarjeta abre el proyecto en un `<dialog>` modal (`src/scripts/panel.js`, `panel.css`): los puntos del bloque vuelan a un campo en un lado (42 % en escritorio, 34 % arriba en móvil, al otro lado en árabe) y la hoja sube a su lado; ←/→ pasan de proyecto, Esc o «Cerrar» los devuelven al bloque, el foco vuelve a la tarjeta, la URL pasa a ser la del proyecto (`/proyectos/<id>/`, compartible) y Atrás lo cierra. El contenido va en la propia página (`#panel-data`, sin peticiones); un clic con Ctrl/Cmd/Mayús sigue el enlace; sin JS, la tarjeta navega a la ficha. La auditoría lo abre en es/en/ar × 375/1280 (axe con el diálogo abierto, foco dentro, URL, Esc y foco de vuelta).
- `/proyectos/`: los 13 visibles agrupados por año (2019–2026); filtro por tecnología como **enlaces** `?tech=` que con JS filtran en el sitio (`hidden` sobre las filas) y sin JS… muestran todo (o, si se quiere sin JS, páginas estáticas `/proyectos/tech/<tech>/`; decisión D6).
- `/proyectos/<id>/`: nº, año, tecnologías (enlazan al filtro), demo y código, bloque grande, texto, anterior/siguiente, «Más proyectos» por tecnología compartida (calculado en build).
- JSON-LD `SoftwareSourceCode` por proyecto.

- **Accesibilidad** (informe, §12): hallazgos 3, 14, 15, 27

**Hecho:** las 13 páginas en es, en y ar, enlazadas entre sí y en el sitemap (los proyectos `hidden` no generan página).

### Fase 8 · Blog (2–3 días)
> **Estado (2026-11-18, cierre): hecha.** Tras el primer tramo, se añadió: **código** (Shiki desactivado; el resaltador de LUZ —HTML, CSS, JS, JSON y shell— y un botón de copiar con aviso, solo en los artículos que tienen un bloque; el lenguaje se adivina porque los artículos no lo dicen; cada región con su nombre), **ancla `#`** en cada h2 (visible al pasar o enfocar, siempre tenue en táctil, con nombre accesible), **ciclo de portadas** (`src/scripts/cover-loop.js`: el destacado y las miniaturas hacen *un* ciclo al verse —puntos → blanco y negro → color → blanco y negro; las filas, solo puntos ↔ blanco y negro, escalonadas— y se quedan quietos; el puntero o el foco en el título lo repiten; con movimiento reducido quedan en blanco y negro; < 5 s), **títulos en puntos** en blog, proyectos, políticas y home (`src/scripts/titles.js`, solo los de hasta 24 letras), **compuerta de YouTube** y **JSON-LD/og:image/RSS** (Fase 9). Los `hreflang` ya solo enlazan versiones que existen: los 11 artículos existen en los tres idiomas. La auditoría cazó que el canvas del destacado ensanchaba la rejilla en móvil (arreglado) y que el botón de copiar tenía el gris del navegador.
> **Estado (2026-11-17): primer tramo hecho — lista, artículo, categorías y etiquetas en los tres idiomas.** 91 páginas: `/blog/`, `/blog/2/`, `/blog/3/` (cinco por página, el último artículo destacado, el resto por años con el año en Doto), `/blog/<slug>/` (11 artículos × es, en, ar; las traducciones con su aviso y su propio canonical/hreflang), `/blog/categoria/` y `/blog/categoria/<id>/` (en y ar: `category`), `/blog/etiqueta/` y `/blog/etiqueta/<id>/` (`tag`; con menos de 2 artículos, `noindex`). El código vive en `astro/src/components/blog/` (`BlogIndex`, `PostPage`, `PostList`, `PostRow`, `Featured`, `Pager`, `Chips`, `BlogHead`…), `src/lib/blog.js` (datos: año, lectura, categoría, etiquetas, relacionados, páginas de cinco) y `src/i18n/blog.js` (las cadenas del blog en los tres idiomas, con los plurales del árabe); las páginas de cada idioma son archivos de 5 líneas. CSS portado de `maqueta/blog/blog.css` (`src/styles/blog.css`, sin la 404 ni el menú). Portada de la lista y del artículo con `<Picture>` de `astro:assets` (AVIF/WebP/JPG, `alt`, `srcset`, `fetchpriority="high"` en la del artículo y en el destacado), el artículo con índice (`<details>` abierto desde 64em, con la sección actual), «Compartir artículo» (hoja del sistema con `navigator.share`, o un `<dialog>` con «Copiar enlace» con `role="status"` y los sitios de siempre), anterior/siguiente, relacionados, barra de progreso, enlaces externos que avisan de que abren otra pestaña, bloques de código y tablas con scroll enfocables, `<luz-timeline>` de LUZ cargado solo en los artículos que lo llevan.
> Hallazgos del tramo: (1) un elemento propio al principio de línea (`<luz-timeline>`) solo es un bloque HTML en Markdown si su etiqueta de apertura va sola en la línea; si no, `<p>` lo envuelve y el `<ol>` queda fuera; (2) las viñetas de punto globales de mi CSS base se colaban en chips, filas y menús: ahora solo en `.guide` y `.prose`; (3) LUZ pone un borde a `blockquote`; (4) el ancla `#webapi` de WordPress apuntaba a un encabezado cuyo slug ahora es otro: la migración escribe `{#webapi}` (Sätteri con `headingAttributes`); (5) en árabe, una tabla que hace scroll dentro de su caja ensanchaba el documento hasta que la caja lleva `contain: paint`; y la píldora del menú se descentraba en RTL por contar el 50 % desde la derecha (ahora `left: 50%`); (6) `tools/check-links.mjs` (`npm run check:links`) comprueba los enlaces, imágenes y anclas internas de `dist/` (ignora el código).
> **Pendiente de la fase (siguientes tramos):** el ciclo de las miniaturas (`coverLoop`: puntos → blanco y negro, un ciclo y quieto; hoy están en blanco y negro fijo, con `.is-rest`) y el semitono bajo la imagen del destacado; los títulos que se descodifican en puntos; la pantalla de puntos de la portada del artículo ya está en CSS pero sin la regla de `Picture` fino; la compuerta del vídeo de YouTube con consentimiento (hoy `<yt-facade>` es una tarjeta que enlaza a YouTube, sin cargar nada de Google) y la tarjeta de cookies; resaltado de código y botón de copiar; ancla `#` en los `h2`; JSON-LD (`BlogPosting`, `BreadcrumbList`), `og:image` y RSS (Fase 9); cabeceras `hreflang` solo entre las versiones que existen.
> Comprobado: **axe-core 4.10.3 sin fallos graves ni críticos en 84 páginas × 375/1280 px** (el blog en es, en y ar: lista, páginas 2 y 3, categorías, etiquetas y los 11 artículos) y sin desbordes horizontales; `tools/check-links.mjs`: 0 enlaces rotos salvo los de las páginas que aún no existen (proyectos, privacidad, cookies, créditos). Speculation Rules (precarga `moderate` de los enlaces internos) añadidas al `<head>` (cierra el pendiente de la Fase 4).

- `/blog/` con `paginate()` (5 por página), último artículo destacado, agrupado por año con el año fijo en Doto (`position: sticky`), filtros por categoría.
- `/blog/<slug>/` (y `/en/`, `/ar/`): migas, título, entradilla, **aviso de traducción** en en/ar (bajo la entradilla; en móvil, texto y enlace apilados), metadatos (fecha con `Intl`, lectura, nº; sin enlace al original de WordPress), portada: **la imagen destacada como `<picture>` real en el HTML estático** (`<Picture>` de `astro:assets`, AVIF/WebP/JPG, `alt` del idioma, `width`/`height`, `fetchpriority="high"`: es el LCP), en gris y oscurecida bajo la **pantalla de puntos** (`.cover-screen`, CSS) que se funde bajo el puntero (sin bucle; sin JS se ve igual), crédito debajo, índice fijo (escritorio) / `<details>` (móvil) generado de los h2 en build, «Compartir artículo» (`navigator.share` con `canShare`; si no hay o falla, un `<dialog>` con el enlace, «Copiar enlace» con estado anunciado y enlaces directos a redes y correo), etiquetas, autor, anterior/siguiente, relacionados (misma categoría/etiquetas, en build), barra de progreso (`animation-timeline: scroll()`).
- Piezas: `yt-facade` (custom element), tuits, tablas con scroll lateral, líneas de tiempo (el `<luz-timeline>` de `@luz-ds/catalog`, ya probado en la maqueta en horizontal y en vertical; en Astro, la colección lleva `layout` y `label` por bloque y el HTML sale ya con `ol.luz-timeline`), citas destacadas. El destacado del blog y las miniaturas de las filas hacen **un ciclo** al verse por primera vez (destacado: puntos → blanco y negro → color → blanco y negro; miniaturas: solo puntos ↔ blanco y negro, < 2 s) y se quedan quietas en blanco y negro; el ratón o el foco repiten el ciclo; con `prefers-reduced-motion`, quietas (D-7, ya hecho en la maqueta).
- Categorías y etiquetas: índices + páginas paginadas; nube de etiquetas con tamaño por uso (CSS custom property calculada en build).
- JSON-LD `BlogPosting` (con `image`: la imagen destacada, en 16:9, 4:3 y 1:1 como pide Google para resultados enriquecidos), `BreadcrumbList`.

- **Accesibilidad** (informe, §12): hallazgos 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 18, 21, 22, 27, 28, 32

**Hecho:** los 11 artículos con todas sus piezas en es, en y ar, el español comparado uno a uno con soynando.com (ningún contenido perdido: textos, enlaces, imágenes, vídeos) y las traducciones con la misma estructura de bloques.

### Fase 9 · 404, búsqueda, SEO y feeds (1–2 días)
> **Estado (2026-11-18): hecha, con 3 cosas que solo puede cerrar el dueño.** 147 páginas. **Políticas y créditos** (`/privacidad/`, `/politica-de-cookies/`, `/creditos/` y `/en|ar/…`): HTML estático indexable, textos como datos en `src/i18n/legal/`, créditos de portadas calculados de los artículos. **SEO** (`Base.astro` + `src/lib/jsonld.ts`): Open Graph y Twitter (la `og:image` de un artículo es su portada recortada a 1200×630 con su `alt`, la de un proyecto su captura, el resto la portada de la home por idioma de `public/og/`, hecha con `tools/og-home.mjs`), `<link rel=alternate type=rss+xml>` por idioma, un `@graph` por página (`WebSite`+`ProfilePage`+`Person` en la home; `BlogPosting` con imágenes 16:9, 4:3 y 1:1, `BreadcrumbList` y `translationOfWork`/`workTranslation` en artículos; `SoftwareSourceCode` en proyectos), `sitemap.xml` (129 URL con alternates, ninguna ausente de `dist/`), `robots.txt` («citar sí, entrenar no»: `Content-Signal: ai-train=no`) y `rss.xml` en es/en/ar con la URL de WordPress como `guid` de los artículos en español. **404** (`/404.html`, `/en|ar/404/`): lluvia con la foto del escritorio, dirección fallida, buscador sobre `search.json` (8 KB por idioma, sin acentos), «¿Buscabas esto?» y últimos artículos; el 404 español manda `/en/…` y `/ar/…` al de su idioma con `?from=`. **Consentimiento:** `luz-cookie-consent` con su tarjeta en los tres idiomas y la **compuerta de YouTube** (`consent.js`, `video.js`): hasta el «sí» no se pide nada a Google (0 peticiones antes y tras «Rechazar», medido en Chromium); el bloque «Tu elección ahora» de la política la refleja. **Redirecciones** soynando.com → nandomunoz.com (`npm run redirects`): 17 entradas (los 11 artículos desde su `original`, políticas, feed, blog, `/category/` y `/tag/` por prefijo) en CSV de Cloudflare Bulk Redirects y en `.htaccess`, con el README de cómo aplicarlas.
> **Falta (del dueño):** (1) el **correo de contacto** de las políticas (`⟦…⟧`, 9 huecos; `npm run check:placeholders` falla hasta rellenarlos); (2) el **inventario de URLs de WordPress** (W-preguntas) para mapear una a una las categorías y etiquetas que cambiaron de slug; (3) las **verificaciones de Search Console y Bing** y el cambio de dirección, que dependen del dominio (Fase 11). Sin validador externo de datos estructurados desde aquí: pendiente el de Google al publicar.
- `404.astro`: la lluvia con la foto del escritorio recortada (`RainField`, máscara `image`, sin descargar las miniaturas ni la foto grande si no hace falta); la dirección fallida (`location.pathname`, en cliente); buscador sobre `search.json` (generado en build: título, extracto, url, tipo, idioma; ~10 KB) con filtrado vanilla normalizando acentos (`String.prototype.normalize('NFD')`); «¿Buscabas esto?» con la mejor coincidencia del slug; secciones y últimos artículos.
- `<head>`: title, description, canonical, hreflang, Open Graph/Twitter (imagen por página: reutilizar `tools/og-images.mjs` adaptado a Trama, decisión D7; **en los artículos, la `og:image` sale de su imagen destacada**, recortada a 1200×630, con `og:image:alt` = su `alt`), verificaciones de Search Console/Bing.
- JSON-LD: `WebSite`, `ProfilePage` + `Person` (como el site actual; `url` nandomunoz.com, `sameAs` con `github.com/nandomunoz`, LinkedIn, X y la antigua soynando.com), más los de §7/§8, con `inLanguage` por página y `translationOfWork` / `workTranslation` entre el original y sus traducciones.
- `sitemap.xml.ts` (con alternates de idioma), `robots.txt.ts`, `rss.xml.ts` (RSS 2.0 a mano, ~40 líneas) por idioma.
- Compatibilidad WordPress: la tabla de redirecciones **soynando.com → nandomunoz.com** del §5, generada desde `blog.json` y el inventario de la Fase 0 en el formato que pida D11 (reglas de Cloudflare, `.htaccess` o páginas `meta refresh`), y `<link rel="alternate" type="application/rss+xml">` por idioma en todas las páginas.
- Políticas y créditos como HTML estático en los tres idiomas, indexables (M3).

- **Accesibilidad** (informe, §12): hallazgos 1, 4, 6, 7, 8, 20, 23

**Hecho:** validador de datos estructurados sin errores; todas las URLs del inventario de la Fase 0 responden (200 o redirección a su nuevo sitio en nandomunoz.com).

### Fase 10 · Calidad: accesibilidad, rendimiento, pruebas (1–2 días)
> **Estado (2026-11-18): hecha en lo automatizable; falta lo que pide personas y aparatos reales.** `npm run audit` (`tools/audit.mjs`, Playwright 1.65.1 + axe-core 4.10.3 fijados) sobre `dist/`: axe a 375 y 1280 px con movimiento reducido en 42 páginas × es/en/ar (oscuro, claro y contraste alto en las clave) sin graves ni críticos; reflow a 320 px; todas las plantillas sin JS (un `<h1>`, texto y enlaces); **0 peticiones a Google/YouTube sin consentimiento y tras «Rechazar»** (y el reproductor sí abre tras un «sí»); recorrido con Tab a 375×667 con la tarjeta de cookies (ningún foco 100 % tapado, 2.4.11); espaciado de texto de 1.4.12 inyectado (sin recortes ni scroll lateral); colores forzados; CLS (móvil 0,06–0,08, escritorio ≤ 0,012) y LCP (< 200 ms sin limitar). `npm run budgets`: HTML+CSS 21–31 KB de 60; JS home 29 KB de 35, artículo 14 de 20, proyectos 20 de 35. `npm test` (15 pruebas `node:test`): paridad es/en/ar de cadenas, tarjeta, páginas legales, plurales del árabe, datos de la home, lectura; `check:links` (6 744 enlaces, 0 rotos), `verify:content` (33/33), `redirects`. CI (`astro-build.yml`) corre todo, incluida la auditoría. Hallazgos que arregló: la píldora del menú tapada por la tarjeta de cookies en la home móvil, el menú de la 404 con anclas de otra página, la portada que no crecía con el espaciado de texto del usuario, la tarjeta que tapaba el nombre en la primera visita, el lema en árabe desbordando a 1200 px y el menú que caía a una segunda fila (la maqueta lo centra en la línea del logo). Firefox (con `playwright-core` de `cole`): sin errores, 19 canvases montados, el revelado y el raíl de progreso funcionan sin `animation-timeline`.
> **Falta:** lector de pantalla (NVDA+Firefox, VoiceOver en macOS e iOS, TalkBack; Orca aquí), **Safari/WebKit** (WebKit de Playwright no abre páginas en esta máquina), un móvil real para los 5,1 ms/fotograma de la lluvia (p95 24 ms sin investigar), Lighthouse, el correo de contacto de la **declaración de accesibilidad** (ya escrita), CSP y cabeceras (dependen de D2) y las capturas de comparación con la maqueta archivadas (hoy comparadas a ojo en 3 anchuras: iguales salvo el menú, ya corregido).
- Accesibilidad (DESIGN.md §12): WCAG 2.2 AA, teclado completo, foco visible, `<dialog>` correcto, canvas `aria-hidden`, enlaces externos anunciados, `lang` por artículo. Revisión con lector de pantalla (Orca/VoiceOver) en home, proyecto y artículo.
- Rendimiento: presupuesto por página — HTML+CSS < 60 KB comprimido; JS < 20 KB en artículo, < 35 KB en home; LCP < 2 s en 4G; CLS ≈ 0 (canvas con tamaño reservado).
- Pruebas sin dependencias nuevas:
  - `node:test` para helpers (agrupado por año, relacionados, slugs, tiempo de lectura, RSS válido).
  - `tools/check-links.mjs`: recorre `dist/` y comprueba enlaces internos y anclas.
  - Playwright (ya disponible): capturas en 3 anchuras × 3 idiomas × 3 modos × páginas clave, comparación con las de la maqueta; prueba de navegación con JS desactivado.
- Safari y Firefox: comprobar los fallbacks de View Transitions entre documentos y `animation-timeline` (Firefox no lo soporta: debe verse bien igualmente).
- Hook `pre-commit` y CI: `astro check && astro build && node --test && node tools/check-links.mjs`.

- **Accesibilidad** (informe, §12): hallazgos 25 y la lista de comprobación del §8

#### Accesibilidad (WCAG 2.2 AA · EN 301 549 v3.2.1) — ver .ai/plan/informe-accesibilidad-maqueta.md
- [ ] Sin JS: todas las páginas (es/en/ar) tienen su contenido, `<h1>` y enlaces; Playwright con `javaScriptEnabled: false` en home, proyecto, artículo, categoría, etiqueta y 404
- [ ] axe-core 4.10.x (`wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`) a 375 y 1280 px, es, en y ar, con `reducedMotion: 'reduce'`: 0 `serious`/`critical`; también con el diálogo de proyecto, el índice, el diálogo de cookies y la tarjeta de cookies abiertos
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
- [ ] `lang`: cada fragmento en otro idioma lleva `lang` (y `dir` si cambia la dirección): letras y tuits en español dentro de las traducciones, el nombre latino en árabe, los nombres de idioma del selector
- [ ] RTL: en `/ar/`, nada fijo tapa contenido, flechas y raíles en su lado, foco y orden de tabulación coherentes con la lectura, reflow a 320 px; revisión con un lector de pantalla en árabe
- [ ] Nombres: paginación con la etiqueta visible dentro del nombre; vídeos con título obligatorio; glifos `aria-hidden`; enlaces a otra pestaña avisados (o en la misma pestaña)
- [ ] Imágenes: `alt` revisado una a una en la migración; sin imágenes informativas en gris
- [ ] «Compartir artículo»: hoja del sistema donde exista; si no, el `<dialog>` con foco correcto, «Copiar enlace» con `role="status"` y mensaje de error real
- [ ] Encabezados sin saltos (leyendas, tarjeta de cookies); `aria-current="page"` solo en la página exacta; migas en `<nav>`
- [ ] Revisión manual con NVDA + Firefox, VoiceOver + Safari (macOS e iOS) y TalkBack en home, diálogo de proyecto, artículo en `?lang=en`, vídeo y 404 (lista en el §6 del informe)
- [ ] Safari y Firefox: View Transition del menú, respaldo de `animation-timeline`, `<dialog>`
- [x] Declaración de accesibilidad publicada (`/accesibilidad/`, `/en|ar/accessibility/`, enlazada en el pie, en el sitemap): estado parcial, lo probado, lo no probado (lectores de pantalla, Safari, móvil modesto), limitaciones y contacto; **falta el correo** (`⟦…⟧`) y cambiarla cuando se pruebe algo

#### Cookies (informe `informe-accesibilidad-cookies.md` y `informe-seo-cookies.md`)
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
- [ ] SEO de la política: indexable, canonical, hreflang es/en, JSON-LD, en el sitemap con `lastmod` real; slug conservado (K3)
- [ ] Un test simula un registro con `policy` vieja y comprueba lo que la política promete (K2)
- [ ] Ni una petición a YouTube ni a `i.ytimg.com` sin consentimiento (comprobado con red); `data-nosnippet` en la tarjeta, el diálogo y la compuerta

**Hecho:** CI verde; checklist de accesibilidad firmado; presupuestos cumplidos.

> **Actualización de las fases 5, 9 y 10 (2026-11-18, tras decidir el hosting):**
> - **Fase 5 (lluvia).** Un regulador de calidad en `RainField` mide el coste de cada fotograma y baja a 30 fps y luego a densidad 1× si el equipo no llega (un dispositivo rápido nunca sale del nivel 0). Con pantalla de móvil y render por software: a 4× de CPU la ocupación pasa de 91 % a 63 % y a 6× los fotogramas de >50 ms de 52 a 2. Además, la máscara de la foto se calcula a mitad de resolución y cuando el navegador está libre, y ya no se reconstruye el campo entero al cargar la foto ni dos veces al arrancar (a 1× las tareas largas del arranque pasan de 3 a 1). Visualmente idéntico (capturas comparadas). **Hallazgo:** el intro de la lluvia (hoja vacía, gotas verdes cayendo) que el código describe no se veía nunca, porque un segundo `layout()` lo cancelaba, también en la maqueta; ahora es opt-in (`intro: true`) y la home sigue como estaba. **Sigue sin medirse** en un móvil real ni en Safari.
> - **Fase 9 (SEO).** `npm run seo` (`tools/seo-check.mjs`, también en el CI): canónica propia, título y descripción únicos por idioma, un h1, `lang`, Open Graph con imagen existente, JSON-LD que parsea, `hreflang` recíproco con `x-default`, sitemap coherente con las páginas y feeds. Cazó etiquetas, índice de etiquetas e índice de categorías **sin descripción** (ahora con ella, en es/en/ar) y la página 2 de las categorías con el mismo título que la 1. Avisos que quedan, a propósito: títulos de artículos de más de 70 caracteres y los dos artículos duplicados de «Introducción a la IA» (decide el dueño). Lighthouse marca el `robots.txt` por la línea `Content-Signal` («directiva desconocida»): es la que quiere el dueño («citar sí, entrenar no»). Pendiente del dueño: verificar Search Console y Bing.
> - **Fase 10 (calidad).** Lighthouse 12 en Chromium (móvil y escritorio, es/en/ar, home, artículo, proyectos): accesibilidad 100 y buenas prácticas 100 en todas; artículo 86–99 y proyectos 92–100 de rendimiento; la home, 63 en móvil y 72 en escritorio por la lluvia (TBT medido con render por software; en un móvil con GPU no vale). Árbol de accesibilidad volcado y revisado (puntos de referencia con nombre, un h1, h2→h3, enlaces con nombre propio, lluvia y puntos fuera del árbol); detalle menor: la frase del cartel se lee antes del h1. **Siguen sin hacerse:** lectores de pantalla reales (NVDA, VoiceOver, TalkBack), Safari/WebKit y un móvil de gama baja.

> **Fase 10 cerrada por el dueño (2026-11-18):** se omiten las pruebas con lectores de pantalla reales, Safari/WebKit, un móvil de gama baja y la lectura humana del árabe de las políticas. Queda constancia: la declaración de accesibilidad (`/accesibilidad/`) ya dice que no se han comprobado, y hay que actualizarla (texto y fecha, `src/i18n/legal/accessibility.js`) el día que se compruebe alguna.

### Fase 11 · Despliegue y cambio de dominio (½–1 día)
> **Estado (2026-11-18, actualizado): desbloqueada en lo esencial.** El dueño ha decidido: **dominio nandomunoz.com**, **hosting GitHub Pages (D2)**, **correo de contacto `hola@soynando.com`** (ya en las políticas y la declaración de accesibilidad; la privacidad nombra a GitHub Pages y la transferencia a EE. UU.; `check:placeholders` pasa sin huecos), repo `nandomunoz/nandovejer.github.io` (el `origin` local ya apunta ahí; **R8: no se renombra**, el repo es un sitio de proyecto servido en la raíz por el dominio propio). **Hecho:** `public/CNAME`, `.github/workflows/astro-deploy.yml` (mismo filtro que el build con los huecos como error; publica solo desde `main` o a mano), inventario y copia de soynando.com por scraping público (`npm run wp:inventory <carpeta> --media`: sitemaps de Yoast + API REST + medios; 11 entradas, 5 páginas, 4 categorías, 10 etiquetas, 49 imágenes, copia en `~/Documents/repos/soynando-backup`, fuera del repo) y redirecciones ampliadas a 31 (categorías y etiquetas una a una, `/proyectos/`, autores): **0 URLs del sitemap de WordPress sin cubrir**. **Lo que queda es del dueño y de GitHub:** fusionar `feature/astro` en `main` (D1), Settings → Pages → Source «GitHub Actions» + dominio personalizado + HTTPS (esto deja de servir el sitio antiguo), DNS de nandomunoz.com hacia GitHub Pages (A/AAAA y `www`), aplicar las redirecciones en soynando.com (sin tocar su correo: `hola@soynando.com` necesita que siga el MX), Search Console y Bing, y qué pasa con `nandomunoz.github.io` (D5/U5). **CSP:** como GitHub Pages no manda cabeceras, `tools/csp.mjs` (parte de `npm run build`) escribe la política como `<meta>` en las 150 páginas, con el hash SHA-256 de cada script en línea (304) y solo YouTube (tras el «sí») como origen externo; la auditoría falla ante cualquier violación y pasa. No cubre `frame-ancestors`, HSTS ni `report-uri` (el meta los ignora; HSTS lo pone GitHub al activar «Enforce HTTPS»). **Límite de GitHub Pages:** no hay cabeceras ni redirecciones de servidor; el feed antiguo `/feed/` y las URLs de soynando.com se redirigen en soynando.com, no aquí.
- Desplegar en el hosting elegido (D2) en una URL de prueba; revisión completa allí.
- Copia de seguridad de WordPress (export XML + `wp-content/uploads` + base de datos) antes de tocar nada.
- DNS de **nandomunoz.com** al nuevo hosting; HTTPS; `CNAME`; `www` redirige al dominio sin `www` (H4).
- **soynando.com**: activar la tabla de redirecciones del §5 (D11) y comprobar cada URL del inventario; conservar sus registros MX/TXT si hay correo (H3). El dominio se renueva mientras haya enlaces entrantes que lo usen.
- Search Console: verificar nandomunoz.com, enviar el sitemap nuevo, usar la **herramienta de cambio de dirección** de soynando.com → nandomunoz.com (requiere 301 reales), vigilar errores 404 y cobertura las primeras semanas.
- Decidir qué pasa con `nandomunoz.github.io` y las URLs antiguas de `nandovejer.github.io` (D5, R8).
- WordPress apagado solo tras 2–4 semanas sin incidencias.

**Hecho:** nandomunoz.com sirve el nuevo sitio; las URLs de soynando.com llegan a su sitio con 301; el feed sigue funcionando para los suscriptores.

### Fase 12 · Después del lanzamiento
- Flujo de escritura: un post nuevo = una carpeta en `src/content/posts/` con `index.md` + imágenes; `npm run dev` para previsualizar; commit → CI → despliegue.
- Cada post nuevo, en español; sus traducciones a inglés y árabe con el mismo proceso que los 11 actuales (automática, revisada por bloques, con aviso), o sin traducir si no hay tiempo (la página en/ar no se genera y el selector lleva al original).
- Llevar a LUZ lo que salga genérico de Trama (p. ej. la fachada de YouTube o el buscador del 404) si encaja en su catálogo.
- Revisar dependencias cada trimestre (Astro y LUZ fijados con versión exacta).

---

## 8. Decisiones abiertas (con recomendación)

| # | Decisión | Recomendación | Por qué |
|---|---|---|---|
| D1 | ¿Repo y rama? | **Decidido: se trabaja en la rama `feature/astro`** de este mismo repo (desde `proto/home` en `checkpoint-trama-maqueta`); al lanzar, se fusiona o pasa a `main`, y el site antiguo (Cassette/Disquetes/VHS) se queda en `dev`. **No hacer push de `main` sin acuerdo**: `origin/main` publica hoy el sitio de GitHub Pages. Alternativa: repo nuevo `nandomunoz.com`. Ojo: el repo se llama aún `nandovejer.github.io` y el usuario ya es `nandomunoz` (R8). | Aprovecha historial y herramientas; separación limpia. |
| D2 | ¿Hosting de nandomunoz.com? | Con el cambio de dominio, **los 301 de WordPress ya no dependen de este hosting** (los da soynando.com, D11). GitHub Pages + Actions vuelve a ser viable; **Cloudflare Pages** sigue siendo mejor si se quieren cabeceras (CSP, HSTS; informe de seguridad) y previews por rama. | GitHub Pages no permite cabeceras ni redirecciones de servidor, pero dentro del dominio nuevo no hay URLs antiguas que redirigir. |
| D3 | ¿LUZ por npm o vendorizado? | **npm con versión exacta** (`@luz-ds/tokens`, `@luz-ds/core`, `@luz-ds/catalog`). | En Astro el import es directo y Vite lo empaqueta; `luz-sync.mjs` deja de hacer falta. |
| D4 | ¿Modos de color? | **Decidido: tres modos** (oscuro por defecto, claro y contraste alto) con `<luz-theme-mode>`, sin «Auto» que elegir (DESIGN.md §2, `shared/theme.js`). El tema LUZ de Trama define los tokens de los tres y `luz-check` los revisa todos. | Ya está hecho y auditado en la maqueta (`informe-accesibilidad-modos.md`). |
| D5 | ¿Qué pasa con nandomunoz.github.io (antes nandovejer.github.io)? | Redirigir a nandomunoz.com (páginas con `meta refresh` + `canonical`, sobre todo `/proyectos/<id>/` y `/projects/<id>/`) o mantener la Cassette allí como archivo con `canonical` a nandomunoz.com donde haya duplicado. Publicar nandomunoz.com **antes** de activar esas redirecciones (bucle posible, informe SEO). | Evita contenido duplicado. |
| D6 | Filtro de tecnología sin JS | Enlaces `?tech=` filtrados en cliente; sin JS se ve la lista completa. | Evita 20+ páginas casi vacías en el índice. |
| D7 | Imágenes OG | Una por página generada en build con el estilo Trama (adaptar `tools/og-images.mjs`, que ya usa Chromium) y versionadas en el repo. | Sin dependencias en el build de CI. |
| D8 | ¿La voz (Piper) del Cassette? | **No entra** en el nuevo sitio: Trama no tiene voz. El pipeline de audio sigue en `dev`. La regla de CLAUDE.md sobre audios aplica solo a esa rama; por eso Astro copia `data/*.json` a sus colecciones en vez de leerlos (§6). | Trama no lo usa; quita peso y dependencias de Python. |
| D9 | Comentarios de WordPress | Si existen, exportarlos como HTML estático al final del post; no añadir sistema de comentarios. | Cero dependencias, cero terceros. |
| D11 | ¿Quién sirve las redirecciones de soynando.com? | **DNS de soynando.com en Cloudflare con reglas de redirección** (Bulk Redirects: una lista generada desde `blog.json` + reglas comodín para `/category/`, `/tag/`, `/feed/` y el resto → raíz). Mientras tanto, si WordPress sigue contratado, `.htaccess` con los mismos 301. | 301 reales sin servidor propio ni código; permiten el cambio de dirección en Search Console. |
| D12 | Idiomas de las traducciones | **Decidido en la maqueta:** es (original), en (británico) y ar (Siria, árabe estándar sencillo), traducción automática revisada por bloques y con aviso. | Hecho en `0b4f3e5`, `d258d6b`, `224fa3b`. |
| D10 | Analítica | Ninguna, o los logs del hosting (Cloudflare Web Analytics sin cookies si D2 = Cloudflare). Cualquier estadística cambia la política y la tarjeta de cookies (K5). El aviso de cookies existe por YouTube, no por la analítica (§13, K1). | Coherente con LUZ: sin registro ni telemetría. |

---

## 9. Riesgos

| Riesgo | Mitigación |
|---|---|
| Perder posicionamiento de soynando.com al cambiar URLs | Inventario completo (Fase 0), redirección de cada URL antigua, sitemap enviado, vigilancia de Search Console. 301 reales desde soynando.com (D11). |
| Suscriptores del feed `/feed/` se quedan sin feed | Redirección o copia del feed en esa ruta (en Cloudflare: 301; en GitHub Pages: no hay forma limpia → razón de peso para D2). |
| El hero va lento en móviles modestos | Medición en Fase 5, presupuesto por fotograma, worker con `OffscreenCanvas`, menos puntos. |
| Firefox sin `animation-timeline` / Safari con View Transitions parciales | Fallbacks definidos en §3; pruebas en Fase 10. |
| LUZ está en beta y cambia | Versión exacta fijada; tema propio sobre tokens semánticos; actualización solo con comparación de capturas. |
| Contenido de artículos que se rompe al migrar (embeds, tablas) | Conversión desde `blog.json` ya revisado + comparación post a post en Fase 8. |
| Otra sesión trabajando en el mismo checkout | Commits pequeños y solo de los cambios propios (como hasta ahora). |
| Perder el posicionamiento al cambiar **de dominio** (soynando.com → nandomunoz.com), no solo de URLs | 301 reales desde soynando.com (D11), herramienta de cambio de dirección de Search Console, `sameAs` en el JSON-LD, mantener soynando.com renovado. Sin 301 reales (solo `meta refresh`), Google tarda más y puede no transferir la señal. |
| Traducción automática con errores, sobre todo en árabe y en las políticas | Aviso en cada artículo traducido; revisión humana de interfaz y políticas en árabe (I2); `lang="es"` en lo que no se traduce. |
| El árabe se rompe con cambios de CSS que no usan propiedades lógicas | Propiedades lógicas desde la Fase 2; capturas RTL en la comparación de Playwright. |
| `data/*.json` compartido con el Cassette | Copia propia en las colecciones de Astro (§6, D-14). |

---

## 10. Estimación

| Fase | Días |
|---|---|
| 0 Decisiones e inventario | 0,5 |
| 1 Andamiaje | 0,5 |
| 2 Tema LUZ Trama (y RTL) | 1,5–2,5 |
| 3 Colecciones | 1 |
| 4 Chrome | 1 |
| 5 Motor de puntos | 1–2 |
| 6 Home | 1–2 |
| 7 Proyectos | 1 |
| 8 Blog (tres idiomas) | 2,5–3,5 |
| 9 404, SEO, feeds | 1–2 |
| 10 Calidad | 1–2 |
| 11 Despliegue | 0,5–1 |
| **Total** | **≈ 13–20 días de trabajo** (el árabe y el cambio de dominio añaden un día o dos) |

Orden con más valor pronto: 0 → 1 → 2 → 3 → 8 (el blog es lo que hoy vive en WordPress) → 4 → 6 → 7 → 5 → 9 → 10 → 11. El motor de puntos puede llegar al final porque todo funciona sin él.

---

## 11. Preguntas abiertas

Dudas que quedan después de leer la rama. Cada una dice **por qué importa** y **qué haré si no hay respuesta** (supuesto por defecto). Las marcadas con ★ bloquean alguna fase: conviene contestarlas antes de empezarla.

### 11.1 Alcance y objetivo

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| A1 | ~~¿soynando.com pasa a ser el sitio principal?~~ **Resuelta (2026-11-17):** el sitio principal es **nandomunoz.com**; soynando.com y github.io redirigen (D5, D11). | — | — |
| A2 | ¿Es una migración «tal cual la maqueta» o se aprovecha para cambiar cosas de diseño o contenido? | Si hay cambios, mejor decidirlos antes de portar que portar dos veces. | Tal cual la maqueta; los cambios, después del lanzamiento. |
| A3 | ¿Hay fecha objetivo o algún motivo de prisa (renovación del hosting de WordPress, una entrevista, una charla)? | Cambia el orden de fases y qué se recorta. | Sin fecha; se sigue el orden de §10. |
| A4 | ¿Qué es imprescindible el día del lanzamiento y qué puede esperar (inglés, OG por página, panel volador de proyectos, buscador de la 404…)? | Permite lanzar antes con un MVP. | Imprescindible: home, proyectos, blog completo, 404, SEO y redirecciones. Puede esperar: OG por página e inglés de los artículos. |
| A8 ★ | ¿Está registrado **nandomunoz.com**, dónde, y quién gestiona su DNS? | Bloquea la Fase 11 y condiciona D2. | Registrado y con DNS en Cloudflare. |
| A5 | ¿Las versiones Cassette, Disquetes y VHS deben seguir accesibles en algún sitio (como «archivo» o easter egg), o se quedan solo en la rama `dev`? | Afecta a D5, al menú y al pie. | Solo en `dev`; quizá un enlace «versiones anteriores» más adelante. |
| A6 | ¿El monograma es NM o FM? ¿«soynando» desaparece como marca o queda como nombre del blog? | Aparece en cabecera, `<title>`, OG, JSON-LD y favicon. | Nombre «Nando Muñoz», dominio nandomunoz.com, monograma NM; «soynando» solo en las redirecciones y en `sameAs`. |
| A7 | ¿Habrá más secciones que las cuatro actuales (charlas, libro de poesía, Carnaval, «ahora», uses, CV descargable)? | La navegación numerada 01–04 está pensada para cuatro. | Solo las cuatro. |

### 11.2 WordPress y migración de contenido

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| W1 ★ | ¿Tienes acceso de administrador a WordPress (panel, base de datos, FTP/SSH) o solo a la API pública? | Para exportar borradores, páginas privadas, comentarios y medios originales. | Solo la API pública; lo que no salga por ahí se pide aparte. |
| W2 ★ | ¿Hay **páginas** en WordPress además de los 11 posts (sobre mí, contacto, aviso legal, privacidad, cookies, libro, charlas)? ¿Se migran todas? | El conversor actual solo trae posts. | Se inventarían en la Fase 0 y se decide una a una. |
| W3 | ¿Hay **borradores** o artículos privados que deban publicarse con el sitio nuevo? | Contenido nuevo el día del lanzamiento. | No. |
| W4 | ¿Hay **comentarios** que merezca la pena conservar? | D9: exportar como HTML estático o perderlos. | Se conservan como estáticos si existen; no hay comentarios nuevos. |
| W5 | ¿Plugins de WordPress que generen contenido o URLs propias (SEO, formularios, newsletter, galerías, AMP, multiidioma)? | Pueden existir URLs (`/amp/`, `/page/2/`, `?p=123`) que hay que redirigir. | Se detectan en la Fase 0 con el sitemap actual de WP. |
| W6 | ¿Hay **suscriptores** (newsletter, Jetpack, feed con muchos lectores)? | Si hay lista de correo, hay que llevarla a otro servicio o avisar. | Solo el feed RSS. |
| W7 | Los posts largos de Carnaval tienen letras citadas: ¿hay algún problema de derechos o se mantienen igual que ahora? | Se van a republicar en otro hosting. | Igual que ahora. |
| W8 | ~~Enlace «ver el original»~~ **Resuelta:** la maqueta ya lo quitó. | — | — |
| W9 | ¿Se conservan las **fechas de modificación** de WP o solo las de publicación? | `dateModified` en JSON-LD y en el feed. | Las dos, si la API las da. |
| W10 | ¿Las imágenes se migran todas a tamaño original o se reoptimizan (y cuál es el tope de peso del repo)? | Repo ligero frente a calidad. | Se reoptimizan con `astro:assets`; originales a máx. 2400 px. |
| W11 | ¿Formato definitivo de los artículos: Markdown con HTML en línea (recomendado), MDX o mantener el JSON de bloques? | Define cómo escribirás a partir de ahora. | Markdown + HTML en línea, sin MDX. |
| W12 | ¿Desde dónde escribirás los posts nuevos: el editor (VS Code), un CMS headless (Decap, TinaCMS), o desde el móvil? | Un CMS es una dependencia grande; si escribes desde el móvil cambia mucho. | VS Code + git. Sin CMS. |

### 11.3 URLs y SEO

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| U1 | ~~¿Mantener `/<slug>/` en la raíz o mover a `/blog/<slug>/`?~~ **Resuelta por el cambio de dominio:** todas las URLs cambian de dominio y hay que redirigir igual, así que los artículos van a `/blog/<slug>/` sin coste extra. | — | — |
| U2 | ¿Las rutas en inglés y árabe traducen los segmentos (`/en/projects/`, `/en/blog/category/`) o los mantienen en español (`/en/proyectos/`)? En árabe, ¿segmentos en inglés (`/ar/projects/`) o en árabe? | Afecta al i18n de rutas y a la complejidad; los segmentos en árabe se ven codificados (`%D9…`) al copiar. | Traducidos en inglés; en `/ar/`, los segmentos ingleses. |
| U3 | ¿Los slugs de categorías y etiquetas se mantienen como en WordPress? | Redirecciones de `/category/` y `/tag/`. | Sí, mismos slugs. |
| U4 | ¿Los ids de proyecto actuales (`luz`, `quien-canta-hoy`, `streetcai`…) son definitivos? | Son URLs públicas desde el día uno. | Sí. |
| U5 | ¿Las páginas de proyecto de github.io (`/proyectos/<id>/`, `/projects/<id>/`, indexadas como nandovejer.github.io y ahora nandomunoz.github.io) deben redirigir a las de nandomunoz.com? | Ya están indexadas. | Sí, con `canonical` + `meta refresh` desde github.io. |
| U6 | ¿Tienes Search Console y Bing Webmaster verificados para **soynando.com**? Hará falta también **nandomunoz.com**. | El cambio de dirección de Search Console exige los dos dominios verificados y 301 reales. | Se verifican los dos en la Fase 11 con un DNS TXT. |
| U7 | ¿Qué `<title>` y descripción quieres en la home? (hoy: «Tech Lead Frontend en Madrid» en github.io; el kicker nuevo dice Cádiz · Madrid) | Es el texto que sale en Google. | «Nando Muñoz · Tech lead de frontend» + el deck como descripción. |
| U8 | ¿La paginación del blog es `/blog/2/` o `/blog/page/2/`? ¿Se indexan las páginas 2+? | SEO y redirecciones de `/page/2/` de WP. | `/blog/2/`, indexables, sin `noindex`. |
| U9 | ¿Las páginas de etiqueta con un solo artículo se indexan? | Contenido fino. | `noindex` si tienen menos de 2 artículos. |

### 11.4 Idiomas

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| I1 | ~~¿El inglés entra en el lanzamiento?~~ **Resuelta:** entran inglés **y árabe**, interfaz, home, proyectos, políticas y artículos. | — | — |
| I2 | ~~¿Se traducen los artículos?~~ **Resuelta:** los 11, de forma automática y revisada por bloques, con aviso. Queda: ¿alguien que lea árabe revisa al menos la interfaz, las políticas y un artículo antes de publicar? | Una traducción automática de una política legal puede decir otra cosa; el aviso cubre los artículos, no las políticas. | Revisión humana de interfaz y políticas en árabe antes de la Fase 11; si no es posible, las políticas en árabe enlazan a la española como texto que vale. |
| I3 | Para un artículo futuro sin traducir, ¿existe `/en/blog/<slug>/` o el enlace lleva a la española? | Páginas duplicadas frente a navegación coherente. | No se genera; el selector lleva al original. |
| I4 | ¿Detectar el idioma del navegador y redirigir, o nunca redirigir? | La redirección automática molesta y confunde a los buscadores. | Nunca redirigir; como mucho un aviso discreto. |
| I5 | ~~¿Otro idioma?~~ Ya son tres (con RTL): el i18n se escribe para N idiomas. | — | — |
| I6 ★ | ¿Qué **fuente árabe**? Archivo, Doto y Chakra Petch no tienen árabe: hoy la maqueta cae en la fuente del sistema. | Cambia mucho el aspecto de `/ar/` y el peso. | Una OFL con árabe y eje de peso (p. ej. Noto Kufi Arabic o IBM Plex Sans Arabic), autoalojada, solo en `/ar/`. |
| I7 | ¿Por qué árabe de Siria y no árabe estándar sin región (`lang="ar"`)? | `hreflang` y `lang` (`ar-SY` frente a `ar`), y a qué público se dirige. | Se mantiene `ar-SY` en `lang`; `hreflang="ar"` para no limitarlo a un país. |

### 11.5 Diseño y comportamiento

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| D-1 | ¿Hay algo de la maqueta que **no** te convenza todavía y prefieras resolver antes de portarlo? | Portar algo que vas a cambiar es trabajo doble. | Todo está aprobado según DESIGN.md. |
| D-2 | ~~¿Solo oscuro o también claro y alto contraste?~~ **Resuelta:** tres modos en la maqueta (D4). | — | — |
| D-14 | ¿Los textos del Cassette y de Trama se separan para siempre (Trama con árabe, proyectos ocultos, textos propios) o se sigue manteniendo un único `data/projects.json`? | Hoy cambiar un texto de proyecto en Trama obliga a regenerar audios del Cassette. | Se separan al portar (§6); el Cassette queda congelado en `dev`. |
| D-3 | ¿El panel volador de proyecto en la home se mantiene, o al hacer clic se navega a la página del proyecto (con View Transition)? | El panel duplica contenido y es la pieza de JS más compleja. | Se mantiene, pero cargando la página del proyecto con `fetch`. |
| D-4 | ¿Quieres View Transitions **entre páginas** (morph de bloques al ir de la lista al proyecto/artículo)? | Es nuevo respecto a la maqueta. | Sí, sutiles y solo en navegadores que lo soportan. |
| D-5 | ¿La lluvia de la portada se mantiene en móvil, o en móvil va el cartel quieto para ahorrar batería? (el hero de «NANDO» en partículas ya se descartó) | Rendimiento en móviles modestos. | Se mantiene con su modo ligero; quieta si la medición no llega al presupuesto. |
| D-6 | ~~¿Portada real o trama?~~ **Resuelta en la maqueta:** foto real bajo la pantalla de puntos en el artículo; semitono con un ciclo en listas. | — | — |
| D-7 | ~~Bucles de imagen~~ **Resuelta:** un ciclo y quietas; el ratón o el foco lo repiten (plan-maqueta §3). | — | — |
| D-8 | ~~Favicon~~ **Resuelta en la maqueta:** monograma NM en puntos sobre carbón (`maqueta/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, generados con `tools/favicon.cjs`). Se copian. | — | — |
| D-9 | ¿El cursor personalizado o efectos de puntero extra entran, o solo lo que ya hay? | Evitar añadir cosas no pedidas. | Solo lo que ya hay. |
| D-10 | ¿Contacto: solo redes y correo (`mailto:`), o un formulario? | Un formulario en estático necesita un servicio externo. | Sin formulario. ¿Qué correo público se muestra, si alguno? |
| D-11 | ~~Redes del pie~~ **Resuelta:** GitHub, LinkedIn, X y RSS, en texto. | — | — |
| D-12 | ~~Botón de color~~ **Resuelta:** solo el botón redondo flotante; el pie no lo repite. | — | — |
| D-13 | ~~Lema en el pie~~ **Resuelta (2026-11-17):** el lema sale del pie y se queda en el cartel de la portada; el antiguo («Escrito por un humano…») está en Créditos. | — | — |

### 11.6 Tecnología y dependencias

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| T1 | ¿TypeScript en los scripts de cliente o JS puro con JSDoc? | Astro compila TS sin dependencias extra, pero los scripts de la maqueta son JS. | JS con JSDoc en cliente; TS solo en `content.config.ts` y endpoints. |
| T2 | ¿Qué versión de Node usas y cuál quieres fijar (`.nvmrc` / `engines`)? | Astro exige una versión mínima. | La LTS actual. |
| T3 | ¿npm, pnpm o bun? | Lockfile y CI. | npm (es lo que usa `luz-sync.mjs`). |
| T4 | ¿LUZ por npm o vendorizado como hoy (D3)? ¿Qué más del catálogo de LUZ se usa? | El catálogo ya da el aviso de cookies y la línea de tiempo (en uso); también tiene buscador y selector de idioma. | npm; tokens + core + catalog. Valorar el buscador y el selector de idioma del catálogo en la Fase 9. |
| T5 | ¿Pasar `luz-check` en CI sobre el HTML generado? | Encaja con «pensado para que un agente lo escriba bien». | Sí, si funciona sobre `dist/`. |
| T6 | ¿Aceptas Playwright como dependencia de desarrollo para las capturas de regresión, o solo pruebas manuales? | Es la única devDependency pesada del plan. | Sí, solo en dev y CI. |
| T7 | ¿Formateador/linter (Prettier, ESLint, Biome) o ninguno? | Más dependencias frente a consistencia. | Ninguno; `.editorconfig` y `astro check`. |
| T8 | ¿Quieres que Astro genere el CSS crítico en línea (`build.inlineStylesheets`) o archivos aparte cacheables? | Rendimiento en primera visita frente a la siguiente. | `auto` (lo que Astro decide por tamaño). |
| T9 | ¿Hay límite en el tamaño del repo o del `dist/` (imágenes, fuentes, OG)? | GitHub Pages tiene límites blandos. | < 200 MB de repo, < 50 MB de `dist/`. |

### 11.7 Repositorio, ramas y flujo de trabajo

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| R1 | ~~¿Este repo o uno nuevo?~~ **Resuelta:** este repo, en la rama `feature/astro` (D1). | — | — |
| R2 | ¿`feature/astro` conserva `maqueta/` mientras se porta (para comparar al lado) y la borra al final, o la borra desde el primer commit? | Historial frente a limpieza. | La conserva hasta la Fase 10 y la borra antes de fusionar; la maqueta sigue en `proto/home` con su tag. |
| R3 | ¿Commits por fase, por pieza o como hasta ahora (uno por cambio con mensaje largo descriptivo)? | Estilo de historial. | Como hasta ahora, en inglés y descriptivos. |
| R4 | ¿Commits directos en `feature/astro` o ramas por fase que se fusionan en ella? ¿Cómo llega a `main`? | CI y despliegue automático. | Commits en `feature/astro` (ramas cortas por fase solo si hacen falta); un PR `feature/astro` → `main` al lanzar. |
| R5 | ¿El despliegue es automático al hacer push a `main` o manual? | Seguridad: hoy push a `main` publica github.io. | Automático, pero solo cuando el dominio esté listo; antes, a una URL de prueba. |
| R6 | ¿Qué hacemos con `.ai/agents/seo-specialist` y las reglas de CLAUDE.md (voz, audios) en la nueva `main`? | Las reglas de audio no aplican a Trama. | Nuevo CLAUDE.md para `main` sin la parte de la voz; el agente SEO se adapta a Astro. |
| R8 ★ | El usuario de GitHub ya es `nandomunoz` pero el repo se llama `nandovejer.github.io`. Un sitio de usuario de GitHub Pages solo se sirve en la raíz si el repo se llama `<usuario>.github.io`: ¿se renombra el repo a `nandomunoz.github.io`? (GitHub redirige el repo viejo, pero no el sitio de Pages de `nandovejer.github.io`.) | `baseUrl` ya dice `https://nandomunoz.github.io`; si el repo no se renombra, el sitio está en `/nandovejer.github.io/` o no se sirve, y los enlaces de `nandovejer.github.io` se rompen. | Renombrar el repo antes de cualquier push y comprobar qué responde en las dos direcciones. |
| R7 | ¿La rama `proto/home` tiene ahora cambios sin commitear (bio, kicker, redes, audios…). ¿Se commitean antes de empezar? | Ese contenido es la fuente de verdad de `site.json`. | Sí, se commitean primero en `proto/home`. |

### 11.8 Hosting, dominio y operación

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| H1 ★ | ¿Dónde están registrados soynando.com y nandomunoz.com y quién gestiona su DNS? ¿Tienes acceso a los dos? | Necesario para la Fase 11 y para D11. | Tienes acceso a los dos y se pueden pasar a Cloudflare. |
| H2 ★ | ¿GitHub Pages o Cloudflare Pages (o Netlify)? (D2) | 301 reales, cabeceras (CSP, caché), previews por rama. | Cloudflare Pages si no hay inconveniente; si no, GitHub Pages. |
| H3 | ¿Dónde está alojado hoy WordPress y cuándo vence? ¿Hay correo en ese mismo hosting (MX de soynando.com)? ¿El correo de contacto (K4) será de nandomunoz.com? | Cambiar el DNS no debe romper el correo; el correo de contacto aparece en las políticas. | Se copian los registros MX/TXT antes de tocar nada. |
| H4 | ¿`www.nandomunoz.com` o `nandomunoz.com` como dominio canónico? | Redirección y canonical. | Sin `www`; `www` redirige. `www.soynando.com` también redirige. |
| H5 | ¿Cabeceras de seguridad (CSP estricta, HSTS, Permissions-Policy)? Solo posibles fuera de GitHub Pages. | Seguridad y buena nota en auditorías. | Sí, si H2 = Cloudflare; CSP sin `unsafe-inline` (requiere hashes de los scripts en línea). |
| H6 | ¿Analítica? Ninguna, Cloudflare Web Analytics, Plausible, Umami autoalojado… (D10) | Privacidad, texto de la política y de la tarjeta de cookies. | Ninguna, o Cloudflare sin cookies. El aviso de cookies depende de YouTube, no de esto (K1). |
| H7 | ¿Monitorización de caídas o enlaces rotos periódica? | Mantenimiento. | Comprobación de enlaces en CI una vez por semana (cron de Actions). |

### 11.9 Contenido de proyectos y bio

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| P1 | ¿Los cinco destacados de la home (LUZ, ¿Quién canta hoy?, Street Cai, IKAY, Toolbar AEM) son fijos o los eliges con una marca `featured` que irás cambiando? | Modelado de datos. | Marca `featured` en el JSON. |
| P2 | ~~¿Capturas o solo trama?~~ **Resuelta en la maqueta:** cada proyecto tiene su captura, que solo se ve como semitono en los bloques, con su kanji encima. Queda: ¿la página del proyecto enseña también la captura como foto (útil para SEO y `og:image`)? | `og:image` de proyecto. | Sí, en gris bajo pantalla de puntos, como la portada de un artículo. |
| P3 | ¿Proyectos de trabajo (clientes, empresa) que no estén en github.com/nandomunoz? La regla actual es «solo repos reales». | Un tech lead suele tener trabajo privado relevante. | Se mantiene la regla: solo repos públicos. |
| P4 | ¿Quieres una página de CV / experiencia (empresas, años, stack) o la bio basta? | SEO para búsquedas de perfil y reclutadores. | La bio basta; CV en PDF enlazado si lo tienes. |
| P5 | ¿El proyecto `luz` debería enlazar de forma especial a luzds.com (por ejemplo «Este sitio está hecho con LUZ» en el pie)? | Promoción cruzada. | Sí, una línea en el pie. |
| P6 | ¿Los artículos y los proyectos se relacionan (p. ej. «Aprendiendo Web Components» ↔ LUZ)? | «Relacionados» cruzados en ambas direcciones. | Sí, con un campo `related` opcional a mano. |
| P7 | ~~Redes~~ **Resuelta en la maqueta:** «Escríbeme» y el pie muestran el RSS como `nandomunoz.com`; el «Blog» de soynando.com ya no sale. `data/site.json` lo conserva para el Cassette. | — | — |
| P8 | ¿Los proyectos ocultos (`coac-analisis`, `illo-loader`) desaparecen del sitio o tienen página propia sin enlazar desde los índices? | URLs, sitemap y «Más proyectos». | Desaparecen (no se genera página). |

### 11.10 Accesibilidad, legal y privacidad

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| L1 | ¿Hace falta aviso legal / política de privacidad (eres persona física en España con web personal sin actividad económica)? | LSSI; no hay cookies propias ni formularios, pero sí YouTube con consentimiento. | Una página «Aviso legal y privacidad» breve, además de la política de cookies; el aviso de cookies sale donde decida K1. |
| L2 | ¿Declaración de accesibilidad como en LUZ? | Coherencia con LUZ y buena práctica. | Sí, breve, con lo probado y lo pendiente. |
| L3 | ¿Los embeds de YouTube, X y Facebook se mantienen o se sustituyen por enlaces/capturas para no cargar terceros? | Privacidad y peso. | YouTube con fachada (`youtube-nocookie`); tuits como tarjetas estáticas; Facebook como enlace. Ningún script de terceros. |
| L4 | ¿Licencia del contenido (CC BY-NC-SA, todos los derechos reservados) y del código (MIT)? | Se dice en el pie y en el repo. | Código MIT, textos «todos los derechos reservados» salvo que digas otra cosa. |
| L5 | **Las fotos del Carnaval** (Oveja Negra, Ciudad Invisible, Sumisos, Renacidos): ¿de quién son y tienes permiso? La de la Oveja Negra lleva la marca «@DIAZ FARRE»; en WordPress solo había un enlace a la página de Facebook de la comparsa. | Un crédito no sustituye al permiso, y el semitono sigue siendo una obra derivada de la foto. Ahora el repo guarda copias y la web las muestra grandes. | Pedir permiso o usar fotos propias o con licencia abierta; si no, esos posts usan la trama de patrón sin imagen destacada. La maqueta ya muestra el crédito del WordPress («Imagen: La Comparsa de Martínez Ares»), pero no prueba que sea suficiente. |
| L6 | **Licencia, con excepciones.** Textos propios bajo la licencia que elijas (L4), «salvo las letras citadas y las imágenes de terceros»; código en MIT con `LICENSE` aparte. | Los análisis citan letras (derecho de cita, art. 32 LPI, que no se licencia) y llevan fotos ajenas: una licencia sobre todo el contenido relicenciaría material que no es tuyo. | `LICENSE` MIT para el código; aviso aparte para el contenido; sección «Licencia» en `/creditos/` (hoy la página la omite a propósito). SEO: `<link rel="license">`, `license` y `copyrightHolder` en el `BlogPosting`, y `creator`, `creditText`, `copyrightNotice` y `license` en el `ImageObject` de las imágenes propias. |
| L7 | La portada de «Aprendiendo Web Components» (pixel art): ¿está generada con IA? | Si lo está, decirlo en créditos; encaja con el pie («Programado por un humano más la IA»). | Confirmarlo y añadir su `credit` en `blog.json`. |
| L8 | **Licencias de lo que se distribuye.** Tipografías: Archivo, Chakra Petch y Doto son OFL 1.1, que pide que el texto de la licencia acompañe a los archivos (fontsource lo trae en cada paquete). Voces de Piper del Cassette: cada una con su licencia, y el repo distribuye el audio de `assets/audio/`. | Cumplir las licencias de terceros. | Con Astro, copiar los `LICENSE` junto a las fuentes. Revisar las licencias de las voces antes de publicar el Cassette. |
| L9 | ¿Aviso legal (LSSI) si la web ofrece servicios («contrátame»)? | Es aparte de la licencia; ver L1. | Consultarlo con un abogado si hay actividad económica. |

### 11.10 bis Cookies: preguntas nuevas de la revisión (§13)

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| K1 ★ | ¿La tarjeta de cookies sale en todas las páginas o solo en los artículos con vídeo (la compuerta del vídeo ya informa y recoge el consentimiento)? | Con un solo elemento opcional (YouTube, tras un clic), un aviso global aporta poco y cuesta espacio, solape con la píldora y UX. L1 y H6 preveían «sin banner». | Solo donde hay vídeo; en la política basta «Tu elección ahora». **Decide el dueño** (con revisión legal si quiere cobertura). |
| K2 | ¿Se retira la frase «si cambiamos estas normas, te lo volvemos a preguntar» o se hace valer `VERSION` (el aviso reaparece y pisa la elección previa)? | Hoy es **falsa**: el script de LUZ guarda `policy` pero no la compara. | Retirarla de es y en y del comentario de `consent.js`. |
| K3 | Slug de la política: ¿se conserva `/politica-de-cookies/` y `/en/cookie-policy/` (sin redirección)? ¿Se mantiene `/privacidad/` o se funden en «Privacidad y cookies»? | GitHub Pages no da 301; la antigua está indexada. | Conservar los slugs; mantener `/privacidad/` breve, es/en. |
| K4 | ¿Qué contacto concreto va en la política y en la privacidad (correo o formulario)? | El `[pendiente: email]` de WordPress sigue abierto; «por las redes» es débil. | — (decide el dueño) |
| K5 | ¿Habrá estadísticas al migrar (Cloudflare Web Analytics u otras)? | Cambian el texto, la tarjeta y la ficha: hoy se dice «no cuenta tus visitas». | No. |
| K6 | ¿Se repite en un navegador normal y limpio qué guarda YouTube tras «Aceptar y ver aquí» (cookies y `localStorage` del iframe) para poner esos nombres y plazos? | Con headless: 0 cookies, pero tráfico a 8 dominios de Google. La AEPD pide finalidad, tipo y duración. | Sí, antes de publicar la política. |
| K7 | ¿Se acepta quitar el enlace a la miniatura de `i.ytimg.com` (descargar el póster en el build)? | Hoy, con consentimiento, la miniatura se pide a Google en cada carga y el diálogo dice «youtube-nocookie.com» (inexacto). | Sí, póster propio en WebP (Fase 8). |

### 11.11 Calidad y criterio de «terminado»

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| Q1 | ¿Qué navegadores y dispositivos son obligatorios? ¿Tienes un iPhone o un Mac para probar Safari? | Las View Transitions entre documentos y las scroll-driven animations varían. | Últimas 2 versiones de Chrome, Firefox y Safari; Safari se prueba con WebKit de Playwright si no hay dispositivo. |
| Q2 | ¿Cuál es el móvil «modesto» de referencia para el hero? | Presupuesto de rendimiento real. | Un Android de gama media de hace 3–4 años (o throttling 4× en DevTools). |
| Q3 | ¿Objetivos numéricos: Lighthouse 100/100/100/100, Core Web Vitals en verde, o basta con «rápido»? | Cuánto esfuerzo dedicar a la Fase 10. | ≥ 95 en todo, CWV en verde. |
| Q4 | ¿Quieres revisar cada fase antes de pasar a la siguiente o solo hitos (blog listo, todo listo, lanzamiento)? | Ritmo de trabajo contigo. | Revisión al final de cada fase, con capturas y una URL local. |
| Q5 | ¿Quién da el visto bueno final antes del cambio de DNS: solo tú, o alguien más (amigos, comunidad)? | Plazo de la Fase 11. | Solo tú. |

### 11.12 Futuro

| # | Pregunta | Por qué importa | Supuesto por defecto |
|---|---|---|---|
| F1 | ¿Contenido de otro tipo en el futuro: notas cortas, enlaces comentados, poemas, análisis de Carnaval como sección propia? | Si va a crecer, conviene que las colecciones lo prevean. | Solo artículos y proyectos; se añade una colección cuando haga falta. |
| F2 | ¿Webmentions, IndieWeb (`h-card`, `rel=me`) o publicación en Mastodon/Bluesky? | Todo se puede hacer sin dependencias, pero hay que decidirlo. | `rel=me` y microformatos básicos sí; webmentions no. |
| F3 | ¿Newsletter más adelante? | Necesitaría un servicio externo. | No. |
| F4 | ¿Quieres que Trama, o partes de ella (el motor de puntos), acaben en LUZ o como paquete propio? | Afecta a cómo de aislado se escribe `dots.js`. | Se escribe aislado y sin dependencias, por si acaso. |
| F5 | ¿El «Cómo leer los bloques» (trama como dato) se extiende si llegan más años o más categorías? | La escala de DESIGN.md §6 va de 2023 a 2026, pero ya hay proyectos de 2019 y 2020 (kong.sole, IKAY), que hoy caen en 0,6 por defecto (`densityOf`, [main.js:48](../../maqueta/main.js#L48)): más denso que 2024, así que la leyenda miente para ellos. | La densidad se calcula por rango de años en build; la leyenda muestra los extremos y dos intermedios. Revisar en la maqueta antes de congelar. |

---

## 12. Accesibilidad: informe de la maqueta

> Auditoría del agente `accessibility-specialist` ([.ai/agents/accessibility-specialist.md](../agents/accessibility-specialist.md), con el método del `accessibility-engineer` de LUZ: WCAG 2.2 AA + EN 301 549 v3.2.1, axe-core 4.10.3, contraste medido, `forced-colors`, sin JS, `luz-check`) sobre `maqueta/` en el commit `238633d`, 2026-11-15.
> **Informe completo**: [.ai/plan/informe-accesibilidad-maqueta.md](informe-accesibilidad-maqueta.md) (detalle de cada hallazgo con evidencia y arreglo, pruebas manuales pendientes y borrador de la declaración de accesibilidad). No declara conformidad.

**Veredicto.** La maqueta tiene buenos cimientos: enlace para saltar al contenido, canvas `aria-hidden` con el texto real en el DOM, `<dialog>` nativo bien cableado, foco punteado de 13:1, `prefers-reduced-motion` respetado de verdad y `lang="es"` con aviso en los artículos que solo existen en español. Aun así, hoy **no se puede publicar tal cual**. Sin JavaScript las páginas están vacías, el gris `--faint` no llega a 4,5:1 en ningún texto, el estado «actual» de los menús se marca solo con color y desaparece en alto contraste, la píldora del menú y el aviso de cookies tapan por completo el elemento con foco, y la 404 se corta por la derecha en móviles estrechos. Casi todo se arregla en piezas compartidas (tokens, chrome, fila de lista, motor de puntos), no página a página.

**Recuento:** 1 bloqueante · 7 serios (uno de ellos es WCAG 2.2) · 7 moderados (uno es WCAG 2.2) · 12 menores · 5 solo AAA.

**Lo cinco más importantes**

1. **Sin JavaScript no hay web** (bloqueante). Las páginas interiores solo dicen «Esta web necesita JavaScript» y la home es una carcasa sin bio, proyectos, artículos ni redes. Lo arregla el paso a HTML estático en Astro.
2. **El texto en `--faint` #6f6c68 tiene un contraste de 2,79:1** (1.4.3 AA): fechas, minutos de lectura, metadatos, año de cada grupo, pie «© …», placeholder del buscador, contadores e indicaciones. axe lo marca en las 72 combinaciones de página × idioma × anchura. Se arregla en un token.
3. **El foco queda tapado por completo** por la píldora del menú (móvil) y por la tarjeta de cookies (escritorio) (2.4.11 AA, WCAG 2.2). Se ha medido en blog, artículo y home.
4. **El estado «actual» se marca solo con color**: menú, índice del artículo, filtros y paginación (1.4.1 A). Tinta frente a gris da 1,81:1 y el número granate 2,0:1, y en `forced-colors` el estado desaparece del todo.
5. **La 404 se corta por la derecha entre 320 y 360 px** (1.4.10 AA): titular, buscador y enlaces quedan recortados por `overflow-x: clip`. La nube de etiquetas también fuerza scroll horizontal a 320 px.

### Hallazgos

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

### Qué cambia en el plan

- **Fase 2 (tema LUZ)** gana peso: el token de texto apagado pasa a ≥ #939089 (hoy `--faint` #6f6c68 da 2,79:1), el acento como texto se convierte en token (#ff5c6f) en vez de `filter: brightness(1.7)`, y hay un estado `aria-current` visible sin color y un bloque `forced-colors`. **El tema tiene que definir todos los tokens semánticos de LUZ**, no solo los de DESIGN §2: con un borrador mínimo, `luz-check` bloquea 200 pares de color.
- **Fase 4 (cabecera, menú y pie)**: `scroll-padding-bottom` que descuente la píldora y la tarjeta de cookies, medidas con `ResizeObserver` (el foco ya no puede quedar tapado del todo).
- **Fase 5 (motor de puntos)**: los canvas no pueden ensanchar la rejilla (la 404 se corta a 320 px); el polvo del hero y el parpadeo de la 404 se paran solos o tienen pausa (2.2.2).
- **Fases 3 y 8 (contenido y blog)**: el esquema de contenido exige `title` en los vídeos, `alt` revisado y `lang` en todo fragmento en otro idioma; `<pre>` y tablas con scroll enfocables y con nombre; «Compartir artículo» con su diálogo y «Copiar enlace» con `role="status"`.
- **Fase 10 (calidad)**: incluye la lista de comprobación de accesibilidad (ya pegada en la fase).
- **Pendiente sin herramienta aquí**: Firefox, Safari/WebKit y lectores de pantalla reales (NVDA, JAWS, VoiceOver, TalkBack): lista de pruebas en el §6 del informe.

---

## 13. Cookies: revisión de SEO y de accesibilidad

> Los agentes `seo-specialist` y `accessibility-specialist` revisaron **solo** el aviso de cookies de la maqueta (tarjeta, diálogo de ajustes, compuerta de los vídeos, política `/maqueta/cookies/` y píldora que se mueve; commits `a605cc6` y `238633d`, medido sobre `88e3783`). 2026-11-15.
> Informes completos: [informe-seo-cookies.md](informe-seo-cookies.md) · [informe-accesibilidad-cookies.md](informe-accesibilidad-cookies.md). SEO no es asesoría legal.

### SEO, previsualizaciones y cumplimiento

**Bien:** sin consentimiento no sale ninguna petición a YouTube (ni la miniatura); no hay más `localStorage` ni cookies; la tarjeta tapa un 15 % del alto en móvil y Google no penaliza los avisos exigidos por ley.

| # | Hallazgo | Qué hacer | Fase |
|---|---|---|---|
| M1 | **El texto afirma algo falso**: «si cambiamos estas normas, te lo volvemos a preguntar». El script de LUZ guarda `policy` pero nunca la compara. | Retirar la frase (o envolver `getConsent` en `consent.js`). Test con `policy` viejo (K2). | 4, 10 |
| M2 | URL de la política: la antigua `https://soynando.com/politica-de-cookies/` está indexada; `/privacidad/` también. | Conservar `/politica-de-cookies/` y `/en/cookie-policy/` (K3); añadir las dos filas al §5. | 9 |
| M3 | La página es un cascarón `noindex` sin canonical, hreflang, OG ni JSON-LD. | Indexable; description propia (~150 car.); canonical; hreflang es/en + `x-default`; OG `website` con la imagen genérica; `WebPage` + `BreadcrumbList` con `dateModified` = fecha de la política; sitemap con `lastmod` real. | 9 |
| M4 | El texto nuevo **pierde** lo que daba la política de WordPress: nombres y plazos de las cookies de YouTube, Google Ireland y la transferencia a EE. UU., base jurídica, derechos y contacto, enlace a `/privacidad/`. | Medir en un navegador normal qué guarda YouTube (K6) y poner una tabla corta; mantener `/privacidad/`; contacto concreto (K4). | 9 |
| M5 | **¿Hace falta el banner global?** Con un solo elemento opcional tras un clic, aporta poco y cuesta UX. | Mostrarlo solo en artículos con vídeo (K1). El build sabe cuáles. | 4, 8 |
| N1 | La tarjeta es lo primero del DOM y su `<h2>` va antes del `<h1>`. | `data-nosnippet` en tarjeta, diálogo y compuerta; título de la tarjeta como `<p id>`. | 4 |
| N2 | La miniatura se pide a `i.ytimg.com` (con consentimiento) y el diálogo dice «youtube-nocookie.com». | Póster propio en WebP en el build; el diálogo lo dice bien (K7). | 8 |
| N4 | CLS 0,006 en móvil: la píldora se desliza animando `left`/`bottom`. | Animar con `translate`. | 4 |
| N5 | La política es JS puro; el pie inyecta «Política de cookies». | HTML estático; «Tu elección ahora» y su botón `hidden` hasta que haya JS; enlace en el pie en HTML. | 9 |

No merece la pena: `VideoObject`, imagen OG propia para la política, `noindex` en la política, soporte de GPC mientras no haya estadísticas.

**Veracidad del texto, comprobada contra el código.** Cierto hoy: no hay cookies propias, una sola nota `luz-consent` de 180 días, no se envía a ningún sitio, los tuits son tarjetas estáticas, sin consentimiento no se pide nada a YouTube. A vigilar con el hosting (Cloudflare puede poner una cookie de seguridad; las estadísticas romperían «no cuenta tus visitas»). A suavizar: «los datos técnicos del servicio… no se usan para saber quién eres» es una promesa sobre un tercero.

### Accesibilidad

axe-core 4.10.3 no marca nada en la tarjeta, el diálogo abierto, la compuerta ni la política (375 y 1280 px, es y en). **No es un aprobado**: lo que sigue sale de la revisión manual.

| # | Severidad | Hallazgo | Criterio | Fase |
|---|---|---|---|---|
| C1 | Serio · confirmado | Con la tarjeta visible en escritorio, «Ajustes de cookies» y «English» del pie quedan 100 % bajo ella (`scroll-padding-bottom: 0`); en móvil, «Aceptar y ver aquí» queda bajo la píldora. Sigue abierto el hallazgo 26. | 2.4.11 AA (WCAG 2.2) | 4 |
| C2 | Moderado | El texto inglés de la compuerta está dentro de la prosa `lang="es"` en `?lang=en`: voz española. | 3.1.2 AA | 8 |
| C3 | Moderado | En la política, «Cambiar mi elección» + elegir devuelve el foco al botón del pie, al final de la página, sin desplazar. | 2.4.3 A | 4, 9 |
| C4 | Moderado | El quinto vídeo tiene el título vacío: su compuerta es un grupo sin nombre. | 4.1.2 A | 3, 8 |
| C5 | Menor | Un clic en el relleno del diálogo lo cierra y pierde la casilla sin guardar. | — | 4 |
| C6 | Menor | La casilla marcada usa `--blaze` (2,17:1 sobre la tarjeta). | 1.4.11 AA | 2 |
| C7 | Menor · necesita tecnología de apoyo | En la política hay dos anuncios por elección y el foco va a `<main>` sin anillo. | 4.1.3 AA | 4, 9 |
| C8 | Menor | El `h2` «Cookies» va antes del `h1`. | 1.3.1 (hallazgo 14) | 4 |
| C9 | Menor | Letra de 10–11 px en botones y títulos; «Aceptar/Rechazar» no dice qué se acepta; «analítica» es jerga. | AAA / buenas prácticas | 4 |

**Bien hecho (conservar):** todos los pares de color ≥ 6,43:1; objetivos ≥ 24 px (botones de 44); `forced-colors` conserva bordes, subrayados y foco; el deslizamiento de la píldora no se anima con movimiento reducido; sin recortes a 320 px, 200 % de texto ni con espaciado; sin JS no existen ni la tarjeta ni el botón del pie; el diálogo atrapa el foco, se cierra con Esc y devuelve el foco a «Ajustes», con fieldset, legend y ayuda bien asociados.

**Legibilidad de la política** (3.1.5 AAA, aproximada): Szigriszt-Pazos 79 en español; Flesch 80, nivel ~5 en inglés; frase más larga de 27–28 palabras.

**Fuera de accesibilidad:** el deslizamiento de la píldora al cerrarse la tarjeta nunca llega a ejecutarse, porque `focus()` fuerza un recálculo de estilos antes de poner `data-glide`.

### Qué cambia en el plan

- **Fase 4 (chrome):** decidir K1 (tarjeta global o solo con vídeo); `scroll-padding` que cuente píldora y tarjeta (C1); el foco vuelve al lugar útil (C3); `data-nosnippet` y título de la tarjeta como `<p>` (N1, C8); la píldora anima con `translate`.
- **Fase 8 (blog y vídeo):** compuerta con `lang` propio (C2) y `title` del vídeo obligatorio en el esquema (C4); póster propio (N2).
- **Fase 9 (404, SEO y feeds):** la política es HTML estático, indexable, con metadatos, JSON-LD y sitemap (M3, N5), con lo que dejaba la antigua (M4) y los slugs del §5 (M2).
- **Fase 10:** las dos checklists (la de accesibilidad de los informes y la de §12). Un test que simule `policy` viejo (M1).
- **Texto de la política:** corregir M1 y suavizar la frase sobre el hosting antes de publicar. L1, H6 y D10 ya no dicen «sin banner»: remiten a K1.

---

## 14. Pie de página

El análisis y la propuesta del pie (cuatro grupos: secciones, redes, «sobre esta web» y preferencias, más la línea final) se trabajan primero en la maqueta: [plan-maqueta.md §5](plan-maqueta.md). Aquí, en la Fase 4, `Footer.astro` pinta esa estructura en HTML estático, con el botón de ajustes de cookies oculto hasta que corre su script. Tal como está el 2026-11-17: secciones, Sígueme, Sobre esta web, Idioma (enlaces a es/en/ar) y la línea de letra pequeña; sin lema y sin botón de color. **Ojo:** la tabla «El pie de página» de DESIGN.md §8 todavía describe el grupo «Preferencias» con la fila de cookies y el lema en la línea final, y DESIGN.md §14 dice que la tarjeta de cookies se descartó; hay que ponerlo al día en la maqueta antes de congelarla.

---

## 15. Lo que la ronda de auditorías de la maqueta deja para Astro (2026-11-16)

> Resumen de lo que cada informe marca como «Astro» o «Las dos». El detalle, con evidencia, está en cada informe; este apartado es el índice para no perderlo. La ronda y lo que se arregló en la maqueta están en [plan-maqueta.md](plan-maqueta.md).

| Tema | Informe | Qué hay que hacer en Astro |
|---|---|---|
| **HTML sin JS** | todos | Todo el contenido en el HTML del build: hoy un rastreador (y un asistente de IA) recibe solo el `<noscript>`; las 9 páginas llevan `noindex` (correcto en la maqueta, **no portarlo**). La política y la privacidad, estáticas; «Ajustes de cookies» y el botón del banner ocultos hasta que corra su script. |
| **SEO** | [informe-seo-maqueta.md](informe-seo-maqueta.md) | Títulos y descripciones redactados por tipo de página (es/en; propuestos en el informe), canonical, hreflang, OG con la portada recortada a 1200×630 (algunas portadas no sirven: un retrato 1600×2000, un cartel 3:1), JSON-LD (`WebSite`, `ProfilePage`+`Person`, `BlogPosting`, `SoftwareSourceCode`), sitemap con `lastmod`, `dateModified`, `alt` que faltan (9). **Mapa de redirecciones** WordPress → Astro (`/<slug>/`, `/category/`, `/tag/`, `/feed/`, `sitemap_index.xml`, `/privacidad/`, `/politica-de-cookies/`) y el **bucle** posible entre `soynando.com/proyectos/` → github.io y github.io → soynando.com (publicar soynando.com antes de activar las redirecciones de github.io). GitHub Pages no hace 301; con el cambio de dominio, los 301 los sirve soynando.com (D11) y los artículos van a `/blog/<slug>/`. Etiquetas con menos de 3 artículos, `noindex`; no generar `/en/blog/<slug>/` para los artículos solo en español; el `guid` del RSS conserva el permalink antiguo. |
| **GEO** | [informe-geo-maqueta.md](informe-geo-maqueta.md) | `robots.txt` con la política «citar sí, entrenar no» (permitidos los rastreadores de búsqueda y de lectura a petición; bloqueados los de entrenamiento; el `Content-Signal` se repite en cada grupo); `license.xml` y `Link: rel="license"` del WordPress trasladados; `llms.txt` generado en el build, no a mano; JSON-LD con autoría y fechas; decidir `Google-Extended` (bloquearlo también corta la app Gemini). |
| **Seguridad** | [informe-seguridad-maqueta.md](informe-seguridad-maqueta.md) | Cabeceras (Cloudflare `_headers`): CSP completa con el hash del único script en línea, HSTS, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` (YouTube necesita referrer), `Permissions-Policy`, COOP (sin COEP: rompe YouTube). En GitHub Pages solo `<meta>` CSP sin `frame-ancestors`. Probar el `sandbox` del iframe de YouTube con red real. Fijar versiones de las herramientas del build (Piper, acciones de GitHub por SHA). Decidir si `.claude/` queda en el repo público. |
| **Rendimiento** | [informe-rendimiento-maqueta.md](informe-rendimiento-maqueta.md) | Miniaturas de 160 px que descargan AVIF de 1600 px (320 KB cada una): `srcset`/`sizes` generados con `astro:assets` (841 KB → unos 10–15 KB por miniatura en `/blog/`); `blog.json` (239 KB) deja de cargarse en cada página (HTML por artículo); el coste del hero a 4× CPU (23 ms/fotograma, presupuesto 8; a DPR 1: 7,4 ms) y su construcción (tareas largas de 1,4–1,9 s en móvil modesto) se miden de nuevo en Astro y se recortan; la 404 no baja 700 KB de miniaturas ni la foto de 188 KB (solo máscara); la portada compartida de `introduccion-a-la-ia` y `-2` se carga dos veces. |
| **Idiomas** | [informe-traduccion-maqueta.md](informe-traduccion-maqueta.md) | Fechas en inglés con `en-GB`; `hreflang` en el selector; `lang` en cada fragmento en otro idioma desde la plantilla; el selector conserva el `#fragmento`; los alt y créditos de las portadas, solo en español (decidir). |
| **Contenido** | [informe-veracidad-maqueta.md](informe-veracidad-maqueta.md) | Etiquetas que no corresponden a los artículos (6 de 11, y 2 sin ellas) y slugs de categoría que cambiaron respecto a WordPress (U3 decía «mismos slugs»); enlaces internos entre artículos y proyectos (hoy 0); dos artículos con el mismo título (`introduccion-a-la-ia`, `-2`): dejar uno y 301 del otro; el README desfasado de proyectos (`string-transformer` en npm es de otra persona). |
| **Diseño** | [informe-diseno-maqueta.md](informe-diseno-maqueta.md) | Capa de tokens de granate muerta y 11 `filter: var(--blaze-lift)` sin uso: no portarlas; 11 tamaños de rótulo en mono y 17 `letter-spacing` casi iguales (una escala); ocho copias del botón «texto sobre fila de puntos» (un componente); `@layer` y puntos de corte 48/64/90 em. |
| **UX** | [informe-ux-maqueta.md](informe-ux-maqueta.md) | Tarjetas de proyecto de la home como enlaces (hoy son botones: sin JS no enlazan a ninguna ficha); la 404 a 375 px (la foto ocupa 535 px y la sugerencia queda en la segunda pantalla; Intro en el buscador no hace nada: `<form method="get">`); píldora y botón de color tapan texto en móvil. |
| **Idiomas (desde 2026-11-17)** | commits `224fa3b`, `0b4f3e5`, `d258d6b`, `a894689`, `3bfd586` | Tres idiomas con RTL; aviso de traducción; `alt` por idioma; `lang="es"` en letras y tuits; ninguno de los informes de la ronda revisó el árabe ni las traducciones de los artículos: **pasar `i18n-reviewer`, `accessibility-specialist` y `corrector` sobre `?lang=ar` y los artículos en inglés** antes de congelar (plan-maqueta). |
| **Dominio (desde 2026-11-17)** | commits `b9b1872`, `f65064e` | Los informes SEO y GEO hablan de soynando.com como destino: sus recomendaciones (redirecciones, canonical, `sameAs`, `robots.txt`, `llms.txt`) valen igual cambiando el dominio, pero la tabla de redirecciones pasa a ser entre dominios (§5, D11). |
