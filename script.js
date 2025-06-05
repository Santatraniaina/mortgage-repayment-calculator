const formControls = document.querySelectorAll('.form-control');
const form = document.querySelector('form');

function displayError(input) {
    const message = `<span class='form-error'>${input.dataset.error}</span>`;
    const parent = input.parentElement;
    parent.classList.add('invalid');
    parent.parentElement.insertAdjacentHTML('beforeend', message);
    return 1;
}

function clearForm() {
    formControls.forEach( formControl => {
        const formInput = formControl.querySelector('.form-input');
        const formError = formControl.querySelector('.form-error');
        if (formInput) {
            formInput.classList.remove('invalid');
        }
        if (formError) {
            formError.remove();
        }
    })
}

function submitForm(event) {
    event.preventDefault();
    clearForm();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate inputs
    formControls.forEach( formControl => {
        const input = formControl.querySelector('input:not([type="radio"])');
        const radios = formControl.querySelectorAll('input[type="radio"]');
        let errors = 0;

        if (input && (!input.value || input.value.trim() === '')) {
             errors += displayError(input);
        }
        if (radios.length > 0 && !Array.from(radios).some(radio => radio.checked)) {
            errors += displayError(radios[0]);
        }

        if (errors > 0) {
            return false;
        }
    })

    // TODO : Calculate mortgage repayment
}

form.addEventListener('submit', submitForm)
