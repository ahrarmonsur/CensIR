var conceptThreshold = 0.9;			// Confidence level of classification which qualifies it for a concept
var triggerConceptThreshold = 0.8;

$(document).ready(function() {
	var clarifaiApp = new Clarifai.App({
		apiKey: "be92bb8592f44e7fa02259b00bf0e332"
	});

	var imgs = getImagesInDOM();
	imgs.each(function() {
		var img = $(this);
		prepareForCensir(img);
		console.log(img[0].src);

		predictModeration(clarifaiApp, img[0].src)
			.then(function(resp) {
				handleModerationRating(resp, img);
			})
			.catch(function(err) {
				handleModerationRating(null, img);
			});
	});
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

function getImagesInDOM() {
	var imgs = $(document).find("img");
	console.log(imgs);
	return imgs;
};

function predictModeration(app, imgURL) {
	return app.models.predict("d16f390eb32cad478c7ae150069bd2c6", imgURL);
	// return app.models.predict("d16f390eb32cad478c7ae150069bd2c6", imgURL).then(
	// 	function(response) {
	// 		// do something with response
	// 		console.log("Resp: ", response);
	// 	},
	// 	function(err) {
	// 		console.log("ERR: ", err);
	// 		// there was an error
	// 	}
	// );
};

function wrapInCensirContainer(jqEls) {
	$(jqEls).each(function() {
		$(this).wrap("<div class='censirContainer'></div>").after("<div class='censirCenteredContainer'>HELLO</div>")	;
	});
	return jqEls;
};

function prepareForCensir(jqEls) {
	var loader = drawLoadingSpinner();
	var imgs = wrapInCensirContainer(jqEls).addClass("blur");

	// Add loading animations on top of each image
	imgs.siblings(".censirCenteredContainer").html(loader);
	return imgs;
};

function handleModerationRating(resp, jqEl) {
	// resp: Response object from the Clarifai API
	// jqEl: jquery DOM element to modify based on the classification
	if (!resp) {
		// Handle the case where there is a classification error
		addBypassableCensor(jqEl, "NOT SURE");
		return;
	}
	// console.log(resp);
	var concepts = resp.outputs[0].data.concepts;
	var safeConcept, drugConcept, goreConcept, suggestiveConcept, explicitConcept;
	concepts.forEach(function(el) {
		switch(el.name) {
			case "gore":
				goreConcept = el;
				break;
			case "drug":
				drugConcept = el;
				break;
			case "suggestive":
				suggestiveConcept = el;
				break;
			case "explicit":
				explicitConcept = el;
				break;
			case "safe":
				safeConcept = el;
				break;
		}
	})

	if (safeConcept && safeConcept.value > conceptThreshold) {
		// the content is deemed safe and can be uncensored
		jqEl.removeClass("blur").siblings(".censirCenteredContainer").empty();
	} else {
		// report the nature of the trigger content
		function triggerListReducer(accum, currConcept) {
			triggerName = currConcept.name;
			// console.log(triggername, currConcept.value);

			if (currConcept.value > triggerConceptThreshold) {
				return accum ? accum + ", " + triggerName : triggerName;
			} else {
				return accum;
			}
		};


		var triggerConcepts = [drugConcept, goreConcept, suggestiveConcept, explicitConcept]
		var triggerList = triggerConcepts.reduce(triggerListReducer, "");
		var triggerList = "Warning: " + (triggerList || "unknown" )

		// jqEl.siblings(".censirCenteredContainer").addClass("triggerWarning").html(triggerList);
		addBypassableCensor(jqEl, triggerList);
	}
};

function addBypassableCensor(jqEl, message) {
	if (message) {
		jqEl.siblings(".censirCenteredContainer").addClass("triggerWarning").html(message);
	}

}


function drawLoadingSpinner() {
	var elementHTML = "<div class=\"lds-grid\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";
	return elementHTML;
}


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