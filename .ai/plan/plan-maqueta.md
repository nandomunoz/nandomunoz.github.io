# Plan · la maqueta Trama, hasta dejarla lista para portar

> **Qué es este plan.** Todo lo que se puede hacer **sobre `maqueta/`** (rama `proto/home`) antes de pasar a Astro: auditarla con agentes, decidir lo que es del dueño y arreglar lo que tiene sentido arreglar aquí. La meta es **una maqueta «congelada»**: diseño, textos, contenido y comportamiento cerrados, de modo que portar a Astro sea traducir y no rediseñar.
>
> **El otro plan.** Lo que solo tiene sentido en el sitio final (HTML estático, rutas limpias, metadatos, sitemap, redirecciones, hosting, imágenes con `astro:assets`, presupuestos de rendimiento, CI, cabeceras) está en [plan-soynando-astro.md](plan-soynando-astro.md). Ese plan empieza cuando este termina (su Fase 0 congela la maqueta con un tag).
>
> Fecha: 2026-11-16 · Servir: `python3 maqueta/serve.py` → http://localhost:8766/maqueta/ · Diseño: `maqueta/DESIGN.md`

---

## 1. Qué va aquí y qué va en Astro

**Regla:** se arregla en la maqueta lo que **se arrastraría tal cual** al copiar su CSS, sus textos, su contenido o su comportamiento. No se arregla lo que **Astro sustituye** (se perdería el trabajo).

| Va en la maqueta | Va en Astro (no tocarlo aquí) |
|---|---|
| Textos: política, créditos, interfaz, artículos, proyectos; ortografía, tono, traducción al inglés | Que el HTML exista sin JS (hallazgo 1 de accesibilidad, N5 de SEO) |
| Diseño y tokens de color en los tres modos; contrastes; `forced-colors`; estados `aria-current` | Rutas limpias en lugar de `?a=`/`?p=`/`?lang=` |
| Comportamiento: menú, píldora, diálogos, foco, aviso de cookies, compuerta del vídeo, bucles y su pausa | `<title>`, description, canonical, hreflang, OG, JSON-LD, sitemap, RSS, robots |
| Estructura del pie, de la cabecera y de las páginas (§5) | Redirecciones desde WordPress, hosting, DNS, cabeceras (CSP, HSTS) |
| Contenido y sus derechos: fotos, letras, créditos, `alt`, `lang`, títulos de vídeo | Optimización de imágenes (`astro:assets`, `srcset`), fuentes con `preload`, presupuestos de KB |
| Lo que digan los agentes en la ronda de auditorías (§2), salvo lo de la columna de la derecha | CI, `node:test`, `check-links`, `luz-check` sobre `dist/` |

Si un hallazgo cae en las dos columnas (p. ej. el contraste de un token: se arregla aquí y se comprueba otra vez en Astro), se arregla aquí y se apunta en la checklist de la Fase 10 del plan de Astro.

---

## 2. Ronda de auditorías con agentes

Cada agente revisa **la maqueta entera** desde su punto de vista y deja un informe en `.ai/plan/informe-<tema>-maqueta.md` (junto a los que ya hay) con el mismo formato que el legal: **Cambiar / Mejorar / Dejar como está**, cada punto con evidencia (archivo:línea o medida), y una columna **«¿Maqueta o Astro?»** según el §1. Ningún agente edita: informan; los arreglos se deciden después (§4).

