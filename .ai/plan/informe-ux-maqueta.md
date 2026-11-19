# Informe UX · la maqueta Trama

> Auditoría A8 del [plan de la maqueta](plan-maqueta.md) §2. Fecha: 2026-11-16 · Rama `proto/home`, carpeta `maqueta/` · Estado auditado: sin tarjeta de cookies (la elección vive en la compuerta del vídeo, en el pie → Preferencias y en la política), pie con cuatro grupos rotulados, bucles de imagen que se paran tras un ciclo, hero y 404 que se paran a los 5 s. Se ignora el texto de `blog.json` (otro agente corrige erratas a la vez).
> Capturas y scripts: en la carpeta de trabajo del agente, **fuera del repo**: `/tmp/claude-1000/-home-ares-Documents-repos-me/ec501b2d-cac8-4ee3-8064-974f1a53d49f/scratchpad/ux/` (los nombres de captura de abajo son archivos de esa carpeta, en PNG).

---

## 1. Resumen

**Veredicto.** La maqueta se entiende y se recorre bien: el idioma se cambia en un toque, cada cosa tiene un camino corto, el pie de cuatro grupos resuelve los problemas P1–P8 del plan (rótulos, estado junto al control, nombres iguales que la píldora y la home, una columna en móvil, sin nada tapado al final) y la decisión de quitar la tarjeta de cookies funciona: la elección está en el sitio donde importa (la compuerta), se retira desde el pie en tres toques y el vídeo abierto vuelve a ser compuerta sola. Los fallos que quedan no son de estructura sino de **detalle de uso**: dos artículos con el mismo título que se encuentran juntos en tres sitios, el botón Atrás que no cierra el panel de proyecto, la 404 en móvil que esconde la solución bajo una imagen, la piel flotante (píldora + botón de color) que tapa texto, y el selector de idioma, que marca como acción lo que no lo es.

**Los cinco hallazgos más importantes**

1. **C1 · Dos artículos con el mismo título** («¿Hay alguien dentro? Introducción a la inteligencia artificial para todos») aparecen uno tras otro en «Lo último» de la home, en «Sigue leyendo» y como «Más antiguo» del último artículo; sin fecha ni distintivo en el enlace, la persona no sabe cuál es cuál.
2. **C2 · El panel de proyecto de la home no tiene URL ni responde a Atrás**: medido, tras abrirlo y pulsar Atrás, la URL cambia y el panel sigue abierto (375 y 1280). En móvil Atrás es el gesto natural de cerrar.
3. **M4 · La 404 en móvil** gasta la primera pantalla en la foto: el título empieza a 535 px y el buscador a 795 px de 800; la sugerencia correcta existe pero hay que desplazarse para verla.
4. **M1 · Dos superposiciones fijas en móvil** (píldora 45 px y botón de color 44 px) tapan texto: el botón queda sobre el borde derecho de la columna de lectura y, en la compuerta, sobre su última línea; en horizontal (667×375) ocupan cerca de la cuarta parte del alto.
5. **M2 · El selector de idioma** marca con punteado verde el idioma **actual** (que parece una acción) y deja sin marca el enlace al otro; el destino táctil de «EN» mide 20×28 px en la cabecera.

**Cuentas por cubo:** Cambiar **3** · Mejorar **13** · Dejar como está **16**.

---

## 2. Método

**Leído.** `plan-maqueta.md` (§2, §3, §5), `maqueta/DESIGN.md` en lo que atañe, `maqueta/blog/parts.js` (`footer()`, `langSwitch`, bucles), `shared/consent.js`, `shared/theme.js`, `main.js` (home, panel), partes de `style.css` (`.nav`, `.langs`, `.foot`), y los informes ya hechos de accesibilidad, cookies y legal solo para no repetirlos.

