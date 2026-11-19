# Informe GEO de la maqueta Trama (A4)

Fecha: 2026-11-16 · Rama `proto/home` · Carpeta `maqueta/` · Auditor: `geo-specialist` (solo informa, no edita nada más que este informe).

Decisión del dueño que guía todo el informe: **«citar sí, entrenar no»**. Los asistentes de IA pueden buscar el sitio y citarlo con enlace; los rastreadores que entrenan modelos, no.

---

## 1. Resumen

**Veredicto.** La política está bien pensada y ya funciona en el WordPress de hoy (`robots.txt` con `Content-Signal`, `license.xml` RSL y un `llms.txt`); lo que falta es llevarla al sitio nuevo. El contenido es bueno para que lo cite una IA: artículos largos con entradilla visible, párrafos que se pueden citar, fuentes enlazadas, letras de comparsa atribuidas en su propia cita. Pero hoy la maqueta **no se puede leer sin JavaScript**: un rastreador que no ejecute JS ve el `<title>` y nada más. Eso lo arregla Astro, y es el punto de mayor impacto. En la parte de contenido hay dos problemas reales: las etiquetas de 6 de los 11 artículos son erróneas (un análisis de Carnaval etiquetado «CSS» y «Web Components») y hay dos artículos con el mismo título.

**Los cinco hallazgos principales**

1. **C1 · Sin JS no hay contenido.** Medido con `curl`: la página de un artículo devuelve solo `<noscript>Esta web necesita JavaScript.</noscript>`; la home no trae ni la bio. Los rastreadores de entrenamiento y de búsqueda de OpenAI, Anthropic y Perplexity, según la práctica habitual (no lo documentan los fabricantes), no ejecutan JS. Se arregla en Astro con HTML estático.
2. **C2 · La reserva de derechos se pierde si no se traslada.** La maqueta no tiene `robots.txt`, `license.xml` ni `<link rel="license">`. Propongo el `robots.txt` completo (§3.5), comprobado contra la documentación de cada fabricante.
3. **C4 · Etiquetas que mienten.** 6 de 11 artículos llevan etiquetas que no son de su tema; 2 no llevan ninguna. Las etiquetas alimentan los «relacionados», las páginas de etiqueta, `keywords` y lo que un modelo entiende que trata cada texto.
4. **C5 · Dos artículos con el mismo título** («¿Hay alguien dentro?…», `introduccion-a-la-ia` y `-2`) y fechas que no coinciden entre fuentes. Compiten entre sí y un modelo cita uno al azar.
5. **C7 · Las URLs de WordPress ya están en los índices.** Si Astro pasa a `/blog/<slug>/` y Pages solo hace `meta refresh`, las citas y enlaces que ya existen pierden la señal. Decisión de dueño (U1 y D2 del plan).

**Dos cosas que conviene saber antes de decidir**

- **`llms.txt`: veredicto honesto, no merece trabajo manual** (§3.6). Ningún fabricante ha confirmado que lo lea en producción; Google dice que no lo usa. Pero ya lo cita el `license.xml` del WordPress (`<alternate>`), así que si se mantiene esa línea hay que servirlo. Generarlo en el build cuesta ~30 líneas.
- **`Google-Extended` también corta el «grounding» de Gemini.** Según la documentación de Google, ese token cubre el entrenamiento **y** que el contenido sirva de base a las respuestas de la app Gemini y de Vertex. Bloquearlo (como hace hoy el WordPress) es coherente con «entrenar no», pero deja fuera al sitio de las respuestas de la app Gemini. **Los AI Overviews y el AI Mode de Google no dependen de él: dependen de Googlebot.** Es una decisión que debe tomar el dueño (P1).

**Recuento por cubo:** Cambiar **7** · Mejorar **11** · Dejar como está **9**.

---

## 2. Método

**Leído**
- `.ai/agents/geo-specialist.md`, `.ai/plan/plan-maqueta.md` (A4, Q20, M10), `.ai/plan/plan-soynando-astro.md` (rutas, Fase 9, D2, U1), `.ai/plan/informe-legal-maqueta.md` (M10, L4, L6).
- `data/site.json`, `data/projects.json`, `maqueta/shared/blog.json` (11 artículos: etiquetas, titulares, citas, entradillas, bloques), `maqueta/shared/content.js`, `maqueta/blog/blog.js` (`postPage`, `projectPage`), `maqueta/blog/parts.js` (pie), `maqueta/index.html`, `maqueta/blog/articulo/index.html`, `build.mjs` en lo que toca a `robots.txt` y `sitemap.xml`.
- Sitio vivo de hoy, con `curl`: `https://soynando.com/robots.txt`, `/license.xml`, `/llms.txt`, `/feed/`, `/sitemap.xml` y el JSON-LD de un artículo (Yoast).
- Documentación de los fabricantes (consultada el 2026-11-16): OpenAI (`developers.openai.com/api/docs/bots`), Anthropic (`support.claude.com`, artículo sobre el rastreo), Google (`developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers` y `/search/docs/appearance/ai-features`), Perplexity (`docs.perplexity.ai/guides/bots`), Apple (`support.apple.com/en-us/119829`), Meta (`developers.facebook.com/docs/sharing/webmasters/web-crawlers/`), Amazon (`developer.amazon.com/amazonbot`), Common Crawl (`commoncrawl.org/ccbot`), RSL 1.0 (`rslstandard.org/rsl`).

**Medido**
- `curl` a la maqueta en `http://localhost:8766/maqueta/`: la home no contiene «Soy Nando» en el HTML servido; el artículo solo contiene el `<noscript>`.

