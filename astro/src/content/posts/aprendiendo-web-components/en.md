---
title: "Learning Web Components"
excerpt: "What are Web Components? Web Components are a group of standard web technologies that let you create reusable custom elements with their own structure, style and functionality, completely encapsulated and isolated…"
date: "2024-12-17"
category: "codigo-y-gestion"
tags: ["carnaval-de-cadiz","css","gestion-de-equipos","javascript","poesia-contemporanea","privacidad","web-components"]
lang: "en"
translated: true
original: "https://soynando.com/aprendiendo-web-components/"
cover: {"src":"./cover.jpg","tone":"./cover.tone.webp","w":1600,"h":900,"alt":"The image shows a professional web developer's desk in pixel art style, with a dual-monitor setup: one screen displays a code editor in dark mode with highlighted lines and the other shows a browser in debugging mode with the developer tools active. On the desk there is a cup of coffee, a wireless keyboard, a mouse and a notebook, all in a tidy, modern, well-lit setting that reflects productivity and a focus on web development."}
---

## What are Web Components?

<em>Web Components</em> are a group of standard web technologies that let you create reusable custom elements with their own structure, style and functionality, completely encapsulated and isolated from the rest of the code. This makes it easier to build modular components, avoiding problems of styles and behaviour between elements, and lets you use them in different projects without depending on specific frameworks.

According to the <a href="https://developer.mozilla.org/es/docs/Web/Web_Components">MDN documentation</a>:

<blockquote><p>“Web Components are a package of different technologies that let you create reusable custom elements — with their functionality encapsulated away from the rest of the code — and use them in web applications.”</p></blockquote>

Web Components rest mainly on three key technologies:

1. <strong>Custom Elements:</strong> They let us define our own HTML elements with custom behaviour.
2. <strong>Shadow DOM:</strong> It provides real encapsulation of the DOM, avoiding style collisions and keeping the code truly modular.
3. <strong>HTML Templates:</strong> They let you define markup structures that can be reused and cloned without costly repaints.

## Steps to create a Web Component without frameworks, using vanilla JS

### 1. Using the JavaScript Modules standard (JS Modules)

JavaScript modules are a native feature that lets you split code into separate files, each with its own scope, making it easier to reuse and maintain.

According to the <a href="https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules">MDN documentation</a>:

<blockquote><p>“JavaScript programs started out quite small. Nowadays we build complete client-side applications with a lot of JavaScript, and modules help to organise, load asynchronously and maintain this code in a simple and scalable way.”</p></blockquote>

<strong>Basic structure of a module:</strong>

- <strong>Declaring the module from an HTML file:</strong> <code>&lt;script type="module" src="js/wcicon.js"&gt;&lt;/script&gt;</code>
- <strong>Declaring the module's code directly in a <code>.js</code> file:</strong> <code>// Ejemplo: module.js export function saludar() { console.log("Hola desde un módulo!"); }</code> Then, in another JS file or in the HTML: <code>import { saludar } from './module.js'; saludar(); // "Hola desde un módulo!"</code>

### 2. Basic structure of a Web Component

To begin with, many tutorials limit themselves to showing a “Hello World” inside a component. Here we will go a step further: let's imagine we need a custom component that displays a specific icon according to an attribute. For example, a Twitter icon:

```
<wc-icon typeicon="twitter"></wc-icon>
```

<strong>Rules when creating a Custom Element (Web Component):</strong>

- The name of the custom tag must contain a hyphen (<code>-</code>). For example: <code>&lt;wc-icon&gt;</code> follows this rule. This avoids conflicts with native HTML elements.
- You can add as many attributes as you need: <code>&lt;wc-icon typeicon="twitter" size="large"&gt;&lt;/wc-icon&gt;</code>.

<strong>Calling the Web Component as a module:</strong>

In the HTML where the component is used, we have to import the component's file as an ES6 module:

```
<script type="module" src="js/wcicon.js"></script>
```

<strong>Basic structure in JavaScript:</strong>

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

