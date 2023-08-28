import { ChangeEvent, useRef, useState, useEffect } from 'react';
import chats from '../../store/chats';
import useDebounce from '../../hooks/useDebounce';

interface Props{
    id: number,
    input?: string,
    chatRef: React.RefObject<HTMLDivElement>,
    submit: (msg:string, id: number, type?: string, )=>void,
}

function ChatControls({submit, chatRef, id, input}:Props){

    const [debouncedMsgInput, msgInput, setMsgInput] = useDebounce<string>("", 700);
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const counter = useRef<number>(0)

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImg, setPreviewImg] = useState<string>("")

    useEffect(()=>{
        if(chatRef.current){
            chatRef.current.addEventListener("dragenter", (e) => {
                counter.current += 1;
                showDrop()})
            chatRef.current.addEventListener("dragleave", (e)=> {
                counter.current -= 1;
                if(counter.current == 0){hideDrop()}
            })
            if(input){
                setMsgInput(input)
            }
        }
    },[])

    useEffect(() => {
      if(!previewImg){
        chats.setChatInput(id, debouncedMsgInput);
      }
    }, [debouncedMsgInput])
    

    function showDrop(){
        if(inputRef.current){
            inputRef.current.style.height = "182px"
            inputRef.current.placeholder = "Drop file here!"
            inputRef.current.classList.add("bg-[#303030]")
        }
    }

    function hideDrop(){
        if(inputRef.current){
            inputRef.current.style.height = "40px"
            inputRef.current.placeholder = "Write a message..."
            inputRef.current.classList.remove("bg-[#303030]")
        }
    }

    function controlInput(e:ChangeEvent<HTMLTextAreaElement>){     
        if(inputRef.current && !previewImg){
            inputRef.current.style.height = "0px";
            let height = inputRef.current.scrollHeight;
            if(height < 200){
                inputRef.current.style.height = `${height}px`;
            } else {
                inputRef.current.style.height = "200px";
            }
        }
        if(!previewImg){
            setMsgInput(e.target.value)
        }
    }

    function removeFile(){
        if(fileInputRef.current && inputRef.current){
            fileInputRef.current.files = null;
            setPreviewImg("")
            inputRef.current.style.height = "40px";
            inputRef.current.placeholder = "Write a message..."
            inputRef.current.classList.remove("bg-[#303030]")
        }
    }

    function dropHandler(e: React.DragEvent){
        e.preventDefault()
        if(e.dataTransfer.files && fileInputRef.current){
            if(fileInputRef.current.files && inputRef.current){
                inputRef.current.style.height = "40px"
                inputRef.current.placeholder = "Write a message..."
                inputRef.current.classList.remove("bg-[#303030]")
                fileInputRef.current.files = e.dataTransfer.files;
                previewFile()
            }
        }
    }

    function previewFile(){
        if(!fileInputRef.current?.files){
            return;
        }
        var file    = fileInputRef.current?.files[0];
        var reader  = new FileReader();
      
        reader.onloadend = function () {
            if(typeof(reader.result) === "string"){
                setPreviewImg(reader.result);
            }
        }
      
        if (file) {
          reader.readAsDataURL(file);
        }
        if(inputRef.current){
            setMsgInput("")
            inputRef.current.style.height = "182px"
            inputRef.current.placeholder = "File is ready to send"
            inputRef.current.classList.add("bg-[#303030]")
            counter.current = 0;
        }
      }

    async function sendFile(){
        if(!fileInputRef.current?.files){
            return;
        }
        const file = fileInputRef.current?.files[0];
        if(!['image/jpeg','image/png','image/svg+xml'].includes(file.type)){
            removeFile()
            return;
        }
        var reader = new FileReader();
        
        reader.onload = function () {
            if(typeof(reader.result) === "string"){
                submit(reader.result, id, "img")
            }
        }
        reader.readAsDataURL(file);

        removeFile()
    }

    function send(){
        if(!previewImg){
            sendText()
        } else {
            sendFile()
        }
    }

    function sendText(){
        let msg = msgInput;
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
        submit(msg, id);
        if(inputRef.current){
            inputRef.current.style.height = "40px";
        }
    }

    return(
        <div className="relative chat-controls bg-[#3C6E71] 
         flex flex-row items-end p-1 border-solid border rounded-b-xl h-fit">
            <input className="hidden"
                ref={fileInputRef}
                onChange={previewFile}
                id="img-input" 
                type="file"/> 
            <label className='text-xl h-[40px] w-[30px] flex justify-center items-center mr-1' htmlFor="img-input" onDrop={(e)=>dropHandler(e)}><span className='loadimg-button'/></label>
            <textarea placeholder='Write a message...' ref={inputRef} style={{height:`40px`}}
            value={msgInput} onChange={(e)=>controlInput(e)} 
            className='chat-input overflow-y-hidden p-2 rounded-md'
            onDrop={(e)=>dropHandler(e)}
            />
            {(previewImg)?
            <>
            <img className="absolute border-[2px] object-cover h-[179px] w-[170px] translate-x-[34px] translate-y-[39px] rounded-md mb-10"     
                src={previewImg}/>
            <button onClick={()=>removeFile()} className='absolute left-[212px] bottom-[160px] text-gray-400'>X</button>
            </>       
            :<></>}
            <button className="h-[40px] w-[40px] flex justify-center items-center" onClick={()=>send()}><span className="send-button"/></button>
        </div>        
    )
}

export default ChatControls;