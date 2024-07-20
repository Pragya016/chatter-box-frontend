import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import io from 'socket.io-client';
import Login from './components/Login';import Register from './components/Register';
import Homepage from './components/Homepage';
import './App.css'

export const SocketContext = createContext();
function App() {
  // after succesful login, user will get this token
  const [socket, setSocket] = useState(); 
  const [authenicated, setAuthenticated] = useState(false); 
  
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      const token = localStorage.getItem('chatterBoxToken');
      newSocket.emit('verify_token', token);

      newSocket.on('authenticated', () => {
        setAuthenticated(true);
      })

      newSocket.on('unauthenticated', () => {
        setAuthenticated(false);
      })
    })

    return () => {
      newSocket.disconnect();
    };
  }, []);


  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={authenicated ? <Homepage /> : <Login/>} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
      </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  )
}
export default App;