# Informe de veracidad de la maqueta Trama

Auditor: fact-checker. Fecha de la auditoría: 2026-11-16. Rama `proto/home`, carpeta `maqueta/`. Solo informa: no se ha editado ni commiteado nada más que este archivo.

Veredictos por afirmación: **confirmado**, **dudoso**, **falso**, **no verificable**.

---

## 1. Resumen

**Veredicto.** El contenido es, en conjunto, honesto y sólido. Los 13 proyectos existen como repos públicos de `nandovejer`, sus años, tecnologías y descripciones salen de los README y casi todo se confirma. Las 11 fechas de los artículos coinciden con la API de WordPress. La cronología de la IA (69 hitos), las citas de la AEPD, el AI Act y los fichajes de Anthropic/Google/DeepSeek se confirman, salvo matices. La política de cookies cuenta lo que hace el código: en una ejecución en Chromium sin consentimiento hubo **0 cookies, 0 entradas en localStorage y 0 peticiones externas** en 12 páginas. Lo que falla son sobre todo **enlaces muertos o mal formados**, una **omisión de crédito** (Playfair Display), una **frase del portafolio que es falsa** («todo lo que he publicado en GitHub»), un par de **afirmaciones atribuidas a una fuente que no las dice** y **técnica obsoleta** en dos artículos antiguos.

**Los cinco hallazgos más importantes**

1. **C1.** `creditos/` dice que las tipografías son Archivo, Chakra Petch y Doto, pero **Playfair Display** se descarga en todas las páginas (`style.css:9`, título del hero en `rain.js`). No está en `creditos` ni en `assets/fonts/OFL.txt`. Es una licencia OFL que exige incluir el aviso.
2. **C11.** El subtítulo de Proyectos dice «Todo lo que he publicado en GitHub» y es **falso**: son 13 de 41 repos públicos propios (no forks). Faltan, por ejemplo, `cole` (creado hace 5 días), `nandovejer.github.io` y `ikay`.
3. **C2 y C3.** En el artículo de pseudo-clases CSS el gist enlazado da 404 porque está bajo `Silencespainter/…` y vive en `nandovejer/…`. Además el código usa `:--webkit-autofill` (doble guion), que no existe. Medido en Chromium 153: `:--webkit-autofill` es `false`, `:-webkit-autofill` es `true` y `:autofill` es `true`. La premisa del artículo («`:autofill` es FALSE en Chrome») está obsoleta desde Chrome 110.
4. **C4 a C8.** Enlaces rotos o mal formados: Maldita (la ruta no existe), Adslzone (410), `x.com/farre_diaz` (404; es el enlace del crédito de la portada de la Oveja Negra), `http://(https://alpoma.net/…` (con un `http://(` delante) y un **vídeo privado de YouTube** embebido en el análisis de La ciudad invisible.
5. **C9 y C10.** Hay **dos artículos publicados con el mismo título** («¿Hay alguien dentro?», 2 y 15 de octubre, con la misma cronología). Y el artículo de Hamilton dice que murió «en Cambridge… según MIT News», pero esa nota no da el lugar de la muerte.

**Recuento por cubo**

| Cubo | Nº |
|---|---|
| Cambiar | 13 |
| Mejorar | 19 |
| Dejar como está (afirmaciones verificadas, agrupadas) | 22 |

---

## 2. Método

**Leído y medido**
- `data/projects.json` (13 proyectos, ES), `data/site.json`, `data/kanjis-repos.json`, `maqueta/shared/blog.json` (11 artículos), `credits.js`, `cookies-policy.js`, `privacy.js`, `consent.js`, `theme.js`, `blog/blog.js`, `style.css`.
- `gh` autenticado como `nandovejer`: `gh repo list`, README, lenguajes, licencia y páginas de los 13 repos. Registro npm de los paquetes. API de Wikimedia Commons. API de WordPress (`/wp-json/wp/v2/posts`).
- Enlaces: los **160 URLs únicos** de `blog.json` más socials y demos, comprobados con `curl -L` y navegador UA. 117 dieron 200. De los 42 restantes, la mayoría son **bloqueos a bots** (OpenAI, Unsplash, Facebook, Meta AI, Medium, StackOverflow, El País, PayPal, Terceravía, DOI): no son enlaces rotos. Los 508 de `soynando.com` fueron un límite del CDN y dieron 200 al reintentar.
- Titulares y fechas oficiales con WebFetch: ALSJ (Apolo 11), MIT News (Hamilton), AEPD, Anthropic (9 páginas), Google, DeepSeek, Kimi, MDN. WebSearch para los datos posteriores a mi conocimiento (GPT-6 Astra, Muse Spark) y para el Carnaval.
- Chromium headless 153 (playwright-core del repo `cole`) sobre `http://localhost:8766/maqueta/`: 12 páginas sin consentimiento (cookies, localStorage, peticiones externas, iframes); fuentes cargadas; texto visible de home, proyectos, blog, artículo y proyecto; comprobación de selectores CSS.

