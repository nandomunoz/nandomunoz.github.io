# Informe de accesibilidad · modos de color de la maqueta Trama

> Revisión acotada de los tres modos de color (oscuro, claro, contraste alto) y de su botón selector en `maqueta/` (rama `proto/home`), frente a **WCAG 2.2 AA** y **EN 301 549 v3.2.1**, con el método del `accessibility-engineer` de LUZ.
> Fecha: 2026-11-15. Árbol auditado: `5bf42c3`, limpio. Incluye el commit pedido, `042bb94` (modos y botón), y los dos siguientes, que tocan lo mismo: `ec87070` (el cambio de modo es un círculo que crece desde el botón, una View Transition) y `5bf42c3` (el `<luz-timeline>`, que se mide en los tres modos). No se ha editado ningún fichero del código: solo este informe.
> Complementa `.ai/plan/informe-accesibilidad-maqueta.md` y `.ai/plan/informe-accesibilidad-cookies.md`; no repite sus hallazgos salvo para decir si esta implementación los empeora o los arregla (§5).
> Este informe **no declara conformidad**. Las herramientas automáticas encuentran en torno a un tercio de los problemas; lo que no se ha probado con lectores de pantalla ni en Windows real está en §8.

---

## 1. Resumen

**Veredicto: no cumple del todo, con reservas, en los tres modos.** La implementación está bien pensada y casi todo el trabajo difícil está hecho: tres paletas en tokens, `color-scheme` correcto por modo (controles nativos y barras de desplazamiento), un contraste alto que de verdad llega a 8,4:1 o más en todo texto, un modo claro con texto entre 4,7:1 y 14:1, un botón de 44 px que nunca tapa el foco, el aviso de cookies ni la píldora, y una elección que solo se guarda al pulsar. Lo que falla son sobre todo **traducciones que se quedaron pensadas para fondo oscuro** (la tinta y el granate dan resultados opuestos según el modo), más un fallo de posición del botón en pantallas bajas y una fuga de la lógica «Auto» de LUZ.

| Modo | ¿Cumple AA? | Por qué |
|---|---|---|
| Oscuro (por defecto) | **No** | `--faint` #6f6c68 a 2,79:1 (hallazgo 2 del informe general, ya en el plan) y el número granate del menú a 2,01:1. Nada nuevo: el commit no lo cambia. |
| Claro | **No, con reservas** | 5 fallos confirmados, todos de token o de regla suelta: contador del chip actual (2,17:1), título y botón ▶ del vídeo (3,6–4,3:1 y 2,17:1), píldora sobre imágenes oscuras (4,10:1), foco del buscador de la 404 más débil que su reposo. El texto corriente pasa con margen. |
| Contraste alto | **No, con reservas** | Contador del chip actual (2,50:1), ▶ del vídeo (2,50:1), el estado «actual» del menú casi no se distingue (tinta frente a apagado: 1,14:1) y el control nativo de borrar del buscador es invisible (1,06:1). Todo el resto del texto está a 8,4:1 o más (AAA). |

**Recuento (solo lo nuevo de esta implementación, más lo que ella amplía):** 0 bloqueantes · 4 serios · 7 moderados · 8 menores · 2 de WCAG 2.2 (revisados, sin fallo) · 3 solo AAA.

**Las cinco más importantes, en orden**

1. **Una regla pensada para tinta clara rompe el claro y el contraste alto** (serio, 1.4.3 AA · EN 9.1.4.3 y 1.4.11). `.chips a[aria-current] sup` pone el granate sobre el fondo de tinta: en oscuro es granate sobre blanco roto (6,47:1), pero en claro la tinta es casi negra (2,17:1) y en contraste alto es blanca con granate claro (2,50:1). Lo mismo pasa con «texto sobre granate»: el ▶ del vídeo y `::selection`. Un token (`--on-blaze`) y una línea lo arreglan.
2. **La puerta del vídeo en claro** (serio). El título (tinta oscura) va sobre una miniatura oscurecida con `brightness(.55)` y puntos del color del papel: 3,6–4,3:1 con cualquier miniatura. Medido con cuatro miniaturas sintéticas y una foto real.
3. **El botón sube por una tarjeta que no está fija** (serio, 1.4.10 AA · EN 9.1.4.10). Con la altura de ventana de 480 px o menos (zoom al 400 % en un portátil, móvil en horizontal) la tarjeta de cookies es parte del flujo, pero el botón se levanta igualmente su altura: a 320×256 queda con 11 px fuera por arriba, **encima del texto de la tarjeta**, y se queda allí aunque la tarjeta salga del scroll.
4. **Los bucles de las imágenes no se pueden parar** (serio, 2.2.2 A · EN 9.2.2.2). Cada portada y cada miniatura de fila repite un ciclo de 7,6 a 12,2 s mientras está a la vista (5 a la vez en `/blog/`), sin botón de pausa. No es del modo, pero el bucle es posterior al informe anterior (20:46 frente a 19:14) y nadie lo había medido. Con movimiento reducido sí se queda quieto.
5. **«Auto» se escapa** (moderado, 4.1.2 A · EN 9.4.1.2). El modo se oculta pero la lógica de LUZ sigue ahí: si el sistema cambia de esquema o de contraste mientras no se ha pulsado nada, la página cambia sola de modo **y el botón sigue diciendo el anterior** («Modo de color: Oscuro» sobre una página clara). Además, la primera pulsación puede no cambiar nada o sacar de contraste alto.

**Lo que el modo no empeora y de hecho arregla:** el gris `--faint` pasa de 2,79:1 a 5,33:1 en claro y a 12,68:1 en contraste alto (hallazgo 2); el granate como texto no necesita el `filter: brightness()` en claro ni en contraste alto, así que axe lo mide bien (hallazgo 25); el relleno de la casilla de cookies pasa de 2,17:1 a 5,76:1 y 7,78:1 (hallazgo C6 del informe de cookies).

---

## 2. Método

**Herramientas y versiones**

| Herramienta | Versión | Uso |
|---|---|---|
| Chrome for Testing (headless, `~/.cache/ms-playwright/chromium-1243`) | 153.0.8010.12 | Render, teclado, `prefers-reduced-motion`, `forced-colors: active`, `prefers-color-scheme`, CDP (`Emulation.setEmulatedMedia`, `Accessibility.getFullAXTree`, screencast) |
| playwright-core | 1.49.1 (la de `cole/`) | Control del navegador. Esta versión **no** emula `prefers-contrast`: se hizo con CDP |
| axe-core (copia fijada, 4.10.3) | 4.10.3 | Etiquetas `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`; con movimiento reducido |
| Recorrido propio de estilos computados | — | Para cada nodo con texto: color real con opacidad y `filter: brightness()`, fondo compuesto capa a capa (también `color-mix` con transparencia), tamaño y peso → «grande» o no, y si hay un `canvas`, `img` o `video` debajo |
| Medida de píxeles | sharp | Cada texto se captura con su color y con `color: transparent` y se comparan los píxeles; así se mide el texto sobre canvas, sobre imágenes y sobre la píldora translúcida. Se da el contraste del «núcleo» del trazo (percentil 10 de los píxeles que cambian) |
| `luz-check` | 0.3.2 | Solo sobre un borrador de tema LUZ con los tres modos (`scratchpad/.../theme/trama-modes.css`). La maqueta no usa clases LUZ. **No comprueba nombres, etiquetas, encabezados ni idioma:** una pasada limpia no sería un resultado de accesibilidad |

