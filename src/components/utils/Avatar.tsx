import React, { Dispatch, SetStateAction } from "react";
import DialogueBox from "./DialogueBox";
import {useState} from 'react';

interface Props{
    avatar: string | undefined,
    r: number,
}

function Avatar({avatar, r}: Props){

    const [dialogue, setDialogue] = useState<boolean>(false)

    return(
        <React.Fragment>
            <div className='rounded-full bg-gray-400' style={{"height": `${r}px`, "width": `${r}px`}}>
                    <img className="
                    object-cover cursor-pointer w-full h-full rounded-full" 
                    src={avatar} alt="avatar" onClick={()=>setDialogue(true)} />
                    <DialogueBox display={dialogue} set={setDialogue}>
                        <img className="max-h-[500px] max-w-[1200px]" src={avatar} alt="image not found"/>
                    </DialogueBox>
            </div>
        </React.Fragment>
    )
}

export default Avatar;