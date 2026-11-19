---
title: "Cómo detectar el soporte de las pseudoclases CSS con vanilla JavaScript en tu navegador"
excerpt: "Quizás alguna vez tengas la necesidad de saber si una pseudoclase de CSS está soportada por el navegador. Yo en su día la tuve con :autofill frente a :-webkit-autofill."
date: "2021-08-26"
category: "codigo-y-gestion"
tags: []
lang: "es"
translated: false
original: "https://soynando.com/como-detectar-el-soporte-de-las-pseudo-classes-css-con-vanilla-javascript-en-tu-navegador/"
cover: {"src":"./cover.jpg","tone":"./cover.tone.webp","w":1600,"h":1066,"alt":"Libro de CSS sobre la mesa","credit":"Foto de KOBU Agency en <a href=\"https://unsplash.com\" rel=\"noopener\">Unsplash</a>."}
---

<strong>Quizás alguna vez tengas la necesidad de saber si una pseudoclase de CSS está soportada por el navegador. Yo en su día la tuve con la propiedad </strong><code>:autofill</code> <strong> versus </strong><code>:-webkit-autofill</code><strong>, ahora te cuento cómo lo solucioné.</strong>

Gracias a la propiedad <code>:autofill</code> puedes aplicar un estilo distinto siempre a un elemento como un <code>&lt;input type="email"&gt;</code> o <code>&lt;input type="password"&gt;</code> cuando se ha autocompletado, como por ejemplo en el típico formulario de login.

Durante mi trabajo necesitaba detectar vía javascript, sólo cuando el input es autocompletado, pero no existe un evento en js del tipo «autofill». Existe una manera, una manera un poco más sofisticada de abordar el problema <a href="https://medium.com/@brunn/detecting-autofilled-fields-in-javascript-aed598d25da7">ideada por Tommy Brunn con el evento animationstart </a> pero a mí no me terminaba de encajar.

## Módulo supportPseudoClass

Ojeando <a href="https://stackoverflow.com/questions/8531940/how-to-detect-if-browser-support-specified-css-pseudo-class/61597966#61597966">Stack Overflow un usuario compartió una función muy sencilla </a> para detectar cuando una pseudoclase es soportada.

<figure class="embed" data-host="gist.github.com"><a href="https://gist.github.com/nandomunoz/a6096b7b63593afaa588bf45eabec947" rel="noopener">https://gist.github.com/nandomunoz/a6096b7b63593afaa588bf45eabec947</a></figure>