<em>Note:</em> Using JS Modules with Web Components is not mandatory, but it is good practice, since it makes the project easier to organise and scale.

### 3. The Web Component's own internal actions

Inside the constructor and the native methods, we manage the component's properties and its lifecycle.

- <strong>Constructor:</strong> Here we initialise properties and create the Shadow DOM if we need it. For example: <code>constructor() { super(); this.typeicon = "default"; }</code>
- <strong>Managing and handling attributes:</strong> Attributes such as <code>typeicon</code> can change. When this happens, <code>attributeChangedCallback</code> lets us respond to those changes. Example: <code>attributeChangedCallback(attr, oldValue, newValue) { if (attr === "typeicon") { this.typeicon = newValue; this.render(); } }</code>
- <strong>connectedCallback():</strong> It runs when the element is added to the DOM.
- <strong>disconnectedCallback():</strong> It runs when the element is removed from the DOM.
- <strong>observedAttributes():</strong> It is a static getter that returns the list of attributes we want to observe. In our case: <code>static get observedAttributes() { return ["typeicon"]; }</code>

These functions let us build dynamic components, react to changes and keep the code tidy and coherent.

### What is the Shadow DOM?

The <em>Shadow DOM</em> is a fundamental part of Web Components. It lets us encapsulate a component's markup, style and functionality, so that the CSS and JavaScript of the environment where it is used do not affect the inside of the component, and vice versa.

- <strong>Definition:</strong><br>The Shadow DOM creates an encapsulated DOM tree attached to an element, which is not affected by the page's global style or script. This guarantees that the component is truly modular.
- <strong>What is it for?:</strong><br>It is for avoiding clashes between class names, global CSS styles that overwrite the component's internal appearance, or unwanted behaviours. This makes the component easier to maintain and reuse.
- <strong>How do you implement it?:</strong><br>Inside the Custom Element's constructor, we can attach a shadow root to the element: <code>constructor() { super(); // Creamos un shadow root en modo 'open' this.attachShadow({ mode: 'open' }); this.shadowRoot.innerHTML = \` &lt;style&gt; .icon { color: #1da1f2; /* Ejemplo: color Twitter */ font-size: 24px; } &lt;/style&gt; &lt;span class="icon"&gt;[icon]&lt;/span&gt; \`; }</code>

With this, the <code>&lt;span class="icon"&gt;</code> and its styles are encapsulated inside the shadow root, avoiding conflicts with the rest of the page.

### 4. LitElement: the easiest way to create Web Components without dying trying

Although it is perfectly possible to create Web Components in vanilla JS, the community has developed libraries to simplify the process. One of the most popular is <a href="https://lit.dev/docs/getting-started/"><strong>LitElement</strong> </a>(from the Lit family), which allows you to:

- Define components with less “boilerplate” code.
- Use templates based on <code>\`<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals">template literals</a></code>\` to generate the DOM.
- React automatically to changes in the component's properties.
- Integrate the shadow DOM without friction.

<strong>Definition:</strong> LitElement is a lightweight, modern library for creating web components that takes advantage of the latest JavaScript features. It helps keep the code clean, easy to read and very maintainable.

<strong>What is it for?:</strong><br>LitElement makes creating a Custom Element quicker, with less repetitive code, and makes it easier to manage reactive properties, styles and the component's lifecycle functions.

<strong>How do you implement it?:</strong><br>A basic example with LitElement:

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

With LitElement, the code is more concise and declarative, which speeds up the development of ever more complex components. The only drawback is that lately Google (the library's creator) has left it a little forgotten. Even so, using it is 100% recommended, although if you are going to build a big project, what could be better than creating your own tools based on the standards, with good old JS 😀

## Conclusion

Web Components represent a firm step towards the standardisation and modularisation of frontend development. They let us create fully reusable elements that can be integrated into any project and are free of dependencies on specific frameworks. Whether using vanilla JS or libraries such as LitElement, the learning curve is rewarded by the clarity, maintainability and scalability these components bring to our web applications.
