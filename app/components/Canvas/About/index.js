import Gallery from './Gallery.js';
import { Plane, Transform } from 'ogl';
import GSAP from 'gsap';
import map from 'lodash/map.js';

export default class About {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.group = new Transform();
    this.sizes = sizes
    this.createGeometry()
    this.createGalleries()
    this.group.setParent(scene)

    this.show()
  }

  createGeometry() {
    this.geometry = new Plane(this.gl)
  }

  createGalleries() {
    this.galleryElements = document.querySelectorAll('.about__gallery')

    this.galleries = map(this.galleryElements, (element, index) => {
      return new Gallery({
        element,
        geometry: this.geometry,
        index,
        scene: this.group,
        gl: this.gl,
        sizes: this.sizes
      })
    })

  }

  /**
   * Animations
   */

  show(){
    map(this.galleries, gallery => gallery.show())

  }

  hide(){
    map(this.galleries, gallery => gallery.hide())

  }

  /**
 * Events
 */

  onResize (event) {
    map(this.galleries, gallery => gallery.onResize(event))
  }

  onTouchDown (event) {
    map(this.galleries, gallery => gallery.onTouchDown(event))
  }

  onTouchMove (event) {
    map(this.galleries, gallery => gallery.onTouchMove(event))
  }

  onTouchUp (event) {
    map(this.galleries, gallery => gallery.onTouchUp(event))
  }

  onWheel({pixelX, pixelY}){
  }

  /**
 * Loops
 */

  update(scroll) {
    map(this.galleries, gallery => gallery.update(scroll) )
  }

   /**
   * Destroy.
   */
   destroy () {
    map(this.galleries, gallery => gallery.destroy())
  }
}
