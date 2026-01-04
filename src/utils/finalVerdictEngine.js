export function generateFinalVerdict({
  score,
  atsAnalysis,
  atsImpact,
}) {
  let verdict = "REJECT";
  let confidence = Math.round(score);
  let reason = "";
  const strengths = [];
  const gaps = [];
  const recommendations = [];

  // ✅ Verdict Rules
  if (confidence >= 75 && atsAnalysis.experienceMatch) {
    verdict = "PASS";
    reason = "Strong skill alignment and experience match";
  } else if (confidence >= 55) {
    verdict = "REVIEW";
    reason = "Partial skill match; manual review recommended";
  } else {
    verdict = "REJECT";
    reason = "Insufficient skill and ATS alignment";
  }

  // ✅ Strengths
  if (atsImpact.matchedSkills?.length) {
    strengths.push(
      `Matched key skills: ${atsImpact.matchedSkills.join(", ")}`
    );
  }

  if (atsAnalysis.experienceMatch) {
    strengths.push("Experience meets or exceeds job requirement");
  }

  // ❌ Gaps
  if (atsImpact.missingSkills?.length) {
    gaps.push(
      `Missing skills: ${atsImpact.missingSkills.join(", ")}`
    );
    recommendations.push(
      `Add missing skills: ${atsImpact.missingSkills.join(", ")}`
    );
  }

  if (!atsAnalysis.experienceMatch) {
    gaps.push("Experience below required threshold");
    recommendations.push(
      "Highlight relevant projects or internships to compensate"
    );
  }

  // 🛠 Fallback
  if (!recommendations.length) {
    recommendations.push("Resume is ATS-optimized");
  }

  return {
    finalVerdict: verdict,
    confidence,
    reason,
    strengths,
    gaps,
    recommendations,
  };
}
