//custom hook for fetching remote data
import {useState, useEffect} from "react";

const useFetch = (url) => {

    const [data, setData] = useState(false);

    useEffect(() => {
      const getData = async() => {
        const response = await fetch(url);
        const userData = await response.json();
        setData(userData.data);
     }
    getData();
   
   },[url]);

   return {data};

}
export default useFetch;