import { OpenAIApi, Configuration } from "openai";

// Initialize OpenAI API with a correct configuration
const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,  // Make sure your OpenAI API key is set in the .env file
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { text } = req.body;

      // Request OpenAI API for embedding
      const response = await openai.createEmbedding({
        model: "text-embedding-ada-002",  // Or another embedding model
        input: text,
      });

      const vector = response.data.data[0].embedding;
      res.status(200).json({ vector });
    } catch (error) {
      console.error("Error generating embedding:", error);
      res.status(500).json({ error: "Error generating embedding" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