| # | Auditoría | Agente | Estado | Qué mira |
|---|---|---|---|---|
| A1 | **Accesibilidad** | `accessibility-specialist` (existe) | Hecha ×4: [maqueta](informe-accesibilidad-maqueta.md), [cookies](informe-accesibilidad-cookies.md), [modos](informe-accesibilidad-modos.md), **[final](informe-accesibilidad-final-maqueta.md)** (2026-11-16) | WCAG 2.2 AA + EN 301 549. La pasada final ya está hecha; sus «Cambiar» baratos se arreglaron (§8). |
| A2 | **Legal** | `legal-auditor` (existe) | Hecha ×2: [informe-legal-maqueta.md](informe-legal-maqueta.md) y **[final](informe-legal-final-maqueta.md)** (2026-11-16) | RGPD, LSSI, cookies (AEPD), propiedad intelectual y licencias. |
| A3 | **SEO** | `seo-specialist` (existe, pero escrito para el Cassette y `build.mjs`: **adaptarlo** a la maqueta y a Astro) | Hecha: [informe-seo-maqueta.md](informe-seo-maqueta.md) (y [cookies](informe-seo-cookies.md)); agente adaptado | En la maqueta: contenido rastreable, encabezados, textos de enlace, enlazado interno, títulos y descripciones **redactados** (aunque se pongan en Astro), slugs, la imagen de cada artículo como `og:image`, datos para JSON-LD. Lo técnico (canonical, sitemap) se queda para Astro. |
| A4 | **GEO** (buscadores con IA: ChatGPT, Perplexity, Gemini, AI Overviews) | `geo-specialist` (creado) | Hecha: [informe-geo-maqueta.md](informe-geo-maqueta.md) | Si una IA entiende quién es Nando, qué hace y de qué tratan los artículos: entidades claras, respuestas directas al principio, datos citables, autoría y fechas visibles, `sameAs`, `llms.txt`; coherencia con la reserva de IA del WordPress (informe legal M10: `ai-train=no`). Decidir qué se permite: aparecer en respuestas sí, entrenar no. |
| A5 | **Seguridad** | `security-auditor` (creado) | Hecha: [informe-seguridad-maqueta.md](informe-seguridad-maqueta.md) | `innerHTML` y HTML de contenido (`html()` en `blog.js`), enlaces `target=_blank` sin `rel`, iframes sin `sandbox`/`allow`, `postMessage`, datos de `localStorage` sin validar, dependencias vendorizadas y su versión, lo que haría falta en la CSP de Astro (lista de orígenes y scripts en línea). |
| A6 | **Ortografía y gramática** (es y en) | `corrector` (creado) | Hecha: [informe-ortografia-maqueta.md](informe-ortografia-maqueta.md) | Todos los textos: `site.json`, `projects.json`, `blog.json`, `shared/*.js`, interfaz de `parts.js`/`blog.js`/`main.js`, `DESIGN.md` no. Ortografía, tildes, mayúsculas, comillas («» en es, “” en en), puntuación, números y fechas (RAE / Fundéu; en: británico o americano, uno solo). Informe con cada corrección propuesta, sin reescribir estilo. |
| A7 | **Tono y voz** | `tone-editor` (creado) | Hecha: [informe-tono-maqueta.md](informe-tono-maqueta.md) | Que la web hable con una sola voz: la de la bio y el lema («escrito por un humano»). Tuteo o no, registro, longitud de frases, jerga técnica sin explicar, textos de interfaz (botones, avisos, errores, 404), coherencia de nombres (Contacto/Escríbeme), la política «para una niña de 12 y un señor de 70» como vara de medir. Propone, no reescribe artículos. |
| A8 | **UX** | `ux-reviewer` (creado) | Hecha: [informe-ux-maqueta.md](informe-ux-maqueta.md) | Heurísticas de Nielsen y recorridos reales: llegar a un artículo desde Google, ver un proyecto y volver, cambiar de idioma, de modo y de cookies, buscar en la 404, móvil con una mano. Orientación (dónde estoy), consistencia, carga cognitiva de la home, la píldora frente al raíl, el panel de proyecto, la tarjeta de cookies (K1). Capturas en 375/768/1280. |
| A9 | **Traducción e i18n** | `corrector` en modo inglés, o `i18n-reviewer` (creado) | Hecha: [informe-traduccion-maqueta.md](informe-traduccion-maqueta.md) | Que el inglés no sea una traducción literal; textos que faltan en `en`; `lang` en cada fragmento del otro idioma; fechas y números con `Intl`; nombres propios que no se traducen. |
| A10 | **Contenido y veracidad** | `fact-checker` (creado) | Hecha: [informe-veracidad-maqueta.md](informe-veracidad-maqueta.md) | Regla de la casa: los proyectos son solo repos reales de github.com/nandomunoz y su texto sale de sus README (nada inventado). Fechas, años, tecnologías, enlaces a demo y código (que respondan), enlaces externos de los artículos (rotos, redirigidos, a WordPress), créditos frente a la realidad (informe legal C5). |
| A11 | **Rendimiento del cliente** | `perf-auditor` (creado) | Hecha: [informe-rendimiento-maqueta.md](informe-rendimiento-maqueta.md) | Solo lo que se arrastra a Astro: coste por fotograma del motor de puntos y de los bucles (móvil con CPU ×4), número de canvas vivos, memoria, imágenes sobredimensionadas o duplicadas en `maqueta/img/`, fuentes que se cargan y no se usan, trabajo en el hilo principal al cambiar de modo. Los presupuestos de KB y LCP finales se miden en Astro. |
| A12 | **Diseño y coherencia visual** | `design-reviewer` (creado) | Hecha: [informe-diseno-maqueta.md](informe-diseno-maqueta.md) | La maqueta frente a `DESIGN.md`: espaciados, escala tipográfica, tokens sin usar o colores sueltos, los tres modos, estados hover/foco/actual, iconos y glifos, la gramática de los puntos (`dot-artist`). Y que `DESIGN.md` diga lo que hay (está desfasado en partes). |
| A13 | **Privacidad técnica** | dentro de `legal-auditor` | Hecha (inventario medido) | Ya cubierto: cero peticiones a terceros sin consentimiento. Repetir si cambia algo de vídeos, fuentes o hosting. |

