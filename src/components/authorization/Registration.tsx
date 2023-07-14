import { useState } from "react";
import socket from '../../store/socket';

function Registration(){

    interface RegisterData{
      username: string,
      password: string,
      checked: boolean,
    }

    interface Response{
        message: string,
    }

    const [regData, setRegData] = useState<RegisterData>({username:"", password:"", checked: false});

    async function register(){
        if(!regData.password || !regData.checked){
            socket.setError("Видно вы все же тупой")
            return
        }
        
        let res = await fetch("http://localhost:5000/auth/registration", {
        method:"POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({username:regData.username, password: regData.password})
      })
      let body: Response = await res.json()
      console.log(body.message);
      setRegData({username:"", password:"", checked:false})
      socket.setError(body.message)
    }

    return(
      <div className="h-full">
        <div className="auth w-fit h-full flex flex-col p-4 items-center">
          <h1 className="text-center mb-4 text-white bg-gray-700 border-x-[1px] w-full noselect">Registration</h1>
          <input placeholder="Login" value={regData.username} onChange={(e)=>setRegData({...regData, username:e.target.value})} className="border text-white text-center rounded-md border-solid border-white bg-[#353535] mb-1" type="text"/>
          <input placeholder="Password" value={regData.password} onChange={(e)=>setRegData({...regData, password:e.target.value})} className="border text-white text-center rounded-md border-solid border-white bg-[#353535] mb-1" type="password"/>
          {/* <input placeholder="Repeat password" value={regData.password2} onChange={(e)=>setRegData({...regData, password2:e.target.value})} className="border text-white text-center rounded-md border-solid border-white bg-[#353535]" type="password"/> */}
          <div className="border w-full flex justify-center p-1 mt-1 rounded-md border-solid border-white">
            <input onChange={(e)=>setRegData({...regData, checked: e.target.checked})} type="checkbox"/>
            <span className="ml-3 text-white noselect">I'm not dumb</span>
          </div>
          <button onClick={register} className="bg-[#3C6E71] pl-10 pr-10 rounded-md w-fit mt-auto mb-2 text-[#D9D9D9]">Register</button>
        </div>
      </div> 
    )
}

export default Registration;