# Morse-Code-Translator

This was a project completed as part of my training with Nology. The MVP was to create a morse code translator using vanilla Javascript and conduct unit testing using Jest. 
A personal goal of mine for this project was to improve my understanding of error handling by throwing and catching various error messages, which would then be used to provide error feedback to the user. For this reason, I have purposely designed several functions in this app to throw errors if invalid arguments were passed and included some less succinct code in places in order to practise try/catch statements. 

As part of this project, I created:
- Basic functions to convert a single character into the opposite language (English <> Morse Code). These functions would throw an error with invalid parameters.
- A function to detect the input language 
- Functions to translate any length string into the opposite language, given the detected source language. Error handling was used to ignore invalid parameters during the translation, but return a warning message to the user about which character/s were not translated.
- A Jest test suite for the logic functions that tested both predictable inputs and edge cases. 
