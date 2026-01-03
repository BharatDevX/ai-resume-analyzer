import OpenAI from "openai";

const aiClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Resume Analyzer",
  },
});

export default aiClient;
