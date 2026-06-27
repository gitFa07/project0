import Message from "./Message";
import { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";

function ChatWindow({ chatId }) {
  const [messages, setMessages] = useState([
    //   {
    //     text: "Hello",
    //     sender: "user1",
    //   },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    const getMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/conversation/${chatId}`);

        const data = await res.json();

        if (data.success) {
          const formattedMessages = data.conversation.messages.map((msg) => ({
            text: msg.text,
            sender: msg.role === "assistant" ? "AI" : "user",
          }));

          setMessages(formattedMessages);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [chatId]);

  // const getChats = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/conversation");
  //     const data = await response.json();
  //     if (data.success) {
  //       setMessages(data.chats);
  //     }
  //   } catch (error) {
  //     console.log("Error fetching chats", error);
  //   }
  // };

  const sendMessage = async () => {
    if (!chatId) return;

    if (input.trim() === "") return;

    const userMessage = {
      text: input,
      sender: "user",
    };

    // Add user message to chat
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          message: currentInput,
        }),
      });

      const data = await response.json();

      const aiMessage = {
        text: data.reply,
        sender: "AI",
      };

      // Add AI response
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Something went wrong, please try again.",
          sender: "AI",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#212121] text-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} />
        ))}

        {loading && (
          <div className="text-gray-400 italic">AI is responding...</div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center bg-[#2f2f2f] rounded-2xl px-4 py-2">
          <input
            type="text"
            placeholder="Type your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            disabled={loading}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="ml-3 text-xl hover:scale-110 transition-transform disabled:opacity-50"
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
