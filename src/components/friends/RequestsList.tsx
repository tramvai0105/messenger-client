import { useEffect, useState } from 'react';
import socket from '../../store/socket';

interface User{
    _id: string,
    username: string,
}

function RequestsList(){

    const [requests, setRequests] = useState<User[] | null>(null)

    useEffect(()=>{
        if(socket.token){
            getRequests()}
    }, [])
    
    async function getRequests() {
        let res = await fetch("http://localhost:5000/friends/friendslist",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${socket.token}`,
            },
          })
        let {requests} = await res.json()
        setRequests(requests)
    }

    async function acceptFriend(id: string){
        let res = await fetch("http://localhost:5000/friends/acceptfriend",{
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
            {requests?.map((request, i)=>
            <div className='w-full flex items-center pl-5 h-10' key={i}>
                {request.username}
                {(socket.token) 
                ? <button onClick={()=>acceptFriend(request._id)} 
                    className='p-1'>Add to friends</button>
                : <></>}
            </div>
            )}
        </div>
    )
}

export default RequestsList;