**No pude hacer**
- Probar qué responde hoy cada asistente a las preguntas de §3.7 (no tengo acceso a ellos desde aquí); lo dejo como lista para el dueño.
- Confirmar con fuente primaria los controles de Bing/Copilot (`noarchive`, `nocache`, `__usage_ai-training`): solo hay blogs secundarios. Lo marco como «verificar».
- Confirmar qué fabricantes leen `Content-Signal` o la directiva `License:` de RSL. La documentación de RSL no nombra a ningún fabricante que la respete. Son señales válidas y baratas, no garantías.
- Ver los 11 artículos renderizados: esta auditoría es de contenido y estructura, no de aspecto.

**Grado de certeza.** *Documentado* = lo dice el fabricante. *Práctica común* = lo cuentan estudios y blogs del sector. *Criterio mío* = mi opinión. Nadie puede prometer una cita.

---

## 3. Hallazgos

### 3.1 Cambiar (antes de publicar)

| Id | Qué | Evidencia | Arreglo | ¿Maqueta o Astro? | Quién decide |
|---|---|---|---|---|---|
| **C1** | Sin JavaScript la maqueta no tiene contenido: todo se monta por JS. | `maqueta/blog/articulo/index.html:19-21`: el `<body>` solo trae `<noscript>`. `curl http://localhost:8766/maqueta/blog/articulo/?a=margaret-hamilton` devuelve solo ese `<noscript>`. La home (`maqueta/index.html`) tiene los títulos de sección pero `#bio-text`, `#works`, `#blog-rows` y `#socials` van vacíos. Que GPTBot, ClaudeBot o PerplexityBot no ejecutan JS es *práctica común*, no documentación del fabricante. Googlebot sí renderiza, pero más tarde y con coste. | HTML estático por página: `h1`, entradilla, cuerpo, autor, fecha y enlaces ya en el HTML, con los puntos como mejora progresiva. Ya está en el plan (Fase 10: «Sin JS»). Añadir una comprobación específica: `curl` de cada plantilla debe contener el `h1` y el primer párrafo. | **Astro** | Plan |
| **C2** | La reserva de uso para IA no existe en la maqueta (informe legal M10). | Maqueta: sin `robots.txt` ni `license.xml`. WordPress hoy: `Content-Signal: search=yes, ai-input=yes, ai-train=no`, directiva `License:`, `license.xml` RSL (cita y búsqueda sí; entrenar solo con licencia de pago pactada) y bloqueo por rastreador. El `robots.txt` que genera `build.mjs` para `nandovejer.github.io` es `Allow: /` sin más. | Llevar a Astro `robots.txt` (propuesta en §3.5), `license.xml` y `<link rel="license" href="/license.xml" type="application/rsl+xml">` en cada página. Ojo: GitHub Pages no permite cabeceras HTTP (`Link: rel="license"`, `X-Robots-Tag`); con Cloudflare Pages sí (`_headers`). Coherente con L4 de legal: contenido «todos los derechos reservados». | **Astro** | Dueño (decidido: Q20) |
| **C3** | Todas las páginas de la maqueta llevan `<meta name="robots" content="noindex">`. | `maqueta/index.html:5` y cada plantilla (`blog/articulo/index.html:5`). Es lo correcto para una maqueta; sería un desastre llevarlo a producción. | No portarlo. Prueba en el CI de Astro: ninguna página de `dist/` contiene `noindex`, salvo la 404. | **Astro** | Plan |
| **C4** | Las etiquetas de 6 de 11 artículos no son de su tema; 2 artículos no tienen ninguna. | `maqueta/shared/blog.json`, campo `tags`. *Aprendiendo Web Components* lleva `carnaval-de-cadiz`, `gestion-de-equipos`, `poesia-contemporanea` y `privacidad`. Los cuatro análisis de Carnaval (Oveja Negra, Ciudad Invisible, Sumisos, Renacidos) llevan `css`, `javascript`, `web-components` o `gestion-de-equipos`. *Tu empresa necesita un sistema de diseño* lleva `carnaval-de-cadiz` y `poesia-contemporanea`. Sin etiquetas: *pseudoclases CSS* y *Huella digital*. Parece un arrastre de la importación de WordPress. Efecto: los «relacionados» (`blog.js`, `related`: categoría + etiquetas compartidas) mezclan temas y las páginas de etiqueta se contaminan. | Rehacer las etiquetas a mano, artículo a artículo (propuesta en P2). Después, rehacer `relacionados` y comprobar las páginas de etiqueta. | **Maqueta** (contenido, se copia tal cual) | **Dueño** |
| **C5** | Dos artículos con el mismo título, el mismo arranque y fechas que no cuadran. | `blog.json`: `introduccion-a-la-ia` (2026-10-02) y `introduccion-a-la-ia-2` (2026-10-15) comparten título «¿Hay alguien dentro? Introducción a la inteligencia artificial para todos» y el primer párrafo (Viena, 1770). El `-2` es más corto (25 párrafos y 5 secciones frente a 46 y 12) y su entradilla promete «qué hay dentro» y «qué haces con lo que le cuentas»; el primero, «cómo aprende». El `feed` vivo da al `-2` el 2 de octubre; `llms.txt` y `blog.json` le dan el 15. Un modelo no sabe cuál citar; un buscador, cuál indexar. | Decidir: (a) dejar una y redirigir la otra, con `canonical`; (b) dos títulos distintos (por ejemplo «versión larga» y «versión corta») y cada uno con su `canonical` propio; (c) dejar las dos con `rel="canonical"` del `-2` al primero. Y fijar **una** fecha de publicación por artículo. El `fact-checker` ya tiene las fechas. | **Las dos**: contenido aquí, redirección y `canonical` en Astro | **Dueño** |
| **C6** | Dos entradillas no dicen de qué trata el artículo. La entradilla es lo que se muestra bajo el `h1` y lo que se va a usar de `description` y de `BlogPosting.description`. | *Sumisos*: «El bombo cede a la caja los platillos en forma de tintineo, las guitarras preparan la llegada del punteao…» (es un trozo del cuerpo, no un resumen). *Renacidos*: «Interpela directamente al que escucha, poniendo el foco en la naturaleza de la vida…» (sin sujeto: no dice la agrupación, el autor, el año ni que es un análisis). Los otros tres análisis sí nombran la agrupación o al autor. | Reescribir la entradilla de esos dos, en una o dos frases y con: qué agrupación, de quién es la letra, qué año del COAC, qué defiende el análisis. Texto del dueño; no se inventa nada (la información está en el artículo y en los `cite`: «Letra: Antonio Martínez Ares, «Los sumisos», COAC 2022» y «Letra: Miguel Ángel García Argüez, «Los renacidos», COAC 2022»). | **Maqueta** | **Dueño** (redacta) |
| **C7** | Las URLs de WordPress (`https://soynando.com/<slug>/`) ya están en los índices y en los enlaces. El plan por defecto las mueve a `/blog/<slug>/` y, en GitHub Pages, solo puede redirigir con `meta refresh`. | `plan-soynando-astro.md`: líneas 134-141 (rutas), U1 (línea 433), D2 (línea 348: «GitHub Pages no permite redirecciones de servidor»). Un 301 real traspasa la señal a las URLs nuevas; un `meta refresh` es más débil y algunos rastreadores simples ni lo siguen (*práctica común*). Lo mismo pasa con `/feed/`. | O bien **mantener `/<slug>/`** en la raíz (U1, alternativa), o bien **Cloudflare Pages con 301 reales** (D2). Con GitHub Pages y `/blog/<slug>/`, cada artículo perdería la mayor parte de las citas que haya ganado. | **Astro** | **Dueño** (U1 y D2) |

