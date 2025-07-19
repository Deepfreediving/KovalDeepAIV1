import { PineconeClient } from "@pinecone-database/pinecone";
import createEmbedding from "../../lib/createEmbedding"; // Import the createEmbedding function

// Initialize Pinecone
const pinecone = new PineconeClient();
pinecone.init({
  apiKey: process.env.PINECONE_API_KEY, // Your Pinecone API key
  environment: process.env.PINECONE_ENV, // Pinecone environment
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { query, top_k = 3, namespace = "__default__" } = req.body;

      // Generate the embedding for the query
      const queryEmbedding = await createEmbedding(query);

      // Query Pinecone with the generated embedding
      const index = pinecone.Index("freediving-assistant"); // Your Pinecone index name
      const queryResult = await index.query({
        vector: queryEmbedding,  // The query vector
        topK: top_k,             // Number of results to return
        includeMetadata: true,   // Include metadata in the response
        namespace: namespace,    // Use the provided namespace or default to __default__
      });

      // Return the results from Pinecone
      res.status(200).json(queryResult.matches);
    } catch (error) {
      console.error("Error querying Pinecone:", error);
      res.status(500).json({ error: "Error querying Pinecone" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
