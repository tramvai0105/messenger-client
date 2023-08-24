
interface Props{
    onClick: () => void,
    children: string,
}

function FActButton({onClick , children}: Props){

    function action(){
        onClick()
    }

    return(
        <button onClick={action} className="bg-white hover:bg-gray-200 ml-2 h-[30px] border-b-[2px] p-1 border-black">
            {children}
        </button>
    )
}

export default FActButton;