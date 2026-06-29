import ReactMarkdown from "react-markdown";
function Message({ text, sender }) {
  return (
    <div
      className={`max-w-[70%] px-4 py-3 rounded-2xl ${
        sender === "user" ? "ml-auto bg-[#314CB6]" : "mr-auto bg-[#0A81D1]"
      }`}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}

export default Message;