**Páginas**: home, proyectos, proyecto `?p=luz`, blog, blog `?p=2`, artículos `tu-empresa-necesita-un-sistema-de-diseno-y-no-lo-sabes` y `analisis-del-popurri-de-la-oveja-negra`, más `introduccion-a-la-ia` (con `<luz-timeline>`), `aprendiendo-web-components` (código), `tu-navegador-sabe-sobre-ti-mas-de-lo-que-crees` (tablas) y `margaret-hamilton` en inglés, categorías, etiquetas, `?tech=LUZ`, 404, `/cookies/` y `/creditos/`. Se forzó cada modo con `localStorage luz-theme` antes de cargar.
**Barrido**: 11 páginas × 3 modos × 2 anchos (1280 y 375) = 66 estados, recorriendo el scroll entero, con axe en cada uno; 30 estados más con el aviso de cookies, el diálogo de ajustes, el diálogo «Compartir artículo», el panel de proyecto de la home y el artículo con línea de tiempo (también ×3 modos ×2 anchos); 24 pasadas más con las páginas de la lista anterior.
**Botón**: DOM, árbol de accesibilidad, Enter, Espacio y ratón, con y sin movimiento reducido (la View Transition solo corre sin reducir), pulsaciones rápidas, orden de Tab con y sin aviso, geometría y solapes a 320×568, 390×844, 768×1024 y 1440×900, con y sin aviso, en cuatro puntos del scroll de home, blog y artículo; foco tapado (muestreo de 60 puntos del rectángulo enfocado con `elementFromPoint` en cada parada de Tab, 24 recorridos); 1280×1024 al 200 % y al 400 % (640×512 y 320×256), 480×256, 667×375, 844×390, 320×480 y 320×481.
**Preferencias**: `prefers-contrast: more` (arranque y en vivo), `prefers-color-scheme` (arranque y en vivo), elección guardada frente al sistema, `forced-colors: active` con esquema oscuro y claro, JS desactivado, carga con la hoja de estilos retrasada 1,5 s, persistencia entre páginas e idiomas.

Scripts, capturas y salidas en bruto: `/tmp/claude-1000/-home-ares-Documents-repos-me/9fa086da-7879-460d-ae81-f56082f4ffe8/scratchpad/a11y-modos/` (`out/`, `shots/`).

**Lo que no se ha comprobado**: lectores de pantalla reales; Windows alto contraste real (solo la emulación de Chromium); Safari y Firefox (View Transition, `color-scheme`, el control nativo de borrar del buscador son distintos allí); miniaturas reales de YouTube (sin red; se usaron cuatro sintéticas y una foto del propio repo); dispositivos reales; zoom del navegador al 400 % de verdad (se equivale por anchura y altura de ventana).

---

## 3. Contrastes medidos

### 3.1 Tokens por modo (los valores reales, no los de DESIGN.md)

Texto: 4,5:1 (3:1 si es grande). No texto: 3:1. Sobre `--bg` y sobre `--bg-2` (cursiva si falla).

| Par | Oscuro | Claro | Contraste alto |
|---|---|---|---|
| `--ink` / `--bg` · `--bg-2` | 13,01 · 14,06 | 14,06 · 12,50 | 21,00 · 19,44 |
| `--mute` / `--bg` · `--bg-2` | 7,19 · 7,77 | 6,96 · 6,19 | 18,43 · 17,05 |
| `--prose` / `--bg` · `--bg-2` | 10,53 · 11,38 | 10,59 · 9,42 | 21,00 · 19,44 |
| `--faint` / `--bg` · `--bg-2` | *2,79 · 3,01* | 5,33 · 4,74 | 12,68 · 11,74 |
| `--blaze` como texto / `--bg` · `--bg-2` | *2,01 · 2,17* (4,85 · 5,24 con `brightness(1.7)`) | 6,47 · 5,76 | 8,40 · 7,78 |
| `--blaze` sobre `--ink` (contador del chip actual, `blog.css:28`) | 6,47 | *2,17* | *2,50* |
| `--ink` sobre `--blaze` (`::selection`, ▶ del vídeo) | 6,47 | *2,17* | *2,50* |
| `--bg` sobre `--ink` (chip actual) | 13,01 | 14,06 | 21,00 |
| Foco `3px dotted var(--ink)` / `--bg` · `--bg-2` | 13,01 · 14,06 | 14,06 · 12,50 | 21,00 · 19,44 |
| Icono del botón / su fondo (`--bg-2` al 82 % sobre `--bg`) | 13,87 | 12,77 | 19,72 |
| Casilla de cookies sin marcar (píxel real, borde nativo) / fondo del diálogo | 4,26 | 3,61 | 5,27 |
| Líneas `--edge` · `--edge-2` · `--rule` / `--bg` | *1,26 · 1,43 · 1,73* | *1,21 · 1,37 · 1,85* | 6,27 · 8,60 · 9,96 |
| Líneas y puntos `--faint` / `--bg` · `--bg-2` | *2,79* · 3,01 | 5,33 · 4,74 | 12,68 · 11,74 |
| Puntos del canvas `--dot-ink` · `--dot-mid` · `--dot-blaze` / `--bg` (decorativos) | 13,01 · 5,21 · *2,01* | 14,06 · 5,83 · 5,77 | 21,00 · 13,82 · 7,35 |

Notas:
- **`--edge`, `--edge-2` y `--rule` en oscuro y claro no llegan a 3:1.** Solo importan donde son lo único que dibuja un componente. En esta maqueta no lo son: los chips tienen texto, las filas y los separadores son decoración y el campo de la 404 usa la hilera de puntos `--faint`. No es un fallo, pero **el claro no mejora la regla**: su `--rule` (30 %) da 1,85:1, menos de lo que dice DESIGN.md §2 («líneas visibles» solo es cierto en contraste alto).
- El **claro cumple el 4,5:1 de texto en todo par real**, incluido `--faint` sobre `--bg-2` (4,74:1). El **contraste alto cumple el 7:1 de AAA (1.4.6)** en todo texto salvo los dos fallos de §4 (M1, M9): el valor más bajo que pasa es 8,4:1.
- Con la fuente Doto a 12–13 px el píxel renderizado queda por debajo del valor nominal: `.nav__n` en claro mide 4,52:1 frente a 5,33:1 nominal. Son números decorativos, pero el margen es escaso.

### 3.2 Pares reales renderizados que fallan (barrido de 66 + 30 + 24 estados)

Medidos con el recorrido de estilos computados; axe lo confirma salvo donde se indica.

| Modo | Par | Valor | Dónde | ¿Nuevo? |
|---|---|---|---|---|
| Oscuro | `--faint` #6f6c68 / #292929 | 2,79:1 | fechas, minutos, `©`, «Nº», crédito de portada, contadores, año de grupo (grande: 2,79 frente a 3), «Escrito por», 404 | No (hallazgo 2) |
| Oscuro | `--blaze` #963641 / #292929, número del menú actual (`.nav__n`) | 2,01:1 | `style.css:123` | No (hallazgos 3 y 25) |
| Oscuro | `.pager__dir.is-off` #4c4b49 / #292929 | 1,66:1 | «← Más recientes» sin página anterior | No; control inactivo (exento de 1.4.3) |
| Oscuro | `--blaze` al pasar el ratón por un enlace de la bio (`style.css:241`) | 2,01:1 | estado hover del texto | No |
| **Claro** | `--blaze` #963641 / `--ink` #232323, `.chips a[aria-current] sup` | **2,17:1** | contador del chip activo en proyectos, categorías, etiquetas | **Sí** |
| **Claro** | `.video__title`, tinta #232323 sobre miniatura | **3,64–4,26:1** núcleo (11,5 px) | vídeo con consentimiento | **Sí** |
| **Claro** | `--ink` sobre `--blaze`, glifo ▶ del vídeo (no texto, 3:1) | **2,17:1** | `.video__btn` | **Sí** |
| **Claro** | enlaces apagados de la píldora sobre imágenes oscuras | **4,10:1** (peor punto de un artículo) | `.docked .nav` | **Sí** |
| Claro | `.pager__dir.is-off` #aeaba6 / #f4f2ee | 2,06:1 | control inactivo | Equivalente |
| **Contraste alto** | `--blaze` #ff7a8a / `--ink` #fff, contador del chip activo | **2,50:1** | igual | **Sí** |
| **Contraste alto** | `--ink` #fff sobre `--blaze` #ff7a8a, ▶ del vídeo | **2,50:1** | igual | **Sí** |
| Contraste alto | `.pager__dir.is-off` #656565 / #000 | 3,58:1 | control inactivo | Equivalente |

**Pasan, medidos con píxeles reales** (texto sobre canvas o imagen, núcleo del trazo): `h1` del hero 13,0 · 14,1 · 21,0:1; nombre y número de cada proyecto sobre su bloque de puntos 13,0 · 14,1 · 21,0:1; kicker `.item__kicker` 7,19 · 6,96 · 18,43:1; leyenda «Cómo leer los bloques» 6,96 · 6,74 · 17,94:1; `--faint` de la pista del hero en claro 4,89:1 (375 px: 4,53:1) y en contraste alto 11,67:1; crédito bajo la portada (`figcaption.post__credit`) 2,79:1 en oscuro (hallazgo 2), 5,33:1 en claro y 13,6:1 en contraste alto; kicker granate `.sec-head__n` y `.feat__kicker` 4,86 · 6,47 · 8,40:1. Los puntos del hero y de la 404 que pasan por detrás del texto no bajan el contraste del trazo.
**Píldora y botón sobre contenido** (peor punto del scroll, 3 páginas, 375 px): enlaces apagados de la píldora 4,74 · **4,10** · 11,09:1; icono del botón 8,4 · 8,3 · 13,4:1 como mínimo.
**Aviso de cookies, diálogo de ajustes, «Compartir artículo», panel de proyecto y línea de tiempo**: sin ningún par nuevo; en claro y contraste alto solo aparece el inactivo `.is-off`.

