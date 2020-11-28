import axios from 'axios';

export const curren_user = () => {
   return fetch(`${process.env.NEXT_PUBLIC_API}/auth/currentUser`, {
    method: 'GET',
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true
     }
   })
   .then(response => {
     if (response.status === 200) return response.json();
     throw new Error("failed to authenticate user");
   })
   .catch(error => {
     console.log(error)
   });
}