**Cómo se lanzan.** Por tandas, para que el coste (tokens) sea razonable y los informes no se pisen:

1. **Tanda 1 (texto):** A6 ortografía, A7 tono, A9 traducción, A10 veracidad. Tocan los mismos archivos de contenido: conviene leerlas juntas antes de corregir nada.
2. **Tanda 2 (experiencia):** A8 UX, A3 SEO, A4 GEO, A12 diseño.
3. **Tanda 3 (técnica):** A5 seguridad, A11 rendimiento.
4. **Al final:** A1 accesibilidad y A2 legal otra vez, **solo sobre lo cambiado**.

Cada agente nuevo se crea en `.ai/agents/<nombre>.md` con el mismo esqueleto que `legal-auditor.md`: qué sabe, qué es la maqueta, cómo mide, qué entrega (formato Cambiar / Mejorar / Dejar y la columna «¿Maqueta o Astro?»).

---

## 3. Decisiones del dueño (2026-11-16)

Tomadas en la sesión interactiva (`/grill-me`) y, donde el dueño dijo «toma mi recomendación», con la recomendación de los informes. Las que son suposición mía están en la lista de dudas del final (§8).

| # | Decisión | Estado |
|---|---|---|
| Q1 | Criterio de §1: en la maqueta lo que se arrastra a Astro; lo que Astro sustituye, no | **Confirmada** |
| K1 | Cookies: primero **sin tarjeta**; **el dueño la restauró el 2026-11-16** (la tarjeta de LUZ vuelve en todas las páginas; la compuerta del vídeo se queda además). En el pie ya no hay fila «Cookies» con estado: solo el botón «Ajustes de cookies» en «Sobre esta web» como camino de vuelta | **Decidida por el dueño** (hecho) |
| K2 | Quitar «te lo volvemos a preguntar» ya; en Astro, comparar `policy` y volver a ponerla si se quiere | **Decidida** (hecho) |
| D-7 | Bucles de imagen: un ciclo y quietos; el ratón o el foco lo repiten | **Decidida** (hecho) |
| Q18 | Polvo del hero y 404: se paran a los 5 s; el puntero los mueve otros 5 s | **Decidida** (hecho) |
| Q5 | Todas las auditorías, por tandas | **Decidida** (en curso) |
| C4 / Q6 | Portadas de Carnaval: se publican con su fuente (carácter informativo y sin ánimo de lucro, según el dueño). Riesgo señalado en el informe legal C4, asumido por el dueño | **Decidida** (el dueño asume el riesgo) |
| Q9 | Créditos completos: fotógrafo si se conoce, fuente, marca de agua intacta | **Decidida** (hecho) |
| C6 / Q7 | Letras: autor junto a la cita; la extensión se queda | **Decidida** (hecho: una línea «Letra: …» en la primera cita de cada sección) |
| Q8 / K4 | Correo de contacto | **Pendiente**: texto con hueco `⟦correo de contacto⟧` |
| L4 / Q14 | Código MIT; textos e imágenes propias «todos los derechos reservados» | **Decidida** (hecho: `LICENSE`, créditos) |
| D-11 | Redes en el pie: GitHub, LinkedIn, X y RSS | **Decidida** (hecho) |
| D-12 | Botón de color: flotante y también en el pie (Preferencias) | **Cambiada por el dueño el 2026-11-16**: la fila «Color» del pie se quita; queda solo el botón redondo flotante |
| D-13 / Q17 | Lema del pie = el de la home; el antiguo («Escrito por un humano…») va a Créditos | **Decidida** (hecho) |
| M16/M17 / Q15 | Modos de color: se quedan como están | **Decidida** |
| K7 / Q19 | Miniatura de YouTube: se sigue pidiendo tras el «sí» y se declara (`i.ytimg.com`) en la compuerta, el diálogo y la política | **Decidida** (hecho) |
| Q20 | IA: que citen y busquen sí, que entrenen no | **Decidida** (entra en la auditoría GEO y en `robots.txt` de Astro) |
| Q21/Q22 | Primero los arreglos decididos, luego las auditorías; el dueño revisa al final de cada tanda; commits locales, sin push | **Decidida**. Esta pasada: **sin commits**, a petición del dueño |

