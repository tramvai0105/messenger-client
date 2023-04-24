import { Message } from '../../utils/types';
import { useRef, useEffect, MutableRefObject} from 'react';

interface Props{
    messages: Message[];
}

function MessageList({messages}:Props){

    const listRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        if(listRef.current)
        listRef.current.scrollTo({top: listRef.current.scrollHeight})
    }, [messages])

    function format_time(s:number) {
        return new Date(s + 10800000).toISOString().slice(-13, -8);
      }

    return(
        <div ref={listRef} className='message-list h-auto overflow-scroll overflow-x-hidden'>
            {messages.map((message, index)=>
            <div key={index} className='w-3/4 ml-2 flex flex-col rounded-b-md rounded-tr-md border border-solid border-sky-500 h-auto m-1 p-1'>
                <span className='text-xs flex'>
                    {message.from} {format_time(message.time)}</span>
                <div className='pl-2'>
                    {message.text}
                </div>
            </div>
            )}
        </div>
    )
}

export default MessageList;