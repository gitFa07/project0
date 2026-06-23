import Message from "./Message";
import { useState } from "react";
import { IoSend } from "react-icons/io5";

function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      text: "Hello",
      sender: "user1",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      text: input,
      sender: "Sender Name",
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
    <div className="chat-window">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <Message
            key={index}
            text={msg.text}
            sender={msg.sender}
          />
        ))}

        { 
            loading && <div>
                AI is responding...
            </div>
        }

      </div>

      <div className="InputField">
        <input
          type="text"
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e)=> {
            if(e.key === "Enter")sendMessage()
          }}
          disabled={loading}
        />

        <button onClick={sendMessage} disabled={loading}>
          <IoSend />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;