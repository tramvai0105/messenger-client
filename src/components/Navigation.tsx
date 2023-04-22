import { Outlet, useNavigate } from "react-router-dom";
import React from "react";
import socket from '../store/socket';
import { observer } from "mobx-react-lite";

function Navigation(){
    const navigate = useNavigate();

    return(
        <React.Fragment>
            <div className="flex w-40 h-fit p-2 flex-col border border-solid">
                <h1 className="text-center mb-1">{socket.username}</h1>
                <button onClick={() => navigate('auth', { replace: false })} className="mb-1 bg-amber-300">Authorization</button>
                <button onClick={() => navigate('messenger', { replace: false })} className="mb-1 bg-amber-300">Messenger</button>
                <button onClick={() => navigate('friends', { replace: false })} className="mb-1 bg-amber-300">Friends</button>
            </div>
            <Outlet/>
        </React.Fragment>
    )
}
const NavigationObserver = observer(Navigation);

export default NavigationObserver;