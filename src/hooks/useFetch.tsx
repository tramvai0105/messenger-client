import { useState, useEffect } from 'react'

interface Options{ 
    method?: string, 
    headers?: { Authorization: string; },
    body?: string,
}

function useFetch<Type>(url:string, {method  = "GET", token = "", _body = ""}){
    const [data, setData] = useState<Type>()
    const [refetchIndex, setRefetchIndex] = useState(0)

    const refetch = () => setRefetchIndex((prevRefetchIndex) => prevRefetchIndex + 1)

    useEffect(() => {
        const fetchData = async () => {
            var options: Options = {};
            options.method = method;
            if(token != ""){
                options.headers = {'Authorization': `Bearer ${token}`}
            }
            if(_body != ""){
                options.body = _body;
            }
            console.log(url);
            console.log(options);
            const res = await fetch(url, options);
            const body = await res.json();
            setData(body)
        }
        fetchData()
        }, [refetchIndex])
    return { data, refetch}
    }
export default useFetch