const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    res.set({
        'cache-control': 'no-cache, max-age=0, private, must-revalidate',
        // 'cache-control': 'no-store',
        expires: -1,
        'strict-transport-security': 'max-age=63072000; includeSubDomains; pload'
    });
    return res.status(200).send({products:[
        {name: 'shirt'},
        {name: 'jacket'}
    ]})
});

module.exports = router