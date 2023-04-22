import { ChatElement } from "../../utils/types";

interface Props{
    chats : ChatElement[],
    select: (index:number) => void,
}

function ChatList({chats, select}:Props){

    return(
        <div className="chat-list flex flex-col space-y-1">
            {chats.map((chat, index)=>
            <div onClick={()=>{select(index)}} key={index} className="chat-item flex p-2 select-none items-center hover:bg-gray-200 cursor-pointer">  
            {chat.person.username}
            </div>
            )}
        </div>
    )
}

export default ChatList;