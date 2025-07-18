import React, { FormEvent, ChangeEvent, useState } from 'react';
import Messages from '@components/messages';  // Correct path to Messages component
import { Message } from 'ai/react';          // If you're using ai/react for typing

interface ChatProps {
  messages: { role: string; content: string }[];  // Array of message objects with 'role' and 'content' properties
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => void;
  input: string;
}

const Chat: React.FC<ChatProps> = ({ messages, handleInputChange, handleMessageSubmit, input }) => {
  return (
    <div className="flex flex-col space-y-4 p-6 max-w-xl mx-auto">
      <Messages messages={messages} />
      <form onSubmit={handleMessageSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="p-2 w-full border rounded-md"
          placeholder="Type your message..."
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
