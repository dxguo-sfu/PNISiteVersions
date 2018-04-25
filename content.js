chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.text && (msg.text == "get_phx")) {
        var version = getVersionNumber(document.getElementsByClassName("version")[0].innerHTML, "Phoenix Site v");
        sendResponse(version);
    } else if (msg.text && (msg.text == "get_pho")) {
        var version = getVersionNumber(document.getElementsByTagName("pre")[0].innerHTML, "Version: ");
        sendResponse(version);
    } else {
        alert("INTERNAL ERROR: Fail content");
    }
});

function getVersionNumber(pageText, pageTarget) {
    var pageIndex = pageText.indexOf(pageTarget) + pageTarget.length;
    return pageText.substring(pageIndex).trim();
}