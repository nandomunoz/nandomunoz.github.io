---
title: "تعلّم Web Components"
excerpt: "ما هي Web Components؟ Web Components مجموعة من تقنيات الويب القياسية تتيح إنشاء عناصر مخصّصة قابلة لإعادة الاستخدام، لكلٍّ منها بنيته وأسلوبه ووظيفته، مغلّفة بالكامل ومعزولة…"
date: "2024-12-17"
category: "codigo-y-gestion"
tags: ["carnaval-de-cadiz","css","gestion-de-equipos","javascript","poesia-contemporanea","privacidad","web-components"]
lang: "ar"
translated: true
original: "https://soynando.com/aprendiendo-web-components/"
cover: {"src":"./cover.jpg","tone":"./cover.tone.webp","w":1600,"h":900,"alt":"تُظهر الصورة مكتب مطوّر ويب محترفًا بأسلوب pixel art، بإعداد من شاشتين: تعرض إحداهما محرّر شيفرة في الوضع الداكن مع أسطر مميَّزة، وتعرض الأخرى متصفّحًا في وضع التنقيح وأدوات المطوّر مفعّلة. على المكتب فنجان قهوة ولوحة مفاتيح لاسلكية وفأرة ودفتر ملاحظات، كل ذلك في جوّ مرتّب وحديث ومضاء جيدًا، يعكس الإنتاجية والتركيز على تطوير الويب."}
---

## ما هي Web Components؟

تُعدّ <em>Web Components</em> مجموعة من تقنيات الويب القياسية تتيح إنشاء عناصر مخصّصة قابلة لإعادة الاستخدام، لكلٍّ منها بنيته وأسلوبه ووظيفته، مغلّفة بالكامل ومعزولة عن بقية الشيفرة. وهذا يسهّل بناء مكوّنات نمطية، ويتجنّب مشاكل التداخل في الأنماط والسلوك بين العناصر، ويسمح باستخدامها في مشاريع مختلفة دون الحاجة إلى الاعتماد على أطر عمل محدّدة.

بحسب <a href="https://developer.mozilla.org/es/docs/Web/Web_Components">توثيق MDN</a>:

<blockquote><p>«مكوّنات الويب حزمة من التقنيات المختلفة تتيح لك إنشاء عناصر مخصّصة قابلة لإعادة الاستخدام — مع وظائفها المغلّفة بمعزل عن بقية الشيفرة — واستخدامها في تطبيقات الويب.»</p></blockquote>

تقوم Web Components أساسًا على ثلاث تقنيات رئيسية:

1. <strong>Custom Elements:</strong> تتيح لنا تعريف عناصر HTML خاصة بنا بسلوك مخصّص.
2. <strong>Shadow DOM:</strong> يوفّر تغليفًا حقيقيًا لـ DOM، يمنع تضارب الأنماط ويُبقي الشيفرة نمطية بحقّ.
3. <strong>HTML Templates:</strong> تتيح تعريف بُنى من الترميز يمكن إعادة استخدامها واستنساخها دون الحاجة إلى إعادة رسم مكلفة.

## خطوات إنشاء Web Component دون أطر عمل، باستخدام vanilla JS

### 1. استخدام معيار وحدات JavaScript (JS Modules)

وحدات JavaScript ميزة أصلية تتيح تقسيم الشيفرة إلى ملفات منفصلة، لكلٍّ منها نطاقه الخاص، مما يسهّل إعادة استخدامها وصيانتها.

بحسب <a href="https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules">توثيق MDN</a>:

<blockquote><p>«بدأت برامج JavaScript صغيرة جدًا. أما اليوم فنبني تطبيقات كاملة من جهة العميل بكثير من JavaScript، وتساعد الوحدات على تنظيم هذه الشيفرة وتحميلها بشكل غير متزامن وصيانتها بطريقة بسيطة وقابلة للتوسّع.»</p></blockquote>

<strong>البنية الأساسية للوحدة:</strong>

- <strong>تعريف الوحدة من ملف HTML:</strong> <code>&lt;script type="module" src="js/wcicon.js"&gt;&lt;/script&gt;</code>
- <strong>تعريف شيفرة الوحدة مباشرة في ملف <code>.js</code>:</strong> <code>// Ejemplo: module.js export function saludar() { console.log("Hola desde un módulo!"); }</code> ثم، في ملف JS آخر أو في HTML: <code>import { saludar } from './module.js'; saludar(); // "Hola desde un módulo!"</code>

