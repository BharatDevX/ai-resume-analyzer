import { SKILL_WEIGHTS } from "./skillWeights";

export function analyzeATS({
  resumeSkills = [],
  jobSkills = [],
  resumeExperience = 0,
  jobMinExperience = 0,
}) {
  const resumeSet = new Set(resumeSkills);
  const jobSet = new Set(jobSkills);

  const matchedSkills = [];
  const missingSkills = [];
  const weakSkills = [];

  for (const skill of jobSet) {
    if (resumeSet.has(skill)) {
      matchedSkills.push(skill);

      if ((SKILL_WEIGHTS[skill] || 1) <= 2) {
        weakSkills.push(skill);
      }
    } else {
      missingSkills.push(skill);
    }
  }

  const experienceGap = resumeExperience < jobMinExperience;

  const recommendations = [];

  if (missingSkills.includes("react"))
    recommendations.push("Add a React-based frontend project");

  if (missingSkills.includes("nodejs"))
    recommendations.push("Add Node.js + Express backend project");

  if (missingSkills.includes("mongodb"))
    recommendations.push("Mention MongoDB schema & queries");

  if (weakSkills.length)
    recommendations.push("Strengthen weak skills with detailed bullet points");

  if (experienceGap)
    recommendations.push("Add internship / freelance experience");

  return {
    matchedSkills,
    missingSkills,
    weakSkills,
    experienceGap,
    recommendations,
  };
}
