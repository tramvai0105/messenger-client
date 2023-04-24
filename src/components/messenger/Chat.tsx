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
                <span className="chat-info flex flex-row items-center">
                    <button onClick={back} className="basis-1/3">Back</button>
                    <h1 className="basis-1/3 flex justify-center">{chat.person.username}</h1>
                </span>
                <MessageList messages={chat.messages}/>         
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