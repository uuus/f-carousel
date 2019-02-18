import { LitElement, html} from 'lit-element';
import template from './template';
import '../fCarouselSlide';

const fCarousel = class FCarousel extends LitElement {
  static get properties() {
    return {
      width: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.index = 0;
    this.slideElements = [];
    this.selectedElement = null;
    this.slidesWrap = null;
    this.prevNode = null;
    this.nextNode = null;
    this.width = '100%';
    this.swipeMoving = false;
    this.isTouchDevice = 'ontouchstart' in window;
    this.swipeStart    = this.isTouchDevice ? 'touchstart' : 'mousedown';
    this.swipeMove     = this.isTouchDevice ? 'touchmove'  : 'mousemove';
    this.swipeEnd      = this.isTouchDevice ? 'touchend'   : 'mouseup';
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

  async firstUpdated () {
    await this.updateComplete;
    this.slideElements = [...this.children];
    this.slidesWrap = this.shadowRoot.querySelector('.slides');
    this.setSelected(this.slideElements[0]);
    this.addEventListener(this.swipeStart, this.onSwipeStart);
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
          position: absolute;
          width: ${this.width};
          top: 0;
          right: 0;
          left: 0;
          margin: 0 auto;
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
    this.slidesWrap.style.transform = `translate3d(0, 0, 0)`;
    let index = this.index
    if (index === 0) {
      this.removeSelected(this.slideElements[index]);
      this.setSelected(this.slideElements[index + 1]);
      this.resetStyle(this.slideElements[this.slideElements.length - 1]);
      this.nextSlideAnimation(this.slideElements, index);
      this.index++;
    } else if (index !== 0 && index < this.slideElements.length - 1) {
      this.removeSelected(this.slideElements[index]);
      this.setSelected(this.slideElements[index + 1]);
      this.resetStyle(this.slideElements[index - 1]);
      this.nextSlideAnimation(this.slideElements, index);
      this.index++;
    } else {
      this.removeSelected(this.slideElements[index]);
      this.setSelected(this.slideElements[0]);
      this.resetStyle(this.slideElements[index - 1]);
      this.nextSlideAnimationLast(this.slideElements, index);
      this.index = 0;
    }
  }

  previous () {
    this.slidesWrap.style.transform = `translate3d(0, 0, 0)`;
    let index = this.index
    if (index === 0) {
      this.removeSelected(this.slideElements[index]);
      this.setSelected(this.slideElements[this.slideElements.length - 1]);
      this.resetStyle(this.slideElements[index + 1]);
      this.prevSlideAnimationFirst(this.slideElements, index);
      this.index = this.slideElements.length - 1;
    } else if (index !== this.slideElements.length - 1 && index > 0) {
      this.removeSelected(this.slideElements[index]);
      this.setSelected(this.slideElements[index - 1]);
      this.resetStyle(this.slideElements[index + 1]);
      this.prevSlideAnimation(this.slideElements, index);
      this.index--;
    } else {
      this.removeSelected(this.slideElements[index]);
      this.setSelected(this.slideElements[index - 1]);
      this.resetStyle(this.slideElements[0]);
      this.prevSlideAnimation(this.slideElements, index);
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
    const translateValue = 100 + (100 - parseInt(this.width));
    target.style.display = 'inline-block';
    target.style.transition = 'transform 500ms ease';
    target.style.transform = `translate3d(${translateValue}%, 0, 0)`;
  }

  currentNextAnimationStyle (target) {
    const translateValue = 100 + (100 - parseInt(this.width));
    target.style.display = 'inline-block';
    target.style.transition = 'transform 600ms ease 10ms';
    target.style.transform = `translate3d(-${translateValue}%, 0, 0)`;
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
    const translateValue = 100 + (100 - parseInt(this.width));
    target.style.display = 'inline-block';
    target.style.transition = 'transform 500ms ease';
    target.style.transform = `translate3d(-${translateValue}%, 0, 0)`;
  }

  currentPrevAnimationStyle (target) {
    const translateValue = 100 + (100 - parseInt(this.width));
    target.style.display = 'inline-block';
    target.style.transition = 'transform 500ms ease 10ms';
    target.style.transform = `translate3d(${translateValue}%, 0, 0)`;
  }

  resetStyle (target) {
    target.style = '';
  }

  onSwipeStart (e) {
    if (this.isTouchDevice) {
      if (e.touches.length > 1 || e.scale && e.scale !== 1) {
        return;
      }
    }
    let offset = {
      x: this.isTouchDevice ? e.touches[0].pageX : e.pageX,
      y: this.isTouchDevice ? e.touches[0].pageY : e.pageY
    };
    this.startPoint = {
      x: offset.x,
      y: offset.y
    };
    this.addEventListener(this.swipeMove, this.onSwipeMove);
    this.addEventListener(this.swipeEnd, this.onSwipeEnd);
  }

  onSwipeMove (e) {
    // this.currentIndex
    this.swipeMoving = true;
    this.selectedElement = this.querySelector('f-carousel-slide[selected]');
    this.selectedElement.style = ``;
    let offset = {
      x: this.isTouchDevice ? e.touches[0].pageX : e.pageX,
      y: this.isTouchDevice ? e.touches[0].pageY : e.pageY
    };
    this.moveDistance = {
      x: offset.x - this.startPoint.x,
      y: offset.y - this.startPoint.y
    };

    if (this.moveDistance.x > 0) {
      this.prevNode = this.selectedElement.previousElementSibling;
      this.prevNode = this.prevNode ? this.prevNode : this.slideElements[this.slideElements.length - 1];
      this.prevAnimationStyle(this.prevNode);
    } else {
      this.nextNode = this.selectedElement.nextElementSibling;
      this.nextNode = this.nextNode ? this.nextNode : this.slideElements[0];
      this.nextAnimationStyle(this.nextNode);
    }
    this.slidesWrap.style.transform = `translate3d(${this.moveDistance.x}px, 0, 0)`;
  }

  onSwipeEnd () {
    // this.currentIndex
    if (!this.swipeMoving) {
      return;
    }
    if (Math.abs(this.moveDistance.x) > this.clientWidth / 2) {
      if (this.moveDistance.x < 0) {
        this.moveDistance.x = this.moveDistance.x * (-1);
        this.nextNode.style.transform = `translate3d(${this.moveDistance.x}px, 0, 0)`;
        this.removeSelected(this.selectedElement);
        this.setSelected(this.nextNode);
        this.index = (this.index < this.slideElements.length) ? this.index + 1 : 0;
        this.currentNextAnimationStyle(this.selectedElement);
      } else {
        this.moveDistance.x = this.moveDistance.x * (-1);
        this.prevNode.style.transform = `translate3d(${this.moveDistance.x}px, 0, 0)`;
        this.removeSelected(this.selectedElement);
        this.setSelected(this.prevNode);
        this.index = (this.index > 0) ? this.index - 1 : this.slideElements.length - 1;
        this.currentPrevAnimationStyle(this.selectedElement);
      }
    } else {
      this.slidesWrap.style.transform = `translate3d(0, 0, 0)`;
    }
    this.removeEventListener(this.swipeMove, this.onSwipeMove);
    this.removeEventListener(this.swipeEnd, this.onSwipeEnd);
    this.swipeMoving = false;
  }
}

export default fCarousel;

customElements.define('f-carousel', fCarousel);
