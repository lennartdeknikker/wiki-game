function socket(io) {
    io.on('connection', function(socket){
        console.log('a user connected')

        socket.on('disconnect', function() {
            console.log('user disconnected')      
        })
        socket.on('wiki link clicked', link => {
            console.log(link)      
        })

    })
}

module.exports = socket