const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="inline-flex items-center gap-1 rounded-2xl bg-gray-100 px-3 py-2">
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
    </div>
  </div>
);

export default TypingIndicator;
