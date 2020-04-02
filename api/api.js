const axios = require('axios')
const endpoints = require('../constants/endpoints')

exports.getShopDetails = (shopDomain, access_token) => {
    return new Promise ((resolve, reject) => {
        const url = 'https://' + shopDomain + endpoints.shop
        axios.get(url, {headers: {'X-Shopify-Access-Token': access_token}}).then(result => {
            resolve(result)
        }).catch(err => {
            reject(err)
        })
    })
}