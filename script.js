const formControls = document.querySelectorAll('.form-control');
const form = document.querySelector('form');
const result = document.querySelector('.result');
const defaultDisplay = document.querySelector('.default-display')

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

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

function resetForm() {
    clearForm();
    result.classList.remove('show');
    defaultDisplay.classList.remove('hidden');
    form.reset();
}

function submitForm(event) {
    event.preventDefault();
    clearForm();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    let errors = 0;

    // Validate inputs
    formControls.forEach( formControl => {
        const input = formControl.querySelector('input:not([type="radio"])');
        const radios = formControl.querySelectorAll('input[type="radio"]');

        if (input && (!input.value || input.value.trim() === '')) {
             errors += displayError(input);
        }
        if (radios.length > 0 && !Array.from(radios).some(radio => radio.checked)) {
            errors += displayError(radios[0]);
        }
    })

    if (errors > 0) {
        return -1;
    }

    // Process the form data
    const amount = parseFloat(data.amount);
    const term = parseFloat(data.term);
    const rate = parseFloat(data.rate);
    const type = data.type;

    const monthlyInterestRate = rate / 100 / 12; // Convert annual rate to monthly and percentage to decimal
    const months = term * 12;

    const up = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months);
    const down = Math.pow(1 + monthlyInterestRate, months) - 1;

    const monthlyRepayment = amount * (up / down);
    const monthlyInterestOnly = amount * monthlyInterestRate;

    const monthly = type === 'repayment' ? monthlyRepayment : monthlyInterestOnly
    const totalPayment = (type === 'repayment' ? monthlyRepayment : monthlyInterestOnly) * months;

    defaultDisplay.classList.add('hidden');
    result.classList.add('show');

    result.querySelector('.amount-monthly').textContent = `${formatCurrency(monthly)}`;
    result.querySelector('.amount-total').textContent = `${formatCurrency(totalPayment)}`;
}

form.addEventListener('reset', resetForm);
form.addEventListener('submit', submitForm);
