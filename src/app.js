import { LitElement, html} from 'lit-element';
import './components/fCarousel';

const litApp =  class LitApp extends LitElement {
  static get properties() {
    return {};
  }

  constructor() {
    super();
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
    <f-carousel width="100%" interval="2000" navigator indicator>
      <!--options
       * width="{number}%"
       * autoplay
       * interval="number"
       * navigator
       * indicator -->
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
      <f-carousel-slide>
        <h3>
          6
        </h3>
      </f-carousel-slide>
      <f-carousel-slide>
        <h3>
          7
        </h3>
      </f-carousel-slide>
      <f-carousel-slide>
        <h3>
          8
        </h3>
      </f-carousel-slide>
    </f-carousel>
    `;
  }
}

export default litApp;

customElements.define('lit-app', litApp);
