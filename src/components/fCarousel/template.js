import { html } from 'lit-element';

export default self => html`
    <div class="slides">
      <slot></slot>
    </div>
    <button id="prevBtn" @click="${self.prevButtonHandle}" tabindex="0">❮</button>
    <button id="nextBtn" @click="${self.nextButtonHandle}" tabindex="0">❯</button>
  `;
