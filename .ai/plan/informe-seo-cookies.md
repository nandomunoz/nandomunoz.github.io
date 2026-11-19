# Revisión SEO, previsualizaciones y cumplimiento de las cookies de la maqueta Trama

> Alcance: solo los cambios del aviso de cookies (commits `a605cc6` y `238633d`): la tarjeta, el diálogo de ajustes, el aviso de los vídeos, la página `/maqueta/cookies/` y sus textos. Hecha por el agente `seo-specialist` el 2026-11-15; el texto es suyo, sin cambios de fondo.
> Esto no es asesoría legal. Cada punto está marcado como **documentado** (Google, norma), **práctica establecida** (lo que hace la mayoría y la AEPD suele aceptar) o **criterio** del agente.

## Diagnóstico

- **Lo que está bien.** Sin consentimiento no sale ninguna petición a YouTube (medido con un navegador sin cabeza: en `/maqueta/cookies/`, la home y un artículo con vídeo no hay peticiones externas, salvo una imagen hotlinkeada de soynando.com que desaparece al migrar; tampoco se pide `i.ytimg.com`). Los tuits son `<blockquote>` estáticos y no hay otro `localStorage`, `sessionStorage` ni `document.cookie`. Aceptar y Rechazar tienen el mismo peso visual. La tarjeta tapa un 15 % del alto en móvil (124 de 800 px) y una esquina en escritorio.
- **Lo que hay que corregir.** La página de política es un cascarón vacío y `noindex`, sin canonical, hreflang, OG ni JSON-LD, y hoy sale por `?lang=en`. Hay una promesa falsa en el texto («si cambiamos estas normas te lo volvemos a preguntar»). El texto nuevo pierde información que la política de WordPress sí daba. El plan (L1, H6, D10) sigue diciendo «sin banner» y ya hay banner.
- **Una pregunta de fondo.** Con un solo elemento opcional (YouTube, tras un clic), el banner global en todas las páginas aporta poco y cuesta UX y espacio (M5).

## MUST

### M1. La promesa de volver a preguntar es falsa con el script vendorizado
- **Evidencia.** `maqueta/shared/cookies-policy.js` dice «Si cambiamos estas normas, también te lo volvemos a preguntar» (es y en). El comentario de `maqueta/shared/consent.js` dice «bump VERSION … so the card asks again». En `assets/vendor/luz/cookie-consent.min.js`, `getConsent` solo mira `version===1`, `expires`, `asked` y `granted`: el campo `policy` se guarda pero nunca se compara. Probado con un registro de política vieja y vigente: la tarjeta no aparece. Con uno caducado, sí.
- **Por qué importa.** Es una afirmación a los usuarios sobre el funcionamiento que el código no cumple; el mismo tipo de error que la política quiere evitar.
- **Maqueta ahora.** Dos opciones: quitar la frase de las dos lenguas y el comentario de `VERSION`; o envolver `getConsent` en `consent.js` para tratar como «no preguntado» un registro cuyo `policy` no coincide con `VERSION` (en la capa propia, sin tocar el script vendorizado). Hay que decidir si un cambio de política justifica pisar una elección ya hecha.
- **Astro.** Fase 4 (chrome) y Fase 10: un test que simule `policy` viejo. **Esfuerzo:** S.

### M2. URL limpia, redirección y duplicados con WordPress
- **Evidencia.** La política antigua está en `https://soynando.com/politica-de-cookies/`, indexada (canonical propio, `soynando.json`, página 1038). `/privacidad/` también existe (página 946). La maqueta usa `/maqueta/cookies/` y `?lang=en`. El plan §5 no lista las páginas legales.
- **Recomendación.** En español, conservar `/politica-de-cookies/` (ya existe, sin redirección). En inglés, `/en/cookie-policy/`. Igual con `/privacidad/` (mejor `/en/privacy/`) si se mantiene (M4).
- **Por qué.** GitHub Pages no da 301. Google trata un `meta refresh` de 0 s como redirección permanente (documentado), pero un 301 real es más limpio. Si la URL no cambia, no hay redirección ni se pierde señal. Solo habría que redirigir si se elige `/cookies/`, y entonces D2 (Cloudflare) pesa más.
- **Astro.** Plan §5 (filas «Política de cookies» y «Privacidad»), §11.3 (pregunta nueva) y Fase 9 (mapa `redirects`). **Verificación:** `curl -sI https://soynando.com/politica-de-cookies/` → 200 con canonical autorreferenciado. **Esfuerzo:** S.