### 2. البنية الأساسية لـ Web Component

في البداية، تكتفي كثير من الشروحات بعرض «Hello World» داخل مكوّن. أما هنا فسنذهب خطوة أبعد: لنفترض أننا نحتاج إلى مكوّن مخصّص يعرض أيقونة معيّنة بحسب سمة. مثلًا، أيقونة Twitter:

```
<wc-icon typeicon="twitter"></wc-icon>
```

<strong>قواعد عند إنشاء Custom Element (Web Component):</strong>

- يجب أن يحتوي اسم الوسم المخصّص على شرطة (<code>-</code>). مثلًا: <code>&lt;wc-icon&gt;</code> يلتزم بهذه القاعدة. وهذا يمنع التعارض مع عناصر HTML الأصلية.
- يمكنك إضافة ما تحتاجه من السمات: <code>&lt;wc-icon typeicon="twitter" size="large"&gt;&lt;/wc-icon&gt;</code>.

<strong>استدعاء Web Component كوحدة:</strong>

في ملف HTML الذي يُستخدم فيه المكوّن، يجب أن نستورد ملف المكوّن كوحدة ES6:

```
<script type="module" src="js/wcicon.js"></script>
```

<strong>البنية الأساسية في JavaScript:</strong>

```
// wcicon.js

class WcIcon extends HTMLElement {
  constructor() {
    super();
    // Definir atributos por defecto
    this.typeicon = "default";
  }

  // Lista de atributos a observar
  static get observedAttributes() {
    return ["typeicon"];
  }

  // Se dispara cuando el elemento es insertado en el DOM
  connectedCallback() {
    this.render();
  }

  // Se dispara cuando el elemento es removido del DOM
  disconnectedCallback() {
    // Aquí podrías limpiar listeners u otros recursos
  }

  // Se dispara cuando alguno de los atributos en observedAttributes cambia
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "typeicon") {
      this.typeicon = newValue;
      this.render();
    }
  }

  // Método para actualizar la representación del componente
  render() {
    this.innerHTML = `
      <span class="icon-${this.typeicon}">[icono: ${this.typeicon}]</span>
    `;
  }
}

// Definir el elemento personalizado
window.customElements.define("wc-icon", WcIcon);

// Exportar la clase (opcional, pero recomendable para organización del código)
export default WcIcon;
```

<em>ملاحظة:</em> ليس إلزاميًا استخدام JS Modules مع Web Components، لكنه ممارسة جيدة لأنه يسهّل تنظيم المشروع وقابليته للتوسّع.

### 3. الإجراءات الداخلية الخاصة بـ Web Component

داخل constructor والدوال الأصلية، ندير خصائص المكوّن ودورة حياته.

- <strong>Constructor:</strong> هنا نهيّئ الخصائص وننشئ Shadow DOM إن احتجنا إليه. مثلًا: <code>constructor() { super(); this.typeicon = "default"; }</code>
- <strong>إدارة السمات والتعامل معها:</strong> يمكن أن تتغيّر سمات مثل <code>typeicon</code>. وعندما يحدث ذلك، تتيح لنا <code>attributeChangedCallback</code> الاستجابة لهذه التغييرات. مثال: <code>attributeChangedCallback(attr, oldValue, newValue) { if (attr === "typeicon") { this.typeicon = newValue; this.render(); } }</code>
- <strong>connectedCallback():</strong> تُنفَّذ عند إضافة العنصر إلى DOM.
- <strong>disconnectedCallback():</strong> تُنفَّذ عند إزالة العنصر من DOM.
- <strong>observedAttributes():</strong> هي getter من نوع static تُرجع قائمة السمات التي نريد مراقبتها. في حالتنا: <code>static get observedAttributes() { return ["typeicon"]; }</code>

تتيح لنا هذه الدوال بناء مكوّنات ديناميكية، والتفاعل مع التغييرات، والحفاظ على شيفرة مرتّبة ومتّسقة.

### ما هو Shadow DOM؟

<em>Shadow DOM</em> جزء أساسي من Web Components. يتيح لنا تغليف الترميز والنمط والوظيفة الخاصة بالمكوّن، بحيث لا تؤثر CSS و JavaScript الخاصتان بالبيئة التي يُستخدم فيها المكوّن على داخله، والعكس صحيح.