**No he podido**
- Verificar la titularidad de LinkedIn, X y Facebook: LinkedIn y Facebook devuelven 200 a todo por el muro de login. X devuelve 404 para cuentas inexistentes (control: `x.com/zzzqqqxxx12345` da 404), así que `x.com/nandovejer` **existe**, pero no puedo probar que sea tuya.
- Abrir las páginas de OpenAI y Meta AI (bloquean bots). GPT-6 Astra y Muse Spark los he contrastado con prensa y con el artículo de The Batch; es fuente secundaria.
- Comprobar el contenido de Unsplash, Facebook ni El Confidencial (WebFetch lo bloquea).
- Revisar las letras de comparsa verso a verso. La atribución de autoría y año de las cuatro letras la da por confirmada el encargo; he comprobado que los artículos la declaran de forma consistente.
- Abrir cada fuente de la cronología histórica de la IA (siglos VIII a. C. a 2022). Esas entradas las he cotejado con lo que sé (fechas, nombres, citas) y con los enlaces que resuelven. Los hitos de 2018 a 2026 los he contrastado con fuentes primarias o prensa, salvo los marcados.
- Los kanji: lecturas y significados revisados con mi conocimiento del japonés, sin diccionario en línea.

---

## 3. Hallazgos

### 3.1 Cambiar (arreglar antes de publicar)

