import Message from "./Message";
import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { RiSidebarUnfoldLine } from "react-icons/ri";
import TypingIndicator from "./TypingIndicator";

function ChatWindow({ chatId, sidebarOpen, setSidebarOpen }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

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

      inputRef.current?.focus();
    }
  };

  return (
    <div className="relative flex-1 flex flex-col bg-[#212121] text-white">
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 p-2 rounded-lg hover:bg-[#2f2f2f] transition"
        >
          <RiSidebarUnfoldLine size={22} />
        </button>
      )}
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <img
                src="src\assets\logo.png"
                alt="Logo"
                className="w-20 h-20 mx-auto mb-6"
              />
              <h1 className="text-4xl font-bold text-white">Welcome</h1>
              <p className="mt-3 text-gray-400 text-lg">
                How may I help you today?
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <Message key={index} text={msg.text} sender={msg.sender} />
            ))}

            {loading && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-black p-4">
        <div className="max-w-4xl mx-auto flex items-center bg-[#130214] rounded-2xl px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            disabled={loading}
            className="flex-1 bg-transparent outline-none text-white placeholder-white"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="ml-3 text-xl transition-transform hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
