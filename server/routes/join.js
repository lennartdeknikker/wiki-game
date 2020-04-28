const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', async function(req, res) {
    res.render('join', {title: 'join game'})
})

module.exports = router
