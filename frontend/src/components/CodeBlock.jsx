import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[#3a3a3a] bg-[#1e1e1e]">
      <div className="flex items-center justify-between bg-[#2b2b2b] px-4 py-2">
        <span className="text-xs uppercase tracking-wide text-gray-400">
          {language || "text"}
        </span>

        <button
          onClick={copyCode}
          className="rounded bg-[#3a3a3a] px-3 py-1 text-xs hover:bg-[#4a4a4a]"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "18px",
          background: "#1e1e1e",
          fontSize: "14px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
