import { observer } from "mobx-react-lite"
import socket from "../../store/socket";
import { useState, useEffect } from 'react';
import chats from "../../store/chats";
import { useNavigate } from "react-router-dom";
// interface Props{
//     socket: WebSocket | null,
// }

interface LoginData{
  username: string,
  password: string,
}

interface Token{
  token: string,
}

function Login(){

    const [loginData, setLoginData] = useState<LoginData>({username:"", password:""});
    const navigate = useNavigate()

    function saveUserData(username: string, token: Token){
      const localStorage = window.localStorage
      localStorage.setItem("userData", JSON.stringify({username: username, token: token}))
    }

    function clearUserData(){
      const localStorage = window.localStorage;
      localStorage.setItem("userData", "");
    }

    async function login(){
      let res = await fetch(`http://${process.env.REACT_APP_SERVER_IP}/auth/login`, {
        method:"POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(loginData)
      })
      let {token, avatar, message} = await res.json()
      if(res.status != 200){
        socket.setError(message)
        return false
      }
      socket.setFlag(true)
      socket.setAvatar(avatar);
      socket.setTocken(token);
      socket.username = loginData.username;
      saveUserData(loginData.username, token);
      setLoginData({username:"", password:""})
      console.log(socket.avatar);
      navigate('../app/messenger', { replace: false })
    }

    async function logoff() {
      socket.setToDefault();
      chats.setToDefault();
      clearUserData();
    }

    return(
      <div className="h-full">
        <div className="auth w-fit h-full flex flex-col p-4">
          <h1 className="text-center text-white bg-gray-700 mb-4 border-x-[1px] noselect">Login</h1>
          {(!socket.token)
          ?
          <div className="h-full flex flex-col items-center">
            <input placeholder="Login" onKeyDown={(e)=>{if(e.key == "Enter"){login()}}} value={loginData.username} onChange={(e)=>setLoginData({...loginData, username:e.target.value})} autoFocus={true} className="border text-white text-center rounded-md border-solid border-white bg-[#353535] mb-1" type="text"/>
            <input placeholder="Password" onKeyDown={(e)=>{if(e.key == "Enter"){login()}}} onChange={(e)=>setLoginData({...loginData, password:e.target.value})} className="border text-white text-center rounded-md border-solid border-white bg-[#353535]" type="password"/>
            <button onClick={login} className="bg-[#3C6E71] w-fit pl-10 pr-10 rounded-md mt-auto mb-6 text-[#D9D9D9]">Login</button>
          </div>
          :<div className="w-fit flex flex-col items-center h-full">
            <h1 className="text-center text-white">Already logged in as {socket.username}</h1>
            <button className="bg-[#3C6E71] mt-auto mb-6 w-fit pl-10 pr-10 rounded-md" onClick={logoff}>Log off</button>
          </div>
          }
          </div>
      </div> 
    )
}

const LoginObserver = observer(Login);

export default LoginObserver;