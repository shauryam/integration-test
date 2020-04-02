
const querystring = require('querystring')
const crypto = require('crypto')
const cookie = require('cookie')

exports.verifyRequest = (req) => {

        hmac = req.query.hmac
        const map = Object.assign({}, req.query)    
        delete map['hmac']
        const message = querystring.stringify(map)
        const generatedHash = crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(message).digest('hex')
        // console.log("GENERATED -",  hmac)
        return (generatedHash === hmac)

}

exports.encrypt = (message) => {
    return crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(message).digest('hex')
}

exports.verifyState = (req) => {

    state = req.query.state
    const cookies = cookie.parse(req.headers.cookie || '')
    const stateInCookie = cookies.state
    console.log(stateInCookie)
    const generatedHash = crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(state).digest('hex')
    console.log("GENERATED -",  generatedHash)
    return (generatedHash === stateInCookie)

}

