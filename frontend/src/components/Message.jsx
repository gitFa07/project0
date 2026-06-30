import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

function Message({ text, sender }) {
  const [copied, setCopied] = useState(false);

  const copyMessage = async () => {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <div
      className={`${
        sender === "user"
          ? "ml-auto max-w-[70%] rounded-2xl bg-[#314CB6] px-4 py-3"
          : "mr-auto w-full max-w-4xl rounded-xl px-4 py-3 hover:bg-[#2b2b2b] transition"
      }`}
    >
      <div className="prose prose-invert max-w-none">
        {sender === "AI" && (
          <div className="mb-3 flex justify-end">
            <button
              onClick={copyMessage}
              className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-[#3b3b3b] hover:text-white"
            >
              {copied ? <FiCheck /> : <FiCopy />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children }) {
              const match = /language-(\w+)/.exec(className || "");

              if (match) {
                return (
                  <CodeBlock
                    language={match[1]}
                    code={String(children).replace(/\n$/, "")}
                  />
                );
              }

              return (
                <code className="rounded bg-[#333] px-1 py-0.5 text-pink-300">
                  {children}
                </code>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default Message;