---

## 4. Arreglos en la maqueta (lo que ya se sabe)

Agrupados por tema. Cada uno lleva el ID de su informe. Antes de empezar un grupo, comprobar que no esté ya arreglado (algunos commits posteriores a los informes tocaron lo mismo).

### 4.1 Textos legales y de cookies (sin esperar a decisiones salvo donde se dice)
- Quitar «si cambiamos estas normas, también te lo volvemos a preguntar» (es y en) y el comentario de `VERSION` en `consent.js` (legal C1, SEO M1). *K2.*
- Política de cookies: quién (Google Ireland / Google LLC), qué guarda, cuánto dura; «180 días» en vez de «6 meses»; `luz-consent` y `luz-theme` con su duración y cómo borrarlas (legal C3, modos M15). Los datos de YouTube, después de medirlos en un navegador real (K6).
- Suavizar las promesas sobre el hosting (legal M5).
- Página **Privacidad** breve, es y en (borrador en el informe legal §6.2), enlazada desde el pie y la política. *K4.*
- Créditos que digan la verdad: portadas sin crédito, capturas que son de GitHub (legal C5); Unsplash con fotógrafo y foto (M7).
- Compuerta del vídeo: enlace a la política, que Google recibe la IP, que el «sí» vale 180 días para todos los vídeos (legal C7).

### 4.2 Aviso de cookies (según K1)
- Si K1 = ninguna tarjeta: quitar la tarjeta y el diálogo de ajustes (legal M1, M2); el botón del pie abre el estado o lo cambia directamente; la píldora deja de moverse. Gran parte de los hallazgos C1–C9 de accesibilidad desaparecen con ella.
- Si se queda: foco nunca tapado (`scroll-padding` con tarjeta y píldora, C1), foco de vuelta al sitio útil (C3, C7), el diálogo no se cierra al clicar su relleno (C5), título como `<p>` y `data-nosnippet` (C8, N1), letra ≥ 12,8 px y botones que digan qué aceptan (C9), píldora animada con `translate` y deslizamiento al cerrar que sí se ejecute.
- En los dos casos: al retirar el «sí», sustituir el vídeo ya abierto por la compuerta (legal M9); compuerta con `lang` propio (C2) y título de vídeo obligatorio (C4).

### 4.3 Accesibilidad y modos de color
Del [informe de la maqueta](informe-accesibilidad-maqueta.md) y del [de modos](informe-accesibilidad-modos.md), lo que no arregla Astro:
- **Contraste:** `--faint` a ≥ 4,5:1 en oscuro (hallazgo 2; sigue a 2,79:1); acento como texto con token en vez de `filter` (25); píldora translúcida en claro (M6); contraste alto: tinta y apagado distinguibles, enlaces de la prosa con marca más fuerte (M9); control de borrar de la 404 (M14); foco del buscador de la 404 en claro (M8).
- **Estado actual sin color:** menú, índice, chips y paginación, también en `forced-colors` (3, M9).
- **Movimiento:** pausa para los bucles de imagen (M4, *D-7*), el polvo del hero y el parpadeo de la 404 (7).
- **Reflow:** la 404 y la nube de etiquetas a 320 px (4).
- **Teclado y nombres:** `<pre>` y tablas con scroll enfocables y con nombre (5, 9); paginación con la etiqueta visible en el nombre (10); vídeos con título (12); glifos `aria-hidden` (18); Esc durante el vuelo del panel y foco de vuelta al que lo abrió (17).
- **Estructura:** encabezados sin saltos (14); `<aside>` en su sitio (15); `aria-current="page"` solo en la página exacta y migas en `<nav>` (16, 32).
- **Idioma:** `lang` en cada título, extracto y fila en otro idioma (8).
- **Botón de modo:** foco visible sobre fotos (M7), nombre y `title` (M13), posición en el orden de Tab (M12); `forced-colors` en los puntos (19, M10).

