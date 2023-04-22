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

const messengerUtils = {
    getMessagesForUser: getMessagesForUser,
};

export default messengerUtils;
