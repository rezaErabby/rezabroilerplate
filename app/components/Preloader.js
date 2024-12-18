import Component from "../classes/Component.js";
import each from 'lodash/each.js'
import GSAP from 'gsap';
import { split } from "../utils/text.js";

export default class Preloader extends Component {
  constructor(){
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text',
        images: document.querySelectorAll('img')
      }
    })

    split({
      element: this.elements.title,
      expression: '<br>'
    })

    split({
      element: this.elements.title,
      expression: '<br>'
    })

    this.elements.titlesSpan = this.elements.title.querySelectorAll('span span')

    this.length = 0;


    this.createLoader()
  }

  createLoader(){
    each(this.elements.images, image => {

      image.onload = _ => this.onAssetLoaded(image)
      image.src = image.getAttribute('data-src')
    })

  }

  onAssetLoaded(image){
    this.length += 1;
    const percent = this.length / this.elements.images.length;

    this.elements.numberText.innerHTML = `${Math.round(percent * 100) }%`;

    if(percent === 1){
      this.onLoaded();
    }
  }

  onLoaded(){
    return new Promise(resolve => {
      this.animateOut = GSAP.timeline({
        delay: 2
      })

      this.animateOut.to(this.elements.titlesSpan, {
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1,
        y: '100%'
      })

      this.animateOut.to(this.elements.numberText, {
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1,
        y: '100%'
      }, '-=1.4')

      this.animateOut.to(this.element,
        {
          duration: 1.5,
          ease: 'expo.out',
          scale: 0,
          transformOrigin: '100% 100%'
        },
        '-=1'
    )

    this.animateOut.call(_ => {
      this.emit('completed')
    })
    })
  }

  destroy(){
    this.element.parentNode.removeChild(this.element)
  }
}
