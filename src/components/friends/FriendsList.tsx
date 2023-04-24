import { useEffect, useState } from 'react';
import socket from '../../store/socket';
import NewChat from './NewChat';

interface User{
    _id: string,
    username: string,
}


function FriendsList(){

    const [friends, setFriends] = useState<User[] | null>(null)

    useEffect(()=>{
        if(socket.token){
            getFriends()}
    }, [])
    
    async function getFriends() {
        let res = await fetch("http://localhost:5000/friends/friendslist",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${socket.token}`,
            },
          })
        let {friends, message} = await res.json()
        setFriends(friends)
    }

    async function removeFriend(id:string) {
            let res = await fetch("http://localhost:5000/friends/removefriend",{
                method:"POST",
                headers: {
                  'Content-Type': 'application/json;charset=utf-8',
                  'Authorization': `Bearer ${socket.token}`,
                },
                body: JSON.stringify({friendId: id})
              })
            let {message} = await res.json()
            alert(message)
    }

    return(
        <div className='h-full'>
            {friends?.map((friend, i)=>
            <div className='bw-full flex justify-between items-center pl-5 pr-7 h-10' key={i}>
                {friend.username}
                <div className='flex flex-row'>
                    <NewChat username={friend.username}/>
                    {(socket.token) 
                    ? <button onClick={()=>removeFriend(friend._id)} 
                        className='p-1'>Remove friend</button>
                    : <></>}
                </div>
            </div>
            )}
        </div>
    )
}

export default FriendsList;