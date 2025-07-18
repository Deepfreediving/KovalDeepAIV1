// src/utils/openai.ts
import { PineconeClient } from '@pinecone-database/pinecone';

// Initialize Pinecone client
const pinecone = new PineconeClient();

const initializePinecone = async () => {
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY || 'your-pinecone-api-key',
    environment: process.env.PINECONE_ENV || 'your-pinecone-environment',
  });
};

const createIndex = async () => {
  await pinecone.createIndex({
    name: process.env.PINECONE_INDEX || 'koval-deep-ai',
    dimension: 1536, // Dimension of your embeddings
  });
};

export { initializePinecone, createIndex };
