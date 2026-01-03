import aiClient from "@/lib/aiClient";

function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid AI JSON output");
    return JSON.parse(match[0]);
  }
}

export async function analyzeResumeWithAI(resumeText) {
  const prompt = `
You are an ATS resume parser.

Extract:
1. skills (array of lowercase strings)
2. experienceYears (number)

Return ONLY valid JSON in this format:
{
  "skills": [],
  "experienceYears": 0
}

Resume:
"""
${resumeText}
"""
`;

  const response = await aiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  return safeJSONParse(response.choices[0].message.content);
}
