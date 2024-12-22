import each from 'lodash/each.js';
import map from 'lodash/map.js';
import GSAP from 'gsap';
import Prefix from 'prefix';
import Title from '../animations/Title.js';
import Paragraph from '../animations/Paragraph.js';
import Label from '../animations/Label.js';
import Highlight from '../animations/Highlight.js';
import { ColorsManager } from './Colors.js';
import AsyncLoad from './AsyncLoad.js';
export default class Page {
  constructor(
    {
      element, // parent class name exaple .about .home etc
      elements, // what ever we need from that page example title , links
      id // page name basically about home (not with class)
    }
  ){
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsLabels: '[data-animation="label"]',
      animationsHighlights: '[data-animation="highlight"]',

      preloaders: '[data-src]',
    }
    this.id = id;
    this.transformPrefix = Prefix('transform');
  }

  create(){
    this.element = document.querySelector(this.selector); // element is a new variable
    this.elements = {};  // new elements variable
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0
    }
    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });
    this.createAnimations();

    this.createPreloader()
  }

  createAnimations(){
    this.animations = [];

    // titles
    this.animationsTitles = map(this.elements.animationsTitles, (element) => {
      return new Title({
        element,
      });
    });

    this.animations.push(...this.animationsTitles);

    // paragraphs
    this.animationsParagraphs = map(this.elements.animationsParagraphs, (element) => {
      return new Paragraph({
        element,
      });
    });

    this.animations.push(...this.animationsParagraphs);

    // lables
    this.animationsLabels = map(this.elements.animationsLabels, (element) => {
      return new Label({
        element,
      });
    });

    this.animations.push(...this.animationsLabels);

    // highlights
    this.animationsHighlights = map(this.elements.animationsHighlights, (element) => {
      return new Highlight({
        element,
      });
    });

    this.animations.push(...this.animationsHighlights);
  }

  createPreloader(){
    this.preloaders = map(this.elements.preloaders, element => {
      return new AsyncLoad({element})
    })
  }

  /**
   * Animations
   */

  show(){
    return new Promise(resolve => {

      ColorsManager.change({
        backgroundColor: this.element.getAttribute('data-background'),
        color: this.element.getAttribute('data-color'),
      })


      this.animationIn = GSAP.timeline();

      this.animationIn.fromTo(this.element,
        {
          autoAlpha: 0
        },
        {
          autoAlpha: 1
        }
    )

      this.animationIn.call(_ => {
          this.addEventListeners();
          resolve()
       })
    })

  }

  hide(){
      return new Promise(resolve => {
        this.destroy();
        this.animationOut = GSAP.timeline();

        this.animationOut.to(this.element, {
          autoAlpha: 0,
          onComplete: resolve
        })

      })

  }

  /**
   * Events
   */

  onResize() {
    if(this.elements.wrapper){
      this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight;
    }

    each(this.animations, animation => animation.onResize())
  }

  onWheel({pixelY}){
    this.scroll.target += pixelY;
  }

  /**
   * Loops
   */

  update(){
    this.scroll.target = GSAP.utils.clamp(0,this.scroll.limit,this.scroll.target);
    if(this.scroll.current < 0.01){
      this.scroll.current = 0;
    }
    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1);
    if(this.elements.wrapper){
      this.elements.wrapper.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
    }
  }

  /**
   * Listeners
   */

  addEventListeners(){
  }

  removeEventListeners(){
  }

  /**
   * Destroy
   */


  destroy(){
    this.removeEventListeners()
  }
}
