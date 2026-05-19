import type { FC } from 'react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  'Low maintenance plants',
  'Plants for office',
  'Plants for weddings',
  'Low light plants',
];

const SuggestedPrompts: FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => (
  <div className="flex flex-wrap gap-2">
    {prompts.map((prompt) => (
      <button
        key={prompt}
        type="button"
        onClick={() => onSelectPrompt(prompt)}
        className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 transition hover:bg-green-100"
      >
        {prompt}
      </button>
    ))}
  </div>
);

export default SuggestedPrompts;