| Id | Qué | Evidencia | Arreglo | ¿Maqueta o Astro? | Decide |
|---|---|---|---|---|---|
| C1 | La página de créditos omite **Playfair Display** (falso por omisión: «Todas son… Archivo, Chakra Petch y Doto»). | Se descarga en las 3 páginas medidas (`/assets/fonts/playfair-display-latin-wght-normal.woff2`); `style.css:9`; `rain.js:35-40` (título NANDO MUÑOZ). `assets/fonts/OFL.txt` solo copia 3 avisos y dice que los demás son de la versión Cassette. | Añadir Playfair Display (OFL, Claus Eggers Sørensen y colaboradores: copiar el aviso de sus metadatos) a `credits.js` ES/EN y a `OFL.txt`; o quitarla si se puede. | Maqueta | Tú / agente |
| C2 | Enlace del gist **404**: `gist.github.com/Silencespainter/a6096b7b…`. El gist existe bajo `nandovejer`. | `gh api gists/a6096b7b63593afaa588bf45eabec947` da `html_url: gist.github.com/nandomunoz/a6096b7b…`. El usuario `Silencespainter` no existe (404). Post `como-detectar-el-soporte…`. | Cambiar a `https://gist.github.com/nandomunoz/a6096b7b63593afaa588bf45eabec947` (el gist es privado/no listado: 200 por URL directa; comprobar). | Maqueta | Agente |
| C3 | El código y el texto usan `:--webkit-autofill` (doble guion) y afirman que `:autofill` no se soporta en Chrome. | Medido en Chromium 153: `supportPseudoClass(':--webkit-autofill')` = false; `':-webkit-autofill'` = true; `':autofill'` = true. MDN: `:-webkit-autofill` es alias de `:autofill`. El gist original lleva el mismo error. El artículo es de 2021. | Corregir a `:-webkit-autofill`, añadir una nota fechada («desde Chrome 110 `:autofill` funciona») y mencionar `CSS.supports('selector(:autofill)')` / `@supports selector(...)`. | Maqueta | Tú |
| C4 | Enlace de Maldita (`maldita.es/malditobulo/2020/11/02/whatsapp-codigo-6-digitos…`) **404** tras redirigir a `…/20201102/…//`. | Maldita publica ese artículo con URL `…/malditobulo/AAAAMMDD/whatsapp-codigo-6-digitos-sms-por-error-campana-suplantacion-de-identidad-no-hackean-telefono` y varias fechas (20210202, 20210524, 20210709, 20210928; versiones nuevas en 2023, 2025 y 2026). | Sustituir por la URL que exista hoy y volver a leer la cita («La Guardia Civil de Navarra alertó en febrero…»): el artículo se ha actualizado varias veces. | Maqueta | Tú |
| C5 | Enlace **410 Gone**: `adslzone.net/2017/02/12/mas-seguro-pagar-paypal/` (artículo «Huella digital…»). | `curl`: 410. Wayback conserva copia (`web.archive.org/web/20250810…`). | Enlazar la copia de Wayback o quitar la referencia. | Maqueta | Tú |
| C6 | **x.com/farre_diaz** (y `twitter.com/farre_diaz`) **404**: el crédito de la portada de la Oveja Negra y una mención del texto enlazan a una cuenta que ya no existe. | `curl`: 404; control: `x.com/ComparsaArguez` y otras 5 cuentas del blog dan 200, `x.com/zzzqqqxxx12345` da 404. | Dejar el crédito como texto (firma «@DIAZ FARRE») sin enlace, o localizar el handle nuevo. | Maqueta | Tú |
| C7 | Enlace mal formado: `href="http://(https://alpoma.net/tecob/?p=14632"` (análisis de La ciudad invisible). | `blog.json`; la URL buena (`https://alpoma.net/tecob/?p=14632`) da 200. | Quitar el `http://(`. | Maqueta | Agente |
| C8 | **Vídeo privado** de YouTube embebido: `gbBKqmExc_k` (`start=631`) en La ciudad invisible, con el título vacío. | La página del vídeo responde `playabilityStatus: LOGIN_REQUIRED, «Vídeo privado»`; oEmbed 403. | Quitar el vídeo, sustituirlo por otro de acceso público o dejar solo el texto. | Maqueta | Tú |
| C9 | **Dos artículos con el mismo título**: `introduccion-a-la-ia` (2 oct, 22 min) e `introduccion-a-la-ia-2` (15 oct, 17 min). Misma cronología (69 entradas idénticas); el segundo es una versión recortada y actualizada. | `blog.json`; API WP confirma ambas fechas. Contenido duplicado en el blog (`/blog/` los lista seguidos). | Decidir cuál queda; el otro, borrado o redirigido (301) al elegido. | Las dos (decisión aquí, redirección en Astro) | Tú |
| C10 | «**murió el pasado 30 de septiembre en Cambridge, a los 90 años, según la nota de MIT News**». | MIT News (7-oct-2026): «died on Sept. 30», 90 años; el lugar de la muerte **no aparece**; solo dice que habrá un acto en Cambridge, Massachusetts, en primavera. | Quitar «en Cambridge» o citar otra fuente. Fecha y edad: confirmadas. | Maqueta | Agente |
| C11 | Subtítulo de Proyectos: «**Todo lo que he publicado en GitHub**» (falso). | `gh repo list`: 51 repos públicos, 41 no forks; el portafolio muestra 13. Quedan fuera `cole` (2026-11-11), `nandovejer.github.io`, `ikay` (2020), `console.cool`, `binary-to-assci`, `html5-boilerplate-pro`… | «Una selección de lo que he publicado…». Revisar el equivalente EN. | Maqueta | Tú |
| C12 | `creditos/`: «capturas de la web de cada proyecto o, si no tiene, de la página de GitHub de su repositorio». | `illo-loader` y `js-subtype` **no tienen web ni GitHub Pages** (404) y sus capturas son de la página de ejemplo (`index.html`) del repo, no de la página de GitHub; `libros-del-mundo` sí es el README en GitHub; `toolbar-aem` es una imagen del repo (esto sí lo dice). Vista del contact sheet en `maqueta/img/proyectos/*.jpg`. | Reescribir: «…o, si no tiene, de su página de ejemplo o de su README en GitHub». | Maqueta | Agente |
| C13 | `cookies/` y `privacidad/` conservan el marcador **⟦correo de contacto⟧**. | `cookies-policy.js` (responsable) y `privacy.js` (Quién soy, Si sales en una foto, Si me escribes). Ya lo sabe el informe legal; sigue sin resolverse. | Poner el correo real antes de publicar. | Las dos | Tú |

