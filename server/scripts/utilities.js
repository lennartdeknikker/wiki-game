const fetch = require('node-fetch')
const Destinations = require('./destinations')

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
    getDestination() {
        const endpoint = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
        const randomIndex = Math.floor(Math.random() * Destinations.length)
        const randomDestination = Destinations[randomIndex]
        
        return {
            name: randomDestination.name,
            link: endpoint + randomDestination.link
        }
    },
    async createRoom(roomName) {
        let newRoom = {
            roomName: roomName,
            userTotal: 0,
            users: [],
            startLink: '',
            destination: {
                name: '',
                link: ''
            },
            status: 'waiting for players',
            winner: {}
        }
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
        let newRoomdata = []
        roomsFile.forEach(room => {
            room.users.forEach(user => {
                if (user.id === id) {
                    newValue === 'increment' ? user[property] = user[property] + 1 : user[property] = newValue
                    newRoomdata = Utilities.getRoomData(room.roomName, roomsFile)                    
                    io.to(room.roomName).emit('change in users', newRoomdata)
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