### M3. Indexación y metadatos de la página de política
- **Evidencia.** `maqueta/cookies/index.html` tiene `noindex` (copiado de los demás shells; correcto mientras sea maqueta) y no tiene description, canonical, hreflang, OG, Twitter ni JSON-LD. Sin JS el `<body>` está vacío salvo el `noscript`.
- **Recomendación para Astro.**
  - **Indexable** (`index, follow`). Criterio del agente: la antigua lo estaba y un enlace a «Política de cookies» desde cada pie es normal. `noindex` no aporta y pierde la señal de transparencia.
  - **Title** `Política de cookies · Nando Muñoz` (el actual vale). **Description** de unos 150 caracteres sin `…` (la antigua era un extracto cortado), por ejemplo: «Esta web no usa cookies propias ni analítica. Solo carga vídeos de YouTube si tú lo aceptas. Qué se guarda y cómo cambiarlo.»
  - **Canonical** autorreferenciado. **hreflang** es/en y `x-default` al español.
  - **Open Graph:** `og:type=website` (la antigua usaba `article`, incorrecto para una página legal), `og:locale` es_ES / en_US, `og:image` la genérica del sitio (excepción a D7 «una por página»; la antigua tenía `og.image: []`, no es una regresión), `twitter:card=summary_large_image`.
  - **JSON-LD** en `@graph`: `WebPage` con `inLanguage`, `datePublished` y `dateModified = UPDATED` real, `isPartOf` el `WebSite`, y `BreadcrumbList` (Portada > Política de cookies); reutilizar los `@id` de `WebSite` y `Person` de la home. La antigua apuntaba Portada a `/me/`, que ya no existe: apuntar a `/`. No usar tipos de «privacy policy» (no dan rich result).
  - **Sitemap:** es y en con `xhtml:link` alternates y `lastmod` = `UPDATED`, no la fecha del build.
  - **robots:** no bloquear `/assets/vendor/` ni el JS del aviso (Googlebot debe poder renderizar la tarjeta).
- **Astro.** Fase 9 (`<head>`, `sitemap.xml.ts`) y D7. **Verificación:** Inspección de URL en Search Console, validador de Rich Results (solo que el JSON-LD parsea), `view-source:` con JS desactivado. **Esfuerzo:** S.

### M4. Lo que el texto nuevo pierde frente a la política y la privacidad de WordPress

| Punto | WordPress | Maqueta |
|---|---|---|
| Cookies de terceros con nombre y duración | tabla: `VISITOR_INFO1_LIVE` 6 meses, `YSC` sesión, `yt-remote-*` | «Google sí puede guardar sus propias cookies», sin nombres ni plazos |
| Entidad y transferencia | Google Ireland Limited, EE. UU. bajo el Marco UE-EE. UU. | nada |
| Responsable y contacto | nombre más `[pendiente: email de contacto]` | «escríbeme por las redes» (enlace a `/#contacto`) |
| Base jurídica (art. 6 RGPD) | sí, en `/privacidad/` | nada |
| Derechos y plazo de respuesta | sí, en `/privacidad/` | solo «puedes acudir a la AEPD» |
| Enlaces para borrar cookies por navegador | Firefox, Chrome, Safari y Edge | genérico «Ajustes → Privacidad» |
| Estadísticas (Koko Analytics) | explicadas, opt-in | nada: «no cuenta tus visitas» (ya no se usa, coherente) |
| Señal GPC | respetada como «no» a estadísticas | nada (sin estadísticas no hace falta) |
| Enlace a `/privacidad/` | sí | ninguno |

