function Message({text, sender}){
    return(
        <div className={`Message ${sender}`}>
            {text}
        </div>
    )
}

export default Message