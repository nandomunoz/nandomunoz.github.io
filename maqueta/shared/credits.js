// Trama · the credits page (/maqueta/creditos/), in Spanish and English: who made
// what this site is built from. Plain and short. It says no licence for the
// site's own text and code yet: that is an open decision (plan, L4), and a page
// must not claim what has not been decided. When it is, add its section here.
//
// Blocks: { h } a heading · { p } a paragraph (inline HTML) · { ul: [] } a list
//         (inline HTML) · { covers: true } the credited featured images, one line
//         per article (built from blog.json, so a new credit shows up by itself)
import { lang } from './content.js';

export const UPDATED = '2026-11-15';

export const CREDITS = {
  es: {
    title: 'Créditos',
    deck: 'De quién son las tipografías, las imágenes y el código que hay detrás de esta web.',
    updated: 'Actualizado el',
    blocks: [
      { h: 'Tipografías' },
      { p: 'Las tres son de código abierto, con la licencia SIL Open Font License 1.1.' },
      { ul: ['<strong>Archivo</strong>, para los textos y los titulares.', '<strong>Chakra Petch</strong>, para las etiquetas y los botones.', '<strong>Doto</strong>, la tipografía hecha de puntos.'] },
      { h: 'Código' },
      { p: 'El aviso de cookies es de <a href="https://luzds.com/" rel="noopener">LUZ</a>, un sistema de diseño de la misma persona que hizo esta web. Se usa con su licencia MIT.' },
      { h: 'Imágenes de los artículos' },
      { p: 'La imagen destacada de cada artículo, con su crédito. Las imágenes que van dentro de un artículo llevan el suyo en su pie de foto.' },
      { covers: true },
      { h: 'Imágenes de los proyectos' },
      { p: 'Son capturas de la web de cada proyecto, dibujadas con puntos. La de Toolbar AEM es una ilustración de su repositorio.' }
    ]
  },
  en: {
    title: 'Credits',
    deck: 'Whose typefaces, images and code are behind this site.',
    updated: 'Updated on',
    blocks: [
      { h: 'Typefaces' },
      { p: 'All three are open source, under the SIL Open Font License 1.1.' },
      { ul: ['<strong>Archivo</strong>, for text and headlines.', '<strong>Chakra Petch</strong>, for labels and buttons.', '<strong>Doto</strong>, the typeface made of dots.'] },
      { h: 'Code' },
      { p: 'The cookie notice is from <a href="https://luzds.com/" rel="noopener">LUZ</a>, a design system by the person who made this site. It is used under its MIT licence.' },
      { h: 'Images of the posts' },
      { p: 'The featured image of each post, with its credit. Images inside a post carry theirs in their caption.' },
      { covers: true },
      { h: 'Images of the projects' },
      { p: 'Screenshots of each project’s own site, drawn in dots. Toolbar AEM’s is an illustration from its repository.' }
    ]
  }
}[lang];
