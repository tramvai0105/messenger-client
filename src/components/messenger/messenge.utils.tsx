import socket from "../../store/socket";
import { Message } from "../../utils/types";

function getMessagesForUser(username:string, msgs: Message[]){
    let sortedMsgs: Message[] = []
    msgs.forEach((msg, index)=>{
        if(msg.from === username || msg.to === username){
            sortedMsgs.push(msg)
        }
    })
    sortedMsgs = sortedMsgs.sort(function(a,b){
        return a.time - b.time;
    })
    return sortedMsgs;
}

async function getAvatars(users: string[]){
    const res = await fetch("http://localhost:5000/file/getavatars", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${socket.token}`,
          },
        body: JSON.stringify({users: users}),
    });
    const {avatars} = await res.json();
    return new Map<string, string>(avatars);
}

const messengerUtils = {
    getMessagesForUser: getMessagesForUser,
    getAvatars: getAvatars,
};

export default messengerUtils;
