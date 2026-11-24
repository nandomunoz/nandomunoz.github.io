---
title: "Cómo crear skills de IA: una guía para quien empieza"
excerpt: "Una skill de IA es una carpeta con un fichero SKILL.md. Cómo crear la tuya para Claude Code o Codex, comprobar que funciona y evitar los errores típicos."
date: "2026-11-24"
category: "codigo-y-gestion"
tags: ["inteligencia-artificial","asistentes-de-codigo"]
lang: "es"
translated: false
original: "https://nandomunoz.com/blog/como-crear-skills/"
cover: {"src":"./cover.jpg","tone":"./cover.tone.webp","w":1536,"h":1024,"alt":"Una pieza de puzle blanca, de pie sobre un fondo gris claro, delante de un círculo de luz en el que se proyecta la silueta de la misma pieza","credit":"Nando Muñoz, imagen generada con IA."}
---

Seguro que te ha pasado. Abres una conversación con tu asistente de código y, otra vez, le explicas lo mismo: «los mensajes de commit van en inglés y en imperativo», «los tests se llaman así», «antes de abrir una PR pasa el linter». Mañana, en otra conversación, se lo vuelves a explicar.

Una **skill** es la forma de dejar de repetirte. Y lo mejor es que, por dentro, es bastante menos de lo que imaginas: **una carpeta con un fichero de texto**. Sin framework, sin servidor, sin nada que instalar.

En este artículo te cuento qué es una skill, cómo crear la tuya para asistentes como Claude Code o Codex, cómo comprobar que funciona y qué errores evitar. Está pensado para quien empieza: hace falta saber moverse por una terminal y haber visto un fichero Markdown, y poco más.

## ¿Qué es una skill?