### 3.3 axe-core 4.10.3

| Modo | `color-contrast` (serious) | Otros |
|---|---|---|
| Oscuro | 291 nodos en 22 estados de página (todo `--faint` y el granate del menú) | `landmark-complementary-is-top-level`, `heading-order` (moderados, ya conocidos) |
| Claro | 4 nodos: `a[aria-current] > sup` ×2 y `.is-off` ×2 | los mismos |
| Contraste alto | 4 nodos: `a[aria-current] > sup` ×2 y `.is-off` ×2 | los mismos |

El botón del modo no genera ninguna violación (nombre accesible correcto, `button-name` sin avisos). axe marca como «revisar» 175 / 135 / 135 nodos (oscuro / claro / contraste alto) por estar sobre canvas o imágenes: los relevantes se han medido por píxeles (§3.2).

### 3.4 `luz-check` sobre el tema en tres modos (futuro tema Trama)

Borrador con los tres modos como `--luz-*` (`scratchpad/a11y-modos/theme/trama-modes.css`). Resultado: bloquea, y dice lo mismo que esta medida. Lo importante para Astro:
- **Claro**: `--luz-text-on-fill` #232323 sobre `--luz-brand-fill` #963641 = **2,1:1** (y 1,9:1 hover, 1,4:1 activo, 2,7:1 sobre `color-danger-fill`). Es el mismo defecto que el ▶ y `::selection`: en claro `text-on-fill` tiene que ser **#fff** (7,24:1).
- **Oscuro**: `--luz-text-muted` #6f6c68 a 2,7:1 y `--luz-brand-primary` #963641 a 2,0:1 (como texto), `--luz-input-border` a 2,7:1: el hallazgo 2 y el 25.
- **Contraste alto**: 90 bloqueos, casi todos porque **el contraste alto de LUZ es blanco** y el de Trama es negro: los tokens que el borrador no redefine (`surface-hover`, `surface-strong`, `surface-pressed`, `input-bg`, `brand-hover`, `color-code`, los fondos de estado…) caen en los blancos de LUZ. El tema de Trama tiene que definir **todos** los tokens semánticos en los tres modos (ya está anotado en la Fase 10).
`luz-check` no se ha pasado a la maqueta (no usa clases LUZ) y no dice nada de nombres, etiquetas, encabezados ni idioma.

---

## 4. Hallazgos

### 4.1 Tabla (por gravedad × a cuánta gente × esfuerzo)

| # | Gravedad | Hallazgo | Criterio · nivel · EN 301 549 | Etiqueta | Fase | ¿Lo arregla el HTML estático? |
|---|---|---|---|---|---|---|
| M1 | Serio | Contador del chip actual y «texto sobre granate» pensados para tinta clara: claro 2,17:1, contraste alto 2,50:1 (también `::selection`, ▶) | 1.4.3 AA · EN 9.1.4.3; 1.4.11 AA · EN 9.1.4.11 | confirmado | 2, 7, 8 | No |
| M2 | Serio | Puerta del vídeo en claro: título 3,6–4,3:1 sobre cualquier miniatura; ▶ 2,17:1 | 1.4.3 AA · EN 9.1.4.3; 1.4.11 AA · EN 9.1.4.11 | confirmado (miniaturas sintéticas y foto real; no las de YouTube) | 8 | No |
| M3 | Serio | Botón levantado por una tarjeta que no está fija (altura ≤ 480 px): 11 px fuera por arriba y sobre el texto de la tarjeta | 1.4.10 AA · EN 9.1.4.10; 1.4.4 AA · EN 9.1.4.4 | confirmado | 4 | No |
| M4 | Serio | Bucle de las imágenes sin pausa, en los tres modos | 2.2.2 A · EN 9.2.2.2 | confirmado | 5, 8 | No |
| M5 | Moderado | «Auto» se escapa de LUZ: nombre del botón desfasado, cambio solo al cambiar el sistema, primera pulsación sin efecto o fuera de contraste alto | 4.1.2 A · EN 9.4.1.2; 3.2.1 A (riesgo) | confirmado | 4 | No |
| M6 | Moderado | Píldora translúcida en claro: enlaces apagados a 4,10:1 sobre una imagen oscura | 1.4.3 AA · EN 9.1.4.3 | confirmado | 2, 4 | No |
| M7 | Moderado | El foco del botón se pierde sobre fotos (móvil): contraste mediano 1,2–2,3:1 | 2.4.7 AA · EN 9.2.4.7; 1.4.11 AA | confirmado | 4 | No |
| M8 | Moderado | Foco del buscador de la 404 más débil que el reposo en claro (3,38 frente a 5,33:1); sin `outline` | 2.4.7 AA · EN 9.2.4.7 | confirmado | 9 | No |
| M9 | Moderado | Contraste alto: tinta y apagado casi iguales (1,14:1), el estado «actual» y el hover del menú desaparecen; enlaces de la prosa solo con subrayado punteado de 1 px | 1.4.1 A · EN 9.1.4.1 (amplía el hallazgo 3) | confirmado | 2, 4, 8 | No |
| M10 | Moderado | `forced-colors`: los puntos siguen el modo, no la paleta del sistema; con el esquema contrario desaparecen los títulos hechos de puntos | 1.4.11 (riesgo); amplía el hallazgo 19 | confirmado (emulación) · necesita Windows real | 5 | No |
| M11 | Moderado | Sin JS el modo no se aplica (y `prefers-contrast: more` se ignora) | 1.4.8 AAA / método LUZ (no JS); 1.4.3 (riesgo) | confirmado | 1, 2 | **Parcial**: el HTML estático muestra el contenido, pero el modo sigue necesitando un respaldo en CSS |
| M12 | Menor | El botón es la última parada de Tab (38–56 paradas) | 2.4.3 A (buena práctica) | confirmado | 4 | No |
| M13 | Menor | Botón solo con icono, sin `title` ni texto visible; el nombre dice el estado, no la acción; riesgo de doble anuncio | 4.1.2 / 4.1.3 (riesgo) | necesita tecnología de apoyo | 4 | No |
| M14 | Menor | El control nativo de borrar del buscador de la 404 es casi invisible (1,44 · 2,86 · 1,06:1) por un `filter: invert(1)` fijo | 1.4.11 AA · EN 9.1.4.11 | confirmado (Chromium) | 9 | No |
| M15 | Menor | La política no dice cuánto dura la nota del color ni cómo borrarla; «si la cambias» se refiere a lo equivocado; la versión de la política no cambia | 3.1.5 AAA / buena práctica | confirmado | 8 | No |
| M16 | Menor | Orden de la rotación: del oscuro se pasa por el claro (un destello blanco) para llegar al contraste alto | diseño (2.3.3 AAA si no hay movimiento reducido) | confirmado · decisión del dueño | 4 | No |
| M17 | Menor | El modo no sigue `prefers-color-scheme` (solo `prefers-contrast`) | diseño | confirmado · decisión del dueño | 4 | No |
| M18 | Menor | Control inactivo `.pager__dir.is-off`: 1,66 · 2,06 · 3,58:1 | 1.4.3 (exento: inactivo) | confirmado | 8 | No |
| M19 | Menor | Posible destello del lienzo antes de la hoja de estilos (marco de 48 ms con tinta del sistema) | — | necesita dispositivo real | 1 | No |
| **WCAG 2.2 (aún no exigido por EN 301 549 v3.2.1)** | | | | | | |
| W1 | — | 2.4.11: en 24 recorridos de Tab el botón nunca cubre del todo (ni más del 20 %) el elemento enfocado | 2.4.11 AA | confirmado (sin fallo) | — | — |
| W2 | — | 2.5.8: 44×44 px; separación mínima de 9 px con la píldora y de 17 px con la tarjeta | 2.5.8 AA | confirmado (sin fallo) | — | — |
| **Solo AAA** | | | | | | |
| A1 | AAA | 1.4.6: el contraste alto cumple 7:1 en todo texto salvo M1 y M18 (mínimo 8,4:1) | 1.4.6 AAA | confirmado | — | — |
| A2 | AAA | 2.4.13: el foco es un punteado de 3 px (huecos); en contraste alto convendría continuo | 2.4.13 AAA | confirmado | 2 | No |
| A3 | AAA | 2.5.5: el botón mide 44×44 px | 2.5.5 AAA | confirmado (cumple) | — | — |

