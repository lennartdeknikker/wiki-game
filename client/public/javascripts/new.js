// page elements
const readyButton = document.getElementById('ready-button')
const userList = document.getElementById('user-list')
const userNameElement = document.getElementById('username')
const startButton = document.getElementById('start-button')

// event listeners
readyButton.addEventListener('click', readyButtonHandler)
startButton.addEventListener('click', startButtonHandler)

//handlers
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
    if (startButton.dataset.ready === true) socket.emit('start game')    
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