# Informe de rendimiento en cliente: maqueta Trama

Auditor: perf-auditor. Fecha: 2026-11-16. Rama `proto/home`, carpeta `maqueta/`, servidor `python3 maqueta/serve.py` (http://localhost:8766/maqueta/). Estado auditado: el actual (bucles de imagen de un solo ciclo que descansan, lluvia del hero y del 404 que descansa a los 5 s, sin banner de cookies). No se ha editado nada salvo este informe.

---

## 1. Resumen

**Veredicto.** La maqueta está bien en lo que cuesta cuando no hace nada: sin fugas de memoria, el scroll va a 60 fps incluso con CPU 4× más lenta, las miniaturas y las portadas de un solo ciclo paran del todo al descansar y el diálogo de proyecto abre en 42 ms (105 ms a 4×). Hay **tres problemas reales de ejecución** y **uno de peso**: (1) los canvas de los títulos no paran nunca mientras se ven; (2) la lluvia del hero cuesta 3× el presupuesto en un móvil de gama media y tarda 1,4 s + 1,9 s de tarea larga en construirse; (3) cambiar de modo de color en la home congela la página 255 ms (525 ms a 4×); y (4) las miniaturas de 160×81 px descargan AVIF de 1600 px (320 KB cada una). Las páginas de texto (cookies, privacidad, créditos) cargan 747 KB y 22 scripts para mostrar un texto; eso lo resuelve Astro.

Las cinco más importantes, por impacto × confianza ÷ esfuerzo:

1. **C1. Canvas de títulos sin reposo.** 60 callbacks de rAF por segundo para siempre mientras haya un título a la vista. Hilo principal ocupado: 23 % en la home (sección Contacto, escritorio), **87 % a 4× en móvil**, 7 % / 16 % en `/cookies/`. Con los bucles parados: 0,1 %. Arreglo pequeño (parar cuando el título se ha asentado).
2. **C4. Miniaturas con la imagen entera.** `/blog/` descarga 841 KB de AVIF para 1 portada (640×270) y 4 miniaturas (160×81); la home, 694 KB para 3 miniaturas de 160×81; el 404, 694 KB para 88×81. Con `srcset` y tamaños pequeños serían unos 60 KB en total.
3. **C2. Lluvia del hero: 23 ms por fotograma a 4×** (presupuesto 8 ms; 5,1 ms en escritorio). A DPR 1 baja a 7,4 ms.
4. **C3. Construcción del hero: tareas largas de 1435 ms y 1916 ms a 4×** (282 y 239 ms en escritorio) y LCP de 1632 ms en móvil 4× (516 ms en escritorio). Se construye al menos 3 veces (fuentes, imagen y un `hero.layout()` explícito) y crea 17 canvas a tamaño completo.
5. **M1. Cambio de modo de color en la home.** 255 ms de manejadores síncronos (525 ms a 4×) porque `build()` reconstruye los 27 bloques, también los que no se ven. En el blog son 4 ms.

**Recuento por cubo:** Cambiar 7 · Mejorar 8 · Dejar como está 10.

**Ruido de medida.** Otros agentes usaron Chromium a la vez (carga media del equipo entre 0,9 y 2,9 durante la sesión). Todas las cifras de tabla son **medianas de 2 a 3 ejecuciones** (se indica en cada una) en contextos nuevos con caché desactivada. Las diferencias grandes (87 % frente a 0,5 %, 23 ms frente a 5 ms) no son ruido; las de pocos milisegundos entre perfiles sí podrían serlo (±1 ms). El Chromium headless rasteriza el canvas por software, así que el coste de pintado a 4× es pesimista frente a un móvil con GPU; el tiempo de JavaScript por fotograma y los bytes sí son fiables.

---

## 2. Método

**Qué se leyó.** `maqueta/rain.js`, `dots.js` (HeroField, DotBlock), `main.js`, `blog/blog.js`, `blog/parts.js` (`coverLoop`), `shared/{content,theme,green,poster}.js`, `serve.py`, cabeceras de los HTML, `style.css` (`@font-face`), el contenido de `maqueta/img/` y `shared/blog.json`.

**Qué se midió** (Chromium headless_shell 1243 con playwright-core, CDP; scripts en el área de trabajo temporal, ninguno dentro del repo):

| Qué | Cómo |
|---|---|
| Carga por página (11 páginas × escritorio 1280 px y móvil 375 px con CPU 4×, 3 ejecuciones) | `Network.*` para peticiones y bytes, `PerformanceObserver` para LCP, CLS y tareas largas |
| Coste de fotograma | rAF envuelto (tiempo de cada callback) + `Performance.getMetrics` (TaskDuration, ScriptDuration) en ventanas de 4-5 s; perfiles 1×, 4× y 6× |
| Reposo | ventana de 4 s tras el descanso; con y sin los bucles de rAF (`requestAnimationFrame` anulado) para aislar su coste |
| Perfil de CPU | `Profiler` con muestreo de 0,5 ms, por tramos de 250 ms |
| Memoria | 10 aperturas del diálogo + 12 cambios de modo + 6 redimensionados en la home, y lo mismo en `/blog/`; `HeapProfiler.collectGarbage` antes de cada lectura |
| Modo de color | clic en el botón con View Transition real; manejadores síncronos, tarea larga, doble rAF |
| Imágenes | `naturalWidth` frente a tamaño mostrado, tras recorrer la página; `md5sum` de duplicados |
| Escala | `blog.json` replicado ×5 (55 entradas): análisis y proceso en 1× y 4× |

**Qué no se pudo medir.** Latencia de red real, compresión y caché de producción (el servidor de pruebas no comprime y manda `no-store`; las cifras de bytes son crudas, con gzip entre paréntesis donde se calculó). LCP y KB finales: se medirán en el sitio construido. Pestaña oculta: no se pudo ocultar la pestaña en headless; se deduce del código (no hay `visibilitychange`, pero el navegador no llama a rAF en pestañas ocultas y el reloj de la lluvia limita `dt` a 250 ms). Rendimiento en GPU real de móvil. Cobertura de CSS: la herramienta de uso de reglas no fue fiable y no se cita.

### Tabla 1. Carga por página (medianas de 3)

| Perfil | Página | Peticiones | KB crudos | FCP ms | LCP ms | CLS | Tareas largas (suma ms, primeros 6,5 s) |
|---|---|---|---|---|---|---|---|
| Escritorio | Home | 33 | 918 | 88 | 516 | 0,0018 | 1031 |
| Escritorio | Proyectos | 43 | 780 | 184 | 212 | 0 | 0 |
| Escritorio | Proyecto | 35 | 780 | 120 | 164 | 0 | 0 |
| Escritorio | Blog | 40 | 1596 | 136 | 136 | 0 | 0 |
| Escritorio | Artículo largo | 35 | 1081 | 188 | 188 | 0 | 0 |
| Escritorio | Categoría | 40 | 1605 | 132 | 160 | 0 | 0 |
| Escritorio | Etiqueta | 34 | 902 | 148 | 156 | 0 | 0 |
| Escritorio | Cookies / Privacidad / Créditos | 30 | 747 | 128-176 | 144-196 | 0 | 0 |
| Escritorio | 404 | 37 | 1625 | 196 | 196 | 0 | 315 |
| Móvil 4× | Home | 33 | 918 | 148 | **1632** | 0 | **6248** |
| Móvil 4× | Proyectos | 43 | 780 | 440 | 440 | 0 | 156 |
| Móvil 4× | Blog | 40 | 1596 | 348 | 532 (IMG portada) | 0 | 127 |
| Móvil 4× | Artículo largo | 35 | 1081 | 652 | 652 | 0 | 284 |
| Móvil 4× | Cookies | 30 | 747 | 300 | 300 | 0 | 63 |
| Móvil 4× | 404 | 37 | 1626 | 480 | 480 | 0 | 1774 |

LCP de la home: el texto del cartel (`SPAN.wd`, tecleado desde 900 ms). Presupuesto orientativo LCP ≤ 2,5 s: cumple; la tarea larga de 1,4 s a 4× es lo que lo empuja.

### Tabla 2. Coste de fotograma de la lluvia del hero (la despierta un `pointermove` tras el descanso; mediana de 3; CPU = estrangulación)

| Perfil | Ancho/DPR | Media por callback | p95 | Máx | Fotogramas/s | Hilo ocupado | Presupuesto 8 ms |
|---|---|---|---|---|---|---|---|
| Escritorio 1× | 1280 / 1 | 5,1 ms | 9,2 | 13,3 | 60 | 64 % | cumple (media), p95 no |
| Móvil 1× | 375 / 2 | 4,3 ms | 7,0 | 9,5 | 60 | 66 % | cumple |
| Móvil 4× | 375 / 2 | **23,4 ms** | 33,8 | 36,5 | **20** | 98 % | **no (3×)** |
| Móvil 6× | 375 / 2 | **35,0 ms** | 51,0 | 53,4 | 14 (41 en el muestreador) | 99 % | **no (4,4×)** |
| Móvil 4× | 375 / **1** (experimento) | 7,4 ms | 13,7 | 16,9 | 60 | 83 % | casi |
| 404, escritorio 1× | 1280 / 1 | 2,1 ms | 5,4 | 5,8 | 60 | 26 % | cumple |
| 404, móvil 4× | 375 / 2 | 3,6 ms | 9,3 | 10,3 | 60 | 80 % | cumple (media) |

### Tabla 3. Reposo (4 s tras el descanso, mediana de 2-3)

| Escena | Perfil | Callbacks rAF/s | Hilo ocupado con bucles | Con bucles parados |
|---|---|---|---|---|
| Home, hero a la vista | 1× / 4× | 0 / 0 | 2,5 % / 0,7 % | n/a |
| Home, sección Contacto (título a la vista) | 1× | **60** | **23,3 %** | 0,1 % |
| Home, sección Contacto | móvil 4× | **60** | **86,8 %** | 0,5 % |
| `/blog/` (título) | 1× | 60 | 5,9 % | 0,0 % |
| `/proyectos/` (título) | 1× | 60 | 9,5 % | 0,0 % |
| `/cookies/` (título) | 1× / 4× | 60 / 60 | 7,1 % / 16,2 % | 0,1 % |
| `/blog/` con filas visibles (portadas ya en reposo) | 1× / 4× | 0 / 0 | 0,7 % / 1,7 % | n/a |
| 404 tras el descanso | 1× / 4× | 0 / 0 | 0,7 % / 1,5 % | n/a |
| Artículo largo | 1× / 4× | 0 / 0 | 0,8 % / 1,8 % | n/a |

### Tabla 4. Otras interacciones

| Medida | 1× escritorio | 4× móvil |
|---|---|---|
| Cambio de modo, home en Proyectos: manejadores síncronos / tarea larga / clic→2 rAF | 255 ms / 238 ms / 299 ms | 525 ms / 468 ms / 559 ms |
| Cambio de modo, `/blog/` | 4 ms / 0 / 41 ms | 17 ms / 0 / 59 ms |
| Cambio de modo, artículo | 10 ms / 0 / 77 ms | no medido |
| Abrir el diálogo de proyecto (clic→2 rAF) | 42 ms | 105 ms (tareas largas: 0, la mayor 57 ms) |
| Scroll completo en 4 s: p95 de fotograma, % de fotogramas > 25 ms | home 16,8 ms, 0 % · artículo 16,8 ms, 0 % | home 16,8 ms, 0 % · artículo 16,7 ms, 0 % |
| Montón JS tras 28 acciones (home) | 3,31 → 3,76 MB | n/a |
| Montón JS tras 12 acciones (blog) | 1,83 → 1,89 MB | n/a |
| Nodos DOM / oyentes (home) | 1141 → 1211 / 49 → 49 | n/a |
| Análisis de `blog.json`: 11 entradas / 55 entradas | 1 + 2,8 ms / 2,1 + 12,4 ms | 2,2 + 11,9 ms / 8,7 + 50,1 ms |

### Tabla 5. Peso del repo en `maqueta/img/` (118 archivos)

| Formato | Archivos | Total |
|---|---|---|
| JPG (respaldo) | 32 | 4,61 MB |
| WebP | 55 (23 son mapas de tono de 0,4-6,8 KB) | 2,79 MB |
| AVIF | 31 | 1,71 MB |
| Mapas de tono (`*.tone.webp`, 192 px) | 23 | 87 KB |
| Duplicados exactos (md5) | `introduccion-a-la-ia` y `-2`: jpg, webp, avif y tone | 0,64 + 0,53 + 0,32 MB repetidos |

---

## 3. Hallazgos

### Cambiar

| Id | Qué | Evidencia | Arreglo | ¿Maqueta o Astro? | Decide |
|---|---|---|---|---|---|
| C1 | Los canvas de los títulos (`HeroField`, los `.decode` de cada sección y de cada página) no paran nunca mientras están a la vista: redibujan toda la superficie en cada fotograma sin que nada se mueva. | `dots.js:421-422`: `loop` se reprograma siempre mientras `running`; solo `titleIO` (`main.js:413-420`) lo para al salir de pantalla. Tabla 3: 60 callbacks/s en reposo; 23 % del hilo en la home (1×), 87 % a 4×, 7-16 % solo con el título de `/cookies/`; 0,1-0,5 % si los bucles se anulan. Rompe la regla de «CPU en reposo ≈ 0». | Parar el bucle cuando el título está asentado (intro terminada, ninguna partícula a más de ~0,3 px de su sitio, sin puntero ni ola) y reanudarlo con `pointermove`, `poke`, `mend` o `repaint`. Guardar el id del rAF y cancelarlo en `stop()`. Es el cambio más barato y el de más efecto. | Maqueta | Dueño: no; se puede hacer ya |
| C2 | La lluvia del hero cuesta 23 ms por fotograma en un móvil de gama media (presupuesto 8 ms): 20 fps durante sus 5 s de movimiento, hilo al 98 %. | Tabla 2. Perfil: `lluvia.frame` (`rain.js:226`) es el 42 % de las muestras a 4× (1531 de 3183 ms en 3 s). Cada fotograma limpia y recompone lienzos a tamaño completo (hoja, copia verde, máscara mezclada con `lighter`, máscara con `destination-out`) a DPR 2. Con DPR 1 el mismo móvil 4× baja a 7,4 ms (3,2×). | (a) Pintar la lluvia a DPR 1 (o 1,25) en pantallas estrechas o táctiles: los puntos son de 5 px y no se nota; (b) cuando no hay cambio de máscara (`k = 0`) dibujar la máscara activa con `globalAlpha` directamente en vez de componer `f.mix` cada fotograma; (c) opcional: 30 fps en táctil. Repetir la medida en un móvil real. | Maqueta | Dueño: confirmar que el DPR 1 no se nota en su móvil |
| C3 | La primera construcción del hero bloquea el hilo: tareas largas de 1435 + 1916 ms (4×) y 282 + 239 ms (1×); LCP móvil 4× de 1632 ms frente a 516 ms en escritorio. | Perfil por tramos: `lluvia.frame` desde `RainField.layout` (`rain.js:351-360`). `layout()` corre al menos 3 veces: al cargar la fuente (`rain.js:346`), al cargar la imagen (`picture(..., () => f.resize())`, `rain.js:152`) y en `hero.layout()` explícito (`main.js`, final). Evidencia: `getImageData` a tamaño completo 2 veces (`imageMask`, 21-25 ms cada vez) y 17 canvas a tamaño completo creados en la carga (750×1624 o 1280×800, 3-4 MB cada uno). | Construir una sola vez: esperar fuente e imagen y ignorar `layout()` si el tamaño no ha cambiado; quitar el `hero.layout()` final si `ready` ya lo hace; construir la máscara de gatos y la de la imagen en la primera `wake`, no en la carga (en la carga solo se ve el nombre). | Maqueta | No |
| C4 | Las miniaturas cargan la imagen entera: 160×81 px (88×63 en móvil) con AVIF de 1600 px y 320 KB. | Tabla de imágenes mostradas (recorriendo la página): `/blog/`: 1 portada 640×270 + 4 miniaturas; AVIF 54 + 320 + 320 + 114 + 33 = **841 KB**. Home: 3 miniaturas = **694 KB**. 404: 3 miniaturas de 88×81 = **694 KB** (el 404 pesa 1625 KB). Artículo: la portada mostrada a 1114×464 ocupa 320 KB (razonable). | Generar variantes de 320, 640 y 1200 px y poner `srcset`/`sizes` en el `<picture>` (en `coverPicture`/`projectPicture`, `parts.js:187-201`). La miniatura de la fila pasaría a ~10-15 KB. | **Las dos**: el marcado y los `sizes` se escriben aquí; la generación de variantes la hace la imagen optimizada de Astro | Dueño: no |
| C5 | Las páginas de texto (cookies, privacidad, créditos) pesan 747 KB y cargan 22 scripts y 3 JSON para mostrar un texto. | Tabla 1: 30 peticiones. Cargan `blog.js` (46 KB), `rain.js`, `dots.js`, `kanji-cells.js` (48 KB), `gatos.js`, `highlight`/`clipboard`/`i18n` de LUZ, `blog.json` (239 KB), `projects.json` (32 KB), `site.json` y la fuente Playfair (38 KB). Cobertura de funciones ejecutadas: 62 % de 235 KB; `blog.js`, 35,6 KB de 46,3 KB sin ejecutar. | En Astro cada página sale como HTML estático con el CSS y el JS justos (el pie, el cambio de modo, el idioma). Mientras tanto, nada que hacer en la maqueta más que no tomarlo como medida del sitio final. | Astro | No |
| C6 | `blog.json` (todas las entradas con su cuerpo) se descarga y analiza en **todas** las páginas, también en la home, en proyectos y en cookies. | `shared/content.js:45`. 239 KB crudos (75 KB gzip), el 92 % es texto de artículos (218 KB de 228). Con 55 entradas: 1,0 MB crudos (estimado 0,35-0,4 MB gzip); el análisis cuesta 12 ms (1×) / 50 ms (4×). La home solo necesita título, fecha y portada de 3 entradas. | Astro: una página por artículo (el cuerpo va en su HTML) y un índice ligero (id, fecha, categoría, etiquetas, título, extracto, portada) para listados y búsqueda del 404. En la maqueta, nada. | Astro | No |
| C7 | El 404 descarga 700 KB de miniaturas y 188 KB de `escritorio.jpg` (la máscara de la lluvia) para una página de error. | Tabla 1: 1625 KB, 37 peticiones; `escritorio.jpg` 188 448 B. Ver C4 y M3. | Resuelto con C4 y M3; además el 404 puede mostrar las 3 últimas entradas sin portada, solo con los puntos. | Las dos | Dueño: ¿el 404 necesita las portadas? |

### Mejorar

| Id | Qué | Evidencia | Arreglo | ¿Maqueta o Astro? | Decide |
|---|---|---|---|---|---|
| M1 | Cambiar de modo de color en la home congela la página 255 ms (525 ms a 4×) antes de que empiece el círculo del reveal. | Tabla 4. `onMode` (`main.js:76`) llama a `build()` que reconstruye los 27 bloques, también los que están fuera de pantalla. A 4×, clic→pintado 559 ms, por encima de los 500 ms que se consideran INP «pobre». En `/blog/` son 4-17 ms. | Repintar solo los bloques visibles y marcar el resto como sucios para que se repinten al entrar en pantalla. | Maqueta | No |
| M2 | La fuente Playfair Display (38,6 KB) se descarga en todas las páginas y retiene la construcción del 404. | `rain.js:343`: `const fontsReady = document.fonts.load(TITLE(100))` se ejecuta al importar el módulo; solo la máscara del nombre del hero la usa. En el 404 (máscara de imagen) `ready` espera igualmente a la fuente. | Pedirla de forma perezosa solo cuando se construye la máscara del nombre (hero). | Maqueta | No |
| M3 | `escritorio.jpg` (1319×1193, 188 KB) se descarga solo para leer sus píxeles como máscara y está en la ruta crítica del hero. | `rain.js:134`, `imageMask` lee `getImageData`; no se muestra. Los mapas de tono de los proyectos hacen lo mismo con 192 px y 1-7 KB. | Sustituirlo por un mapa de tono en gris de unos 400 px (~10-15 KB) y cargarlo en la primera `wake`. Queda fuera de la regla `<picture>` (solo lee píxeles). | Maqueta | Dueño: revisar que la escena del escritorio se sigue leyendo bien |
| M4 | Dos entradas distintas comparten la misma portada: `introduccion-a-la-ia` e `introduccion-a-la-ia-2`. | `md5sum`: jpg, webp, avif y tone idénticos. Se piden como dos URL distintas en la home, el blog y el 404 (320 KB dos veces en `/blog/`). Repo: 0,64 + 0,53 + 0,32 MB repetidos. | Que ambas entradas apunten a un único archivo (o dejar que Astro lo deduplique por hash). | Las dos | Dueño: ¿son dos entradas distintas a propósito? |
| M5 | Módulos pesados importados en estático en todas las páginas. | `rain.js` importado por `blog.js` y `main.js`: 22 KB de 27 sin ejecutar en `/blog/` y cookies; `kanji-cells.js` (48 KB crudos, 5,3 KB gzip) viaja con `dots.js` aunque solo las tarjetas de proyecto lo usan; grafo de 3 niveles (`main → dots → kanji-cells`) sin `modulepreload`; 13 scripts en la home, 19-22 en el resto. | `import()` dinámico de `rain.js` cuando hay hero o 404, de `kanji-cells` al construir tarjetas de proyecto; en Astro, un paquete por página y precarga. | Las dos | No |
| M6 | `HeroField.stop()` no cancela el rAF pendiente. Si un título sale y vuelve a entrar antes de que se ejecute ese callback, `start()` crea un segundo bucle y los dos corren a la vez. | Lectura de `dots.js:419-427` (`stop()` solo pone `running = false`). `RainField` sí lo hace bien (`rain.js:389`). No lo he reproducido; es una carrera poco probable pero permanente si ocurre. | Guardar el id y `cancelAnimationFrame` en `stop()` (se arregla junto con C1). | Maqueta | No |
| M7 | Memoria de canvas durante la carga. | Se crean 17 canvas a tamaño completo (3-4 MB cada uno, ~60 MB acumulados antes de que el GC los recoja) y quedan vivos unos 7 en el hero: lienzo, hoja, copia verde, mezcla y tres máscaras (estimación por lectura de código, ≈34 MB a DPR 2 en un móvil; no medida en dispositivo). Montón JS estable (Tabla 4). | Liberar las máscaras que no se usan tras el descanso (`f.cycle[i].m = null` y reconstruir en la siguiente `wake`) y arreglar C3. | Maqueta | No |
| M8 | La portada destacada (el LCP del blog en móvil) no declara prioridad. | LCP de `/blog/` móvil 4×: `IMG blog/margaret-hamilton.avif`, 532 ms. `coverPicture` no pasa `fetchpriority`. | `fetchpriority="high"` solo en la portada destacada de la primera pantalla y `loading="lazy"` en el resto (ya lo está en las filas). | Las dos | No |

### Dejar como está

| Id | Qué se comprobó | Evidencia | Por qué está bien |
|---|---|---|---|
| D1 | Memoria y fugas | Tabla 4: montón 3,31 → 3,76 MB tras 10 diálogos, 12 cambios de modo y 6 redimensionados; 49 oyentes constantes; nodos 1141 → 1211. `/blog/`: 1,83 → 1,89 MB. | Sin crecimiento sostenido. Los canvas vivos se mantienen (27-28 en la home, 6 en `/blog/`). Al ser un sitio de varias páginas, la navegación libera todo. |
| D2 | Reposo de las portadas y miniaturas en bucle de un solo ciclo | `/blog/` con filas visibles: 0 callbacks/s, hilo 0,7 % (1×) / 1,7 % (4×). Coste por callback en el ciclo: 0,08-0,26 ms de media, p95 ≤ 0,7 ms. | Cumple «para al descansar» y el presupuesto de fotograma. |
| D3 | Reposo del hero y del 404 | Tabla 3: 0 callbacks/s, 0,7-2,5 % en el hero, 0,7 % / 1,5 % en el 404. Con CSS animaciones y filtros desactivados el hero queda en 0 %. | Descansa de verdad a los 5 s y no consume en reposo. |
| D4 | Lluvia del 404 | Tabla 2: 2,1 ms (1×), 3,6 ms (4×), 60 fps. | Dentro de presupuesto: canvas más pequeño y sin las tres máscaras del hero. |
| D5 | Scroll | Tabla 4: p95 16,8 ms y 0 % de fotogramas por encima de 25 ms en home y artículo, también a 4×. | El `scroll` es `passive`, trabaja en un rAF y solo toca los bloques visibles. |
| D6 | Abrir/cerrar el diálogo de proyecto | 42 ms (1×), 105 ms (4×), sin tareas largas por encima de 57 ms. | Por debajo de 200 ms (umbral de INP bueno) incluso con CPU 4×. |
| D7 | Fuentes | CLS 0,0018 en la home y 0 en el resto; `font-display: swap`; `archivo` y `doto-700` precargadas; 5 caras, 153 KB en todas las páginas; Doto 400, Special Elite y Pinyon no se piden. Los kanji de las tarjetas salen de `kanji-cells.js` (mapas de celdas), no de una fuente CJK; el modo con glifos de `rain.js` no se usa (`dots: true`). | No hay saltos de diseño. Las dos caras de Chakra Petch (20 KB) se descubren tarde pero no producen salto medible. La Playfair innecesaria está en M2. |
| D8 | Mapas de tono | 23 archivos de 192 px, 87 KB en total, 0,4-6,8 KB cada uno; la home pide 8. | Tamaño y número correctos; es el patrón que M3 propone para la máscara del escritorio. |
| D9 | `<picture>` y formatos | AVIF y WebP delante del JPG en `coverPicture` y `projectPicture`; `width`/`height` presentes; `loading="lazy"` en filas y proyectos; sin imágenes cargadas dos veces por página salvo el duplicado de M4. | Cumple la regla de CLAUDE.md. |
| D10 | Análisis y proceso de `blog.json` | Tabla 4: 1-3 ms (1×) y 2-12 ms (4×) con 11 entradas; 2-12 ms (1×) y 9-50 ms (4×) con 55. | Lo que escala mal es el peso en red (C6), no el proceso. Con paginación o un índice ligero ni se nota. |

---

## 4. Preguntas para el dueño

1. **C2.** ¿Te sirve la lluvia del hero a DPR 1 (puntos algo más blandos en pantallas de alta densidad) a cambio de ir a 60 fps en un móvil de gama media? Mi estimación es que no se nota porque la rejilla es de 5-7 px, pero es una decisión visual tuya.
2. **M3.** La escena del escritorio se lee como máscara a partir de un jpg de 1319×1193. ¿Te parece bien sustituirla por un mapa en gris de ~400 px (si la escena sigue leyéndose igual al verla)?
3. **M4.** ¿`introduccion-a-la-ia` e `introduccion-a-la-ia-2` son dos entradas distintas a propósito y deben compartir portada, o una es un borrador?
4. **C7.** ¿El 404 necesita las portadas de las últimas entradas o basta con los puntos y el texto?
5. **Dispositivo real.** Si puedes, pasa un móvil de gama media por `chrome://inspect` y mira C2 y C3: mis cifras son de rasterización por software y pueden ser pesimistas para el pintado, no para el JavaScript.

---

## 5. Lista para pegar en la Fase 10 del plan de Astro

- [ ] Ningún bucle de `requestAnimationFrame` activo en reposo en ninguna página (comprobar con 4 s de reposo en `/`, `/blog/`, `/cookies/` y un artículo largo: 0 callbacks/s y hilo < 2 %).
- [ ] Lluvia del hero: media por fotograma < 8 ms con CPU 4× y 375 px (hoy 23 ms), y sin tarea larga > 200 ms en la carga con CPU 4× (hoy 1435 y 1916 ms).
- [ ] LCP de la home en móvil con CPU 4× < 2,5 s (hoy 1632 ms) y CLS < 0,1 en todas las páginas (hoy ≤ 0,0018).
- [ ] Cambio de modo de color en la home: manejadores síncronos < 100 ms con CPU 4× (hoy 525 ms).
- [ ] Miniaturas de lista con `srcset`/`sizes`: ninguna imagen mostrada a 160 px descarga más de 30 KB; `/blog/` < 400 KB de imágenes (hoy 841 KB) y 404 < 150 KB (hoy 900 KB con la máscara).
- [ ] Una portada compartida por varias entradas se sirve desde un solo archivo (sin duplicados por hash en `dist/`).
- [ ] Páginas de texto (cookies, privacidad, créditos) sin `blog.json`, `projects.json`, `rain.js`, `dots.js` ni `kanji-cells.js` (hoy 747 KB y 22 scripts; objetivo < 150 KB de transferencia con gzip/brotli).
- [ ] La home no descarga el cuerpo de los artículos: índice ligero de entradas; cada artículo lleva su cuerpo en su HTML.
- [ ] Playfair Display solo se descarga donde se usa (home), y las fuentes críticas (Archivo, Doto 700, Chakra Petch 500/600) con `rel="preload"`.
- [ ] Hosting: compresión gzip o Brotli en JS, CSS, JSON y SVG; caché de larga duración con nombres con hash para JS, CSS, fuentes e imágenes (GitHub Pages, por documentación, manda `max-age=600` y solo gzip: comprobar si basta).
- [ ] `fetchpriority="high"` solo en la imagen LCP de cada plantilla; `loading="lazy"` en el resto.
- [ ] Repetir C2 y C3 en un móvil real de gama media (y en Chrome con GPU) y anotar las cifras.
