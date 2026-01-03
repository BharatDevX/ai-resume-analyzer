export function matchResumeToJob({
  resumeSkills = [],
  jobSkills = [],
  resumeExperience = 0,
  jobMinExperience = 0,
  resumeText = "",
  jobText = "",
  similarity = 0, // cosine similarity (0–1)
}) {
  // ---- Skill Match ----
  const matchedSkills = resumeSkills.filter(s => jobSkills.includes(s));
  const missingSkills = jobSkills.filter(s => !resumeSkills.includes(s));

  const skillScore = jobSkills.length
    ? (matchedSkills.length / jobSkills.length) * 50
    : 0;

  // ---- Experience Match ----
  const experienceScore =
    resumeExperience >= jobMinExperience ? 20 : (resumeExperience / jobMinExperience) * 20;

  // ---- Keyword Coverage ----
  const keywords = jobText.split(/\W+/).filter(w => w.length > 4);
  const keywordHits = keywords.filter(k =>
    resumeText.toLowerCase().includes(k.toLowerCase())
  );

  const keywordScore = Math.min(
    (keywordHits.length / keywords.length) * 15,
    15
  );

  // ---- Semantic Score ----
  const semanticScore = similarity * 15;

  const totalScore = Math.min(
    skillScore + experienceScore + keywordScore + semanticScore,
    100
  );

  return {
    totalScore: Math.round(totalScore),
    matchedSkills,
    missingSkills,
    experienceFit: resumeExperience >= jobMinExperience,
  };
}
