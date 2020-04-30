const express = require('express')
const router = express.Router()
const States = require('../scripts/states')

/* GET home page. */
router.get('/', async function(req, res) {
    const availableRooms = []
    States.availableRooms.forEach(room => {
        if (room.status === 'waiting for players') availableRooms.push(room)
    })
    
    res.render('index', { title: 'wiki-game', rooms: availableRooms })
})

module.exports = router
