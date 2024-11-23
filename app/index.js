import About from 'pages/About/index.js';
import Collections from 'pages/Collections/index.js';
import Detail from 'pages/Detail/index.js';
import Home from 'pages/Home/index.js';
import each from 'lodash/each.js'
import Preloader from './components/Preloader.js';
import Navigation from './components/Navigation.js';
class App {
  constructor(){
    this.createContent()
    this.createPreloader()
    this.createNavigation()
    this.createPages()
    this.addEventListeners()
    this.addLinkListeners()

    this.update();
  }

  createNavigation(){
    this.navigation = new Navigation({
      template: this.template
    })
  }

  createPreloader(){
    this.preloader = new Preloader();
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }



  createContent(){
    this.content = document.querySelector('.content');
    this.template = this.content.getAttribute('data-template');
  }

  createPages(){
    this.pages = {
      about: new About(),
      collections: new Collections(),
      detail: new Detail(),
      home: new Home()
    }

    this.page = this.pages[this.template];
    this.page.create()
  }
  /**
   * Events
   */
  onPreloaded(){
    this.preloader.destroy()
    this.onResize()

    this.page.show()
  }

  onPopState(){
    this.onChange({
      url: window.location.pathname,
      push: false
    })
  }

 async onChange({url, push = true}){
   await this.page.hide()
    const request = await window.fetch(url);
    if(request.status === 200){
      const html = await request.text();
      const div = document.createElement('div');

      if(push){
        window.history.pushState({},'', url)

      }

      div.innerHTML = html;
      const divContent = div.querySelector('.content');
      this.template = divContent.getAttribute('data-template')

      this.navigation.onChange(this.template)

      this.content.setAttribute('data-template', this.template);
      this.content.innerHTML = divContent.innerHTML;

      this.page = this.pages[this.template];
      this.page.create();
      this.page.onResize()
      this.page.show()
      this.addLinkListeners()
    } else {
      console.log("Error")
    }
  }

  onResize(){
    if(this.page && this.page.onResize){
      this.page.onResize()
    }
  }

  /**
   * listeners
   */
  addEventListeners(){
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('resize', this.onResize.bind(this))
  }


  /**
   * loop
   */
  update(){
    if(this.page && this.page.update){
      this.page.update()
    }
    const frame = window.requestAnimationFrame(this.update.bind(this))
  }

  addLinkListeners(){
    const links = document.querySelectorAll('a');

    each(links, link => {
      link.onclick = event => {
        event.preventDefault();

        const { href } = link;

        this.onChange({url: href})
      }
    })
  }



}


new App()
