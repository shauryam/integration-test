const axios = require('axios')
const endpoints = require('../constants/endpoints')
const webhookTopics = require('../constants/webhookTopics')
const constants = require('../constants/constants')

exports.createUninstallWebhook = (shopDomain, access_token) => {

    return new Promise((resolve, reject) => {

        const config = {
            method: 'post',
            url: 'https://' + shopDomain + endpoints.createWebhook,
            headers: {'X-Shopify-Access-Token': access_token},
            data: {
                "webhook":{
                    "topic": webhookTopics.appUninstall ,
                    "address": constants.appUrl + '/webhooks/uninstall',
                    "format": "json"
                }
            }
        }

        console.log("Config for uninstall webhook: ", config)
    
        axios.request(config).then( result => {
            resolve(result)
        }).catch((err)=> {
            reject(err)
        })
    })
}

exports.createUpdateWebhook = (shopDomain, access_token) => {

    return new Promise((resolve, reject) => {

        const config = {
            method: 'post',
            url: 'https://' + shopDomain + endpoints.createWebhook,
            headers: {'X-Shopify-Access-Token': access_token},
            data: {
                "webhook":{
                    "topic": 'product_listings/update' ,
                    "address": constants.appUrl + '/webhooks/productListing/update',
                    "format": "json"
                }
            }
        }

        console.log("Config for update webhook: ", config)
    
        axios.request(config).then( result => {
            resolve(result)
        }).catch((err)=> {
            reject(err)
        })
    })
}

exports.createRemoveWebhook = (shopDomain, access_token) => {

    return new Promise((resolve, reject) => {

        const config = {
            method: 'post',
            url: 'https://' + shopDomain + endpoints.createWebhook,
            headers: {'X-Shopify-Access-Token': access_token},
            data: {
                "webhook":{
                    "topic": 'product_listings/remove' ,
                    "address": constants.appUrl + '/webhooks/productListing/remove',
                    "format": "json"
                }
            }
        }

        console.log("Config for remove webhook: ", config)
    
        axios.request(config).then( result => {
            resolve(result)
        }).catch((err)=> {
            reject(err)
        })
    })
}

