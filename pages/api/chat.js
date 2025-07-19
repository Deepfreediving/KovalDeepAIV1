import { NextApiRequest, NextApiResponse } from 'next';
import { PineconeClient } from '@pinecone-database/pinecone';
import { Configuration, OpenAIApi } from 'openai';

// Initialize OpenAI API
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure OpenAI API key is in your .env
}));

// Initialize Pinecone client
const pinecone = new PineconeClient();
pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,  // Ensure Pinecone API key is in your .env
  environment: process.env.PINECONE_ENV,  // Ensure Pinecone environment is in your .env
});

const index = pinecone.Index("your-index-name");  // Replace with your Pinecone index name

async function getMatchesFromPinecone(query) {
  // Create an embedding for the query using OpenAI
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',  // OpenAI's model for embeddings
    input: query,
  });

  const queryVector = response.data.data[0].embedding;

  // Query Pinecone for the most relevant documents
  const results = await index.query({
    vector: queryVector,
    topK: 5,  // Retrieve top 5 results
    includeMetadata: true,
  });

  return results.matches;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    try {
      // Get the relevant results from Pinecone
      const matches = await getMatchesFromPinecone(query);

      // Format the response as needed
      const responseText = matches.map((match) => match.metadata.content).join('\n');
      res.status(200).json({ response: responseText });
    } catch (error) {
      console.error('Error during Pinecone query:', error);
      res.status(500).json({ error: 'Error querying Pinecone' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
