import './style.css'

const getData = (data) => {
    const time = new Date(data * 1000); 

    const hours = time.getHours().toString().padStart(2, '0'); 
    const minutes = time.getMinutes().toString().padStart(2, '0'); 


    return `${hours}:${minutes}`
}

const MessageList = ({ messages }) => (
    
    <div className="message__container">
        <div className="chat__messages">
             {messages.map((message, index) => (
                 <div
                     key={index}
                     className={message.type === 'outgoing' ? 'selected-chat message-right' : 'selected-chat message-left'}
                 >
                     <span className='selected-chat__message'></span>{message.textMessage}
                     <span className='selected-chat__date'>{getData(message.timestamp)}</span> 
                 </div>
             ))}
         </div>
    </div>   
    
)
export default MessageList