### 4.2 Detalle

#### M1 · Contador del chip actual y «texto sobre granate» — serio · confirmado
- **Páginas**: `/maqueta/proyectos/` (chip «Todos»), `?tech=LUZ`, `/blog/categoria/?c=…`, `/blog/etiqueta/?t=…`; el patrón se repite en `::selection` y en el ▶ del vídeo.
- **Evidencia**: `blog.css:28` `.chips a[aria-current] sup { color: var(--blaze); }` sobre `.chips a[aria-current] { background: var(--ink); … }` (`blog.css:27`). En oscuro la tinta es clara y el granate sobre ella da 6,47:1. En claro la tinta es #232323 y el granate #963641 da **2,17:1** (axe: `a[aria-current="page"][href$="proyectos/"] > sup`, «insufficient color contrast of 2.17»). En contraste alto es #ff7a8a sobre #fff: **2,50:1**. El mismo error está en `::selection { background: var(--blaze); color: var(--ink) }` (`style.css:92`: tinta oscura sobre granate en claro, blanco sobre rosa en contraste alto) y en `.video__btn { background: var(--blaze); color: var(--ink) }` (`blog.css:224`). `luz-check` lo ve igual: `--luz-text-on-fill` sobre `--luz-brand-fill` a 2,1:1 en claro.
- **Qué vive la persona**: en claro, el número que dice cuántos proyectos tiene el filtro elegido casi no se lee; el texto seleccionado con el ratón pierde contraste; el ▶ del vídeo (el único signo de que es un botón de reproducir) casi desaparece.
- **Arreglo**: un token por modo para «lo que va sobre granate», `--on-blaze`: `#f4f2ee` oscuro (6,47:1), **`#fff` claro (7,24:1)**, **`#000` contraste alto (8,40:1)**. Úsese en `::selection` y `.video__btn`. Para el contador del chip, la salida más corta es `color: var(--bg)` (14,06 · 21,00 · 13,01:1; pierde el matiz granate, que no informa nada). En Astro + LUZ: `--luz-text-on-fill` del tema con esos tres valores; es lo que `luz-check` ya pide.
- **Fase**: 2 (token), 7 y 8 (chips).

#### M2 · Puerta del vídeo en claro — serio · confirmado (miniaturas sintéticas)
- **Página**: artículos con vídeo, con consentimiento de YouTube (p. ej. `margaret-hamilton`).
- **Evidencia**: `blog.css:222-227`. La miniatura sale en gris con `brightness(.55)` y encima una trama de puntos del color `--bg` al 55 %; el título es `color: var(--ink)`. En claro la tinta es #232323: sobre miniatura oscura, media, clara y una foto real el núcleo del trazo da **3,93 · 3,64 · 4,26 · 3,94:1** (en oscuro 17,5 · 7,2 · 4,3 · 18,2:1; en contraste alto 19,6 · 8,1 · 6,1 · 20,5:1). Captura `shots/video-photo-light.png`: el título del pie casi no se ve. El ▶ en claro, 2,17:1 (M1). Las miniaturas reales de YouTube no se cargaron (sin red): la cifra depende de ellas, pero ningún caso medido llega a 4,5:1 en claro. Es el hallazgo 21 del informe general, empeorado por el claro.
- **Arreglo**: esta pieza es «cromo de vídeo», no cabe que cambie de modo. Título en `#fff` fijo con un degradado oscuro debajo (`linear-gradient(transparent, rgb(0 0 0 / .75))`), y la trama de puntos en negro semitransparente en vez de `--bg` (que en claro es papel y aclara la foto). El botón ▶ con `--on-blaze` (M1).
- **Fase**: 8.

#### M3 · El botón sube por una tarjeta que no está fija — serio · confirmado · 1.4.10 AA
- **Páginas**: todas, con el aviso de cookies visible y la ventana de 480 px de alto o menos: 1280×1024 al 400 % (equivale a 320×256), 480×256 (400 % sobre 1920), móvil en horizontal.
- **Evidencia**: la tarjeta es `position: fixed` solo con `@media screen and (height > 30rem)` (`style.css:~500`); por debajo es parte del flujo y se va con el scroll. Pero el botón se levanta su altura con una regla **fuera** de esa consulta (`style.css:562` y `:565`: `:root:has(luz-cookie-consent > :not([hidden])) .luz-theme-mode__button--fixed { bottom: calc(var(--luz-consent-h, 0px) + …) }`). Medido a 320×256 con el aviso: el botón está en `y = -11 px` (le faltan 11 px por arriba), a 480×256 `y = 9 px`, ambos **solapando la tarjeta** (1.435 y 1.936 px² de solape, capturas `shots/zoom-320x256-banner.png` y `zoom-320x256-scrolled.png`: cubre el texto «Sin cookies propias…»). Tras desplazar 400 px la tarjeta ya está fuera (`top: -400`) y el botón sigue en `y = -11`, sin motivo.
- **Qué vive la persona**: quien amplía al 400 % ve el botón cortado sobre el texto del aviso y no puede leerlo entero; el botón es lo que más usará quien amplía.
- **Arreglo**: meter esas dos reglas dentro de `@media screen and (height > 30rem)`, igual que la tarjeta. En Astro, la altura de la tarjeta como variable solo existe cuando la tarjeta es fija. Prueba para la Fase 10: Playwright a 320×256 con el aviso, el botón dentro del viewport (`top ≥ 0`) y sin solapar el aviso.
- **Fase**: 4.

#### M4 · Bucle de las imágenes sin pausa — serio · confirmado · 2.2.2 A
- **Páginas**: `/blog/` (5 `.cover-loop` a la vez: destacado y 4 filas), artículos con portada, filas de lista, en los tres modos.
- **Evidencia**: `blog/parts.js:163-215` (`coverLoop`): ciclo de 12,2 s (portada y destacado: puntos → blanco y negro → color → blanco y negro → puntos) o 7,6 s (miniaturas), repetido mientras está a la vista, pausado solo fuera de pantalla; sin botón ni tecla. Muestreo a 0,8 · 3,2 · 6,2 · 8,6 · 11,2 s en los tres modos: el ciclo corre igual (`shots/loop-montage.jpg`). Con `prefers-reduced-motion: reduce` la imagen queda quieta en blanco y negro (`.is-shown`, `blog.css:126`): bien. Los commits `c6582a9…7f1d726` son posteriores al informe general, que solo midió el polvo del hero y la 404 (hallazgo 7).
- **El modo no lo empeora**: el bucle se entiende en los tres. En claro la imagen «hundida» queda pálida bajo puntos oscuros (`--sink-b 1.8, --sink-c .55`); el contenido sigue legible (captura montada) y no hay destello (cambios en 1,6–2 s con easing).
- **Arreglo**: lo más corto es **un solo ciclo al entrar a la vista** (~4,3 s hasta el blanco y negro) y reposar en `.is-shown`, con el color al pasar el ratón o al enfocar (ya existe). Si se quiere el bucle continuo, un único `<button aria-pressed>` «Pausar animaciones» (un interruptor global para el polvo del hero, la 404 y los bucles, puede ir junto al botón del modo) y que `coverLoop` lea `data-motion="paused"`.
- **Fase**: 5 (motor), 8.

