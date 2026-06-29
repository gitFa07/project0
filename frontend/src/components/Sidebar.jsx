import { LuSquarePen } from "react-icons/lu";
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function Sidebar({
  createNewChat,
  conversations,
  chatId,
  setChatId,
  setConversations,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
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

        setChatId(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    //Component body. Design a sidebar here.
    <div className="w-64 bg-[#0C0C0C] border-r border-[#0C0C0C] p-4">
      <button
        className="w-full bg-[#314CB6] hover:bg-[#0A81D1] rounded-lg py-2 mb-6 font-bold text-white flex items-center justify-center gap-2"
        onClick={createNewChat}
      >
        <LuSquarePen size={20} />
        <span>New Chat</span>
      </button>

      <div className="space-y-2">
        {conversations.map((conversation) => (
          <div
            key={conversation._id}
            onClick={() => setChatId(conversation._id)}
            className={`flex justify-between items-center p-2 rounded-lg cursor-pointer group transition-colors ${
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
                className="bg-transparent border border-gray-500 rounded px-2 py-1 flex-1 outline-none"
              />
            ) : (
              <span
                onClick={() => setChatId(conversation._id)}
                className="cursor-pointer flex-1"
              >
                {conversation.title}
              </span>
            )}

            <div className="flex gap-2">
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
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
