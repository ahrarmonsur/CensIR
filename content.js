var conceptThreshold = 0.9;			// Confidence level of classification which qualifies it for a concept
var triggerConceptThreshold = 0.7;

$(document).ready(function() {
	var clarifaiApp = new Clarifai.App({
		apiKey: "be92bb8592f44e7fa02259b00bf0e332"
	});

	var imgs = getImagesInDOM();
	imgs.each(function() {
		var img = $(this);
		prepareForCensir(img);

		predictModeration(clarifaiApp, img[0].src)
			.then(function(resp) {
				handleModerationRating(resp, img);
			})
			.catch(function(err) {
				handleModerationRating(null, img);
			});
	});
});


function getImagesInDOM() {
	var imgs = $(document).find("img");
	return imgs;
};

function predictModeration(app, imgURL) {
	return app.models.predict("d16f390eb32cad478c7ae150069bd2c6", imgURL);
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
	addBypassableCensor(imgs, loader);
	return imgs;
};

function handleModerationRating(resp, jqEl) {
	// resp: Response object from the Clarifai API
	// jqEl: jquery DOM element to modify based on the classification
	if (!resp) {
		// Handle the case where there is a classification error
		// addBypassableCensor(jqEl, "NOT SURE");
		return;
	}
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
			switch(currConcept.name) {
				case "drug":
					triggerName = "drugs"
					break;
				case "suggestive":
				case "explicit":
					triggerName = currConcept.name + " content";
					break;
				default:
					triggerName = currConcept.name;
					break;
			}
			triggerName = triggerName + " (" + (currConcept.value * 100).toFixed(1) + "%)";

			if (currConcept.value > triggerConceptThreshold) {
				return accum ? accum + ", " + triggerName : triggerName;
			} else {
				return accum;
			}
		};


		var triggerConcepts = [drugConcept, goreConcept, suggestiveConcept, explicitConcept]
		var triggerList = triggerConcepts.reduce(triggerListReducer, "");
		var triggerList = "May contain" + (triggerList ? ": " + triggerList : " unsafe content");

		// jqEl.siblings(".censirCenteredContainer").addClass("triggerWarning").html(triggerList);
		addBypassableCensor(jqEl, triggerList, true);
	}
};

function addBypassableCensor(jqEl, message, isWarning) {
	if (message) {
		$(jqEl).parent(".censirContainer").addClass("bypassable");
		$(jqEl).siblings(".censirCenteredContainer").html(message);
		if (isWarning) {
			$(jqEl).siblings(".censirCenteredContainer").addClass("triggerWarning");
		}
	}

	$(jqEl).parent(".censirContainer").click(function(e) {
		if ($(this).hasClass("bypassable")) {
			e.preventDefault();
		}
		$(jqEl).removeClass("blur").siblings(".censirCenteredContainer").removeClass("triggerWarning").empty();
	});
};


function drawLoadingSpinner() {
	var elementHTML = "<div class=\"lds-grid\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";
	return elementHTML;
};
