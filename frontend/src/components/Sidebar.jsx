function Sidebar() {
  return (
    //Component body. Design a sidebar here.
    <div className="w-64 bg-[#171717] border-r border-gray-800 p-4">
      <button className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg py-2 mb-6">
        + New Chat
      </button>

      <div className="space-y-2">
        {["Name 1", "Name 2", "Name 3", "Name 4", "Name 5"].map((chat) => (
          <div
            key={chat}
            className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
          >
            {chat}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
