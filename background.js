var rxLookfor = /^https?:\/\/(www\.)?google\.(com|\w\w(\.\w\w)?)\/.*?[?#&]q=/;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (rxLookfor.test(changeInfo.url)) {
        chrome.tabs.sendMessage(tabId, 'url-update');
    }
});