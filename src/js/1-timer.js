
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";

import "izitoast/dist/css/iziToast.min.css";

const timeData = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("button[data-start]");

const dataDays = document.querySelector("[data-days]");
const dataHours = document.querySelector("[data-hours]");
const dataMinutes = document.querySelector("[data-minutes]");
const dataSeconds = document.querySelector("[data-seconds]");

startBtn.disabled = true;

let timeSelected = null;
let timer = null;

flatpickr(timeData, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,

    onClose(selectedDates) {
        const nowDate = Date.now();
        timeSelected = selectedDates[0].getTime();

        if (timeSelected <= nowDate) {
            iziToast.error({
                message: "Please choose a date in the future"
            });
            startBtn.disabled = true;
            return;
        }
        startBtn.disabled = false;
    },
})


startBtn.addEventListener("click", handleStart);

function handleStart() {
    startBtn.disabled = true;
    timeData.disabled = true;

    timer = setInterval(() => {
        const nowTime = Date.now();
        const deltaDate = timeSelected - nowTime;

        if (deltaDate <= 0) {
            clearInterval(timer);

            updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            timeData.disabled = false;
            return;
        }
        const time = convertMs(deltaDate);

        updateTimer(time);
    }, 1000);
}

function updateTimer({ days, hours, minutes, seconds }) {
    dataDays.textContent = addLeadingZero(days);
    dataHours.textContent = addLeadingZero(hours);
    dataMinutes.textContent = addLeadingZero(minutes);
    dataSeconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);

    const hours = Math.floor((ms % day) / hour);

    const minutes = Math.floor(((ms % day) % hour) / minute);

    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}
