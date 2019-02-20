import { LitElement, html} from 'lit-element';
import template from './template';
import css from './style.pcss';

const fCarouselSlide = class FCarouselSlide extends LitElement {
  static get properties() {
    return {
    };
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <style>
        ${css}
      </style>
      ${template(this)}
    `;
  }

}

export default fCarouselSlide;

customElements.define('f-carousel-slide', fCarouselSlide);
