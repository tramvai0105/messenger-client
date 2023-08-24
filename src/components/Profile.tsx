import React, { useRef, useState } from "react";
import socket from "../store/socket";
import { observer } from "mobx-react-lite";
import { useEffect } from 'react';
import DialogueBox from "./utils/DialogueBox";
import useFetch from '../hooks/useFetch';
import { useNavigate } from "react-router-dom";
import chats from "../store/chats";


function Profile(){

    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    
    const [dialogue, setDialogue] = useState<boolean>(false)
    const [previewImg, setPreviewImg] = useState<string>("")
    
    const {data, refetch} = useFetch<{avatar: string}>(
        `http://${process.env.REACT_APP_SERVER_IP}/file/getavatar`, {token: socket.token?.token});

    async function uploadFile(){
        if(!inputRef.current?.files){
            return;
        }
        const avatar = inputRef.current?.files[0];
        var formData = new FormData();
        formData.append("avatar", avatar);
         
        let res = await fetch(`http://${process.env.REACT_APP_SERVER_IP}/file/changeavatar`, {
        method:"POST",
        headers: {
            'Authorization': `Bearer ${socket.token}`,
        },
        body: formData
        })
        let {message} = await res.json()
        setDialogue(false)
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
        const res = await fetch(`http://${process.env.REACT_APP_SERVER_IP}/file/getavatar`, {
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

    function logoff(){
        socket.setToDefault();
        chats.setToDefault();
        const localStorage = window.localStorage;
        localStorage.setItem("userData", "");
        navigate('../auth', { replace: false });
    }

    return(
        <React.Fragment>
            <div className="absolute h-[288px] w-[288px] 
            translate-x-[-80px]
            translate-y-[-80px] 
            border-white border-solid border-[16px] rounded-full"></div>
            <div className="absolute h-[248px] w-[248px] 
            translate-x-[-60px]
            translate-y-[-60px] 
            border-white border-solid border-[16px] rounded-full"></div>
            <div className="absolute h-[208px] w-[208px] 
            translate-x-[-40px]
            translate-y-[-40px] 
            border-white border-solid border-[16px] rounded-full"></div>
            <div className="absolute h-[168px] w-[168px] 
            translate-x-[-20px]
            translate-y-[-20px] 
            border-white border-solid border-[16px] rounded-full"></div>
            <div className="w-full pr-4 h-32 mb-6 bg-[#353535] rounded-r-[16px] 
            rounded-tl-[128px] rounded-bl-[128px] z-10 flex flex-row items-center relative">
                <div className="h-32 w-32 rounded-full bg-gray-400">
                    <img onClick={()=>setDialogue(true)} className=" 
                    hover:cursor-pointer object-cover w-full h-full rounded-full" 
                    src={socket.avatar} alt=""/>
                </div>
                <h1 className="text-white ml-2 mr-4 text-xl text-center">{socket.username}</h1>
                <button className="absolute z-10 left-full -translate-x-7 -translate-y-7 top-full flex justify-center" onClick={()=>logoff()}><span className="exit-button"/></button>
                <div className="absolute rounded-r-[8px] border-r-[1px] border-t-[1px] border-b-[1px]  border-white h-full w-[16px] left-full -translate-x-[16px]"/>
            </div>
            <DialogueBox set={setDialogue} display={dialogue}>
                <h1 className="mb-4">Превью: (обрезайте сами)</h1>
                <div className="h-[256px] w-[256px] rounded-full">
                    <img className="object-cover h-full w-full rounded-full mb-10" 
                        src={previewImg} alt="avatar"/>
                </div>
                <input className="hidden"
                name="avatar" 
                type="file" ref={inputRef} onChange={previewFile}
                id="img-profile"
                /> 
                <label className="mb-4 mt-4 p-1 border-black border-2 rounded-md cursor-pointer hover:bg-gray-100 " htmlFor="img-profile">Add picture...</label>
                <button onClick={uploadFile} className="border-solid border-2 border-black p-1 rounded-md hover:bg-gray-100 ">
                    Upload
                </button>    
            </DialogueBox>
        </React.Fragment>
        
    )
}

const ProfileObserver = observer(Profile);

export default ProfileObserver;