### 4.4 Contenido y derechos
- Portadas de Carnaval según C4 (sin recortar ni tapar la marca de agua: agrava el problema).
- Autor junto a cada letra citada (C6); recortes según M4.
- `alt` revisados uno a uno (13); el de Margaret Hamilton es un crédito; los tres sin `alt`.
- Dos artículos con el mismo título enlazado (24).
- Portada de IA confirmada y acreditada (M8, L7).
- Reserva de uso para IA (`robots.txt`, `license.xml` del WordPress): decidir aquí con GEO (A4), ponerlo en Astro (legal M10).

### 4.5 Fallos conocidos sueltos
- La píldora no se desliza al cerrarse la tarjeta (el `focus()` fuerza el estilo antes de `data-glide`).
- Lo que salga de la ronda de auditorías (§2).

---

## 5. Pie de página: reorganización desde la experiencia de uso

> Revisión del pie de la maqueta (`maqueta/blog/parts.js` → `footer()`, más lo que añade `shared/consent.js`), medido en el artículo y en la home, es y en, a 1280 y 375 px. 2026-11-16. Se prueba aquí; en Astro es `Footer.astro` (Fase 4).

### Cómo está hoy

```
© NANDO MUÑOZ · 2026      BIO  PROYECTOS  BLOG  CONTACTO  CRÉDITOS  POLÍTICA DE COOKIES  AJUSTES DE COOKIES  ENGLISH
Escrito por un humano. Programado por un humano más la IA: ella ayuda, pero no decide.
```

En móvil, las ocho piezas se reparten en tres filas por donde caen: «Créditos · Política de cookies» en una, «Ajustes de cookies · English» en otra.

### Qué falla

| # | Problema | Por qué molesta |
|---|---|---|
| P1 | **Una sola lista con cuatro tipos de cosas**: secciones del sitio (Bio, Proyectos, Blog, Contacto), páginas informativas (Créditos, Política de cookies), una **acción** (Ajustes de cookies abre un panel) y una **preferencia** (el idioma). | Quien busca «¿cómo cambio el idioma?» o «¿dónde está la privacidad?» tiene que leer toda la fila. Nada dice qué es cada cosa. |
| P2 | **Todas con el mismo aspecto.** «Ajustes de cookies» es un `<button>` que parece un enlace; «English» parece una sección más. | No se sabe qué lleva a otra página y qué cambia algo aquí (ley de Jakob: en los pies, las preferencias suelen ir aparte, al final). |
| P3 | **El idioma se mezcla con el texto**: una palabra en inglés en medio de una lista en español (o al revés), sin rótulo ni marca de que es el idioma. En el móvil cae junto a «Ajustes de cookies». | Parece un enlace a una página llamada «English». Tampoco dice en qué idioma estás. |
| P4 | **El orden es el de llegada**, no el de importancia: lo legal y los ajustes se añaden por código (`consent.js` inserta antes del idioma) y quedan entre la navegación y el idioma. | Cada pieza nueva (privacidad, accesibilidad, licencia) alargará la misma fila. |
| P5 | **Nombres que no coinciden con el resto**: el pie dice «Contacto», la píldora «Escríbeme»; el pie dice «Bio», la home «01 Bio». | Dos nombres para el mismo destino hacen dudar. |
| P6 | **Falta lo que se espera en un pie**: privacidad (obligatoria: informe legal C2), declaración de accesibilidad (L2), RSS, redes en las páginas interiores (hoy solo están en «04 Escríbeme» de la home), licencia (L4), «Hecho con LUZ» (P5). | Si se añaden a la fila actual, el problema P1 empeora. |
| P7 | **Las preferencias están repartidas**: el idioma en la cabecera y en el pie, el modo de color en un botón flotante, las cookies en el pie (y en la tarjeta). | Tres ajustes del visitante en tres sitios distintos. |
| P8 | **Accesibilidad**: un solo `<nav aria-label="Pie">` con todo dentro; el © en `--faint` (2,79:1, hallazgo 2); con la tarjeta de cookies visible, «Ajustes de cookies» y «English» quedan tapados (C1). | El lector de pantalla no puede saltar al grupo que busca. |