**Medido** en Chromium headless (playwright-core, `chrome-headless-shell`) contra `http://localhost:8766/maqueta/`, a 375×800 (móvil táctil), 768×1024 y 1280×800, en español y, donde se indica, en inglés; modo oscuro:
- Capturas de arriba y de página entera de 12 páginas × 3 anchuras (`<página>-<m|t|d>-top.png`, `-full.png`; páginas: home, proy, proyp, blog, post, post2, cat, tag, cook, priv, cred, nf), barridos de scroll de la home y de un artículo (`hs-*`, `ps-*`, con hojas `*-sheet.png`).
- Recorridos con toques/clics/teclas contados (tabla de §3 bis), tamaños de destino (≥ 44 px) y elementos `position: fixed`.
- Hero: capturas a 0,6 / 3 / 5,5 / 8 / 12 / 16 s (`hero-d-*`, `hero-m-*`): sin ningún píxel de diferencia a partir de los 8 s. Bucles del blog: sin diferencia entre 3 y 12 s, y se repiten al pasar el puntero (`loop-*`).

**No pude** probar: lector de pantalla real, ni un dispositivo táctil físico (las medidas táctiles son emulación), ni a la gente de verdad (la prueba de cinco segundos del plan §5 sigue pendiente); el vídeo de YouTube no carga en el sandbox (se vio la compuerta y el `iframe`, no la reproducción). Las medidas de «pantallas» son altura de documento ÷ 800.

**Confianza.** Lo marcado «medido» tiene captura o cifra; lo que es criterio mío va como «propongo».

---

## 3. Hallazgos

Gravedad: alta / media / baja. Quién decide: **dueño** (Nando), **diseño** (se puede decidir en el arreglo).

### 3.1 Cambiar (antes de publicar)

| ID | Qué | Evidencia | Arreglo concreto | ¿Maqueta o Astro? | Decide |
|---|---|---|---|---|---|
| C1 | **Dos artículos con el mismo título** (`introduccion-a-la-ia` y `introduccion-a-la-ia-2`). Rompe «reconocer antes que recordar» y la coherencia de nombres: las dos filas son idénticas salvo la fecha pequeña (15 y 2 oct) y los minutos (17 y 22 min). Gravedad **alta**. | `hs-d-sheet.png`, `hs-m-sheet.png` (filas 2 y 3 de «Lo último»); `ps-d-sheet.png` (el último artículo termina con los dos en «Sigue leyendo» y su «Más antiguo» es el primero); `r6-*` (la 404 también los propone). Medido en 375 y 1280. | Decidir qué son: si el segundo es una versión nueva, un título distinto («… (parte 2)», «… edición ampliada») y/o una nota «Actualiza a: …»; si es un duplicado del WordPress, quitar uno y redirigir. Si se quedan los dos: poner la fecha completa en cada fila de lista y en los enlaces «Anterior/Siguiente». | Maqueta (contenido); redirección en Astro | **Dueño** |
| C2 | **El panel de proyecto de la home no tiene estado en el historial.** Abrir no cambia la URL (queda `#trabajo`) y **Atrás no lo cierra**: tras `goBack` la URL pasó a `/maqueta/` y el panel seguía abierto. Esc sí lo cierra y devuelve el foco a «Abrir» (bien). Gravedad **media-alta** en móvil (Atrás de Android = «cerrar»); el panel tampoco se puede compartir ni volver a abrir con un enlace. | `r3-m-2-panel.png`, `r3-d-2-panel.png`; medición `r3.mjs` (hist 3 → URL `/maqueta/` con `panel is-on:true`). | `history.pushState` al abrir y `popstate` que cierra (o `#p=luz` en la URL, que además da enlace profundo); al cerrar con Esc/Cerrar, `history.back()` si el estado lo puso el panel. La ficha completa ya existe en `/proyectos/proyecto/?p=`: dejarla como enlace «Ficha completa» (hoy está). | **Las dos**: en Astro cada proyecto tendrá URL propia; el panel puede quedarse como mejora progresiva | Diseño |
| C3 | **«Escríbeme» no ofrece una forma de escribir.** La sección 04, la píldora y el pie llevan a cinco redes (GitHub, X, LinkedIn, Facebook, RSS); no hay correo. El nombre promete algo que se hace en las redes. Pendiente de la decisión Q8/K4 del plan. Gravedad **media**. | `hs-d-sheet.png` (última pantalla), `r4-m-en-home.png`; el pie solo da GitHub, LinkedIn, X y RSS. | Poner el correo (o un formulario) en la sección y en «Sobre esta web»; si no se publica correo, que el texto diga «Encuéntrame en» o «Escríbeme por redes», y quitar RSS de la lista de contacto (no es una forma de escribir). | Maqueta | **Dueño** (Q8) |

