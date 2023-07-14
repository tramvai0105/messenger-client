import React, { Dispatch, SetStateAction } from "react";

interface Props{
    avatar: string | undefined,
    r: number,
}

function Avatar({avatar, r}: Props){

    return(
        <React.Fragment>
            <div className='rounded-full bg-gray-400' style={{"height": `${r}px`, "width": `${r}px`}}>
                    <img className="
                    object-cover w-full h-full rounded-full" 
                    src={avatar} alt="avatar"/>
            </div>
        </React.Fragment>
    )
}

export default Avatar;