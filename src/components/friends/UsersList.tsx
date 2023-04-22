import { useEffect, useState } from 'react';
import socket from '../../store/socket';

interface User{
    _id: string,
    username: string,
}

function UsersList(){

    const [users, setUsers] = useState<User[] | null>(null)

    useEffect(()=>{
        getUsers()
    }, [])
    
    async function getUsers() {
        let res = await fetch("http://localhost:5000/users/",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${socket.token}`,
            },
          })
        let users = await res.json()
        setUsers(users)
    }

    async function requestFriend(id : string){
        let res = await fetch("http://localhost:5000/friends/requestfriend",{
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
        <div className='w-9/12 h-full border border-solid'>
            {users?.map((user, i)=>
            <div className='border border-solid w-full flex justify-between items-center pl-5 pr-7 h-10' key={i}>
                {user.username}
                {(socket.token) 
                ? <button onClick={()=>requestFriend(user._id)} 
                    className='border p-1 border-solid border-gray-700'>Add to friends</button>
                : <></>}
            </div>
            )}
        </div>
    )
}

export default UsersList;