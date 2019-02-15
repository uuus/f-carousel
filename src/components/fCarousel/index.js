import { LitElement, html} from 'lit-element';
import template from './template';
import '../fCarouselSlide';

const fCarousel = class FCarousel extends LitElement {
  static get properties() {
    return {
    };
  }

  constructor() {
    super();
    this.index = 0;

    const slideElement = [...this.children];
    slideElement.forEach(e => {
      console.log(e);
    })
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
        ::slotted(f-carousel-slide:first-child) {
          display: inline-block;
          width: 100%;
          box-sizing: border-box;
        }
        ::slotted(.next) {
          display: inline-block;
          position: absolute;
          top: 0;
          left: 0;
          transform: translateX(100%);
        }
        ::slotted(.prev) {
          display: inline-block;
          position: absolute;
          top: 0;
          left: 0;
          transform: translateX(-100%);
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
    const slides = this.querySelectorAll('f-carousel-slide');
    [...slides].forEach(e => {
      if (e.classList.contains('prev')) {
        e.classList.remove('prev');
      }
      e.style = '';
    })
    if (index === 0) {
      this.nextSlideAnimation(slides, index);
      this.index++;
    } else if (index !== 0 && index < slides.length - 1) {
      this.nextSlideAnimation(slides, index);
      slides[index - 1].style = '';
      slides[index - 1].classList.remove('next');
      this.index++;
    } else {
      this.nextSlideAnimationLast(slides, index);
      slides[index - 1].style = '';
      [...slides].forEach((e, i) => {
        if (i === 0) return;
        e.classList.remove('next');
        e.style = '';
      })
      this.index = 0;
    }
  }

  nextSlideAnimation (target, index) {
    target[index + 1].classList.add('next');
    target[index].style.transform = 'translateX(-100%)';
    target[index + 1].style.transition = 'transform 1000ms ease';
    target[index + 1].style.transform = 'translateX(0%)';
  }

  prevSlideAnimation (target, index) {
    target[index - 1].classList.add('prev');
    target[index - 1].style.transition = 'transform 1000ms ease';
    target[index].style.transform = 'translateX(100%)';
    target[index - 1].style.transform = 'translateX(0%)';
  }

  nextSlideAnimationLast (target, index) {
    target[0].classList.add('next');
    target[0].style.transition = 'transform 1000ms ease';
    target[index].style.transform = 'translateX(-100%)';
    target[0].style.transform = 'translateX(0%)';
  }

  prevSlideAnimationFirst (target, index) {
    target[target.length - 1].classList.add('prev');
    target[target.length - 1].style.transition = 'transform 1000ms ease';
    target[index].style.transform = 'translateX(100%)';
    target[target.length - 1].style.transform = 'translateX(0%)';
  }

  previous () {
    let index = this.index
    const slides = this.querySelectorAll('f-carousel-slide');
    [...slides].forEach(e => {
      if (e.classList.contains('next')) {
        e.classList.remove('next');
      }
      e.style = '';
    })
    if (index === 0) {
      this.prevSlideAnimationFirst(slides, index);
      slides[index + 1].style = '';
      [...slides].forEach((e, i) => {
        if (i === slides.length - 1) return;
        e.classList.remove('prev');
        e.style = '';
      })
      this.index = slides.length - 1;
    } else if (index !== slides.length - 1 && index > 0) {
      this.prevSlideAnimation(slides, index);
      slides[index + 1].style = '';
      slides[index + 1].classList.remove('prev');
      this.index--;
    } else {
      this.prevSlideAnimation(slides, index);
      slides[0].style = '';
      this.index--;
    }
  }

}

export default fCarousel;

customElements.define('f-carousel', fCarousel);
