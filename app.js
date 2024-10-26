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

  return {
    meta,
    navigation,
    preloader
  }
}




app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
  const collections = await client.getAllByType('collection', {
    fetchLinks: 'product.image'
  });
  const home = await client.getSingle('home');
  const defaults = await handleRequest()

  res.render('pages/home', {
    ...defaults,
    collections: collections,
    home: home,
  })
})

app.get('/about', async (req, res) => {
  const about = await client.getSingle('about');
  const defaults = await handleRequest()
  res.render('pages/about', { about: about, ...defaults });
})

app.get('/detail/:uid', async (req, res) => {
  const product = await client.getSingle('product', req.params.uid, {
    fetchLinks: 'collection.title'
  });
  const defaults = await handleRequest()
  res.render('pages/detail', { ...defaults, product: product})
})

app.get('/collections', async (req, res) => {
  const collections = await client.getAllByType('collection', {
    fetchLinks: 'product.image'
  });
  const home = await client.getSingle('home');
  const defaults = await handleRequest()
  res.render('pages/collections', {
    collections: collections,
    ...defaults,
    home: home,
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
