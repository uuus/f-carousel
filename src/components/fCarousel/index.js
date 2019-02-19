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
    this.nextFlag = false;
    this.prevFlag = false;
    this.isTouchDevice = 'ontouchstart' in window;
    this.swipeStart    = this.isTouchDevice ? 'touchstart' : 'mousedown';
    this.swipeMove     = this.isTouchDevice ? 'touchmove'  : 'mousemove';
    this.swipeEnd      = this.isTouchDevice ? 'touchend'   : 'mouseup';
  }

  attributeChangedCallback(name, oldval, newval) {
    console.log('attribute change: ', name, newval);
    super.attributeChangedCallback(name, oldval, newval);
  }

  async firstUpdated () {
    await this.updateComplete;
    this.translateValue = 100 + (100 - parseInt(this.width)); // %
    this.slideElements = [...this.children];
    this.slidesWrap = this.shadowRoot.querySelector('.slides');
    this.setSelected(this.slideElements[0]);
    this.cloneLastSlide();
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

  cloneLastSlide() {
    const lastNode = this.slideElements[this.slideElements.length - 1];
    const cloneLastSlide  = lastNode.cloneNode(true);
    this.addSlideFirst(cloneLastSlide);
    this.validNextSlide(this.slideElements[1]);
    lastNode.parentNode.removeChild(lastNode);
    this.slideElements = [...this.children];
    this.index = 1;
  }

  addSlideFirst (node) {
    const translateValue = 100 + (100 - parseInt(this.width));
    this.slideElements[0].insertAdjacentElement('beforebegin', node);
    node.style.display = 'inline-block';
    node.style.transition = 'transform 300ms ease';
    node.style.transform = `translate3d(-${translateValue}%, 0, 0)`;
  }

  setSelected (target) {
    target.setAttribute('selected', '');
    this.requestUpdate();
  }

  removeSelected (target) {
    target.removeAttribute('selected');
    this.requestUpdate();
  }

  nextButtonHandle () {
    this.selectedElement = this.slideElements[this.index];
    this.nextSlide();
  }

  prevButtonHandle () {
    this.selectedElement = this.slideElements[this.index];
    this.prevSlide();
  }

  nextSlide() {
    this.nextFlag = true;
    const resetNode = this.getResetNode();
    this.resetStyle(resetNode);
    this.nextNode = this.getNextNode();
    this.afterNextNode = this.getAfterNextNode();
    this.currentNextSlideAnim(this.selectedElement);
    this.slideInSlide(this.nextNode);
    this.removeSelected(this.selectedElement);
    this.setSelected(this.nextNode);
    this.resetInitial();
    this.slidesWrap.addEventListener('transitionend', () => this.validNextSlide(this.afterNextNode));
    this.index = (this.index < this.slideElements.length - 1) ? this.index + 1 : 0;
  }

  prevSlide () {
    this.prevFlag = true;
    const resetNode = this.getResetNode();
    this.resetStyle(resetNode);
    this.prevNode = this.getPrevNode();
    this.beforePrevNode = this.getBeforePrevNode();
    this.currentPrevSlideAnim(this.selectedElement);
    this.slideInSlide(this.prevNode);
    this.removeSelected(this.selectedElement);
    this.setSelected(this.prevNode);
    this.resetInitial();
    this.slidesWrap.addEventListener('transitionend', () => this.validPrevSlide(this.beforePrevNode));
    this.index = (this.index > 0) ? this.index - 1 : this.slideElements.length - 1;
  }

  validPrevSlide (node) {
    // 一つ前のスライドを表示する
    node.style.display = 'inline-block';
    node.style.transition = 'transform 300ms ease';
    node.style.transform = `translate3d(-${this.translateValue}%, 0, 0)`;
  }

  validNextSlide (node) {
    // 一つ後のスライドを表示する
    node.style.display = 'inline-block';
    node.style.transition = 'transform 300ms ease';
    node.style.transform = `translate3d(${this.translateValue}%, 0, 0)`;
  }

  slideInSlide (node) {
    // 出現させたスライドを真ん中へ
    node.style.display = 'inline-block';
    node.style.transition = 'transform 300ms ease';
    node.style.transform = `translate3d(0, 0, 0)`;
  }

  getNextNode () {
    let nextNode = this.slideElements[this.index + 1];
    nextNode = nextNode ? nextNode : this.slideElements[0];
    return nextNode;
  }

  getAfterNextNode () {
    let afterNextNode = this.slideElements[this.index + 2];
    if (!afterNextNode && this.index === this.slideElements.length - 1) {
      afterNextNode = this.slideElements[1];
    } else if (!afterNextNode && this.index === this.slideElements.length - 2) {
      afterNextNode = this.slideElements[0];
    }
    return afterNextNode;
  }

  getPrevNode () {
    let prevNode = this.slideElements[this.index - 1];
    prevNode = prevNode ? prevNode : this.slideElements[this.slideElements.length - 1];
    return prevNode;
  }

  getBeforePrevNode () {
    let prevPrevNode = this.slideElements[this.index - 2];
    if (!prevPrevNode && this.index === 0) {
      prevPrevNode = this.slideElements[this.slideElements.length - 2];
    } else if (!prevPrevNode && this.index === 1) {
      prevPrevNode = this.slideElements[this.slideElements.length - 1];
    }
    return prevPrevNode;
  }

  currentNextSlideAnim (target) {
    // 現在のスライドを次に送る
    target.style.display = 'inline-block';
    target.style.transition = 'transform 300ms ease';
    target.style.transform = `translate3d(-${this.translateValue}%, 0, 0)`;
  }

  currentPrevSlideAnim (target) {
    // 現在のスライドを前に送る
    target.style.display = 'inline-block';
    target.style.transition = 'transform 300ms ease';
    target.style.transform = `translate3d(${this.translateValue }%, 0, 0)`;
  }

  getResetNode (){
    let resetNode = null;
    if (this.nextFlag) {
      resetNode = this.slideElements[this.index - 1];
      resetNode = resetNode  ? resetNode : this.slideElements[this.slideElements.length - 1];
    }
    if (this.prevFlag) {
      resetNode = this.slideElements[this.index + 1];
      resetNode = resetNode  ? resetNode : this.slideElements[0];
    }
    return resetNode;
  }

  resetStyle (target) {
    target.style = '';
  }

  resetInitial () {
    this.slidesWrap.style.transition = `transform 300ms ease`;
    this.slidesWrap.style.transform = `translate3d(0, 0, 0)`;
  }

  onSwipeStart (e) {
    if (this.isTouchDevice) {
      if (e.touches.length > 1 || e.scale && e.scale !== 1) {
        return;
      }
    }
    const offset = {
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
    this.swipeMoving = true;
    this.selectedElement = this.slideElements[this.index];
    const offset = {
      x: this.isTouchDevice ? e.touches[0].pageX : e.pageX,
      y: this.isTouchDevice ? e.touches[0].pageY : e.pageY
    };
    this.moveDistance = {
      x: offset.x - this.startPoint.x,
      y: offset.y - this.startPoint.y
    };
    this.slidesWrap.style.transition = 'none';
    this.slidesWrap.style.transform = `translate3d(${this.moveDistance.x}px, 0, 0)`;
  }

  onSwipeEnd () {
    if (!this.swipeMoving) {
      return;
    }
    if (Math.abs(this.moveDistance.x) > this.clientWidth / 2) {
      if (this.moveDistance.x < 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    } else {
      this.resetInitial();
    }
    this.removeEventListener(this.swipeMove, this.onSwipeMove);
    this.removeEventListener(this.swipeEnd, this.onSwipeEnd);
    this.swipeMoving = false;
    this.nextFlag = false;
    this.prevFlag = false;
  }
}

export default fCarousel;

customElements.define('f-carousel', fCarousel);
