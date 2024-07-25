import React from 'react'
import { Button } from '@mui/material';
import {Link} from 'react-router-dom';
import styles from '../css/notFound.module.css';

export default function Unauthenticated() {
  return (
    <div id={styles.container}>
      <div id={styles.gif}>
        <img src="https://i.postimg.cc/2yrFyxKv/giphy.gif" alt="gif_ing" />
      </div>
      <div id={styles.content}>
        <h1 id={styles.main_heading}>This page is gone.</h1>
        <p id={styles.para}>
          ...maybe the page you're looking for is not found or never existed.
        </p>
        <a href="https://www.google.co.in/" target="blank">
          <Button variant='contained' id={styles.btn}><Link to='/' id={styles.goBackLink}>Back to home</Link><i className="far fa-hand-point-right"></i></Button>
        </a>
      </div>
    </div>
  )
}
