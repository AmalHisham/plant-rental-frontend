import { useMemo, useRef, useState, type FC } from 'react';
import { sendMessageToAI } from './utils/aiApi';
import AIMessage from './AIMessage';
import SuggestedPrompts from './SuggestedPrompts';
import TypingIndicator from './TypingIndicator';

// Structure of one chat message
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// Props received from parent component
interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// First message shown when chatbot opens
const initialMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hi! I can help with plant rentals, care tips, recommendations, and rental policies.',
};

const AIChatModal: FC<AIChatModalProps> = ({ isOpen, onClose }) => {
  
  // Stores all chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);

  // Stores current input field value
  const [input, setInput] = useState('');

  // Shows loading while AI is replying
  const [isLoading, setIsLoading] = useState(false);

  // Used to create unique ids for messages
  const nextId = useRef(1);

  // Checks whether user can send message
  // True only if input is not empty and AI is not loading
  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading]
  );

  // Adds a new message to chat
  const pushMessage = (
    role: 'user' | 'assistant',
    content: string
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${role}-${nextId.current++}`,
        role,
        content,
      },
    ]);
  };

  // Runs when user sends a message
  const handleSend = async (message: string) => {

    // Remove extra spaces
    const cleanMessage = message.trim();

    // Stop if message is empty or already loading
    if (!cleanMessage || isLoading) return;

    // Add user message to chat
    pushMessage('user', cleanMessage);

    // Clear input box
    setInput('');

    // Start loading
    setIsLoading(true);

    try {
      // Send message to backend AI API
      const reply = await sendMessageToAI(cleanMessage);

      // Add AI response to chat
      pushMessage('assistant', reply);

    } catch {

      // Show error message if API fails
      pushMessage(
        'assistant',
        'Sorry, that information is unavailable right now. Please contact customer support for help.'
      );

    } finally {

      // Stop loading in both success and error cases
      setIsLoading(false);
    }
  };

  // Don't render modal if chatbot is closed
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-[350px] rounded-2xl border border-green-100 bg-white shadow-2xl transition-all duration-300 sm:right-6">

      {/* Top header section */}
      <div className="flex items-center justify-between rounded-t-2xl bg-green-600 px-4 py-3 text-white">
        
        {/* Chatbot title */}
        <h2 className="text-sm font-semibold">
          Plant AI Assistant
        </h2>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 transition hover:bg-white/20"
          aria-label="Close chatbot"
        >
          {/* X icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Chat messages area */}
      <div className="h-[360px] space-y-3 overflow-y-auto p-4">

        {/* Show all messages */}
        {messages.map((message) => (
          <AIMessage
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}

        {/* Show typing animation while loading */}
        {isLoading && <TypingIndicator />}
      </div>

      {/* Bottom input section */}
      <div className="space-y-3 border-t border-gray-100 p-4">

        {/* Suggested question buttons */}
        <SuggestedPrompts onSelectPrompt={handleSend} />

        <div className="flex items-center gap-2">

          {/* Input field */}
          <input
            value={input}

            // Updates input state while typing
            onChange={(event) =>
              setInput(event.target.value)
            }

            // Send message when Enter key is pressed
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void handleSend(input);
              }
            }}

            placeholder="Ask about plants, care, or rental policies..."
            className="h-10 flex-1 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-green-500"
          />

          {/* Send button */}
          <button
            type="button"

            // Send current input message
            onClick={() => void handleSend(input)}

            // Disable button if input empty or loading
            disabled={!canSend}

            className="h-10 rounded-xl bg-green-600 px-4 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatModal;