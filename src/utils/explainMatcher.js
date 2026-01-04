export function buildExplanation({
  jobSkills,
  matchedSkills,
  missingSkills,
  irrelevantJobSkills,
  experienceMatch,
  skillScore,
  semanticScore,
  experienceScore,
}) {
  const explanation = [];
  const suggestions = [];

  // Skill match explanation
  explanation.push(
    `Matched ${matchedSkills.length} out of ${jobSkills.length} required skills`
  );

  if (missingSkills.length > 0) {
    explanation.push(`Missing skills: ${missingSkills.join(", ")}`);
    missingSkills.forEach(skill =>
      suggestions.push(`Consider adding experience with ${skill}`)
    );
  }

  if (experienceMatch) {
    explanation.push("Resume meets minimum experience requirement");
  } else {
    explanation.push("Resume does not meet minimum experience requirement");
    suggestions.push("Gain more relevant work experience");
  }

  if (irrelevantJobSkills.length > 0) {
    explanation.push(
      "Irrelevant job keywords slightly reduced the score"
    );
  }

  // Semantic insight
  if (semanticScore > 0.7) {
    explanation.push(
      "Resume content strongly aligns with job description"
    );
  } else if (semanticScore > 0.4) {
    explanation.push(
      "Resume partially aligns with job description"
    );
  } else {
    explanation.push(
      "Resume content weakly aligns with job description"
    );
    suggestions.push(
      "Align resume summary and projects with job description language"
    );
  }

  return {
    explanation,
    suggestions: [...new Set(suggestions)], // remove duplicates
    scoreBreakdown: {
      skillScore,
      semanticScore,
      experienceScore,
      penalty:
        skillScore + semanticScore + experienceScore > 100
          ? 0
          : skillScore + semanticScore + experienceScore - 100,
    },
  };
}
