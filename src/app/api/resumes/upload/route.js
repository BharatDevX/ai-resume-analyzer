import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { extractResumeText } from "@/utils/pdfParser";
import { cleanText } from "@/utils/textCleaner";
import { analyzeResumeWithAI } from "@/lib/aiResumeAnalyzer";
import { generateEmbedding } from "@/lib/embeddings";
import { normalizeSkills } from "@/utils/skillNormalizer";
import { validateExperience } from "@/utils/experienceValidator";
import { scoreResume } from "@/utils/resumeScorer";
export async function POST(req) {
  try {
    // ✅ Connect DB
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("resume");

    if (!file) {
      return NextResponse.json(
        { error: "No resume file uploaded" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // ✅ Ensure uploads directory exists (recursive = SAFE)
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ✅ Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    // ✅ SINGLE SOURCE OF TRUTH (PDF → OCR fallback handled inside)
    const resumeText = await extractResumeText(filePath);

    if (!resumeText) {
  return NextResponse.json(
    { error: "Resume text extraction failed" },
    { status: 400 }
  );
}


    const cleanedText = cleanText(resumeText);

    // ✅ AI analysis
    const aiResult = await analyzeResumeWithAI(cleanedText);

const rawSkills = aiResult.skills ?? [];
    // ✅ Embeddings
    const embedding = await generateEmbedding(cleanedText);

const normalizedSkills = normalizeSkills(rawSkills);
const experience = validateExperience(cleanedText, aiResult.experienceYears ?? 0);
const resumeScore = scoreResume({
  text: cleanedText,
  skills: normalizedSkills,
  experience,
});
    // ✅ Save to DB
    const resume = await Resume.create({
      filename: fileName,
      rawText: cleanedText,
      extractedSkills: normalizedSkills,
      experienceYears: experience,
      resumeScore,
      embedding,
      
    });

    return NextResponse.json({
      message: "Resume uploaded & processed successfully",
      resume,
    });
  } catch (error) {
    console.error("❌ Resume upload error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
