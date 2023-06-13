import { Message, Person } from '../../utils/types';
import { useRef, useEffect, MutableRefObject} from 'react';
import Avatar from '../utils/Avatar';
import socket from '../../store/socket';
import {useState} from 'react';

interface Props{
    messages: Message[],
    person: Person,
}

function MessageList({messages, person}:Props){

    useEffect(()=>{
        window.addEventListener("click", ()=>{
            setDial(null)
        })
    }, [])

    const listRef = useRef<HTMLDivElement>(null);
    const [dial, setDial] = useState<number | null>(1);

    useEffect(()=>{
        if(listRef.current)
        listRef.current.scrollTo({top: listRef.current.scrollHeight})
    }, [messages])

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
        setDial(null)

        console.log("deleted");
    }

    return(
        <div ref={listRef} className='message-list h-full flex flex-col overflow-y-auto overflow-x-hidden m-frst-child'>
            {messages.map((message, index)=>
            <div key={index} className='relative w-fit ml-2 flex flex-col rounded-b-md rounded-tr-md border border-solid border-[#7887AB] h-auto m-1 p-1'>
                <span className='text-xs flex h-[22px]'>
                    {(message.from != socket.username)?<Avatar r={22} avatar={person.avatar}/> : <Avatar r={22} avatar={socket.avatar}/>} 
                    <span className='p-1'/> 
                    <span className='font-bold pr-2'>{message.from}</span> 
                    {formatTime(message.time)} 
                    <span className='pl-1 text-lg leading-[6px] cursor-pointer' onClick={(e)=>makeDial(e, index)}>...</span>
                    {(dial == index)
                    ?<div onClick={(e)=>e.stopPropagation()} className='absolute w-fit h-fit p-2 bg-[#FFE3AA] rounded-sm left-[122px] top-[11px] flex justify-center'>
                        <button onClick={()=>deleteMsg(message)} className='border h-6 border-black rounded-md p-1'>Delete</button>
                    </div>
                    :<></>}
                </span>
                <div className='pl-3 pr-2 text-base whitespace-pre'>
                    {JSON.parse(message.text)}
                </div>
            </div>
            )}
            <span className='pb-2'/>
        </div>
    )
}

export default MessageList;