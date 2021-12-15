/*global chrome*/
import React, { useContext,  useEffect, useRef } from "react";
import { getFinalPrice } from "../hooks/helpers.js"
import { AppContext } from "../context/AppContextProvider";
import PropTypes from 'prop-types';

let scrollListener;
let scrollTarget;

const ListItems = React.forwardRef((props, ref) => {
    
    const [state, dispatch] = useContext(AppContext);
    
    const isInitialMount = useRef(true);
    //get the reffernce to resultsContainer and LoadResults component
    const { scrollRef, btnRef } = ref;


    useEffect(() => {
        // Anything in here is fired on component mount.
        if (isInitialMount.current) {
             isInitialMount.current = false;
             //add infinite scroll behavior to resultsContainer DOM element
             //load more results by triggering the click event of LoadResults button component, when scrollHeight hit the end
             scrollTarget = scrollRef.current;
             scrollListener = () => {
              let containerHeight = scrollTarget.scrollHeight;
              if( (containerHeight - scrollTarget.offsetHeight - scrollTarget.scrollTop) <= 0 ){
                if(btnRef.current !== null){
                   btnRef.current.click();
                }
              }
            }
            scrollTarget.addEventListener('scroll', scrollListener, false);
     
        } else {
           // Your useEffect code here to be run on update
           
        }
        return () => {
          // Anything in here is fired on component unmount.
          try{
            scrollTarget.removeEventListener('scroll', scrollListener, false);
          }
          catch(e){
            console.log(e.message);
          }
        }
    }, [btnRef, scrollRef])


    const saveList = (target, item) => {
        const getLists = [...state.lists];
        const savedItems = getLists.filter( list => list.pi === item.pi);
        if(savedItems.length === 0){
          item['watch'] = Date.now();
          item['updates'] = (item.d !== '' && item.d >= 50) ? false : true;
          dispatch({
              type: "ADD_LIST",
              payload: item
          });
          target.classList.add('hidden');
          target.nextSibling.classList.remove('hidden');
          getLists.push(item);
          try{
            chrome.storage.local.set({'bm_my_lists': JSON.stringify(getLists)}, function() {
                return;
            });
          }
          catch(e){
            //in development environment chrome.storage is not set
            console.log(e.message + ' ...saving in local storage!');
            localStorage.setItem("bm_my_lists", JSON.stringify(getLists));
          }
        }
        else{
          alert(props.translate('Hai gia salvato questa lista!'));
        }
    }

 

    return(
        <ul className="lists">
        {props.data.map( (item, i) => (
         <li key={i} className="flex flex-middle">
             <div>
               <p><strong>{item.pn}</strong></p>
               <p><span className={`flag-${item.iso.toLowerCase()}`}></span>{item.n} - {props.translate(item.re)}</p>
               <p>{props.translate("Anagrafiche")}: {item.i}</p>
             </div>
             <div className="list-price-holder"> 
               <span className={item.d !== '' ? 'linetrough' : ''}>
               {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(item.p)}
               </span>
               {item.d !== '' &&
                <span>{getFinalPrice(item.d, item.p)}</span>
                }
              </div>
             <div>
               
                <button onClick={(e) => saveList(e.target, item)}>{props.translate('Salva')}</button>
                
                <svg className="icn hidden">
                 <use href="#check-icon"></use>
               </svg>
               
            </div> 
          </li>
        ))}
       </ul>
    )
})

ListItems.protoTypes = {
    data: PropTypes.array.isRequired,
}

export default ListItems;