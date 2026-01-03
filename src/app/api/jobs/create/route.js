import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import JobDescription from '@/models/JobDescription';
import { generateEmbedding } from '@/lib/embeddings';
import { cleanText } from '@/utils/textCleaner';
import { extractSkills } from '@/utils/skillExtractor';

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const cleanedText = cleanText(body.description);
  const skills = extractSkills(cleanedText);
  const embedding = await generateEmbedding(cleanedText);

  const job = await JobDescription.create({
    title: body.title,
    description: cleanedText,
    requiredSkills: skills,
    embedding,
  });

  return NextResponse.json({ job });
}