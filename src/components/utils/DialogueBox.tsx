import React, { Dispatch, SetStateAction } from "react";

interface Props{
    children: React.ReactNode,
    display: boolean,
    set: Dispatch<SetStateAction<boolean>>,
}

function DialogueBox({children, display, set}: Props){

    return(
        <React.Fragment>
        {(display)
        ?
        <div className="bg-black/40 top-0
        flex flex-row items-center justify-center 
        left-0 w-full h-full fixed z-30 hover:cursor-pointer" onClick={()=>set(false)}>
            <div className="relative pr-4 pt-4">
                <span className="absolute right-0 top-0 text-white">X</span>
                <div onClick={(e)=>e.stopPropagation()} className="bg-white hover:cursor-default rounded-md w-fit h-fit m-0 p-4
                flex flex-col items-center relative">
                    {children}
                </div>
            </div>
        </div>
        : <></>
        }
        </React.Fragment>
    )
}

export default DialogueBox;