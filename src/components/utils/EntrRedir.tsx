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
            navigate('app', { replace: false })
        }else{
            navigate('auth', { replace: false })
        }
      }
  
    useEffect(()=>{
        checkAuthorization()
    },[])

    return (
        <div>
            Cheking for authorization expired
        </div>
    );
}

export default EntrRedir;