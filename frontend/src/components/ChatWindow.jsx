import Message from "./Message"
import { useState } from "react"
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
        <div>
            <div>
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
                
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default ChatWindow