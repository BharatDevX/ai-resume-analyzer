import { SKILL_DICTIONARY } from "./skillDictionary";

export function normalizeSkills(rawSkills = []) {
  const normalized = new Set();

  for (const skill of rawSkills) {
    const lower = skill.toLowerCase();

    for (const [canonical, variants] of Object.entries(SKILL_DICTIONARY)) {
      if (variants.some(v => lower.includes(v))) {
        normalized.add(canonical);
      }
    }
  }

  return Array.from(normalized);
}
