import { translateWithErrorWarnings, warning } from "./logic.js";

//common variables needed for DOM manipulation
const promptTranslate = document.querySelector(".prompt-for-translate");
const submitBtn = document.querySelector(".prompt-for-translate__submit-input");
const translatedContainer = document.querySelector(".translated-container");
const translation = document.querySelector(".translated-container__translated-message");
const warningPara = document.querySelector(".translated-container__warning-message");
const againButton = document.querySelector(".translated-container__translate-again");

//DOM helper function
const insertWarningText = () => {
	warningPara.textContent = warning;
	translatedContainer.insertBefore(warningPara, againButton);
};

//event listeners
submitBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const userInput = document.querySelector(".prompt-for-translate__user-input").value;
	translation.textContent = translateWithErrorWarnings(userInput);
	promptTranslate.style.display = "none";
	translatedContainer.style.display = "flex";
	translatedContainer.insertBefore(translation, againButton);
	if (warning) {
		insertWarningText();
	}
});

againButton.addEventListener("click", (e) => {
	e.preventDefault();
	warningPara.textContent = "";
	translatedContainer.style.display = "none";
	promptTranslate.style.display = "flex";
	document.querySelector(".prompt-for-translate__user-input").value = "";
});
