'use client';

import React, { useState } from "react";
import Chat from "@/components/chat"; // Your custom Chat component
import { useChat } from "ai/react";  // Hook for handling chat logic

const Home: React.FC = () => {
  const [context, setContext] = useState<string[] | null>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat<{ from: string; text: string }>();
  const [vector, setVector] = useState<number[] | null>(null);
  const [response, setResponse] = useState<string>('');

  // Function to get vector embedding from an API like OpenAI
  const getEmbedding = async (text: string) => {
    try {
      const res = await fetch('/api/getEmbedding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      setVector(data.vector); // Set the vector returned by the backend
    } catch (error) {
      console.error("Error getting embedding:", error);
    }
  };

  const handleChatSubmit = async () => {
    if (!vector) {
      // If there's no vector, we need to get the embedding first
      await getEmbedding(input); // Get the vector for the input message
      return;
    }

    // Send the vector and other parameters to the API
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: vector, top_k: 5, namespace: "__default__" })
    });

    const data = await res.json();
    setResponse(data.response); // Store the assistant's response
    handleSubmit(); // Continue with your chat logic
  };

  return (
    <div className="font-sans min-h-screen flex flex-col bg-white relative">
      {/* Logo */}
      <div className="absolute top-4 left-4 z-10">
        <img src="/deeplogo.jpg" alt="Logo" className="w-40 h-40" />
      </div>

      {/* Main Content Area */}
      <main className="flex flex-col flex-1 gap-8 items-center sm:items-start mt-16 p-4">
        <h1 className="text-xl font-semibold text-center">Welcome to Koval Deep AI Chatbot</h1>

        {/* Chat Box */}
        <div className="chat-box w-full p-4 bg-white border border-gray-300 rounded-lg max-h-[400px] overflow-y-auto mb-8">
          {/* Chat messages will go here */}
          {messages && messages.map((msg: { from: string; text: string }, index) => (
            <div key={index} className={`message ${msg.from === 'user' ? 'user' : 'assistant'}`}>
              <p>{msg.text}</p>
            </div>
          ))}

          {/* Display Assistant's Response */}
          {response && (
            <div className="message assistant mt-4">
              <p>{response}</p>
            </div>
          )}
        </div>

        {/* Chat Input and Send Button */}
        <div className="w-full flex justify-between items-center mt-4 mb-8">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="w-4/5 p-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleChatSubmit}
            className="w-1/5 bg-green-500 text-white py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
