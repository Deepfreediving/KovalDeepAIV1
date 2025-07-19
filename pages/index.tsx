'use client';

import React, { useState } from "react";
import Chat from "@/components/chat";
import { useChat } from "ai/react";  // Hook for handling chat logic

const Home: React.FC = () => {
  const [context, setContext] = useState<string[] | null>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [vector, setVector] = useState<number[] | null>(null);

  // Function to get vector embedding from an API like OpenAI
  const getEmbedding = async (text: string) => {
    try {
      const res = await fetch('/api/getEmbedding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      setVector(data.vector);  // Set the vector returned by the backend
    } catch (error) {
      console.error("Error getting embedding:", error);
    }
  };

  const handleChatSubmit = async () => {
    if (!vector) {
      // If there's no vector, we need to get the embedding first
      await getEmbedding(input);  // Get the vector for the input message
      return;
    }

    // Send the vector and other parameters to the API
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: vector, top_k: 5, namespace: "__default__" })
    });

    const data = await res.json();
    console.log("Pinecone response:", data);
    handleSubmit();  // Continue with your chat logic
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {/* Main Content Area */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-xl font-semibold">Welcome to Koval Deep AI Chatbot</h1>

        {/* Chat Component */}
        <Chat
          input={input}
          handleInputChange={handleInputChange}
          handleMessageSubmit={handleChatSubmit}
          messages={messages}
        />

        {/* Action Links */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>

      {/* Footer Links */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
};

export default Home;
