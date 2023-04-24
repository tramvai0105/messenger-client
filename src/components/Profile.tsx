import React from "react";


function Profile(){

    return(
        <React.Fragment>
            <div className="absolute h-[288px] w-[288px] 
            translate-x-[-80px]
            translate-y-[-80px] 
            border-[#734C8F] border-solid border-[20px] rounded-full"></div>
            <div className="absolute h-[248px] w-[248px] 
            translate-x-[-60px]
            translate-y-[-60px] 
            border-[#D4D26A] border-solid border-[20px] rounded-full"></div>
            <div className="absolute h-[208px] w-[208px] 
            translate-x-[-40px]
            translate-y-[-40px] 
            border-[#734C8F] border-solid border-[20px] rounded-full"></div>
            <div className="absolute h-[168px] w-[168px] 
            translate-x-[-20px]
            translate-y-[-20px] 
            border-[#D4D26A] border-solid border-[20px] rounded-full"></div>
            <div className="w-52 h-32 mb-6 bg-[#3A1356] 
            rounded-tl-[128px] rounded-bl-[128px] z-10">    
            </div>
        </React.Fragment>
        
    )
}

export default Profile;
