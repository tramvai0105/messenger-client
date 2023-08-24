import { useEffect, useState } from 'react';
import socket from '../../store/socket';
import NewChat from './NewChat';
import Avatar from '../utils/Avatar';
import messengerUtils from '../messenger/messenge.utils';
import FActButton from './FriendsActionButton';

interface User{
    _id: string,
    username: string,
    avatar: string,
}


function FriendsList(){

    const [friends, setFriends] = useState<User[] | null>(null)
    const [msg, setMsg] = useState({id: -1, msg: ""})

    useEffect(()=>{
        getFriends();
    }, [])

    useEffect(()=>{
        if(msg.id > -1){
            console.log(123);
            setTimeout(()=>{
                setMsg({id: -1, msg: ""})
                getFriends();
            }, 1200)
        }
    }, [msg])
    
    async function getFriends() {
        let res = await fetch(`http://${process.env.REACT_APP_SERVER_IP}/friends/friendslist`,{
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

    async function removeFriend(id:string, index: number) {
            let res = await fetch(`http://${process.env.REACT_APP_SERVER_IP}/friends/removefriend`,{
                method:"POST",
                headers: {
                  'Content-Type': 'application/json;charset=utf-8',
                  'Authorization': `Bearer ${socket.token}`,
                },
                body: JSON.stringify({friendId: id})
              })
            let {message} = await res.json()
            setMsg({id: index, msg: message})
    }

    return(
        <div className='h-full w-full flex flex-col'>
            {(friends && friends.length < 1) ? 
            <div className='h-full w-full flex items-center justify-center'>
                <span className='text-lg'>
                    You not have friends yet, go to <span className='text-blue-400'>All users</span> to get some!</span>
            </div> 
            : <></>}
            {friends?.map((friend, i)=>
            {if(msg.id === i)
                return(
                <div className='w-full flex justify-between items-center bg-[#508b8f] rounded-md pl-2 pr-2 h-10 mb-1' key={i}>
                    <Avatar r={32} avatar={friend.avatar}/>
                    <div className='flex flex-row'>
                        {msg.msg}
                    </div>
                    <span></span>
                </div>)
            else{
                return(
                    <div className='w-full flex justify-between items-center bg-white rounded-md pl-2 pr-2 h-10 mb-1' key={i}>
                        <Avatar r={32} avatar={friend.avatar}/> {friend.username}
                        <div className='flex flex-row'>
                            <NewChat username={friend.username}/>
                            {(socket.token) 
                            ? <FActButton onClick={()=>removeFriend(friend._id, i)}>Remove friend</FActButton>
                            : <></>}
                        </div>
                    </div>)
                }
            }
            )}
        </div>
    )
}

export default FriendsList;