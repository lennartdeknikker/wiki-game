const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', async function(req, res) {
    const roomName = req.query.room
    const userName = req.query.user
    res.render('room', { title: `wiki-game | ${roomName}`, room: roomName, user: userName})
})

module.exports = router
