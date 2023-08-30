import { useRef } from "react";
import { useState } from 'react';

enum creditState{
    Show,
    Hide,
}

function Credit(){

    const [credit, setCredit] = useState<creditState>(creditState.Hide)
    const borderRef = useRef<HTMLDivElement>(null);
    const innerTextRef = useRef<HTMLDivElement>(null);
    const urlRef = useRef<HTMLAnchorElement>(null);

    function credits(){
        if(credit == creditState.Hide && borderRef.current && innerTextRef.current && urlRef.current){
            setCredit(creditState.Show);
            borderRef.current.classList.add("border-white","border");
            innerTextRef.current.classList.remove("opacity-0");
            urlRef.current.classList.add("cursor-pointer")
        }   
        else if(credit == creditState.Show && borderRef.current && innerTextRef.current && urlRef.current){
            setCredit(creditState.Hide);
            borderRef.current.classList.remove("border-white","border");
            innerTextRef.current.classList.add("opacity-0");
            urlRef.current.classList.remove("cursor-pointer")
        }   
    }

    return(
        <div ref={borderRef} className="absolute ml-4 text-white flex flex-col h-[250px] w-[250px] left-full">
            <span onClick={()=>credits()} className="mr-10 cursor-pointer noselect flex justify-end">crdt</span>
            <div ref={innerTextRef} className="p-4 opacity-0">
                <div><span className="noselect">Этот сайтик сделал свин в качестве своего пет-проджекта. </span> </div>
                <br></br> 
                <a ref={urlRef} onClick={()=>{window.open("https://github.com/tramvai0105", "_blank")}} className="pt-4 pl-4 noselect"> GitHub </a> 
            </div>
        </div>
    )
}

export default Credit;