### 3.2 Mejorar

| Id | Qué | Evidencia | Arreglo | ¿Maqueta o Astro? | Decide |
|---|---|---|---|---|---|
| M1 | **Libros del mundo**: la regla «publicado desde 2010 y por autores del país» **no se cumple en la lista**. La tarjeta dice «Un libro por país, publicado desde 2010». | El propio README marca 12 entradas como «reedición» o «traducción al inglés» (Mahfuz, `El callejón de los milagros`; Casaccia, `La babosa`; Aitmatov, Yesenberlin, Boubou Hama…), obras anteriores a 2010 o de autores fallecidos. La regla de colaboración (pull request + explicación) sí está en el README. Veredicto: **dudoso**. | Matizar el texto («desde 2010, contando reediciones y traducciones») o limpiar el repo. | Maqueta | Tú |
| M2 | **Chrome Local AI**: «Son quince demos sobre siete APIs». | `src/data/demos.ts` tiene 15 entradas, pero una es la portada (`slug: ""`, comprobador de compatibilidad): 14 demos + portada. «Siete APIs» confirmado. Veredicto: **dudoso**. | «Catorce demos y una portada…» o «quince páginas». | Maqueta | Agente |
| M3 | Artículo «**Huella digital…**» (2020): lista como datos que cualquier web lee sin permiso la **batería**, la **vibración**, el **giroscopio**, la velocidad de red, la RAM. | MDN: Battery Status API tiene «Limited availability» (no está en Firefox ni en Safari). IKAY (README, que es tuyo) dice que los sensores de movimiento en iOS y escritorio **sí** piden permiso y que memoria y conexión son solo Chromium. El artículo es de 2020 (modificado 2023). Veredicto: **dudoso/obsoleto**. | Añadir una nota fechada y enlazar IKAY ya actualizado (el artículo enlaza al `ikay` antiguo, marcado «obsoleto» en su README). | Maqueta | Tú |
| M4 | Fable 5 / **Mythos 5**: «queda para profesionales verificados». | Anthropic (9-jun-2026): Mythos 5 es el mismo modelo con salvaguardas retiradas en algunas áreas, desplegado a «un pequeño grupo de ciberdefensores y proveedores de infraestructura» (socios de Glasswing); el acceso por verificación está **planeado** («trusted access program»). La página recoge también la suspensión del 12 de junio y el redespliegue del 1 de julio. Veredicto: **dudoso** (matiz). | «para un grupo reducido de ciberdefensores». | Maqueta | Agente |
| M5 | **Sonnet 5**: «el que usan por defecto quienes no pagan». | Anthropic (30-jun-2026): «default model for Free and Pro plans»; «close to Opus 4.8». Pro es de pago. Veredicto: **dudoso** (matiz). | «…por defecto en los planes gratuito y Pro». | Maqueta | Agente |
| M6 | **Muse Spark**: «Meta abandona Llama» y Llama 4 «serán el último gran Llama». | Prensa (The Batch, TNW, Decrypt): Muse Spark (8-abr-2026) es cerrado y marca un giro; Meta dice que la familia Llama seguirá recibiendo actualizaciones y que podría abrir versiones futuras. Veredicto: **dudoso** (sobreafirmado). | «Meta estrena un modelo cerrado y se aleja de Llama». | Maqueta | Agente |
| M7 | **Kimi K3**, «17 de julio de 2026»; «el modelo abierto más grande publicado hasta hoy». | La página dice «available today» sin fecha y «el primer modelo abierto de 2,8 billones de parámetros»; pesos «by July 27, 2026». Hay repo `moonshotai/Kimi-K3` en Hugging Face (público; creado 2026-06-13, modificado 2026-09-02). Veredicto: **fecha no verificable; el resto confirmado**. | Poner «julio de 2026» o citar la entrada exacta. | Maqueta | Agente |
| M8 | **Fable 5.1 y Mythos 5.1**: «1 de septiembre de 2026». | La página solo dice «September 2026». Lo de «hasta un 45 % más barato en las tareas largas» es «hasta aproximadamente 45 % en trabajo muy agéntico; ~25 % en cargas típicas». Veredicto: **día no verificable; cifra confirmada con matiz**. | «septiembre de 2026». | Maqueta | Agente |
| M9 | **Gemini 4 Argon**: «a la altura de Astra y Opus; de momento, solo para expertos en ciberseguridad». | Google (30-sep-2026): se despliega a «trusted cyber defenders» (programa Fairwind) y luego a clientes de pago. La página **no compara** con Astra ni con Opus. Veredicto: **dudoso** (comparación sin fuente). | Quitar la comparación o enlazar otra fuente. | Maqueta | Agente |
| M10 | Hamilton: alarmas «cinco en total: cuatro 1202 y una 1201». | ALSJ: 1202 a las 102:38:26, 1201 a las 102:42:19, más repeticiones; no he podido cuadrar el recuento exacto con una fuente (Wikipedia habla de «several»). Las horas (38:26, 38:30, 38:53 = 27 s, 102:45:40-41), los nombres (Bales, Garman, Duke) y el radar de encuentro se confirman. Veredicto: **no verificable** el recuento. | «varias alarmas (1202 y 1201)». | Maqueta | Agente |
| M11 | «**Figma es la herramienta estándar en el 2023**» (diseño de sistemas, 2023). | Afirmación fechada; hoy sería «en 2026» y Adobe XD ya no se desarrolla (cita XD como alternativa). Veredicto: **dudoso** por fecha. | Dejar la fecha visible en el artículo o actualizar el párrafo. | Maqueta | Tú |
| M12 | Artículo de Web Components: la cita de MDN sobre módulos y «Google tiene Lit olvidada». | La cita entre comillas **no es literal** (MDN dice «…bastante pequeños — la mayor parte de su uso en los primeros días era…»); la primera cita (Web Components) sí es literal. Lit: v3.3.3 (mayo 2026) y último push 2026-11-05, 21 900 estrellas: no está olvidada. | Citar literal o quitar las comillas; reformular lo de Lit como opinión. | Maqueta | Tú |
| M13 | ¿Quién canta hoy?: el texto del proyecto no dice que **no es oficial**. | README y `<title>` de coac.com.es: «no oficial / aunque no seamos la web oficial». El nombre y el dominio pueden confundir. | Añadir «no oficial» a la ficha. | Maqueta | Tú |
| M14 | Enlace `paullambi.com/blog/notificaciones-web-push…` da **500** en dos pruebas (artículo «Huella digital…»). | `curl`: 500 repetido. | Buscar otro ejemplo o quitarlo. | Maqueta | Tú |
| M15 | Enlaces `http://` que funcionan por redirección: `curiosidadesdecadiz.blogspot.com` (200 por http) y `aaccadiz.com` (redirige a `https://aaccadiz.com/noticias/`, no a la portada). | `curl -L`. | Pasar a `https://`; revisar que `aaccadiz.com` sigue siendo la asociación de autores. | Maqueta | Agente |
| M16 | Créditos de portada sin fuente comprobable: **Sumisos** («Foto firmada «@DIAZ FARRE»»), **Renacidos** («Cartel de la comparsa Los Renacidos»), **Ciudad invisible** y **Oveja Negra** (página de Facebook `LaComparsaDeMartinezAres`, 400 a bots). «Cada portada tiene crédito»: **confirmado** (11/11), pero dos créditos no dicen autor ni enlace. | `blog.json` `cover.credit`; `creditos/` promete «con su fuente». | Decidir si basta la firma o buscar la fuente. | Maqueta | Tú |
| M17 | Repos con README desfasados (no afecta al portafolio, sí a quien llega desde él): `api-coac` apunta a `…/ares-api/data/` (404) y el repo se llama `api-coac` pero el portafolio dice «Ares API»; `string-transformer` recomienda `pnpm dlx string-transformer`, pero **ese nombre en npm es de otra persona** (`howard.zuo`, GPL-3.0), así que ese comando instala otro paquete, y el repo no tiene archivo `LICENSE` aunque `package.json` dice MIT; `accessibility` no tiene README (el texto del proyecto sale del código, no de un README: es la excepción a la regla de la casa). | `gh api` (readme, license), registro npm. | Corregir los README/URL o publicar el paquete con otro nombre; añadir README y LICENSE. | Maqueta (repos) | Tú |
| M18 | Sumisos: «Quico Zamora (presidente de la Asociación de Autores…)». | La fuente enlazada es de **diciembre de 2015** y el nombre figura como «Kiko Zamora». Hispanopedia lista «Guacamayos y lechuguinos» en 1984 con Julio Pardo y Kiko Zamora, sin decir quién hizo letra y quién música. Veredicto: **no verificable** el reparto letra/música ni que siga siendo presidente. | «entonces presidente» o quitarlo. | Maqueta | Tú |
| M19 | Ciudad invisible: «Ángel Subiela (el director)» en Los Piratas 1998. | Prensa del Carnaval escribe «Zubiela» y lo sitúa junto a Martínez Ares; ninguna fuente confirma que dirigiera la comparsa de 1998. Veredicto: **no verificable**. | Confirmar en el archivo del COAC o matizar. | Maqueta | Tú |

