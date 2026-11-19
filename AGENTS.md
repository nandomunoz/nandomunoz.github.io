# AGENTS.md

Guía para cualquier agente (o persona) que trabaje en este repositorio. Las reglas de la sección «Reglas» son obligatorias; el resto es el mapa para no perder tiempo.

## Qué es esto

Dos sitios conviven en el repo, del mismo dueño (Nando Muñoz):

| Sitio | Dónde | Cómo se genera | Estado |
|---|---|---|---|
| **El portafolio actual** (Cassette, Disquetes, VHS y Digital) | raíz: `index.html`, `es/`, `en/`, `projects/`, `proyectos/`, `eastereggs/`, `assets/` | `node build.mjs` desde `data/*.json` y `src/` | Publicado en GitHub Pages (`main`) |
| **El sitio nuevo** nandomunoz.com | `astro/` | Astro 7 + LUZ, estático, en es, en y ar | En la rama `feature/astro` |

El plan del sitio nuevo y su historia están en `.ai/plan/plan-soynando-astro.md` . La maqueta (`maqueta/`) que le sirvió de prototipo ya no existe en esta rama; sigue en la rama `proto/home`.

## Mapa

```
build.mjs  src/  data/  tools/   el Cassette: el build, la voz (src/speech.mjs), los datos y las herramientas
assets/                          estilos, audio de la cinta (assets/audio/<idioma>/), tarjetas sociales (assets/og/)
.githooks/pre-commit             falla si páginas o audios no están al día (git config core.hooksPath .githooks)
astro/src/content/               datos del sitio nuevo: site.json, projects.json, categories.json, tags.json, posts/<slug>/{index,en,ar}.md
astro/src/{pages,components,layouts,i18n,lib,scripts,styles}/
astro/tools/                     comprobadores, auditoría, redirecciones, tarjetas, capturas de proyectos
astro/DESIGN.md                  el sistema de diseño (tokens, puntos, modos de color)
astro/tools/kanji-cells.py       el generador de los kanjis en puntos (escribe astro/src/scripts/kanji-cells.js)
.ai/agents/                      roles de revisión en Markdown: accesibilidad, SEO, legal, rendimiento, tono, etc.
.ai/plan/                        planes e informes de auditoría (los informes legales, informe-legal-*.md, solo en local)
.ai/soynando/                    (solo en local) el volcado del WordPress antiguo
tools/ai-leak-check.mjs          la auditoría de fugas de .ai/ (la lanza .githooks/pre-push)
.claude/                         (solo en local) lo propio de Claude Code: ajustes, worktrees y un enlace agents → ../.ai/agents
```

Hay datos que existen dos veces, uno por sitio (por ejemplo los enlaces sociales en `data/site.json` y en `astro/src/content/site.json`, o los proyectos en `data/projects.json` y `astro/src/content/projects.json`). Si cambias uno, cambia el otro.

## Comandos

**Astro** (desde `astro/`, Node 22.22 o más):

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor en `http://127.0.0.1:4321/`; queda en segundo plano (`astro dev stop` lo para) |
| `npm run build` | `astro check`, build a `dist/` y Content-Security-Policy por página |
| `npm test` | Pruebas `node:test` |
| `npm run check:links` | Enlaces, imágenes y anclas internas de `dist/` |
| `npm run budgets` | Peso por página frente al presupuesto |
| `npm run audit` | Chromium sobre `dist/`: axe (WCAG 2.2 AA), reflow, sin JS, cookies, foco, colores forzados, CLS (`CHROMIUM=/ruta/al/navegador`; `-- --quick` es una pasada corta) |
| `npm run seo`, `npm run redirects`, `npm run check:placeholders` | SEO, redirecciones y datos pendientes |

**Cassette** (desde la raíz): `node build.mjs` (páginas y audios que falten), `node build.mjs --check` (no cambia nada; falla si algo no está al día), `node build.mjs --no-audio --say` (muestra lo que dirá la voz).

Antes de dar por buena una tarea sobre el sitio nuevo: `npm run build`, `npm test` y, si tocaste maquetación o scripts, `npm run audit -- --quick`. Para un cambio visual, mira la página en un navegador (hay Chromium y `playwright-core` en `astro/node_modules`): que compile no demuestra que se vea bien.

## Reglas

### La voz del Cassette: revisa los audios al cambiar textos

Cuando cambies la descripción de un proyecto (`data/projects.json`), la bio u otros textos que lee la cinta (`data/site.json`: `bio`, `kicker`, `deck`, `socials`) o las etiquetas de la carátula (`data/archivo.json` → `cassette`):

