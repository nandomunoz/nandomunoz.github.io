# Informe de seguridad: maqueta Trama y repo

Auditor: `security-auditor`. Fecha: 2026-11-16. Rama `proto/home`, carpeta `maqueta/` (más la raíz del repo y `.ai/soynando/raw`). Solo informa: no se ha editado nada más que este archivo.

## 1. Resumen

**Veredicto.** Para un sitio estático sin login, sin formularios que envíen datos y sin backend, la maqueta está en muy buen estado. No hay XSS alcanzable, no hay llamadas a terceros sin consentimiento, no hay secretos en el repo ni en los 251 commits, y el JS vendorizado de LUZ es idéntico byte a byte al de npm. Lo que falta no es código inseguro sino **defensa en profundidad**: hoy ninguna página lleva CSP ni cabeceras (GitHub Pages no las admite), y dos detalles de la maqueta chocarían con una CSP estricta o romperían la página 404 con URLs malformadas. El diseño de la CSP de abajo se ha **medido** inyectándola en 18 URLs (con y sin consentimiento de YouTube): cero infracciones.

**Los cinco hallazgos más importantes**

1. **C1.** El formulario de búsqueda de la 404 usa un manejador en línea (`onsubmit: 'return false'`, `blog.js:299`). Bajo cualquier CSP sin `'unsafe-inline'` el navegador lo bloquea y al pulsar Intro la página navega a `?q=…` (medido). Arreglo de una línea.
2. **C2.** No hay cabeceras de seguridad ni CSP en ningún sitio (medido en `nandovejer.github.io`: sin CSP, sin `X-Content-Type-Options`, sin `Referrer-Policy`, sin HSTS en la respuesta). La propuesta exacta para Cloudflare Pages y la de `<meta>` para GitHub Pages están en la sección 3.
3. **C3.** Una URL con `%` mal formado (`/maqueta/%E0%A4%A/`, `?a=%E0%A4%A`) deja la 404 en blanco: `decodeURIComponent` sin proteger lanza `URIError` (`blog.js:247`). No es explotable, pero los bots piden URLs así.
4. **M1.** El iframe de YouTube no lleva `sandbox` ni `referrerpolicy` explícitos (el sandbox no se ha podido probar sin red a YouTube).
5. **M6.** El repo es público y la rama `proto/home` ya está en `origin`: se publican los planes, los informes y los volcados de WordPress de `.claude/`. Medido: sin correos, sin tokens, sin borradores, sin datos personales. Decide el dueño si eso es intencionado.

**Recuento:** Cambiar 3 · Mejorar 10 · Dejar como está 12.

## 2. Método

**Leído:** todo `maqueta/*.js`, `maqueta/shared/*.js`, `maqueta/blog/*.js`, los 11 HTML de la maqueta, `maqueta/shared/blog.json` (recorrido con un script: etiquetas, atributos y esquemas de enlace de todas las cadenas), `assets/vendor/luz/*`, `tools/luz-sync.mjs`, `tools/voice-setup.sh`, `.github/workflows/check.yml`, `.githooks/`, `.claude/settings.local.json*`, `.ai/soynando/raw/*` y `soynando.json`, planes de `.claude/`.