### 3.3 Dejar como está (verificado)

| Id | Afirmación | Fuente / medida | Veredicto |
|---|---|---|---|
| D1 | Los **13 repos** existen, son públicos, de `nandovejer` y no son forks; los años de `projects.json` coinciden con `createdAt` (2023: coac, string-transformer; 2024: luz, libros, js-subtype; 2025: apiChrome, toolbar-aem, illo-loader; 2026: ikay-vanilla, streetcai, api-coac, accessibility, coac-analisis). | `gh repo list`. | confirmado |
| D2 | Las **13 URLs de demo y repo** responden 200 y apuntan al sitio previsto (no parqueado); `luzds.com` es la web de LUZ. | `curl -L`. | confirmado |
| D3 | **LUZ**: «cuatro paquetes en npm» (`tokens`, `core`, `catalog` 0.4.1 y `check` 0.3.2, todos MIT), beta, sin telemetría, MIT con fuentes, WCAG 2.2 AA «en tres modos», `luz-check`, «sin pruebas con tecnología de apoyo». | README de `luz`, registro npm. | confirmado |
| D4 | **IKAY**: 33 datos, 0 permisos, árabe/español/inglés, Fraunces, Inter Tight, Fira Code, 7:1 en alto contraste, original de 2020 con 16 tarjetas, sin CDN ni cookies, «tu ID» sobrevive a cookies e incógnito. | README de `ikay-vanilla`; repo `ikay` (2020-10-30). | confirmado |
| D5 | **Street Cai**: 8 luchadores y jefe final (Tío de la Tiza), barrios, 3 dificultades, rondas al mejor de 3, CONTINUE, exhibición a los 20 s, voz de Piper escrita «a la gaditana», ~0,35 MB de arranque, sin conexión. | README de `streetcai`. | confirmado |
| D6 | **Ares API**, **Toolbar AEM** (Manifest V3, sin build, favicon por entorno, marcadores, JSON de equipo), **String Transformer** (50+ formatos en 8 categorías, PWA), **Gestor de comparsas** (CSV/XLSX/XLS, `localStorage`, IA local de Chrome), **illo-loader**, **js-subtype** (npm 1.1.0, MIT), **Libros del mundo** (colaborativo con pull request), **Acme Studio** (errores listados coinciden con los comentarios del HTML). | READMEs y el HTML de la demo. | confirmado |
| D7 | **¿Quién canta hoy?**: React/Vite/TypeScript sobre LUZ, sin cuentas ni cookies, datos estructurados JSON-LD, CI/deploy con GitHub Actions, WCAG AA en oscuro y alto contraste. | README de `coac`. | confirmado |
| D8 | Las **11 fechas** de los artículos coinciden con la API de WordPress; categorías 7 + 4; «11 artículos · 2020–2026» y «13 proyectos · 2023–2026»; contadores por tecnología (JavaScript 8, HTML 7, CSS 5, LUZ 3). | WP API y texto renderizado. | confirmado |
| D9 | **Tiempos de lectura** coherentes con 230 palabras/min (Hamilton 6, IA 17 y 22, Web Components 5…). | Recuento de palabras de `blog.json`. | confirmado |
| D10 | **Hamilton**: nacimiento en Paoli (1936), Earlham (1958), MIT 1959 con Lorenz, SAGE 1961, Apolo 1965, más de 400 personas en 1968, hija Lauren a los 4 años y P01, Apolo 8 (Lovell), Medalla de la Libertad 2016, 90 años y 30 de septiembre; Armstrong «Program alarm»/«It’s a 1202», Duke «We’re go on that alarm» 27 s después, alunizaje a las 102:45:40, Executive por prioridades. | MIT News, ALSJ, Wikipedia (AGC). Las fotos: `Margaret_Hamilton_-_restoration.jpg` y `Hamilton Medal of Freedom from Obama.jpg` son **dominio público**; el crédito «Lawrence Jackson» coincide con el pie oficial de la Casa Blanca. | confirmado |
| D11 | **Cronología de la IA** (69 hitos en cada versión): fechas y atribuciones de 2018 a 2025 (GPT-1 a Mistral 3), Nobel de Física 2024, AEPD «Cuidado con lo que le confIAs» (27-ene-2026, con las recomendaciones citadas), AI Act (art. 50 desde el 2-ago-2026; alto riesgo aplazado al 2-dic-2027), Anthropic (cinco años o 30 días), Gemini «Conservar actividad» y chats temporales de 72 h, GPT-6 Astra (3-sep-2026, prensa), Mythos Preview (7-abr-2026), DeepSeek V4 (24-abr-2026), Sonnet 5, Opus 5 y Opus 5.5 (24-jul y 22-sep-2026, 40 % menos que Opus 5). | Páginas oficiales y prensa. Los matices están en M4 a M9. | confirmado |
| D12 | **Cronología histórica** (Hefesto, Herón, Al-Jazari 1206, Llull, Leibniz, Vaucanson, Jaquet-Droz, Turco, Lovelace, Boole, Cajal, Shannon, McCulloch-Pitts, Macy, Wiener, Grey Walter, Hebb, Turing, Dartmouth, perceptrón y cita del NYT, Samuel, Minsky-Papert, Lighthill, retropropagación, AlexNet, transformer) y «Turco de Racknitz (1789)». Los DOI de Turing y Samuel resuelven. | Conocimiento contrastado con las fuentes enlazadas; no abrí cada una (ver método). | confirmado (con esa salvedad) |
| D13 | Autoría y año de las letras citadas: Oveja Negra 2024, Ciudad Invisible 2023 y Sumisos 2022 (Antonio Martínez Ares); Renacidos 2022 (Miguel Ángel García Argüez). Los artículos lo declaran de forma coherente. Contexto histórico de los «guacamayos» y «lechuguinos» (La Voz de Cádiz). | Encargo previo + los `cite` de `blog.json` + la fuente enlazada. | confirmado |
| D14 | **Kanji**: los 13 (光 歌 遊 跡 内 替 変 譜 析 皆 巡 型 旅) con lecturas on/kun y significados correctos. | Revisión propia, sin diccionario en línea. | confirmado |
| D15 | Poemario «**Leyendo Claroscuros**» existe en Bubok (`bubok.es/libros/202648`), con autor «Fernando Muñoz Muñoz» (Nando = Fernando). | Página de Bubok. | confirmado |
| D16 | **Política de cookies** frente al código y al navegador: 0 cookies, localStorage vacío y 0 peticiones externas en 12 páginas sin consentimiento; claves `luz-consent` (180 días, `consent.js:28-29`) y `luz-theme` (solo si se pulsa); YouTube solo tras «sí» (`blog.js:443-484`); miniaturas `i.ytimg.com` solo con consentimiento; los tuits son tarjetas hechas aquí (sin cargar X). | Ejecución en Chromium + lectura de `consent.js`, `theme.js`, `blog.js`. | confirmado |
| D17 | **Privacidad**: «no tiene registro, ni formularios, ni comentarios, ni boletín, ni publicidad, ni estadísticas». | `grep` de `<form`/`mailto` y recorrido: no hay formularios propios (el `form` de `consent.js` es un `<dialog>` y el de `blog.js` es el buscador local). | confirmado |
| D18 | **Créditos**: licencia MIT del código (archivo `LICENSE` presente); OFL de Archivo, Chakra Petch y Doto (`OFL.txt` con sus avisos); componentes de LUZ (en `assets/vendor/luz/`, con su `LICENSE`); Noto Sans CJK JP para los kanji; portada de Hamilton (D10); «cada portada tiene crédito» (11/11). | Archivos del repo. | confirmado |
| D19 | **Socials**: `github.com/nandomunoz` (200, cuenta real), `x.com/nandovejer` (existe), `soynando.com`, `/blog/` y `/feed/` (200). | `curl`, `gh`. | confirmado la existencia |
| D20 | Enlaces de artículos de la lista de 160: 117 dan 200 sin más. Los bloqueos a bots (OpenAI 403, Unsplash 401, Facebook 400, Meta AI 400, Medium/StackOverflow/El País/PayPal/Terceravía 403) no se han contado como roto. | `res.txt` de la ejecución. | no verificable para esos |
| D21 | **Enlaces internos a `soynando.com`** (las 11 URL de `url` en `blog.json`, `site.json` socials y `blogUrl`): resuelven hoy porque la web es la WordPress actual. | `curl`. | confirmado hoy; ver Fase 10 |
| D22 | Bio: «más de diez años… tech lead de frontend», «AEM, EDS y SFCC», Cádiz · Madrid, «poemario» (D15). Coherente en home ES/EN, `metaDescription`, `title` y kicker. | `site.json`, texto renderizado. | coherente; la experiencia profesional es **no verificable** (LinkedIn bloqueado) |