- <strong>التعريف:</strong><br>ينشئ Shadow DOM شجرة DOM مغلّفة مرتبطة بعنصر ما، لا تتأثر بالنمط أو السكربت العام للصفحة. وهذا يضمن أن يكون المكوّن نمطيًا بحقّ.
- <strong>ما فائدته؟:</strong><br>يفيد في تجنّب تعارض أسماء الـ class، وأنماط CSS العامة التي تطغى على المظهر الداخلي للمكوّن، أو السلوكيات غير المرغوب فيها. وهذا يجعل صيانة المكوّن وإعادة استخدامه أسهل.
- <strong>كيف نطبّقه؟:</strong><br>داخل constructor الخاص بـ Custom Element، يمكننا إرفاق shadow root بالعنصر: <code>constructor() { super(); // Creamos un shadow root en modo 'open' this.attachShadow({ mode: 'open' }); this.shadowRoot.innerHTML = \` &lt;style&gt; .icon { color: #1da1f2; /* Ejemplo: color Twitter */ font-size: 24px; } &lt;/style&gt; &lt;span class="icon"&gt;[icon]&lt;/span&gt; \`; }</code>

بهذا تُغلَّف <code>&lt;span class="icon"&gt;</code> وأنماطها داخل shadow root، فيُتجنَّب التعارض مع بقية الصفحة.

### 4. LitElement: أسهل طريقة لإنشاء Web Components دون أن تموت في المحاولة

مع أن إنشاء Web Components باستخدام vanilla JS ممكن تمامًا، فقد طوّر المجتمع مكتبات لتبسيط العملية. ومن أشهرها <a href="https://lit.dev/docs/getting-started/"><strong>LitElement</strong> </a>(من عائلة Lit)، التي تتيح:

- تعريف المكوّنات بشيفرة «boilerplate» أقل.
- استخدام قوالب مبنية على <code>\`<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals">template literals</a></code>\` لتوليد DOM.
- التفاعل تلقائيًا مع تغيّرات خصائص المكوّن.
- دمج shadow DOM دون احتكاك.

<strong>التعريف:</strong> LitElement مكتبة خفيفة وحديثة لإنشاء مكوّنات الويب تستفيد من أحدث ميزات JavaScript. تساعد على إبقاء الشيفرة نظيفة وسهلة القراءة وسهلة الصيانة جدًا.

<strong>ما فائدته؟:</strong><br>يجعل LitElement إنشاء Custom Element أسرع، بشيفرة متكرّرة أقل، ويسهّل إدارة الخصائص التفاعلية والأنماط ودوال دورة حياة المكوّن.

<strong>كيف نطبّقه؟:</strong><br>مثال أساسي باستخدام LitElement:

```
import { LitElement, html, css } from 'lit';

class MyIcon extends LitElement {
  static properties = {
    typeicon: { type: String },
  };

  static styles = css`
    .icon {
      font-size: 24px;
      color: #1da1f2;
    }
  `;

  constructor() {
    super();
    this.typeicon = 'default';
  }

  render() {
    return html`
      <span class="icon">[Icono: ${this.typeicon}]</span>
    `;
  }
}

customElements.define('my-icon', MyIcon);
```

مع LitElement تصبح الشيفرة أكثر إيجازًا وأكثر تصريحية، مما يسرّع تطوير مكوّنات تزداد تعقيدًا. العيب الوحيد أن Google (الشركة التي أنشأت المكتبة) تهملها قليلًا في الآونة الأخيرة. ومع ذلك، استخدامها موصى به بنسبة 100 %، وإن كنت ستنشئ مشروعًا كبيرًا، فما أجمل أن تبني أدواتك الخاصة على المعايير باستخدام JS كما اعتدنا عليها منذ زمن 😀

## الخلاصة

تمثّل Web Components خطوة ثابتة نحو توحيد معايير تطوير frontend وجعله نمطيًا. تتيح لنا إنشاء عناصر قابلة لإعادة الاستخدام بالكامل، ويمكن دمجها في أي مشروع، وخالية من الاعتماد على أطر عمل محدّدة. وسواء استخدمنا vanilla JS أو مكتبات مثل LitElement، فإن منحنى التعلّم يكافئنا بالوضوح وسهولة الصيانة وقابلية التوسّع التي تقدّمها هذه المكوّنات لتطبيقات الويب لدينا.
