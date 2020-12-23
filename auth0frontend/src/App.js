import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";



const apiOrigin = 'http://localhost:3001'

function App() {
  const {getAccessTokenSilently} = useAuth0();
const [msg,setMsg] =useState('');
const apiPrivate = async (call) => {
  
  
    try {
      
      
      const token = await getAccessTokenSilently();
      
      const response = await fetch(`${apiOrigin}/api/${call}`,{headers:{
        
        Authorization:`Bearer ${token}`}});
     
      const responseData = await response.json();
      console.log(responseData);
      setMsg(responseData.message)
    } catch (error) {
      setMsg(error.message)
    }
    }
    const CallPublic = () =>{
      return <button onClick={() => apiPrivate('public')}>public msg</button>;
    }
    const CallPrivate = () =>{
      return <button onClick={() => apiPrivate('private')}>private msg</button>;
    }
    const CallPrivateScoped = () =>{
      return <button onClick={() => apiPrivate('privatescoped')}>privateScoped msg</button>;
    }
  

  return (
    <div className="App">
     <LoginButton/>
     <LogoutButton/>
     <Profile/>
     <CallPublic/>
     <CallPrivate />
     <CallPrivateScoped/>
     {msg}
    </div>
  );
}



const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
};

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};


export default App;
