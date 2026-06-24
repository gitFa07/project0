import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'

function App() {
  return (
    <div className="flex h-screen bg-[#212121] text-white">
    <Sidebar />
    <ChatWindow />
    </div>
  );
}

export default App
