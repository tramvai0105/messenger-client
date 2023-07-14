import { useEffect, useState } from 'react';
import socket from '../../store/socket';
import NewChat from './NewChat';
import Avatar from '../utils/Avatar';
import messengerUtils from '../messenger/messenge.utils';

interface User{
    _id: string,
    username: string,
    avatar: string,
}


function FriendsList(){

    const [friends, setFriends] = useState<User[] | null>(null)

    useEffect(()=>{
        getFriends();
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
        let persons = []
        for(let i = 0; i < friends.length; i++){
            persons.push(friends[i].username)
        }
        let avatars = await messengerUtils.getAvatars(persons)
        for(let i = 0; i < friends.length; i++){
            friends[i].avatar = avatars.get(friends[i].username)
        }
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
        <div className='h-full w-full flex flex-col'>
            {friends?.map((friend, i)=>
            <div className='w-full flex justify-between items-center bg-white rounded-md pl-2 pr-2 h-10 mb-1' key={i}>
                <Avatar r={32} avatar={friend.avatar}/> {friend.username}
                <div className='flex flex-row'>
                    <NewChat username={friend.username}/>
                    {(socket.token) 
                    ? <button onClick={()=>removeFriend(friend._id)} 
                        className='border-b-[2px] p-1 ml-2 h-[30px] border-black'>Remove friend</button>
                    : <></>}
                </div>
            </div>
            )}
        </div>
    )
}

export default FriendsList;