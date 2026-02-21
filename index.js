const defaultDate = "2026-02-24T00:00";

let countdownObjectsArray = [
    {
        title: 'Task 1',
        dueDate: defaultDate,
        id: 0,
    }
]

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
}

//const intervalId = setInterval(timer, 1000); // heartbeat, checks every 1 second

function renderCountdowns() { // renders each countdown object
    let countdownGridHTML = ``;
    countdownObjectsArray.forEach((countdownObject)=>{
        const {title, id, dueDate} = countdownObject;
        countdownGridHTML += `
        <div class="countdown-block" data-id="${id}">
            <h2>${title}</h2>
            <div class="timebox">
                <div class="time-segments">
                    <h3 id="days-${id}">00</h3><p>Days</p>
                </div>
                <div class="time-segments">
                    <h3 id="hours-${id}">00</h3><p>Hours</p>
                </div>
                <div class="time-segments">
                    <h3 id="minutes-${id}">00</h3><p>Minutes</p>
                </div>
                <div class="time-segments">
                    <h3 id="seconds-${id}">00</h3><p>Seconds</p>
                </div>
                <input data-action="time-input" type="datetime-local" value="${dueDate}">
                <button class="delete-button" data-action="delete">Delete</button>
            </div>
        </div>
        `;
    })
    document.getElementById('js-countdown-grid').innerHTML = countdownGridHTML;
}
renderCountdowns();

document.addEventListener('click', (e)=>{
    if (e.target.matches('[data-action="delete"]')) {
        const deleteId = Number(e.target.closest('[data-id]').dataset.id);
        console.log(deleteId);
        countdownObjectsArray = countdownObjectsArray.filter(item => item.id !== deleteId);
        console.log(countdownObjectsArray);
        renderCountdowns();

    }
    if (e.target.matches('[data-action="add"]')) {
        currentId = countdownObjectsArray.length - 1;
        ++currentId;
        countdownObjectsArray.push({title: `Task ${currentId+1}`, dueDate: defaultDate, id: currentId});
        console.log(countdownObjectsArray);
        renderCountdowns();
    }
})