**Medido (Chromium headless, scripts en el scratchpad, nada en el repo):**
- Barrido de cargas: 11 páginas, sin consentimiento. Solo `localhost:8766` (393 peticiones), 0 cookies, `localStorage` y `sessionStorage` vacíos.
- Inyección de la CSP propuesta como cabecera en 18 URLs (incluye 11 artículos con código, tuit, tabla, línea de tiempo, vídeo) con y sin consentimiento de YouTube, y como `<meta>`: sin infracciones. Control negativo (`script-src 'none'`) sí dispara las infracciones, o sea que la CSP se aplicaba de verdad.
- Barrido de XSS: 5 cargas útiles (`"><img onerror>`, `<script>`, `'-alert(1)-'`, `javascript:`, `</code><img onerror>`) en 8 rutas (404 por ruta, `?a=`, `?c=`, `?t=`, `?p=` de proyecto, `?tech=`, `?p=` del blog, `?lang=`). Sin ejecución, sin diálogos.
- `luz-consent` falsificado (6 variantes: `granted` como cadena, `null`, JSON roto, `expires` enorme, 5 MB) y `luz-theme` con una carga útil: sin errores, vuelve a la puerta del vídeo y al modo oscuro.
- Trusted Types probado en modo estricto: 5 puntos de asignación fallan (ver M3).
- Los ficheros `@luz-ds/{tokens,core,catalog}@0.4.1` descargados con `npm pack` y comparados con `cmp`: los 10 ficheros vendorizados son idénticos.
- Patrones de secretos en `git log --all -G` (251 commits): claves privadas, `ghp_`, `AKIA`, `sk-`, `api_key`, `password`, `xox`. Sin coincidencias reales (la de `password` es texto de `root.json`). Sin `.env`, claves ni volcados en el árbol ni en archivos borrados.
- Qué sirve GitHub Pages hoy de `nandovejer.github.io` (`curl`): `build.mjs`, `data/`, `src/`, `tools/`, `CLAUDE.md` responden 200; `.claude/`, `.githooks/` y `maqueta/` responden 404.
- EXIF de las 32 JPG de `maqueta/img`: ninguna lleva Exif ni GPS.

**No he podido:** probar el `sandbox` del iframe contra YouTube real (sin red a YouTube en las pruebas), verificar cabeceras reales de Cloudflare Pages (no hay despliegue), ni revisar el WordPress actual más allá de lo que hay volcado. Lo que viene de la documentación (HSTS, Permissions-Policy, Trusted Types) lo marco como tal.

## 3. Propuesta de CSP y cabeceras

### 3.1 Qué carga la maqueta (medido)

| Recurso | Origen | Directiva |
|---|---|---|
| Scripts (`main.js`, `blog.js`, módulos, `assets/vendor/luz/*`) | propio | `script-src 'self'` |
| Un script en línea (modo de color antes del primer pintado), idéntico en las 11 páginas | en línea | hash `sha256-Bw5SBgyWAhqHfF+LPJ/QxdMEXGrg/uLD3B4DTKewPxw=` |
| CSS (`style.css`, `blog.css`); el `style` de los elementos se pone por CSSOM (`style.cssText`), que la CSP no bloquea | propio | `style-src 'self'` |
| Fuentes WOFF2 | propio | `font-src 'self'` |
| `fetch` de `/data/*.json` y `blog.json` | propio | `connect-src 'self'` |
| Imágenes (todas locales, canvas incluido) | propio; miniatura de YouTube solo tras el «sí» | `img-src 'self' https://i.ytimg.com` |
| Vídeo | `youtube-nocookie.com` solo tras el «sí» | `frame-src https://www.youtube-nocookie.com` |
| Sin JSON-LD en la maqueta (en Astro sí: un `<script type="application/ld+json">` no se ejecuta y la CSP no lo toca) | | |

La CSP no puede imponer el consentimiento: `i.ytimg.com` y `youtube-nocookie.com` quedan permitidos, y que no se pidan sin el «sí» lo garantiza el código (medido).

### 3.2 Cloudflare Pages: archivo `_headers` (en `public/_headers` de Astro)

```
/*
  Content-Security-Policy: default-src 'none'; script-src 'self' 'sha256-Bw5SBgyWAhqHfF+LPJ/QxdMEXGrg/uLD3B4DTKewPxw='; style-src 'self'; img-src 'self' https://i.ytimg.com; font-src 'self'; connect-src 'self'; frame-src https://www.youtube-nocookie.com; media-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests
  Strict-Transport-Security: max-age=31536000
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=(), browsing-topics=(), fullscreen=(self "https://www.youtube-nocookie.com"), autoplay=(self "https://www.youtube-nocookie.com"), encrypted-media=(self "https://www.youtube-nocookie.com"), picture-in-picture=(self "https://www.youtube-nocookie.com"), clipboard-write=(self), web-share=(self)
  Cross-Origin-Opener-Policy: same-origin
```

