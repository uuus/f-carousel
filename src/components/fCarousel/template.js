import { html } from 'lit-element';

export default self => html`
    <slot></slot>
    <button id="prevBtn" @click="${self.previous}" on-keyup="keyboardAdvancePrevious" tabindex="0">❮</button>
    <button id="nextBtn" @click="${self.next}" on-keyup="keyboardAdvanceNext" tabindex="0">❯</button>
  `;
