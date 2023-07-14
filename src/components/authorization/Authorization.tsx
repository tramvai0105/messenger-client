import Login from "./Login";
import Registration from "./Registration";
import socket from '../../store/socket';
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useState, useRef, useEffect } from 'react';
import Logo from "./Logo";

enum Stage{
    Login,
    Register
}

function Authorization(){
    const navigate = useNavigate();

    const [stage, setStage] = useState<Stage>(Stage.Login);
    const loginRef = useRef<HTMLDivElement>(null)
    const regRef = useRef<HTMLDivElement>(null)
    const errorRef = useRef<HTMLDivElement>(null)
    const changeButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(()=>{
        if(socket.error && errorRef.current){
            errorRef.current.classList.remove("opacity-0")
            errorRef.current.classList.add("z-20")
            setTimeout(()=>{socket.setError(""); 
            errorRef.current?.classList.remove("z-20")
            errorRef.current?.classList.add("opacity-0")
            }, 900)
        }
    }, [socket.error])

    function changeStage(){
        if(!socket.token){if(stage == Stage.Login && loginRef.current && regRef.current && changeButtonRef.current){
            setStage(Stage.Register);
            changeButtonRef.current.classList.add("translate-x-[51px]")
            regRef.current.addEventListener("transitionend", 
            ()=>{if(regRef.current && !regRef.current.classList.contains("reg-hidden")){regRef.current.classList.add("z-10")}})
            regRef.current.classList.remove("reg-hidden")
            loginRef.current.classList.add("log-hidden")
            loginRef.current.classList.remove("z-10")
        }
        if(stage == Stage.Register && loginRef.current && regRef.current && changeButtonRef.current){
            setStage(Stage.Login);
            loginRef.current.addEventListener("transitionend", 
            ()=>{if(loginRef.current && !loginRef.current.classList.contains("log-hidden")){loginRef.current.classList.add("z-10")}})
            regRef.current.classList.add("reg-hidden")
            loginRef.current.classList.remove("log-hidden")
            regRef.current.classList.remove("z-10")
            changeButtonRef.current.classList.remove("translate-x-[51px]")
        }}
    }

    return(
        <div className="h-full absolute flex w-full flex-col justify-center items-center">
            <Logo/>
            <div className="absolute h-[288px] w-[288px] z-10  flex justify-center items-center">
                <div className="absolute h-[455px] w-[455px] 
                 
                border-[#ffffff] border-solid border-[22px] rounded-full"></div>
                <div className="absolute h-[520px] w-[520px] 

                border-[#ffffff] border-solid border-[22px] rounded-full"></div>
                <div className="absolute h-[580px] w-[580px] 

                border-[#ffffff] border-solid border-[22px] rounded-full"></div>
                <div className="absolute h-[640px] w-[640px] 

                border-[#ffffff] border-solid border-[22px] rounded-full"></div>
            </div>
            <div className="absolute h-fit w-fit flex flex-col justify-center items-center">
                <div className="flex z-10 mb-1 h-fit w-fit flex-row justify-center items-center cursor-pointer" onClick={()=>changeStage()}>
                    <span className="pr-4 rounded-sm bg-[#000000] text-white text-xl noselect">L</span>
                    <div className="flex items-center bg-white h-[2px] w-28 pl-1 pr-1">
                        <button ref={changeButtonRef} className="relative transition-transform duration-700 w-[51px] bg-[#3C6E71] rounded-md h-[18px]"></button>
                    </div>
                    <span className="pl-4 rounded-sm bg-[#000000] text-white text-xl noselect">R</span>
                </div>
                <div className="flex flex-row  h-[210px] w-[216px] justify-center">
                    <div ref={errorRef} className="absolute opacity-0 transition-opacity auth-trans flex items-center bg-[#353535] border border-solid border-[#fd8a43] rounded-md w-[216px] h-[210px]"> 
                        <span className="text-white h-fit px-3 text-center noselect">{socket.error}</span>
                    </div>
                    <div ref={loginRef} className="absolute z-10 auth-trans flex bg-[#353535] border border-solid border-gray-50 rounded-md w-fit h-[210px]"> 
                        <Login/>
                    </div>
                    <div ref={regRef} className="absolute reg-hidden auth-trans flex bg-[#353535] border border-solid border-gray-50 rounded-md w-fit h-[210px]">
                        <Registration/>
                    </div>
                </div>
                {(socket.token) 
                    ?<button className="bg-[#ffffff] relative mt-2 z-10 p-2 mr-2 rounded-sm ml-4"
                    onClick={()=>navigate('../app/messenger', { replace: false })}>{"<-(To App)"}</button>
                    :<></>
                }
            </div>
        </div>
    )
}

const AuthorizationObserver = observer(Authorization);

export default AuthorizationObserver;
