import { PineconeClient } from '@pinecone-database/pinecone';

// Initialize Pinecone client
const pinecone = new PineconeClient();

// Initialize Pinecone index with your API key and environment
const initializePinecone = async () => {
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY!, // Use environment variable for API Key
    environment: process.env.PINECONE_ENV!, // Pinecone environment
  });
};

// Get the Pinecone index
const getPineconeIndex = (indexName: string) => {
  return pinecone.Index(indexName);
};

export { initializePinecone, getPineconeIndex };
