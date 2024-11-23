import Animation from "../classes/Animation.js";
import GSAP from 'gsap';
import { calculate, split } from "../utils/text.js";
import each from 'lodash/each.js'
export default class Label extends Animation {
  constructor(
    {
      element,
      elements
    }
  ){
    super({
      element,
      elements
    })

    split({
      element: this.element
    })

    split({
      element: this.element
    })

    this.elementLinesSpans = this.element.querySelectorAll('span span')
  }

  animateIn(){
    this.timelineIn = GSAP.timeline({
      delay: 0.5
    })
    this.timelineIn.set(this.element, {
      autoAlpha: 1
    })
    each(this.elementLines, (line, index) => {
      this.timelineIn.fromTo(
        line,
        {
          y: '100%'
        },
        {
          delay: index * 0.2,
          duration: 1.5,
          y: '0%',
          ease: 'expo.out'
        },
        0
      );
    })

  }

  animateOut(){
    GSAP.set(this.element, {
      autoAlpha: 0
    })
  }

  onResize(){
    this.elementLines = calculate(this.elementLinesSpans);
  }
}
