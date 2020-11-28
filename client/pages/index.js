import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import { curren_user } from '../actions/auth';

export default function Home() {
 const [user, setUser] = useState();

  useEffect(async () => {
      curren_user()
      .then(response => setUser(response))
      .catch((err) => consol.log(err))
  }, [])

const _handleSignInClick = () => {
  window.open("http://localhost:8000/api/auth/google", "_self");
}

const _handleLogoutInClick = () => {
  window.open("http://localhost:8000/api/auth/logout", "_self");
}
  return (
    <div className={styles.container}>
        {!user && <button className={styles.loginbtn} onClick={_handleSignInClick}>Login with Google</button>}

        {user && <div className={styles.loggedIn}>
            <h6>Name: {user.name}</h6>
            <h6>Email: {user.email}</h6>
            <button onClick={_handleLogoutInClick}>Logout</button>
          </div>}
    </div>
  )
}
