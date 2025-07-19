import openai from "./openai";
import { index } from "./pinecone";

async function getMatchesFromPinecone(query) {
  const queryEmbedding = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: query,
  });

  const queryVector = queryEmbedding.data.data[0].embedding;

  const results = await index.query({
    vector: queryVector,
    topK: 5, 
    includeMetadata: true,
  });

  return results.matches;
}

export { getMatchesFromPinecone };
