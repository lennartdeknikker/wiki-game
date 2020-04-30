const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
    name: String,
    countries: Array,
    averageAmountOfClicks: Array
})


const Scores = mongoose.model('scores', scoreSchema)

module.exports = Scores