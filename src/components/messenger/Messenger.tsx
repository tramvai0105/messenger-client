import { ChatElement, Message, MessageFromSocket, Person } from '../../utils/types';
import Chat from "./Chat";
import ChatList from "./ChatList";
import { useEffect, useState, useRef } from 'react';
import { observer } from "mobx-react-lite"
import socket from "../../store/socket";
import chats from '../../store/chats';
import messengerUtils from './messenge.utils';

// interface LoginData{
//     username: string,
//     password: string,
// }

// interface Token{
//     token: string,
// }

function Messenger(){

    enum Stage {Chat, List};

    function initializeChat(msgs : Message[]){
        chats.setStage("list");
        let persons: Set<string> = new Set();
        for(let i = 0; i < msgs.length; i++){
            if(!persons.has(msgs[i].from)){
                persons.add(msgs[i].from)
            }
            if(!persons.has(msgs[i].to)){
                persons.add(msgs[i].to)
            }
        }
        if(socket.username){
            persons.delete(socket.username);
        }
        let personsArr = Array.from(persons)
        let _chats: ChatElement[] = [];
        personsArr.forEach((person)=>{
            let chat : ChatElement = {
                person: {
                    username: person,
                },
                messages: messengerUtils.getMessagesForUser(person, msgs),
            }
            _chats.push(chat);
        })
        chats.setChats(_chats);
    }

    function backToList(){
        chats.setStage("list");
    }

    useEffect(()=>{
        if(socket.token){
            handleConnection()
        }
    }, [socket.token])

    function handleConnection(){
        socket.makeSocket()
        if(socket.socket){
            socket.socket.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            switch(msg.method){
                case "connection":
                    console.log("Connected", msg);
                    initializeChat(msg.msgsData);
                    break;
                case "message":
                    console.log(msg);
                    saveMessage(msg);
                    break;
                }
            }
            socket.socket.onclose = () => {
                console.log("CLOSED");        
            }
        }   
    }

    const updateChat = (msg: Message, person: string) => {
        if(!chats.getUsers().includes(person)){
            chats.addChat({
                person: {
                    username: person
                },
                messages: [msg]
            })
            return;
        }
        chats.setChats(chats.chats.map((chat)=>{
            if(chat.person.username == person){
                chat.messages = [...chat.messages, msg];
                return chat
            } else {
                return chat
            }
        }))
    }

    const saveMessage = (msg:MessageFromSocket)=>{
        const message: Message = {
            time: msg.time,
            text: msg.text,
            from: msg.username,
            to: msg.to,
        }
        if(socket.username != msg.username){
            updateChat(message, msg.username)
        }
        if(socket.username != msg.to){
            updateChat(message, msg.to)
        }
    }

    function selectChat(index:number){
        chats.setSelectedChat(index);
        chats.setStage("chat");
    }

    // function parseMessages(msg:any){
    //     let data = msg.data;
    //     let chat:ChatElement = {
    //         person: {
    //             id:data.id,
    //             name:data.name,
    //             lastname:data.lastname,
    //         },
    //         messages: data.messages,
    //     }
    //     setChats([...chats, chat])
    // }

    return(
        <div className="flex flex-cols basis-1/3">
            <div className="messenger border border-solid">  
            {(chats.stage == Stage.List) ? <ChatList select={selectChat} chats={chats.chats}/> : <></>}
            {(chats.stage == Stage.Chat) ? <Chat back={backToList} chat={chats.selectedChat}/> : <></>}
            </div>
        </div>
        
    )  
}

const MessengerObserver = observer(Messenger);

export default MessengerObserver;