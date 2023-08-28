import { makeAutoObservable } from "mobx"

interface Token{
    token: string,
  }

class Socket{
    socket : WebSocket | null = null;
    token : Token | null = null;
    username : string | null = null;
    avatar : string | undefined = undefined;
    error : string = "";
    flag : boolean = false;
    reconnecting : boolean = false;

    reconnectSocket(){
        console.log("reconnecting");
        setInterval(() => {
            if(this.token && this.socket && this.socket.readyState !== WebSocket.OPEN){
                console.log("reconnecting");
                this.makeSocket();
            }
        }, 4000);
    }

    makeSocket(){
        if(this.flag && (this.socket === null || this.socket.readyState === WebSocket.CLOSED)){
            this.socket = new WebSocket(`ws://${process.env.REACT_APP_SERVER_IP}`);
            let token = this.token
            this.socket.onopen = () => {
                this.reconnecting = false;
                if(this.socket){
                    this.socket.send(JSON.stringify({
                        token,
                        method: "connection"
                    }))
                }
            }
            this.socket.onclose = () => {
                if(!this.reconnecting){
                    this.reconnecting = true;
                    this.reconnectSocket();
                }
            }
        }
    }

    setToDefault(){
        this.token = null;
        this.username = null;
        if(this.socket && (this.socket.OPEN || this.socket.CONNECTING)){
            this.socket.close()
            this.flag = false;  
        }
    }

    setFlag(flag: boolean){
        this.flag = flag;
    }

    setError(error: string){
        this.error = error;
    }

    setTocken(tocken: Token){
        this.token = tocken;
    }

    setAvatar(avatar : string){
        this.avatar = avatar;
    }

    constructor(){
        makeAutoObservable(this)
    }
}

const socket = new Socket();
export default socket;