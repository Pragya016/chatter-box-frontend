import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import { io } from 'socket.io-client';
import { createChat, getEmail, getTimestamp } from '../global.functions';
import UserNav from './UserNav';
import EmojiPickerComponent from './EmojiPickerComponent';
import styles from '../css/chats.module.css';

export default function Chats(props) {
  const [value, setValue] = useState('');
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef();

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL);
    setSocket(newSocket);
      // this will display all previous chats
      newSocket.emit('load_chats')
      newSocket.on('load_previous_chats', handleLoadChats)

      newSocket.on('greet', handleGreetUser);
      newSocket.on('notify', (name) => handleNotify({ name, message: 'has joined the chat.' }));
      newSocket.on('typing', handleTyping);
      newSocket.on('broadcast_message', handleBroadcastMessage);
      newSocket.on('invalid_user', ({ message }) => toast.error(message));
      newSocket.on('user_disconnect', (name) => handleNotify({name, message : 'has left the chat.'}));

    return () => {
      if (newSocket) {
        newSocket.off('notify', handleNotify);
        newSocket.off('broadcast_message', handleBroadcastMessage);
        newSocket.off('typing', handleTyping);
        newSocket.off('invalid_user');
        newSocket.off('greet', handleGreetUser);
        newSocket.off('load_previous_chats', handleLoadChats)
        newSocket.off('user_disconnect', handleNotify)
        newSocket.disconnect();
      }
    };
  }, []);

  function scrollToBottom() {
  if (chatBoxRef.current) {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }
  }

  function handleNotify(data) {
    const container = document.getElementById('chatBox');
    const messageBox = document.createElement('p');
    messageBox.className = styles.broadcast_message;

    const span = document.createElement('span');
    span.className = styles.username;
    span.textContent = data.name;

    messageBox.appendChild(span);
    const textNode = document.createTextNode(` ${data.message}`);
    messageBox.appendChild(textNode);

    container?.appendChild(messageBox);
    scrollToBottom()
  }

  function handleGreetUser(name) {
    console.log(`Welcome to the chat ${name}`)
    const container = document.getElementById('chatBox');
    const messageBox = document.createElement('p');
    messageBox.className = styles.broadcast_message;

    const span = document.createElement('span');
    span.className = styles.username;
    span.textContent = name;

    messageBox.appendChild(document.createTextNode('Welcome to the chat, '));
    messageBox.appendChild(span);
    messageBox.appendChild(document.createTextNode('!'));

    container?.appendChild(messageBox);
    scrollToBottom();
  }


  function handleBroadcastMessage(data) {
    const messageData = {
      username: data.name,
      message: data.message,
      timestamp: data.timestamp
    };

    const messageStyle = {
      messageContainer: styles.recievedMessageContainer,
      messageBox: styles.recievedMessageBox,
      username: styles.recievedMessageUsername,
      message: styles.recievedMessage,
      time: styles.recievedMessageTime
    };

    createChat(messageData, messageStyle);
    scrollToBottom();
  }

  function handleSendMessage(e) {
    e.preventDefault();

    if (socket && value.trim() !== '') {
      const email = getEmail();
      const timestamp = getTimestamp();

      const userData = {
        username: 'You',
        message: value,
        timestamp
      };

      const userStyle = {
        messageContainer: styles.sentMessageContainer,
        messageBox: styles.sentMessageBox,
        username: styles.sentMessageUsername,
        message: styles.sentMessage,
        time: styles.sentMessageTime
      };

      createChat(userData, userStyle);

      socket.emit('send_message', { email, message: value, time: timestamp });
      
      // set isTyping to false so that typing indicator hides when user finally sends the message
      setIsTyping(false);

      setValue('');
      scrollToBottom();
    }
  }

  function handleTyping() {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  }

  function handleChange(e) {
    setValue(e.target.value);
    socket.emit('typing');
  }

  function handleLoadChats(chats) {
    const userEmail = getEmail()

    chats.forEach(chat => {
      if (!chat.hasOwnProperty('message')) {
        // handleNotify({name : chat.name, message : 'has joined the chat'})
      }
      else if (chat.email === userEmail) {
        const userData = {
        username: 'You',
        message: chat.message,
        timestamp : chat.timestamp
      };

      const userStyle = {
        messageContainer: styles.sentMessageContainer,
        messageBox: styles.sentMessageBox,
        username: styles.sentMessageUsername,
        message: styles.sentMessage,
        time: styles.sentMessageTime
      };

        createChat(userData, userStyle);
      } else {
          const messageData = {
          username: chat.name,
          message: chat.message,
          timestamp: chat.timestamp
        };

        const messageStyle = {
          messageContainer: styles.recievedMessageContainer,
          messageBox: styles.recievedMessageBox,
          username: styles.recievedMessageUsername,
          message: styles.recievedMessage,
          time: styles.recievedMessageTime
        };

        createChat(messageData, messageStyle);
      }
    });
  }

  return (
    <>
    <div id={styles.mainContainer}>
    <UserNav />
      <div id={styles.formContainer}>
      <div id={styles.chatboxContainer}>
          <div id='chatBox' className={styles.chatBox} ref={chatBoxRef}></div>
        </div>
          {isTyping && <p className={styles.typingIndicator}>Someone is typing...</p>}
          
      <form action="" onSubmit={handleSendMessage} id={styles.form}>
      <div id={styles.inputBox}>
        <input
          type="text"
          placeholder="Send a message..."
          onChange={handleChange}
          value={value}
          id={styles.inputField}
      />
          <EmojiPickerComponent onEmojiClick={(emoji) => setValue(prev => `${prev}${emoji}`)} />
        </div>
        <IconButton type="submit" id={styles.sendBtn}>
          <SendIcon />
        </IconButton>
      </form>
      </div>
      </div>
      <ToastContainer
          autoClose="1500"
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
      />
      </>
  );
}