---

## 4. Preguntas para el dueño

1. **C9:** ¿Cuál de los dos artículos «¿Hay alguien dentro?» es el definitivo? ¿Se redirige el otro?
2. **C11:** ¿Quieres «una selección de lo que he publicado» o añadir `cole`, `nandovejer.github.io`, etc.?
3. **C8 y C6:** ¿Tienes otro vídeo de la misma cuarteta de La ciudad invisible, y el handle nuevo de la persona que firma «@DIAZ FARRE»?
4. **M1:** ¿Mantienes «publicado desde 2010» en la tarjeta de Libros del mundo o prefieres limpiar el repo de reediciones y traducciones?
5. **M13:** ¿Añadimos «no oficial» a la ficha de ¿Quién canta hoy?
6. **M3:** ¿Actualizas el artículo de la huella digital con una nota de 2026 o lo dejas con su fecha de 2020?
7. **M16, M18 y M19:** ¿Quieres comprobar en el archivo del COAC la dirección de Los Piratas 1998 y el reparto del coro de 1984, o matizamos el texto?
8. **M17:** ¿Publicas `string-transformer` en npm con otro nombre o corriges el README?
9. **C13:** ¿Qué correo de contacto se usa en las políticas?

---

## 5. Lista para pegar en la Fase 10 del plan de Astro

