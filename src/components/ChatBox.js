import React, { useState } from "react";
import { useChat } from "ai/react";  // Assuming you use this hook for managing messages

const Chat = () => {
  const [input, setInput] = useState("");   // User input
  const [response, setResponse] = useState(""); // Response from Pinecone or AI
  const { handleSubmit } = useChat();  // AI chat handling hook

  // Function to get the embedding for the input
  const getEmbedding = async (text) => {
    const res = await fetch('/api/getEmbedding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    return data.vector;
  };

  // Function to handle the chat message submission
  const handleChatSubmit = async () => {
    if (!input) return;

    // Get the vector from the input if necessary
    let vector = await getEmbedding(input);

    // Use Pinecone to get relevant information based on the query
    const relevantData = await handleUserRequest(input); // Fetching data from Pinecone

    // Display the results to the user
    setResponse(relevantData);
    handleSubmit();
  };

  // Placeholder for the handleUserRequest function
  const handleUserRequest = async (query) => {
    const res = await fetch('/api/chat', { // Assuming you have an API to handle the query
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    return data.response; // Assuming the API sends back a `response` key
  };

  return (
    <div>
      <div>
        {/* Chat UI: Input field and Send button */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleChatSubmit}>Send</button>
      </div>
      <div>
        {/* Displaying the assistant's response */}
        <p>{response}</p>
      </div>
    </div>
  );
};

export default Chat;
