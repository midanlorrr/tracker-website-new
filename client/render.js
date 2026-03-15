export function renderCountdowns(countdownObjectsArray, renderType) { // renders each countdown object
    countdownObjectsArray.sort((a, b)=> a.timeRemainingMS - b.timeRemainingMS);
    let countdownGridHTML = ``;
    countdownObjectsArray.forEach((countdownObject)=>{
        const {title, id, dueDate, type, time} = countdownObject;
        const HTML = `
        <div class="countdown-block" data-id="${id}">
            <div class="time-content">
                <div class="timebox">
                    ${time === 'reg' ?
                    `<div class="time-segments">
                        <h3 id="days-${id}">00</h3><p>Days</p>
                    </div>
                    <span class="time-sep">:</span>` : ''}
                    <div class="time-segments">
                        <h3 id="hours-${id}">00</h3><p>Hours</p>
                    </div>
                    <span class="time-sep">:</span>
                    <div class="time-segments">
                        <h3 id="minutes-${id}">00</h3><p>Min</p>
                    </div>
                </div>
                <div class="actionbox">
                    <div class="title">
                        <span id="title-${id}" data-action="edit-title">${title}</span>
                    </div>
                    <input data-action="time-input" type="datetime-local" value='${dueDate || ''}'>
                    <button class="delete-button" data-action="delete">Delete</button>
                </div>
                <div class="extrabox">
                    <label class="switch">
                        <input type="checkbox" data-action="toggle-time" ${time !== 'reg' ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <select name="Type" data-action="select-task" value="${type}">
                        <option value="task" ${type === 'task' ? 'selected' : ''}>Task</option>
                        <option value="misc" ${type === 'misc' ? 'selected' : ''}>Misc</option>
                    </select>
                </div>
            </div>
        </div>
        `;
        if (renderType === 'task') {
            if (type === 'task') countdownGridHTML += HTML;
        } else if (renderType === 'misc') {
            if (type === 'misc') countdownGridHTML += HTML;
        } else {
            countdownGridHTML += HTML;
        }
    })
    document.getElementById('js-countdown-grid').innerHTML = countdownGridHTML;
    requestAnimationFrame(() => {
        const clockAnim = document.querySelector('.clock')?.getAnimations()[0];
        if (clockAnim) {
            clockAnim.currentTime = new Date().getSeconds() * 1000;
        }
    });
    renderTimes(countdownObjectsArray, renderType);
    console.log('renderCountdowns called');
}

function extractTime(countdownObject) {
    if (countdownObject.dueDate === 0) {
        return;
    }
    const {days, hours, minutes, seconds, dueDate, timeRemainingMS, time} = countdownObject;
    const targetDateMS = new Date(dueDate).getTime();
    const diffMs = targetDateMS - Date.now();
    countdownObject.timeRemainingMS = diffMs;
    countdownObject.days = diffMs > 0 ? Math.floor(diffMs / 1000 / 60 / 60 / 24) : Math.ceil(diffMs / 1000 / 60 / 60 / 24);
    countdownObject.hours = time === 'reg' ? (diffMs > 0 ? Math.floor(diffMs / 1000 / 60 / 60) % 24 : Math.ceil(diffMs / 1000 / 60 / 60) % 24) : (
        diffMs > 0 ? Math.floor(diffMs / 1000 / 60 / 60) : Math.ceil(diffMs / 1000 / 60 / 60)
    );
    countdownObject.minutes = diffMs > 0 ? Math.floor(diffMs / 1000 / 60) % 60 : Math.ceil(diffMs / 1000 / 60) % 60;
    countdownObject.seconds = diffMs > 0 ? Math.floor(diffMs / 1000) % 60 : Math.ceil(diffMs / 1000) % 60;
    //console.log(`${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`);
}

const DAY_MS = 24*60*60*1000;
function urgency(timeRemainingMS) {
    if (timeRemainingMS >= DAY_MS) return 0;
    if (timeRemainingMS <= 0) return 1;
    return 1 - (timeRemainingMS / DAY_MS);
}

function updateCountdownBG(countdownElement, timeRemainingMS) {
    const u = 238 - (urgency(timeRemainingMS) * 78);
    countdownElement.style.backgroundColor = `rgb(255, ${u}, ${u})`;
}

export function renderTimes(countdownObjectsArray, renderType) { // renders just the time components
    countdownObjectsArray.forEach((countdownObject)=>{
        if (renderType === 'task') {
            if (countdownObject.type !== 'task') return;
        }
        if (renderType === 'misc') {
            if (countdownObject.type !== 'misc') return;
        }
        extractTime(countdownObject);
        const {days, hours, minutes, id, timeRemainingMS, time} = countdownObject;
        time === 'reg' ? document.getElementById(`days-${id}`).innerHTML = days : '';
        document.getElementById(`hours-${id}`).innerHTML = hours;
        document.getElementById(`minutes-${id}`).innerHTML = minutes;
        if (days < 1) updateCountdownBG(document.querySelector(`[data-id="${id}"]`), timeRemainingMS);
    })
    document.getElementById(`seconds`).innerHTML = Math.floor((new Date("2027-03-13T00:00").getTime() - Date.now()) / 1000) % 60;
    const currentMs = (new Date().getSeconds()) * 1000;
    if (currentMs == 0) {
        document.querySelector('.clock').getAnimations()[0].currentTime = 0;
    }
}