### Propuesta: cuatro grupos y una línea final

Ordenados de lo más usado a lo menos, cada grupo con un rótulo corto en mono (el mismo estilo que los títulos de sección, en pequeño):

```
SECCIONES            SÍGUEME              SOBRE ESTA WEB        PREFERENCIAS
01 Bio               GitHub ↗             Privacidad            Idioma   [ES] · EN
02 Proyectos         LinkedIn ↗           Cookies               Color    [Oscuro] ▾
03 Blog              X ↗                  Accesibilidad         Cookies  YouTube: no · Cambiar
04 Escríbeme         RSS                  Créditos y licencia
─────────────────────────────────────────────────────────────────────────────────────────
© Nando Muñoz · 2026 · Hecho con LUZ        Escrito por un humano. Programado por un humano más la IA…
```

- **Escritorio (≥ 64em)**: los cuatro grupos en las 12 columnas de la rejilla (3 + 3 + 3 + 3). **Tableta (48–64em)**: 2 × 2. **Móvil**: un grupo debajo de otro; nunca una fila que corta un grupo por la mitad.
- **Secciones**: los mismos nombres y números que la píldora y la home (01 Bio, 02 Proyectos, 03 Blog, 04 Escríbeme). Arregla P5.
- **Sígueme**: las redes de `site.json` en texto (sin iconos, coherente con Trama), con ↗ `aria-hidden` y aviso de pestaña nueva si la abren; más RSS. Así las páginas interiores también tienen redes (D-11).
- **Sobre esta web**: todo lo informativo o legal junto: Privacidad (nueva, informe legal C2), Cookies (la política, slug de K3), Accesibilidad (declaración, L2) y Créditos y licencia (L4–L6). Son páginas: se ven como enlaces.
- **Preferencias**: lo que cambia algo **en esta página**, con aspecto de control y no de enlace (borde punteado o subrayado distinto, `<button>` donde es acción):
  - **Idioma**: las dos opciones visibles, `Español · English`, cada una en su idioma (`lang`, `hreflang`), la actual marcada con `aria-current="true"` y sin color como única marca. Así se ve en qué idioma estás y a cuál vas (arregla P3). En la cabecera, el mismo componente en pequeño (o se queda el enlace corto y el pie es el completo).
  - **Color**: el modo actual y el botón para cambiarlo (D-12). Es el mismo `<luz-theme-mode>`; si el flotante se mantiene, los dos dicen lo mismo.
  - **Cookies**: el estado real («YouTube: sí / no / sin elegir») y un botón «Cambiar». El estado ayuda más que «Ajustes de cookies» a secas. Si K1 acaba en «sin tarjeta», este es **el** sitio para cambiar de opinión, y tiene que existir siempre.
- **Línea final**: © nombre · año, «Hecho con LUZ» (enlace a luzds.com, P5) y el lema (D-13). Con un separador punteado como el de las secciones.

**¿Preferencias primero o último en el móvil?** Último en el orden del DOM y en escritorio (es lo convencional y lo que se busca al final); en móvil se puede subir con `order` si los ajustes resultan ser lo más usado del pie: decidirlo midiendo, no a ojo. El orden de lectura y de tabulación debe ser el mismo que el visual (2.4.3, 1.3.2).

### Marcado y accesibilidad

- `<footer>` con: `<nav aria-label="Secciones">`, una lista de redes (no hace falta `nav`), `<nav aria-label="Sobre esta web">`, y las preferencias en un `<section aria-labelledby>` (no son navegación). Rótulos como `<h2>` visibles y pequeños, después del `<h1>` de la página (sin saltos de nivel: hallazgo 14).
- Los controles que necesitan JS (color, cookies) con `hidden` hasta que el script corre, para no dejar botones muertos. El idioma funciona sin JS (en Astro, todo el pie es HTML estático).
- Objetivos ≥ 24 px (2.5.8) y, en móvil, ≥ 44 px de alto en las preferencias; contraste ≥ 4,5:1 en todo el pie, incluido el © (token del hallazgo 2).
- Con la tarjeta de cookies o la píldora encima, el pie se puede tabular sin que nada quede tapado (C1): `padding-bottom` del pie y `scroll-padding-bottom` que cuentan las dos.
- Las piezas no se inyectan desde otros módulos (hoy `consent.js` mete sus `<li>` en la lista): `footer()` pinta los cuatro grupos y cada script solo rellena su hueco (`data-slot="consent"`, `data-slot="theme"`).

