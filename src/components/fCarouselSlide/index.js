import { LitElement, html} from 'lit-element';

const fCarouselSlide = class FCarouselSlide extends LitElement {
  static get properties() {
    return {
    };
  }

  constructor() {
    super();
    this.test = 'テストだよーん'
  }

  render() {
    return html`
      <style>
        :host {
          display: none;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <slot></slot>
    `;
  }

}

export default fCarouselSlide;

customElements.define('f-carousel-slide', fCarouselSlide);
