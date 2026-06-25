import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { useState } from "react";

function App() {
  const [chatId, setChatId] = useState(Date.now());
  const createNewChat = () => {
    setChatId(Date.now());
  };

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      <Sidebar createNewChat={createNewChat} />
      <ChatWindow chatId={chatId} />
    </div>
  );
}

export default App;
