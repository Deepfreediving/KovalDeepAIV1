// src/utils/chat.ts

export const generateChatResponse = async (messages: string[]) => {
  // Logic to interact with your chatbot API (e.g., OpenAI or Pinecone)
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });
  
  const data = await response.json();
  return data.response;
};
