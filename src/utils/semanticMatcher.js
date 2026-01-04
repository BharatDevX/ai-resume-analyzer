import natural from "natural";

const TfIdf = natural.TfIdf;

export function semanticSimilarity(textA, textB) {
  const tfidf = new TfIdf();

  tfidf.addDocument(textA);
  tfidf.addDocument(textB);

  const vectorA = [];
  const vectorB = [];

  tfidf.listTerms(0).forEach(t => vectorA.push(t.tfidf));
  tfidf.listTerms(1).forEach(t => vectorB.push(t.tfidf));

  return cosineSimilarity(vectorA, vectorB);
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0,
    magA = 0,
    magB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * (vecB[i] || 0);
    magA += vecA[i] ** 2;
    magB += (vecB[i] || 0) ** 2;
  }

  return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}
