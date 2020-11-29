import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import { curren_user, one_tap_login, authenticate, isAuth, signout} from '../actions/auth';
import Router from 'next/router';



export default function Home() {
 const [user, setUser] = useState();
 const handleOnetapResponse = (response) => {
   one_tap_login({ googleToken: response.credential })
     .then(result => {
       authenticate(result, () => {
         Router.push(`/`)
       })
     })
     .catch((err) => {
       console.log(err)
     })
 }

  useEffect(() => {
      curren_user()
      .then(response => setUser(response))
      .catch((err) => consol.log(err))

if(!isAuth()){
  window.onload = function () {
     google.accounts.id.initialize({
       client_id:'198321905228-ctfq82du8gn1ftnjf2hlai4bli2g932c.apps.googleusercontent.com',
       callback: handleOnetapResponse
     });
     google.accounts.id.prompt();
   }
}

  }, [])


const _handleSignInClick = () => {
  window.open("http://localhost:8000/api/auth/google", "_self");
}

const _handleLogoutInClick = () => {
  window.open("http://localhost:8000/api/auth/logout", "_self");
}
  return (
    <div className={styles.container}>

        {!user && !isAuth() && <button className={styles.loginbtn} onClick={_handleSignInClick}>Login with Google</button>}

        {user && <div className={styles.loggedIn}>
            <h6>Name: {user.name}</h6>
            <h6>Email: {user.email}</h6>
            <button onClick={_handleLogoutInClick}>Logout</button>
          </div>}

          {isAuth() && <div className={styles.loggedIn}>
              <h6>Name: {isAuth() && isAuth().name}</h6>
              <h6>Email: {isAuth() && isAuth().email}</h6>
              <button onClick={() => signout(() => window.location.reload(`/`))}>Logout</button>
            </div>}
    </div>
  )
}
