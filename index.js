const Days = document.getElementById('days');
const Hours = document.getElementById('hours');
const Minutes = document.getElementById('minutes');
const Seconds = document.getElementById('seconds');

let targetDateString = "February 21 2026 00:00:00";

const targetDate = new Date(targetDateString).getTime();

console.log(targetDate);
console.log(Date.now());

function timer() {
    const diffMs = targetDate - Date.now();
    console.log(diffMs);
    const days = Math.floor(diffMs / 1000 / 60 / 60 / 24);
    console.log(days);
    const hours = Math.floor(diffMs / 1000 / 60 / 60) % 24;
    console.log(hours);
    const minutes = Math.floor(diffMs / 1000 / 60) % 60;
    console.log(minutes);
    const seconds = Math.floor(diffMs / 1000) % 60;
    console.log(seconds);
}

timer();