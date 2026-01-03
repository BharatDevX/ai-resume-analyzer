import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; // ✅ MISSING
import Resume from "@/models/Resume";
import { extractJobSkills } from "@/utils/jobSkillExtractor";
import { matchResumeToJob } from "@/utils/resumeJobMatcher";

export async function POST(req) {
  try {
    // ✅ CONNECT DATABASE FIRST
    await connectDB();

    const { resumeId, jobDescription, minExperience = 0 } = await req.json();

    if (!resumeId || !jobDescription) {
      return NextResponse.json(
        { error: "resumeId and jobDescription are required" },
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

    const jobSkills = extractJobSkills(jobDescription);

    // Phase 4.2 → rule-based similarity only
    const similarity = 0.7; // placeholder (AI comes in Phase 4.3)

    const result = matchResumeToJob({
      resumeSkills: resume.extractedSkills,
      jobSkills,
      resumeExperience: resume.experienceYears,
      jobMinExperience: minExperience,
      resumeText: resume.rawText,
      jobText: jobDescription,
      similarity,
    });

    return NextResponse.json({
      resumeId,
      jobSkills,
      ...result,
    });

  } catch (error) {
    console.error("❌ Match API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
