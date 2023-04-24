import React from "react";
import { useNavigate } from "react-router-dom";
import NavButton from "./ui/NavButton";

function NavButtons(){
    const navigate = useNavigate();

    return(
        <React.Fragment>
            <NavButton onClick={() => navigate('auth', { replace: false })}>Authorization</NavButton>
            <NavButton onClick={() => navigate('messenger', { replace: false })}>Messenger</NavButton>
            <NavButton onClick={() => navigate('friends', { replace: false })}>Friends</NavButton>
        </React.Fragment>
    )

}

export default NavButtons;