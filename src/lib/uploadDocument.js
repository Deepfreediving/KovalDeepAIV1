import fs from "fs";
import openai from "./openai";
import { index } from "./pinecone";

async function processDocuments(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");

  // Generate embeddings for the document
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: fileContent,
  });

  const vector = response.data.data[0].embedding;

  // Prepare metadata
  const metadata = {
    content: fileContent,
    source: filePath,
  };

  // Upsert to Pinecone
  await index.upsert([
    {
      id: filePath, 
      values: vector,
      metadata: metadata,
    },
  ]);
}

// Call the function with your file path
processDocuments("/path/to/your/document.txt");
