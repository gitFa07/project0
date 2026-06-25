function Sidebar({ createNewChat, conversations, setChatId }) {
  return (
    //Component body. Design a sidebar here.
    <div className="w-64 bg-[#171717] border-r border-gray-800 p-4">
      <button
        className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg py-2 mb-6"
        onClick={createNewChat}
      >
        + New Chat
      </button>

      <div className="space-y-2">
        {conversations.map((conversation) => (
          <div
            key={conversation._id}
            onClick={() => setChatId(conversation._id)}
            className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
          >
            {conversation.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
