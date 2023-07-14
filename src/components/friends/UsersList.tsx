import { useEffect, useState } from 'react';
import socket from '../../store/socket';
import messengerUtils from '../messenger/messenge.utils';
import Avatar from '../utils/Avatar';

interface User{
    _id: string,
    username: string,
    avatar: string,
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
        let users : User[] = await res.json()
        users = users.filter((user)=> user.username !== socket.username);
        let persons = []
        for(let i = 0; i < users.length; i++){
            persons.push(users[i].username)
        }
        let avatars = await messengerUtils.getAvatars(persons)
        for(let i = 0; i < users.length; i++){
            let avatar = avatars.get(users[i].username)
            if(typeof avatar == "string"){users[i].avatar = avatar}
        }
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
        <div className='h-full w-full flex flex-col overflow-y-auto'>
            {users?.map((user, i)=>
            <div className='flex w-full justify-between items-center bg-white rounded-md pl-2 pr-2 h-10 mb-1' key={i}>
                <Avatar r={32} avatar={user.avatar}/> {user.username}
                {(socket.token) 
                ? <button onClick={()=>requestFriend(user._id)} 
                    className='border-b-[2px] p-1 h-[30px] border-black'>Add to friends</button>
                : <></>}
            </div>
            )}
        </div>
    )
}

export default UsersList;