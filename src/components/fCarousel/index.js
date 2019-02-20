import { LitElement, html} from 'lit-element';
import template from './template.html.js';
import css from './style.pcss';

const fCarousel = class FCarousel extends LitElement {

  static get properties() {
    return {
      width: { type: String, reflect: true },
      autoplay: { type: Boolean, refrect: true},
      interval: { type: Number, refrect: true},
      navigator: { type: Boolean, refrect: true},
      indicator: { type: Boolean, reflect: true}
    };
  }

  constructor() {
    super();
    this.width = '100%';
    this.autoplay = false;
    this.interval = 3000;
    this.navigator = false;
    this.indicator = false;
    this.autoPlayInterval = null;
    this.index = 0;
    this.slideElements = [];
    this.selectedElement = null;
    this.slidesWrap = null;
    this.prevNode = null;
    this.nextNode = null;
    this.indicatorBullets = [];
    this.swipeMoving = false;
    this.nextFlag = false;
    this.prevFlag = false;
    this.isTouchDevice = 'ontouchstart' in window;
    this.swipeStart = this.isTouchDevice ? 'touchstart' : 'mousedown';
    this.swipeMove = this.isTouchDevice ? 'touchmove'  : 'mousemove';
    this.swipeEnd = this.isTouchDevice ? 'touchend'   : 'mouseup';
  }

  attributeChangedCallback(name, oldval, newval) {
    console.log('attribute change: ', name, newval);
    super.attributeChangedCallback(name, oldval, newval);
  }

  firstUpdated () {
    this.updateComplete;
    this.translateValue = 100 + (100 - parseInt(this.width)); // %
    this.slideElements = [...this.children];
    this.slidesWrap = this.shadowRoot.querySelector('.slides');
    this.setSelected(this.slideElements[0]);
    this.cloneLastSlide();
    this.autoPlay();
    this.createNavigator();
    this.indicatorBullets = this.createIndicator();
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
      ${css}
      ::slotted(f-carousel-slide) {
        position: absolute;
        width: ${self.width};
        top: 0;
        right: 0;
        left: 0;
        margin: 0 auto;
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

  autoPlay () {
    if (!this.autoplay) {
      return
    }
    this.autoPlayInterval = setInterval(() => this.nextSlide(), this.interval);
  }

  createNavigator () {
    if (!this.navigator) {
      return
    }
    this.shadowRoot.querySelector('.navigators').style.display = 'block';
    this.requestUpdate();
  }

  createIndicator () {
    if (!this.indicator) {
      return
    }
    const indicatorNode = this.shadowRoot.querySelector('.indicator');
    const bullets = [];
    for (let i = 0; i < this.slideElements.length; i++) {
      const bulletElement = document.createElement('button');
      bulletElement.classList.add('bullet');
      if (i === 0) {
        bulletElement.setAttribute('selected', '');
      }
      indicatorNode.appendChild(bulletElement);
      bullets.push(bulletElement);
    }
    indicatorNode.style.display = 'block';
    return [...bullets];
  }

  nextButtonHandle () {
    clearInterval(this.autoPlayInterval);
    this.nextSlide()
      .then(() => {
        this.nextFlag = false;
        this.prevFlag = false;
        this.autoPlay();
      });
  }

  prevButtonHandle () {
    clearInterval(this.autoPlayInterval);
    this.prevSlide()
      .then(() => {
        this.nextFlag = false;
        this.prevFlag = false;
        this.autoPlay();
      });
  }

  nextSlide() {
    return new Promise(resolve => {
      this.nextFlag = true;
      this.selectedElement = this.slideElements[this.index];
      const resetNodes = this.getResetNodes();
      this.resetStyle(resetNodes);
      this.nextNode = this.getNextNode();
      this.afterNextNode = this.getAfterNextNode();
      this.currentNextSlideAnim(this.selectedElement);
      this.slideInSlide(this.nextNode);
      this.removeSelected(this.selectedElement);
      this.setSelected(this.nextNode);
      this.resetInitial();
      this.slidesWrap.addEventListener('transitionend', () => this.validNextSlide(this.afterNextNode));
      this.indicatorControll();
      this.index = (this.index < this.slideElements.length - 1) ? this.index + 1 : 0;
      resolve();
    });
  }

  prevSlide () {
    return new Promise(resolve => {
      this.prevFlag = true;
      this.selectedElement = this.slideElements[this.index];
      const resetNodes = this.getResetNodes();
      this.resetStyle(resetNodes);
      this.prevNode = this.getPrevNode();
      this.beforePrevNode = this.getBeforePrevNode();
      this.currentPrevSlideAnim(this.selectedElement);
      this.slideInSlide(this.prevNode);
      this.removeSelected(this.selectedElement);
      this.setSelected(this.prevNode);
      this.resetInitial();
      this.slidesWrap.addEventListener('transitionend', () => this.validPrevSlide(this.beforePrevNode));
      this.indicatorControll();
      this.index = (this.index > 0) ? this.index - 1 : this.slideElements.length - 1;
      resolve();
    });
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

  getResetNodes (){
    const resetNodes = [];
    this.slideElements.forEach(e => {
      if (e !== this.slideElements[this.index]) {
        resetNodes.push(e);
      }
    });
    // if (this.nextFlag) {
    //   resetNode = this.slideElements[this.index - 1];
    //   resetNode = resetNode  ? resetNode : this.slideElements[this.slideElements.length - 1];
    // }
    // if (this.prevFlag) {
    //   resetNode = this.slideElements[this.index + 1];
    //   resetNode = resetNode  ? resetNode : this.slideElements[0];
    // }
    return resetNodes;
  }

  resetStyle (targets) {
    targets.forEach(e => {
      e.style = '';
    });
  }

  resetInitial () {
    this.slidesWrap.style.transition = `transform 300ms ease`;
    this.slidesWrap.style.transform = `translate3d(0, 0, 0)`;
  }

  indicatorControll () {
    let removedBullet = null;
    let selectedBullet = null;
    if (this.nextFlag) {
      removedBullet = this.indicatorBullets[this.index - 1];
      removedBullet = removedBullet ? removedBullet : this.indicatorBullets[this.indicatorBullets.length - 1];
      selectedBullet = this.indicatorBullets[this.index];
    }
    if (this.prevFlag) {
      removedBullet = this.indicatorBullets[this.index - 1];
      removedBullet = removedBullet ? removedBullet : this.indicatorBullets[this.indicatorBullets.length - 1];
      selectedBullet = this.indicatorBullets[this.index - 2];
      if (!selectedBullet && this.index === 1) {
        selectedBullet = this.indicatorBullets[this.indicatorBullets.length - 1];
      } else if (!selectedBullet && this.index === 0) {
        selectedBullet = this.indicatorBullets[this.indicatorBullets.length - 2];
      }
    }
    this.removeSelected(removedBullet);
    this.setSelected(selectedBullet);
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
    clearInterval(this.autoPlayInterval);
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
        this.nextSlide()
          .then(() => this.autoPlay());
      } else {
        this.prevSlide()
          .then(() => this.autoPlay());
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