Notas, por qué cada cosa:
- **`default-src 'none'`**: lista blanca explícita; cualquier recurso nuevo falla a la vista en la consola y se añade a propósito.
- **Hash del script en línea.** Si se cambia ese script, cambia el hash. Para recalcularlo: `printf %s "$SCRIPT" | openssl dgst -sha256 -binary | base64`. Mejor: comprobarlo en CI (ver sección 5).
- **Astro**: `build.inlineStylesheets: 'never'` (si no, mete `<style>` en línea y `style-src 'self'` lo bloquea) y scripts siempre como ficheros salvo el de modo de color. Astro tiene una opción de CSP que calcula los hashes sola (experimental en las versiones recientes, **a verificar** en la versión que se use). Si se usa, no se escribe la directiva a mano.
- **`frame-ancestors 'none'` y `X-Frame-Options: DENY`**: nadie puede enmarcar el sitio (el segundo, por navegadores viejos). No hay nada que robar con un clic, pero es gratis.
- **`Referrer-Policy: strict-origin-when-cross-origin`**: no se pone `no-referrer`. YouTube exige un referente en los embebidos (a verificar: desde 2025 un embebido sin referente puede dar el error 153), y este valor solo envía el origen a otros sitios.
- **HSTS sin `includeSubDomains` ni `preload`** al principio. Con `includeSubDomains` se fuerza HTTPS en todos los subdominios de `soynando.com` (correo, otros); hay que mirar H3 del plan (MX en el mismo hosting) antes. `preload` es casi irreversible: solo cuando todo vaya bien durante meses. Valor de 1 año recomendado por la documentación de MDN/OWASP.
- **`Permissions-Policy`**: deniega lo que el sitio no usa y delega solo en YouTube lo que su reproductor necesita (pantalla completa, reproducción automática, DRM, imagen en imagen). Si `autoplay=(self)` a secas, el `autoplay=1` del iframe dejaría de funcionar. Sin `interest-cohort` (obsoleta).
- **No se pone COEP** (`require-corp`): el iframe de YouTube no lo cumple y se rompería. No hace falta nada de lo que COEP habilita.
- **COOP `same-origin`**: sin ventanas que necesiten `opener`; los enlaces externos ya llevan `noopener`.
- **`upgrade-insecure-requests`**: red de seguridad si algún enlace interno quedara en `http://`.

### 3.3 GitHub Pages: `<meta>` (mejor esfuerzo)

Primera etiqueta del `<head>`, antes del script en línea, en todas las páginas:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self' 'sha256-Bw5SBgyWAhqHfF+LPJ/QxdMEXGrg/uLD3B4DTKewPxw='; style-src 'self'; img-src 'self' https://i.ytimg.com; font-src 'self'; connect-src 'self'; frame-src https://www.youtube-nocookie.com; media-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'self'; object-src 'none'">
<meta name="referrer" content="strict-origin-when-cross-origin">
```

Medido: mismas 18 URLs, cero infracciones, y el control negativo confirma que el `<meta>` se aplica. Límites (documentados): el `<meta>` **no admite** `frame-ancestors`, `report-uri`, `sandbox` ni `X-Frame-Options`, y solo protege a partir de donde está escrito en el documento. Con GitHub Pages **no hay** `X-Content-Type-Options`, HSTS, `Permissions-Policy`, COOP, ni protección contra el enmarcado. Es otra razón (junto con los 301 reales) para elegir Cloudflare Pages (H2 del plan); este informe no cambia esa decisión, solo añade este argumento.

## 4. Hallazgos

### 4.1 Cambiar

| Id | Qué | Evidencia | Arreglo | ¿Maqueta o Astro? | Decide |
|---|---|---|---|---|---|
| C1 | Manejador en línea `onsubmit` en el formulario de búsqueda de la 404: incompatible con una CSP sin `'unsafe-inline'` | `maqueta/blog/blog.js:299` (`onsubmit: 'return false'`). Medido con la CSP propuesta: consola «Executing inline event handler violates…», y Intro navega a `/maqueta/nada/?q=luz` en vez de buscar en el sitio | Quitar el atributo y poner `form.addEventListener('submit', (e) => e.preventDefault())`. Mismo criterio para cualquier `on*` que aparezca | Las dos (se corrige aquí, se vuelve a medir en Astro) | Mecánico |
| C2 | Ninguna página lleva CSP ni cabeceras de seguridad | `curl -I https://nandovejer.github.io/` no devuelve CSP, `X-Content-Type-Options`, `Referrer-Policy` ni HSTS. La maqueta no tiene `<meta>` de CSP | Sección 3: `_headers` en Cloudflare Pages o `<meta>` en GitHub Pages. Medida sin infracciones | Astro (cabeceras, hosting) | Dueño, junto con H2 y H5 del plan |
| C3 | `decodeURIComponent` sin proteger: una URL con `%` mal formado deja la 404 sin contenido | `blog.js:247` (`decodeURIComponent(location.pathname + location.search)`). Medido: `/maqueta/%E0%A4%A/` y `/blog/articulo/?a=%E0%A4%A` → `URIError: URI malformed`, sin `<h1>`. No es explotable: es robustez | `try { shown = decodeURIComponent(...) } catch { shown = location.pathname }` | Las dos (en Astro la 404 es HTML estático, pero hay que repetir la prueba con `%E0%A4%A` en la ruta) | Mecánico |

