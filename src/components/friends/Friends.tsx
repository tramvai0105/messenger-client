import socket from "../../store/socket";
import FriendsList from "./FriendsList";
import { useState, useEffect } from 'react';
import UsersList from "./UsersList";
import RequestsList from "./RequestsList";

enum FriendsMenu{Users, Friends, Requests}

function Friends(){

    const [menu, setMenu] = useState<FriendsMenu>(FriendsMenu.Friends)

    return(
        <div className="friends flex">
            {(menu == FriendsMenu.Friends) ? <FriendsList/> : <></>}
            {(menu == FriendsMenu.Users) ? <UsersList/> : <></>}
            {(menu == FriendsMenu.Requests) ? <RequestsList/> : <></>}
            <div className="w-3/12 h-fit flex flex-col">
                <button onClick={()=>setMenu(FriendsMenu.Friends)} 
                className="p-3 w-24 h-fit bg-green-400">Friends</button>
                <button onClick={()=>setMenu(FriendsMenu.Users)} 
                className="p-3 w-24 h-fit bg-green-400">All users</button>
                <button onClick={()=>setMenu(FriendsMenu.Requests)} 
                className="p-3 w-24 h-fit bg-green-400">Requests</button>
            </div>
        </div>
    )
}

export default Friends;