#### M5 · «Auto» se escapa de LUZ — moderado · confirmado
- **Evidencia** (`scratchpad/.../prefs2.mjs`, `prefers-contrast` por CDP, `prefers-color-scheme` por emulación):
  1. Sin elección guardada, la página arranca **oscura** aunque el sistema sea claro (la línea del `<head>` ignora `prefers-color-scheme`), pero en cuanto el sistema cambia (por ejemplo de oscuro a claro al amanecer, o se apaga `prefers-contrast`) el `<luz-theme-mode>` pasa a «auto», **deja de ser oscuro y se hace claro** (`modeOf` de LUZ lee el esquema del sistema). Es decir, el mismo usuario ve oscuro al abrir y claro al cabo del día, sin pulsar nada.
  2. En esa deriva **el nombre del botón no cambia**: `aria-label` sale de la etiqueta del radio `auto` deshabilitado, que se escribió una vez con el modo de arranque. Medido: modo `light` con `aria-label="Modo de color: Oscuro"`; modo `light` con «Contraste alto» tras apagar el contraste del sistema. 4.1.2 A: el nombre dice una cosa y la página otra.
  3. **La primera pulsación puede no hacer nada visible**: con `c = "auto"` la siguiente es siempre «claro» (índice −1). Tras la deriva del punto 1 (ya claro), pulsar «cambia» a claro y anuncia «Modo de color: Claro». Y con `prefers-contrast: more` (arranca en contraste alto) la primera pulsación **saca** de contraste alto a claro.
- **Qué vive la persona**: quien tiene contraste alto del sistema y pulsa una vez sin querer pierde justo lo que pidió; quien usa lector de pantalla oye un modo que no es el que ve.
- **Arreglo, en la maqueta** (probado en el navegador, `scratchpad/.../fixtest.mjs`): antes de cargar el script de LUZ, `el.autoMode = () => 'dark'` (la función que LUZ llama en «auto»; deja el comportamiento igual que la línea del `<head>`: oscuro salvo que el sistema pida más contraste), y en `luz-theme-mode:change` con `detail.auto` reescribir la etiqueta del radio `auto` con `T[detail.mode]` y llamar a `el.refresh()` para que el nombre siga. En `reveal()` calcular el siguiente desde `now()` y no desde `el.choice` cuando es `auto`. Con eso: oscuro estable al cambiar el sistema, nombre = modo en todo momento, primera pulsación = siguiente del modo visible (en el camino de movimiento reducido, que usa el manejador de LUZ, la primera pulsación sigue yendo a «claro»).
- **En Astro + LUZ** (mejor): pedir a LUZ, que es del mismo dueño, un grupo **sin `auto`** que arranque en `data-mode` sin seguir al sistema (`initial` o la ausencia del radio `auto`), con `choice` y etiqueta siempre coherentes. Así desaparece el radio deshabilitado oculto. Mientras tanto, el parche de arriba.
- **Fase**: 4.

#### M6 · Píldora translúcida en claro — moderado · confirmado
- **Evidencia**: `.docked .nav` es `color-mix(in srgb, var(--bg-2) 82%, transparent)` con `backdrop-filter: blur(10px)` (`style.css:126`). En claro `--bg-2` es #e8e5df, así que sobre una imagen o canvas oscuro el fondo efectivo baja a ~#bebcb8 y el enlace apagado (`--mute` #55524d) da **4,10:1** (núcleo medido, artículo `tu-empresa…`, scroll 16120 px) y 4,19:1 en otra pasada. En oscuro el peor punto es 4,74:1 y en contraste alto 11,09:1. En home y blog el peor punto en claro es 5,42 · 5,43:1: depende de lo que pase por debajo.
- **Arreglo**: opacidad del fondo de la píldora y del botón por modo: `--glass: 82%` oscuro, **94 %** claro, **100 %** contraste alto (en contraste alto, además, el fondo traslúcido debilita justo lo que ese modo promete; ver §6 punto 4).
- **Fase**: 2 (token), 4.

#### M7 · El foco del botón sobre fotos — moderado · confirmado (medido)
- **Evidencia**: `style.css:560` `.luz-theme-mode__button:focus-visible { outline: 3px dotted var(--ink); outline-offset: 5px }`. A 375 px el botón flota sobre las fotos del artículo (la portada y las imágenes del texto cruzan su zona de 315–359 px). Comparando la captura sin foco y con foco, los píxeles del anillo frente a lo que hay detrás dan contraste mediano **2,3:1 (portada, `y = 0`), 1,56:1 (y = 5400) en oscuro**, 2,03:1 y 1,56:1 en contraste alto, y hasta el 55–70 % de los píxeles del anillo por debajo de 3:1. En claro la mediana es 4,5–5,4:1 (los anillos oscuros sobre fotos pálidas aguantan mejor). En escritorio el botón queda fuera de las imágenes y no ocurre.
- **Arreglo**: foco de dos tonos: anillo con halo del fondo, `outline: 3px dotted var(--ink); box-shadow: 0 0 0 9px var(--bg)` (el halo rellena el hueco hasta el anillo, así el anillo siempre está sobre `--bg`: 13–21:1), o `outline: 3px solid` con `box-shadow` exterior. Aplicable también a la píldora.
- **Fase**: 4.

#### M8 · Foco del buscador de la 404 en claro — moderado · confirmado · 2.4.7 AA
- **Evidencia**: `blog.css:464-467`: el input lleva `outline: none` y el foco se indica solo cambiando la hilera de puntos del subrayado a granate con `filter: brightness(1.5)` (la corrección para fondo oscuro). Contraste del punto frente al fondo: oscuro 2,79 → 3,85:1; **claro 5,33 → 3,38:1** (el foco **debilita** lo que ya se veía, porque aclarar el granate sobre papel lo acerca al fondo); contraste alto 12,68 → 12,93:1 (casi sin cambio). Es el hallazgo 30 del informe general (AAA), pero en claro además baja de contraste.
- **Arreglo**: foco real con el mismo anillo del sitio (`:focus-within` en `.lost__field-row` con `outline`), o subrayado sólido de 2 px en `--ink`. Quitar el `filter: brightness(1.5)`: un token (`--blaze-lift` ya existe y es `none` en claro).
- **Fase**: 9.

#### M9 · Contraste alto: estado «actual» y enlaces casi indistinguibles — moderado · confirmado · 1.4.1 A
- **Evidencia**: en contraste alto `--mute` #f0f0f0 e `--ink` #fff dan 1,14:1 entre sí (oscuro 1,81:1; claro 2,02:1). El menú marca «actual» y hover cambiando solo de `--mute` a `--ink` (`style.css:122`): en contraste alto es un cambio de 18,4 a 21:1, imperceptible, y el número granate (#ff7a8a frente a `--faint` #c9c9c9) es un cambio de tono. Con la regla de 30 em (los números se esconden en pantallas estrechas) solo queda la diferencia de 1,14:1. Los enlaces de la prosa tienen el color del párrafo (`#fff` frente a `#fff`) y se distinguen solo por un subrayado punteado de 1 px (`text-decoration: underline dotted 1px`, medido): cumple 1.4.1 en lo mínimo, pero un modo «contraste alto» pide más.
- **Arreglo**: el estado «actual» con marca que no sea color (el arreglo del hallazgo 3: subrayado sólido de 2 px o «●» delante) y, en contraste alto, enlaces de la prosa con `text-decoration-style: solid; text-decoration-thickness: 2px`. El token `--mute` de contraste alto puede bajar a `#d0d0d0` (≈14,5:1, sigue por encima de AAA) para dejar un paso real frente a la tinta.
- **Fase**: 2 (tokens y `[aria-current]`), 4, 8.

#### M10 · `forced-colors`: los puntos siguen al modo, no a la paleta del sistema — moderado · confirmado (emulación)
- **Evidencia**: con `forced-colors: active` el navegador pone `Canvas` (negro con esquema oscuro, blanco con el claro) y `CanvasText`, y la maqueta ya tiene bloque propio para el botón (borde 1 px `ButtonText`, `style.css:568`), correcto: se ve, el icono toma `ButtonText` y el foco es el del sistema (punteado de 3 px, cian o azul oscuro). Pero `readPalette()` (`dots.js:13`) lee `--dot-*` del modo; los canvas no leen la paleta del sistema. Medido: con esquema claro del sistema y modo oscuro o contraste alto, los puntos son #f4f2ee o #fff sobre `Canvas` blanco: **desaparecen** el título «Proyectos» (que es un canvas con el texto en `.vh`), el hero, los números de los proyectos y la leyenda de los bloques (`shots/forced-home-light-legend.png`). Con esquema oscuro del sistema y modo claro ocurre lo contrario. Antes de esta commit los puntos eran siempre #f4f2ee (hallazgo 19): ahora acierta quien tiene el modo igual que el tema de Windows; el resto, no. Además `prefers-contrast: more` arranca en contraste alto (puntos blancos), que es el peor caso con el tema «Blanco» de Windows.
- **Arreglo**: en `readPalette`, si `matchMedia('(forced-colors: active)').matches`, pintar con `CanvasText` (se obtiene con `getComputedStyle` de un elemento con `color: CanvasText`) y volver a leerla con `matchMedia('(forced-colors: active)').addEventListener('change', …)`. En ese modo el botón puede quedarse (no daña), pero conviene que `luz-theme-mode` avise de que no cambia nada visible, o se oculte.
- **Fase**: 5.

