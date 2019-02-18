import { html } from 'lit-element';

export default self => html`
    <div class="slides">
      <slot></slot>
    </div>
    <button id="prevBtn" @click="${self.previous}" tabindex="0">❮</button>
    <button id="nextBtn" @click="${self.next}" tabindex="0">❯</button>
  `;
