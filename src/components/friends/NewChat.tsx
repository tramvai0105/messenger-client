import { useNavigate } from "react-router-dom";
import chats from "../../store/chats";
import { ChatElement } from '../../utils/types';

interface Props{
    username: string,
}

function NewChat({username}: Props){

    const navigate = useNavigate()

    function makeChat(){
        const chat : ChatElement = {
            person :{
                username: username
            },
            messages: [],
        } 
        chats.addChat(chat)
        chats.setSelectedChat(chats.chats.length - 1)
        chats.setStage("chat");
        navigate("/messenger", { replace: false })
    }

    return(
        <button onClick={makeChat} className="border p-1 border-solid border-gray-700">
            Chat
        </button>
    )
}

export default NewChat;