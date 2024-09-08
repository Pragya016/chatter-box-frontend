import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import { Button } from '@mui/material';
import { io } from 'socket.io-client';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../css/register.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [value, setValue] = useState({ name: '', password: '', email: '', confirmPassword: '' });
  const [socket, setSocket] = useState();

  useEffect(() => {
    const handleRegisterSuccesful = (name) => {
      toast.success('Registration Completed.');
      localStorage.setItem('username' , name)
      navigate('/login');
    };

    const handleRegisterFailure = ({ message }) => {
      toast.error(message);
    };

    const handleDuplicateEmail = ({ message }) => {
      toast.error(message);
    };

    const newSocket = io(process.env.REACT_APP_BACKEND_URL);
    setSocket(newSocket);
    newSocket.on('registeration_successful', handleRegisterSuccesful);
    newSocket.on('registerationFailure', handleRegisterFailure);
    newSocket.on('duplicate_email', handleDuplicateEmail);

    return () => {
      newSocket.off('registeration_successful', handleRegisterSuccesful);
      newSocket.off('registerationFailure', handleRegisterFailure);
      newSocket.off('duplicate_email', handleDuplicateEmail);
      newSocket.disconnect();
    };
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.password.trim() === '' || value.confirmPassword.trim() === '' || value.name.trim() === '' || value.email.trim() === '') {
      toast.warning("Input field can't be empty.");
      return;
    }

    if (socket) {
      socket.emit('register', value);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <div id={styles.container}>
        <h1 id={styles.heading}>Register</h1>
        <form onSubmit={handleSubmit} id={styles.formContainer}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={styles.inputBox}>
            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              className={styles.inputField}
              label="Name"
              variant="standard"
              name="name"
              value={value.name}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={styles.inputBox}>
            <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              className={styles.inputField}
              label="Email"
              variant="standard"
              type="email"
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
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={styles.inputBox}>
            <KeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              className={styles.inputField}
              label="Confirm Password"
              variant="standard"
              type="password"
              name="confirmPassword"
              value={value.confirmPassword}
              onChange={handleChange}
            />
          </Box>
          <Button variant="contained" color="primary" type="submit" id={styles.btn}>
            Create Account
          </Button>
        </form>
        <p style={{color : 'grey'}}>Already have an account? <Link to="/login" style={{ color: '#1876D3' }}>Login</Link></p>
      <p id={styles.loginCred}>Login credentials are mentioned on the login page.</p>
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
