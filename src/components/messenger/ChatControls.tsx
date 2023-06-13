import {ChangeEvent, useRef, useState} from 'react';

interface Props{
    submit: (msg:string)=>void,
}

function ChatControls({submit}:Props){

    const [msgInput, setMsgInput] = useState<string>("");
    const inputRef = useRef<HTMLTextAreaElement>(null)

    function controlInput(e:ChangeEvent<HTMLTextAreaElement>){     
        if(inputRef.current){
            inputRef.current.style.height = "0px";
            let height = inputRef.current.scrollHeight;
            if(height < 200){
                inputRef.current.style.height = `${height}px`;
            } else {
                inputRef.current.style.height = "200px";
            }
        }
        setMsgInput(e.target.value)
    }

    function send(msg:string){
        if(msg == "" || msg == " "){
            return;
        }
        let msgs = msg.split(" ");
        let count = 0;
        let text = "";
        for(let i = 0; i < msgs.length; i++){
            if(msgs[i].length > 51){
                let regex = msgs[i].match(/.{1,52}/g)
                if(regex){
                msgs.splice(i, 1, ...regex)}
            }
            count += msgs[i].length;
            if(count <= 52){
                text += msgs[i] + ' '
                count += 1
            }else{
                text += "\n"
                text += msgs[i] + ' '
                count = 0
                count += 1
                count += msgs[i].length
            }
        }
        msg = JSON.stringify(text)
        setMsgInput("");
        console.log(msg);
        if(msg !== ""){
            submit(msg);
        }
        if(inputRef.current){
            inputRef.current.style.height = "40px";
        }
    }

    return(
        <div className="chat-controls bg-[#D4B16A] 
         flex flex-row p-3 border-solid border rounded-b-xl h-fit">
            <textarea ref={inputRef} style={{height:`40px`}}
            value={msgInput} onChange={(e)=>controlInput(e)} 
            className='chat-input overflow-y-hidden p-2 rounded-md'/>
            <button className="h-[40px] w-[40px] flex justify-center items-center" onClick={()=>send(msgInput)}><span className="send-button"/></button>
        </div>        
    )
}

export default ChatControls;