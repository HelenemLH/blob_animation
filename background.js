chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("reminderAlarm", { when: Date.now() + 1000 * 60 * 60 * 12.5 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "reminderAlarm") {
        chrome.storage.local.set({ triggerBlob: true });
    }
});
