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
        <div className="flex h-full">
            <div className="w-10/12">
                {(menu == FriendsMenu.Load) ? <div className="w-full h-full flex items-center justify-center">Loading...</div> : <></>}
                {(menu == FriendsMenu.Friends) ? <FriendsList/> : <></>}
                {(menu == FriendsMenu.Users) ? <UsersList/> : <></>}
                {(menu == FriendsMenu.Requests) ? <RequestsList/> : <></>}
            </div>
            <div className="w-2/12 h-fit flex flex-col">
                <button onClick={()=>setMenu(FriendsMenu.Friends)} 
                className="p-3 w-full h-fit bg-green-400">Friends</button>
                <button onClick={()=>setMenu(FriendsMenu.Users)} 
                className="p-3 w-full h-fit bg-green-400">All users</button>
                <button onClick={()=>setMenu(FriendsMenu.Requests)} 
                className="p-3 w-full h-fit bg-green-400">Requests</button>
            </div>
        </div>
    )
}

const FriendsObserver = observer(Friends);

export default FriendsObserver;