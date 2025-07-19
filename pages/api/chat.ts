// pages/api/chat.ts
import { PineconeClient } from '@pinecone-database/pinecone';

const pinecone = new PineconeClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { query, top_k, namespace } = req.body;

      const index = pinecone.Index('quickstart'); // Replace with your actual index name

      // Query Pinecone for similar vectors
      const queryResult = await index.query({
        vector: query,
        topK: top_k || 5,
        includeMetadata: true,
        namespace: namespace || '__default__',
      });

      res.status(200).json(queryResult);
    } catch (error) {
      console.error('Pinecone error:', error);
      res.status(500).json({ error: 'Error querying Pinecone' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
