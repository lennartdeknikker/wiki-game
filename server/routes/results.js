const express = require('express')
const router = express.Router()
const Database = require('../scripts/database')

/* GET home page. */
router.get('/', function(req, res) {    
    Database.getCurrentScores(renderPageWithScores)
    function renderPageWithScores(scores) {
        scores.sort((a,b) => a.averageAmountOfClicks - b.averageAmountOfClicks)
        res.render('results', { title: 'wiki-game | results', results: scores})
    }
})

module.exports = router
