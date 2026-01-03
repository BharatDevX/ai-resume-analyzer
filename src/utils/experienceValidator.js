export function validateExperience(text, aiYears = 0) {
  let score = 0;

  if (/intern|trainee/i.test(text)) score += 1;
  if (/developer|engineer/i.test(text)) score += 2;
  if (/years|yr|experience/i.test(text)) score += 1;
  if (/202\d|201\d/.test(text)) score += 1;

  // Final experience decision
  return Math.max(aiYears, Math.min(score, aiYears + 1));
}
