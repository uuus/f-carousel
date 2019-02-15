import { LitElement, html} from 'lit-element';
import './components/fCarousel';

const litApp =  class LitApp extends LitElement {
  static get properties() {
    return {};
  }

  render() {
    return html`
      <div>
        <f-carousel></f-calousel>
      </div>
    `;
  }
}

export default litApp;

customElements.define('lit-app', litApp);
