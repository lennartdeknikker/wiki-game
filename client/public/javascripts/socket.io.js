// eslint-disable-next-line no-undef
const socket = io()
const wikiEmbed = document.querySelector('#wiki-embed')

// get username and room name
const urlParams = new URLSearchParams(window.location.search)
const roomName = urlParams.get('room')
const userName = urlParams.get('user')

socket.emit('join', roomName, userName)

socket.on('new user', (username) => {
    console.log(username, 'joined the room')    
})

if (wikiEmbed) {
    const links = wikiEmbed.querySelectorAll('a')
    links.forEach(link => {
        link.addEventListener('click', onWikiLink)
    })
}

function onWikiLink() {
    event.preventDefault()
    socket.emit('wiki link clicked', this.href)
}
