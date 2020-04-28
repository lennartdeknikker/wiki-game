const fetch = require('node-fetch')

const Utilities = {
    createUser: function(username, id, isAdmin) {
        return {
            username: username,
            id: id,
            score: 0,
            clicks: 0,
            admin: isAdmin
        }
    },
    getRandomWikiLinks: async function (amount = 3) {
        let links = []
        for (let i = 0; i < amount; i++) {
            const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
            const json = await response.json()
            links.push(json.content_urls.desktop.page)
        }
        return links
    },
    createRoom: async function(roomName) {
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
    getRoomData: function(roomName, roomsFile) {
        const roomIndex = roomsFile.findIndex(room => room.roomName === roomName)
        return roomsFile[roomIndex]
    }
}

module.exports = Utilities
