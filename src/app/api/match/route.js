import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { extractJobSkills } from "@/utils/jobSkillExtractor";
import { normalizeSkills } from "@/utils/skillNormalizer";
import { matchResumeToJob } from "@/utils/resumeJobMatcher";
import { semanticSimilarity } from "@/utils/semanticMatcher";
import { analyzeATS } from "@/utils/atsGapAnalyzer";
import { simulateATSImpact } from "@/utils/atsImpactSimulator";
import { generateFinalVerdict } from "@/utils/finalVerdictEngine";

export async function POST(req) {
  try {
    await connectDB();

    const { resumeId, jobDescription, minExperience = 0 } =
      await req.json();

    if (!resumeId || !jobDescription) {
      return NextResponse.json(
        { error: "resumeId & jobDescription required" },
        { status: 400 }
      );
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    // ✅ 1. Extract + normalize job skills FIRST
    const jobSkills = normalizeSkills(
      extractJobSkills(jobDescription)
    );

    // ✅ 2. Normalize resume skills
    const resumeSkills = normalizeSkills(
      resume.extractedSkills || []
    );

    // ✅ 3. Semantic similarity
    const similarity = semanticSimilarity(
      resume.rawText || "",
      jobDescription
    );

    // ✅ 4. Core ATS match
    const result = matchResumeToJob({
      resumeSkills,
      jobSkills,
      resumeExperience: resume.experienceYears || 0,
      jobMinExperience: minExperience,
      similarity,
    });

    // ✅ 5. ATS gap analysis
    const atsAnalysis = analyzeATS({
      resumeSkills,
      jobSkills,
      resumeExperience: resume.experienceYears || 0,
      jobMinExperience: minExperience,
    });

    // ✅ 6. ATS impact simulation
    const atsImpact = simulateATSImpact({
      resumeSkills,
      jobSkills,
      resumeExperience: resume.experienceYears || 0,
      jobMinExperience: minExperience,
      resumeText: resume.rawText || "",
      jobText: jobDescription,
      similarity,
    });
    const finalVerdict = generateFinalVerdict({
  score: result.score ?? result.matchScore ?? 0,
  atsAnalysis,
  atsImpact,
});

    return NextResponse.json({
      resumeId,
      jobSkills,  
      ...result,
      atsAnalysis,
      atsImpact,
      finalVerdict,
    });

  } catch (err) {
    console.error("❌ MATCH ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
