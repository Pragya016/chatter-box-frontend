import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import styles from '../css/list.module.css';

export default function List(props) {

    return (
        <div id={styles.users}>
            {props.users && props.users.length > 0 &&
                props.users.map((user) => (
                    <p key={user._id} className={styles.user}>
                        <PersonIcon className={styles.personIcon} />
                        <span className={styles.username}>{user.name}</span>
                    </p>
                ))}

        </div>
    )
}
