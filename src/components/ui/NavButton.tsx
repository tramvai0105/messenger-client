import React from "react";

interface Props{
    onClick: () => void,
    children: string,
}

function NavButton({onClick, children}: Props){

    return(
        <React.Fragment>
            <button onClick={onClick} className="w-48 z-10 h-12 mb-4 shadow-lg bg-[#FFFDAA]">{children}</button>         
        </React.Fragment>
    )

}

export default NavButton;