### 4.2 Mejorar

| Id | Qué | Evidencia | Arreglo | ¿Maqueta o Astro? | Decide |
|---|---|---|---|---|---|
| M1 | El iframe de YouTube sin `sandbox` ni `referrerpolicy` explícitos | `blog.js` (`play()`): atributos medidos al pulsar ▶: `src=youtube-nocookie.com/embed/…`, `allow="autoplay; encrypted-media; picture-in-picture"`, `sandbox=null`, `referrerPolicy=''`, `loading=auto` | Añadir `referrerpolicy="strict-origin-when-cross-origin"` (YouTube lo necesita) y probar `sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"`. **El sandbox no está probado contra el reproductor real**: probar reproducción, pantalla completa y «Ver en YouTube». Ganancia pequeña (la CSP `frame-src` ya limita el origen); si da problemas, dejarlo | Las dos (el reproductor es el mismo) | Dueño, tras probar |
| M2 | HTML de contenido en `innerHTML` (`html()`) sin comprobación propia: se confía en el conversor | `blog.js:392` y ~30 usos de `html()`. Medido en `blog.json`: solo `em`, `br`, `a`, `strong`, `code`, `span` (en cadenas, no dentro de bloques de código), todos los `href` son `http(s)` o `#`; ningún `on*`, `style`, `javascript:` ni `data:` | Un test en CI (o en el conversor) que falle si aparece una etiqueta o un esquema fuera de esa lista. En Astro el HTML se genera en compilación y desaparece el sumidero | Astro (con el test copiado de aquí) | Mecánico |
| M3 | Trusted Types no aplicables hoy | Medido con `require-trusted-types-for 'script'`: fallan `theme.js:40` (`insertAdjacentHTML`), `theme.js:56` (`innerHTML`), `blog.js:392` (`html()`), el resaltador vendorizado (`highlightBlock`, escapa antes) y `blog.js:299` (el `onsubmit`, C1) | No activarlo en la maqueta. En Astro, cuando el HTML venga ya renderizado, quedarán solo `theme.js` y el resaltador: valorar una política `default` o dejar de usar `innerHTML` en `theme.js` y activar `require-trusted-types-for 'script'` | Astro | Dueño (mejora opcional) |
| M4 | El identificador de YouTube (`x.yt`) se mete en URLs sin validar | `blog.js` (`youtube-nocookie.com/embed/${x.yt}`, `i.ytimg.com/vi/${x.yt}`, `youtube.com/watch?v=${x.yt}`). Los 11 ids actuales son válidos; el dato es propio | `/^[\w-]{11}$/` antes de usarlo (y en el conversor) | Maqueta | Mecánico |
| M5 | No hay `.gitignore`; un archivo temporal de permisos está versionado y hay un worktree dentro del repo sin ignorar | `ls -a` sin `.gitignore`; `git ls-files .claude/settings.local.json.tmp.96932.fc5c518cf7b5`; `git worktree list` → `.claude/worktrees/versiones-visuales` (un checkout completo, sin ignorar). Un `git add -A` lo metería | Crear `.gitignore` con `.env*`, `node_modules/`, `.claude/settings.local.json*`, `.claude/worktrees/`, `.DS_Store`, `*.log`; sacar del índice el `.tmp` | Maqueta (repo) | Dueño |
| M6 | Repo público con la rama `proto/home` ya publicada: planes, informes internos y volcados de WordPress | `gh`/API: `private: false`; `git ls-remote` muestra `refs/heads/proto/home`. Medido en `.ai/soynando/raw`: 11 entradas y 5 páginas, todas `publish`, comentarios cerrados, sin correos, sin tokens, sin `image_meta`; es lo que ya expone la API pública de WordPress. Aun así, `root.json` lista los plugins y rutas (Wordfence, Koko Analytics, Yoast) y rutas locales `~/…` aparecen en `maqueta/tools/*.cjs` y en agentes | Decidir si `.claude/` va a un repo privado o a otra rama; quitar rutas locales de las herramientas (parametrizar con variables de entorno) | Maqueta (repo) | **Dueño** |
| M7 | WordPress actual: `/author/admin/` en el mapa del sitio sugiere que el usuario tiene el slug `admin` | `.ai/soynando/raw/sm-author.xml` lista `/author/admin/` y `/author/nando-munoz/`. Es una pista de enumeración de usuarios hasta la migración | Mientras WordPress siga vivo: bloquear la enumeración de autores (`/?author=1`, `/wp-json/wp/v2/users`) y renombrar el usuario; no hace falta hacer nada en el sitio nuevo | Astro (desaparece con WordPress) | Dueño |
| M8 | El `style` de `<noscript>` lo bloquearía `style-src 'self'` | Los 11 HTML llevan `<noscript><p style="padding:2rem">…`. Solo se ve sin JS; sin el estilo, el aviso queda sin sangría | Pasarlo a una clase | Maqueta | Mecánico |
| M9 | Cadena de suministro de las herramientas de build (no del sitio) | `tools/voice-setup.sh`: `pip install --upgrade piper-tts` sin versión y voces descargadas de Hugging Face sin suma de comprobación. `.github/workflows/check.yml`: acciones por etiqueta (`@v4`) y sin `permissions` | Fijar la versión de `piper-tts` y las sumas SHA-256 de las voces; en el workflow, `permissions: contents: read` y acciones por SHA | Astro (CI y build) | Dueño |
| M10 | Si `proto/home` llega a `main`, GitHub Pages publicaría `maqueta/` entera (con `refs/`, `variantes/`, `tools/`, `DESIGN.md`) | Hoy `maqueta/` da 404 en el sitio vivo porque no está en `main`; `build.mjs`, `data/`, `src/`, `tools/` y `CLAUDE.md` ya se sirven (200). Las páginas llevan `noindex` | No fusionar tal cual: el sitio final sale de `dist/` de Astro. Si hubiera que fusionar antes, excluir esas carpetas con `.nojekyll` + despliegue por Actions | Astro (despliegue) | Dueño |

