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
            <div className="chat flex flex-col">
                <span className="chat-info flex flex-row items-center bg-gray-200">
                    <button onClick={back} className="bg-white basis-1/3">Back</button>
                    <h1 className="basis-1/3 flex justify-center">{chat.person.username}</h1>
                </span>
                <div className="flex h-full flex-col justify-end">
                    <MessageList messages={chat.messages}/>
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