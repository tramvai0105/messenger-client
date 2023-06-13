import React, { useRef } from "react";
import Login from "./Login";
import Registration from "./Registration";
import socket from "../../store/socket";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

function Authorization(){
    const navigate = useNavigate();

    return(
        <div className="flex w-full justify-center items-center">
            {(socket.token) 
            ?<button className="bg-blue-500 p-2 mr-2 rounded-sm"
            onClick={()=>navigate('../app', { replace: false })}>{"<-(To App)"}</button>
            :<></>
            }
            <div className="flex flex-row bg-white w-fit h-fit p-20 rounded-md">
                <Login/> 
                <div className="w-6"></div>
                <div className="h-[200px] w-6 border-l-2 border-black"></div>
                <Registration/>
            </div>
        </div>
        
    )
}

const AuthorizationObserver = observer(Authorization);

export default AuthorizationObserver;
