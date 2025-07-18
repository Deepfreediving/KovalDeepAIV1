import { PineconeClient } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

// Initialize Pinecone client
const pinecone = new PineconeClient();

const initializePinecone = async () => {
  console.log("Initializing Pinecone...");
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENV!,
  });
  return pinecone.Index(process.env.PINECONE_INDEX!);
};

// OpenAI API request function
const callOpenAI = async (messages: any[]) => {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  // Use built-in fetch for API requests
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",  // Specify the model you want to use
      messages: messages,
      temperature: 0.7,  // Optional: Controls randomness of responses
      max_tokens: 150,   // Optional: Limit the length of the response
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;  // Return the content of the generated response
};

// Define the POST function for this API route
export async function POST(req: Request) {
  try {
    console.log("Received request for /api/chat");

    // Get the incoming request body (messages)
    const { messages } = await req.json();
    console.log("Messages:", messages);

    // Initialize Pinecone
    const index = await initializePinecone();

    // Get the last user message
    const lastMessage = messages[messages.length - 1];

    // Get the embeddings of the user's message using OpenAI
    const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002", // Example model, adjust accordingly
        input: lastMessage.content,
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error(`OpenAI Embedding API error: ${embeddingResponse.statusText}`);
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;
    console.log("Embedding response:", embeddingData);

    // Query Pinecone with the generated embedding
    const queryResults = await index.query({
      vector: embedding,
      topK: 3,
      includeMetadata: true,
    });
    console.log("Pinecone query results:", queryResults);

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

    // Call OpenAI API to get a response
    const openAIResponse = await callOpenAI(prompt);
    console.log("OpenAI Response:", openAIResponse);

    // Return the OpenAI response as a data stream
    return NextResponse.json({ response: openAIResponse });
  } catch (e) {
    console.error("Error:", e);
    // Proper error handling
    return NextResponse.error({ message: e.message || "Internal Server Error" });
  }
}