- **Consecuencia.** La política es más legible, pero queda como único texto legal: no se enlaza `/privacidad/` desde ningún sitio y no hay aviso legal.
- **Práctica establecida.** La guía de cookies de la AEPD (actualización de 2024, citada de memoria: conviene revisarla) pide informar de finalidad, tipo y duración, también de las de terceros. Un texto genérico sobre las de Google es más débil que la tabla antigua.
- **Recomendación.** Medir qué deja de verdad `youtube-nocookie.com` tras el clic y poner esos nombres y plazos en una tabla corta. Mantener `/privacidad/` (breve, es/en) o fundir las dos en «Privacidad y cookies». Poner una vía de contacto concreta (el `[pendiente: email]` de WordPress sigue sin resolver).
- **Medición del agente.** Con Chromium sin cabeza, tras «Aceptar y ver aquí»: `Network.getAllCookies` devuelve **cero cookies**, aunque se contacta con `www.youtube-nocookie.com`, `www.google.com`, `fonts.gstatic.com`, `googlevideo.com`, `jnn-pa.googleapis.com`, `i.ytimg.com`, `yt3.ggpht.com` y `www.gstatic.com`. No midió `localStorage` dentro del iframe y el vídeo puede no haberse reproducido del todo en headless: repetir con un navegador normal y limpio. Si de verdad no hay cookies, el texto puede decir «YouTube puede guardar cookies o notas» sin inventar nombres, y lo que hay que declarar es el tráfico a Google (IP).
- **Sobre la LSSI.** La obligación de identificarse (art. 10) aplica a prestadores con actividad económica; un blog personal sin publicidad suele quedar fuera (criterio), pero si hay libro, charlas o consultoría (pregunta W2) merece una línea de identificación.
- **Astro.** Fase 9 (páginas nuevas), plan §11.10 L1 (hoy «sin banner de cookies»), W2, H6, D10. **Esfuerzo:** M.

### M5. ¿Hace falta el banner? Criterio: mejor solo donde hay vídeo
- **Establecido.** El art. 22.2 de la LSSI exige consentimiento para guardar o leer información en el dispositivo salvo que sea estrictamente necesaria para un servicio expresamente pedido. La AEPD y el EDPB (directrices 2/2023) incluyen el `localStorage` y técnicas similares. La nota `luz-consent` está exenta (guarda la propia elección) y la política lo dice bien. Antes del clic no se guarda ni se lee nada de terceros; con el clic, el usuario pide el vídeo.
- **Criterio del agente.** Un aviso global que dice «Sin cookies propias» es un banner por si acaso. Lo útil es la compuerta dentro del artículo, que ya informa y recoge el consentimiento con un botón explícito (patrón de «dos clics», aceptado por la mayoría de las guías). La elección global (`grant('youtube')`) ya queda guardada desde esa compuerta y el pie conserva «Ajustes de cookies».
- **Propuesta.** Mostrar la tarjeta solo en páginas con vídeo (o ninguna, dejando la compuerta como única interfaz). Desaparecen de la home, el índice, las categorías, las 404 y la propia política: el solape con la píldora, el margen inferior, el aviso en ~80 % de las visitas y casi todo el riesgo de LCP y CLS. La tarjeta en la política es redundante, porque la página ya trae «Tu elección ahora» y su botón.
- **Decisión del dueño**, con revisión legal si quiere cobertura. El plan (L1/H6) preveía «sin banner»; el estado actual lo contradice.
- **Astro.** Fase 4 (chrome) y Fase 8 (blog, vídeo): en el build se sabe qué artículos tienen vídeo. **Esfuerzo:** S o M.

## NICE-TO-HAVE

