var urlRegex1 = /^https?:\/\/(?:[^./?#]+\.)?staples\.com/; 
var urlRegex2 = /^https?:\/\/(?:[^./?#]+\.)?pnistaging\.com/;

chrome.browserAction.onClicked.addListener(function(tab) {
    if (urlRegex1.test(tab.url) || urlRegex2.test(tab.url)) {
        var phoenix = {
            version: null,
            message: "get_phx",
            domain: getDomain(tab),
            got: false
        };
        var photosite = {
            version: null, 
            message: "get_pho",
            domain: getDomain(tab) + "/legacy/ping.aspx?p=btwd",
            got: false
        };
        var data = {phx: phoenix, pho: photosite, start: tab};

        openTabAndContinue(data);
    }
})

function getDomain(tab) {
    var currentUrl = new URL(tab.url);
    return "https://" + currentUrl.hostname;
}

function openTabAndContinue(data) {
    var siteData = getSiteData(data);
    if(siteData == null) { return; }
    
    chrome.tabs.create({url: siteData.domain}, function(tab){
        siteData.tabId = tab.id;
        getVersionAndContinue( siteData, data);
    });
}

function getVersionAndContinue(siteData, data) {
    chrome.tabs.onUpdated.addListener(function (tabId, info, tab){
        if(siteData.version == null && info.status === 'complete' && tabId == siteData.tabId) {
            chrome.tabs.sendMessage(tab.id, {text: siteData.message}, function(version){
                siteData.version = version;
                siteData.got = true;
                openTabAndContinue(data);
                return;
            });
        }
    });
}

function getSiteData(data) {
    if(!data.phx.got) {
        return data.phx;
    } else if (!data.pho.got) {
        return data.pho;
    } else {
        chrome.tabs.remove(data.phx.tabId);
        chrome.tabs.remove(data.pho.tabId);
        chrome.tabs.update(data.start.id, {selected:true});
        displayResult(data);

        return null;
    }
}

function displayResult(data) {
    var finalResult = getFinalResult(data);

    chrome.windows.create({url: "results.html", type: 'popup', height: 200, width: 350});

    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
        if(msg.text && (msg.text == "popup_ready")){
            sendResponse(finalResult);
            window.location.reload(true);
        }
    });

}

function getFinalResult(data) {
    var url = new URL(data.phx.domain);
    return [url.hostname, 
        "Phoenix Site " + data.phx.version,
        "Photosite " + data.pho.version,
        "", 
        "(PHX " + data.phx.version + ", PHO " + data.pho.version + ")"];
}