### 3.2 Mejorar

| ID | Qué | Evidencia | Arreglo concreto | ¿Maqueta o Astro? | Decide |
|---|---|---|---|---|---|
| M1 | **Dos superposiciones fijas tapan texto en móvil.** La píldora (45 px, a 16 px del borde) y el botón de color (44×44 px, esquina inferior derecha, a ~79 px del borde) están siempre encima. El botón queda **sobre el borde derecho de la columna de lectura** y sobre el final de la compuerta del vídeo; en horizontal (667×375) píldora + botón + barra cubren cerca de la cuarta parte del alto. El pie sí está bien resuelto (`padding-bottom` 112 px: su último texto acaba a 687 px y la píldora empieza a 738). Gravedad **media**. D-12 (botón flotante) está decidido: se mejora el cómo, no el qué. | `r5-m-1-gate.png`, `r5-m-2-accepted.png`, `ps-m-sheet.png`, `land-m.png`, `end-m.png`; `targets.mjs` (rectángulos fijos). | Ocultar el botón al bajar (y mostrarlo al subir o al parar), o reducirlo a 36 px con menos opacidad en reposo; en horizontal bajo 480 px de alto, píldora y botón se pliegan a un solo control o se ocultan al desplazarse. | Maqueta | Diseño (dueño si cambia D-12) |
| M2 | **Selector de idioma: la marca va al revés.** `.langs__cur` (el idioma actual, que no hace nada) lleva punteado verde de 2 px, igual que los botones «Cambiar» del pie; el enlace al otro idioma va en gris sin marca. Parece que ES es lo pulsable. Además, «EN» mide 20×28 px en la cabecera (18×34 en el pie): un objetivo pequeño para una acción importante. Gravedad **media**. | `style.css:139-141`; `targets.mjs`; capturas `post-m-top.png`, `home-m-top.png`. | Marca del actual con `--ink` y peso (o fondo), sin punteado; el enlace con subrayado punteado o borde; destino táctil ≥ 44 px (padding horizontal y vertical, sin cambiar la maqueta visual). | Maqueta | Diseño |
| M3 | **Destinos pequeños.** Enlaces de la píldora: 22–80 × **23 px** dentro de una píldora de 45 px (la altura útil es la mitad de lo que se ve); enlaces del pie: **31 px** de alto con 8 px entre ellos; «Política de cookies» en la compuerta: 125×16 px; los `#` de los encabezados: 16×33. Pasan 2.5.8 AA por espaciado, pero no son cómodos con un pulgar (Fitts). Gravedad **baja-media**. | `targets.mjs` (375). | Dar a cada enlace de la píldora el alto de la píldora (`padding-block`) y a los del pie `min-height: 44px` en móvil; enlace de la compuerta con `padding`. | Maqueta | Diseño |
| M4 | **404 en móvil: la solución está bajo la foto.** A 375×800 la imagen ocupa 535 px; el título empieza en y≈535, el buscador en ≈795; la sugerencia «¿Buscabas esto?» (que acierta el artículo mal escrito) queda en la segunda pantalla. En 1280 se ve al pie de la primera. Gravedad **media**. | `r6-m-1.png`, `r6-d-1.png`, `r6-m-2-search.png`. | Bajo 480 px, la imagen a ~35–40 svh; o poner el título, el texto y la sugerencia **antes** del bloque de puntos. Que Intro en el buscador lleve al primer resultado (hoy no hace nada, mide `url` igual). | Maqueta | Diseño |
| M5 | **Llegar a un artículo desde Google no dice qué es el sitio ni quién escribe.** En la primera pantalla de un artículo (375 y 1280) hay el logo «NM Nando Muñoz» (pequeño, gris), migas, título, extracto, fecha y lectura; la firma «Escrito por … Más sobre mí» está al ~78 % del documento (≈ 11 pantallas en móvil). Una persona que llega de fuera ve un blog sin autor. Gravedad **media**. | `post-m-top.png`, `post-d-top.png`, `ps-*-sheet.png`, `r4-m-en-post.png`. | Una línea de firma bajo el título: «Por Nando Muñoz · tech lead de frontend» enlazada a `#bio`; mantener la firma final. Sirve también a GEO/SEO (autoría visible). | Maqueta (y Astro la hereda) | Dueño (texto) |
| M6 | **Home: el nombre aparece tarde.** En la primera pantalla solo teclea el lema (3 s: sin nombre); «una web de Nando Muñoz · tech lead de frontend · Cádiz · Madrid» llega entre los 3 y los 5,5 s, en la esquina inferior derecha y pequeño. Al logo de la cabecera le queda decir «quién». La prueba de los cinco segundos queda justa. Gravedad **baja-media**. | `hero-d-sheet.png`, `hero-m-sheet.png`. | Mostrar nombre y rol desde el primer fotograma (quietos) y que solo teclee el lema; así la primera pantalla ya responde a «quién». | Maqueta | Dueño/diseño |
| M7 | **Títulos de puntos en pantallas pequeñas: poco legibles incluso en reposo.** El `h1` de «Política de cookies» a 375 nunca llega a ser texto cómodo: tras 5 s sigue siendo una fila de puntos de 7 px (las letras se leen con esfuerzo); «Proyectos», «Categorías» y «Blog» tardan ~2,5 s en resolverse. En la página legal, la que más importa entenderla a la primera. Gravedad **media**. | `dec-sheet.png` (0,5–5 s), `cook-m-top.png`, `proy-m-top.png`, `cat-m-top.png`. | Para títulos largos y páginas legales, escribirlos con la tipografía normal (el efecto de puntos queda para Bio, Proyectos, Blog); o un tamaño de celda mayor en ≤ 480 px; el resto (animación a la entrada) se queda. | Maqueta | Diseño |
| M8 | **Compuerta del vídeo: larga, y no dice cómo se deshace.** Son unas 55 palabras en un recuadro que a 375 ocupa ~330 px antes de los botones; no menciona dónde se retira el «sí» (el pie). Los botones (150×44 y 138×44) están bien. Gravedad **baja**. | `r5-m-1-gate.png`; textos en `consent.js` (`CT.gate`, `CT.gateOr`). | Primera frase y un «Más información» que abra la política; añadir «Lo cambias cuando quieras, abajo del todo» o enlace al diálogo. | Maqueta (texto: pasar por el editor de tono) | Dueño |
| M9 | **Pie en móvil: casi una pantalla entera** (≈ 790 px de grupos + 112 px de relleno) y las **Preferencias van al final**. Funciona y no parte ningún grupo; pero el único ajuste que solo está allí es «Cookies» (idioma y color ya están en la cabecera y el botón flotante). El plan §5 dejaba medir si subirlas. Con 41 tabulaciones hasta el primer enlace del pie en un artículo, la ruta de teclado es larga (hay `End`). Gravedad **baja**. | `r3`/`end-m.png`, `ps-m-sheet.png`; `kb.mjs`. | Opciones: dos columnas (Secciones+Sígueme / Sobre esta web) bajo 480 px y Preferencias a ancho completo; o dejarlo así. Añadir un salto «Ir al pie» no hace falta. | Maqueta | Diseño |
| M10 | **Orden de tabulación.** Antes del contenido hay siete paradas (salto, logo, EN, cuatro de la navegación); el **botón redondo de color queda el último** (parada nº 56 en un artículo), después del pie, y no donde se ve. Ya anotado en el informe de modos (M12). Gravedad **baja**. | `kb.mjs` (artículo: 55 paradas hasta el enlace de LUZ; blog: 40; home: siete + «Abrir LUZ» es la 10ª). | Colocar el botón en el DOM junto a la cabecera o poner `order` tras el pie conservando el visual; no cambiar si D-12 se resuelve en el pie. | Maqueta | Diseño |
| M11 | **Píldora: «actual» a veces incorrecto.** En la 404 de un artículo (`?a=` mal escrito) la píldora marca «Blog» (`r6-m-1.png`); en la home, al llegar al pie, sigue iluminando «Escríbeme» (`hs-m-sheet.png`, últimos fotogramas) cuando ya no se está en esa sección. Gravedad **baja**. | `r6-m-1.png`, `hs-m-sheet.png`. | En la 404 ningún elemento `aria-current`; en la home, quitar el actual cuando el pie ocupa la ventana. | Maqueta (el `aria-current` se rehace en Astro con rutas) | Diseño |
| M12 | **Botón de color: nombre y destino.** El nombre accesible dice el modo **actual** («Modo de color: Oscuro»), el `title` va vacío y el icono es el de ahora; un toque lleva al **siguiente** (claro → contraste alto → oscuro): desde oscuro, 1 toque = claro, 3 = oscuro de nuevo. En el pie, «Color · Oscuro · Cambiar» tampoco dice a cuál pasa. Gravedad **baja**. | `flows.mjs` (ciclo medido: light, high-contrast, dark, light). | Nombre «Cambiar el modo de color (ahora: oscuro)» y `title`; en el pie, «Oscuro → Claro» o un icono del destino. | Maqueta | Diseño |
| M13 | **Cifra de proyectos.** La home dice «13 proyectos · 2023–2026» y muestra cinco; el enlace «Todos los proyectos →» lo aclara, pero el número promete más de lo que hay en la pantalla. Gravedad **baja**. | `hs-d-sheet.png`; `main.js` (`work-count`, `FEATURED` de cinco). | «Cinco de 13» o «Una selección de 13», o contar solo los visibles. | Maqueta | Diseño |

