import { SKILL_WEIGHTS } from "./skillWeights";
import { matchResumeToJob } from "./resumeJobMatcher";

export function simulateATSImpact({
  resumeSkills = [],
  jobSkills = [],
  resumeExperience = 0,
  jobMinExperience = 0,
  resumeText = "",
  jobText = "",
  similarity = 0,
}) {
  // 🔹 CURRENT SCORE
  const currentResult = matchResumeToJob({
    resumeSkills,
    jobSkills,
    resumeExperience,
    jobMinExperience,
    resumeText,
    jobText,
    similarity,
  });

  const currentScore = currentResult.finalScore ?? currentResult.score ?? 0;

  // 🔹 SIMULATED IMPROVEMENTS
  const improvedSkills = new Set(resumeSkills);

  const addedSkills = [];
  for (const skill of jobSkills) {
    if (!improvedSkills.has(skill)) {
      improvedSkills.add(skill);
      addedSkills.push(skill);
    }
  }

  const improvedExperience =
    resumeExperience < jobMinExperience
      ? jobMinExperience
      : resumeExperience;

  // 🔹 AFTER SCORE
  const improvedResult = matchResumeToJob({
    resumeSkills: Array.from(improvedSkills),
    jobSkills,
    resumeExperience: improvedExperience,
    jobMinExperience,
    resumeText,
    jobText,
    similarity,
  });

  const improvedScore =
    improvedResult.finalScore ?? improvedResult.score ?? 0;

  const scoreGain = improvedScore - currentScore;

  // 🔹 IMPACT CONTRIBUTORS
  const highImpactSkills = addedSkills.filter(
    (s) => (SKILL_WEIGHTS[s] || 1) >= 4
  );

  return {
    currentScore,
    improvedScore,
    scoreGain,
    addedSkills,
    highImpactSkills,
    experienceFixed: resumeExperience < jobMinExperience,
  };
}
