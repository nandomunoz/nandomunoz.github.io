---
title: "Aprendiendo Web Components"
excerpt: "¿Qué son los Web Components? Los Web Components son una agrupación de tecnologías web estándar que permiten crear elementos personalizados reutilizables con su propia estructura, estilo y funcionalidad, completamente encapsulados y aislados…"
date: "2024-12-17"
category: "codigo-y-gestion"
tags: ["carnaval-de-cadiz","css","gestion-de-equipos","javascript","poesia-contemporanea","privacidad","web-components"]
lang: "es"
translated: false
original: "https://soynando.com/aprendiendo-web-components/"
cover: {"src":"./cover.jpg","tone":"./cover.tone.webp","w":1600,"h":900,"alt":"La imagen muestra un escritorio profesional de un desarrollador web en estilo pixel art, con una configuración de doble monitor: uno exhibe un editor de código en modo oscuro con líneas destacadas y el otro muestra un navegador en modo depuración con herramientas de desarrollo activas. Sobre el escritorio hay una taza de café, un teclado inalámbrico, un ratón y una libreta, todo en un ambiente ordenado, moderno y bien iluminado, que refleja productividad y enfoque en el desarrollo web."}
---

## ¿Qué son los Web Components?

Los <em>Web Components</em> son una agrupación de tecnologías web estándar que permiten crear elementos personalizados reutilizables con su propia estructura, estilo y funcionalidad, completamente encapsulados y aislados del resto del código. Esto facilita la creación de componentes modulares, evitando problemas de estilos y comportamientos entre elementos, y permite su uso en diferentes proyectos sin necesidad de depender de frameworks específicos.

Según la <a href="https://developer.mozilla.org/es/docs/Web/Web_Components">documentación de MDN</a>:

<blockquote><p>«Los Componentes Web son un paquete de diferentes tecnologías que te permiten crear elementos personalizados reutilizables — con su funcionalidad encapsulada apartada del resto del código — y utilizarlos en las aplicaciones web.»</p></blockquote>

Los Web Components se basan principalmente en tres tecnologías clave:

1. <strong>Custom Elements:</strong> Nos permite definir nuestros propios elementos HTML con comportamiento personalizado.
2. <strong>Shadow DOM:</strong> Proporciona un encapsulamiento real del DOM, evitando colisiones de estilos y manteniendo el código verdaderamente modular.
3. <strong>HTML Templates:</strong> Permite definir estructuras de marcado que se pueden reutilizar y clonar sin necesidad de realizar repintados costosos.

## Pasos para crear un Web Component sin frameworks, usando vanilla JS

### 1. Usando el estándar de Módulos de JavaScript (JS Modules)

Los módulos de JavaScript son una funcionalidad nativa que permite dividir el código en archivos separados, cada uno con su propio ámbito, facilitando la reutilización y mantenimiento del mismo.

Según la <a href="https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules">documentación de MDN</a>:

<blockquote><p>«Los programas JavaScript comenzaron siendo bastante pequeños. Hoy en día creamos aplicaciones completas del lado del cliente con mucho JavaScript, y los módulos ayudan a organizar, cargar de forma asíncrona y mantener este código de forma sencilla y escalable.»</p></blockquote>

<strong>Estructura básica de un módulo:</strong>

- <strong>Declarar el módulo desde un archivo HTML:</strong> <code>&lt;script type="module" src="js/wcicon.js"&gt;&lt;/script&gt;</code>
- <strong>Declarar el código del módulo directamente en un archivo <code>.js</code>:</strong> <code>// Ejemplo: module.js export function saludar() { console.log("Hola desde un módulo!"); }</code> Luego, en otro archivo JS o en el HTML: <code>import { saludar } from './module.js'; saludar(); // "Hola desde un módulo!"</code>

### 2. Estructura básica de un Web Component

Para empezar, muchos tutoriales se limitan a mostrar un «Hello World» dentro de un componente. En este caso, iremos un paso más allá: imaginemos que necesitamos un componente personalizado que muestre un ícono específico según un atributo. Por ejemplo, un ícono de Twitter:

```
<wc-icon typeicon="twitter"></wc-icon>
```

<strong>Reglas al crear un Custom Element (Web Component):</strong>

- El nombre de la etiqueta personalizada debe contener un guion (<code>-</code>). Por ejemplo: <code>&lt;wc-icon&gt;</code> cumple con esta regla. Esto evita conflictos con elementos HTML nativos.
- Puedes añadir tantos atributos como necesites: <code>&lt;wc-icon typeicon="twitter" size="large"&gt;&lt;/wc-icon&gt;</code>.

<strong>Llamada al Web Component como módulo:</strong>

En el HTML donde se use el componente, debemos importar el archivo del componente como un módulo ES6:

```
<script type="module" src="js/wcicon.js"></script>
```

<strong>Estructura básica en JavaScript:</strong>

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

