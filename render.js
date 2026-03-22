export function renderCountdowns(countdownObjectsArray, renderType) { // renders each countdown object
    countdownObjectsArray.sort((a, b)=> new Date(a.due_date) - new Date(b.due_date));
    let countdownGridHTML = ``;
    countdownObjectsArray.forEach((countdownObject)=>{
        const {title, id, due_date, type, mode} = countdownObject;
        const HTML = `
        <div class="countdown-block" data-id="${id}">
            <div class="time-content">
                <div class="timebox">
                    ${mode === 'reg' ?
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
                    <input data-action="time-input" type="datetime-local" value='${utcToDatetimeLocal(due_date) || ''}'>
                    <button class="delete-button" data-action="delete">Delete</button>
                </div>
                <div class="extrabox">
                    <label class="switch">
                        <input type="checkbox" data-action="toggle-mode" ${mode !== 'reg' ? 'checked' : ''}>
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

function utcToDatetimeLocal(utcString) {
    const d = new Date(utcString);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
}

export function renderTimes(countdownObjectsArray, renderType) { // renders just the time components
    countdownObjectsArray.forEach((countdownObject)=>{
        if (renderType === 'task') {
            if (countdownObject.type !== 'task') return;
        }
        if (renderType === 'misc') {
            if (countdownObject.type !== 'misc') return;
        }
        const { id, due_date, mode } = countdownObject;
        const diffMs = new Date(due_date).getTime() - Date.now();
        const days = diffMs > 0 ? Math.floor(diffMs / 1000 / 60 / 60 / 24) : Math.ceil(diffMs / 1000 / 60 / 60 / 24);
        const hours = mode === 'reg' ? (diffMs > 0 ? Math.floor(diffMs / 1000 / 60 / 60) % 24 : Math.ceil(diffMs / 1000 / 60 / 60) % 24) : (
            diffMs > 0 ? Math.floor(diffMs / 1000 / 60 / 60) : Math.ceil(diffMs / 1000 / 60 / 60)
        );
        const minutes = diffMs > 0 ? Math.floor(diffMs / 1000 / 60) % 60 : Math.ceil(diffMs / 1000 / 60) % 60;

        mode === 'reg' ? document.getElementById(`days-${id}`).innerHTML = days : '';
        document.getElementById(`hours-${id}`).innerHTML = hours;
        document.getElementById(`minutes-${id}`).innerHTML = minutes;
        if (days < 1) updateCountdownBG(document.querySelector(`[data-id="${id}"]`), diffMs);
    })
    document.getElementById(`seconds`).innerHTML = Math.floor((new Date("2027-03-13T00:00").getTime() - Date.now()) / 1000) % 60;
    const currentMs = (new Date().getSeconds()) * 1000;
    if (currentMs == 0) {
        document.querySelector('.clock').getAnimations()[0].currentTime = 0;
    }
}
