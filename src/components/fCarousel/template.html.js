import { html } from 'lit-element';

export default self => html`
    <div class="slides">
      <slot></slot>
    </div>
    <div class="navigators">
      <button id="prevBtn" class="controller" @click="${self.prevButtonHandle}"><</button>
      <button id="nextBtn" class="controller" @click="${self.nextButtonHandle}">></button>
    </div>
    <div class="indicator">
    </div>
  `;
