import { LitElement, html} from 'lit-element';
import './components/fCarousel';

const litApp =  class LitApp extends LitElement {
  static get properties() {
    return {};
  }

  render() {
    return html`
    <style>
    f-carousel-slide h3{
      background: #3498db;
      color: #fff;
      font-size: 36px;
      line-height: 100px;
      margin: 1px;
      padding: 2%;
      position: relative;
      text-align: center;
    }
    </style>
    <f-carousel width="100%">
      <f-carousel-slide>
        <h3>
          1
        </h3>
      </f-carousel-slide>
      <f-carousel-slide>
        <h3>
          2
        </h3>
      </f-carousel-slide>
      <f-carousel-slide>
        <h3>
          3
        </h3>
      </f-carousel-slide>
      <f-carousel-slide>
        <h3>
          4
        </h3>
      </f-carousel-slide>
      <f-carousel-slide>
        <h3>
          5
        </h3>
      </f-carousel-slide>
      <f-carousel-slide data-index="3">
        <img src="https://www.pakutaso.com/shared/img/thumb/pakutaso-4860_TP_V.jpg" alt="responsive image" width="100%">
      </f-carousel-slide>
    </f-carousel>
    `;
  }
}

export default litApp;

customElements.define('lit-app', litApp);
