import Login from "./Login";
import Registration from "./Registration";

function Authorization(){
    return(
        <div className="ml-20 flex flex-row">
            <Login/> 
            <Registration/>
        </div>
    )
}

export default Authorization;