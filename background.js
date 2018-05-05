chrome.runtime.onInstalled.addListener(function() {
	console.log("HELLOW");
});

chrome.browserAction.onClicked.addListener(function (tab) {
	// Send a message specifying a callback too
	console.log("Clicked");
	console.log(tab);

	chrome.tabs.sendMessage(tab.id, {text: "report_back"}, null, reportBackCallback);
});

function reportBackCallback(inputStr) {
	console.log("TAB SENT THIISSSSSS: " + inputStr);
}

// console.log("Atleast reached background.js")
// chrome.runtime.onMessage.addListener (
// 	function (request, sender, sendResponse) {
// 		console.log("Reached Background.js");
// 		if (request.Message == "getTextFile") {
// 			console.log("Entered IF Block");
// 			$.get("http://localhost:63342/Projects/StackOverflow/ChromeEXT/helloWorld1", function(response) {
// 				console.log(response);
//
// 				// to send back your response  to the current tab
// 				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// 					chrome.tabs.sendMessage(tabs[0].id, {fileData: response}, function(response) {
// 						;
// 					});
// 				});
//
//
// 			})
// 		}
// 		else {
// 			console.log("Did not receive the response!!!")
// 		}
// 	}
// );