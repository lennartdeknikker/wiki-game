const mongoose = require('mongoose')
const Scores = require('../models/scores')

const Database = {
    addNewData(destination, newClicksArray) {
        
        mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

        var db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', function() {
            // we're connected!
            console.log('we are connected')
            
            Database.onConnection(destination, newClicksArray)            
        })
    },
    async onConnection(destination, newClicksArray) {
        console.log(destination, newClicksArray)
        //create new countries array (maybe remove later, when database is filled)
        const newCountriesArray = ['hallo', 'doei']
        //create new clicks array
        const newAverageAmountOfClicks = [10, 20]

        const query = { name: 'totalArray' }
        const change = { countries: newCountriesArray, averageAmountOfClicks: newAverageAmountOfClicks }
        const scores = await Scores.findOneAndUpdate(query, change, {new:true}, function(err) {
            if (err) return console.error(err)
        }
        )
        console.log(scores)
    }
}

module.exports = Database