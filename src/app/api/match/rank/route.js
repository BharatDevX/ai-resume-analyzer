import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { extractJobSkills } from "@/utils/jobSkillExtractor";
import { normalizeSkills } from "@/utils/skillNormalizer";
import { matchResumeToJob } from "@/utils/resumeJobMatcher";
import { semanticSimilarity } from "@/utils/semanticMatcher";
import { buildExplanation } from "@/utils/explainMatcher";
import { buildResumeImprovementPlan } from "@/utils/resumeImprover";

export async function POST(req) {
  await connectDB();

  const { jobDescription, minExperience = 0 } = await req.json();

  if (!jobDescription || jobDescription.length < 10) {
    return NextResponse.json(
      { error: "Invalid job description" },
      { status: 400 }
    );
  }

  const jobSkills = normalizeSkills(
    extractJobSkills(jobDescription)
  );

  const resumes = await Resume.find({});
  if (!resumes.length) {
    return NextResponse.json({ results: [] });
  }

  const rankedResults = resumes.map(resume => {
    const semantic = semanticSimilarity(
      resume.rawText || "",
      jobDescription
    );

    const match = matchResumeToJob({
      resumeSkills: resume.extractedSkills || [],
      jobSkills,
      resumeExperience: resume.experienceYears || 0,
      jobMinExperience: minExperience,
      similarity: semantic,
    });

    const skillScore = match.skillMatchPercent * 0.6;
    const semanticScore = semantic * 100 * 0.25;
    const experienceScore = match.experienceMatch ? 15 : 0;

    const finalScore =
      skillScore + semanticScore + experienceScore;

    const explanation = buildExplanation({
      jobSkills,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      irrelevantJobSkills: match.irrelevantJobSkills,
      experienceMatch: match.experienceMatch,
      skillScore: Math.round(skillScore),
      semanticScore: Math.round(semanticScore),
      experienceScore,
    });

    const improvementPlan = buildResumeImprovementPlan({
      jobSkills,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      resumeText: resume.rawText || "",
    });

    return {
      resumeId: resume._id,
      filename: resume.filename,
      score: Math.round(finalScore),
      decision:
        finalScore >= 75
          ? "STRONG MATCH"
          : finalScore >= 55
          ? "POTENTIAL MATCH"
          : "WEAK MATCH",
      ...explanation,
      improvementPlan,
    };
  });

  rankedResults.sort((a, b) => b.score - a.score);

  return NextResponse.json({
    totalResumes: rankedResults.length,
    rankedResults,
  });
}
