import React, { useRef, useState } from "react";
import socket from "../store/socket";
import { observer } from "mobx-react-lite";
import { useEffect } from 'react';
import DialogueBox from "./utils/DialogueBox";
import useFetch from '../hooks/useFetch';
import { useNavigate } from "react-router-dom";
import chats from "../store/chats";

interface Pass{
    password: string,
    checked: boolean,
}

function Profile(){

    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    
    const [avatarDialogue, setAvatarDialogue] = useState<boolean>(false)
    const [optionDialogue, setOptionDialogue] = useState<boolean>(false)
    const [previewImg, setPreviewImg] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [nickname, setNickname] = useState<string>("")
    const [password, setPassword] = useState<Pass>({password: "", checked: false})
    const checkBoxRef = useRef<HTMLInputElement>(null)
    
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
        setAvatarDialogue(false)
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

    async function changeLogin(){
        const res = await fetch(`http://${process.env.REACT_APP_SERVER_IP}/auth/changelogin`, {
            method:"POST",
            headers: {
                'Authorization': `Bearer ${socket.token}`,
                'Content-Type': 'application/json;charset=utf-8',
              },
            body: JSON.stringify({username: nickname}),
        });
        let {message} = await res.json()
        if(res.status == 200){
            const userData = window.localStorage.getItem("userData")
            if(userData){
                let {token} = JSON.parse(userData)
                const localStorage = window.localStorage
                localStorage.setItem("userData", JSON.stringify({username: nickname, token: token}))
            }
            window.location.reload()
        }else{
            setError(message);
            setTimeout(()=>{setError("")}, 2000)
        }
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
                    <img onClick={()=>setAvatarDialogue(true)} className=" 
                    hover:cursor-pointer object-cover w-full h-full rounded-full" 
                    src={socket.avatar} alt=""/>
                </div>
                <h1 className="text-white ml-2 mr-4 text-xl text-center">{socket.username}</h1>
                <button className="absolute z-10 left-full -translate-x-7 -translate-y-7 top-full flex justify-center" onClick={()=>logoff()}><span className="exit-button"/></button>
                <button className="absolute z-10 left-full -translate-x-7 -translate-y-7 bottom-[55%] flex justify-center" onClick={()=>setOptionDialogue(true)}><span className="option-button"/></button>
                <div className="absolute rounded-r-[8px] border-r-[1px] border-t-[1px] border-b-[1px]  border-white h-full w-[16px] left-full -translate-x-[16px]"/>
            </div>

            {/* Options dialogue box. Why so much shit in this component? Because i want to. */}
            <DialogueBox set={setOptionDialogue} display={optionDialogue}>
                {(error)
                ?<span className="p-4 bg-red-300">{error}</span>
                :<>
                <h1 className="noselect text-lg">Options</h1>
                <span className="h-[1px] w-[95%] border border-black"></span>
                <span className="mt-4">Change nickname</span>
                <input value={nickname} onChange={(e)=>setNickname(e.target.value)} type="text" className="border border-black rounded-md pl-1"/>
                <button onClick={changeLogin} className="bg-gray-100 hover:bg-gray-300 my-2 h-[30px] p-1 border border-gray-300">Send</button>
                <span className="h-[1px] w-[95%] border border-black"></span>
                <span className="mt-4">Change password</span>
                <input type="text" className="border border-black rounded-md pl-1"/>
                <div className="w-full flex justify-center p-1 mt-1 rounded-md">
                    <input ref={checkBoxRef} onChange={(e)=>setPassword({...password, checked: e.target.checked})} type="checkbox"/>
                    <span className="ml-3 noselect">I'm not dumb</span>
                </div>
                <button className="bg-gray-100 hover:bg-gray-300 mb-2 h-[30px] p-1 border border-gray-300">Send</button>
                <span className="h-[1px] w-[95%] border border-black"></span>
                </>}
            </DialogueBox>
            
            {/* Profile pic dialogue box */}
            <DialogueBox set={setAvatarDialogue} display={avatarDialogue}>
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
                <label className="bg-gray-100 hover:bg-gray-300 my-3 h-[30px] p-1 cursor-pointer border border-gray-300" htmlFor="img-profile">Add picture...</label>
                <button onClick={uploadFile} className="bg-gray-100 hover:bg-gray-300 my-3 h-[30px] p-1 border border-gray-300">
                    Upload
                </button>    
            </DialogueBox>
        
        </React.Fragment>
        
    )
}

const ProfileObserver = observer(Profile);

export default ProfileObserver;
