// form validation
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