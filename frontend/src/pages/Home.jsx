import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useState, useEffect } from "react";
import api from "../services/api";

function Home() {
  const [chatId, setChatId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const createNewChat = async () => {
    try {
      const { data } = await api.post("/chat/conversation");

      if (data.success) {
        setChatId(data.conversation._id);
        setConversations((previous) => [data.conversation, ...previous]);
      }
    } catch (error) {
      console.error("Error occured");
    }
  };

  const getConversations = async () => {
    try {
      const { data } = await api.get("/chat/conversation");

      if (data.success) {
        setConversations(data.conversations);

        if (data.conversations.length > 0) {
          setChatId(data.conversations[0]._id);
        }
      }
    } catch (error) {
      console.error("Error occured");
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      {sidebarOpen && (
        <Sidebar
          createNewChat={createNewChat}
          conversations={conversations}
          chatId={chatId}
          setChatId={setChatId}
          setConversations={setConversations}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      <ChatWindow
        chatId={chatId}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </div>
  );
}

export default Home;
