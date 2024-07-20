import React, { useEffect, useState } from 'react';
import Chats from './Chats';
import { io } from 'socket.io-client';
import styles from '../css/homepage.module.css';
import List from './List';

export default function Homepage() {
  // const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL);
    newSocket.on('connect', () => {
      // this will load the homepage by sending the list of all the users
      newSocket.emit('load_home');
      newSocket.on('load_users', handleLoadUsers)
    
      return () => {
        newSocket.disconnect()
      }

    });
  }, []);

  useEffect(() => {}, [users])

  function handleLoadUsers(usersData) {
    setUsers(usersData)
  }

  return (
    <div id='container' className={styles.container}>
      <div id={styles.leftSide}>
        <List users={users} />
        <h4 id={styles.heading}>All Users</h4>
        {/* <Form onAddGroup={handleSubmit} id={styles.form} btnStyle={styles.btn} /> */}
      </div>
      <div id={styles.rightSide}>
       <Chats />
      </div>
    </div>
  );
}