1. Ejecuta `node build.mjs`. Solo regenera los audios cuyo texto cambió (cada clip se llama por el hash de lo que dice) y borra los que ya no usa nada. No regeneres audios a mano ni subas `VERSION` en `src/speech.mjs` salvo que cambie cómo suena la voz.
2. Comprueba con `node build.mjs --check`.
3. Si el texto trae palabras que la voz puede leer mal (inglés en `es`, nombres españoles en `en`, siglas), revisa lo que dirá con `node build.mjs --no-audio --say` y añade la pronunciación en `data/pronounce.json` antes de generar.
4. Commitea juntos los textos, las páginas y los cambios en `assets/audio/` (altas y bajas).

Si dice que la voz no está instalada: `tools/voice-setup.sh`.

### Imágenes: siempre `<picture>`

Toda imagen de contenido va dentro de un `<picture>`, aunque hoy solo haya un formato; el `<img>` de dentro es el respaldo y lleva `alt`, `width`, `height` y `loading`. Vale para el HTML a mano, para `build.mjs` y para Astro. ```html
<picture>
  <source srcset="foto.avif" type="image/avif">
  <source srcset="foto.webp" type="image/webp">
  <img src="foto.jpg" alt="…" width="1200" height="630" loading="lazy">
</picture>
```

Quedan fuera favicons, `og:image` y los `<img>` que solo sirven para leer píxeles en un canvas.

### Proyectos y kanjis

Al añadir un proyecto o cambiar un repo, revisa `data/kanjis-repos.json` (un kanji por repo, con su `url`) y mantén `count` al día.

## Cómo trabajar

- **Commits:** solo cuando te lo pidan; la excepción es `feature/astro`, donde se commitea por hito. Nunca hagas push sin que te lo pidan. Mensajes en inglés, claros sobre qué cambia y por qué.
- **`.ai/` se versiona, pero cada push pasa una auditoría de fugas.** `.ai/` es lo de cualquier IA: planes, informes y roles de revisión. El hook `.githooks/pre-push` lanza `node tools/ai-leak-check.mjs --push`, que revisa cada versión de cada archivo de `.ai/` que va en el push y lo bloquea si hay secretos o tokens, claves, un correo que no está en la lista permitida (`tools/ai-leak-check.json`), un teléfono, una ruta de la máquina (`/home/…`) o un archivo que nunca se versiona (`settings.local.json`, `.env`, claves). Si bloquea, se quita el dato del archivo (y de los commits que van a subir); solo si es público a propósito se añade a la lista. Además, la IA que vaya a hacer push con cambios en `.ai/` pasa antes el rol `ai-auditor` (`.ai/agents/ai-auditor.md`), que ve lo que un script no ve: datos personales de terceros, información interna, instrucciones peligrosas. Para revisar sin hacer push: `node tools/ai-leak-check.mjs`. **Los commits y push que no tocan `.ai/` no esperan al `ai-auditor`**: el rol solo se exige cuando el push lleva cambios en `.ai/` (el hook corre siempre, pero sin cambios en `.ai/` no tiene nada que revisar).
- **`.claude/` se queda en local: nunca se commitea, ni se sube, ni se copia a un servicio externo** (está en `.gitignore`). Solo guarda lo propio de Claude Code. Las herramientas que el sitio necesita van en `astro/tools/` o `tools/`, nunca ahí. Lo que un agente deje por escrito (un informe, un plan) va a `.ai/plan/`.
- **Roles de revisión:** `.ai/agents/<rol>.md` describe cada uno (qué mira, cómo y en qué formato informa). Cualquier IA puede leerlos como instrucciones; la cabecera (`name`, `description`, `tools`) es el formato de Claude Code y las demás pueden ignorarla.
- **Revisa antes de borrar o sobrescribir.** Y no commitees cambios que no hayas revisado (por ejemplo, el trabajo de otro agente a medias).
- **No inventes contenido.** Los textos de proyectos salen de los README de repos reales de `github.com/nandomunoz`; los hechos, fechas y enlaces se comprueban.
- **Voz del sitio:** primera persona, llana, cálida y directa, con tuteo. En español, comillas «» y ortografía RAE; en inglés, británico.
- **Tres idiomas** en el sitio nuevo (es, en, ar con escritura de derecha a izquierda): cualquier cambio de interfaz debe funcionar en los tres, con propiedades lógicas de CSS.
- **Accesibilidad:** WCAG 2.2 AA es el listón (`npm run audit` lo comprueba); nada que dependa solo del color, del ratón o de JavaScript para lo esencial.
- **Temporales** (capturas, scripts de prueba): fuera del repo.
