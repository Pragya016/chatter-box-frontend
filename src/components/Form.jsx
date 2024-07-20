import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GroupsIcon from '@mui/icons-material/Groups';
import { Box, Button, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../App';
import styles from '../css/form.module.css';

export default function Form(props) {
    const [value, setValue] = useState('');
    const [groups, setGroups] = useState([]);
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on('connect', () => {
            // if group addition fails
            socket.on('group_addition_failure', ({ message }) => {
                toast.error(message);
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        props.onAddGroup(groups);
    }, [groups, props]);

    //---------- handle form submission ------------
    function handleSubmit(e) {
        e.preventDefault();

        if (value === '') {
            toast.error("Input field can't be empty.");
            return;
        }

        const id = Math.random() * 1000 + Date.now();
        const group = { title: value, id };
        setGroups(prevState => [group, ...prevState]);
        setValue('');

        toast.success('Group added successfully.');
        //emit event to add group name to database
        socket.emit('group_creation', group);
    }

    return (
        <>
            <form onSubmit={handleSubmit} id={props.id}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <GroupsIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} id={styles.groupsIcon} />
                    <TextField
                        className={styles.textField}
                        hiddenLabel
                        id="filled-hidden-label-small"
                        variant="filled"
                        size="small"
                        color='primary'
                        placeholder='Group Title'
                        sx={{
                        '& .MuiFilledInput-underline::before': {
                                borderBottomColor: 'lightgrey', 
                        },
                        '& input::placeholder': {
                            color: 'white', 
                        },
                }}
                    />
                </Box>
                <Button variant="contained" color="primary" type="submit" id={props.btnStyle}>
                    Create
                </Button>
            </form>
            <ToastContainer />
        </>
    );
}
