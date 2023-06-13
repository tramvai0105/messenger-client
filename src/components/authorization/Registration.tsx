import { useState } from "react";

function Registration(){

    interface RegisterData{
      username: string,
      password1: string,
      password2: string,
    }

    interface Response{
        message: string,
    }

    const [regData, setRegData] = useState<RegisterData>({username:"", password1:"", password2:""});

    async function register(){
        if(regData.password1 !== regData.password2){
            alert("Пароли не совпадают")
            return
        }
        
        let res = await fetch("http://localhost:5000/auth/registration", {
        method:"POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({username:regData.username, password: regData.password1})
      })
      let body: Response = await res.json()
      console.log(body.message);
      setRegData({username:"", password1:"", password2:""})
      alert(body.message);
    }

    return(
      <div className="">
        <div className="auth w-fit h-fit flex flex-col border border-solid border-black p-4">
          <h1 className="text-center">Registration</h1>
          <input placeholder="Login" value={regData.username} onChange={(e)=>setRegData({...regData, username:e.target.value})} className="border border-solid border-black mb-1" type="text"/>
          <input placeholder="Password" value={regData.password1} onChange={(e)=>setRegData({...regData, password1:e.target.value})} className="border border-solid border-black mb-1" type="password"/>
          <input placeholder="Password" value={regData.password2} onChange={(e)=>setRegData({...regData, password2:e.target.value})} className="border border-solid border-black mb-1" type="password"/>
          <button onClick={register} className="bg-cyan-300">Login</button>
        </div>
      </div> 
    )
}

export default Registration;