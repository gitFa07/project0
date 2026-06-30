function TypingIndicator() {
  return (
    <div className="mr-auto px-2 py-2">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
      </div>
    </div>
  );
}

export default TypingIndicator;