### 3.2 Mejorar

| Id | Qué | Evidencia | Arreglo | ¿Maqueta o Astro? | Quién decide |
|---|---|---|---|---|---|
| **M1** | Autor y fecha no están juntos arriba del artículo, y no hay fecha de actualización. | `blog.js:562-565`: la cabecera tiene «Publicado» y «Lectura»; el autor está al final (`blog.js:574-578`, `section.author`, con nombre, `kicker` y «Más sobre mí»). No hay `modified` en `blog.json` (comprobado: `p.get('modified')` es `None` en los 11). Un modelo que cita busca a la vez *quién* y *cuándo*. Hay artículos de 2020-2023 («Figma es la herramienta estándar en 2023») que piden fecha de revisión. | Añadir en `post__meta` una tercera pareja «Autor: Nando Muñoz» (con enlace a la bio) y, **solo si el dueño tiene la fecha real**, «Actualizado». No inventar fechas de actualización. El plan ya pregunta (W9) si WP conserva `modified`. | **Maqueta** (visible) + **Astro** (`dateModified`) | Dueño (fechas) |
| **M2** | Datos estructurados: ninguno todavía. | Viven en `build.mjs` para el Cassette; la maqueta no tiene. WordPress (Yoast) ya publica `Article` con `author`, `datePublished`, `wordCount`, `keywords`, `articleSection`. Google dice que para AI Overviews/AI Mode **no hace falta marcado especial** y que debe coincidir con el texto visible; sirve sobre todo para desambiguar la entidad y para otros motores (*criterio mío*). | Ver el esquema de §3.8: `WebSite` + `Person` (con `sameAs`, `alternateName`, `knowsAbout`) en la home; `ProfilePage` con `mainEntity` = la persona; `BlogPosting` por artículo (`author` por `@id`, `datePublished`, `dateModified` si hay, `inLanguage`, `image`, `keywords`, `isPartOf`); `SoftwareSourceCode` por proyecto (`codeRepository`, `programmingLanguage`, `url`, `dateCreated`). Mismos `@id` en todas las páginas. | **Astro** | Plan |
| **M3** | Entidad: nombre y puesto no son idénticos en todas partes. | Nombre: «Nando Muñoz» en el sitio; «Fernando Muñoz» en el titular de la licencia de LUZ (`informe-legal` D8) y en `data/pronounce.json:87`; «Nando Munoz» (sin ñ) en 1 de 10 entradas del `feed` vivo (desaparece al generarlo desde `blog.json`, que no lleva autor). Nada en el sitio une «Nando» con «Fernando». Puesto: «Tech lead de frontend» (`site.json` kicker), «Tech Lead Frontend en Madrid» (`title`), «Senior Frontend Lead» (WP `description` y `llms.txt`). Usuario: `nandovejer` en GitHub, X y LinkedIn; dominio `soynando`. | Elegir **un** puesto y usarlo en todo. Decidir si se declara el nombre completo (una vez, en créditos o en privacidad, por ejemplo «Nando (Fernando) Muñoz») y, si sí, ponerlo como `alternateName` en el JSON-LD. Enlazar las tres identidades (`nandovejer`, `soynando.com`, el nombre) en la misma `Person`. | **Las dos** (texto aquí, `alternateName` en Astro) | **Dueño** (P3) |
| **M4** | Qué contestaría hoy un modelo a «¿quién es Nando Muñoz?» solo con este sitio: lo esencial, pero con huecos. | Al renderizar: tech lead de frontend, más de diez años, grandes marcas (sin nombrarlas), AEM y SFCC, Cádiz y Madrid (**solo en el `kicker`**, no en la bio), poemario *Leyendo Claroscuros*, análisis de popurrís del Carnaval de Cádiz. Faltan, cerca de la cabecera: dónde está, enlaces a GitHub y LinkedIn (hoy están al final, en «Escríbeme», y en el pie). El `deck` es lo primero del DOM (`index.html`, `hero__deck` va antes del `h1`) y es un juego de palabras: «Código y palabra solamente con IA, chirrÍA». Un resumen automático puede tomarlo como afirmación. | En Astro: la primera línea de texto indexable de la home debe ser la frase «Nando Muñoz es tech lead de frontend… en Cádiz y Madrid» (en `meta description` y en `Person.description`, que ya existe en `metaDescription`). Poner el `h1` y el `kicker` antes del `deck` en el DOM (el orden visual se mantiene con CSS). Si el dueño quiere, una frase en la bio con el lugar. Nombrar marcas o empleador solo si lo decide él. | **Las dos** | Dueño |
| **M5** | Los titulares de los análisis del Carnaval no dicen nada fuera de contexto. | `blog.json`: *Ciudad Invisible* → «Primera cuarteta», «Segunda cuarteta»…; *Oveja Negra* → «EL NACIMIENTO DE LA OVEJA NEGRA…» en mayúsculas; *Sumisos* y *Renacidos* sí llevan una idea tras «Primera cuarteta:». Un modelo que lee «Segunda cuarteta» como respuesta suelta no sabe de qué comparsa. Los titulares de los otros artículos (Hamilton, IA, Web Components, sistema de diseño, huella digital) sí son afirmaciones o preguntas. | Hacer como en *Sumisos* y *Renacidos*: «Segunda cuarteta: <idea>». Las mayúsculas de *Oveja Negra*, a minúscula (también las ve el `corrector`). Es el texto del dueño. | **Maqueta** | Dueño |
| **M6** | Los análisis del Carnaval son material de referencia (agrupaciones, autores, años): falta el marco en una línea visible. | Cada análisis tiene su `cite` de la letra, pero no hay un dato de ficha: agrupación, modalidad (comparsa), autor, concurso y año, enlace al vídeo. | Una línea bajo la entradilla, por ejemplo «Comparsa «La ciudad invisible» (COAC 2023), de Antonio Martínez Ares». En Astro, `about` en el `BlogPosting` con el nombre de la agrupación y del autor. Sin inventar nada: sale de los `cite` y del vídeo incrustado. | **Las dos** | Dueño |
| **M7** | Proyectos: son fichas fáciles de entender, pero les falta algún dato de registro. | `projects.json`: 13 proyectos, todos con año, tecnologías y `repo`; 9 con `demo`. Todos empiezan con una frase que define el proyecto (comprobado en los 13). Faltan: licencia, estado (activo, estable, archivado) y última actualización. El `kicker` es la categoría («Sistema de diseño»), no un dato. | Añadir licencia y estado **solo si salen del README o del repositorio** (el `fact-checker` las verifica). `SoftwareSourceCode`: `codeRepository`, `programmingLanguage`, `license`, `dateCreated`. | **Las dos** | Dueño |
| **M8** | `llms.txt`: ver veredicto en §3.6. | WordPress hoy sirve uno, pero desfasado: lista una sola categoría («Hablo de código y gestión»), repite el artículo duplicado, y el listado de proyectos no coincide con `projects.json` (HelpDev, Octuweb, cai, api-coac…). El `license.xml` lo cita: `<alternate type="text/markdown">https://soynando.com/llms.txt</alternate>`. | Generarlo **en el build** desde `site.json`, `projects.json` y `blog.json` (misma fuente que el sitio, sin mantenerlo a mano). Si no se sirve, quitar el `<alternate>` del `license.xml`. | **Astro** | Dueño |
| **M9** | Descubrimiento: sitemap, feed y alternates. | Plan Fase 9: `sitemap.xml.ts` con alternates, `rss.xml.ts`, redirección de `/feed/`. El feed vivo de WP solo da el extracto, no el texto entero. | `lastmod` real en el sitemap (con la fecha de actualización si existe; si no, la de publicación). `<link rel="alternate" type="application/rss+xml">` en todas las páginas. Feed con texto completo si el dueño quiere que se lea sin entrar (a decidir; para citar, lo contrario puede ser mejor). | **Astro** | Dueño |
| **M10** | El sitio antiguo `nandovejer.github.io` (Cassette y demás) no tiene reserva IA y puede duplicar contenido. | `robots.txt` generado por `build.mjs`: `User-agent: * / Allow: /` y nada más. Tiene `sitemap.xml` con es/en. Si sigue publicado cuando soynando.com esté en Astro, los rastreadores de entrenamiento lo recorren sin límite y la bio/proyectos salen duplicados bajo otro dominio. | Cuando exista soynando.com nuevo: o bien redirigir `nandovejer.github.io` a él, o bien ponerle la **misma** política (§3.5) y `canonical` hacia soynando.com. | **Astro** (y `build.mjs`) | Dueño (P5) |
| **M11** | Señales nuevas de entrenamiento (AIPREF) para añadir cuando existan. | Google dice que soportará `user-agent: __usage_ai-training` «a principios de 2027» (documentación de Google). Bing: las fuentes secundarias hablan del 1 de febrero de 2027 y de que `noarchive`/`nocache` dejarán de contar el 1 de marzo de 2027 (**verificar en Bing Webmaster**). | Revisar `robots.txt` y los `meta` en el primer trimestre de 2027. Hasta entonces no hay nada que hacer. Hoy, para Copilot, el control que existe es por página (`noarchive`/`nocache`); como se quiere **aparecer**, no se usa. | **Astro** | Dueño |

