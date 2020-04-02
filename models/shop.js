const mongoose = require('mongoose')

const shopCollection = 'shops'

const shopSchema = mongoose.Schema({
    _id: String,
    access_token: String,
    shop_details: mongoose.Schema.Types.Mixed,
    scopes: String
})



module.exports = mongoose.model(shopCollection, shopSchema)
