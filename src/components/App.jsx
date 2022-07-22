import React, {useState, useEffect, useMemo} from "react";
import {FormAuth} from './Auth/authComponents/FormAuth'
import { Chat } from "./ChatPage/Chat";
import {
    Routes,
    Route,
    Navigate
  } from 'react-router-dom';

const ROUTES = {
  LOGIN: "/login",
  REGISTRATION: "/registration",
  CHAT: "/chat",
}

export const App = () => {
  const [connection, setConnection] = useState(false);


  return (
      <div className="App">
      <Routes>
        <Route
          path={ROUTES.LOGIN} 
          element={
            <FormAuth 
              connectionState={{connection, setConnection}}
              switchForms={ROUTES.REGISTRATION}
              routes={ROUTES}
            />
          }
        />
        <Route 
          path={ROUTES.REGISTRATION} 
          element={
            <FormAuth
              connectionState={{connection, setConnection}}
              switchForms={ROUTES.LOGIN}
              routes={ROUTES}
            />
          }
        />
        <Route 
          path={ROUTES.CHAT} 
          element={
            <Chat
              connectionState={{connection, setConnection}}
            />
          }
        />
        <Route 
          path="/" 
          element={<Navigate to='login'/>} 
          replace
        />
      </Routes>
    </div>
  )
};

//fetch payload to server
//if not authed return error tooltip
//if authed get redirect to /chat

// {mode === true ? "login" : "register"}
{/* <div className='app-container'>
<AuthContainer to={mode === true ? "login" : "register"} switchOptions={{ mode, setMode }} />
</div> */}

{/* <main>
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/shop">Shop</a></li>
  </ul>
  </nav>
</main> */}