### 3.3 Dejar como está

| ID | Qué y por qué se queda | Evidencia | ¿Maqueta o Astro? |
|---|---|---|---|
| D1 | **Pie de cuatro grupos**: rótulos pequeños, nombres iguales a la píldora/home (01 Bio … 04 Escríbeme), «Sígueme» con ↗ y aviso de pestaña nueva en el nombre accesible, «Sobre esta web» con tres páginas, «Preferencias» con el **estado delante del botón** («YouTube: sin elegir · Cambiar»). En móvil, una columna sin cortar grupos; el relleno inferior (112 px) evita que lo tape la píldora. Se encuentra «Idioma / Color / Cookies» de un vistazo. Cumple §5. | `home-m-sheet.png`, `end-m.png`, `home-d-sheet.png` | Maqueta; en Astro, `Footer.astro` con HTML estático |
| D2 | **Sin tarjeta de cookies.** La elección aparece donde se necesita (compuerta), no al llegar; se cambia desde el pie en **3 toques** (Cambiar → casilla → Guardar), el foco entra en la casilla, `Guardar` devuelve el foco a «Cambiar» y una región de estado anuncia «Ajustes de cookies guardados». | `r5-m-3-dialog.png`; `flows.mjs` (foco en `INPUT youtube`; tras guardar, `BUTTON Cambiar`) | Maqueta |
| D3 | **Retirar el «sí» desde el pie sustituye el vídeo abierto por su compuerta** (medido: 0 `iframe`, compuerta presente). No quedan restos de lo que se retiró. | `r5-m-4-after.png` | Maqueta |
| D4 | **Compuerta**: dice quién recibe la IP y cuánto vale el «sí», con un botón principal y una salida clara («Ver en YouTube ↗»); botones de 44 px; el vídeo se reproduce al aceptar sin un segundo toque (`autoplay`). | `r5-m-1-gate.png`, `r5-m-2-accepted.png` | Maqueta |
| D5 | **Cambiar de idioma** es **1 toque** en cualquier página, conserva la ruta (`?lang=en` en todos los enlaces) y el artículo solo en español lo dice en la cabecera («This post is only available in Spanish»). | `r4-m-en-post.png`, `r4-m-en-home.png` | Maqueta; en Astro, `/en/` y `hreflang` |
| D6 | **Orientación en el artículo**: migas «Blog / Categoría» con enlace, título grande con guionado, extracto, fecha y minutos, índice **plegado** en móvil y fijo a la izquierda en escritorio (con el apartado actual marcado), línea de progreso punteada arriba, compartir arriba, firma, etiquetas, anterior/siguiente y «Sigue leyendo». | `post-m-top.png`, `ps-d-sheet.png`, `ps-m-sheet.png` | Maqueta |
| D7 | **Medida y tipografía de lectura**: columna de ~60–70 caracteres en 1280, texto a ~17 px en 375, encabezados en Doto, citas, código con su barra «Copiar», pies de foto con crédito. La lectura larga (≈ 14,5 pantallas en móvil, 11,6 en escritorio) no cansa. | `ps-d-sheet.png`, `ps-m-sheet.png` | Maqueta |
| D8 | **Movimiento que informa y se calla**: hero y 404 se paran (sin diferencia de píxel entre 8 y 16 s, medido), los bucles de imagen descansan tras un ciclo (sin cambio de 3 a 12 s) y el puntero los repite; el cambio de modo revela con un círculo, sin parpadeo. | `hero-d-sheet.png`, `loop-*` | Maqueta |
| D9 | **404 que sabe adónde quería ir la persona**: muestra la ruta que falló, propone el artículo parecido («¿Buscabas esto?»), un buscador con resultados en vivo («1 resultado», anunciado) y accesos «O empieza por aquí». | `r6-d-1.png`, `r6-m-2-search.png` | Maqueta; la ruta real la decide Astro |
| D10 | **Proyectos**: la lista con filtros por tecnología (chips con recuento), la leyenda «Cómo leer los bloques» y la ficha con «Ver demo / Ver código» y migas «Proyectos / 2024» dan un camino de ida y vuelta claro; el panel se cierra con Esc y devuelve el foco al botón de origen (medido). | `proy-d-top.png`, `proyp-m-top.png`, `r3.mjs` | Maqueta |
| D11 | **La píldora móvil y el raíl de escritorio** comparten nombres y números y marcan el lugar; no hay desbordamiento horizontal en ninguna página a 375 (`scrollWidth` = 375 en las 12). | `shots.mjs` (todas `sw: 375`) | Maqueta |
| D12 | **Home: la carga cognitiva está repartida**: cuatro secciones numeradas, 5 proyectos (no 13), tres artículos, una leyenda corta; la longitud (≈ 10,7 pantallas en escritorio, 11,6 en móvil) es la de una portada de diseño y no repite contenido. La decoración (rain, columnas de puntos) no tapa texto. | `hs-d-sheet.png`, `hs-m-sheet.png` | Maqueta |
| D13 | **Política y créditos en lenguaje llano**, con tabla de «Cookies de esta web: ninguna / Publicidad: ninguna / Contar visitas: no / Vídeos de YouTube: solo si tú dices que sí». Es el mejor «¿entiendo qué pasa?» del sitio. | `cook-m-top.png` | Maqueta |
| D14 | **Estados**: foco visible punteado, `hover` con subrayado punteado coherente, «Enlace copiado» con región de estado, `Cancelar` secundario en el diálogo, guardados anunciados. | `r3-m-3-closed.png`, `r5-m-3-dialog.png` | Maqueta |
| D15 | **Volver tras un mes**: la elección de YouTube y el modo de color quedan (180 días), nada más se recuerda y no hay cookies propias; «Lo último» da lo nuevo en el tercer bloque de la home o a un toque de la píldora «Blog». | `consent.js`, `theme.js`, `flows.mjs` | Maqueta |
| D16 | **Atajos en el teclado**: salto al contenido como primera parada, `End` y la línea de progreso, diálogo modal con `Esc` y foco dentro. | `kb.mjs` | Maqueta |