### N1. Que la tarjeta y la compuerta no ensucien los resultados de búsqueda
- **Evidencia.** La tarjeta va primero en el DOM (tras el skip link, como pide LUZ) y su texto es lo primero que ve un rastreador; en la medición móvil del artículo, el LCP era el párrafo `.consent__text`. La compuerta añade su texto dentro del cuerpo del artículo. Googlebot renderiza JS sin `localStorage` persistente: siempre ve tarjeta y compuertas.
- **Fix.** `data-nosnippet` (documentado) en el contenedor de la tarjeta, el diálogo y el `<p>` de la compuerta; siempre una `<meta name="description">` explícita. El título de la tarjeta y el del diálogo son `<h2>` y aparecen antes del `<h1>` (hallazgo 14 del informe de accesibilidad): hacer el título de la tarjeta un `<p>` con `id` (`aria-labelledby` no exige encabezado). En Astro el LCP debería ser el `h1` o la imagen hero; mantener corto el texto de la tarjeta.
- **Astro.** Fases 4 y 10. **Esfuerzo:** S.

### N2. Miniaturas de YouTube en el servidor propio
- **Evidencia.** Con consentimiento guardado, la miniatura se pide a `https://i.ytimg.com/vi/<id>/hqdefault.jpg` en cada carga, antes de pulsar play (`blog.js`, `video()`). Esa petición a Google no está en el aviso, y `CT.youtubeHint` («las miniaturas (youtube-nocookie.com)») es inexacto: son de `i.ytimg.com`.
- **Propuesta.** Descargar el póster en build (WebP con `width` y `height`) y servirlo desde `assets/`: la compuerta puede mostrar el póster sin consentimiento (no hay petición a Google, así que no parece rota); no hay petición a terceros antes del clic; el contenedor reserva su `aspect-ratio` (hoy `min-height: 56.25cqi` con `:has()`); el póster es un recurso estable para rastreadores. Sin consentimiento no hay iframe, así que Googlebot ve la compuerta con un enlace a `youtube.com/watch`.
- **Astro.** Fase 8. **Esfuerzo:** M.

### N3. Vídeos: ni `VideoObject` ni nada más
- **Documentado (Google, video).** Un artículo donde el vídeo es secundario no cuenta como página de visionado. Los vídeos son de terceros (Carnaval, Margaret Hamilton) y acompañan al texto. No añadir `VideoObject` (su única función sería un riesgo de marcado incorrecto). Sí conviene que la compuerta sea HTML estático con el título del vídeo y el enlace `youtube.com/watch` visibles sin JS. **Astro:** Fase 8.

### N4. CLS y Core Web Vitals
- **Medición móvil (390 px).** CLS 0,006 en `/cookies/` y en el artículo; 0 en escritorio. No es la tarjeta (es `position:fixed`): son 6 desplazamientos de ~3 px de la píldora mientras se desliza a la izquierda (animación de `left`/`bottom`). Con `translate` en vez de `left` sería 0.
- El botón «Ajustes de cookies» del pie reserva su hueco (`visibility:hidden`): no hay salto cuando el script lo muestra.
- **Peso.** Script vendorizado 2,9 KB (1,4 KB gzip). CSS de la tarjeta (líneas 369–476 de `maqueta/style.css`) 8,6 KB (2,5 KB gzip). `consent.js` y `cookies-policy.js` ~20 KB sin minificar; en Astro irán empaquetados (hoy hay una cascada `blog.js` → `consent.js` → `cookie-consent.min.js` que el bundle elimina).
- **Interstitial.** Google excluye expresamente los avisos exigidos por ley, como los de cookies, de la penalización por interstitials intrusivos (documentado). La tarjeta (15 % del alto en móvil) queda muy por debajo. El solape con la píldora es un tema de accesibilidad (hallazgo 26). **Esfuerzo:** S.

### N5. Sin JS
- **Evidencia.** `curl http://localhost:8766/maqueta/cookies/` devuelve un `<body>` con solo el `noscript`; todo el texto sale de JS. Está bien siendo maqueta.
- **Astro (Fase 9).** La política es HTML estático completo. El bloque «Tu elección ahora» y su botón deben estar `hidden` en el HTML y mostrarse con JS (sin JS el botón no hace nada y «Todavía no has elegido» sería engañoso). El pie debe llevar el enlace «Política de cookies» en HTML estático (hoy lo inyecta `consent()`), para que haya un enlace interno rastreable desde todas las páginas. **Esfuerzo:** S.

## Veracidad del texto, comprobada contra el código

