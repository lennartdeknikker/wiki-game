function socket(io) {

    io.on('connection', function(socket){
        console.log('a user connected')

        socket.on('join', function(roomName, user) {
            socket.join(roomName)
            io.to(roomName).emit('new user', user)

            console.log(user, 'joined', roomName)
            console.log('room details', io.sockets.adapter.rooms[roomName])                       
        })

        socket.on('disconnect', function() {
            console.log('user disconnected')      
        })
        socket.on('wiki link clicked', link => {
            console.log(link)      
        })

    })
}

module.exports = socket