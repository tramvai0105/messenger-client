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

function UsersList(){

    const [users, setUsers] = useState<User[] | null>(null)
    const [msg, setMsg] = useState({id: -1, msg: ""})

    useEffect(()=>{
        getUsers()
    }, [])

    useEffect(()=>{
        if(msg.id > -1){
            console.log(123);
            setTimeout(()=>{
                setMsg({id: -1, msg: ""})
                getUsers();
            }, 1200)
        }
    }, [msg])
    
    async function getUsers() {
        let res = await fetch(`http://${process.env.REACT_APP_SERVER_IP}/users/`,{
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

    async function requestFriend(id : string, index: number){
        let res = await fetch(`http://${process.env.REACT_APP_SERVER_IP}/friends/requestfriend`,{
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
        <div className='h-full w-full flex flex-col scrollbar-thin scrollbar-thumb-[#353535] overflow-y-auto'>
            {users?.map((user, i)=>
            // Первое это сообщение при нажатии на добавить друга
            {if(msg.id === i)
                {return(<div className='flex w-full justify-between bg-[#508b8f] items-center min-h-[40px] rounded-md pl-2 pr-2 mb-1' key={i}>
                    <Avatar r={32} avatar={user.avatar}/>
                    {msg.msg}
                    <span></span>
                </div>)}
            else{
                return(<div className='flex w-full justify-between items-center bg-white min-h-[40px] rounded-md pl-2 pr-2 mb-1' key={i}>
                    <Avatar r={32} avatar={user.avatar}/> {user.username}
                    {(socket.token) 
                    ? <FActButton onClick={()=>requestFriend(user._id, i)}>Add to friends</FActButton>
                    : <></>}
                </div>)
            }
            }
            )}
        </div>
    )
}

export default UsersList;