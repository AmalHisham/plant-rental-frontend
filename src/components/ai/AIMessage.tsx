import type { FC } from 'react';

interface AIMessageProps {
  content: string;
  role: 'user' | 'assistant';
}

const AIMessage: FC<AIMessageProps> = ({ content, role }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
          isUser ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default AIMessage;
