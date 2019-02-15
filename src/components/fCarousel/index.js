import { LitElement, html} from 'lit-element';
import template from './template';
import '../fCarouselSlide';

const fCarousel = class FCarousel extends LitElement {
  static get properties() {
    return {
      selected: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.slideElement = [...this.children];
    this.setSelected(this.slideElement[0]);
    this.index = 0;
  }

  setSelected (target) {
    target.setAttribute('selected', '');
    this.requestUpdate();
  }

  removeSelected (target) {
    target.removeAttribute('selected');
    this.requestUpdate();
  }

  attributeChangedCallback(name, oldval, newval) {
    console.log('attribute change: ', name, newval);
    super.attributeChangedCallback(name, oldval, newval);
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    });
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          overflow:hidden;
          height: 350px;
        }
        ::slotted(f-carousel-slide) {
          position:absolute;
          width:100%;
          left:0;
          top:0;  
        }
        ::slotted(f-carousel-slide:not([selected])) {
          display: none;
        }
        button {
          position: absolute;
          top: calc(50% - 20px);
          padding: 0;
          line-height: 40px;
          border: none;
          background: none;
          color: #DDD;
          font-size: 40px;
          font-weight: bold;
          cursor: pointer;
          opacity: 0.7;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        button:hover,
        button:focus {
          opacity: 1;
        }
        #prevBtn {
          left: 12px;
        }
        #nextBtn {
          right: 12px;
        }
        button[disabled] {
          opacity: 0.4;
          cursor: default;
        }
      </style>
      ${template(this)}
    `;
  }

  next () {
    let index = this.index
    if (index === 0) {
      this.removeSelected(this.slideElement[index]);
      this.setSelected(this.slideElement[index + 1]);
      this.resetStyle(this.slideElement[this.slideElement.length - 1]);
      this.nextSlideAnimation(this.slideElement, index);
      this.index++;
    } else if (index !== 0 && index < this.slideElement.length - 1) {
      this.removeSelected(this.slideElement[index]);
      this.setSelected(this.slideElement[index + 1]);
      this.resetStyle(this.slideElement[index - 1]);
      this.nextSlideAnimation(this.slideElement, index);
      this.index++;
    } else {
      this.removeSelected(this.slideElement[index]);
      this.setSelected(this.slideElement[0]);
      this.resetStyle(this.slideElement[index - 1]);
      this.nextSlideAnimationLast(this.slideElement, index);
      this.index = 0;
    }
  }

  previous () {
    let index = this.index
    if (index === 0) {
      this.removeSelected(this.slideElement[index]);
      this.setSelected(this.slideElement[this.slideElement.length - 1]);
      this.resetStyle(this.slideElement[index + 1]);
      this.prevSlideAnimationFirst(this.slideElement, index);
      this.index = this.slideElement.length - 1;
    } else if (index !== this.slideElement.length - 1 && index > 0) {
      this.removeSelected(this.slideElement[index]);
      this.setSelected(this.slideElement[index - 1]);
      this.resetStyle(this.slideElement[index + 1]);
      this.prevSlideAnimation(this.slideElement, index);
      this.index--;
    } else {
      this.removeSelected(this.slideElement[index]);
      this.setSelected(this.slideElement[index - 1]);
      this.resetStyle(this.slideElement[0]);
      this.prevSlideAnimation(this.slideElement, index);
      this.index--;
    }
  }

  nextSlideAnimation (target, index) {
    this.nextAnimationStyle(target[index + 1]);
    this.currentNextAnimationStyle(target[index]);
    setTimeout(() => {
      target[index + 1].style.transform = 'translate3d(0, 0, 0)';
    }, 10);
  }

  nextSlideAnimationLast (target, index) {
    this.nextAnimationStyle(target[0]);
    this.currentNextAnimationStyle(target[index]);
    setTimeout(() => {
      target[0].style.transform = 'translate3d(0, 0, 0)';
    }, 10);
  }

  nextAnimationStyle (target) {
    target.style.display = 'inline-block';
    target.style.transition = 'transform 500ms ease';
    target.style.transform = 'translate3d(100%, 0, 0)';
  }

  currentNextAnimationStyle (target) {
    target.style.display = 'inline-block';
    target.style.transition = 'transform 500ms ease';
    target.style.transform = 'translate3d(-100%, 0, 0)';
  }

  prevSlideAnimation (target, index) {
    this.prevAnimationStyle(target[index - 1]);
    this.currentPrevAnimationStyle(target[index]);
    setTimeout(() => {
      target[index - 1].style.transform = 'translate3d(0, 0, 0)';
    }, 10);
  }

  prevSlideAnimationFirst (target, index) {
    this.prevAnimationStyle(target[target.length - 1]);
    this.currentPrevAnimationStyle(target[index]);
    setTimeout(() => {
      target[target.length - 1].style.transform = 'translate3d(0, 0, 0)';
    }, 10);
  }

  prevAnimationStyle (target) {
    target.style.display = 'inline-block';
    target.style.transition = 'transform 500ms ease';
    target.style.transform = 'translate3d(-100%, 0, 0)';
  }

  currentPrevAnimationStyle (target) {
    target.style.display = 'inline-block';
    target.style.transition = 'transform 500ms ease';
    target.style.transform = 'translate3d(100%, 0, 0)';
  }

  resetStyle (target) {
    target.style = '';
  }

}

export default fCarousel;

customElements.define('f-carousel', fCarousel);