### 3.3 Dejar como está

| Id | Qué se ha comprobado | Por qué está bien | ¿Maqueta o Astro? |
|---|---|---|---|
| **D1** | La política «citar sí, entrenar no» y su precedente en WordPress. | `robots.txt` vivo: bloquea `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `meta-externalagent`, `Bytespider` y `Amazonbot`; deja pasar `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `ChatGPT-User`, `Claude-User` y `Perplexity-User`; añade `License:` y deja `/license.xml` accesible a los bloqueados. Cuadra con la documentación de cada fabricante (salvo detalles de §3.5). | Astro (trasladar) |
| **D2** | Cada artículo tiene una entradilla visible bajo el `h1`. | 11 de 11 tienen `excerpt` de entre 111 y 241 caracteres, y se muestran como `post__deck` (`blog.js:557`). Es justo el resumen que un modelo puede copiar. (Dos están flojas: C6.) | Las dos |
| **D3** | Bloque de autor al final de cada artículo. | `blog.js:574-578`: «Escrito por», nombre, `kicker` y enlaces a la bio y a «Escríbeme». Es visible y está en el HTML tras el cuerpo (mejorable, M1). | Maqueta |
| **D4** | Letras citadas bien separadas de lo que dice el autor. | Los 4 análisis llevan las letras en `pull` (`<blockquote>` dentro de `<figure>`) con su `cite`: «Letra: Antonio Martínez Ares, «La ciudad invisible», COAC 2023». Así un modelo distingue lo citado de la opinión de Nando. Los artículos de privacidad usan «Fuente:» con enlace. | Las dos |
| **D5** | Estructura de los titulares en los artículos técnicos. | *Hamilton* (5 `h2`), *IA* (5 y 12), *Web Components* (8), *sistema de diseño* (12), *huella digital* (12): son afirmaciones o preguntas («Por qué se equivoca con tanta seguridad»). Un modelo puede citar una sección por su titular. | Maqueta |
| **D6** | Fuentes enlazadas. | Los artículos largos enlazan sus fuentes: 57 enlaces en *IA-2*, 49 en *IA*, 27 en *huella digital*, 12 en *Sumisos*; incluso el más corto lleva 2. Los enlaces externos llevan `rel="noopener"` y abren aparte (`blog.js:513`). | Maqueta |
| **D7** | Proyectos que arrancan con una definición. | Los 13 `body[0]` abren con qué es («LUZ… es un sistema de diseño en HTML, CSS y módulos ES», «Una librería pequeña y sin dependencias para saber el subtipo exacto…»). Es el patrón «primero la respuesta». | Maqueta |
| **D8** | Transparencia sobre la IA y cero rastreo propio. | El lema («Escrito por un humano. Programado por un humano más la IA: ella ayuda, pero no decide.») y la ausencia de anuncios, analíticas y cookies propias dan una señal de confianza clara a un modelo y a un lector. No hace falta cambiar nada. | Maqueta |
| **D9** | Idiomas. | El plan ya prevé `lang="es"` + aviso + `canonical` a la versión española cuando un artículo no está en inglés (`plan-soynando-astro.md:135`) y `hreflang` solo donde hay traducción. Correcto: no se debe declarar `hreflang` entre páginas que no son traducción una de otra. Comprobar en Astro (`inLanguage` en el JSON-LD). | Astro |

