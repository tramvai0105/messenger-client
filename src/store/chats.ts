import { makeAutoObservable } from "mobx"
import { ChatElement } from "../utils/types";

enum Stage {Chat, List};

class Chats{
    chats : ChatElement[] = [];
    stage : Stage = Stage.List;
    selectedChat : ChatElement | null = null; 

    setChats(chats: ChatElement[]){
        this.chats = chats
    }

    setToDefault(){
        this.chats = [];
        this.stage = Stage.List;
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

    constructor(){
        makeAutoObservable(this)
    }
}

const chats = new Chats();
export default chats;