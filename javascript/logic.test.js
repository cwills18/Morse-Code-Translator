import {
	translate,
	translateToEnglish,
	translateToMorse,
	determineSourceLanguage,
	getAlphaFromMorse,
	getMorseFromAlpha,
	unknownMorseError,
	unknownCharError,
	unsupportedLanguageError,
} from "./logic.js";

//tests for each of the helper functions required for the morse translator
//listed from smallest scale to largest scale

describe("testing getMorseFromAlpha function", () => {
	test("testing that it returns the correct character", () => {
		expect(getMorseFromAlpha("a")).toBe("•-");
		expect(getMorseFromAlpha("P")).toBe("•--•");
		expect(getMorseFromAlpha("3")).toBe("•••--");
		expect(getMorseFromAlpha("q")).toBe("--•-");
	});
	test("testing that it throws an unknownCharError if char is not a string or found in the dictionary of morse symbols", () => {
		expect(() => {
			getMorseFromAlpha("*");
		}).toThrow(unknownCharError);
		expect(() => {
			getMorseFromAlpha("(");
		}).toThrow(unknownCharError);
		expect(() => {
			getMorseFromAlpha(3);
		}).toThrow(unknownCharError);
		expect(() => {
			getMorseFromAlpha(null);
		}).toThrow(unknownCharError);
	});
});

describe("testing getAlphaFromMorse function", () => {
	test("testing that it returns the correct character", () => {
		expect(getAlphaFromMorse("----•")).toBe("9");
		expect(getAlphaFromMorse("---")).toBe("O");
		expect(getAlphaFromMorse("--•")).toBe("G");
		expect(getAlphaFromMorse("-•-•")).toBe("C");
	});
	test("testing that it throws an unknownMorse error if no char found", () => {
		expect(() => {
			getAlphaFromMorse("------•");
		}).toThrow(unknownMorseError);
		expect(() => {
			getAlphaFromMorse("-••---•");
		}).toThrow(unknownMorseError);
	});
});

describe("testing determineSourceLanguage function", () => {
	test("testing that it returns the correct language", () => {
		expect(determineSourceLanguage("----•")).toBe("morse");
		expect(determineSourceLanguage("meet at 12pm.")).toBe("english");
		expect(determineSourceLanguage(".... . .-.. .-.. ---   - .... . .-. . .-.-.-   .... --- .--   .- .-. .   -.-- --- ..- ..--..")).toBe(
			"morse"
		);
		expect(determineSourceLanguage("•••• • •-•• •-•• ---   - ••••")).toBe("morse");
		expect(determineSourceLanguage("1234567890")).toBe("english");
	});

	test("checking that strings of invalid inputs return as an unsupported language, but if there are a couple English characters in the mix, it will treat it as English", () => {
		expect(determineSourceLanguage("%^&#$@")).toBe("unsupported language");
		expect(determineSourceLanguage("べんきょう")).toBe("unsupported language");
		expect(determineSourceLanguage("わtashi*&")).toBe("english");
	});
});

describe("testing translateToEnglish function", () => {
	test("testing that it returns the correct string for valid inputs", () => {
		expect(translateToEnglish("----•")).toBe("9");
		expect(translateToEnglish(".-- .... .- - ...   - .... .   - .. -- .")).toBe("WHATS THE TIME");
		expect(translateToEnglish("- •- -• --•• •- -• •• •- •---- ••---")).toBe("TANZANIA12");
		expect(translateToEnglish(".... . .-.. .-.. ---   - .... . .-. . .-.-.-   .... --- .--   .- .-. .   -.-- --- ..- ..--..")).toBe(
			"HELLO THERE. HOW ARE YOU?"
		);
	});
	test("testing that morse strings with unexpected spacing in between words and/or letters will still return correctly", () => {
		expect(translateToEnglish("--     --•")).toBe("M G");
		expect(translateToEnglish(" •---     -•- ")).toBe("J K");
		expect(translateToEnglish(".-- .... .- - ...      - .... .        - .. -- .   ")).toBe("WHATS THE TIME");
		expect(translateToEnglish(".--   ....  .- - ...      - .... .        - ..   --  .")).toBe("W HATS THE TI ME");
	});
	test("testing that morse strings that have an invalid character will ignore that character and complete the rest of the string", () => {
		expect(translateToEnglish("--     ------•     --•")).toBe("M  G");
		expect(translateToEnglish(" --...--.---•  •---  -•-")).toBe("JK");
	});
});

describe("testing translateToMorse function", () => {
	test("testing that it returns the correct string for valid inputs", () => {
		expect(translateToMorse("hello")).toBe("•••• • •-•• •-•• --- ");
		expect(translateToMorse("wHOs ThERe?")).toBe("•-- •••• --- ••• \xa0\xa0- •••• • •-• • ••--•• ");
		expect(translateToMorse("Do not go gentle into that good night.")).toBe(
			"-•• --- \xa0\xa0-• --- - \xa0\xa0--• --- \xa0\xa0--• • -• - •-•• • \xa0\xa0•• -• - --- \xa0\xa0- •••• •- - \xa0\xa0--• --- --- -•• \xa0\xa0-• •• --• •••• - •-•-•- "
		);
		expect(translateToMorse("Rage! rage!")).toBe("•-• •- --• • -•-•-- \xa0\xa0•-• •- --• • -•-•-- ");
	});
	test("testing that it handles unusually spaced inputs", () => {
		expect(translateToMorse("h ello")).toBe("•••• \xa0\xa0• •-•• •-•• --- ");
		expect(translateToMorse("wHOs    ThERe?")).toBe("•-- •••• --- ••• \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0- •••• • •-• • ••--•• ");
	});
	test("testing that it will ignore a special character passed in", () => {
		expect(translateToMorse("h#ello")).toBe("•••• • •-•• •-•• --- ");
		expect(translateToMorse("wHOs**ThE&Re?")).toBe("•-- •••• --- ••• - •••• • •-• • ••--•• ");
	});
});

describe("testing translate function", () => {
	test("testing that it returns the correct string for valid inputs", () => {
		expect(translate("hello")).toBe("•••• • •-•• •-•• --- ");
		expect(translate("- •- -• --•• •- -• •• •- •---- ••---")).toBe("TANZANIA12");
		expect(translate("Do not go gentle into that good night.")).toBe(
			"-•• --- \xa0\xa0-• --- - \xa0\xa0--• --- \xa0\xa0--• • -• - •-•• • \xa0\xa0•• -• - --- \xa0\xa0- •••• •- - \xa0\xa0--• --- --- -•• \xa0\xa0-• •• --• •••• - •-•-•- "
		);
		expect(translate(" --...--.---•  •---  -•-")).toBe("JK");
	});
	test("invalid languages and/or strings of unknown characters should return the unsupportedLanguageError", () => {
		expect(() => {
			translate("コンピューター");
		}).toThrow(unsupportedLanguageError);
		expect(() => {
			translate("*&^#$");
		}).toThrow(unsupportedLanguageError);
	});
});
