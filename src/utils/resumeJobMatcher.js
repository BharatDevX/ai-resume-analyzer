import { SKILL_WEIGHTS } from "./skillWeight";

/**
 * Phase 5.1 — Anti Skill Inflation Resume Matcher
 */
export function matchResumeToJob({
  resumeSkills = [],
  jobSkills = [],
  resumeExperience = 0,
  jobMinExperience = 0,
  similarity = 0,
}) {
  const resumeSet = new Set(resumeSkills);
  const jobSet = new Set(jobSkills);

  // ✅ matched & missing skills
  const matchedSkills = jobSkills.filter(skill => resumeSet.has(skill));
  const missingSkills = jobSkills.filter(skill => !resumeSet.has(skill));

  // ❌ skills present in JD but irrelevant to resume
  const irrelevantJobSkills = jobSkills.filter(
    skill => !resumeSet.has(skill) && !SKILL_WEIGHTS[skill]
  );

  // 🎯 Weighted skill score
  let obtainedWeight = 0;
  let totalWeight = 0;

  for (const skill of jobSkills) {
    const weight = SKILL_WEIGHTS[skill] || 1;
    totalWeight += weight;
    if (resumeSet.has(skill)) {
      obtainedWeight += weight;
    }
  }

  const rawSkillScore =
    totalWeight === 0 ? 0 : obtainedWeight / totalWeight;

  // ❌ penalty for skill stuffing
  const inflationPenalty =
    irrelevantJobSkills.length * 0.05;

  const skillMatchPercent = Math.max(
    0,
    Math.min(1, rawSkillScore - inflationPenalty)
  );

  // 🧠 experience match
  const experienceMatch = resumeExperience >= jobMinExperience;

  return {
    matchedSkills,
    missingSkills,
    irrelevantJobSkills,
    skillMatchPercent: Math.round(skillMatchPercent * 100),
    experienceMatch,
    semanticSimilarity: similarity,
  };
}
