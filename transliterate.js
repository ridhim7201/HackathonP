const Sanscript = require("@indic-transliteration/sanscript");
const detectScript = require("./detectScript");
const { normalizeInput, postProcess } = require("./rules");

function transliterateText(inputText, sourceScript, targetScript) {
  let from = sourceScript === "auto" ? detectScript(inputText) : sourceScript;

  if (from === "unknown") {
    throw new Error("Could not detect source script");
  }

  const cleanedText = normalizeInput(inputText, from);

  let result;
  if (from === targetScript) {
    result = cleanedText;
  } else {
    result = Sanscript.t(cleanedText, from, targetScript);
  }

  result = postProcess(result, targetScript);

  return {
    detectedSource: from,
    target: targetScript,
    original: inputText,
    transliterated: result
  };
}

module.exports = transliterateText;
