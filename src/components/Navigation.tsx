import { Outlet, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Header from "./Header";
import NavButtons from "./NavButtons";
import Profile from './Profile';
import { useEffect } from 'react';

function Navigation(){
    const navigate = useNavigate();

    useEffect(()=>{
        if(!window.localStorage.getItem("userData")){
            navigate('../auth', { replace: false })
        }
    }, [])

    return(
        <div className="flex flex-col w-full items-center h-full">
            <Header/>
            <div className="content mt-16 -ml-52 h100-header relative">
                <div className="flex flex-row h100-header">
                    <div className="flex h-fit ml-28 flex-col">
                        <Profile/>
                        <NavButtons/>
                    </div>
                    <div className="flex justify-center">
                        <div className="ml-10 w-[650px] h-[95%] bg-[#D9D9D9] 
                        rounded-bl-xl rounded-br-xl">
                            <Outlet/>
                        </div>
                    </div>
                    <div className="absolute ml-4 text-white flex justify-end h-[250px] w-[250px] left-full">
                        <span className="mr-10 cursor-pointer noselect">crdt</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
const NavigationObserver = observer(Navigation);

export default NavigationObserver;