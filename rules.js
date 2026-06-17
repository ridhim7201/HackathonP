function normalizeInput(text, script) {
  return text;
}

function postProcess(text, targetScript) {
  if (targetScript === "tamil") {
    return text
      .replace(/க்ஹ/g, "க")
      .replace(/ஜ்ஹ/g, "ஜ")
      .replace(/த்ஹ/g, "த")
      .replace(/ப்ஹ/g, "ப");
  }

  return text;
}

module.exports = { normalizeInput, postProcess };
