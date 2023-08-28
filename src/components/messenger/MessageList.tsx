import { Message, Person } from '../../utils/types';
import { useRef, useEffect, memo} from 'react';
import Avatar from '../utils/Avatar';
import socket from '../../store/socket';
import {useState} from 'react';
import chats from '../../store/chats';
import DialogueBox from '../utils/DialogueBox';
import { observer } from "mobx-react-lite"

interface Props{
    messages: Message[],
    person: Person,
}

interface MessageBodyProps{
    message: Message,
    scroll: ()=>void,
}

const MessageBody = memo(({message, scroll}: MessageBodyProps) => {
    const [dialogue, setDialogue] = useState<boolean>(false)

    switch (message.type) {
        case "text":
            return(<div className='pl-3 pr-2 text-base whitespace-pre'>
                {JSON.parse(message.body)}
            </div>)
            break;
        case "img":
            return(<div className='pl-3 flex flex-col pr-2 text-base whitespace-pre'>
            <span className='pt-1'></span>
                <DialogueBox display={dialogue} set={setDialogue}>
                    <img className='w w-auto max-h-[500px]' src={JSON.parse(message.body)}/>
                </DialogueBox>
                <img alt='failed' onLoad={()=>scroll()} onClick={()=>setDialogue(true)} className='w max-w-[270px] h-auto cursor-pointer' src={JSON.parse(message.body)}/>
            </div>)
            break;
        default:
            return(<></>)
            break;
    }
})

const MessageList = ({messages, person}:Props) => {
    
    const listRef = useRef<HTMLDivElement>(null);
    const [dial, setDial] = useState<number | null>(1);
    const linkRef = useRef<HTMLDivElement | null>(null)

    useEffect(()=>{
        scroll()
    }, [messages])

    function scroll(){
        if(listRef.current && linkRef.current == null)
        {
            listRef.current.scrollTo({top: listRef.current.scrollHeight})
        }
    }

    useEffect(()=>{
        if(chats.queryMsg != null && linkRef.current){
            console.log(1);
            console.log(linkRef);
            let offset = linkRef.current.offsetTop - 70;
            listRef.current?.scrollTo({top: offset})
            linkRef.current.classList.add("border-gray-500", "border-[2px]")
            setTimeout(() => {
                linkRef.current?.classList.remove("border-gray-500", "border-[2px]")
                linkRef.current = null
            }, 500);
        }
        window.addEventListener("click", ()=>{
            setDial(null)
        })
        return(
            window.removeEventListener("click", ()=>{
                setDial(null)
            })
        )
    }, [])

    function formatTime(s:number) {
        return new Date(s + 10800000).toISOString().slice(-13, -8);
      }

    function makeDial(e: React.MouseEvent<HTMLSpanElement, MouseEvent>, index : number){
        e.stopPropagation()
        if(dial == null){
            setDial(index)
        }else if(dial == index){
            setDial(null)
        }else if(dial != index){
            setDial(index)
        }
    }

    function deleteMsg(msg: Message){
        console.log(msg);
        if(socket.socket){
            let token = socket.token;
            socket.socket.send(JSON.stringify({
                token,
                method: "delete",
                _id: msg._id,
                from: msg.from,
                to: msg.to,
              }))
        }
        setDial(null)
    }

    return(
        <div ref={listRef} className='message-list ml-4 h-full flex flex-col 
        overflow-y-auto overflow-x-hidden
        scrollbar-thin scrollbar-thumb-[#353535]
        m-frst-child bg-[#D9D9D9]'>
            <div className="pt-1"></div>
            {messages.map((message, index)=>
            <div key={index} ref={(chats.queryMsg != null && chats.queryMsg == index) ? linkRef : null} className='relative w-fit ml-2 flex flex-col rounded-b-md rounded-tr-md border border-solid bg-white h-auto m-1 p-1'>
                <div className='flex justify-between'>
                    <div className='text-xs flex h-[22px]'>
                        {(message.from != socket.username)?<Avatar r={22} avatar={person.avatar}/> : <Avatar r={22} avatar={socket.avatar}/>} 
                        <span className='p-1'/> 
                        <span className='font-bold pr-8'>{message.from}</span>
                    </div>
                    <div className='text-xs flex h-[22px]'>
                        {(message.mark) ? <h1>Sending...</h1> : <></>}
                        {formatTime(message.time)} 
                        <span className='pl-1 text-lg leading-[6px] cursor-pointer' onClick={(e)=>makeDial(e, index)}>...</span>
                        {(dial == index)
                        ?<div onClick={(e)=>e.stopPropagation()} className='absolute w-fit h-fit p-2 bg-[#3C6E71] rounded-sm right-[10px] top-[12px] translate-x-full flex justify-center'>
                            {(message.from == socket.username && !message.mark) ? <button onClick={()=>deleteMsg(message)} className='border h-6 border-black rounded-md p-1 bg-gray-100'>Delete</button> : <></>}
                        </div>
                        :<></>}
                    </div>
                </div>
                <MessageBody scroll={scroll} message={message}/>
            </div>
            )}
            <span className='pb-2'/>
        </div>
    )
}

const MessageListObserver = observer(MessageList);

export default MessageListObserver;