*Etiquetas HTML «noai»:* no se recomienda añadir `<meta name="robots" content="noai">`; no es un estándar ni lo documenta ningún fabricante (*criterio mío*). La reserva va en `robots.txt` y en `license.xml`.

### 3.4 Medición sin analítica

El sitio no tiene analítica y no debe tenerla (L-cookies). Cómo saber si un asistente lo cita:

1. **Preguntas de prueba**, cada pocas semanas, en ChatGPT (con búsqueda), Perplexity, Gemini, Copilot, Claude (con búsqueda) y Google (AI Mode): «¿Quién es Nando Muñoz, tech lead de frontend?», «¿Qué es LUZ, el sistema de diseño sin dependencias?», «Análisis del popurrí de Los Sumisos 2022», «Análisis del popurrí La ciudad invisible 2023, Martínez Ares», «¿Hay alguien dentro? Introducción a la inteligencia artificial para todos», «Margaret Hamilton y el error 1202 del Apolo 11». Anotar: si aparece, si enlaza a soynando.com y si la afirmación es correcta. Es la medida más fiable que hay.
2. **Bing Webmaster Tools → AI Performance** (vista previa pública desde febrero de 2026, según blogs del sector; verificar en el panel): citas en Copilot y en los resúmenes de Bing, por consulta y por página. No cubre ChatGPT, Perplexity ni Google. Requiere verificar el sitio, sin analítica en la web.
3. **Search Console**: según la documentación de Google, las funciones de IA de Google se cuentan en el rendimiento de búsqueda normal, sin informe aparte (verificar al configurar).
4. **Registros del servidor y referentes**: GitHub Pages no da registros. Cloudflare Pages sí (analítica de servidor sin cookies; **revisar con legal** si hay dato personal en los registros). Algunos asistentes añaden `utm_source=chatgpt.com` a los enlaces que dan (*práctica común*, no documentada por OpenAI): se vería en los registros o en una petición con ese parámetro.
5. **Rastreadores reales**: en los registros, buscar `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Googlebot` y los que **no deberían** estar (`GPTBot`, `ClaudeBot`, `CCBot`); la lista de IP de Anthropic está en `claude.com/crawling/bots.json` y la de Common Crawl en `index.commoncrawl.org/ccbot.json`.

