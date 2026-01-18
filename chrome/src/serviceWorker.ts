console.log('serviceWorker script loaded')

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        chrome.runtime.sendMessage({
            type: 'TAB_CHANGED',
            title: tab.title,
            url: tab.url
        }).catch(() => {});
    });
});
