import { SKILL_DICTIONARY } from "./skillDictionary";

export function extractJobSkills(jobText = "") {
  const found = new Set();
  const lower = jobText.toLowerCase();

  for (const [skill, variants] of Object.entries(SKILL_DICTIONARY)) {
    if (variants.some(v => lower.includes(v))) {
      found.add(skill);
    }
  }

  return Array.from(found);
}
