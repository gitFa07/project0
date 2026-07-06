import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { RiSidebarUnfoldLine } from "react-icons/ri";
import { FiPaperclip } from "react-icons/fi";

import Message from "./Message";
import api from "../services/api";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function ChatWindow({ chatId, sidebarOpen, setSidebarOpen }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const { token } = useAuth();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (!chatId) return;

    const getMessages = async () => {
      try {
        const { data } = await api.get(`/chat/conversation/${chatId}`);

        if (data.success) {
          const formattedMessages = data.conversation.messages.map((msg) => ({
            text: msg.text,
            sender: msg.role === "assistant" ? "AI" : "user",
          }));

          setMessages(formattedMessages);
        }
      } catch (err) {
        console.log("Error fetching Message");
      }
    };

    getMessages();
  }, [chatId]);

  const sendMessage = async () => {
    if (!chatId) return;
    if (input.trim() === "") return;

    const userMessage = {
      text: input,
      sender: "user",
    };

    // Show the user's message immediately
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    // Create an empty AI message
    setMessages((prev) => [
      ...prev,
      {
        text: "",
        sender: "AI",
      },
    ]);

    try {
      const formData = new FormData();

      formData.append("chatId", chatId);
      formData.append("message", currentInput);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch("http://localhost:5000/api/chat/stream", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to connect to server");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        fullText += chunk;

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            sender: "AI",
            text: fullText,
          };

          return updated;
        });
      }
    } catch (error) {
      console.setError("Failed to send message.");

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          sender: "AI",
          text: "Something went wrong, please try again.",
        };

        return updated;
      });
    } finally {
      setLoading(false);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
              <img src={logo} alt="Logo" className="w-20 h-20 mx-auto mb-6" />
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

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-black p-4">
        {selectedFile && (
          <div className="max-w-4xl mx-auto mb-3">
            <div className="bg-[#2a2a2a] rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-[#3a3a3a] flex items-center justify-center">
                    📄
                  </div>
                )}

                <div>
                  <p className="text-white text-sm font-medium">
                    {selectedFile.name}
                  </p>

                  <p className="text-gray-400 text-xs">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl("");

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="text-gray-400 hover:text-red-400 text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <div className="max-w-4xl mx-auto flex items-center bg-[#130214] rounded-2xl px-4 py-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="mr-3 text-xl transition-transform hover:scale-110"
          >
            <FiPaperclip />
          </button>

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