### 3.5 `robots.txt` propuesto

Ordenado por lo que hace cada rastreador según su documentación. Basado en el del WordPress, con tres cambios: grupos juntos (RFC 9309 permite varios `User-agent` por grupo), `Content-Signal` repetido en el grupo permitido (un grupo con nombre **no hereda** el de `*`), y tres rastreadores nuevos (`Amzn-SearchBot`, `meta-webindexer`, `Applebot`).

```
# soynando.com · citar sí, entrenar no.
# Políticas de uso y licencia: https://soynando.com/license.xml

User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

# Búsqueda y respuestas con enlace: permitido
User-agent: OAI-SearchBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
User-agent: meta-webindexer
User-agent: Amzn-SearchBot
User-agent: Applebot
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

# Lecturas pedidas por una persona: permitido
# (no obedecen siempre el robots.txt; se dejan escritas por claridad)
User-agent: ChatGPT-User
User-agent: Claude-User
User-agent: Perplexity-User
User-agent: Amzn-User
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

# Entrenamiento de modelos: no permitido
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: meta-externalagent
User-agent: Amazonbot
User-agent: Bytespider
Disallow: /
Allow: /license.xml

License: https://soynando.com/license.xml
Sitemap: https://soynando.com/sitemap.xml
```

Qué dice cada fabricante (consultado hoy) y de qué se ha deducido cada grupo:

| Rastreador | Qué hace (documentación) | Grupo |
|---|---|---|
| `GPTBot` | Rastrea contenido que puede usarse para entrenar los modelos de OpenAI. | Bloqueado |
| `OAI-SearchBot` | Muestra sitios en la búsqueda de ChatGPT; si se excluye, el sitio no sale en las respuestas de búsqueda. Cada ajuste es independiente del de `GPTBot`. | Permitido |
| `ChatGPT-User` | Visita páginas cuando una persona se lo pide a ChatGPT. «Las reglas de robots.txt pueden no aplicarse.» | Permitido (no se puede bloquear por `robots.txt`) |
| `ClaudeBot` | Recoge contenido público que puede usarse para entrenar a Claude. | Bloqueado |
| `Claude-SearchBot` | Indexa para mejorar los resultados de búsqueda; bloquearlo reduce la visibilidad. | Permitido |
| `Claude-User` | Recupera páginas cuando una persona pregunta; bloquearlo reduce la visibilidad. | Permitido |
| `PerplexityBot` | Muestra y enlaza sitios en los resultados de Perplexity; «no se usa para rastrear contenido para modelos fundacionales». | Permitido |
| `Perplexity-User` | Visita páginas a petición de una persona; en general ignora `robots.txt`. | Permitido |
| `Google-Extended` | **Token de control, no rastreador.** Decide si el contenido que Google ya rastrea puede entrenar futuros modelos Gemini **y** si sirve de «grounding» en la app Gemini y en Vertex AI. No afecta a la Búsqueda ni al posicionamiento. | Bloqueado (ver P1) |
| `Googlebot` | Alimenta la Búsqueda, incluidos AI Overviews y AI Mode: la página solo necesita estar indexada y poder mostrar un fragmento. Se controla con `nosnippet`/`max-snippet`, no con `Google-Extended`. | Permitido (en `*`) |
| `Applebot` | Búsqueda de Spotlight, Siri y Safari; su dato puede dar contexto a respuestas de IA de Siri (se opta por salir con `nosnippet`). | Permitido |
| `Applebot-Extended` | No rastrea; controla si Apple usa lo ya rastreado para entrenar. No cuenta para el posicionamiento. | Bloqueado |
| `meta-externalagent` | Entrenamiento de modelos de Meta. | Bloqueado |
| `meta-webindexer` | Búsqueda de Meta AI; ayuda a citar y enlazar. | Permitido (**nuevo**) |
| `meta-externalfetcher` | Lectura a petición; puede saltarse `robots.txt`. | No se nombra |
| `Amazonbot` | «Mejorar productos y servicios»; puede entrenar modelos de Amazon. | Bloqueado |
| `Amzn-SearchBot` | Búsqueda de productos de Amazon, incluido Alexa; no entrena. | Permitido (**nuevo**) |
| `Amzn-User` | Lectura a petición; puede ignorar reglas. | Permitido |
| `CCBot` | Common Crawl: archivo abierto de rastreos, del que salen muchos conjuntos de entrenamiento. Se bloquea con `Disallow: /`. | Bloqueado |
| `Bytespider` | ByteDance. **No he podido verificarlo en documentación del fabricante**: se mantiene por coherencia con WordPress y porque es de las que se citan como poco respetuosas con `robots.txt` (*práctica común*). | Bloqueado (verificar) |
| `Google-CloudVertexBot` | Rastreo que pide el dueño de un sitio para construir agentes de Vertex AI; no afecta a la Búsqueda. | No se nombra (no aplica) |

