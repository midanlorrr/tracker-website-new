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
                    <div class="title">
                        <span id="title-${id}" data-action="edit-title">${title}</span>
                    </div>
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

function loadData() {
    try {
        const saved = JSON.parse(localStorage.getItem('countdownArray'));
        console.log(saved);
        if (Array.isArray(saved)) { countdownObjectsArray = saved; } else { throw ('ERROR: Invalid data format'); };

    } catch (err) {
        console.log(err);
        countdownObjectsArray = [
            {
                title: 'Task 1',
                dueDate: defaultDate,
                id: '0',
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            }
        ];
        saveData(countdownObjectsArray);
    }
}

loadData();
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

function startEditTitle(titleElement) {
    const currentText = titleElement.textContent;
    const tempInput = document.createElement('input');
    tempInput.type = 'text';
    tempInput.value = currentText
    tempInput.id = titleElement.id;

    titleElement.replaceWith(tempInput);
    tempInput.focus();
    //tempInput.select();

    tempInput.addEventListener('keydown', (e)=>{
        //if (e.key === 'Enter') finishEdit(tempInput, currentText);
        if (e.key === 'Escape') cancelEdit(tempInput, currentText);
    });
    tempInput.addEventListener('blur', () => finishEdit(tempInput, currentText));
}

function finishEdit(tempInput, fallbackText) {
    if (!tempInput.isConnected) return;
    const newText = tempInput.value.trim() || 'unnamed';

    const spanElement = document.createElement("span");
    spanElement.textContent = newText;

    spanElement.dataset.action = "edit-title";
    spanElement.id = tempInput.id;

    const id = spanElement.id.replace('title-', '');

    tempInput.replaceWith(spanElement);

    const countdownObject = countdownObjectsArray.find(item=>item.id===id);
    countdownObject.title = newText;
}

function cancelEdit(tempInput, oldText) {
    tempInput.value = oldText;
    finishEdit(tempInput, oldText, id);
}

function saveData(arr) {
    localStorage.setItem('countdownArray', JSON.stringify(arr));
}

document.addEventListener('click', (e)=>{
    if (e.target.matches('[data-action="delete"]')) {
        const deleteId = e.target.closest('[data-id]').dataset.id;
        countdownObjectsArray = countdownObjectsArray.filter(item => item.id !== deleteId);
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
        renderCountdowns();
    }
    // Temp fix ------------------------------------
    if (e.target.matches('[data-action="export"]')) {
        const exportBoxElement = document.getElementById('export-box');
        const text = JSON.stringify(countdownObjectsArray, null, 2);
        //exportBoxElement.style.display = 'block';
        //exportBoxElement.innerHTML = text;

        try {
            navigator.clipboard.writeText(text);
            alert('Copied to clipboard as a string.');
        } catch {
            alert('Shown below. Long-press the text box to copy.');
        }
    }
    // Temp fix ------------------------------------
    if (e.target.matches('[data-action="edit-title"]')) {
        const id = e.target.closest('[data-id]').dataset.id;
        const titleElement = document.getElementById(`title-${id}`);
        console.log(id);
        startEditTitle(titleElement);
    }
    //console.log(countdownObjectsArray);
    saveData(countdownObjectsArray);
})

document.addEventListener('change', (e)=>{
    if (e.target.matches('[data-action="time-input"]')) {
        const id = e.target.closest('[data-id]').dataset.id;
        const timeElement = e.target.closest('[data-action="time-input"]'); // Grabs whatever the inputed time is
        if (!timeElement) return;

        const countdownObject = countdownObjectsArray.find(item=>item.id===id);
        countdownObject.dueDate = timeElement.value;
        renderTimes();
    }
    if (e.target.matches('[data-action="data-input"]')) {
        const inputElement = e.target.closest('[data-action="data-input"]');
        inputElement.select();
        const parsed = JSON.parse(inputElement.value);
        countdownObjectsArray = parsed;
        saveData(countdownObjectsArray);
        renderCountdowns();
    }
})

document.addEventListener('focusin', (e) => {
  if (e.target.matches('[data-action="data-input"]')) e.target.select();
});
