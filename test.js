const transliterateText = require("./transliterate");

try {
  const teluguWord = "\u0C39\u0C48\u0C26\u0C30\u0C3E\u0C2C\u0C3E\u0C26\u0C4D";
  const result = transliterateText(teluguWord, "auto", "gurmukhi");
  console.log(result);
} catch (error) {
  console.error("Error:", error.message);
}
