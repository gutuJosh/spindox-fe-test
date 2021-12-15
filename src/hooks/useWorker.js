//custom hook for fetching remote data
import {useState, useEffect} from "react";
import WorkerSetup from "../WorkerSetup";

const useWorker = (url) => {

    const [list, setList] = useState(false);

   
    useEffect(() => {
     if(list === false){
        const WebWorker = new WorkerSetup(url);
        WebWorker.onmessage = (event) => {
            const getData = event.data;
            if(getData.serverStatus === 200){
              let obj = JSON.parse(getData.serverResponse);
              setList(obj.data);
            }
            WebWorker.terminate();
        } 
     }
    },[url, list]);

   return {list};

}
export default useWorker;