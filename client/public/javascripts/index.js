const forms = document.querySelectorAll('form')
forms.forEach(form => {
    form.addEventListener('submit', () => validateForm(form))
})

function validateForm(form) {
    event.preventDefault()
    if (validate(form)) form.submit()
}

function validate(form) {
    console.log('validating')
    
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
