import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import styles from '../css/login.module.css';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const navigate = useNavigate();
  const [value, setValue] = useState({ email: '', password: '' });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL);
    setSocket(newSocket);
    
      newSocket.on('login_successful', (token) => {
      if (!token) {
      toast.error('Something went wrong! Please try again later.');
      return;
      }
        // store the token in the local storage
        localStorage.setItem('chatterBoxToken', token);
        const name = localStorage.getItem('username');

        // decode the email from the token
        const decoded = jwtDecode(token);
        const email = decoded.email;

        // this event will show a welcome message and load the chat and users
        newSocket.emit('new_user_connected', { name, email});
        navigate('/');
        window.location.reload();
      });

      newSocket.on('loginFailure', ({message}) => toast.error(message));

    return () => {
      newSocket.off('login_successful');
      newSocket.off('loginFailure');
      newSocket.disconnect();
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (value.password === '' || value.email === '') {
      toast.warning("Input fields can't be empty.");
      return;
    }

    socket.emit('login', { ...value });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  return (
    <div id={styles.container}>
      <h1 id={styles.heading}>Login</h1>
      <form onSubmit={handleSubmit} id={styles.form}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={styles.inputBox}>
          <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            className={styles.inputField}
            label="Email"
            variant="standard"
            name="email"
            value={value.email}
            onChange={handleChange}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={styles.inputBox}>
          <KeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            className={styles.inputField}
            label="Password"
            variant="standard"
            type="password"
            name="password"
            value={value.password}
            onChange={handleChange}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit" id={styles.btn}>
          Login
        </Button>
      </form>
      <p style={{color : 'grey'}}>
        Don't have an account? <Link to="/register" style={{ color: '#1876d3'}}>Create Account</Link>
      </p>
      <p className={styles.loginCred}>Email : abc@example.com</p>
      <p className={styles.loginCred}>Password : abc</p>
      <ToastContainer
        autoClose="1500"
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </div>
  );
}