**Notas.** (1) `Content-Signal` es una extensión (Cloudflare, con las tres claves `search`, `ai-input` y `ai-train`): Anthropic dice que ya respeta una señal «sin entrenamiento»; no he podido comprobar quién más la lee. Es una señal válida, no un cortafuegos. (2) `License:` es la directiva de RSL 1.0 (Recomendación del 2025-12-10); su documentación no nombra a ningún fabricante que la respete. Se mantiene como declaración legible por máquina (informe legal M10; la Directiva (UE) 2019/790, art. 4.3, pide que la reserva sea legible por máquina). (3) Lo que no obedece `robots.txt` (lecturas a petición, o crawlers que lo ignoren) solo se frena con reglas del servidor o del CDN; **no es lo que se pide** (se quiere que citen), así que no hay nada que hacer. (4) Probar el archivo con las IP y los nombres reales en los registros (§3.4).

### 3.6 Veredicto sobre `llms.txt`

**Honestamente: bajo valor probado, coste casi cero si se genera, no merece ni una hora a mano.**

- **A favor (poco):** es un índice en Markdown legible por personas y por agentes; ya existe en el WordPress y el `license.xml` lo cita.
- **En contra (documentado):** Google no lo soporta ni piensa hacerlo (Gary Illyes, julio de 2025) y John Mueller lo ha llamado «puramente especulativo»; su guía de optimización de búsqueda de IA de mayo de 2026 lo da por prescindible (esto último, según un resumen de terceros). **Ningún fabricante (OpenAI, Anthropic, Google, Meta, Perplexity) ha confirmado que su respuesta en producción lo lea.** Una fuente en italiano afirma que Anthropic lo respeta en Claude Desktop y claude.ai; **no lo he podido comprobar** en la documentación de Anthropic. Un análisis cita que los bots lo piden en ~0,1 % de los casos.
- **Recomendación:** generarlo en Astro (`llms.txt.ts`) con el mismo texto que el sitio (bio, secciones, proyectos con una línea, artículos con fecha y entradilla, licencia, enlaces a perfiles), sin mantener nada a mano. Es un punto de entrada, no una promesa. No invertir en `llms-full.txt` ni en copias `.md` de cada artículo salvo que la medición (§3.4) muestre que alguien los pide.
- **Si no se sirve**, quitar la línea `<alternate>` del `license.xml`.

### 3.7 Lo que un modelo puede responder hoy

| Pregunta | Con la maqueta tal cual (sin JS) | Con Astro (HTML estático) |
|---|---|---|
| ¿Quién es Nando Muñoz? | Solo «Nando Muñoz» (título). Nada más. | Tech lead de frontend con más de diez años, AEM y SFCC, Cádiz y Madrid, poemario *Leyendo Claroscuros*, análisis del Carnaval; enlaces a GitHub, LinkedIn y X (M4). |
| ¿Qué hizo Nando Muñoz con un sistema de diseño? | Nada. | LUZ (proyecto con repo y demo) y el artículo *Tu empresa necesita un sistema de diseño*. |
| ¿Quién analizó el popurrí de Los Sumisos y qué dice? | Nada. | Hoy, un texto que no dice de qué agrupación habla en la entradilla (C6). Con C6 arreglado, sí. |

### 3.8 Esquema de datos estructurados (para Astro)