| Afirmación | Veredicto |
|---|---|
| «Esta web no pone ninguna cookie suya» | Cierto hoy (no hay `document.cookie` en `maqueta/`). Podría dejar de serlo con el hosting: Cloudflare con Bot Fight Mode puede poner `__cf_bm` (estrictamente necesaria; de memoria, verificar en DevTools tras desplegar). GitHub Pages no pone cookies |
| «No cuenta tus visitas» | Cierto hoy. Se rompería si D10 elige Cloudflare Web Analytics: habría que cambiar texto, tarjeta y ficha |
| Una sola nota, `luz-consent`, 180 días | Cierto. Matiz: caducada, la nota sigue en `localStorage` hasta que se sobrescribe (probado) |
| «No se envía a ningún sitio» | Cierto (almacenamiento local) |
| «Por eso no te pedimos permiso para guardarla» | Práctica establecida: las cookies de gestión del consentimiento están exentas |
| «Si cambiamos estas normas, también te lo volvemos a preguntar» | **Falso hoy** (M1) |
| «Sin consentimiento no se pide nada a YouTube, ni la foto pequeña» | Cierto (0 peticiones medidas). Falta decir que con consentimiento la miniatura se pide en cada carga (N2) |
| «Los tuits se enseñan como una tarjeta hecha aquí» | Cierto (`blockquote` + enlace) |
| «Las letras están guardadas en esta misma web» | Cierto (fuentes en `/assets/fonts/`). Dentro del iframe de YouTube sí se contacta con `fonts.gstatic.com` |
| «El servicio… puede apuntar datos técnicos… la IP… para protegerse de ataques» | Plausible y honesto. GitHub documenta que registra IPs de visitantes de Pages por seguridad (según fuentes secundarias: comprobar la redacción actual y la retención). Con Cloudflare habría que decir también que trata datos fuera de la UE. «No se usan para saber quién eres» es una promesa sobre un tercero: suavizar |
| «Esta nota es parecida a una cookie» | Correcto y útil |

## No merece la pena

- JSON-LD `VideoObject` en los artículos (N3).
- Una imagen OG propia para la política (basta la genérica).
- `noindex` en la política «porque es legal» (pierde señal de confianza y no gana nada).
- Resolver la compuerta sin JS con `<noscript>` extra (basta el enlace estático a YouTube).
- Soporte de GPC (solo tiene sentido si vuelven las estadísticas).
- Optimizar los 2,9 KB del script de LUZ.

## Preguntas nuevas para el dueño

1. ¿Slug de la política? Recomendado: conservar `/politica-de-cookies/` y `/en/cookie-policy/`. ¿Y mantener `/privacidad/` o fundir las dos?
2. ¿Tarjeta en todas las páginas (como ahora) o solo en artículos con vídeo?
3. ¿Qué contacto concreto va en la política (email o formulario)? El `[pendiente: email]` de WordPress sigue abierto.
4. ¿Habrá estadísticas (Cloudflare Web Analytics o similares) al migrar? Si sí, cambia el texto, la tarjeta y la ficha.
5. ¿Hosting definitivo? Cambia qué se puede decir de IP, cookies de seguridad y 301 (D2/H2).
6. ¿Se hace valer el nuevo `VERSION` (M1), pisando la elección previa, o se retira la promesa?
7. ¿El plan debe actualizar L1, H6 y D10 («sin banner de cookies») al estado real?

## Qué haría primero

Arreglar M1 (retirar o implementar la promesa de repreguntar) y decidir M5 (banner solo con vídeo), porque son lo único que afecta al usuario hoy. Después fijar el slug (M2), escribir metadatos y JSON-LD de la política para la Fase 9 (M3) y una tabla honesta de lo que de verdad deja YouTube, medida en un navegador real (M4). `data-nosnippet`, el título de la tarjeta como `<p>` y el póster de vídeo propio son pequeños y encajan en la misma pasada de las Fases 4 y 8.

Fuentes citadas por el agente: [Google Search Central, Video SEO best practices](https://developers.google.com/search/docs/appearance/video) · [GitHub Docs, What is GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
