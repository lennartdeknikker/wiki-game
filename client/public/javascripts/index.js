const formNewGame = document.querySelector('#form-new-game')
const formJoinGame = document.querySelector('#form-join-game')

if (formNewGame && formJoinGame) {
    formNewGame.addEventListener('submit', onNewGame)
    formJoinGame.addEventListener('submit', onJoinGame)
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

function validate(form) {
    const formElements = form.querySelectorAll('textarea, input')
    let allIsRight = true
    for (const element of formElements) {
        const value = element.value
        if (!value) {
            event.preventDefault()
            element.placeholder = 'Sorry, this field is required.'
            element.classList.add('wrong-input')
            allIsRight = false
        }
    }
    return allIsRight ? true : false
}