#### M11 · Sin JavaScript el modo no se aplica — moderado · confirmado
- **Evidencia**: las páginas interiores sin JS muestran solo «Esta web necesita JavaScript.» (hallazgo 1, sigue igual). El `data-mode` lo escribe únicamente el script en línea del `<head>`: sin JS la página queda en el oscuro por defecto aunque haya una elección guardada o `prefers-contrast: more`. Medido con una elección `light` guardada y JS desactivado: fondo `rgb(41,41,41)`, sin `data-mode`. El `<noscript>` también va en oscuro.
- **Importa hoy**: poco, porque sin JS no hay contenido. **En Astro importa**, porque habrá contenido y el modo será lo único que cambie.
- **Arreglo**: en CSS, `@media (prefers-contrast: more) { :root:not([data-mode]) { /* los tokens de contraste alto */ } }` y, si se quiere, `@media (prefers-color-scheme: light)` si algún día se decide seguir al sistema. La elección guardada necesita JS por construcción; se declara. En Astro, `<script is:inline>` en el layout (como ya hacen las páginas) o `theme-boot.min.js` de LUZ.
- **Fase**: 1 (layout), 2 (tokens).

#### M12 · El botón es la última parada de Tab — menor · confirmado · 2.4.3 A
- Está al final de `<body>` tras el pie (`bodyChildren`: … `footer`, `noscript`, `p.vh`, `luz-theme-mode`). En `/blog/` son 38 paradas con el aviso (34 sin él), en artículos hasta 56. No incumple 2.4.3 (el orden es lógico: es un control de preferencias, como el idioma), pero quien más lo necesita (baja visión) es quien más lejos lo tiene. Además queda después del `<footer>` y **fuera de todos los puntos de referencia**: quien navega por regiones no lo encuentra en ninguna.
- **Arreglo**: en Astro, ponerlo en el `<header>` justo después del enlace «English» (sigue siendo `position: fixed`, así que no cambia su sitio visual) o dentro del pie junto a «Ajustes de cookies». Opción menor: un segundo enlace «Cambiar el modo de color» en el pie.
- **Fase**: 4.

#### M13 · Botón con solo icono; nombre = estado — menor · necesita tecnología de apoyo · 4.1.2 / 4.1.3
- **Evidencia**: árbol de accesibilidad: `button "Modo de color: Oscuro"` y un `status` vacío; los radios, el `fieldset` y la `legend` están en `display: none` y **no aparecen** en el árbol (no deja huecos ni duplicados; el `auto` deshabilitado no tiene efecto sobre las tecnologías de apoyo, solo sobre el nombre, M5). Al pulsar: `aria-label` pasa a «Modo de color: Claro» y la región `role="status"` dice lo mismo 3 s y se vacía (verificado con Enter, Espacio y ratón; el foco se queda en el botón también tras la View Transition). No hay `aria-pressed` (no es un interruptor: son tres estados). Sin `title` ni texto visible: hover y foco no explican qué hace el icono (sol / medio círculo / luna) ni qué viene después.
- **Qué hay que probar**: si NVDA, JAWS o VoiceOver anuncian **dos veces** (cambio de nombre del botón enfocado + región viva) o una; cómo suena «Modo de color: Contraste alto, botón» (§8).
- **Arreglo posible** (si el doble anuncio se confirma): mantener el nombre estable «Modo de color» y poner el valor en `aria-description`/`aria-valuetext` equivalente, dejando que solo hable la región viva. Para videntes: un tooltip accesible (visible en hover y foco, descartable, persistente: 1.4.13) con «Oscuro · pulsa para Claro».
- **Fase**: 4.

#### M14 · Control nativo de borrar del buscador — menor · confirmado (Chromium) · 1.4.11 AA
- `blog.css:466` `.lost__search input::-webkit-search-cancel-button { filter: invert(1) grayscale(1) }`, fijo para un solo modo. En Chromium 153 el icono toma el color del texto; invertido sale **negro**: 1,44:1 sobre `--bg` en oscuro, 1,06:1 en contraste alto (negro sobre negro), 2,86:1 en claro (`shots/cancel-dark.png`). Esto no lo causa el modo (en oscuro ya era así) pero el contraste alto lo vuelve invisible. Safari y Firefox lo dibujan distinto.
- **Arreglo**: quitar el `filter` y dejar que `color-scheme` y `color` lo hagan, o `appearance: none` y un botón «Borrar» propio con nombre.
- **Fase**: 9.

#### M15 · Política de cookies y nota del color — menor · confirmado
- **Lo que hace el código**: `localStorage luz-theme` solo se escribe en `choose()` (al pulsar), nunca al cargar (comprobado: `null` tras cargar con y sin `prefers-contrast`); la lee la línea del `<head>` y LUZ al arrancar. La afirmación «solo se guarda si lo pulsas» **es correcta**. Se mantiene entre páginas e idiomas (probado en blog, proyectos y `?lang=en`).
- **Lo que le falta** (`cookies-policy.js`): (a) no dice cuánto dura (la nota del aviso dura 6 meses; esta no caduca, solo se borra con los datos del sitio) ni cómo quitarla; (b) en la tabla «Lo que se guarda: Tu respuesta a este aviso y, si la cambias, tu elección de color», «la» se refiere a la respuesta, no a pulsar el botón: «y tu elección de color si pulsas el botón de color»; (c) el texto dice «Si cambiamos estas normas, también te lo volvemos a preguntar» y la política cambió, pero `VERSION = 'soynando-2026-11'` en `shared/consent.js` no. Que no requiera consentimiento es la lectura habitual de las preferencias de interfaz elegidas por el usuario; la valoración legal no es de este informe.
- **Fase**: 8 (página de política).

#### M16 · Orden de la rotación — menor · decisión del dueño
- Claro → contraste alto → oscuro → claro. Desde el oscuro (el estado de entrada), quien necesita contraste alto pasa primero por el **claro**: una pantalla entera blanca (con la View Transition, un círculo que crece en 0,65 s; con movimiento reducido, de golpe). Para baja visión por fotofobia o deslumbramiento es el peor primer paso. Alternativa: el orden de los radios `[auto, contraste alto, claro, oscuro]`, que desde el oscuro lleva primero al contraste alto (oscuro también) y luego al claro, o dos botones. Es una decisión de diseño; no incumple nada. Si se cambia, hay que arreglar antes M5 (la primera pulsación sale del radio `auto`).

#### M17 · El modo no sigue `prefers-color-scheme` — menor · decisión del dueño
- La línea del `<head>` sigue `prefers-contrast` pero no `prefers-color-scheme`. **Ninguna norma exige seguirlo**: WCAG 2.2 AA y EN 301 549 piden que cada modo ofrecido cumpla, no que haya selector ni que se siga al sistema; solo 1.4.8 AAA habla de que el usuario pueda elegir colores. Contrapartida real: quien tiene el sistema en claro (mucha baja visión y dislexia lo prefieren) entra a un sitio oscuro y tiene que encontrar el botón (M12). El dueño ha decidido que no hay «Auto»: es coherente, pero **conviene decirlo en la declaración** (§11) y arreglar M5 para que el sistema no lo cambie a medias.

#### M18 · `.pager__dir.is-off` — menor · confirmado
- «← Más recientes» sin página anterior: un `span` inactivo a 1,66 · 2,06 · 3,58:1. Los componentes inactivos están exentos de 1.4.3, pero en contraste alto 3,58:1 es poco y el texto sigue siendo información. Mejor: no pintarlo, o `aria-disabled` y 4,5:1.
- **Fase**: 8.

#### M19 · Destello del lienzo antes de la hoja de estilos — menor · necesita dispositivo real
- La línea del `<head>` va **antes** de las hojas de estilos, de modo que el modo está puesto antes del primer pintado (así lo dice DESIGN.md) y las pruebas con la hoja retrasada 1,5 s no mostraron un modo equivocado en el marco capturado a 0,8 s. Pero un recorrido por screencast con modo claro guardado y sistema oscuro registró un marco `#121212` a 48 ms, antes de que llegara la hoja: el lienzo por defecto del navegador con `<meta name="color-scheme" content="dark light">` y el sistema oscuro (con sistema claro y modo oscuro, el marco equivalente sería blanco). Probablemente imperceptible en producción (la hoja bloquea el pintado), pero es barato: la misma línea puede escribir `document.documentElement.style.colorScheme = mode === 'light' ? 'light' : 'dark'`, que el lienzo respeta antes de cualquier hoja. Verificar en un móvil con red lenta.
- **Fase**: 1.

