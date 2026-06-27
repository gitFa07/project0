import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { useState, useEffect } from "react";

function App() {
  const [chatId, setChatId] = useState(null);
  const [conversations, setConversations] = useState([]);

  const createNewChat = async () => {
    try {
      const response = await fetch("http://localhost:5000/conversation", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setChatId(data.conversation._id);
        // await getConversations();
        setConversations((previous) => [data.conversation, ...previous]);
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  const getConversations = async () => {
    const res = await fetch("http://localhost:5000/conversation");
    const data = await res.json();

    try {
      if (data.success) {
        setConversations(data.conversations);
        if (data.conversations.length > 0) {
          setChatId(data.conversations[0]._id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   getConversations();
  // }, []);

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      <Sidebar
        conversations={conversations}
        createNewChat={createNewChat}
        setChatId={setChatId}
        setConversations={setConversations}
      />
      <ChatWindow chatId={chatId} />
    </div>
  );
}

export default App;
