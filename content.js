console.log("content.js: Hello World!s");
$(document).ready(function() {
	console.log("DOM READY!");
	$(document.documentElement).keydown(function (e) {
		console.log("Key Has Been Pressed!");
		// chrome.runtime.sendMessage({Message: "getTextFile"}, function (response) {
		// 	console.log( "RESP: ",response);
		// 	;
		// })

	})
});


// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	// If the received message has the expected format...
	console.log(msg);

	if (msg.text === 'report_back') {
		console.log("ASDAS", sender);

		// Call the specified callback, passing
		// the web-page's DOM content as argument
		sendResponse('BLAAAH');
	}
});



// console.log("Hello World!s");
// $(document).ready(function() {
// 	console.log("DOM READY!");
// 	$(document.documentElement).keydown(function (e) {
// 		console.log("Key Has Been Pressed!");
// 		chrome.runtime.sendMessage({Message: "getTextFile"}, function (response) {
// 			console.log( "RESP: ",response);
// 			;
// 		})
//
// 	})
// });
//
// // accept messages from background
// chrome.runtime.onMessage.addListener (function (request, sender, sendResponse) {
// 	alert("Contents Of Text File = " + request.fileData);
// });


// document.getElementById("test").addEventListener('click', () => {
// 	console.log("Popup DOM fully loaded and parsed");
//
// 	function modifyDOM() {
// 		//You can play with your DOM here or check URL against your regex
// 		console.log('Tab script:');
// 		console.log(document.body);
// 		return document.body.innerHTML;
// 	}
//
// 	//We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
// 	chrome.tabs.executeScript({
// 		code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
// 	}, (results) => {
// 		//Here we have just the innerHTML and not DOM structure
// 		console.log('Popup script:')
// 	console.log(results[0]);
// 	});
// });