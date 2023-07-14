import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import Messenger from './components/messenger/Messenger';
import Navigation from './components/Navigation';
import Friends from './components/friends/Friends';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import socket from './store/socket';
import { observer } from 'mobx-react-lite';
import Authorization from './components/authorization/Authorization';
import EntrRedir from './components/utils/EntrRedir';
import chats from './store/chats';

function App() {

  const [auth, setAuth] = useState<boolean>(false)

  async function authorization(){
    const userData = window.localStorage.getItem("userData")
      if(userData){
        let {username, token} = JSON.parse(userData)
          let res = await fetch("http://localhost:5000/auth/check",{
                  method:"POST",
                  headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': `Bearer ${token}`,
                    },
                })
          if(res.status == 200){
            socket.setTocken(token);
            socket.username = username;
          }else{
            const localStorage = window.localStorage;
            localStorage.setItem("userData", "");
            socket.setToDefault();
            chats.setToDefault();
          }
      }else{}
  }
  
  useEffect(()=>{
    authorization()
  },[])

  return (
    <div className="App flex">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<EntrRedir/>}/>
          <Route path='auth' element={<Authorization/>}/>
          <Route path='app' element={<Navigation/>}>
            <Route path='' element={<Messenger/>}/>
            <Route path='messenger' element={<Messenger/>}/>
            <Route path='friends' element={<Friends/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const AppObserver = observer(App);

export default AppObserver;