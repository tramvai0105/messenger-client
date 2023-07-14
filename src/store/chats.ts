import { makeAutoObservable } from "mobx"
import { ChatElement, MessageFromSocket } from "../utils/types";

enum Stage {Chat, List};

class Chats{
    chats : ChatElement[] = [];
    queryMsg : number | null = null;
    stage : Stage = Stage.List;
    selectedChat : ChatElement | null = null; 

    setChats(chats: ChatElement[]){
        this.chats = chats
    }

    setToDefault(){
        this.chats = [];
        this.stage = Stage.List;
    }

    setQueryMsg(index: number | null){
        this.queryMsg = index;
    }

    getUsers(){
        return this.chats.map((chat)=> chat.person.username)
    }

    setSelectedChat(index: number){
        this.selectedChat = this.chats[index];
    }

    setStage(_stage: string){
        switch(_stage){
            case("chat"):
                this.stage = Stage.Chat
                break;  
            case("list"):
                this.stage = Stage.List
                break; 
        }
    }
    
    addChat(chat: ChatElement){
        if(!this.getUsers().includes(chat.person.username))
        this.chats.push(chat)
    }

    deleteMessage(person: string, _id: string){
        let chats = this.chats;
        for(let i = 0; i < chats.length; i++){
            console.log(chats[i].person.username, person);
            if(chats[i].person.username == person){
                console.log(chats[i].messages, _id);
                chats[i].messages = chats[i].messages.filter(msg => msg._id != _id)
            }
        }
        this.chats = chats;
    }

    constructor(){
        makeAutoObservable(this)
    }
}

const chats = new Chats();
export default chats;