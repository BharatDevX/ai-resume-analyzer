// src/utils/skillNormalizer.js
import { SKILL_WEIGHTS } from "./skillWeight";

export function normalizeSkills(rawSkills = []) {
  const normalized = new Set();

  for (const skill of rawSkills) {
    const lower = skill.toLowerCase();

    for (const canonical of Object.keys(SKILL_WEIGHTS)) {
      // exact OR partial safe match
      if (
        lower === canonical ||
        lower.includes(canonical) ||
        canonical.includes(lower)
      ) {
        normalized.add(canonical);
      }
    }
  }

  return Array.from(normalized);
}
