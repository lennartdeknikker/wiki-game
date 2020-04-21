const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

/* GET home page. */
router.get('/', async function(req, res) {
    res.render('index', { title: 'wiki-game' })
})

module.exports = router
