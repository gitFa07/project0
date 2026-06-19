import Message from "./Message"
import { useState } from "react"
import { IoSend } from "react-icons/io5";
function ChatWindow({text, sender}){
    const [messages, setMessages] = useState([{
        text: "Hello", 
        sender: "user1"
    }]);
    const [input, setInput] = useState("");
    const sendMessage=()=>{
        if(input.trim()==="")
            return;
        setMessages([...messages,{
            text: input,
            sender: "user"
        }]);
        setInput("");
    };
    return(
        <div className="chat-window">
            <div className="messgaes-container">
                { 
                messages.map((msg, index) => (
                    <Message 
                    key = {index} 
                    text={msg.text} 
                    sender={msg.sender} 
                    />
                )
            )}
            </div>
            <div className="InputField">
                <input 
                type="text" 
                placeholder="Type your message" 
                value={input} 
                onChange={(e)=>{ setInput(e.target.value)}}/>
                
                <button onClick={sendMessage}><IoSend /></button>
            </div>
        </div>
    )
}

export default ChatWindow