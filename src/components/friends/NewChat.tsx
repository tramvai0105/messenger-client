import { useNavigate } from "react-router-dom";
import chats from "../../store/chats";
import { ChatElement } from '../../utils/types';
import messengerUtils from "../messenger/messenge.utils";
import FActButton from "./FriendsActionButton";

interface Props{
    username: string,
}

function NewChat({username}: Props){

    const navigate = useNavigate()

    async function setChat(){
        for(let i = 0; i < chats.chats.length; i++){
            if(chats.chats[i].person.username == username){
                chats.setSelectedChat(chats.chats[i]._id)
                chats.setStage("chat");
                navigate("/app/messenger", { replace: false })
                return
            }
        }
        makeChat()
    }

    async function makeChat(){
        let avatars = await messengerUtils.getAvatars([username]);
        let avatar = avatars.get(username)
        if(typeof avatar != "undefined"){
        const chat : ChatElement = {
            _id: chats.getIndex(),
            person :{
                username: username,
                avatar: avatar,
            },
            messages: [],
        } 
        chats.addChat(chat)
        chats.setSelectedChat(chats.chats.length - 1)
        chats.setStage("chat");
        navigate("/app/messenger", { replace: false })}
    }

    return(
        <FActButton onClick={setChat}>Chat</FActButton>
    )
}

export default NewChat;