---

## 3 bis. Recorridos medidos

«Gestos» = toques/clics/teclas que el flujo necesita (el desplazamiento largo cuenta 1 salvo que se indique). Móvil = 375×800 emulado táctil; Esc. = 1280×800.

| # | Recorrido | Móvil (gestos) | Esc. (gestos) | Dudas / callejones | Capturas |
|---|---|---|---|---|---|
| 1 | Llegar a un artículo desde un buscador y entender dónde estás | 0 (primera pantalla: migas, título, extracto, fecha, lectura). Para saber **quién** escribe: 1 toque en el logo, o ≈ 11 pantallas hasta la firma | 0; 1 clic en el logo | No hay firma ni lema arriba (M5) | `post-m-top`, `post-d-top`, `ps-m-sheet` |
| 2 | Leer hasta el final y pasar al siguiente | 1 gesto largo (≈ 14,5 pantallas) + 1 toque en «Más antiguo» o «Sigue leyendo» (C1: el siguiente se llama igual que el otro) | 1 + 1 (≈ 11,6 pantallas) | Los dos artículos con el mismo título; sin volver arriba salvo la píldora | `ps-m-sheet`, `ps-d-sheet` |
| 3a | Proyecto por el panel de la home | 4: píldora «Proyectos» → desplazar → «Abrir» → Esc/Cerrar | 4 | **Atrás no cierra el panel** (C2) | `r3-m-1…3`, `r3-d-2-panel` |
| 3b | Proyecto por la página | 3: «Todos los proyectos →» → proyecto → Atrás o miga «Proyectos» | 3 | — | `proy-m-top`, `proyp-m-top` |
| 4a | Cambiar de idioma | **1** (cabecera) | 1 | En un artículo español se queda en español con aviso (D5) | `r4-m-en-post`, `r4-m-en-home` |
| 4b | Cambiar el modo de color | 1–3 toques con el botón redondo (claro → contraste alto → oscuro); el pie lo repite con «Cambiar» | 1–3 | El botón no dice a qué pasa (M12) | `flows.mjs` |
| 4c | Cambiar la elección de YouTube | 1 salto al pie (`End`) + 3: Cambiar → casilla → Guardar | 1 + 3 | — | `r5-m-3-dialog` |
| 5 | Ver un vídeo y retirar la elección | Ver: 1 toque en «Aceptar y ver aquí». Retirar: 1 salto + 3 toques; el vídeo vuelve a ser compuerta | 1 / 1 + 3 | La compuerta no dice dónde se retira (M8) | `r5-m-1…4` |
| 6 | Caer en la 404 y recuperarse | 2 (desplazar + tocar la sugerencia «¿Buscabas esto?»); o 1 toque en la píldora | 1 (la sugerencia se ve al pie de la primera pantalla) | La foto esconde la solución en móvil (M4); Intro en el buscador no hace nada | `r6-m-1`, `r6-d-1`, `r6-m-2-search` |
| 7 | Contactar con el dueño | 1 toque en «Escríbeme» (desde cualquier página; en las interiores carga la home en `#contacto`) → cinco redes | 1 | **No hay correo** (C3) | `hs-d-sheet` (última), `r4-m-en-home` |
| 8 | Solo teclado | Salto al contenido = 1 Tab. Hasta el primer enlace del pie: **41** en un artículo, 26 en el blog; antes del contenido hay 7 paradas; el botón de color es el último | igual | Orden de tabulación del botón (M10) | `kb.mjs` |
| 9 | Volver un mes después | 0 para el modo y la elección (180 días); «Lo último» a 1 toque («Blog») o ≈ 8 pantallas | 0 / 1 | El idioma no se guarda (diseño: `?lang`); quien entre por la URL sin `?lang` verá español | `consent.js`, `theme.js` |