Solo lo comprobable.

- [ ] Todos los enlaces externos de los artículos y proyectos responden (repetir la ejecución de 160 URLs; excluir los bloqueos a bots y revisarlos a mano).
- [ ] Las URLs `soynando.com/<slug>/` de los 11 artículos se conservan, o hay redirección 301 desde el slug antiguo.
- [ ] Hay una sola versión de «¿Hay alguien dentro?» (la otra redirige) y no se publican dos con el mismo `<title>` y la misma descripción.
- [ ] `creditos/` lista **todas** las tipografías servidas (comprobar contra la pestaña de red) y `OFL.txt` tiene un aviso por cada una.
- [ ] Ningún `href` empieza por `http://(` ni apunta a un gist, vídeo o perfil inexistente; los vídeos de YouTube embebidos son públicos (probar `oembed` de cada `yt`).
- [ ] La política de cookies sigue siendo cierta con el HTML de Astro: 0 cookies, 0 entradas en localStorage y 0 peticiones externas antes del consentimiento; `luz-consent` a 180 días.
- [ ] No queda ningún marcador `⟦…⟧` en `cookies/` ni en `privacidad/`.
- [ ] Las fechas de los artículos del HTML estático coinciden con la API de WordPress y con `datePublished` del JSON-LD.
- [ ] Contadores («13 proyectos · 2023–2026», «11 artículos · 2020–2026», filtros por tecnología) se generan de los datos y siguen siendo correctos.
- [ ] Los 13 `demo` y `repo` de `projects.json` siguen respondiendo 200 y los años coinciden con `createdAt` (repetir con `gh repo list`).
- [ ] Las afirmaciones del cubo Mejorar M4 a M9 se revisan con la fuente del día (los modelos y fechas de IA cambian cada pocas semanas).
