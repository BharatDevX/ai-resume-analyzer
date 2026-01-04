import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { extractJobSkills } from "@/utils/jobSkillExtractor";
import { normalizeSkills } from "@/utils/skillNormalizer";
import { matchResumeToJob } from "@/utils/resumeJobMatcher";
import { semanticSimilarity } from "@/utils/semanticMatcher";

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

    const jobSkills = normalizeSkills(
      extractJobSkills(jobDescription)
    );

    const similarity = semanticSimilarity(
      resume.rawText || "",
      jobDescription
    );

    const result = matchResumeToJob({
      resumeSkills: resume.extractedSkills || [],
      jobSkills,
      resumeExperience: resume.experienceYears || 0,
      jobMinExperience: minExperience,
      similarity,
    });

    return NextResponse.json({
      resumeId,
      jobSkills,
      ...result,
    });
  } catch (err) {
    console.error("❌ MATCH ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
