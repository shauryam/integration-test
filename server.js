const dotenv = require('dotenv').config()
const express = require('express')
const appInstallRoute = require('./routes/installRoutes')
const webhooksRoute = require('./routes/webhookRoutes')
const accountRoute = require('./routes/accountRoutes')
const productsRoute = require('./routes/productsRoutes')
const dboperations = require('./utils/dboperations')
var bodyParser = require('body-parser')


const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
// const handle = app.getRequestHandler()

const port = 8000

const apiKey = process.env.SHOPIFY_API_KEY
const apiSecret = process.env.SHOPIFY_API_SECRET

const scopes = 'write_products,read_content'

const forwardingAddress = 'https://swift-dragonfly-86.localtunnel.me'

dboperations.connect();



const server = express()

server.use(bodyParser.json())

server.use('/shopify', appInstallRoute);

server.use('/webhooks', webhooksRoute);

server.use('/account', accountRoute);

server.use('/products', productsRoute);

server.get('/', (req, res) => {
    return res.send('Shopify App coming')
  })

server.listen(port, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:' + port)
})

