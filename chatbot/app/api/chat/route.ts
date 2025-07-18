import { PineconeClient } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";  // Assuming this is the correct streamText import

// Initialize Pinecone client
const pinecone = new PineconeClient();

// Function to initialize Pinecone
const initializePinecone = async () => {
  if (!pinecone.isInitialized) {
    await pinecone.init({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENV!,
    });
  }
  return pinecone.Index(process.env.PINECONE_INDEX!);
};

export async function POST(req: Request) {
  try {
    // Get the request data
    const { messages } = await req.json();

    // Initialize Pinecone
    const index = await initializePinecone();

    // Get the last user message
    const lastMessage = messages[messages.length - 1];

    // Get the embeddings of the user's message using OpenAI
    const embeddingResponse = await openai.createEmbedding({
      input: lastMessage.content,
      model: "text-embedding-ada-002",  // Example model, adjust accordingly
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Query Pinecone with the generated embedding
    const queryResults = await index.query({
      vector: embedding,
      topK: 3,
      includeMetadata: true,
    });

    // Extract relevant context from query results
    const context = queryResults.matches
      .map((match) => match.metadata.text)
      .join("\n");

    // Prepare the prompt for OpenAI's response
    const prompt = [
      {
        role: "system",
        content: `The following is some context to help answer the user's question: ${context}`,
      },
      {
        role: "user",
        content: lastMessage.content,
      },
    ];

    // Ask OpenAI to generate a response using the context and user message
    const response = await streamText({
      model: openai("gpt-4"),  // Make sure you select the correct model
      messages: prompt,
    });

    // Return the OpenAI response
    return response.toDataStreamResponse();
  } catch (e) {
    console.error("Error:", e);
    // Proper error handling
    return NextResponse.error({ message: e.message || "Internal Server Error" });
  }
}