---

## 5. Estado de los hallazgos anteriores para estas piezas

| Hallazgo anterior | ¿Esta implementación? |
|---|---|
| 2 · `--faint` a 2,79:1 | **Oscuro: igual** (ya en el plan). **Claro: arreglado** (5,33:1; 4,74:1 sobre `--bg-2`). **Contraste alto: arreglado** (12,68:1). |
| 3 · estado «actual» solo por color | Claro: algo mejor (2,02:1 entre tinta y apagado, frente a 1,81:1). **Contraste alto: peor** (1,14:1, M9). `forced-colors`: sin cambios. |
| 6 · buscador de la 404 en alto contraste | Sin cambio; el foco por color es más débil en claro (M8). |
| 7 · movimiento sin forma de pararlo | Sin cambio en polvo y 404. Los bucles de imagen son nuevos y no están en el informe (M4). |
| 19 · canvas con tinta fija en `forced-colors` | Cambia pero no se arregla: depende del modo, no del sistema (M10). |
| 21 · título del vídeo sobre la miniatura | **Peor en claro** (M2). |
| 25 · granate como texto con `filter` (axe lo mide mal) | **Arreglado en claro y contraste alto** (no hay `filter`); en oscuro sigue (`--blaze-lift`), con 6 pares marcados por axe como en el informe original. |
| 26 · foco tapado por píldora y tarjeta | El botón **no añade ningún caso** (0 de 24 recorridos con el 100 % tapado y ninguno con más del 20 %). Píldora y tarjeta sin cambios. |
| 29 · objetivos de 44 px (AAA) | El botón cumple (44×44 px). |
| C6 (cookies) · casilla marcada 2,17:1 | **Arreglado en claro (5,76:1) y contraste alto (7,78:1)**; sin cambio en oscuro. |

---

## 6. Respuestas a lo que se preguntó

**1. Contraste por modo.** Ver §3 y M1, M2, M6. Las líneas punteadas de `--faint`, los bordes `--edge`/`--rule`, el foco, los estados hover y `aria-current`, el texto sobre `--bg-2`, sobre canvas y sobre imágenes y el crédito de la portada están medidos; lo que falla está en la tabla de §3.2. Los enlaces con subrayado punteado se distinguen por el subrayado en los tres modos (1.4.1); en contraste alto el subrayado es de 1 px (M9).

**2. El botón.**
- *Anuncio*: nombre «Modo de color: <modo>», rol botón, valor en el nombre, cambio por región `role="status"` durante 3 s (verificado en DOM y en el árbol de accesibilidad; **lo que dicen NVDA, JAWS y VoiceOver sin probar**, M13).
- *Teclado*: Enter y Espacio funcionan, con y sin movimiento reducido; el foco se queda en el botón tras la View Transition. Es la última parada de Tab (M12).
- *Tamaño y separación*: 44×44 px; separación mínima de 9 px con la píldora y de 17 px con la tarjeta; nunca solapa píldora ni tarjeta a 320, 390, 768 y 1440 px, con y sin aviso. Pasa 2.5.8 con holgura. Cubre contenido solo de forma pasajera al desplazar (un enlace al 5–32 % en algún punto del scroll de `/blog/`): no es un fallo.
- *Zoom y reflujo*: sin scroll horizontal a 200 % y 400 %. **Falla con el aviso visible en pantallas de 480 px de alto o menos** (M3).
- *Foco*: nunca queda oculto por el botón; **pero el propio foco del botón se pierde sobre fotos en móvil** (M7).
- *`display: none` en el grupo de radios*: sin huecos para tecnología de apoyo (los radios no están en el árbol). El `auto` deshabilitado **sí** causa un defecto visible: el nombre del botón sale de su etiqueta (M5).

**3. Preferencias y robustez.**
- `prefers-contrast: more`: arranca en contraste alto (probado con CDP). En vivo, mientras no se haya pulsado: **LUZ sigue al sistema y la página cambia a «claro» con el sistema claro** (M5).
- `prefers-color-scheme`: se ignora al arrancar (decisión, M17), pero LUZ lo lee en vivo (M5).
- `prefers-reduced-motion`: las transiciones del botón, la View Transition y el bucle de las imágenes se apagan (CSS y JS comprobados). Con él, el cambio es directo y el bucle queda en `.is-shown`.
- `forced-colors`: el botón tiene bloque propio y se ve bien; los canvas, no (M10). Los fondos de puntos hechos con `radial-gradient` (botones del aviso, chips, paginación) desaparecen como en el informe general (hallazgo 3): el aviso de cookies ya tiene respaldo (subrayado), la paginación y los chips no.
- *Sin JS*: la maqueta sigue vacía; el modo no importa hoy y sí en Astro (M11).
- *Parpadeo al cargar*: la línea del `<head>` corre antes de las hojas; no se vio un modo equivocado en la captura (M19, a verificar en móvil).
- `color-scheme` y controles nativos: `:root` cambia a `dark`, `light`, `dark`; la casilla sin marcar tiene borde a 4,26 · 3,61 · 5,27:1; las barras de desplazamiento siguen el modo. El `<meta name="color-scheme" content="dark light">` solo manda antes de la hoja.
- *Persistencia*: `luz-theme` se escribe solo al pulsar; la política lo dice y es cierto (M15, con tres matices).

**4. Contenido que cambia de significado.** La leyenda «cuanto más reciente, más denso» **sigue siendo cierta y legible** en claro: más puntos oscuros sobre papel; los cuatro bloques de muestra se ven (`shots/home-light-legend.png`). Que las fotos se dibujen «al revés» en claro no pierde información (se vio en el montaje del bucle): la persona sigue reconociendo la imagen en los tres modos. El bucle incumple 2.2.2 en los tres modos por igual (M4). El granate como único acento se distingue de la tinta en claro por tono y por su valor (6,47:1 frente a 14,06:1), pero **solo por color**: ninguna marca (subrayado, forma) lo acompaña en el menú, el índice, los filtros y la paginación (hallazgo 3, no resuelto).

**5. Lo que falta o sobra.**
- *«Auto»*: **no hace falta para cumplir nada** (ni WCAG 2.2 AA ni EN 301 549). Lo que sí hace falta es que lo que se ofrece sea coherente (M5) y decirlo en la declaración. Ver M17.
- *Contraste alto*: líneas visibles (edge 6,3:1, rule 10:1), sin degradados, texto a 8,4:1 o más (AAA 1.4.6). Lo que le falta: estado «actual» y enlaces con marca que no sea tono (M9), sin traslúcidos en la píldora y el botón (82 %, `backdrop-filter`), foco continuo en vez de punteado (A2) y un contador de chip legible (M1).
- *Otras cosas que un revisor señalaría*: el botón y la píldora comparten esquina inferior derecha y cambian de sitio con el aviso (`bottom` calculado con `--luz-consent-h`): funciona, pero depende de que la variable exista (M3); el bucle (M4); el control de borrar (M14); la rotación (M16).

---

## 7. Lo que está bien hecho (conservarlo en Astro)

- **Paletas como tokens** con `data-mode` en `<html>`, escrito antes del primer pintado; todo el CSS lee tokens. El claro cumple 4,5:1 en todo texto real; el contraste alto cumple 7:1.
- **`color-scheme` por modo**: controles y barras nativas con el contraste correcto en los tres (casilla 3,6–5,3:1).
- **Botón**: 44×44 px, redondo, `aria-label` en español e inglés, región `role="status"`, Enter y Espacio, foco que se queda, nunca solapa píldora ni tarjeta, nunca cubre el foco, iconos distinguibles por forma (sol, medio círculo, luna), `transition: none` con movimiento reducido, bloque propio para `forced-colors`.
- **View Transition del cambio**: corre solo sin movimiento reducido (JS y CSS), el click se captura antes del de LUZ para cambiar el modo una vez, el foco se queda, pulsar tres veces seguidas deja el modo esperado y `data-vt` desaparece a los 0,7 s.
- **Persistencia honesta**: nada se escribe al cargar; la política lo dice; se conserva entre páginas e idiomas.
- **`<meta name="theme-color">`** que sigue el modo; **`lang` del botón** en inglés.
- **El aviso, los diálogos y el panel de proyecto** no tienen ningún par que falle por el modo (ni en claro ni en contraste alto).
- **El bucle de las fotos** se entiende en los tres modos; el contenido sigue en el DOM, el canvas es `aria-hidden`.
- Los radios ocultos con `display: none` no ensucian el árbol de accesibilidad.

