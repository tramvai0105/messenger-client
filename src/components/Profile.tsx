import React, { useRef, useState } from "react";
import socket from "../store/socket";
import { observer } from "mobx-react-lite";
import { useEffect } from 'react';
import DialogueBox from "./utils/DialogueBox";
import useFetch from '../hooks/useFetch';


function Profile(){

    const inputRef = useRef<HTMLInputElement>(null);
    
    const [dialogue, setDialogue] = useState<boolean>(false)
    const [previewImg, setPreviewImg] = useState<string>("")
    
    const {data, refetch} = useFetch<{avatar: string}>(
        "http://localhost:5000/file/getavatar", {token: socket.token?.token});

    async function uploadFile(){
        if(!inputRef.current?.files){
            return;
        }
        const avatar = inputRef.current?.files[0];
        var formData = new FormData();
        formData.append("avatar", avatar);
         
        let res = await fetch("http://localhost:5000/file/changeavatar", {
        method:"POST",
        headers: {
            'Authorization': `Bearer ${socket.token}`,
        },
        body: formData
        })
        let {message} = await res.json()
        alert(message);
        getAvatar();
    }

    useEffect(()=>{
        if(socket.avatar){
            setPreviewImg(socket.avatar)
        }
    }, [socket.avatar])

    useEffect(()=>{
        if(socket.token){
            getAvatar();
        }
    }, [socket.token])

    async function getAvatar(){
        const res = await fetch("http://localhost:5000/file/getavatar", {
            headers: {
                'Authorization': `Bearer ${socket.token}`,
              }
        });
        const {avatar} = await res.json();
        socket.setAvatar(avatar);
    }

    function previewFile() {
        if(!inputRef.current?.files){
            return;
        }
        var file    = inputRef.current?.files[0];
        var reader  = new FileReader();
      
        reader.onloadend = function () {
            if(typeof(reader.result) === "string"){
                setPreviewImg(reader.result);
            }
        }
      
        if (file) {
          reader.readAsDataURL(file);
        }
      }

    return(
        <React.Fragment>
            <div className="absolute h-[288px] w-[288px] 
            translate-x-[-80px]
            translate-y-[-80px] 
            border-[#734C8F] border-solid border-[20px] rounded-full"></div>
            <div className="absolute h-[248px] w-[248px] 
            translate-x-[-60px]
            translate-y-[-60px] 
            border-[#D4D26A] border-solid border-[20px] rounded-full"></div>
            <div className="absolute h-[208px] w-[208px] 
            translate-x-[-40px]
            translate-y-[-40px] 
            border-[#734C8F] border-solid border-[20px] rounded-full"></div>
            <div className="absolute h-[168px] w-[168px] 
            translate-x-[-20px]
            translate-y-[-20px] 
            border-[#D4D26A] border-solid border-[20px] rounded-full"></div>
            <div className="w-full h-32 mb-6 bg-[#3A1356] 
            rounded-tl-[128px] rounded-bl-[128px] z-10 flex flex-row items-center">
                <div className="h-32 w-32 rounded-full bg-green-400">
                    <img onClick={()=>setDialogue(true)} className=" 
                    hover:cursor-pointer object-cover w-full h-full rounded-full" 
                    src={socket.avatar} alt="avatar"/>
                </div>
                <h1 className="text-white ml-2 mr-4 text-xl text-center">{socket.username}</h1>
            </div>
            <DialogueBox set={setDialogue} display={dialogue}>
                <h1 className="mb-4">Превью: (обрезайте сами)</h1>
                <div className="h-[256px] w-[256px] rounded-full">
                    <img className="object-cover h-full w-full rounded-full mb-10" 
                        src={previewImg} alt="avatar"/>
                </div>
                <input className="mb-4 mt-4"
                name="avatar" 
                type="file" ref={inputRef} onChange={previewFile}/> 
                <button onClick={uploadFile} className="border-solid border-2 border-black p-1 rounded-md">
                    Загрузить
                </button>    
            </DialogueBox>
        </React.Fragment>
        
    )
}

const ProfileObserver = observer(Profile);

export default ProfileObserver;
