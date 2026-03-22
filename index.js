import { renderCountdowns, renderTimes } from "./render.js";
import { testGet, testPost } from "./api.js";

// testPost();
// testGet();

const defaultDate = "2026-03-28T00:00";

const defaultObject = {
    title: 'Task 1',
    type: 'task',
    time: 'reg',
    dueDate: defaultDate,
    timeRemainingMS: 0,
    id: '0',
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
}

let countdownObjectsArray = [
    defaultObject
]

let renderType = 'all';

function setActiveNav(activeId) {
    ['all', 'assignments', 'misc'].forEach(id => {
        document.getElementById(id).classList.toggle('active', id === activeId);
    });
}

function loadData() {
    try {
        const saved = JSON.parse(localStorage.getItem('countdownArray'));
        console.log(saved);
        if (Array.isArray(saved)) { countdownObjectsArray = saved; } else { throw ('ERROR: Invalid data format'); };

    } catch (err) {
        console.log(err);
        countdownObjectsArray = [
            defaultObject
        ];
        saveData(countdownObjectsArray);
    }
}

function saveData(arr) {
    localStorage.setItem('countdownArray', JSON.stringify(arr));
}

loadData();
renderCountdowns(countdownObjectsArray, renderType);
setActiveNav(renderType);

setInterval(()=>renderTimes(countdownObjectsArray, renderType), 1000); // heartbeat, checks every 1 second

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

document.addEventListener('click', (e)=>{
    if (e.target.matches('#all')) {
        renderType = 'all';
        setActiveNav('all');
        renderCountdowns(countdownObjectsArray, renderType);
    }
    if (e.target.matches('#assignments')) {
        renderType = 'task';
        setActiveNav('assignments');
        renderCountdowns(countdownObjectsArray, renderType);
    }
    if (e.target.matches('#misc')) {
        renderType = 'misc';
        setActiveNav('misc');
        renderCountdowns(countdownObjectsArray, renderType);
    }

    const action = e.target.dataset.action || e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    const container = e.target.closest('[data-id]');
    const id = container?.dataset.id;

    if (action === "delete") {
        countdownObjectsArray = countdownObjectsArray.filter(item => item.id !== id);
        renderCountdowns(countdownObjectsArray, renderType);
    }
    if (action === "add") {
        countdownObjectsArray.push({
            ...defaultObject,
            id: crypto.randomUUID()
        });

        // try {
        //     const response = await fetch("http://localhost:3000/button-click", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify({})
        //     })
        //     const data = await response.json();
        //     console.log("Server responded:", data);
        // } catch (error) {
        //     console.error(error);
        // }

        renderCountdowns(countdownObjectsArray, renderType);
    }
    // Temp fix ------------------------------------
    if (action === "export") {
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
    if (action === "edit-title") {
        const titleElement = document.getElementById(`title-${id}`);
        startEditTitle(titleElement);
    }
    
    saveData(countdownObjectsArray);
})

document.addEventListener('change', (e)=>{
    if (e.target.matches('[data-action="time-input"]')) {
        const id = e.target.closest('[data-id]').dataset.id;
        const timeElement = e.target.closest('[data-action="time-input"]'); // Grabs whatever the inputed time is
        if (!timeElement) return;

        const countdownObject = countdownObjectsArray.find(item=>item.id===id);
        countdownObject.dueDate = timeElement.value;
        renderTimes(countdownObjectsArray, renderType);
    }
    if (e.target.matches('[data-action="data-input"]')) {
        const inputElement = e.target.closest('[data-action="data-input"]');
        inputElement.select();
        const parsed = JSON.parse(inputElement.value);
        countdownObjectsArray = parsed;
        renderCountdowns(countdownObjectsArray, renderType);
    }
    if (e.target.matches('[data-action="select-task"]')) {
        const typeElement = e.target.closest('[data-action="select-task"]');
        const id = e.target.closest('[data-id]').dataset.id;
        const countdownObject = countdownObjectsArray.find(item=>item.id===id);
        countdownObject.type = typeElement.value;
    }
    if (e.target.matches('[data-action="toggle-time"]')) {
        const toggle = e.target.closest('[data-action="toggle-time"]');
        const id = e.target.closest('[data-id]').dataset.id;
        const countdownObject = countdownObjectsArray.find(item=>item.id===id);
        if (toggle.checked) {
            countdownObject.time = 'hours';
        } else {
            countdownObject.time = 'reg';
        }
        renderCountdowns(countdownObjectsArray, renderType);
    }
    saveData(countdownObjectsArray);
})

document.addEventListener('focusin', (e) => {
  if (e.target.matches('[data-action="data-input"]')) e.target.select();
});
