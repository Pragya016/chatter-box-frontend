import React, { useEffect, useState } from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';
import styles from '../css/user.nav.module.css'
import AlertDialog from './AlertDialogue';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';

export default function UserNav() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL)
    setSocket(newSocket)

    newSocket.on('logout_failure', ({message}) => toast.error(message))
    newSocket.on('logout_successful', () => {
      localStorage.removeItem('chatterBoxToken');

      // navigate to login page
      navigate('/login')
      window.location.reload();
    })

    return () => {
      newSocket.off('logout_failure')
      newSocket.off('logout_successful')
      newSocket.disconnect();
    }
  }, [])

  function handleLogout() {
    if (socket) {
      const token = localStorage.getItem('chatterBoxToken');
      const payload = jwtDecode(token);
      const email = payload.email
      socket.emit('logout', email);
    }
  }

  return (
    <>
    <div id={styles.userNav}>
      <div id={styles.leftSide}>
      <div id={styles.groupIconContainer}>
        <GroupsIcon style={{height : '35px', width:'35px', color : '#616161'}}/>
        </div>
        <h4 id={styles.groupName}>Chamber of secrets</h4>
      </div>
      <AlertDialog onClose={ handleLogout } />
      {/* <IconButton onClick={handleLogout} color='error' title='Logout'> 
          <PowerSettingsNewIcon id={styles.logoutBtn}/>
      </IconButton> */}
    </div>
      <ToastContainer />
    </>
  )
}
