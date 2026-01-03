export function extractExperience(text) {
  const yearMatches = text.match(/(\d+)\+?\s+years?/);
  if (yearMatches) {
    return parseInt(yearMatches[1]);
  }
  return null;
}
