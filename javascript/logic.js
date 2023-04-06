import { englishToMorse } from "./dictionary.js";

//global variables needed for user feedback about errors
export let unknownChars = [];
export let warning = "";
//error messages
export const unsupportedLanguageError = new Error(
	"This language is currently not supported. Please enter your message in either English or Morse Code."
);
export const unknownCharError = new Error("This character was not found.");
export const unknownMorseError = new Error("Morse character not found");

//Functions - listed in order of appearance from the main translation function

//A function that will translate and provide feedback to the user about errors
export const translateWithErrorWarnings = (userInput) => {
	unknownChars.length = 0;
	warning = "";
	let result;
	try {
		result = translate(userInput);
	} catch (e) {
		warning = `Warning: ${e.message}`;
	}
	if (unknownChars.length) {
		warning = `Warning: ${unknownChars.length === 1 ? "One" : "Some"} of the characters you used ${
			unknownChars.length === 1 ? "was" : "were"
		} unrecognised by the translator: ${unknownChars.join(", ")}.`;
	}
	return result;
};

//A function that translates into Morse code
export const translate = (userInput) => {
	const language = determineSourceLanguage(userInput);
	if (language === "english") {
		return translateToMorse(userInput);
	}
	if (language === "morse") {
		return translateToEnglish(userInput);
	}
	throw unsupportedLanguageError;
};

//A function that takes the userInput and determines the original language. Will return "unsupported language" if not English or Morse.
export const determineSourceLanguage = (userInput) => {
	//if input is morse, the user may use full stops instead of the dot symbol
	//replacing full stops with proper morse dots to confirm if morse first
	const stringToCheck = userInput.replaceAll(".", "•");
	const inputArray = stringToCheck.split("");
	if (inputArray.every((x) => /(•|-| )/.test(x))) {
		return "morse";
	} else if (inputArray.some((x) => /[A-Z0-9]/i.test(x))) {
		return "english";
	} else {
		return "unsupported language";
	}
};

//A function that returns morse code for English input
export const translateToMorse = (userInput) => {
	let output = "";
	for (let i = 0; i < userInput.length; i++) {
		if (/[A-Z0-9]/i.test(userInput[i])) {
			let morseChar = getMorseFromAlpha(userInput[i].toUpperCase());
			output += `${morseChar} `;
		} else {
			switch (userInput[i]) {
				case " ":
					//adding an additional two spaces to make the total spaces between morse words to be 3 spaces
					output += "\xa0\xa0";
					break;
				case ".":
				case "?":
				case "!":
					output += `${getMorseFromAlpha(userInput[i])} `;
					break;
				default:
					//unknown characters that the user attempted to use will be stored in an array to warn the user at the end that this character was
					//not translated
					unknownChars.push(userInput[i]);
					//translation will continue after storing that character
					break;
			}
		}
	}
	return output;
};

//A function that returns English from morse input
export const translateToEnglish = (userInput) => {
	//make any full stop input into proper dot input
	const cleanedInput = userInput.replaceAll(".", "•");
	//Split the input into an array of words. Assuming one space in between characters and three spaces in between words in the user input
	const inputArray = cleanedInput.split("   ").map((x) => x.split(" "));
	//filter out any extra words composed of just spaces that the above might have generated if user put too many spaces between words
	const wordArray = inputArray.filter((x, index, array) => !(array[index][0] === "" && array[index].length <= 1));
	//convert to English
	let outputArray = [];
	for (let i = 0; i < wordArray.length; i++) {
		const morseWord = wordArray[i];
		let alphaWord = "";
		//if all characters in the word are valid, this will work, otherwise, move to error handling block
		try {
			alphaWord = morseWord.map((x) => getAlphaFromMorse(x)).join("");
		} catch (e) {
			//try character by character to find error
			for (let j = 0; j < morseWord.length; j++) {
				try {
					let alphaChar = getAlphaFromMorse(morseWord[j]);
					alphaWord += alphaChar;
				} catch (e) {
					//keep a copy of problematic character for user feedback
					unknownChars.push(morseWord[j]);
				}
			}
		}
		// continue
		outputArray.push(alphaWord);
	}
	return outputArray.join(" ");
};

//A function that takes an alphanumeric character and returns it's morse character
//will throw an error if argument is not stored in the englishToMorse object
export const getMorseFromAlpha = (alphaChar) => {
	if (typeof alphaChar === "string" && englishToMorse[alphaChar.toUpperCase()]) {
		return englishToMorse[alphaChar.toUpperCase()];
	} else {
		throw unknownCharError;
	}
};

//A function that takes a morse character and returns it's alphanumeric character
export const getAlphaFromMorse = (morseChar) => {
	//if a user has extra, unpredictable spaces in their morse, this could trigger issues with the translation function, so extra spaces and empty strings should be ignored.
	if (morseChar === " " || morseChar === "") {
		return "";
	}
	//Otherwise
	const morseAlphabet = morseToEnglish();
	if (morseAlphabet[morseChar]) {
		return morseAlphabet[morseChar];
	} else {
		throw unknownMorseError;
	}
};

//A function to reverse the key value pairs so that morse characters are the keys
export const morseToEnglish = () => {
	const swapped = Object.entries(englishToMorse).map(([key, value]) => [value, key]);
	return Object.fromEntries(swapped);
};
