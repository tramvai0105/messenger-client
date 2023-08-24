import { useEffect, useRef } from "react";

var elvis = require("../../img/elvis.jpg")

interface LogoCellProps{
    rot?: number;
    children: string;
}

function LogoCell({children, rot=9}:LogoCellProps){

    const cellRef = useRef<HTMLSpanElement>(null)

    useEffect(()=>{
        if(cellRef.current){
            cellRef.current.classList.remove("opacity-0")
        }
    }, [])

    return(
        <span ref={cellRef} className={`h-[120px] w-[120px] border bg-white
        border-white flex items-center opacity-0 justify-center rotate-[${rot}deg]`}
        style={{transition: "opacity 2.5s 150ms"}}>
            <span className="text-center text-black text-7xl noselect">{children}</span>
        </span>
    )
}

function Logo(){

    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(()=>{
        if(imgRef.current){
            imgRef.current.classList.remove("opacity-0")
        }
    }, [])

    return(
        <div className="absolute z-30 flex flex-col 
        items-center justify-between h-full p-5 
        w-[400px] text-white right-full translate-x-full">
            <LogoCell>E</LogoCell>
            <div className="flex flex-row rotate-[9deg]">
                <img ref={imgRef} 
                className="h-[120px] noselect w-[120px] opacity-0 bg-cover mr-2" 
                style={{transition: "opacity 2.5s 150ms"}}
                src={elvis}/>
                <LogoCell rot={0}>L</LogoCell>
            </div>
            <LogoCell>V</LogoCell>
            <LogoCell>I</LogoCell>
            <LogoCell>S</LogoCell>
        </div>
    )
}

export default Logo;