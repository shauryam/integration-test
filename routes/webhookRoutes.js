const express = require('express')
const router = express.Router();
var bodyParser = require('body-parser')


router.post('/uninstall', (req, res) => {
    console.log("Webhook received -", req.body)
    console.log('Webhook headers - ', req.headers)
    return res.status(200).send()

})

router.post('/productListing/update', (req, res) => {
    console.log("Update Webhook received -", req.body)
    console.log('Update Webhook headers - ', req.headers)
    return res.status(200).send()

})

router.post('/productListing/remove', (req, res) => {
    console.log("Remove Webhook received -", req.body)
    console.log('Remove Webhook headers - ', req.headers)
    return res.status(200).send()

})

module.exports = router 