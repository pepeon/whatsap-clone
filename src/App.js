import { useEffect, useState } from 'react';
import AuthFrom from './components/AuthForm/AuthForm'
import Chat from './components/Chat/Chat';

function App() {

  const [isAuth, setIsAuth] = useState(false)
  const [chats, setIsChats] = useState([])

  useEffect(() => {
    const dataFromLocalStorage = localStorage.getItem("chats")

    if (dataFromLocalStorage) {
      setIsChats(JSON.parse(dataFromLocalStorage))
      setIsAuth(true) 
    }

  }, [])

  useEffect(() => {
    if (chats.length) {
      localStorage.setItem("chats", JSON.stringify(chats))
    }

  }, [chats])


  return (
    <>
    {
      isAuth ?  <Chat chats = {chats} setIsChats={setIsChats} setIsAuth = {setIsAuth}/> : <AuthFrom setIsAuth = {setIsAuth} setIsChats = {setIsChats}/>
    }   
    </>
    
  );
  
}

export default App;