### Cómo se comprueba

- [ ] Prueba de cinco segundos con 3–5 personas (vale gente cercana): «¿dónde cambiarías el idioma?», «¿dónde está la privacidad?», «¿cómo quitas el permiso de YouTube?». Cada una se encuentra en un vistazo, sin leer la fila entera.
- [ ] A 320, 375, 768 y 1280 px, es y en: ningún grupo partido entre filas; la fila final legible; nada tapado por la píldora, la tarjeta ni el botón de color.
- [ ] Lector de pantalla: la lista de regiones (`nav`, `section`) deja ir a «Preferencias» directamente; el idioma se lee con su voz.
- [ ] Sin JS (en Astro): secciones, redes, «Sobre esta web» e idioma funcionan; no se ve ningún botón que no haga nada.
- [ ] Los mismos nombres en píldora, home y pie.

Lo que depende de decisiones abiertas (Privacidad, Accesibilidad, licencia, D-11 a D-13) puede ir como hueco señalado o esperar a la respuesta.

---

## 6. Orden de trabajo

1. **Decisiones rápidas** del §3 que más desbloquean: K1, K2, D-7, D-11–D-13.
2. **Arreglos baratos y seguros** que no dependen de nada: §4.1 (salvo privacidad), §4.3 contraste y estado actual, §4.5.
3. **Tanda 1 de auditorías** (texto) → corregir textos en una sola pasada.
4. **Pie (§5)** y **aviso de cookies (§4.2)**, que se tocan entre sí.
5. **Tandas 2 y 3** → arreglos que caigan en la columna «maqueta».
6. **Contenido y derechos (§4.4)** a medida que lleguen permisos y respuestas.
7. **Pasada final**: accesibilidad y legal solo sobre lo cambiado; `DESIGN.md` al día; capturas de referencia (3 anchuras × páginas clave × 3 modos × 2 idiomas).
8. **Congelar**: tag `checkpoint-trama-maqueta` en `proto/home`. Empieza la Fase 0 del [plan de Astro](plan-soynando-astro.md).

**Cómo se trabaja cada arreglo:** un commit por cambio con su mensaje descriptivo (como hasta ahora), sin push; si el cambio toca algo visible, captura antes/después; si toca texto de un informe, se marca en el informe como resuelto con el commit.

## 7. Hecho

La maqueta está lista para portar cuando:
- [ ] Todas las auditorías del §2 están hechas y cada punto «Cambiar» de la columna «maqueta» está arreglado o tiene una decisión anotada.
- [ ] No queda ninguna decisión del §3 sin respuesta (o tiene un supuesto aceptado por el dueño).
- [ ] axe sin `serious`/`critical` en las páginas clave, tres modos, es/en, 375/1280 (lo que dependa de «sin JS» se deja para Astro).
- [ ] Ningún texto promete algo que el código no hace (repasado contra los informes legal y de cookies).
- [ ] `DESIGN.md` describe lo que hay.
- [ ] Capturas de referencia guardadas para comparar con Astro.

## 8. Estado y dudas (2026-11-16)

**Hecho.** Las 13 auditorías del §2 están hechas (la de accesibilidad y la legal, dos veces: la segunda al final). Los arreglos de la columna «maqueta» que no dependían de una decisión del dueño están aplicados; el resto se queda abajo, con su razón. Se hizo el commit al terminar (el dueño lo pidió) y el push; la etiqueta `checkpoint-trama-maqueta` **no** se ha puesto: falta lo bloqueante de abajo.

**Bloquea la publicación (no se puede cerrar sin el dueño)**
- `⟦correo de contacto⟧` sigue en la política de cookies y en la de privacidad (6 sitios, es/en). Sin él, la vía de retirada de fotos, letras y tweets («escríbeme») no funciona (legal final N1; K4/Q8).
- Transferencia a EE. UU.: falta confirmar en dataprivacyframework.gov que Google LLC sigue adherida (legal N5), y comprobar en un navegador normal los nombres y duraciones reales de las cookies de YouTube (K6).

