import React, { useEffect } from 'react';
import './App.css';
import './index.css';
import Messenger from './components/messenger/Messenger';
import Navigation from './components/Navigation';
import { useState } from 'react';
import Login from './components/Login';
import Registration from './components/Registration';
import { Option } from './utils/enums';
import Friends from './components/friends/Friends';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import socket from './store/socket';
import { observer } from 'mobx-react-lite';
import Authorization from './components/Authorization';

function App() {

  function authorization(){
    const userData = window.localStorage.getItem("userData")
    if(userData){
      let {username, token} = JSON.parse(userData)
      socket.setTocken(token);
      socket.username = username;
    }
  }
  
  useEffect(()=>{
    authorization()
  },[])

  return (
    <div className="App pl-80 flex flex-row">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigation/>}>
            <Route path='auth' element={<Authorization/>}/>
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