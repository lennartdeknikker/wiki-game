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
const wikiEmbed = document.querySelector('#wiki-embed')

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
    console.log('start:', roomData.startLink)
    console.log('destination:', roomData.destinationLink)
    fetch(roomData.destinationLink)
        .then(function(response) {
        // When the page is loaded convert it to text
            return response.text()
        })
        .then(function(html) {
        // Initialize the DOM parser
            var parser = new DOMParser()

            // Parse the text
            var doc = parser.parseFromString(html, 'text/html')

            // You can now even select part of that html as you would in the regular DOM 
            // Example:
            // var docArticle = doc.querySelector('article').innerHTML;

            console.log(doc)
        })
        .catch(function(err) {  
            console.log('Failed to fetch page: ', err)  
        })
    
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



// if (wikiEmbed) {
//     const links = wikiEmbed.querySelectorAll('a')
//     links.forEach(link => {
//         link.addEventListener('click', onWikiLink)
//     })
// }

// function onWikiLink() {
//     event.preventDefault()
//     socket.emit('wiki link clicked', this.href)
// }
