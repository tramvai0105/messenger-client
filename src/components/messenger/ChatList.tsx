import { ChatElement } from "../../utils/types";
import Avatar from "../utils/Avatar";

interface Props{
    chats : ChatElement[],
    select: (index:number) => void,
}

function ChatList({chats, select}:Props){

    return(
        <div className="chat-list flex flex-col space-y-1">
            {chats.map((chat, index)=>
            <div onClick={()=>{select(index)}} key={index} className="flex p-4 h-14 select-none items-center hover:bg-gray-200 cursor-pointer">  
            <Avatar r={36} avatar={chat.person.avatar}/> <span className="p-3"/> {chat.person.username}
            </div>
            )}
        </div>
    )
}

export default ChatList;