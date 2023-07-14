import { useNavigate } from "react-router-dom";
import { ChatElement, Message } from '../../utils/types';
import Avatar from "../utils/Avatar";
import {useRef, useState} from 'react';
import chats from '../../store/chats';

interface Props{
    chats : ChatElement[],
    select: (index:number, msgIndex?: number | null) => void,
}

interface ChatInListProps{
    chat: ChatElement, 
    index: number, 
    select: (index:number, msgIndex?: number | null) => void,
    last? : {message: string, messageIndex: number, from: string},
}

interface Filtered{
    filtered : boolean,
    person : {
        index : number,
        chat : ChatElement,
    }[],
    messages : {
        index : number,
        chat : ChatElement,
        last : {message: string, messageIndex: number, from: string},
    }[]
}

function ChatInList({chat, index, select, last}:ChatInListProps){

    function lastMessage(msgs: Message[]){
        var msg = msgs[msgs.length - 1];
        if (msg != undefined) {
            return [msg.from ,(JSON.parse(msg.text)).slice(0, 40) + "..."];
         } else {
            return "";
         }
    }

    function foundedMessage(msg: string){
        if(msg.length > 40){
            return (JSON.parse(msg)).slice(0, 40) + "..."
        } else {return (JSON.parse(msg))}
    }

    return(
        <>
        {(last)
            ?
            <div onClick={()=>{select(index, last.messageIndex)}} key={index} className="flex p-4 h-14 select-none items-center hover:bg-gray-200 cursor-pointer">  
                <Avatar r={36} avatar={chat.person.avatar}/> 
                <span className="p-2"/> 
                <span className="px-2 rounded-md bg-white">{chat.person.username}</span>
                <span className="pl-2 w-[2px] h-full border-r-[2px] border-black"/>
                <span className="ml-2 px-2 rounded-md bg-white">{last.from} : {foundedMessage(last.message)}</span>
            </div>
            :
            <div onClick={()=>{select(index, null)}} key={index} className="flex p-4 h-14 select-none items-center hover:bg-gray-200 cursor-pointer">  
                <Avatar r={36} avatar={chat.person.avatar}/> 
                <span className="p-2"/> 
                <span className="px-2 rounded-md bg-white">{chat.person.username}</span>
                <span className="pl-2 w-[2px] h-full border-r-[2px] border-black"/>
                <span className="ml-2 px-2 rounded-md bg-white">{lastMessage(chat.messages)[0]} : {lastMessage(chat.messages)[1]}</span>
            </div>
        }
        </>
    )
}

function ChatList({chats, select}:Props){   

    const navigate = useNavigate();
    const [filteredData, setFilteredData] = useState<Filtered>({
        filtered : false,
        person : [],
        messages : []
    })
    const [input, setInput] = useState<string>("")

    function filterList(filter: string){
        var data : Filtered = {
            filtered : true,
            person : [],
            messages : []
        };
        if(filter){
            data.filtered = true;
            for(let i = 0; i < chats.length; i++){
                if(chats[i].person.username.toLowerCase().indexOf(filter) >= 0){
                    data.person.push({index: i, chat: chats[i]})
                }
                for(let j = 0; j < chats[i].messages.length; j++){
                    if(chats[i].messages[j].text.toLowerCase().indexOf(filter) >= 0){
                        data.messages.push({index: i, chat: chats[i], last:{message: chats[i].messages[j].text, messageIndex: j, from:chats[i].messages[j].from}})
                    }
                }
            }
            setFilteredData(data)
        } else {setFilteredData({...filteredData, filtered:false})}
    }

    return(
        <div className="h-full flex flex-col bg-[#D9D9D9]">
            {(chats.length > 0)?
            <div className="w-full h-[35px] min-h-[35px] bg-[#353535] flex items-center">
                <h1 className="ml-2 text-white noselect text-lg">Chat</h1>
                <input value={input} onChange={(e)=>{filterList(e.target.value.toLowerCase()); setInput(e.target.value)}} placeholder="Search" typeof="text" className="ml-2 w-[70%] h-[70%] rounded-md box-border pl-2"/>
                {(input)?<span className="text-gray-600 -translate-x-5 font-bold noselect cursor-pointer" onClick={()=>{
                    setFilteredData({filtered : false,person : [],messages : []});
                    setInput("")
                    }}>X</span>
                :<></>}
            </div>
            :<></>}
            <div className="overflow-y-auto h-full">
                {(chats.length < 1) 
                ? 
                <div className="w-full h-full flex items-center justify-center text-lg">There is no chats yet, go to see your<span className="text-blue-400 cursor-pointer pl-1" onClick={()=>navigate('../friends', { replace: false })}> friends</span></div> 
                :<></>
                }
                {(!filteredData.filtered)
                ?
                chats.map((chat, index)=> <ChatInList key={index} chat={chat} index={index} select={select}/>)
                :
                <>
                {(filteredData.person.length > 0)?<div className="w-full text-center"><span className="border-black border-b-[1px] noselect">Persons</span></div>:<></>}
                {filteredData.person.map((chat, i)=> <ChatInList key={i} chat={chat.chat} index={chat.index} select={select}/>)}
                {(filteredData.messages.length > 0)?<div className="w-full text-center"><span className="border-black border-b-[1px] noselect">In messages</span></div>:<></>}
                {filteredData.messages.map((chat, i)=> <ChatInList key={i} last={chat.last} chat={chat.chat} index={chat.index} select={select}/>)}
                {(filteredData.messages.length < 1 && filteredData.person.length < 1)?<div className="w-full h-full flex items-center justify-center">Messages not found by search</div>:<></>}
                </>
                }
            </div>
        </div>
    )
}

export default ChatList;