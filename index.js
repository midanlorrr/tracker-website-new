import { renderCountdowns, renderTimes } from "./render.js";
import { loadData, saveCountdownToDB, updateCountdownToDB, deleteCountdownFromDB } from "./api.js";

const defaultDate = "2026-03-28T00:00";
// saveData('Test', new Date(defaultDate).toISOString(), 'task', 'reg');

const defaultObject = {
    // id: null,
    title: 'Default',
    due_date: new Date(defaultDate).toISOString(),
    type: 'task',
    mode: 'reg',
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

async function init() {
    try {
        const data = await loadData();
        countdownObjectsArray = data;
    } catch (err) {
        console.error('hi', err);
    }
    console.log(countdownObjectsArray);
    setActiveNav(renderType);
    renderCountdowns(countdownObjectsArray, renderType);
    setInterval(()=>renderTimes(countdownObjectsArray, renderType), 1000); // heartbeat, checks every 1 second
}
init();

let hasRun = false;
function startEditTitle(titleElement) {
    const currentText = titleElement.textContent;
    const tempInput = document.createElement('input');
    tempInput.type = 'text';
    tempInput.value = currentText
    tempInput.id = titleElement.id;

    titleElement.replaceWith(tempInput);
    tempInput.focus();
    tempInput.select();

    tempInput.addEventListener('keydown', (e)=>{
        if (e.key === 'Enter') finishEdit(tempInput, currentText);
        if (e.key === 'Escape') cancelEdit(tempInput, currentText);
    });
    tempInput.addEventListener('blur', () => finishEdit(tempInput, currentText));
}

function finishEdit(tempInput, fallbackText) {
    if (hasRun) return;
    hasRun = true;
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
    updateCountdown(id, {title: countdownObject.title});
}

function cancelEdit(tempInput, oldText) {
    tempInput.value = oldText;
    finishEdit(tempInput, oldText, id);
}

function selectMode(e) {
    if (e.target.matches('#all')) {
        renderType = 'all';
        setActiveNav(renderType);
        renderCountdowns(countdownObjectsArray, renderType);
    }
    if (e.target.matches('#assignments')) {
        renderType = 'task';
        setActiveNav('assignments');
        renderCountdowns(countdownObjectsArray, renderType);
    }
    if (e.target.matches('#misc')) {
        renderType = 'misc';
        setActiveNav(renderType);
        renderCountdowns(countdownObjectsArray, renderType);
    }
}

async function createCountdown() {
    const countdownObject = await saveCountdownToDB(defaultObject);
    countdownObjectsArray.push(countdownObject);
    renderCountdowns(countdownObjectsArray, renderType);
}

async function removeCountdown(id) {
    await deleteCountdownFromDB(id);
    countdownObjectsArray = countdownObjectsArray.filter(item => item.id !== id);
    renderCountdowns(countdownObjectsArray, renderType);
}

async function updateCountdown(id, countdownObject) {
    await updateCountdownToDB(id, countdownObject);
    renderCountdowns(countdownObjectsArray, renderType);
}

document.addEventListener('click', (e)=>{
    selectMode(e);

    const action = e.target.dataset.action || e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    const container = e.target.closest('[data-id]');
    const id = container?.dataset.id;

    if (action === "delete") {
        removeCountdown(id);
    }
    if (action === "add") {
        createCountdown();
    }
    if (action === "edit-title") {
        const titleElement = document.getElementById(`title-${id}`);
        startEditTitle(titleElement);
        hasRun = false;
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
})

document.addEventListener('change', (e)=>{
    if (e.target.matches('[data-action="time-input"]')) {
        const id = e.target.closest('[data-id]').dataset.id;
        const timeElement = e.target.closest('[data-action="time-input"]'); // Grabs whatever the inputed time is
        if (!timeElement) return;

        const countdownObject = countdownObjectsArray.find(item=>item.id===id);
        countdownObject.due_date = timeElement.value;
        updateCountdown(id, {due_date: new Date(countdownObject.due_date).toISOString()});
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
    if (e.target.matches('[data-action="toggle-mode"]')) {
        const toggle = e.target.closest('[data-action="toggle-mode"]');
        const id = e.target.closest('[data-id]').dataset.id;
        const countdownObject = countdownObjectsArray.find(item=>item.id===id);
        if (toggle.checked) {
            countdownObject.mode = 'hours';
        } else {
            countdownObject.mode = 'reg';
        }
        updateCountdown(id, {mode: countdownObject.mode})
        renderCountdowns(countdownObjectsArray, renderType);
    }
})

document.addEventListener('focusin', (e) => {
  if (e.target.matches('[data-action="data-input"]')) e.target.select();
});
