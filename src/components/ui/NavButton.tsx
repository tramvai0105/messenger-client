import React from "react";
import { useNavigate } from "react-router-dom";

interface Props{
    onClick: () => void,
    children: string,
}

function NavButton({onClick, children}: Props){
    const navigate = useNavigate();

    function navigation(){
        const localStorage = window.localStorage
        if(!localStorage.getItem("userData")){
            navigate("../auth")
        }else{
            onClick()
        }
    }

    return(
        <React.Fragment>
            <button onClick={navigation} className="w-48 hover:bg-[#508b8f] z-10 h-12 mb-4 shadow-lg bg-[#3C6E71] border-t-[2px] rounded-b-lg text-white">{children}</button>         
        </React.Fragment>
    )

}

export default NavButton;