Resumen; la redacción exacta la decide la implementación. Todo debe coincidir con el texto visible.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": "https://soynando.com/#website", "url": "https://soynando.com/", "name": "Nando Muñoz", "inLanguage": ["es", "en"], "publisher": {"@id": "https://soynando.com/#person"} },
    { "@type": "Person", "@id": "https://soynando.com/#person", "name": "Nando Muñoz", "alternateName": ["Nando", "nandovejer"],   // + «Fernando Muñoz» solo si el dueño lo decide (P3)
      "jobTitle": "Tech lead de frontend", "url": "https://soynando.com/", "address": {"@type": "PostalAddress", "addressLocality": "Cádiz", "addressCountry": "ES"},
      "knowsAbout": ["frontend", "accesibilidad web", "Adobe Experience Manager", "Salesforce Commerce Cloud", "Carnaval de Cádiz"],
      "sameAs": ["https://github.com/nandomunoz", "https://www.linkedin.com/in/nandovejer", "https://x.com/nandovejer", "https://www.facebook.com/nandovejer"] },
    { "@type": "ProfilePage", "@id": "https://soynando.com/#profile", "mainEntity": {"@id": "https://soynando.com/#person"}, "dateModified": "…" }
  ]
}
```

Por artículo: `BlogPosting` con `headline`, `description` (la entradilla), `datePublished`, `dateModified` (solo si es real), `author` y `publisher` por `@id`, `image`, `inLanguage`, `keywords` (las etiquetas corregidas, C4), `isPartOf` (`Blog`), `license` (URL del `license.xml`) y, en los análisis, `about`. Por proyecto: `SoftwareSourceCode` (`codeRepository`, `programmingLanguage`, `url`, `author`) o `CreativeWork`/`Book` donde no sea código (*Leyendo Claroscuros*). Comprobar `address`: **el dueño decide si publica la ciudad** (ya aparece en el `kicker`, no en un dato postal); si no, quitar `address`.

---

## 4. Preguntas para el dueño

1. **P1 · ¿Bloqueas `Google-Extended`?** Es lo coherente con «entrenar no» y es lo que hace WordPress hoy. Coste: según la documentación de Google, ese token también corta que el contenido sirva de base («grounding») a las respuestas de la app Gemini y de Vertex. **Los AI Overviews y el AI Mode no se ven afectados**, porque dependen de Googlebot. Mi recomendación (*criterio mío*): bloquearlo y aceptarlo, porque el entrenamiento es lo que te importa.
2. **P2 · Etiquetas (C4).** ¿Quieres revisarlas tú o prefieres una propuesta? Una que parece clara: los 4 análisis de Carnaval → `carnaval-de-cadiz` (+ `poesia-contemporanea` si lo decides); *Web Components* → `web-components`, `javascript`, `css`; *sistema de diseño* → `gestion-de-equipos` y `web-components` si procede; *pseudoclases* → `css`, `javascript`; *huella digital* → `privacidad`; los dos de IA → `inteligencia-artificial`, `iahoraque`, `privacidad`.
3. **P3 · ¿Dices tu nombre completo?** Hoy «Nando» y «Fernando» no se relacionan en ningún lugar del sitio. Si declaras «Fernando» (en créditos o privacidad, una vez), un modelo puede unir las dos identidades. Si no quieres, el `alternateName` se queda sin él.
4. **P4 · Los dos artículos de IA (C5).** ¿Se queda uno, se redirige el otro, o los diferencias? ¿Cuál es la fecha de publicación correcta de cada uno?
5. **P5 · `nandovejer.github.io`.** Cuando soynando.com esté en Astro, ¿se redirige o se queda con la misma política que el nuevo?
6. **P6 · URLs y hosting (C7).** ¿`/<slug>/` en la raíz o `/blog/<slug>/` con 301 reales (Cloudflare Pages)? Para citas ya ganadas, es lo que más pesa.
7. **P7 · ¿Fechas de actualización reales?** Si WordPress las tiene (`modified`), ¿se usan?
8. **P8 · Marcas y empleador.** La bio dice «grandes marcas» sin nombrarlas. Para un modelo, nombrar una sola da más contexto, pero solo si tú quieres.
9. **P9 · Feed.** ¿Texto completo o extracto en el nuevo RSS?

---

## 5. Lista para pegar en la Fase 10 del plan de Astro

#### GEO (informe `.ai/plan/informe-geo-maqueta.md`)
- [ ] Sin JS: `curl` de cada plantilla (home, proyecto, artículo, categoría, etiqueta, política) contiene el `h1`, la entradilla o la bio, la fecha y los enlaces; ninguna página de `dist/` contiene `noindex` salvo la 404 (C1, C3)
- [ ] `robots.txt` publicado con la política de §3.5: grupos de búsqueda y lecturas a petición permitidos, grupos de entrenamiento con `Disallow: /` y `Allow: /license.xml`, `Content-Signal` en cada grupo permitido, `License:` y `Sitemap:`; `curl -s https://soynando.com/robots.txt` lo devuelve (C2)
- [ ] `license.xml` (RSL) en la raíz y `<link rel="license" href="/license.xml" type="application/rsl+xml">` en todas las páginas; si no se sirve `llms.txt`, quitar el `<alternate>` del `license.xml` (C2, M8)
- [ ] `llms.txt` generado en el build desde `site.json`, `projects.json` y `blog.json` (sin copia a mano) (M8)
- [ ] Cada artículo declara un único `datePublished` coherente en HTML, JSON-LD, RSS y sitemap; los dos artículos de IA resueltos con `canonical` o redirección (C5)
- [ ] Etiquetas de los 11 artículos revisadas y las páginas de etiqueta y los «relacionados» regenerados (C4)
- [ ] Entradillas de *Sumisos* y *Renacidos* reescritas con agrupación, autor y año (C6)
- [ ] Redirecciones de las URLs de WordPress (`/<slug>/`, `/feed/`, `/category/…`, `/tag/…`) comprobadas con `curl -I` (301 o `meta refresh` + `canonical`, según D2) (C7)
- [ ] JSON-LD (`WebSite`, `Person` con `sameAs`, `ProfilePage`, `BlogPosting`, `SoftwareSourceCode`) en las páginas que corresponden, con los mismos `@id` y válido en el validador de Schema.org; coincide con el texto visible (M2)
- [ ] Autor y fecha juntos bajo el `h1` de cada artículo; «Actualizado» solo con fecha real (M1)
- [ ] `sitemap.xml` con `lastmod` real y alternates `es`/`en` solo donde hay traducción; `<link rel="alternate" type="application/rss+xml">` en todas las páginas (M9, D9)
- [ ] Una sola redacción del puesto y del nombre en `site.json`, `<title>`, meta, JSON-LD y `llms.txt` (M3)
- [ ] `nandovejer.github.io`: redirige a soynando.com o lleva la misma política que el nuevo `robots.txt` (M10)
- [ ] Medición (§3.4): preguntas de prueba hechas en la semana de lanzamiento y 4 semanas después; sitio verificado en Bing Webmaster Tools
- [ ] Revisar `robots.txt` y los `meta` en el primer trimestre de 2027 (AIPREF de Google y Bing) (M11)

---

### Fuentes (consultadas el 2026-11-16)
- OpenAI, rastreadores: https://developers.openai.com/api/docs/bots
- Anthropic, rastreo y bloqueo: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Google, rastreadores comunes (`Google-Extended`): https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- Google, funciones de IA en la Búsqueda: https://developers.google.com/search/docs/appearance/ai-features
- Perplexity: https://docs.perplexity.ai/guides/bots
- Apple, `Applebot`: https://support.apple.com/en-us/119829
- Meta: https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/
- Amazon: https://developer.amazon.com/amazonbot
- Common Crawl: https://commoncrawl.org/ccbot
- RSL 1.0: https://rslstandard.org/rsl
- `Content-Signal` (Cloudflare): https://blog.cloudflare.com/content-signals-policy/ · generador https://contentsignals.org
- Bing/Copilot y `llms.txt`: búsquedas en blogs del sector (secundarias); marcadas «verificar» en el texto.
