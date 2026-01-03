export function scoreResume({ text, skills, experience }) {
  let score = 0;

  score += Math.min(skills.length * 5, 40);
  score += Math.min(experience * 10, 30);

  if (text.length > 2000) score += 10;
  if (/project|developed|built/i.test(text)) score += 10;
  if (/blockchain|ai|ml/i.test(text)) score += 10;

  return Math.min(score, 100);
}
