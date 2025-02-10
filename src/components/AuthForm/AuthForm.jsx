import './style.css'
import { useState } from 'react';

function AuthForm ({setIsAuth, setIsChats}) {
    const [idInstance, setIdInstance] = useState('');
    const [apiTokenInstance, setApiTokenInstance] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const chats = {}
    
    const minutes_count = 500

    const getMessages = async (param, time) => {
        return await fetch(`https://1103.api.green-api.com/waInstance${idInstance}/${param}/${apiTokenInstance}?minutes=${time}`)
        .then(data => data.json())
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  

      if (!idInstance.trim() || !apiTokenInstance.trim()) {
        return
      }

      try {

        const response = await fetch(`https://1103.api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`)
        .catch(err => { setErrorMessage('Неверные данные')
                         throw new Error('Неверные данные')})
                
        const data = await response.json();

        if (data) {
            setIsAuth(true)
            const data = {
                idInstance, 
                apiTokenInstance
            }
            localStorage.setItem('keys', JSON.stringify(data))
        }

        const messages = await Promise.all([
            getMessages('lastIncomingMessages', minutes_count),
            getMessages('lastOutgoingMessages', minutes_count)
        ]);

        const mergedMessages = messages.flat();

        const sortMessages = mergedMessages.sort((a, b) => b.timestamp - a.timestamp)

        
        sortMessages.forEach((message) => {
            const chatId = message.chatId

            if (!chats[chatId] || chats[chatId].timestamp < message.timestamp)
                chats[chatId] = message

            
        })
        
        const updatesChats = await Promise.all(
        Object.values(chats).map(async (chat) => {

            const data = { chatId: chat.chatId }

            const response = await fetch(`https://1103.api.green-api.com/waInstance${idInstance}/GetContactInfo/${apiTokenInstance}`, 
            {
            method: 'POST',
            body: JSON.stringify(data)
            }
        )
        const contactInfo = await response.json()
        
        return {...chat, data: contactInfo}
    
      }
        ))
        
        setIsChats(updatesChats)


    } catch (e) {
        console.log(e.message)
    }
}

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder='idInstance' 
                    onChange={(e) => {
                        setErrorMessage('')
                        setIdInstance(e.target.value)}
                    }
                />
                <input 
                    type="text"
                    placeholder='apiTokenInstance' 
                    onChange={(e) => {
                        setErrorMessage('')
                        setApiTokenInstance(e.target.value)}}
                />

                <button type='submit'>Войти</button>
                <span className='spanError'>{errorMessage}</span>
            </form>
        </div>
    )
}

export default AuthForm