import { useEffect, useState } from 'react';
import socket from '../../store/socket';
import messengerUtils from '../messenger/messenge.utils';
import Avatar from '../utils/Avatar';
import FActButton from './FriendsActionButton';

interface User{
    _id: string,
    username: string,
    avatar: string,
}

function RequestsList(){

    const [requests, setRequests] = useState<User[] | null>(null)
    const [msg, setMsg] = useState({id: -1, msg: ""})

    useEffect(()=>{
        if(socket.token){
            getRequests()}
    }, [])

    useEffect(()=>{
        if(msg.id > -1){
            console.log(123);
            setTimeout(()=>{
                setMsg({id: -1, msg: ""})
                getRequests();
            }, 1200)
        }
    }, [msg])
    
    async function getRequests() {
        let res = await fetch(`http://${process.env.REACT_APP_SERVER_IP}/friends/friendslist`,{
            method:"POST",
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${socket.token}`,
            },
          })
        let {requests} = await res.json()
        let persons = []
        for(let i = 0; i < requests.length; i++){
            persons.push(requests[i].username)
        }
        let avatars = await messengerUtils.getAvatars(persons)
        for(let i = 0; i < requests.length; i++){
            requests[i].avatar = avatars.get(requests[i].username)
        }
        setRequests(requests)
    }

    async function acceptFriend(id: string, index: number){
        let res = await fetch(`http://${process.env.REACT_APP_SERVER_IP}/friends/acceptfriend`,{
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
            {requests?.map((request, i)=>
            {if(msg.id === i){
                return(
                <div className='w-full flex min-h-[40px] justify-between items-center bg-[#508b8f] rounded-md pl-2 pr-2 h-10 mb-1' key={i}>
                    <Avatar r={32} avatar={request.avatar}/>
                    {msg.msg}
                    <span></span>
                </div>)}
            else{
                return(
                    <div className='w-full min-h-[40px] flex justify-between items-center bg-white rounded-md pl-2 pr-2 h-10 mb-1' key={i}>
                        <Avatar r={32} avatar={request.avatar}/> {request.username}
                        {(socket.token) 
                        ? <FActButton onClick={()=>acceptFriend(request._id, i)}>Add to friends</FActButton>
                        : <></>}
                    </div>)
            }
            }
            )}
        </div>
    )
}

export default RequestsList;