const Utilities = require('./utilities')
const States = require('./states')
const Database = require('./database')

function socket(io) {
    let availableRooms = States.availableRooms

    io.on('connection', function(socket){
        console.log('a user connected')

        socket.on('join', async function(roomName, userName) {
            console.log('user joined')            
            let isCreator = false
            if (!io.sockets.adapter.rooms[roomName]) {
                const newRoom = await Utilities.createRoom(roomName)
                availableRooms.push(newRoom)
                isCreator = true
            }

            const newUser = await Utilities.createUser(userName, socket.id, isCreator)
            const roomIndex = availableRooms.findIndex(room => room.roomName === roomName)
            availableRooms[roomIndex].users.push(newUser)
            availableRooms[roomIndex].userTotal++

            socket.join(roomName)
            io.to(roomName).emit('change in users', Utilities.getRoomData(roomName, availableRooms))

            console.log(userName, 'joined', roomName)
            console.log('room details', io.sockets.adapter.rooms[roomName])    
        })

        socket.on('disconnect', function() {
            console.log('user disconnected')            
            availableRooms.forEach(room => {
                room.users.forEach(user => {
                    if (user.id === socket.id) {
                        // if admin, assign new admin
                        if (user.admin === true && room.users.length > 1) room.users[1].admin = true
                        const index = room.users.indexOf(user)
                        // remove user from array
                        room.users.splice(index, 1)
                        // update user total
                        room.userTotal--
                        // tell clients the users file changed          
                        io.to(room.roomName).emit('change in users', Utilities.getRoomData(room.roomName, availableRooms))
                        // delete room if empty
                        if (room.userTotal < 1) {
                            const index = availableRooms.indexOf(room)
                            availableRooms.splice(index, 1)
                        }
                    }
                })
            })
        })

        socket.on('ready', (ready) => {
            console.log('ready')            
            Utilities.setUserProperty(socket.id, availableRooms, 'ready', ready, io)            
        })

        socket.on('start game', async () => {
            console.log('start game')            
            const room = Utilities.getRoomByUserId(socket.id, availableRooms)
            Utilities.resetRoom(room)
            room.status = 'playing'
            room.startLink = await Utilities.getRandomWikiLinks(1, 'edit_html')
            room.destination = Utilities.getDestination()
            
            io.to(room.roomName).emit('game started', room)
        })

        socket.on('wiki link clicked', link => {
            const room = Utilities.getRoomByUserId(socket.id, availableRooms)
            const destinationSubject = room.destination.link.replace('https://en.wikipedia.org/api/rest_v1/page/summary/', '')
            const httpsSubject = link.replace('http', 'https')
            const clickedSubject = httpsSubject.replace('https://en.wikipedia.org/wiki/', '')            
            
            if (clickedSubject === destinationSubject) {
                Utilities.setUserProperty(socket.id, availableRooms, 'finished', true, io)
                console.log('we have a winner')                
                // get room
                const room = Utilities.getRoomByUserId(socket.id, availableRooms)
                room.winner = room.users.find(user => user.id === socket.id)
                // set room status to 'game ended'
                room.status = 'game ended'
                // open room for new players.
                room.status = 'waiting for players'
                // emit end event to sockets
                io.to(room.roomName).emit('game ended', room)
                // get relevant data
                let destinationCountry = room.destination.name
                let clicksForFinishedUsersInThisGame = []
                room.users.forEach(user => {
                    if (user.finished === true) {
                        clicksForFinishedUsersInThisGame.push(user.clicks)
                    }
                })
                // save data to database
                Database.addNewData(destinationCountry, clicksForFinishedUsersInThisGame)
            } else socket.emit('load page', link)
            
            Utilities.setUserProperty(socket.id, availableRooms, 'clicks', 'increment', io)            
            io.to(room.roomName).emit('a user clicked', room)
        })

    })
}

module.exports = socket