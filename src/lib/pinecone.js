import { PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

const pinecone = new PineconeClient();
pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENV,
});

export const index = pinecone.Index("your-index-name");