---

## 4. Preguntas para el dueño

1. **C1.** ¿Qué es el segundo «¿Hay alguien dentro?»: una versión nueva, un duplicado o una serie? Según la respuesta, un título distinto, una nota «actualiza a» o quitar uno.
2. **C3.** ¿Va correo de contacto (Q8) o se renombra «Escríbeme» a algo que prometa solo redes?
3. **M5.** ¿Quieres una firma bajo el título de cada artículo («Por Nando Muñoz · tech lead de frontend»)? Es texto tuyo.
4. **M1.** ¿Aceptas que el botón de color se oculte al desplazarse hacia abajo en móvil (sigue en el pie)? Cambia el matiz de D-12, no la decisión.
5. **M6.** ¿Prefieres que el nombre y el rol estén desde el primer segundo, o te gusta que lleguen tras el lema?
6. **M7.** ¿Los títulos de las páginas legales pueden ir en tipografía normal (los de sección siguen en puntos)?
7. **Prueba de cinco segundos** (plan §5, sin hacer): 3–5 personas, tres preguntas («¿dónde cambias el idioma?», «¿dónde está la privacidad?», «¿cómo quitas el permiso de YouTube?»). Yo mido que cada una es 1, 1 y 3 gestos; falta ver si se **encuentran**.

---

