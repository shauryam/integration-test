const mongoose = require('mongoose')
const Shop = require('../models/shop')
const Webhook = require('../models/webhook')
const axios = require('axios')
const api = require('../api/api')
const webhooksApi = require('../api/webhooks')
const dbname = 'integration-test'

const connect = () => {
    mongoose.connect(`mongodb+srv://shauryamittal:user-shaurya@practicecluster-knn4u.mongodb.net/${dbname}?retryWrites=true&w=majority`).then(result => {
        console.log("Mongo Connection Successful")
    }).catch(err => {
        console.log("Unable to connect to MongoDB -", err)
    })
}

const saveShop = (shopDetails, scopes, access_token) => {

    return new Promise((resolve, reject) => {
        const shop = new Shop({
            _id: shopDetails.id,
            access_token: access_token,
            scopes: scopes,
            shop_details: shopDetails
        });

        shop.save().then(shop => {
            resolve(shop)
            //saveUninstallWebhook(response.data.shop.domain, response.data.shop.id, )
            
        }).catch(err => {
            reject(err)
        })
    })

    // api.getShopDetails(shopDetails.shop, shopDetails.access_token)
    //     .then(response => {

    //         const shop = new Shop({
    //             _id: response.data.shop.id,
    //             access_token: shopDetails.access_token,
    //             scopes: shopDetails.scope,
    //             shop_details: response.data.shop 
    //         });

    //         shop.save().then(result => {
    //             console.log("Shop Saved Successfully")
    //             saveUninstallWebhook(response.data.shop.domain, response.data.shop.id, )
                
    //         }).catch(err => {
    //             console.log("Unable to save shop details -", err)
    //         })

            
    //     }).catch(err => {
    //         console.log("Unable to retreive shop details - ", err)
    //     })

}

const checkInstallation = shop => {

    return new Promise ((resolve, reject) => {
        Shop.find({'shop_details.domain': shop }, (err, shop) => {
            if(err){
                reject(err)
            }
            else{

                if(shop.length > 0) {
                    //console.log("Shop Found - ", shop)
                    resolve(true)
                }
                resolve(false)
            }            
        })
    })

}

const saveUninstallWebhook = (shop_id, webhookDetails) => {

    return new Promise((resolve, reject) => {
        
        const webhook = new Webhook({
            _id: shop_id,
            webhooks: webhookDetails,
        });

        webhook.save().then(savedWebhook => {
            resolve(savedWebhook)
        }).catch(err => {
            reject(err)
        })

    })
        
}

const deleteWebhook = (shop_id, topic) => {
    return new Promise((resolve, reject) => {
        
        const webhook = new Webhook({
            _id: shop_id,
            webhooks: webhookDetails,
        });

        webhook.save().then(savedWebhook => {
            resolve(savedWebhook)
        }).catch(err => {
            reject(err)
        });

    })
}

module.exports = { 
    connect, 
    saveShop,
    checkInstallation,
    saveUninstallWebhook
}

