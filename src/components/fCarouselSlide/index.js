import { LitElement, html} from 'lit-element';
import template from './template';

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
        :host {
          display: block;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      ${template(this)}
    `;
  }

}

export default fCarouselSlide;

customElements.define('f-carousel-slide', fCarouselSlide);