## 5. Lista para pegar en la Fase 10 del plan de Astro

- [ ] Los dos artículos con el mismo título tienen títulos distintos (o uno redirige al otro) y `<title>`/URL únicos (C1).
- [ ] Cada proyecto tiene URL propia; si el panel se mantiene, Atrás lo cierra y la URL se puede compartir (C2).
- [ ] Contacto: el correo o formulario que se decida está en la sección, el pie y la política; los textos no prometen más que lo que hay (C3).
- [ ] 404: a 375 px la sugerencia y el buscador se ven sin desplazarse más de media pantalla (M4); Intro en el buscador lleva al primer resultado.
- [ ] A 375 px y a 667×375 el botón de color y la píldora no tapan texto en reposo (M1); destinos de la píldora, el idioma y el pie ≥ 44 px o con espaciado (M2, M3).
- [ ] El idioma actual no se parece a una acción; el otro idioma es un enlace reconocible (M2); `hreflang` en ambos.
- [ ] Firma/autoría visible en la primera pantalla de cada artículo (M5).
- [ ] Títulos legales legibles a 375 px sin esperar al efecto (M7).
- [ ] La compuerta del vídeo dice dónde se retira el «sí» (M8); retirar el «sí» desde el pie vuelve a poner la compuerta (D3).
- [ ] En el pie de Astro, los grupos son HTML estático y el orden de lectura = orden de tabulación = visual (M10, D1).
- [ ] `aria-current` solo en la página exacta; nada marcado en la 404 (M11).
- [ ] Prueba de cinco segundos hecha con 3–5 personas y anotada.
- [ ] Capturas de referencia: 375/768/1280 de home, artículo, 404, proyecto, blog y pie, para comparar con la maqueta.
