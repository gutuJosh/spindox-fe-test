/*global chrome*/
import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContextProvider";

const Header= (props) => {

  const [ state, dispatch ] = useContext(AppContext);

  const switchView = (target, value) => {
        target.preventDefault(); 
        props.setPage(value); 
  }

  useEffect( () => { 
     
    if(state.lists.length === 0){//update state
     
        const getStorage = () => new Promise( (resolve, reject) => {
          try{
              chrome.storage.local.get(['bm_my_lists'], function(result) {
                      if(result.bm_my_lists){
                        resolve(result.bm_my_lists); 
                      }
                      else{
                        reject('Eror retriving bm_my_lists from chrome.storage');
                      }
                      
              });
          }
          catch(e){
            if(localStorage.getItem('bm_my_lists') !== null){
               resolve(localStorage.getItem('bm_my_lists')); 
            }
          }
      });
       const extractFromStorage = async () => {
        const data = await getStorage();
        if(data !== null){
            const storedLists = JSON.parse(data);
            storedLists.forEach(item => {
                dispatch({
                  type: "ADD_LIST",
                  payload: item
                });
            });
          }
       }

       extractFromStorage();
    }
      
  },[state, dispatch])

 
    return(
        <header>
        <nav>
         <ul className="flex flex-middle">
           <li className="flex-item">
             <img src="https://www.bancomail.it/images/bancomail-rm-logo.png" className="logo" alt=""/>
           </li>
           <li className="flex flex-middle flex-item">
             <a href="/" onClick={(e)=> switchView(e, 'search')}>
               <svg className="icn">
                <use href="#search-icon"></use>
               </svg>
               <span>{props.translate("Cerca")}</span>
             </a>
             <a href="/" onClick={(e) => switchView(e, 'mylists')}>
               {state.lists.length > 0 &&
                <small>{state.lists.length}</small>
               }
               <svg className="icn">
                <use href="#folder-open-icon"></use>
               </svg>
               <span>{props.translate("Le mie liste")}</span>
             </a>
           </li>
         </ul>
        </nav>
       </header>
    );
}



export default Header;