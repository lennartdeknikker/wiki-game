// initialize socket

// eslint-disable-next-line no-undef
const socket = io()

const urlParams = new URLSearchParams(window.location.search)
const roomName = urlParams.get('room')
const userName = urlParams.get('user')

socket.emit('join', roomName, userName)

// page elements
const readyButton = document.getElementById('ready-button')
const userList = document.getElementById('user-list')
const userNameElement = document.getElementById('username')
const startButton = document.getElementById('start-button')
const wikiDestinationEmbed = document.getElementById('wiki-destination-embed')
const wikiEmbed = document.getElementById('wiki-embed')
const clicksCounter = document.getElementById('clicks')
const pagesList = document.getElementById('pages')
const playersProgressList = document.getElementById('players-progress-list')

// variables
let clicks = 0
let clickedLinksArray = []

// event listeners
readyButton.addEventListener('click', readyButtonHandler)
startButton.addEventListener('click', startButtonHandler)

//event handlers
function readyButtonHandler() {
    if (readyButton.innerText === 'not ready') {
        socket.emit('ready', true)
        readyButton.innerText = 'ready'
    } else {
        socket.emit('ready', false)
        readyButton.innerText = 'not ready'
    }
}

function startButtonHandler() {
    if (startButton.dataset.ready) {
        socket.emit('start game')    
        console.log('start game')
        
    }
}


// socket events
socket.on('change in users', (roomData) => {
    console.log('change in users')
    const admin = isAdmin(roomData.users)
    
    updateUserList(roomData.users)

    if (admin) startButton.classList.remove('hidden')

    if (!admin) startButton.classList.add('hidden')
    else if (everyoneReady(roomData.users)) {
        startButton.dataset.ready = true
        startButton.classList.remove('inactive')
    } else {
        startButton.dataset.ready = false
        startButton.classList.add('inactive')
    }
})

socket.on('game started', async (roomData) => {
    let userNameText = userNameElement.innerText.replace('(ready)', '')
    userNameElement.innerText = userNameText

    const sections = document.querySelectorAll('section')
    sections[0].classList.add('hidden')
    sections[1].classList.add('hidden')
    addDestination(roomData.destinationLink[0])
    loadPage(roomData.startLink[0])
})

socket.on('a user clicked', roomData => {
    playersProgressList.innerHTML = ''
    roomData.users.sort((a, b) => a.clicks - b.clicks)
    for (let user in roomData.users) {
        const newLi = document.createElement('li')
        let finishedText = roomData.users[user].finished === true ? '(finished)' : '(not finished yet)'
        newLi.innerText = `${roomData.users[user].username}: ${roomData.users[user].clicks} clicks ${finishedText}`
        playersProgressList.appendChild(newLi)
    }    
})



// DOM update functions
function updateUserList(users) {
    userList.innerHTML = ''
    for (let user of users) {
        if (user.id !== socket.id) {
            const newLi = document.createElement('li')
            const readyText = user.ready ? '(ready)' : '(not ready)'
    
            newLi.innerText = `${user.username} ${readyText}`        
            userList.appendChild(newLi)
        } else {
            const readyText = user.ready ? '(ready)' : '(not ready)'
            userNameElement.innerText = `${user.username} ${readyText}`
        }
    }
}

async function addDestination(link) {
    const response = await fetch(link)
    const json = await response.json()
    console.log(json)
    

    const pageTitleElement = document.createElement('h4')
    pageTitleElement.innerText = json.title
    const extractElement = document.createElement('p')
    extractElement.innerText = json.extract
    
    wikiDestinationEmbed.appendChild(pageTitleElement)
    wikiDestinationEmbed.appendChild(extractElement)
}

async function loadPage(link) {
    console.log(link)
    
    const response = await fetch(link)
    const html = await response.text()
    wikiEmbed.innerHTML = html
    updateLinks('#wiki-embed')    
}

function updateLinks(elementName) {
    const element = document.querySelector(elementName)
    const links = element.querySelectorAll('a')
    links.forEach(link => {
        if (!isInternalLink(link)) {
            link.classList.add('external-link')
            link.addEventListener('click', onFalseLink)
        } else {
            link.addEventListener('click', onWikiLink)
        }
    })

    function onFalseLink() {
        event.preventDefault()
    }

    function onWikiLink() {
        event.preventDefault()
        increaseClicks()
        addToPageArray(this.href)
        loadPage(parseToApiLink(this.href))

        socket.emit('wiki link clicked', this.href)
    }

}

// checker functions
function everyoneReady(users) {
    let everyoneReady = true
    for (let user of users) {
        if (user.ready === false) everyoneReady = false
    }
    console.log('everyone is ready', everyoneReady)
    return everyoneReady
}

function isAdmin(users) {
    const admin = users.find(user => user.admin === true)
    console.log('isAdmin', admin.id === socket.id)
    
    return admin.id === socket.id
}

function isInternalLink(linkElement) {
    return linkElement.href.includes('wiki')
}

// helper functions
function parseToApiLink(link) {
    const httpslink = link.replace('http', 'https')
    const subject = httpslink.replace('https://en.wikipedia.org/wiki/', '')
    let newLink = `https://en.wikipedia.org/api/rest_v1/page/html/${subject}`
    return newLink    
}

function increaseClicks() {
    clicks++
    clicksCounter.innerText = clicks
}

function addToPageArray(link) {
    const subject = link.replace('http://en.wikipedia.org/wiki/', '')
    const newItem = {
        subject: subject,
        link: link,
    }

    clickedLinksArray.push(newItem)
    
    const index = clickedLinksArray.length - 1
    const newLi = document.createElement('li')
    newLi.innerText = newItem.subject
    newLi.addEventListener('click', () => revertPageTo(index))
    pagesList.appendChild(newLi)

    function revertPageTo(index) {
        
        const link = parseToApiLink(clickedLinksArray[index].link) 
        loadPage(link)
        console.log(clickedLinksArray)
        
        clickedLinksArray = clickedLinksArray.slice(0, index + 1)
        console.log(clickedLinksArray)
        reloadPageArray()
    }

    function reloadPageArray() {
        pagesList.innerHTML = ''
        for (let link in clickedLinksArray) {       
            console.log(clickedLinksArray[link].subject)                 
            const newLi = document.createElement('li')
            newLi.innerText = clickedLinksArray[link].subject
            newLi.addEventListener('click', () => revertPageTo(link))
            pagesList.appendChild(newLi)
        }
    }
}