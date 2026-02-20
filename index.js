const Days = document.getElementById('days');
const Hours = document.getElementById('hours');
const Minutes = document.getElementById('minutes');
const Seconds = document.getElementById('seconds');

document.querySelector('[data-action="time-input"]').value = "2026-02-21T00:00"; // Default Date
const timeInput = document.querySelector('[data-action="time-input"]'); // Grabs whatever the inputed time is
let targetDate = new Date(timeInput.value).getTime(); // Turns that inputed time into the actual ms since 1970

document.addEventListener('change', ()=>{
    console.log('Date Changed');
    targetDate = new Date(timeInput.value).getTime();
})

timer();

function timer() {
    const diffMs = targetDate - Date.now();
    const days = Math.floor(diffMs / 1000 / 60 / 60 / 24);
    const hours = Math.floor(diffMs / 1000 / 60 / 60) % 24;
    const minutes = Math.floor(diffMs / 1000 / 60) % 60;
    const seconds = Math.floor(diffMs / 1000) % 60;

    //console.log(`${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`);

    Days.innerHTML = days;
    Hours.innerHTML = hours;
    Minutes.innerHTML = minutes;
    Seconds.innerHTML = seconds;
}

const intervalId = setInterval(timer, 1000);
console.log(intervalId);

document.addEventListener('click', (e)=>{
    if (e.target.matches('[data-action="delete"]')) {
        console.log('clicked');
    }
})
/*
timerGridHTML = `
<div class="timer-example">
    <h2>Task 1</h2>
    <div class="timebox">
    <div class="time-segments">
        <h3 id="days">00</h3><p>Days</p>
    </div>
    <div class="time-segments">
        <h3 id="hours">00</h3><p>Hours</p>
    </div>
    <div class="time-segments">
        <h3 id="minutes">00</h3><p>Minutes</p>
    </div>
    <div class="time-segments">
        <h3 id="seconds">00</h3><p>Seconds</p>
    </div>
    <input data-action="time-input" type="datetime-local" value="2026-02-21T00:00">
    <button class="delete-button" data-action="delete">Delete</button>
    </div>
</div>
`;*/

//document.getElementById('js-timer-grid').innerHTML = timerGridHTML;