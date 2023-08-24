import socket from '../../store/socket';
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Logo from "./Logo";
import MenuSlider from "./MenuSlider";
import { useEffect, useRef } from 'react';


function BackGroundCircles(){

    const circlesRef = useRef<HTMLDivElement[] | null[]>([])

    useEffect(()=>{
        if(circlesRef.current.length){
            circlesRef.current.forEach((node)=>{
                node?.classList.remove("opacity-0")
            })
        }
    },[])

    return(
        <div className="absolute h-[288px] w-[288px] z-10  flex justify-center items-center">
            <div ref={el=> circlesRef.current[0] = el} className="absolute h-[455px] w-[455px] opacity-0
            border-[#ffffff] border-solid border-[22px] rounded-full"
            style={{transition: "opacity 1.2s 600ms"}}></div>
            <div ref={el=> circlesRef.current[1] = el} className="absolute h-[520px] w-[520px] opacity-0
            border-[#ffffff] border-solid border-[22px] rounded-full"
            style={{transition: "opacity 1.2s 400ms"}}></div>
            <div ref={el=> circlesRef.current[2] = el} className="absolute h-[580px] w-[580px] opacity-0
            border-[#ffffff] border-solid border-[22px] rounded-full"
            style={{transition: "opacity 1.2s 200ms"}}></div>
            <div ref={el=> circlesRef.current[3] = el} className="absolute h-[640px] w-[640px] opacity-0
            border-[#ffffff] border-solid border-[22px] rounded-full"
            style={{transition: "opacity 1.2s"}}></div>
        </div>
    )
}

function Authorization(){
    const navigate = useNavigate();

    const sliderRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        if(sliderRef.current){
            sliderRef.current.classList.remove("opacity-0")
        }
    }, [])

    return(
        <div className="h-full absolute flex w-full flex-col justify-center items-center">
            <Logo/>
            <BackGroundCircles/>
            <div ref={sliderRef} style={{transition: "opacity 1200ms 600ms"}} className="absolute h-fit w-fit flex flex-col justify-center items-center opacity-0">
                <MenuSlider/>
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
