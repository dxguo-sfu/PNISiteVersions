document.addEventListener('DOMContentLoaded', function(){
    chrome.runtime.sendMessage({text: "popup_ready"}, function(content){
        var resultsDiv = document.getElementById("results");
        content.forEach(function(element){
            var line;
            if(element == ""){
                line = document.createElement("P");
            } else {
                line = document.createElement("DIV");
                var text = document.createTextNode(element);
                line.appendChild(text);
            }
            resultsDiv.appendChild(line);
        });
    });
});