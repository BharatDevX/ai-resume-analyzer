import aiClient from "./aiClient";

export async function generateAIResponse(prompt) {
  const completion = await aiClient.chat.completions.create({
    model: "openai/gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an ATS resume expert." },
      { role: "user", content: prompt }
    ],
    temperature: 0.4,
  });

  return completion.choices[0].message.content;
}
