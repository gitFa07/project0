import { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { LuSquarePen } from "react-icons/lu";
import { RiSidebarFoldLine } from "react-icons/ri";
import logo from "../assets/logo.png";

function Sidebar({
  createNewChat,
  conversations,
  chatId,
  setChatId,
  setConversations,
  setSidebarOpen,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showRecents, setShowRecents] = useState(true);

  const renameChat = async (id, newTitle) => {
    if (!newTitle.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/chat/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setConversations((prev) =>
          prev.map((chat) => (chat._id === id ? data.conversation : chat)),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteChat = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/chat/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setConversations((prev) => prev.filter((chat) => chat._id !== id));

        if (chatId === id) {
          setChatId(null);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-64 h-screen bg-[#0C0C0C] border-r border-[#1e1e1e] flex flex-col">
      {/* Header */}
      <div className="px-3 pt-4">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={createNewChat}
            className="p-2 rounded-lg hover:bg-[#222223] transition"
          >
            <img src={logo} alt="Logo" className="w-8 h-8" />
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-[#222223] transition"
          >
            <RiSidebarFoldLine size={22} />
          </button>
        </div>

        <div
          onClick={createNewChat}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#222223] cursor-pointer transition mb-4"
        >
          <LuSquarePen size={20} />
          <span className="font-medium">New Chat</span>
        </div>

        <div
          onClick={() => setShowRecents(!showRecents)}
          className="flex items-center gap-1 p-2 rounded-lg hover:bg-[#222223] cursor-pointer text-gray-300 mb-2"
        >
          {showRecents ? (
            <FiChevronDown size={16} />
          ) : (
            <FiChevronRight size={16} />
          )}

          <span className="font-semibold">Recents</span>
        </div>
      </div>

      {/* Scrollable Conversation List */}
      {showRecents && (
        <div className="flex-1 overflow-y-auto px-2 pb-3 sidebar-scroll">
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => setChatId(conversation._id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg cursor-pointer group transition-colors ${
                chatId === conversation._id
                  ? "bg-[#222223]"
                  : "hover:bg-[#222223]"
              }`}
            >
              {editingId === conversation._id ? (
                <input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      renameChat(conversation._id, editingTitle);
                      setEditingId(null);
                    }
                  }}
                  onBlur={() => {
                    renameChat(conversation._id, editingTitle);
                    setEditingId(null);
                  }}
                  autoFocus
                  className="flex-1 bg-transparent border border-gray-500 rounded px-2 py-1 outline-none"
                />
              ) : (
                <span className="flex-1 truncate">{conversation.title}</span>
              )}

              <div className="flex gap-2 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(conversation._id);
                    setEditingTitle(conversation.title);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiEdit2 size={16} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(conversation._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