### 4.3 Dejar como está

| Id | Qué se comprobó | Evidencia | ¿Maqueta o Astro? |
|---|---|---|---|
| D1 | **XSS por DOM.** Los sumideros reales son pocos y su entrada es propia | El ayudante `el()` (`main.js:46`, `parts.js:160`) usa `textContent`/`setAttribute`. `innerHTML` solo recibe `blog.json` (M2), cadenas fijas (`theme.js`) y la salida ya escapada del resaltador. La ruta fallida (`shown`), `?a=`, `?c=`, `?t=`, `?p=` y `?tech=` solo llegan a `textContent` o a comparaciones con `includes`. 5 cargas útiles × 8 rutas: sin ejecución | Las dos (repetir el barrido en Astro) |
| D2 | **Enlaces y ventanas.** Todo `target="_blank"` lleva `rel="noopener"` | `main.js:192` (`me noopener`), `:306-307`, `parts.js:110`, `blog.js:137, 394, 421, 479, 504` (fuerza `_blank`+`noopener` a todo enlace `http` del cuerpo de un artículo), `:641`. Sin `javascript:`, `data:` ni redirecciones abiertas: las URLs internas se construyen con `new URL(BASE + path, location.origin)` y siempre quedan en el mismo origen. `noopener` sin `noreferrer` es correcto con la política de referente propuesta | Las dos |
| D3 | **Almacenamiento.** Entrada manipulada en `luz-consent` y `luz-theme` | 6 variantes de `luz-consent` mal formadas o falsificadas (incluida `granted:"youtube"` y 5 MB) → la puerta del vídeo se muestra, sin errores. `luz-theme` con una carga útil se ignora (lista blanca de tres modos en el script de la cabeza). Falsificar el consentimiento solo afecta al propio visitante | Maqueta |
| D4 | **Dependencias.** LUZ vendorizado | Los 10 ficheros de `assets/vendor/luz/` son idénticos a `@luz-ds/{tokens,core,catalog}@0.4.1` (`npm pack` + `cmp`); los paquetes no declaran dependencias; el repo no tiene `package.json` ni `node_modules`. `highlight.min.js` escapa (`escapeHtml`) antes de asignar `innerHTML`; `clipboard.min.js` solo escribe en el portapapeles al pulsar | Las dos |
| D5 | **Terceros.** Cero peticiones sin consentimiento | 11 páginas: solo `localhost:8766`, 0 cookies, almacenamiento vacío. Con consentimiento: miniatura de `i.ytimg.com` y, al pulsar, iframe de `youtube-nocookie.com`. Los tuits son tarjetas estáticas, el resto de vídeos y gists, enlaces. Sin analítica, sin huellas digitales, sin `sendBeacon`, `WebSocket`, `postMessage`, `eval`, `new Function` ni `document.write` | Las dos |
| D6 | **Secretos.** Repo e historial | 251 commits con patrones de claves (privadas, `ghp_`, `AKIA`, `sk-`, `api_key`, `password`, `xox`): sin coincidencias reales. Sin `.env`, claves ni volcados en el árbol ni entre los borrados. Correos: solo `noreply.github.com` y `example.com` en los autores de los commits | Maqueta (repo) |
| D7 | **Volcados de WordPress** (`.ai/soynando/raw`) | Todo `publish`, comentarios cerrados, 0 correos, 0 tokens, sin metadatos EXIF; es el contenido público del sitio y de su API REST. (La decisión de si va a un repo público es M6) | Maqueta (repo) |
| D8 | **Imágenes y fuentes propias.** Sin EXIF/GPS, fuentes alojadas | 0 de 32 JPG de `maqueta/img` con Exif o GPS. Las fuentes WOFF2 salen de `/assets/fonts/` (con `OFL.txt`); ningún `@import` ni `url()` externo en el CSS | Maqueta |
| D9 | **Datos compartidos y botón de compartir.** Todo se codifica | `shareDialog` usa `encodeURIComponent` en título y enlace; los destinos son fijos (`wa.me`, `x.com`/`twitter.com`, `t.me`, `linkedin.com`, `facebook.com`, `bsky.app`, `mailto:`). Se abren por clic del lector | Maqueta |
| D10 | **Bloques de código.** El código de un artículo nunca se interpreta | `codeBlock` (`code.js`) mete el texto con `textContent` y solo después pasa por el resaltador. Medido en el artículo 3: `<script>` y `<wc-icon>` salen como texto | Maqueta |
| D11 | **Qué publica GitHub Pages hoy** | `.claude/`, `.githooks/` y `maqueta/` dan 404 (Jekyll no sirve carpetas que empiezan por punto; `maqueta/` no está en `main`). No hay `.nojekyll` ni `CNAME` | Astro (despliegue) |
| D12 | **Privacidad técnica** | La IP solo llega a Google tras el «sí» (confirmado, sin miniatura ni petición antes); el referente a YouTube lo gobierna `Referrer-Policy` (sección 3); sin `localStorage` hasta que el visitante elige | Las dos |

