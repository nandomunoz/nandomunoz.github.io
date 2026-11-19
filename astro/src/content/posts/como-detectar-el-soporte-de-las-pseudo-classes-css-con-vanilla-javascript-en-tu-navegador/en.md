---
title: "How to detect support for CSS pseudo-classes with vanilla JavaScript in your browser"
excerpt: "At some point you may need to know whether a CSS pseudo-class is supported by the browser. I once did, with :autofill versus :-webkit-autofill."
date: "2021-08-26"
category: "codigo-y-gestion"
tags: []
lang: "en"
translated: true
original: "https://soynando.com/como-detectar-el-soporte-de-las-pseudo-classes-css-con-vanilla-javascript-en-tu-navegador/"
cover: {"src":"./cover.jpg","tone":"./cover.tone.webp","w":1600,"h":1066,"alt":"A CSS book on the table","credit":"Foto de KOBU Agency en <a href=\"https://unsplash.com\" rel=\"noopener\">Unsplash</a>."}
---

<strong>At some point you may need to know whether a CSS pseudo-class is supported by the browser. I once did, with the </strong><code>:autofill</code> <strong> property versus </strong><code>:-webkit-autofill</code><strong>, and now I'll tell you how I solved it.</strong>

Thanks to the <code>:autofill</code> property you can always apply a different style to an element such as an <code>&lt;input type="email"&gt;</code> or <code>&lt;input type="password"&gt;</code> once it has been autofilled, as in the typical login form.

In my work I needed to detect via JavaScript, only when the input is autofilled, but there is no JS event of the “autofill” kind. There is a way, a somewhat more sophisticated way of tackling the problem, <a href="https://medium.com/@brunn/detecting-autofilled-fields-in-javascript-aed598d25da7">devised by Tommy Brunn with the animationstart event </a> but it never quite fitted for me.

## The supportPseudoClass module

Browsing <a href="https://stackoverflow.com/questions/8531940/how-to-detect-if-browser-support-specified-css-pseudo-class/61597966#61597966">Stack Overflow, a user shared a very simple function </a> to detect when a pseudo-class is supported.

<figure class="embed" data-host="gist.github.com"><a href="https://gist.github.com/nandomunoz/a6096b7b63593afaa588bf45eabec947" rel="noopener">https://gist.github.com/nandomunoz/a6096b7b63593afaa588bf45eabec947</a></figure>