<em>Nota:</em> No es obligatorio usar JS Modules con Web Components, pero es una buena práctica ya que facilita la organización y escalabilidad del proyecto.

### 3. Acciones internas propias del Web Component

Dentro del constructor y los métodos nativos, gestionamos las propiedades y el ciclo de vida del componente.

- <strong>Constructor:</strong> Aquí inicializamos propiedades y creamos el Shadow DOM si lo necesitamos. Por ejemplo: <code>constructor() { super(); this.typeicon = "default"; }</code>
- <strong>Gestionar y manejar atributos:</strong> Atributos como <code>typeicon</code> pueden cambiar. Cuando esto sucede, <code>attributeChangedCallback</code> nos permite responder ante esos cambios. Ejemplo: <code>attributeChangedCallback(attr, oldValue, newValue) { if (attr === "typeicon") { this.typeicon = newValue; this.render(); } }</code>
- <strong>connectedCallback():</strong> Se ejecuta cuando el elemento se agrega al DOM.
- <strong>disconnectedCallback():</strong> Se ejecuta cuando el elemento se remueve del DOM.
- <strong>observedAttributes():</strong> Es un getter estático que retorna la lista de atributos que queremos observar. En nuestro caso: <code>static get observedAttributes() { return ["typeicon"]; }</code>

Estas funciones nos permiten construir componentes dinámicos, reaccionar a cambios y mantener el código ordenado y coherente.

### ¿Qué es el Shadow DOM?

El <em>Shadow DOM</em> es una parte fundamental de los Web Components. Nos permite encapsular el marcado, el estilo y la funcionalidad de un componente, de modo que el CSS y el JavaScript del entorno donde se utiliza no afecten el interior del componente, y viceversa.

- <strong>Definición:</strong><br>El Shadow DOM crea un árbol de DOM encapsulado asociado a un elemento, que no se ve afectado por el estilo o el script global de la página. Esto garantiza que el componente sea verdaderamente modular.
- <strong>¿Para qué sirve?:</strong><br>Sirve para evitar conflictos de nombres de clases, estilos CSS globales que sobrescriban la apariencia interna del componente, o comportamientos no deseados. Esto hace que el componente sea más fácil de mantener y reutilizar.
- <strong>¿Cómo implementarlo?:</strong><br>Dentro del constructor del Custom Element, podemos adjuntar un shadow root al elemento: <code>constructor() { super(); // Creamos un shadow root en modo 'open' this.attachShadow({ mode: 'open' }); this.shadowRoot.innerHTML = \` &lt;style&gt; .icon { color: #1da1f2; /* Ejemplo: color Twitter */ font-size: 24px; } &lt;/style&gt; &lt;span class="icon"&gt;[icon]&lt;/span&gt; \`; }</code>

Con esto, la <code>&lt;span class="icon"&gt;</code> y sus estilos se encapsulan dentro del shadow root, evitando conflictos con el resto de la página.

### 4. LitElement: La manera más sencilla de crear Web Components sin morir en el intento

Aunque es completamente posible crear Web Components en vanilla JS, la comunidad ha desarrollado librerías para simplificar el proceso. Una de las más populares es <a href="https://lit.dev/docs/getting-started/"><strong>LitElement</strong> </a>(de la familia de Lit), que permite:

- Definir componentes con menos código «boilerplate».
- Utilizar plantillas basadas en <code>\`<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals">template literals</a></code>\` para generar el DOM.
- Reaccionar de forma automática a cambios en las propiedades del componente.
- Integrar el shadow DOM sin fricción.

<strong>Definición:</strong> LitElement es una librería ligera y moderna para crear componentes web aprovechando las últimas características de JavaScript. Ayuda a mantener el código limpio, fácil de leer y muy mantenible.

<strong>¿Para qué sirve?:</strong><br>LitElement hace que crear un Custom Element sea más ágil, con menos código repetitivo, y facilita la gestión de propiedades reactivas, estilos y funciones de ciclo de vida del componente.

<strong>¿Cómo implementarlo?:</strong><br>Ejemplo básico con LitElement:

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

Con LitElement, el código es más conciso y declarativo, lo que agiliza el desarrollo de componentes cada vez más complejos. El único inconveniente es que últimamente Google (la creadora de la librería) la tiene un poco olvidada. Sin embargo, es 100 % recomendable su uso, aunque si vas a crear un proyecto grande, qué mejor que crear tus propias herramientas basadas en los estándares con JS de toda la vida 😀

## Conclusión

Los Web Components representan un paso firme hacia la estandarización y modularización del desarrollo frontend. Nos permiten crear elementos totalmente reutilizables, integrables en cualquier proyecto y libres de dependencias con frameworks específicos. Ya sea usando vanilla JS o librerías como LitElement, la curva de aprendizaje se ve recompensada por la claridad, mantenibilidad y escalabilidad que estos componentes aportan a nuestras aplicaciones web.
