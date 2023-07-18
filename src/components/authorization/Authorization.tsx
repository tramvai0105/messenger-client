import socket from '../../store/socket';
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Logo from "./Logo";
import MenuSlider from "./MenuSlider";


function Authorization(){
    const navigate = useNavigate();

    return(
        <div className="h-full absolute flex w-full flex-col justify-center items-center">
            <Logo/>
            <div className="absolute h-[288px] w-[288px] z-10  flex justify-center items-center">
                <div className="absolute h-[455px] w-[455px] 
                 
                border-[#ffffff] border-solid border-[22px] rounded-full"></div>
                <div className="absolute h-[520px] w-[520px] 

                border-[#ffffff] border-solid border-[22px] rounded-full"></div>
                <div className="absolute h-[580px] w-[580px] 

                border-[#ffffff] border-solid border-[22px] rounded-full"></div>
                <div className="absolute h-[640px] w-[640px] 

                border-[#ffffff] border-solid border-[22px] rounded-full"></div>
            </div>
            <div className="absolute h-fit w-fit flex flex-col justify-center items-center">
                <MenuSlider/>
                {(socket.token) 
                    ?<button className="bg-[#ffffff] relative mt-2 z-10 p-2 mr-2 rounded-sm ml-4"
                    onClick={()=>navigate('../app/messenger', { replace: false })}>{"<-(To App)"}</button>
                    :<></>
                }
            </div>
        </div>
    )
}

const AuthorizationObserver = observer(Authorization);

export default AuthorizationObserver;
