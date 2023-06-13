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
        <div className='h-full overflow-y-auto'>
            {users?.map((user, i)=>
            <div className='w-full flex justify-between items-center pl-5 pr-7 h-10' key={i}>
                <Avatar r={32} avatar={user.avatar}/> {user.username}
                {(socket.token) 
                ? <button onClick={()=>requestFriend(user._id)} 
                    className='p-1'>Add to friends</button>
                : <></>}
            </div>
            )}
        </div>
    )
}

export default UsersList;