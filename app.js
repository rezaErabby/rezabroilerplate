import express from 'express'
import errorhandler from 'errorhandler'
import path from 'path'
import { fileURLToPath } from 'url'
import { client } from './config/prismicConfig.js'
import * as prismic from '@prismicio/client'
import * as prismicH from '@prismicio/helpers'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import logger from 'morgan'
import { UAParser } from 'ua-parser-js';

dotenv.config()

const app = express()
const port = 3000

// Fix for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(errorhandler())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))
app.use((req, res, next) => {

  const parser = new UAParser();
  const ua = parser.setUA(req.headers['user-agent']).getResult();
  res.locals.isDesktop = ua.device.type === undefined;
  res.locals.isPhone = ua.device.type === 'mobile';
  res.locals.isTablet = ua.device.type === 'tablet';


  res.locals.ctx = {
    prismic
  }

  res.locals.Link = handleLinkResolver

  res.locals.Numbers = index => {
    return `${index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : index === 3 ? 'Four' : ''}`
  }

  res.locals.prismicH = prismicH
  next()
})



const handleLinkResolver = doc => {
  if(doc.type === 'product'){
    return `/detail/${doc.slug}`
  }

  if(doc.type === 'collections'){
    return '/collections'
  }
  if(doc.type === 'about'){
    return '/about'
  }
  return './'
}

const handleRequest = async () => {
  const meta = await client.getSingle('meta');
  const navigation = await client.getSingle('navigation');
  const preloader = await client.getSingle('preloader');
  const about = await client.getSingle('about');
  const home = await client.getSingle('home');
  const collections = await client.getAllByType('collection', {
    fetchLinks: 'product.image'
  });

  let assets = [];

  home.data.gallery.forEach(item => {
    assets.push(item.image.url)
  });

  about.data.gallery.forEach(item => {
    assets.push(item.image.url)
  })

  about.data.body.forEach(section => {
    if(section === "gallery"){
      section.items.forEach(item => {
        assets.push(item.image.url)
      })
    }
  });

  collections.forEach(collection => {
    collection.data.products.forEach(item => {
      assets.push(item.products_product.data.image.url)

    })
  })

  return {
    assets,
    meta,
    navigation,
    preloader,
    collections,
    home,
    about
  }
}




app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
  const defaults = await handleRequest()

  res.render('pages/home', {
    ...defaults
  })
})

app.get('/about', async (req, res) => {

  const defaults = await handleRequest()

  res.render('pages/about', { ...defaults });
})

app.get('/detail/:uid', async (req, res) => {
  const product = await client.getSingle('product', req.params.uid, {
    fetchLinks: 'collection.title'
  });
  const defaults = await handleRequest()
  res.render('pages/detail', { ...defaults, product: product})
})

app.get('/collections', async (req, res) => {


  const defaults = await handleRequest()
  res.render('pages/collections', {
    ...defaults
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
