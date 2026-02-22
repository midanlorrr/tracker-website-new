const defaultDate = "2026-02-22T00:00";

let countdownObjectsArray = [
    {
        title: 'Task 1',
        dueDate: defaultDate,
        id: '0',
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    }
]

function renderCountdowns() { // renders each countdown object
    let countdownGridHTML = ``;
    countdownObjectsArray.forEach((countdownObject)=>{
        const {title, id, dueDate} = countdownObject;
        countdownGridHTML += `
        <div class="countdown-block" data-id="${id}">
            <div class="time-content">
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
                </div>
                <div class="actionbox">
                    <h2>${title}</h2>
                    <input data-action="time-input" type="datetime-local" value='${dueDate || ''}'>
                    <button class="delete-button" data-action="delete">Delete</button>
                </div>
            </div>
        </div>
        `;
    })
    document.getElementById('js-countdown-grid').innerHTML = countdownGridHTML;
    renderTimes();
    const currentMs = (new Date().getSeconds()) * 1000;
    document.querySelector('.clock').getAnimations()[0].currentTime = currentMs;
    console.log('renderCountdowns called');
}
renderCountdowns();

function extractTime(countdownObject) {
    if (countdownObject.dueDate === 0) {
        return;
    }
    const {days, hours, minutes, seconds, dueDate} = countdownObject;
    const targetDateMS = new Date(dueDate).getTime();
    const diffMs = targetDateMS - Date.now();
    countdownObject.days = Math.floor(diffMs / 1000 / 60 / 60 / 24);
    countdownObject.hours = Math.floor(diffMs / 1000 / 60 / 60) % 24;
    countdownObject.minutes = Math.floor(diffMs / 1000 / 60) % 60;
    countdownObject.seconds = Math.floor(diffMs / 1000) % 60;
    //console.log(`${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`);
}

function renderTimes() { // renders just the time components
    countdownObjectsArray.forEach((countdownObject)=>{
        extractTime(countdownObject);
        const {days, hours, minutes, seconds, id} = countdownObject;
        document.getElementById(`days-${id}`).innerHTML = days;
        document.getElementById(`hours-${id}`).innerHTML = hours;
        document.getElementById(`minutes-${id}`).innerHTML = minutes;
    })
    countdownObjectsArray[0]?.seconds != null ? document.getElementById(`seconds`).innerHTML = `${countdownObjectsArray[0].seconds}` : document.getElementById(`seconds`).innerHTML = '';
    const currentMs = (new Date().getSeconds()) * 1000;
    if (currentMs == 0) {
        document.querySelector('.clock').getAnimations()[0].currentTime = 0;
    }
}

setInterval(()=>renderTimes(), 1000); // heartbeat, checks every 1 second

document.addEventListener('click', (e)=>{
    if (e.target.matches('[data-action="delete"]')) {
        const deleteId = e.target.closest('[data-id]').dataset.id;
        countdownObjectsArray = countdownObjectsArray.filter(item => item.id !== deleteId);
        //console.log(countdownObjectsArray);
        renderCountdowns();

    }
    if (e.target.matches('[data-action="add"]')) {
        countdownObjectsArray.push({
            title: `Task`, 
            dueDate: 0, 
            id: crypto.randomUUID(),
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        });
        //console.log(countdownObjectsArray);
        renderCountdowns();
    }
})

document.addEventListener('change', (e)=>{
    const id = e.target.closest('[data-id]').dataset.id;
    const timeInput = e.target.closest('[data-action="time-input"]').value; // Grabs whatever the inputed time is
    const countdownObject = countdownObjectsArray.find(item=>item.id===id);
    countdownObject.dueDate = timeInput;
    renderTimes();
})
