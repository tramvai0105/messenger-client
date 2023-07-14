var elvis = require("../../img/elvis.jpg")

interface LogoCellProps{
    rot?: number;
    children: string;
}

function LogoCell({children, rot=9}:LogoCellProps){
    return(
        <span className={`h-[120px] w-[120px] border bg-white
        border-white flex items-center justify-center rotate-[${rot}deg]`}>
            <span className="text-center text-black text-7xl noselect">{children}</span>
        </span>
    )
}

function Logo(){

    return(
        <div className="absolute z-30 flex flex-col 
        items-center justify-between h-full p-5 
        w-[400px] text-white right-full translate-x-full">
        <LogoCell>E</LogoCell>
        <div className="flex flex-row rotate-[9deg]">
            <img className="h-[120px] noselect w-[120px] bg-cover mr-2" src={elvis}/>
            <LogoCell rot={0}>L</LogoCell>
        </div>
        <LogoCell>V</LogoCell>
        <LogoCell>I</LogoCell>
        <LogoCell>S</LogoCell>
        </div>
    )
}

export default Logo;