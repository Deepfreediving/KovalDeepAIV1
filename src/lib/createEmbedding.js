import { PineconeClient } from '@pinecone-database/pinecone';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

const pinecone = new PineconeClient();
pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENV,
});

const index = pinecone.Index("your-index-name");

async function processDocuments(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');  // Read text file

  // Generate embeddings for the document
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: fileContent,
  });

  const vector = response.data.data[0].embedding;

  // Prepare metadata (you can customize this)
  const metadata = {
    content: fileContent,
    source: filePath,
  };

  // Upsert to Pinecone
  await index.upsert([
    {
      id: filePath, // Use file name or unique ID as the identifier
      values: vector,
      metadata: metadata,
    },
  ]);
}

processDocuments('/path/to/your/document.txt');
