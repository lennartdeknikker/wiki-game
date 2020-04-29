const fetch = require('node-fetch')

const Utilities = {
    createUser(username, id, isAdmin) {
        return {
            username: username,
            id: id,
            finished: false,
            clicks: 0,
            admin: isAdmin,
            ready: false
        }
    },
    async getRandomWikiLinks(amount = 3, output) {
        let links = []
        for (let i = 0; i < amount; i++) {
            const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
            const json = await response.json()
            links.push(json.api_urls[output])
        }
        return links
    },
    async createRoom(roomName) {
        let newRoom = {
            roomName: roomName,
            userTotal: 0,
            users: [],
            startLink: '',
            destinationLink: ''
        }

        // newRoom.destinationLinks = await Utilities.getRandomWikiLinks(1)
        // newRoom.startLinks = await Utilities.getRandomWikiLinks(1)
        return newRoom
    },
    getRoomData(roomName, roomsFile) {
        const roomIndex = roomsFile.findIndex(room => room.roomName === roomName)
        return roomsFile[roomIndex]
    },
    getRoomByUserId(id, roomsFile) {
        let result = -1
        roomsFile.forEach(room => {
            room.users.forEach(user => {
                if (user.id === id) {
                    result = room
                }
            })
        })
        return result
    },
    setUserProperty(id, roomsFile, property, newValue, io) {
        roomsFile.forEach(room => {
            room.users.forEach(user => {
                if (user.id === id) {
                    newValue === 'increment' ? user[property] = user[property] + 1 : user[property] = newValue                    
                    io.to(room.roomName).emit('change in users', Utilities.getRoomData(room.roomName, roomsFile))
                }
            })
        })
    },
    checkIfEveryoneIsFinished(id, roomsFile) {
        let everyoneFinished = true
        const room = Utilities.getRoomByUserId(id, roomsFile)         
        room.users.forEach(user => {
            if (user.finished === false) everyoneFinished = false
        })
        return everyoneFinished
    }
}

module.exports = Utilities
