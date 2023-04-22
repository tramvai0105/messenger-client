import { makeAutoObservable } from "mobx"

interface Token{
    token: string,
  }

class Socket{
    socket : WebSocket | null = null;
    token : Token | null = null;
    username : string | null = null;

    makeSocket(){
        if(this.socket === null || this.socket.readyState === WebSocket.CLOSED){
        this.socket = new WebSocket("ws://localhost:5000");
        let token = this.token
        this.socket.onopen = () => {
            if(this.socket){
                this.socket.send(JSON.stringify({
                    token,
                    method: "connection"
                  }))
            }
          }
        }
    }

    setToDefault(){
        this.token = null;
        this.username = null;
        if(this.socket && (this.socket.OPEN || this.socket.CONNECTING)){
            this.socket.close()  
        }
    }

    setTocken(tocken: Token){
        this.token = tocken
    }

    constructor(){
        makeAutoObservable(this)
    }
}

const socket = new Socket();
export default socket;