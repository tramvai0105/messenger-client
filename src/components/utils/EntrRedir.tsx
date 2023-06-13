import { useEffect } from "react";
import socket from '../../store/socket';
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import chats from "../../store/chats";

// interface Props{
//     token: string | undefined,
// }

function EntrRedir() {

    const navigate = useNavigate()

    async function checkAuthorization(){
        const userData = window.localStorage.getItem("userData")
        if(userData){
            let {token} = JSON.parse(userData)
            let res = await fetch("http://localhost:5000/auth/check",{
                    method:"POST",
                    headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': `Bearer ${token}`,
                    },
                })
            if(res.status == 200){
                navigate('app', { replace: false })
            }else{
                navigate('auth', { replace: false })
                const localStorage = window.localStorage;
                localStorage.setItem("userData", "");
                socket.setToDefault();
                chats.setToDefault();
            }
        }else{navigate('auth', { replace: false })}
      }
  
    useEffect(()=>{
        checkAuthorization()
    },[])

    return (
        <div>
        
        </div>
    );
}

export default EntrRedir;