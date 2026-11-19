---
title: "كيف تكتشف دعم الفئات الزائفة في CSS باستخدام vanilla JavaScript في متصفحك"
excerpt: "ربما احتجتَ يومًا إلى معرفة ما إذا كان المتصفح يدعم فئة زائفة في CSS. أنا احتجت إلى ذلك في وقتٍ ما مع :autofill مقابل :-webkit-autofill."
date: "2021-08-26"
category: "codigo-y-gestion"
tags: []
lang: "ar"
translated: true
original: "https://soynando.com/como-detectar-el-soporte-de-las-pseudo-classes-css-con-vanilla-javascript-en-tu-navegador/"
cover: {"src":"./cover.jpg","tone":"./cover.tone.webp","w":1600,"h":1066,"alt":"كتاب عن CSS على الطاولة","credit":"Foto de KOBU Agency en <a href=\"https://unsplash.com\" rel=\"noopener\">Unsplash</a>."}
---

<strong>ربما احتجتَ يومًا إلى معرفة ما إذا كان المتصفح يدعم فئة زائفة في CSS. أنا احتجت إلى ذلك في وقتٍ ما مع الخاصية </strong><code>:autofill</code> <strong> مقابل </strong><code>:-webkit-autofill</code><strong>، والآن أحكي لك كيف حللت المشكلة.</strong>

بفضل الخاصية <code>:autofill</code> تستطيع دائمًا تطبيق تنسيق مختلف على عنصر مثل <code>&lt;input type="email"&gt;</code> أو <code>&lt;input type="password"&gt;</code> عندما يكون قد ملأه المتصفح تلقائيًا، كما يحدث مثلًا في نموذج تسجيل الدخول المعتاد.

كنت في عملي بحاجة إلى اكتشاف ذلك عبر javascript، فقط عندما يُملأ الحقل تلقائيًا، لكن لا يوجد في js حدث من نوع «autofill». هناك طريقة، طريقة أكثر تعقيدًا بعض الشيء لمعالجة المشكلة، <a href="https://medium.com/@brunn/detecting-autofilled-fields-in-javascript-aed598d25da7">ابتكرها Tommy Brunn باستخدام الحدث animationstart </a> لكنها لم تناسبني تمامًا.

## وحدة supportPseudoClass

وأنا أتصفح <a href="https://stackoverflow.com/questions/8531940/how-to-detect-if-browser-support-specified-css-pseudo-class/61597966#61597966">Stack Overflow شارك أحد المستخدمين دالة بسيطة جدًا </a> لاكتشاف ما إذا كانت الفئة الزائفة مدعومة.

<figure class="embed" data-host="gist.github.com"><a href="https://gist.github.com/nandomunoz/a6096b7b63593afaa588bf45eabec947" rel="noopener">https://gist.github.com/nandomunoz/a6096b7b63593afaa588bf45eabec947</a></figure>
