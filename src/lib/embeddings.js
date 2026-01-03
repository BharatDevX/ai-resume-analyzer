import aiClient from "./aiClient";

export async function generateEmbedding(text) {
  const response = await aiClient.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}