---

## 8. Pruebas manuales pendientes

| Prueba | Con qué | Qué mirar |
|---|---|---|
| El botón del modo | NVDA + Firefox, JAWS + Chrome (Windows); VoiceOver + Safari (macOS e iOS); TalkBack | Qué se anuncia al llegar, al pulsar (¿una o dos veces? ¿«Modo de color: Claro» y luego otra vez?), si la región viva se oye con la View Transition, cómo se lee en inglés |
| `prefers-contrast: more` y esquema del sistema | Windows 11 (Configuración → Accesibilidad → Contraste), macOS (Aumentar contraste), iOS | Arranque, cambio en vivo sin pulsar (M5), primera pulsación |
| `forced-colors` real | Windows 11 con los temas «Acuático», «Desierto», «Crepúsculo» y «Cielo nocturno» | Canvas (M10), botón, foco, estado «actual» (M9), vídeo (▶) |
| Safari y Firefox | — | View Transition, `color-scheme` y el control de borrar del buscador (M14), `:has()` de la tarjeta, destello previo a la hoja (M19) |
| Móvil real | iOS y Android, con red lenta | Destello del modo, foco del botón sobre fotos (M7), botón sobre la píldora y el aviso, zoom de texto al 200 % |
| Zoom del navegador al 400 % | Chrome, Firefox y Safari de escritorio, 1280×1024 | M3 con el aviso visible y a 320×256 |
| Modo oscuro forzado de Android / Samsung Internet | — | Interacción con `color-scheme` y `<meta name="color-scheme">` |
| Control por voz | Voice Control, Dragon | «Pulsa modo de color» (el nombre cambia con el modo) |
| Miniaturas reales de YouTube | Navegador con red | M2 con las miniaturas claras |

---

## 9. Lista para pegar en la Fase 10 del plan

```markdown
#### Modos de color (WCAG 2.2 AA · EN 301 549 v3.2.1) — ver .ai/plan/informe-accesibilidad-modos.md
- [ ] axe 4.10.x a 375 y 1280 px, es y en, con `reducedMotion: 'reduce'`, **en los tres modos** (`localStorage luz-theme`): 0 `serious`/`critical`; también con el aviso de cookies, el diálogo de ajustes, «Compartir artículo», el panel de proyecto y el artículo con línea de tiempo abiertos
- [ ] Contraste por script (estilos computados + píxeles) en los tres modos: todo texto ≥ 4,5:1 (grande ≥ 3:1) y no texto ≥ 3:1; incluido el texto sobre canvas, imágenes y la píldora translúcida en su peor punto; contraste alto ≥ 7:1 (AAA)
- [ ] `luz-check --theme src/styles/luz-theme-trama.css` sin bloqueos en light, dark y high-contrast; el tema define **todos** los tokens semánticos en los tres modos (el contraste alto de LUZ es blanco: el de Trama es negro); `--luz-text-on-fill` ≥ 4,5:1 sobre `--luz-brand-fill` en cada modo
- [ ] Un token «sobre granate» por modo (`#f4f2ee` · `#fff` · `#000`); ningún `color: var(--ink)` sobre `--blaze`, ni `var(--blaze)` sobre `--ink`
- [ ] Ningún `filter`, `invert` ni `brightness()` fijos para un solo modo (buscar `filter:` en el CSS)
- [ ] Botón de modo: `top ≥ 0` y sin solapar el aviso a 320×256 con el aviso visible; foco visible sobre fotos (anillo con halo del fondo ≥ 3:1 en cualquier fondo); 44×44 px; nombre = modo en todo momento
- [ ] El nombre del botón sigue al modo tras cambiar el sistema (`prefers-color-scheme` y `prefers-contrast` en vivo) y la primera pulsación cambia al siguiente del modo visible
- [ ] Sin JS: el `<head>` aplica el modo con script en línea y un respaldo en CSS (`prefers-contrast: more`)
- [ ] `forced-colors: active` con esquema oscuro y claro: canvas con `CanvasText`, botón, foco y estado «actual» visibles
- [ ] Estado «actual» y enlaces de la prosa con marca que no sea color también en contraste alto
- [ ] Bucles de imagen y polvo: se paran solos (≤ 5 s) o con un interruptor global «Pausar animaciones»; `prefers-reduced-motion` los deja quietos
- [ ] Política de cookies: duración y cómo borrar la nota del color; versión de la política cambiada si cambia el texto
- [ ] Revisión manual con NVDA + Firefox, VoiceOver + Safari (macOS e iOS) y TalkBack del botón, de los tres modos y de `forced-colors` en Windows real (§8 del informe)
```

---

## 10. Por fases del plan

| Fase | Hallazgos |
|---|---|
| 1 · Andamiaje | M11 (script en línea del layout y respaldo CSS), M19 (`color-scheme` inline) |
| 2 · Tema LUZ | M1 (token `--on-blaze` / `--luz-text-on-fill`), M6 (opacidad de vidrio por modo), M9 (tokens de contraste alto y `[aria-current]`), A2, `luz-check` por modo |
| 4 · Chrome | M3 (altura mínima de la consulta), M5 (grupo sin `auto`), M7 (foco con halo), M12 (posición en el DOM), M13, M16 |
| 5 · Motor de puntos | M4 (bucle que se para), M10 (paleta del sistema en `forced-colors`) |
| 7 · Proyectos / 8 · Blog | M1 (chips), M2 (vídeo), M9, M15, M18 |
| 9 · 404 y búsqueda | M8, M14 |
| 10 · Calidad | La lista de §9 |

**Lo que arregla por sí solo el paso a HTML estático**: nada del contraste ni del botón. Solo M11 en parte (con HTML completo, sin JS ya hay contenido; el modo sigue necesitando respaldo en CSS). Todo lo demás se arrastra tal cual si se copian el CSS y las plantillas.

---

## 11. Borrador para la declaración de accesibilidad

> **Modos de color.** La web tiene tres modos: oscuro (el de entrada), claro y contraste alto. Se cambian con el botón redondo de abajo a la derecha: cada pulsación pasa al siguiente y el botón dice el modo en el que estás. La web no cambia sola de modo según el sistema: arranca en oscuro, o en contraste alto si tu sistema pide más contraste. Si prefieres otro, el botón lo recuerda para la próxima vez; esa nota se guarda en tu navegador, no se envía a ningún sitio, y solo existe si pulsas el botón (puedes borrarla en los datos del sitio).
> **Lo que sé que aún falla** *(actualizar al publicar)*:
> - [Los hallazgos de este informe que sigan abiertos: contador del filtro activo, título del vídeo en el modo claro, estado «actual» en contraste alto, …]
> - Con el tema de contraste forzado de Windows, las animaciones de puntos usan los colores del sistema [una vez resuelto M10].
> - Si tu sistema usa alto contraste forzado, los tres modos casi no se notan: manda el tema de tu sistema.
> **Sin JavaScript** la elección de modo no se guarda ni se aplica: la web se ve en oscuro, o en contraste alto si tu sistema lo pide [con el respaldo de CSS].
> **Cómo se ha comprobado**: contraste por script sobre los colores reales de cada modo, axe en los tres modos, teclado, ampliación hasta 320 px de ancho y 256 px de alto, emulación de alto contraste forzado. [Pruebas con NVDA, VoiceOver y TalkBack del botón de modo: DD/MM/AAAA.] Que las pruebas automáticas salgan limpias no significa que la web sea accesible.

---

## 12. Notas fuera del alcance de accesibilidad

- `maqueta/shared/consent.js` y `cookies-policy.js`: ver M15 (versión de la política que no cambia aunque cambie el texto).
- El orden de las filas en `/blog/` y los títulos duplicados (hallazgo 24) no se tocan aquí.
- El `<luz-theme-mode>` de la maqueta es la 0.4.1 copiada; los arreglos de M5 se pueden hacer desde `theme.js` sin editar el vendor, pero lo limpio es una opción en LUZ.
