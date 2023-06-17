chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    navigator.clipboard.writeText(message.action);
    return true
});
