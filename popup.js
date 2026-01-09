async function initializePopup() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab) {
        document.getElementById("siteName").textContent = tab.title;
        document.getElementById("siteUrl").textContent = tab.url;
    }
}

initializePopup();