const express = require('express')
const router = express.Router();
const { verifyRequest, encrypt, verifyState } = require('../utils/verification')
const nonce = require('nonce')()
const request = require('request-promise')
var mongoose = require('mongoose');
const dboperations = require('../utils/dboperations')
const constants = require('../constants/constants')
const api = require('../api/api')
const webhooksApi = require('../api/webhooks')



const scopes = 'write_products,read_content, read_themes, read_customers'
const forwardingAddress = constants.appUrl

console.log("Forwarding URL: ", forwardingAddress)

router.get('/', (req, res) => {

    console.log("Incoming Request")

    const { shop, hmac, timestamp }  = req.query;
    

    if(shop && hmac && timestamp){

        if(verifyRequest(req)){
            
            dboperations.checkInstallation(shop).then((shopExists) => {

                if(shopExists){
                    res.redirect('/')
                }
                else{
                    
                    console.log("Install Incoming URL:", req)
            
                    const state = nonce()
                    const redirectUri = forwardingAddress + '/shopify/callback'
            
                    const installUrl = 'https://' + shop + '/admin/oauth/authorize?client_id=' + process.env.SHOPIFY_API_KEY +
                    '&scope=' + scopes +
                    '&state=' + state +
                    '&redirect_uri=' + redirectUri;
            
                    console.log("Installation URL:", installUrl)
            
                    res.cookie('state', encrypt(state.toString()))
                    res.redirect(installUrl);

                }
            }).catch(err => {
                console.log("Problem retrieving shop -", err)
                res.status(400).send("Problem retrieving shop")
            })
        }
        else{
            return res.status(400).send("Validation failed")
        }
    }
    else{
        return res.status(400).send("Invalid Request")
    }
  })

  router.get('/callback', (req, res) => {

    console.log("Shop", req.query.shop)

    console.log("Callback: ", req)

    if(verifyRequest(req), verifyState(req)){

        let options = {
            method: 'POST',
            uri: 'https://' + req.query.shop + '/admin/oauth/access_token',
            body: {
                client_id: process.env.SHOPIFY_API_KEY,
                client_secret: process.env.SHOPIFY_API_SECRET,
                code: req.query.code
            },
            json: true // Automatically parses the JSON string in the response
        };

        //console.log(options.uri)

        request(options)
        .then(function (response) {
            //console.log('Response', response);
            response.shop = req.query.shop

            api.getShopDetails(req.query.shop, response.access_token).then((shopDetails) => {

                dboperations.saveShop(shopDetails.data.shop, response.scope, response.access_token).then((savedShop) => {
                    console.log("Shop saved - ", savedShop)

                    webhooksApi.createUninstallWebhook(savedShop.shop_details.domain, response.access_token).then((webhook) => {
                        console.log("Webhook Registered - ", webhook)

                        dboperations.saveUninstallWebhook(savedShop.id, webhook.data.webhook).then((savedWebhook) => {
                            console.log("Uninstall webhook saved - ", savedWebhook)
                        }).catch(err => {
                            console.log("Unable to save Uninstall Webhook -", err)
                        })

                    }).catch(err => {
                        console.log("Unable to register Uninstall webhook -", err )
                    })

                    webhooksApi.createUpdateWebhook(savedShop.shop_details.domain, response.access_token).then((webhook) => {
                        console.log("Update Webhook Registered - ", webhook)

                    }).catch(err => {
                        console.log("Unable to register Update webhook -", err )
                    })

                    webhooksApi.createRemoveWebhook(savedShop.shop_details.domain, response.access_token).then((webhook) => {
                        console.log("Remove Webhook Registered - ", webhook)

                    }).catch(err => {
                        console.log("Unable to register Remove webhook -", err )
                    })

                }).catch(err => {
                    console.log("Unable to save shop to DB -", err)
                })

                

            }).catch((err) => {
                console.log("Unable to retrieve shop details -", err)
            })

            dboperations.saveShop(response)
            res.redirect('/')

        })
        .catch(function (err) {
            console.log("request failed", err.message)
            console.log("request failed", err)
        });

    }
    else{
        res.status(400).send("Missing info in the request")
    }
    
  })
  

  module.exports = router