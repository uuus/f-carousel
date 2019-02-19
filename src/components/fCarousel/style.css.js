import { css, unsafeCSS } from 'lit-element';

export default self => css`

  :host {
    display: block;
    position:relative;
    overflow:hidden;
    height: 350px;
  }

  div {
    display: flex;
  }

  ::slotted(f-carousel-slide) {
    position: absolute;
    width: ${unsafeCSS(self.width)};
    top: 0;
    right: 0;
    left: 0;
    margin: 0 auto;
  }

  ::slotted(f-carousel-slide:not([selected])) {
    display: none;
  }

  .controller {
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

  .controller:hover, .controller:focus {
    opacity: 1;
  }

  #prevBtn {
    left: 12px;
  }

  #nextBtn {
    right: 12px;
  }

  .controller[disabled] {
    opacity: 0.4;
    cursor: default;
  }

  .navigators {
    display: none;
  }

  .indicator {
    display: none;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    text-align: center;
  }

  .bullet {
    background-color: hsla(0, 0%, 100%, .5);
    width: 9px;
    height: 9px;
    padding: 0;
    border-radius: 50%;
    border: 2px solid transparent;
    transition: all .3s ease-in-out;
    cursor: pointer;
    line-height: 0;
    box-shadow: 0 0.25em 0.5em 0 rgba(0,0,0,.1);
    margin: 0 .25em;
  }

  .bullet[selected] {
    background-color: #3498db;
  }
`;
