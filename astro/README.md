# nandomunoz.com (Astro)

El sitio nuevo de [nandomunoz.com](https://nandomunoz.com): blog, proyectos y portada, en español, inglés y árabe. Estático (Astro 7), con [LUZ](https://luzds.com) como sistema de diseño (tema propio, `trama`) y JavaScript sin dependencias. El plan completo está en [`../.claude/plan-soynando-astro.md`](../.claude/plan-soynando-astro.md); esta carpeta no toca el sitio actual de la raíz (`../index.html`, `../eastereggs/`…), que sigue generándose con `node build.mjs`.

## Comandos

Node 22.22 o más. Desde esta carpeta:

| Comando | Qué hace |
|---|---|
| `npm install` | Instala (Astro y LUZ con versión exacta). |
| `npm run dev` | Servidor de desarrollo en `localhost:4321`. |
| `npm run build` | `astro check`, `astro build` → `dist/` (150 páginas) y `tools/csp.mjs`, que pone la Content-Security-Policy como `<meta>` con el hash de cada script en línea. |
| `npm test` | Pruebas `node:test`: paridad es/en/ar, plurales del árabe, datos de la home, tiempo de lectura. |
| `npm run verify:content` | Cada artículo migrado se renderiza como decían los bloques de origen. |
| `npm run check:links` | Enlaces, imágenes y anclas internas de `dist/`. |
| `npm run budgets` | Peso por página frente al presupuesto (HTML+CSS < 60 KB, JS < 35 KB en la home, < 20 KB en un artículo). |
| `npm run audit` | Chromium sobre `dist/`: axe (WCAG 2.2 AA), reflow, sin JS, cookies sin peticiones a Google, foco, espaciado de texto, colores forzados, CLS, el panel de proyectos. `CHROMIUM=/ruta/a/chrome` para elegir navegador; `-- --quick` para una pasada corta. |
| `npm run seo` | SEO de `dist/`: canónica, título y descripción únicos, un h1, `lang`, Open Graph, JSON-LD, `hreflang` recíproco y sitemap. |
| `npm run wp:inventory <carpeta>` | Inventario y copia de soynando.com desde fuera (sitemaps y API pública de WordPress); `--media` baja también las imágenes. |
| `npm run redirects` | Genera `redirects/` (las redirecciones de soynando.com) y comprueba que cada destino existe. |
| `npm run check:placeholders` | Falla mientras queden `⟦…⟧` (datos que solo conoce el dueño) en las páginas. |

El CI (`.github/workflows/astro-build.yml`) corre todo eso en cada push a `feature/astro`.

## Dónde está cada cosa

```
src/content/          los datos: site.json, projects.json, categories.json, tags.json y posts/<slug>/{index,en,ar}.md (+ portada)
src/pages/            las rutas (es en la raíz, /en/ y /ar/); las de cada idioma son archivos de pocas líneas
src/components/       Home, blog/, projects/, legal/, NotFound
src/layouts/Base.astro  el <head> (SEO, JSON-LD, Open Graph), el menú, el pie y los scripts comunes
src/i18n/             ui.ts (rutas y textos por idioma), blog.js, consent.js, legal/ (políticas y créditos)
src/lib/              datos calculados en build: blog.js, projects.js, home.js, jsonld.ts, feed.ts, search.ts
src/scripts/          el JS del navegador: dots.js (motor de puntos), rain.js, blocks.js, home.js, panel.js, post.js, consent.js, video.js…
src/styles/           luz-theme-trama.css (el tema), base.css, chrome.css, home.css, blog.css, projects.css, consent.css…
tools/                migración, comprobadores, auditoría, redirecciones, tarjetas sociales
```

## Escribir

**Un artículo nuevo.** Una carpeta en `src/content/posts/<slug>/` con `index.md` (español, el original) y, si se traduce, `en.md` y `ar.md`, más su `cover.jpg` (la imagen destacada: lleva `alt` obligatorio en el front matter). Copia el front matter de otro artículo. Las piezas especiales (citas destacadas, tuits, vídeos, líneas de tiempo, tablas) van como HTML dentro del Markdown; un elemento propio como `<luz-timeline>` debe llevar su etiqueta de apertura sola en la línea. Sin traducción, esa página no se genera.

**Un proyecto nuevo.** Una entrada en `src/content/projects.json` (con su captura y su `tone.webp` en `src/assets/projects/`, y su kanji) y, si ha de salir en la portada, su `id` en `FEATURED` de `src/lib/home.js`. Los proyectos con `hidden: true` no generan página.

**Ver el resultado.** `npm run dev`, y antes de subir `npm run build && npm run audit`.

## Publicar

Hosting: GitHub Pages, dominio nandomunoz.com (`public/CNAME`), contacto `hola@soynando.com`. `.github/workflows/astro-deploy.yml` construye, pasa todos los filtros (los `⟦…⟧` sin rellenar y los enlaces rotos son error) y publica desde `main` o a mano. Falta, y es de quien tenga acceso: fusionar en `main`, activar Pages con «GitHub Actions», apuntar el DNS, aplicar `redirects/` en soynando.com y verificar Search Console. `npm run wp:inventory <carpeta> [--media]` inventaría y copia soynando.com desde fuera (sitemaps y API pública).
