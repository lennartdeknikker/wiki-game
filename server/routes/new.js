const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

/* GET home page. */
router.get('/', async function(req, res) {
    const roomName = req.query.room
    res.render('new', { title: 'new game', room: roomName})
})

module.exports = router
