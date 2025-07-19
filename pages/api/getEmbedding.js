import { Configuration, OpenAIApi } from "openai";
import { PineconeClient } from "@pinecone-database/pinecone";

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure your OpenAI API key is in the .env file
});
const openai = new OpenAIApi(configuration);

// Initialize Pinecone
const pinecone = new PineconeClient();
pinecone.init({
  apiKey: process.env.PINECONE_API_KEY, // Your Pinecone API key
  environment: process.env.PINECONE_ENV, // Pinecone environment (e.g., 'us-west1-gcp')
});

export default async function handler(req, res) {
// Correct way to import and initialize OpenAI API
import { Configuration, OpenAIApi } from "openai";  // Ensure this is correct

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure your OpenAI API key is in the .env file
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { text } = req.body;

      // Request OpenAI API for embedding
      const response = await openai.createEmbedding({
        model: "text-embedding-ada-002",  // Or another embedding model
        input: text,
      });

      const vector = response.data.data[0].embedding;  // Extract the embedding vector
      res.status(200).json({ vector });
    } catch (error) {
      console.error("Error generating embedding:", error);
      res.status(500).json({ error: "Error generating embedding" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