Es una carpeta que contiene, como mínimo, un fichero llamado `SKILL.md`. Ese fichero tiene dos partes: arriba, unos pocos datos en [YAML](https://www.ibm.com/es-es/think/topics/yaml), un formato de texto de `clave: valor` (el [*frontmatter*](https://docs.github.com/es/contributing/writing-for-github-docs/using-yaml-frontmatter)) y, debajo, las instrucciones escritas en Markdown, como se las explicarías a un compañero nuevo.

La idea es que el asistente no lee todas tus skills de golpe. Solo conoce el nombre y una descripción corta de cada una. Cuando le pides algo que encaja con la descripción, entonces abre el fichero entero y sigue las instrucciones. Es como tener un manual de procedimientos en una estantería: no te lo sabes de memoria, pero sabes dónde mirar cuando toca.

<div class="luz-alert luz-alert--info" role="note">
<div class="luz-alert__body">Hay un detalle que importa: no es un invento de una sola herramienta. Es <a href="https://agentskills.io/specification">el estándar abierto Agent Skills</a>, que creó Anthropic y que hoy leen muchos asistentes, como Claude Code o Codex.</div>
</div>

### ¿En qué se diferencia de un prompt o de un `AGENTS.md`?

Las tres cosas sirven para decirle al asistente cómo trabajar, pero se usan en momentos distintos:

<figure class="table"><div class="scroll" tabindex="0" role="region" aria-label="Tres formas de decirle al asistente cómo trabajar"><table>
<thead><tr><th scope="col">Qué es</th><th scope="col">Cuándo se carga</th><th scope="col">Para qué sirve</th></tr></thead>
<tbody>
<tr><td>Un prompt</td><td>Cuando lo escribes tú, cada vez</td><td>Una petición puntual</td></tr>
<tr><td><code>AGENTS.md</code> (o <code>CLAUDE.md</code>)</td><td>Siempre, en todas las peticiones</td><td>Hechos del proyecto: «usamos pnpm», «los tests están en <code>tests/</code>»</td></tr>
<tr><td>Una skill</td><td>Solo cuando hace falta</td><td>Procedimientos: «así se prepara una release»</td></tr>
</tbody></table></div><figcaption><em>Tres formas de decirle al asistente cómo trabajar</em></figcaption></figure>

La diferencia práctica es el coste. Lo que está en `AGENTS.md` ocupa espacio en el contexto del asistente en cada petición. Una skill cuesta unos cien <a href="/blog/introduccion-a-la-ia/#qué-hay-dentro">tokens</a> hasta que se activa.

*Una regla sencilla para decidir: si una parte de tu `AGENTS.md` ha dejado de ser un dato y se ha convertido en una receta con pasos, es una skill que aún no has sacado a su carpeta.*

## ¿Cómo creo mi primera skill, paso a paso?

Crear una skill son cuatro pasos: crear la carpeta, escribir el `SKILL.md`, probarla e iterar. Vamos a recorrerlos con una de ejemplo, que ayuda a escribir mensajes de commit. No hace falta que sea esta; sirve para ver el proceso.

<luz-timeline class="timeline--wide" aria-label="Los cuatro pasos para crear la skill de ejemplo">
<ol class="luz-timeline">
<li class="luz-timeline__item"><span class="luz-timeline__date">Paso 1</span><p class="luz-timeline__title">Crea la carpeta</p><p class="luz-timeline__text">En Claude Code, las skills de un proyecto viven en <code>.claude/skills/</code>; otras herramientas leen <code>.agents/skills/</code>.</p><pre><code class="language-bash">mkdir -p .claude/skills/mensajes-de-commit</code></pre></li>
<li class="luz-timeline__item"><span class="luz-timeline__date">Paso 2</span><p class="luz-timeline__title">Escribe el <code>SKILL.md</code></p><p class="luz-timeline__text">Con el frontmatter arriba y las instrucciones debajo:</p><pre><code class="language-markdown">---
name: mensajes-de-commit
description: "Escribe mensajes de commit claros siguiendo las convenciones del equipo. Úsala cuando te pidan hacer un commit o revisar un mensaje de commit. No la uses para PRs ni para historiales de git."
---&#10;
# Mensajes de commit&#10;
1. Mira qué ha cambiado con `git diff --staged`.
2. Escribe el título en inglés, en imperativo y de menos de 72 caracteres
   («Add login form», no «Added login form»).
3. Si el cambio necesita explicación, deja una línea en blanco y cuenta
   el porqué, no el qué: el diff ya enseña el qué.
4. Enseña el mensaje al usuario y espera su visto bueno antes de hacer el commit.</code></pre></li>
<li class="luz-timeline__item"><span class="luz-timeline__date">Paso 3</span><p class="luz-timeline__title">Pruébala</p><p class="luz-timeline__text">Pídele algo que encaje: «haz commit de lo que tengo preparado». Si la descripción está bien escrita, el asistente debería usar la skill. En Claude Code también puedes llamarla a mano escribiendo <code>/mensajes-de-commit</code>.</p></li>
<li class="luz-timeline__item"><span class="luz-timeline__date">Paso 4</span><p class="luz-timeline__title">Itera</p><p class="luz-timeline__text">Mira qué hizo mal y arregla el fichero, no la conversación. Si no se activó, afina la descripción. Si se activó pero hizo algo raro, afina el cuerpo.</p></li>
</ol>
</luz-timeline>

### ¿Qué hay dentro de una skill y de su `SKILL.md`?

Esta es la estructura completa. Solo el primer fichero es obligatorio:

```text
mi-skill/
├── SKILL.md        # obligatorio: datos + instrucciones
├── references/     # opcional: documentos que se leen solo si hacen falta
├── scripts/        # opcional: programas que ejecuta el asistente
└── assets/         # opcional: plantillas y otros recursos
```

El frontmatter tiene **seis campos**, y solo dos son obligatorios:

<figure class="table"><div class="scroll" tabindex="0" role="region" aria-label="Los seis campos del frontmatter"><table>
<thead><tr><th scope="col">Campo</th><th scope="col">¿Obligatorio?</th><th scope="col">Qué es</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>Sí</td><td>El nombre. Máximo 64 caracteres, solo minúsculas, números y guiones, y <strong>igual que el nombre de la carpeta</strong></td></tr>
<tr><td><code>description</code></td><td>Sí</td><td>Qué hace la skill y cuándo usarla. Máximo 1.024 caracteres</td></tr>
<tr><td><code>license</code></td><td>No</td><td>La licencia</td></tr>
<tr><td><code>compatibility</code></td><td>No</td><td>Qué necesita para funcionar (Node, red, un programa concreto…)</td></tr>
<tr><td><code>metadata</code></td><td>No</td><td>Datos extra, como una versión escrita como texto</td></tr>
<tr><td><code>allowed-tools</code></td><td>No</td><td>Herramientas preaprobadas. Es experimental</td></tr>
</tbody></table></div><figcaption><em>Los seis campos del frontmatter</em></figcaption></figure>

Fíjate en lo que **no** hay: no existe un campo `id`, ni `version`, ni `instructions`. Las instrucciones son el cuerpo del fichero, sin más.

#### ¿Qué significa que se carga «por niveles»?

Es el truco que hace que puedas tener decenas de skills sin llenar la cabeza del asistente:

1. **Siempre cargado:** `name` y `description` de cada skill (unos cien tokens).
2. **Al activarse:** el cuerpo de `SKILL.md`. Se recomienda que no pase de unas 500 líneas.
3. **Solo si hace falta:** los ficheros de `references/`, `scripts/` y `assets/`.

Por eso conviene que `SKILL.md` sea corto y que apunte a otros ficheros para los detalles: «lee `references/errores-de-api.md` si la API devuelve algo distinto de un 200».

### ¿Cómo escribo una descripción para que la skill se active?

Si solo vas a cuidar una cosa, que sea esta. La descripción es lo único que el asistente ve de tu skill hasta que decide usarla. Si es vaga, la skill no se activa cuando toca. Si es demasiado amplia, se activa cuando no toca.

Una buena descripción responde a tres preguntas: qué hace, cuándo usarla y cuándo **no** usarla.

```yaml
# Mal: ¿ayuda con qué? ¿cuándo?
description: Ayuda con los commits.

# Mejor
description: "Escribe mensajes de commit claros siguiendo las convenciones del equipo. Úsala cuando te pidan hacer un commit o revisar un mensaje de commit. No la uses para PRs ni para historiales de git."
```

**Ojo con las comillas del segundo ejemplo. Si la descripción lleva dos puntos (`: `) y no la entrecomillas, algunos programas la aceptan y otros la rechazan por YAML inválido. Entrecomilla siempre la descripción y te ahorras el problema.**

### ¿Qué escribo en el cuerpo?

Aquí es donde se nota si pensaste en el lector o no. Algunas pautas que repiten las guías:

- **Cuenta solo lo que al asistente le falta.** Pregúntate: «¿se equivocaría sin esta instrucción?». Si la respuesta es no, quítala.
- **Da valores por defecto, no menús.** «Usa pytest» funciona mejor que «puedes usar pytest, unittest o nose».
- **Escribe procedimientos, no declaraciones.** Pasos numerados antes que descripciones generales.
- **Pon lo más importante al principio.** En algunas herramientas, cuando la conversación se compacta (se resume para hacer sitio), solo se conservan los primeros miles de tokens de cada skill.
- **Cuéntale cuándo leer cada fichero extra,** en lugar de dejarle todo mezclado.

Una frase de la <a href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices">guía de buenas prácticas de Anthropic</a> lo resume bien: la ventana de contexto es un bien público. Todo lo que escribes compite por ese espacio con el resto de la conversación.

### ¿Cuándo me hace falta un script?

Muchas skills no lo necesitan: son solo instrucciones, y está bien. Un script merece la pena cuando una operación es **frágil** o hay que hacerla siempre igual: validar un formato, calcular una ruta, escribir un fichero con una estructura exacta.

La regla es la de los grados de libertad. Cuando hay varias formas válidas de hacer algo, deja que el asistente decida con texto. Cuando solo hay una forma correcta, dale un script y no le dejes improvisar.

Si escribes un script que va a ejecutar un asistente, ten en cuenta que **nunca puede quedarse esperando a que alguien escriba algo**. Un script que pregunta «¿continuar? (s/n)» se queda colgado para siempre. Algunas costumbres que ayudan:

- Recibe los datos por argumentos (`--nombre`, `--dry-run`), no por preguntas.
- Ten un `--help` corto con ejemplos.
- Si falla, di qué falló, qué esperabas y qué se puede probar.
- Escribe el resultado en la salida estándar y los avisos en la de errores.
- Ofrece un `--dry-run` que enseñe lo que haría sin hacerlo.
- Usa códigos de salida distintos: 0 si va bien, 1 si encontró problemas, 2 si lo usaste mal.

### ¿Cómo sé que mi skill funciona?

Hay dos preguntas distintas, y conviene no mezclarlas.

**¿Se activa cuando toca?** Escribe unas cinco frases que deberían activarla y otras cinco que no. Las más útiles entre las que no deben activarla son las que *casi* encajan («revisa el historial de git», en nuestro ejemplo). Prueba cada frase unas cuantas veces y apunta cuántas veces acierta.

**¿Hace lo que quieres cuando se activa?** Aquí la comparación útil es con y sin skill: pide lo mismo dos veces, una con la skill y otra sin ella, y mira qué cambia. Siempre que puedas, comprueba el resultado con código (¿el mensaje tiene menos de 72 caracteres?) en vez de a ojo.

<div class="luz-alert luz-alert--info" role="note">
<div class="luz-alert__body">Una frase de la <a href="https://code.claude.com/docs/en/skills#evaluate-and-iterate-on-a-skill">documentación de Claude Code</a> lo deja claro: ver que una skill se activa demuestra que el asistente la encontró, no que hizo lo que querías.</div>
</div>

## ¿Qué cuidado debo tener con la seguridad?

Mucho más del que parece. Una skill es texto que el asistente obedece, y puede incluir scripts que se ejecutan con **tus permisos**. Instalar una skill ajena es, en la práctica, instalar software.

- **Lee todos los ficheros** de una skill de terceros antes de usarla, no solo el `SKILL.md`.
- **Desconfía de las que descargan cosas de internet** mientras funcionan.
- **No des por hecho que `allowed-tools` te protege.** Preaprueba herramientas, pero no impide que se usen otras.
- Si una skill **escribe ficheros por ti**, mejor que lo haga un script con `--dry-run` y que el asistente te enseñe lo que va a escribir antes de hacerlo.
- Lo que tenga que cumplirse **siempre** no lo dejes solo en el texto de la skill: se puede olvidar o ignorar. Ponlo en un mecanismo que lo fuerce (en Claude Code, un *hook*: un comando que Claude Code ejecuta solo en momentos concretos).

## ¿Funciona igual en Claude Code, Codex y otros asistentes?

A medias. La carpeta y el `SKILL.md` viajan bien. Lo que rodea a la skill, no tanto:

**Viaja entre herramientas:**

- La carpeta, el `SKILL.md` y los seis campos
- El Markdown y las rutas relativas
- `AGENTS.md`

**Es propio de cada una:**

- Cómo se invoca a mano (`/nombre` en Claude Code, `$nombre` en Codex)
- Los campos extra del frontmatter
- Subagentes, hooks y plugins
- La herramienta para hacerte preguntas

<div class="luz-alert luz-alert--info" role="note">
<div class="luz-alert__body">Si tu skill usa un campo propio de una herramienta, las demás lo ignoran sin avisar, y en algunos sitios (como al subirla a claude.ai) un campo de más es un error. Si quieres que sea portable, quédate con los seis campos del estándar y escribe las instrucciones en texto llano.</div>
</div>

## ¿Qué errores comete casi todo el mundo?

- **Una descripción vaga.** «Ayuda con el código» no le dice nada al asistente. Di qué hace, cuándo y cuándo no.
- **Dos puntos sin comillas en la descripción.** Funciona en tu herramienta y falla en otra.
- **Un `name` distinto del nombre de la carpeta.** Algunos clientes lo toleran; otros no cargan la skill.
- **Meterlo todo en `SKILL.md`.** Si pasa de unas 500 líneas, reparte en `references/`.
- **Escribir mal un campo.** Muchas herramientas ignoran en silencio lo que no reconocen, así que un `allowed_tools` con guion bajo no da error: simplemente no hace nada.
- **Dar por buena una skill porque se activa.** Que se active no prueba que haga lo que querías.
- **Un script que pregunta.** Si espera a que escribas algo, el asistente se queda esperando para siempre.

## Esto está muy bien, pero ¿no hay una manera más sencilla?

<blockquote><p>La forma más sencilla de hacerlo es pedirle a tu modelo que cree la skill, se lo explicas y lo más importante: ¡revisas tú cómo lo ha hecho :)!</p></blockquote>

Y para empezar, elige algo pequeño y que ya te moleste. Piensa en lo último que le has explicado dos veces a tu asistente y conviértelo en una skill de veinte líneas. Escribe una buena descripción, pruébala con unas pocas frases que sí y unas pocas que no, y corrige lo que falle.

