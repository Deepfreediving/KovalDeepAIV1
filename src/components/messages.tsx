// components/Messages.tsx
import React from 'react';

interface MessagesProps {
  messages: { role: string; content: string }[]; // Define the structure of the messages
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <div className="space-y-4 overflow-y-auto max-h-96">
      {messages.map((msg, index) => (
        <div key={index} className={`flex space-x-4 ${msg.role === 'assistant' ? 'text-green-500' : 'text-blue-500'}`}>
          <div className="flex-shrink-0">{msg.role === 'assistant' ? '🤖' : '🧑‍💻'}</div>
          <div className="flex-grow">{msg.content}</div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
