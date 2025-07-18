// src/utils/context.ts
import { Pinecone } from "@pinecone-io/client";

export async function getContext(messages: any[]) {
  const lastMessage = messages[messages.length - 1];
  const context = await fetchContextFromPinecone(lastMessage.content);  // Replace with actual logic to pull from your knowledge base

  return [
    {
      role: "system",
      content: `The user asked: ${lastMessage.content}. Here is relevant information: ${context}`,
    },
  ];
}

async function fetchContextFromPinecone(query: string) {
  const pinecone = new Pinecone();
  const index = pinecone.Index("your-pinecone-index");

  const results = await index.query({
    query: query,
    top_k: 3,  // Adjust as necessary
    includeMetadata: true,
  });

  // Process results and return the relevant context
  return results.matches.map((match: any) => match.metadata.text).join(", ");
}
