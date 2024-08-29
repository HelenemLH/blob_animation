document.getElementById('set-reminder').addEventListener('click', () => {
    const alarmInput = document.getElementById('reminder-time').value;
    if (alarmInput) {
        const alarmTime = new Date();
        const [hours, minutes] = alarmInput.split(":").map(Number);
        alarmTime.setHours(hours);
        alarmTime.setMinutes(minutes);
        alarmTime.setSeconds(0);

        const currentTime = new Date();
        let delay = alarmTime - currentTime;
        if (delay < 0) {
            delay += 24 * 60 * 60 * 1000;
        }

        chrome.alarms.create("reminderAlarm", { when: Date.now() + delay });
        alert('Alarm set for ' + alarmInput);
    } else {
        alert('Please enter a valid time.');
    }
});
