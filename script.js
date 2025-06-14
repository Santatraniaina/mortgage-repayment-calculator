const formGroups = document.querySelectorAll('.form__group');
const form = document.querySelector('form');
const result = document.querySelector('.result');
const defaultDisplay = document.querySelector('.default-display');
const amount = document.getElementById("amount");



function formatNumber(amount, toCurrency = false) {
    if (isNaN(amount)) return '';

    const formatOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        ...(toCurrency && { style: 'currency', currency: 'GBP' })
    };
    return new Intl.NumberFormat('en-US', formatOptions).format(amount);
}

function displayError(input) {
    const message = `<span class='form-error'>${input.dataset.error}</span>`;
    const parent = input.parentElement;
    parent.classList.add('invalid');
    parent.parentElement.insertAdjacentHTML('beforeend', message);
    return 1;
}

function clearForm() {
    formGroups.forEach( formControl => {
        const formInput = formControl.querySelector('.form__input');
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

function calculateRepayments(data) {
    const amount = parseFloat(data.amount.replace(/,/g, ''));
    const term = parseFloat(data.term);
    const rate = parseFloat(data.rate);
    const type = data.type;

    const monthlyInterestRate = rate / 100 / 12;
    const months = term * 12;

    const up = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months);
    const down = Math.pow(1 + monthlyInterestRate, months) - 1;

    const monthlyRepayment = amount * (up / down);
    const monthlyInterestOnly = amount * monthlyInterestRate;

    const monthly = type === 'repayment' ? monthlyRepayment : monthlyInterestOnly
    const totalPayment = (type === 'repayment' ? monthlyRepayment : monthlyInterestOnly) * months;

    defaultDisplay.classList.add('hidden');
    result.classList.add('show');

    result.querySelector('.amount-monthly').textContent = `${formatNumber(monthly, true)}`;
    result.querySelector('.amount-total').textContent = `${formatNumber(totalPayment, true)}`;
}

function submitForm(event) {
    event.preventDefault();
    clearForm();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    let errors = 0;

    // Validate inputs
    formGroups.forEach( formControl => {
        const input = formControl.querySelector('input:not([type="radio"])');
        const radios = formControl.querySelectorAll('input[type="radio"]');

        if (input && (!input.value || input.value.trim() === '')) {
             errors += displayError(input);
        }
        if (radios.length > 0 && !Array.from(radios).some(radio => radio.checked)) {
            errors += displayError(radios[0]);
        }
    })

    if (errors > 0)  return -1;
    calculateRepayments(data)
}

function applyFormatOnAmount(event) {
    const value = event.target.value;
    if (value !== null && value !== undefined && value.trim() !== '') {
        event.target.value = formatNumber(parseFloat(value));
    }
}



amount.addEventListener('change', applyFormatOnAmount);
form.addEventListener('reset', resetForm);
form.addEventListener('submit', submitForm);