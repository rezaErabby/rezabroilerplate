import Button from "../../classes/Button.js";
import Page from "../../classes/Page.js"

export default class Detail extends Page {
  constructor(){
    super({
      id: 'detail',
      element: '.detail',
      elements: {
        button: '.detail__button'
      }
    })
  }

  create(){
    super.create();

    this.link = new Button({
     element:  elements.button
    })
  }

  destroy(){
    super.destroy()
    this.link.removeEventListeners()
  }
}

