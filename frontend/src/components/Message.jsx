function Message({text, sender}){
    return (
  <div
    className={`max-w-[70%] px-4 py-3 rounded-2xl ${
      sender === "user"
        ? "ml-auto bg-green-600"
        : "mr-auto bg-gray-700"
    }`}
  >
    {text}
  </div>
);
}

export default Message