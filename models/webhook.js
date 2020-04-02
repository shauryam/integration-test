const mongoose = require('mongoose')
const webhooksCollection = 'webhooks'

const webhookSchema = mongoose.Schema({
    _id: String,
    webhooks: Array
})

module.exports = mongoose.model(webhooksCollection, webhookSchema)