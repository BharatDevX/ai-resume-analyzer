export function cleanText(text) {
  return text
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s.,]/gi, "")
    .trim()
    .toLowerCase();
}