## 5. Preguntas para el dueño

1. **M6.** ¿Es intencionado que `.claude/` (planes, informes, volcados de WordPress, agentes) esté en el repo público `nandovejer/nandovejer.github.io`? Si no, ¿lo movemos a un repo privado o a una rama sin publicar?
2. **C2 / H2 / H5.** ¿Cloudflare Pages? Con él se obtienen todas las cabeceras de 3.2; con GitHub Pages se queda en el `<meta>` de 3.3 y sin protección contra el enmarcado.
3. **HSTS.** ¿Hay subdominios de `soynando.com` (correo, paneles) que sigan en HTTP? Define si algún día se puede añadir `includeSubDomains`. Relacionado con H3 del plan.
4. **M7.** ¿Se sigue usando el WordPress actual hasta la migración? Si sí, ¿se endurece la enumeración de usuarios ahora?
5. **M1.** ¿Quieres que se pruebe el `sandbox` del iframe con red real (reproducir, pantalla completa, «Ver en YouTube»)? Sin esa prueba lo recomendable es no ponerlo.

## 6. Lista para pegar en la Fase 10 del plan de Astro

- [ ] `public/_headers` con la CSP, HSTS (1 año, sin `includeSubDomains` ni `preload` al principio), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` y COOP de la sección 3.2 de `.ai/plan/informe-seguridad-maqueta.md`.
- [ ] `build.inlineStylesheets: 'never'` en Astro y ningún `<style>` ni `style=""` en el HTML generado; comprobarlo con un `grep` en `dist/`.
- [ ] Un único script en línea (el del modo de color) y comprobación en CI de que su hash coincide con el de la CSP (`openssl dgst -sha256 -binary | base64`); alternativa: la opción de CSP de Astro, si está estable.
- [ ] Ningún atributo `on*` en el HTML ni en el JS (`grep -rnE "onsubmit|onclick|onload|onerror" dist/ src/` vacío).
- [ ] Probar la CSP real contra `dist/` en Chromium: 0 infracciones en todas las rutas, con y sin consentimiento de YouTube, y con `?lang=en`.
- [ ] Prueba negativa: un `<script>alert(1)</script>` inyectado en una página de prueba debe quedar bloqueado.
- [ ] 404: probar `/%E0%A4%A/` y rutas con caracteres raros; la página debe renderizar.
- [ ] Test de CI sobre el contenido de los artículos: solo `em`, `br`, `a`, `strong`, `code`, `span`; solo `href` `http(s)`, `mailto:` o `#`; ids de YouTube con `/^[\w-]{11}$/`.
- [ ] Iframe de YouTube con `referrerpolicy="strict-origin-when-cross-origin"` y comprobación de que reproduce; `sandbox` solo si la prueba con red real pasa.
- [ ] Barrido de red sin consentimiento sobre `dist/`: solo el origen propio, 0 cookies, almacenamiento vacío.
- [ ] `.gitignore` con `.env*`, `node_modules/`, `.claude/settings.local.json*`, `.claude/worktrees/`; sin el `.tmp` de permisos versionado.
- [ ] Decisión sobre `.claude/` en el repo público (M6) tomada antes de apuntar el dominio al sitio nuevo.
- [ ] `permissions: contents: read` y acciones por SHA en `.github/workflows/`; `piper-tts` y voces con versión y SHA-256 fijados.
- [ ] `npm audit` y `npm pack` + `cmp` de `assets/vendor/luz/*` contra la versión fijada en `luz-sync.mjs` antes de cada subida.
- [ ] Revisar `Strict-Transport-Security` y añadir `includeSubDomains` solo tras revisar los subdominios (H3).
- [ ] Repetir este informe sobre `dist/` (XSS, CSP, secretos) antes de publicar.
