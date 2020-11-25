'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-11-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-11-08T14:11:59.604Z',
    '2020-11-22T17:01:17.194Z',
    '2020-11-23T23:36:17.929Z',
    '2020-11-21T05:31:51.311Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//Functions
//Labeltimer
function timer() {
  //set timer to 120 sec
  let time = 120;
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    //if time === 0
    if (time === 0) {
      //stop timer
      clearInterval(timerset);
      //logout
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }

    //decrease 1sec
    time--;
  };
  //start the interval and call timer every second
  tick();
  const timerset = setInterval(tick, 1000);
  console.log(timerset);
  return timerset;
}
//Date of Movements
function dateMovements(date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const datediff = calcDaysPassed(new Date(), date);
  // const datediff = Math.round(Math.abs(new Date() - date) / (1000 * 60 * 60 * 24));
  // console.log(datediff);
  if (datediff === 0) return 'Today';
  if (datediff === 1) return 'Yesterday';
  if (datediff <= 7) return `${datediff} Days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  const options = {
    month: 'numeric',
    year: 'numeric',
    day: 'numeric',
    weekday: 'long',
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

//Display transactions , movements on main app
const displayMovements = (acc, sort = false) => {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  containerMovements.innerHTML = '';
  movs.forEach((element, index) => {
    const type = element > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[index]);
    const currentDate = dateMovements(date, acc.locale);
    const html = `
         <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
        <div class="movements__date">${currentDate}</div>
          <div class="movements__value">${Math.abs(element)}€</div>
        </div>
      
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate total movements balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  labelBalance.innerHTML = `${acc.balance}€`;
};

// Calculate Summary
const calcDisplaySummary = function (acc) {
  const In = acc.movements.filter(e => e > 0).reduce((a, c) => a + c, 0);
  labelSumIn.textContent = `${In.toFixed(2)}€`;
  const Out = acc.movements.filter(e => e < 0).reduce((a, c) => a + c, 0);
  labelSumOut.textContent = `${Math.abs(Out).toFixed(2)}€`;
  const Interest = acc.movements
    .filter(e => e > 0)
    .map(e => (e * acc.interestRate) / 100)
    .filter(e => e >= 1)
    .reduce((a, c) => a + c, 0);
  labelSumInterest.textContent = `${Interest.toFixed(2)}€`;
};

//Create username
const CreateUsername = function (arr) {
  arr.forEach(e => {
    e.username = e.owner
      .toLowerCase()
      .split(' ')
      .map(e => e[0])
      .join('');
  });
};

CreateUsername(accounts);
console.log(accounts);

const updateUI = function (acc) {
  //Diplay Movements
  displayMovements(acc);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

//EVent handlers

let currentActive, timercheck;
let sorted = false;

//Sort Button
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(currentActive.movements);
  displayMovements(currentActive.movements, !sorted);
  sorted = !sorted;
});

//Login implementation

// fake login
// currentActive = account1;
// updateUI(currentActive);
// containerApp.style.opacity = 1;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentActive = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentActive);
  //using optional chaining
  if (currentActive?.pin === Number(inputLoginPin.value)) {
    console.log('valid');

    //Ui and welcome
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome Back, ${
      currentActive.owner.split(' ')[0]
    }`;

    //Current date and time
    // const now = new Date();
    // const date = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minute = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${date}/${month}/${year}, ${hour}:${minute}`;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: '2-digit',
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentActive.locale,
      options
    ).format(now);

    //clear fields and remove focus
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //start timer
    if (timercheck) clearInterval(timercheck);
    timercheck = timer();
    //Update ui
    updateUI(currentActive);
  }
});

//Transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(e => e.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentActive.balance >= amount &&
    receiverAcc.owner !== currentActive.owner
  ) {
    console.log('Transfer');

    //Doing the transfer
    currentActive.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transferdate
    currentActive.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //start timer
    if (timercheck) clearInterval(timercheck);
    timercheck = timer();

    //Update UI
    updateUI(currentActive);
  }
});

// Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const Loanamount = Number(inputLoanAmount.value);

  //Check for loan condition ('ANY' deposit > 10% request amount)
  if (
    Loanamount > 0 &&
    currentActive.movements.some(e => e > Loanamount * 0.1)
  ) {
    setTimeout(() => {
      //Push loan amount
      currentActive.movements.push(Loanamount);

      //add current date
      currentActive.movementsDates.push(new Date().toISOString());

      //start timer
      if (timercheck) clearInterval(timercheck);
      timercheck = timer();

      //update the ui
      updateUI(currentActive);

      //clear input fields
      inputLoanAmount.value = '';
    }, 3000);
  }
});

//Close account :
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  //checking for correct username and pin
  if (
    currentActive.username === inputCloseUsername.value &&
    currentActive.pin === parseInt(inputClosePin.value)
  ) {
    console.log('valid');
    //find index of user in accounts
    const index = accounts.findIndex(
      acc => acc.username === currentActive.username
    );
    //remove the account from users
    accounts.splice(index, 1);

    //clear the fields
    inputClosePin.value = inputCloseUsername.value = '';

    //update the ui
    containerApp.style.opacity = 0;
  }
});

// test

// setInterval(() => {
//   let a = new Date().getHours(),
//     b = new Date().getMinutes(),
//     c = new Date().getSeconds();
//   console.log(`${a}:${b}:${c}`);
// }, 1000);