**Dudas: lo he implementado con mi recomendación y hay que confirmarlo**
1. **Tarjeta de cookies:** restaurada a petición del dueño, aunque el informe legal recomendaba no tenerla (M1/M2). Se queda con «Aceptar» y «Rechazar» iguales y un botón «Ajustes de cookies» en el pie como camino de vuelta. La fila «Cookies: YouTube: no · Cambiar» del pie se quitó.
2. **Voz de los textos legales:** primera persona del singular («Recordaré tu “sí”…»), según el informe de tono. La tarjeta en inglés todavía dice “our own” en un sitio (legal final).
3. **Titular de la licencia:** `LICENSE` pone «Nando Muñoz»; LUZ usa «Fernando Muñoz». Hay que decidir el nombre legal.
4. **Fotos de Carnaval:** se publican como informativas y sin ánimo de lucro con su fuente. La LPI no tiene esa excepción como tal (art. 32.1 solo para docencia o investigación, art. 35.1 para actualidad): es un riesgo asumido por el dueño. La portada de Ciudad Invisible parece un fotograma de televisión y su crédito no encaja (legal final).
5. **Letras:** solo se añadió el autor, no se acortaron las citas (776–1004 palabras por artículo). El autor va en la primera cita de cada apartado; Créditos ahora dice «al principio de cada apartado», que es lo cierto. Los tres autores de Martínez Ares no están verificados fuera de la prensa local de Renacidos.
6. **Resúmenes (`excerpt`) de los artículos:** un agente los reescribió desde el primer párrafo. El dueño debe aprobarlos.
7. **Contenido sin tocar:** artículos duplicados `introduccion-a-la-ia` y `-2` (solo se quitó una nota de borrador); etiquetas erróneas en 6 de 11 artículos; seis `alt=""` de imágenes de artículos (F20).
8. **Cambios de contenido:** se quitó el bloque de vídeo privado de Ciudad Invisible; el enlace de Maldita apunta a la versión 20210202 y su texto puede no coincidir; un enlace de adslzone va por Wayback.
9. **Textos:** «Todo lo que he publicado» pasó a «Una selección…». Sin crédito de portada para «Aprendiendo Web Components» (IA) porque L7 sigue sin confirmar. La base legal de «Si me escribes» pasó de 6.1.a a 6.1.f (interés legítimo), según el legal final.
10. **Movimiento:** la regla de 5 s se cumple parando en reposo (lluvia, bucles, títulos de puntos). Los bucles de imagen se acortaron a menos de 5 s. Fechas en inglés con `en-GB`.
11. **Rastreadores de IA:** «citar sí, entrenar no» sin decidir qué pasa con `Google-Extended` (se decide en Astro).
12. **No tocado a propósito:** `data/projects.json` (seseo, apóstrofos, «catalog») porque obliga a regenerar el audio del Cassette; `sólo/solo`, Carnaval/carnaval, librería/biblioteca, tú/usted se dejaron como estaban.
13. **`.claude/` en el repo público:** se ha commiteado con los informes, que citan datos del dueño. Confirmar si debe estar en el repo público o en `.gitignore`.
14. **Orden de trabajo:** las tandas de auditorías se comprimieron en una sola pasada y la accesibilidad se repitió solo al final.

**Cambiar abierto de la pasada final de accesibilidad, que NO se arregló** (decisión de diseño o trabajo mayor; se anota para Astro o una segunda vuelta)
- F4 en parte: la marca de «actual» sin color está en el menú y la paginación y los chips; falta el índice y la prueba en `forced-colors` real.
- F7 panel de proyecto: Esc durante el vuelo borra la URL; retorno del foco al último proyecto visto.
- F9 tablas con scroll sin nombre; F10 buscador de la 404 en `forced-colors`; F12 título de vídeo en `lang="en"`; F13 encabezados y `aside`; F15 buscador de la 404; F18 canvas en `forced-colors`; F19 botón de color; F20 `alt` vacíos.
- Mejorar: F21 gris fino en píxeles (3,1–3,8:1), F22 la tarjeta tapa el crédito del hero, F23 y los AAA.
- Arreglado en esta pasada: F1 (foco bajo la píldora y la tarjeta), F2 (cabecera pisando la tarjeta en ventanas bajas), F3 (paginación inactiva), F5 (idioma actual para lectores de pantalla), F6 (dos `nav` «Secciones»: la píldora ahora es «Principal»), F8 (nombre de la paginación), F11 (enlace de categoría de 16 px), F14 en parte (`aria-current` del Blog en artículos), F16 (clic en el relleno del diálogo) y F17 (píldora translúcida en `forced-colors`).
