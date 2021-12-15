/*global chrome*/
import {useState, useEffect} from "react";

const useStore = () => {

    const [info, setInfo] = useState(false);

    useEffect( () => {

            const getInfo = () => new Promise( (resolve, reject) => {
                try{
                    chrome.storage.local.get(['bm_lang'], function(result) {
                            if(result.bm_lang){
                              resolve(result.bm_lang); 
                            }
                            else{
                              reject('Eror retriving bm_lang');
                            }
                            
                    });
                }
                catch(e){

                      if(localStorage.getItem('bm_lang') !== null){
                        resolve(localStorage.getItem('bm_lang'));
                      }
                      else{
                        resolve(navigator.language.split('-')[0]);
                      }  
                }
            }); 

            const extractInfo = async () => {
                const data = await getInfo();
                alert(data);
                console.log(data);
                setInfo(data);
            }

            extractInfo();
   
   },[]);
   
   return { info };

}
export default useStore;