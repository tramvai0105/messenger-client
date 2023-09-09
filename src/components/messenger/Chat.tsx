import { ChatElement, Message } from "../../utils/types";
import MessageList from "./MessageList";
import { ChangeEvent, useRef, useState, useEffect } from 'react';
import ChatControls from './ChatControls';
import socket from "../../store/socket";
import { observer } from "mobx-react-lite"
import chats from "../../store/chats";
import uniqid from "uniqid";

interface Props{
    chat: ChatElement | null,
    back: () => void,
}

function Chat({chat, back}:Props){

    const chatRef = useRef<HTMLDivElement>(null)
    function sendMessage(msg:string, id: number, type: string = "text"){
        let unid = uniqid();
        if(socket.socket && socket.username && chat){
            let msgBody : string = msg;
            if(type == "img"){
                msgBody = "Sending photo..."
            }
            const message: Message = {
                _id: unid,
                time: Date.now(),
                body: JSON.stringify(msgBody),
                from: socket.username,
                to: chat.person.username,
                type: "text",
                mark: unid,
            }
            chats.setChats(chats.chats.map((chat)=>{
                if(chat._id == id){
                    chat.messages = [...chat.messages, message]
                    return chat
                }else{
                    return chat;
                }
            }))
            chats.sortByTime();
            let token = socket.token;
            socket.socket.send(JSON.stringify({
                username: socket.username,
                token,
                method: "message",
                to: chat.person.username,
                body: msg,
                type: type,
                mark: [id, unid],
                }))
        } else{
            return;
        }
    }

    if(chat){
        return(
            <div ref={chatRef} className="chat flex flex-col h-full">
                <span className="chat-info h-7 flex flex-row items-center bg-[#353535] border-t-[1px]">
                    <button onClick={back} className="basis-1/3 text-white">Back</button>
                    <h1 className="basis-1/3 flex justify-center font-bold text-white">{chat.person.username}</h1>
                </span>
                <MessageList messages={chat.messages} person={chat.person}/>         
                <div className="mt-auto">
                    <ChatControls id={chat._id} input={chat.inputData} chatRef={chatRef} submit={sendMessage}/>
                </div>
            </div>
        )
    }else{
        return(
            <h1>Some error</h1>
        )
    }
    
}

const ChatObserver = observer(Chat);

export default ChatObserver;