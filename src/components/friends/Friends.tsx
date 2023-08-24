import socket from "../../store/socket";
import FriendsList from "./FriendsList";
import { useState, useEffect } from 'react';
import UsersList from "./UsersList";
import RequestsList from "./RequestsList";
import { observer } from "mobx-react-lite";

enum FriendsMenu{Users, Friends, Requests, Load}

function Friends(){

    const [menu, setMenu] = useState<FriendsMenu>(FriendsMenu.Load)

    useEffect(()=>{
        if(socket.token){
            setMenu(FriendsMenu.Friends);
        }
    }, [socket.token])

    return(
        <div className="flex h-full bg-[#D9D9D9]">
            <div className="w-10/12">
                <div className="h-full w-full pt-2 flex flex-row">
                <div className="pl-3"></div>
                    {(menu == FriendsMenu.Load) ? <div className="w-full h-full flex items-center justify-center">Loading...</div> : <></>}
                    {(menu == FriendsMenu.Friends) ? <FriendsList/> : <></>}
                    {(menu == FriendsMenu.Users) ? <UsersList/> : <></>}
                    {(menu == FriendsMenu.Requests) ? <RequestsList/> : <></>}
                <div className="pl-1"></div>
                </div>
            </div>
            <div className="w-2/12 h-full flex flex-col border-l-[2px] border-black pl-1 pt-2">
                <button onClick={()=>setMenu(FriendsMenu.Friends)} 
                className="p-3 w-full h-fit bg-[#3C6E71] hover:bg-[#508b8f] rounded-l-md mb-1 text-white">Friends</button>
                <button onClick={()=>setMenu(FriendsMenu.Users)} 
                className="p-3 w-full h-fit bg-[#3C6E71] hover:bg-[#508b8f] rounded-l-md mb-1 text-white">All users</button>
                <button onClick={()=>setMenu(FriendsMenu.Requests)} 
                className="p-3 w-full h-fit bg-[#3C6E71] hover:bg-[#508b8f] rounded-l-md mb-1 text-white">Requests</button>
            </div>
        </div>
    )
}

const FriendsObserver = observer(Friends);

export default FriendsObserver;