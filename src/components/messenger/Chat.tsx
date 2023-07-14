import { ChatElement } from "../../utils/types";
import MessageList from "./MessageList";
import {ChangeEvent, useRef, useState} from 'react';
import ChatControls from './ChatControls';
import socket from "../../store/socket";
import { observer } from "mobx-react-lite"

interface Props{
    chat: ChatElement | null,
    back: () => void,
}

function Chat({chat, back}:Props){
    
    function sendMessage(msg:string){
        if(socket.socket && chat){
            let token = socket.token;
            socket.socket.send(JSON.stringify({
                username: socket.username,
                token,
                method: "message",
                to: chat.person.username,
                text: msg,
              }))
        }
    }

    if(chat){
        return(
            <div className="chat flex flex-col h-full">
                <span className="chat-info h-7 flex flex-row items-center bg-[#353535] border-t-[1px]">
                    <button onClick={back} className="basis-1/3 text-white">Back</button>
                    <h1 className="basis-1/3 flex justify-center font-bold text-white">{chat.person.username}</h1>
                </span>
                <MessageList messages={chat.messages} person={chat.person}/>         
                <div className="mt-auto">
                    <ChatControls submit={sendMessage}/>
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