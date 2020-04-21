// eslint-disable-next-line no-undef
const socket = io()

const formNewGame = document.querySelector('#form-new-game')
const formJoinGame = document.querySelector('#form-join-game')
const wikiEmbed = document.querySelector('#wiki-embed')

if (formNewGame && formJoinGame) {
    formNewGame.addEventListener('submit', onNewGame)
    formJoinGame.addEventListener('submit', onJoinGame)
}

if (wikiEmbed) {
    const links = wikiEmbed.querySelectorAll('a')
    links.forEach(link => {
        link.addEventListener('click', onWikiLink)
    })
}

function onNewGame() {
    if (validate(formNewGame)) {
        console.log('starting new game')    
    }
}

function onJoinGame() {
    if (validate(formJoinGame)) {
        console.log('joining game')    
    }
}

function onWikiLink() {
    event.preventDefault()
    socket.emit('wiki link clicked', this.href)
}