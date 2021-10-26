//custom hook for fetching remote data
import {useState, useEffect} from "react";
import WorkerSetup from "../WorkerSetup";

const useWorker = (url) => {

    const [list, setList] = useState(false);

   
    useEffect(() => {
     if(list === false){
        const WebWorker = new WorkerSetup(url);
        WebWorker.onmessage = (event) => {
            const getData = JSON.parse(event.data);
            if(getData.serverStatus === 200){
              setList(getData.serverResponse.data);
            }
            WebWorker.terminate();
        }  
     }
    },[url, list]);

   return {list};

}
export default useWorker;