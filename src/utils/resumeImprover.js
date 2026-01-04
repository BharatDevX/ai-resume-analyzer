export function buildResumeImprovementPlan({
  jobSkills,
  matchedSkills,
  missingSkills,
  resumeText,
}) {
  const skillSuggestions = [];
  const resumeSuggestions = [];
  const priorityActions = [];

  // Skill-level suggestions
  missingSkills.forEach(skill => {
    skillSuggestions.push(
      `Add at least one project or experience demonstrating ${skill}`
    );
    priorityActions.push(`Add ${skill} skill`);
  });

  // Resume content suggestions
  jobSkills.forEach(skill => {
    if (!resumeText.toLowerCase().includes(skill)) {
      resumeSuggestions.push(
        `Mention ${skill} explicitly in skills or project descriptions`
      );
    }
  });

  if (resumeText.length < 800) {
    resumeSuggestions.push(
      "Increase resume detail by elaborating projects and responsibilities"
    );
  }

  if (!resumeText.toLowerCase().includes("project")) {
    resumeSuggestions.push(
      "Add a dedicated Projects section with measurable outcomes"
    );
  }

  if (!resumeText.toLowerCase().includes("experience")) {
    resumeSuggestions.push(
      "Add a Work Experience section even if it includes internships or freelancing"
    );
  }

  // Remove duplicates
  return {
    missingSkills,
    skillSuggestions: [...new Set(skillSuggestions)],
    resumeSuggestions: [...new Set(resumeSuggestions)],
    priorityActions: [...new Set(priorityActions)],
  };
}
