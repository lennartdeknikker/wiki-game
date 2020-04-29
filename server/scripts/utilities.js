const fetch = require('node-fetch')

const Utilities = {
    createUser(username, id, isAdmin) {
        return {
            username: username,
            id: id,
            score: 0,
            clicks: 0,
            admin: isAdmin,
            ready: false
        }
    },
    async getRandomWikiLinks(amount = 3) {
        let links = []
        for (let i = 0; i < amount; i++) {
            const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
            const json = await response.json()
            links.push(json.content_urls.desktop.page)
        }
        return links
    },
    async createRoom(roomName) {
        let newRoom = {
            roomName: roomName,
            userTotal: 0,
            users: [],
            startLinks: [],
            destinationLinks: []
        }

        newRoom.destinationLinks = await Utilities.getRandomWikiLinks(1)
        newRoom.startLinks = await Utilities.getRandomWikiLinks(1)
        return newRoom
    },
    getRoomData(roomName, roomsFile) {
        const roomIndex = roomsFile.findIndex(room => room.roomName === roomName)
        return roomsFile[roomIndex]
    },
    setUserProperty(id, roomsToSearch, property, newValue, io) {
        roomsToSearch.forEach(room => {
            room.users.forEach(user => {
                if (user.id === id) {
                    user[property] = newValue                    
                    io.to(room.roomName).emit('change in users', Utilities.getRoomData(room.roomName, roomsToSearch))
                }
            })
        })
    }
}

module.exports = Utilities
